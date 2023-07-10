/**
 * Copyright (c) 2020 SNANG
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * SNANG website: https://www.snang.cc
 */

const http = require('http');
const fs = require('fs');
const url = require('url');
const nodePath = require('path');
const querystring = require('querystring');
/**
 * 需要：
 * req.url
 * req.prefix
 * req.headers
 * 
 * 附加：
 * res.setHeader
 * res.statusCode
 * res.isPipeStrat
 */
function static(path) {
    let getStat = function (path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(stats);
                }
            })
        })
    }
    return async function (req, res, next) {
        let pathname = decodeURI(url.parse(req.url).pathname);
        let fsPath = nodePath.join(path, pathname.substr(req.prefix.length));
        //console.log(pathname, fsPath);
        let stats = await getStat(fsPath);
        if (!stats || !stats.isFile()) {
            next();
        } else {
            let lastModified = stats.mtime.toUTCString();
            let ifModifiedSince = req.headers['if-modified-since'];
            let maxAgeTime = 3; //设置超时时间
            if (ifModifiedSince && lastModified == ifModifiedSince) {
                res.writeHead(304, "Not Modified");
                res.end();
            } else {
                let cache = false;
                switch (nodePath.parse(fsPath).ext) {
                    case '.htm':
                    case '.html':
                        res.setHeader('Content-type', 'text/html; charset=utf-8');
                        cache = true;
                        break;
                    case '.css':
                        res.setHeader('Content-type', 'text/css');
                        cache = true;
                        break;
                    case '.js':
                        res.setHeader('Content-type', 'text/javascript');
                        cache = true;
                        break;
                    case '.jpg':
                        res.setHeader('Content-type', 'image/jpeg');
                        cache = true;
                        break;
                    case '.png':
                        res.setHeader('Content-type', 'image/png');
                        cache = true;
                        break;
                    case '.txt':
                        res.setHeader('Content-type', 'text/plain');
                        cache = true;
                        break;
                    case '.mp3':
                        res.setHeader('Content-type', 'audio/mpeg');
                        cache = true;
                        break;
                    case '.json':
                        res.setHeader('Content-type', 'application/json');
                        cache = true;
                        break;
                    case '.xml':
                        res.setHeader('Content-type', 'text/xml');
                        cache = true;
                        break;
                    case '.svg':
                        res.setHeader('Content-type', 'image/svg+xml');
                        res.setHeader('Vary', 'Accept-Encoding');
                        cache = true;
                        break;
                    case '.ico':
                        res.setHeader('Content-type', 'image/x-icon');
                        cache = true;
                        break;
                    case '.webmanifest':
                        res.setHeader('Content-type', 'application/manifest+json; charset=utf-8');
                        cache = true;
                        break;
                    default:
                        res.setHeader('Content-type', 'application/octet-stream');
                        res.setHeader('Content-Disposition', 'attachment; filename="' + encodeURI(fsPath.replace(/^.*\//, '')) + '"');
                }
                if (cache) {
                    res.writeHead(200, {
                        "Cache-Control": 'max-age=' + maxAgeTime,
                        "Last-Modified": lastModified
                    });
                } else {
                    res.writeHead(200);
                }
                res.isPipeStrat = true;
                fs.createReadStream(fsPath).pipe(res);
            }
        }
    }
}
/**
 * 断点续传发文件
 * 
 * 需要：
 * path 文件路径
 * req.url
 * req.headers['range']
 * 
 * 附加：
 * res.setHeader
 * res.statusCode
 * res.isPipeStrat
 */
function sendFile(path, filename) {
    let getStat = function (path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(stats);
                }
            })
        })
    }
    return async function (req, res, next) {
        let stats = await getStat(path);
        if (!stats || !stats.isFile()) {
            next();
        } else {
            filename = filename ? encodeURI(filename) : url.parse(req.url).pathname.replace(/^.*\//, '');
            let lastModified = stats.mtime.toUTCString();
            let start = 0;
            let end = stats.size - 1;
            let range = req.headers['range'];
            if (range) {
                res.statusCode = 206;
                let result = range.match(/bytes=(\d*)-(\d*)/);
                if (result) {
                    if (result[1] && !isNaN(result[1])) start = parseInt(result[1]);
                    if (result[2] && !isNaN(result[2])) end = parseInt(result[2]) - 1;
                    //console.log(req.headers, start, end, result)
                }
            }
            res.setHeader('Accept-Range', 'bytes');
            res.setHeader('Content-type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
            res.setHeader('Content-Length', end - start + 1);
            res.setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + stats.size);
            res.setHeader("Last-Modified", lastModified);
            res.isPipeStrat = true;
            fs.createReadStream(path, {
                start, end
            }).pipe(res);
        }
    }
}
function getParser() {
    return function (req, res, next) {
        req.GET = querystring.parse(req.url.substr(req.url.indexOf('?') + 1));
        next();
    };
}
function cookieParser() {
    return function (req, res, next) {
        req.COOKIE = querystring.parse(req.headers.cookie);
        next();
    };
}
Buffer.prototype.split=Buffer.prototype.split || function (spl) {//spl表示分隔符
    let arr=[];//定义数组接收分隔出来的内容
    let cur=0;//表示当前遍历的位置
    let n=0;//用来接收spl分隔符索引到的位置
    while((n=this.indexOf(spl,cur))!=-1){
    //如果索引值存在，即不为-1, 同时将索引到的位置赋值给n。
        arr.push(this.slice(cur,n));//切割从当前位置到索引位置，再将该段字符串存到数组中
        cur=n+spl.length;//当前位置向后进行遍历，寻找下一个分隔符
    }
    arr.push(this.slice(cur));
    return arr;
}
function bodyParser(upload) {
    let uid = 0;
    return async function (req, res, next) {
        uid++;
        let id = 0;
        let arr = [];
        req.on('data', function (data) {
            arr.push(data);
        });
        req.on('end', function () {
            let data = Buffer.concat(arr);
            let post = {};
            if (req.method == 'POST') {
                if (req.headers['content-type'].indexOf('application/x-www-form-urlencoded') != -1) {
                    post = querystring.parse(data.toString());
                } else if (req.headers['content-type'].indexOf('multipart/form-data') != -1) {
                    let str = req.headers['content-type'].split(';')[1];
                    if (str) {
                        let boundary = '--' + str.split('=')[1];
                        let array = data.split(boundary);
                        array.shift();
                        array.pop();
                        array = array.map((elem) => elem.slice(2, elem.length - 2));
                        array.forEach(elem => {
                            let n = elem.indexOf('\r\n\r\n');
                            let disposition = elem.slice(0, n);
                            let content = elem.slice(n + 4);
                            disposition = disposition.toString();
                            if (disposition.indexOf('\r\n') == -1) {
                                content = content.toString();
                                let name = disposition.split(';')[1].split('=')[1];
                                name = name.substring(1, name.length - 1);
                                post[name] = content;
                            } else {
                                let [, name, filename] = disposition.split('\r\n')[0].split(';');
                                let filetype = disposition.split('\r\n')[1].split(':')[1];
                                name = name.split('=')[1];
                                name = name.substring(1, name.length - 1);
                                filename = filename.split('=')[1];
                                filename = filename.substring(1, filename.length - 1);
                                let path = (upload || '.') + '/' + uid + '-' + (++id);           
                                post[name] = {
                                    filename: filename,
                                    path: path,
                                    filetype: filetype,
                                    type: 0
                                };
                                if (upload && filename != '') {
                                    fs.writeFile(path, content, err => {
                                        if (err) {
                                            post[name].type = -1;
                                            post[name].error = err;
                                        } else {
                                            post[name].type = 1;
                                            //TODO: 考虑定时删除
                                        }
                                    });
                                } else {
                                    post[name].path = '';
                                    post[name].type = -1;
                                    post[name].content = content;
                                }
                            }
                        })
                    }
                } else if (req.headers['content-type'].indexOf('application/json') != -1) {
                    let json = data.toString();
                    try {
                        post = JSON.parse(json);
                    } catch (error) {
                        post = json;
                    }
                } else {
                    post = data.toString();
                }
            }
            req.POST = post;
            req.rawPOST = data;
            next();
        });
    }
}
/**
 * 需要：
 * req.method
 * req.url
 * req.prefix
 * 
 * 附加：
 * req.prefix
 */
function sep(timeout = 5000) {
    let use = [];
    let run = async function (req, res, next, prefix = '') {
        let runfun = function (fun, time) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    reject();
                }, time)
                fun.fun(req, res, async function (datas) {
                    resolve(datas);
                });
            });
        }
        let requrl = decodeURI(req.url);
        if (requrl.substr(0, prefix.length) == prefix) {
            requrl = requrl.substr(prefix.length);
            for (let i in use) {
                //console.log(use, i)
                if (!use[i].pathReg.test(requrl) || req.method != use[i].method && use[i].method != 'use' && use[i].method != 'all') {
                    continue;
                }
                //命中执行
                req.prefix = prefix + use[i].path
                try {
                    await runfun(use[i], timeout);
                } catch (err) {
                    if (!res.headersSent) {
                        res.writeHead(500, "Internal Server Error");
                    }
                    if (!res.writableEnded && !res.isPipeStrat) {
                        res.end();
                    }
                    break;
                }
            }
        }
        if (next) {
            if (!res.writableEnded && !res.isPipeStrat) {
                next();
            }
        } else {
            if (!res.headersSent) {
                res.writeHead(404, 'No Found', { 'Content-Type': 'text/html; charset=utf-8' });
            }
            if (!res.writableEnded && !res.isPipeStrat) {
                res.end();
            }
        }
    }
    let addfun = function (method, path, fun) {
        //添加中间件主逻辑（先加入的先阻塞）
        if (fun === undefined) {
            fun = path;
            path = '';
        }
        let pathReg = path;
        if (typeof path === 'string') {
            pathReg = RegExp('^' + path.replace(/\./g, '\\.'));
        }
        if (typeof fun !== 'function') {
            fun = function (req, res, next) {
                next();
            }
        }
        use.push({ method: method, path: path, pathReg: pathReg, fun: fun });
    }
    let back = function (req, res, next) {
        if (req.prefix) {
            run(req, res, next, req.prefix);
        } else {
            run(req, res);
        }
    }
    //app接口
    back.debug = function () {
        console.log(use);
    }
    back.use = function (path, fun) {
        addfun('use', path, fun);
    }
    back.all = function (path, fun) {
        addfun('all', path, fun);
    }
    back.get = function (path, fun) {
        addfun('GET', path, fun);
    }
    back.post = function (path, fun) {
        addfun('POST', path, fun);
    }
    back.put = function (path, fun) {
        addfun('PUT', path, fun);
    }
    back.delete = function (path, fun) {
        addfun('DELETE', path, fun);
    }
    back.listen = function (port) {
        http.createServer(back).listen(port);
    }
    back.use(function (req, res, next) {
        res.sendFile = async function (fsPath, name) {
            let sendTheFile = function (fsPath, name) {
                return new Promise((resolve, reject) => {
                    let fun = sendFile(fsPath, name);
                    fun(req, res, resolve);
                });
            }
            await sendTheFile(fsPath, name);
        }
        next();
    })
    return back;
}
module.exports = sep;
module.exports.Router = sep;
module.exports.static = static;
module.exports.sendFile = sendFile;
module.exports.getParser = getParser;
module.exports.cookieParser = cookieParser;
module.exports.bodyParser = bodyParser;
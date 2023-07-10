/**
 * Copyright (c) 2022 SNANG
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

var egeinittime = 0;
var egecanvasList = {};
var egecanvasListNum = 0;
var egetarget = "egecanvas";
var egeInitValue = function (value, defaultValue) {
    try {
        if (typeof value === 'undefined') {
            return defaultValue;
        }
        if (typeof value.v === 'undefined') {
            throw 0;
        }
        return Sk.ffi.remapToJs(value);
    }
    catch (err) {
        return value;
    }
}
var egeColorToWeb = function (color) {
    if (color.length == 3) {
        return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    }
    else if (color.length == 4) {
        return 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')';
    }
    else {
        return '#000000'
    }
}
var egecanvasAdd = function (c) {
    var i = 'egeimg' + egecanvasListNum;
    egecanvasListNum++;
    egecanvasList[i] = {
        "canvas": c,
        "bgcolor": [0, 0, 0],
        "fillcolor": [255, 0, 0],
        "color": [255, 255, 255],
        "fontbgcolor": [0, 0, 0],
        "linewidth": 1
    };
    console.log("add " + i, egecanvasList)
    return i;
}
var egecanvasDel = function (i) {
    delete egecanvasList[i];
    console.log("del " + i, egecanvasList)
}

const $builtinmodule = function () {
    const mod = { __name__: new Sk.builtin.str("sege") };

    //绘图环境相关函数

    //初始化绘图环境
    mod.initgraph = new Sk.builtin.func(function (width, height) {
        egeinittime = new Date().getTime() / 1000;
        if (egecanvasList["egecanvas"] === undefined) {
            var tmpDiv = document.getElementById(Sk.canvas);
            var tmpCans = tmpDiv.getElementsByTagName("canvas");
            var tmpCan = null;
            for (var i = 0; i < tmpCans.length; i++) {
                if (tmpCans[i].style.display != "none") {
                    tmpCan = tmpCans[i];
                    break;
                }
            }
            if (!tmpCan) {
                tmpCan = document.createElement("canvas");
                tmpDiv.appendChild(tmpCan);
            }
            egecanvasList["egecanvas"] = {
                "canvas": tmpCan,
                "bgcolor": [0, 0, 0],
                "fillcolor": [255, 0, 0],
                "color": [255, 255, 255],
                "fontbgcolor": [0, 0, 0],
                "linewidth": 1
            }
        }
        if (width !== undefined) {
            egecanvasList["egecanvas"].canvas.width = egeInitValue(width);
            egecanvasList["egecanvas"].canvas.height = egeInitValue(height);
        } else {
            if (Sk.availableHeight) {
                egecanvasList["egecanvas"].canvas.height = Sk.availableHeight;
            }
            if (Sk.availableWidth) {
                egecanvasList["egecanvas"].canvas.width = Sk.availableWidth;
            }
        }
        egecanvasList["egecanvas"].canvas.style.display = "block";
    });

    //关闭图形环境
    mod.closegraph = new Sk.builtin.func(function () {
        egecanvasList["egecanvas"].canvas.style.display = "none";//这里只是隐藏，没有删除元素
    });

    //清除屏幕
    mod.cleardevice = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg, egetarget);
        var c = egecanvasList[pimg].canvas;
        var ctx = c.getContext("2d");
        ctx.fillStyle = egeColorToWeb(egecanvasList[pimg].bgcolor);
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = egeColorToWeb(egecanvasList[pimg].fillcolor);
    });

    //设置窗口标题
    mod.setcaption = new Sk.builtin.func(function (caption) {
        document.title = egeInitValue(caption);
    });

    //获取当前绘图对象
    mod.gettarget = new Sk.builtin.func(function () {
        return egetarget;
    });

    //设置当前绘图对象
    mod.settarget = new Sk.builtin.func(function (pbuf) {
        egetarget = egeInitValue(pbuf, "egecanvas");
    });

    //通过红、绿、蓝颜色分量合成颜色
    mod.EGERGB = new Sk.builtin.func(function (byRed, byGreen, byBlue) {
        return [egeInitValue(byRed), egeInitValue(byGreen), egeInitValue(byBlue)];
    });

    //获取当前绘图背景色
    mod.getbkcolor = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg, egetarget);
        return egecanvasList[pimg].bgcolor;
    });

    //获取当前绘图前景色
    mod.getcolor = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg, egetarget);
        return egecanvasList[pimg].color;
    });

    //获取当前绘图填充色
    mod.getfillcolor = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg, egetarget);
        return egecanvasList[pimg].fillcolor;
    });

    //获取当前文字背景色
    mod.getfontbkcolor = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg, egetarget);
        return egecanvasList[pimg].fontbkcolor;
    });

    //设置当前绘图背景色
    mod.setbkcolor = new Sk.builtin.func(function (color, pimg) {
        pimg = egeInitValue(pimg, egetarget);
        egecanvasList[pimg].bgcolor = egeInitValue(color);
        //TODO 立刻更改
    });

    //设置清屏时所用的背景色
    mod.setbkcolor_f = new Sk.builtin.func(function (color, pimg) {
        pimg = egeInitValue(pimg, egetarget);
        console.log(egeInitValue(color), color)
        egecanvasList[pimg].bgcolor = egeInitValue(color);
    });

    //设置当前绘图前景色
    mod.setcolor = new Sk.builtin.func(function (color, pimg) {
        pimg = egeInitValue(pimg, egetarget);
        egecanvasList[pimg].color = egeInitValue(color);
    });

    //设置当前绘图填充色
    mod.setfillcolor = new Sk.builtin.func(function (color, pimg) {
        pimg = egeInitValue(pimg, egetarget);
        egecanvasList[pimg].fillcolor = egeInitValue(color);
    });

    //设置当前文字背景色
    mod.setfontbkcolor = new Sk.builtin.func(function (color, pimg) {
        pimg = egeInitValue(pimg, egetarget);
        egecanvasList[pimg].fontbkcolor = egeInitValue(color);
    });

    //画圆弧
    mod.arc = mod.arcf = new Sk.builtin.func(function (x, y, stangle, endangle, radius, pimg) {
        x = egeInitValue(x);
        y = egeInitValue(y);
        stangle = egeInitValue(stangle);
        endangle = egeInitValue(endangle);
        radius = egeInitValue(radius);
        pimg = egeInitValue(pimg, egetarget);
        var c = egecanvasList[pimg].canvas;
        var ctx = c.getContext("2d");
        ctx.strokeStyle = egeColorToWeb(egecanvasList[pimg].color);
        ctx.beginPath();
        ctx.arc(x, y, radius, stangle * (2 * Math.PI / 360), -endangle * (2 * Math.PI / 360), true);
        ctx.stroke();
    });

    //画无边框填充矩形
    mod.bar = mod.barf = new Sk.builtin.func(function (left, top, right, bottom, pimg) {
        left = egeInitValue(left);
        top = egeInitValue(top);
        right = egeInitValue(right);
        bottom = egeInitValue(bottom);
        pimg = egeInitValue(pimg, egetarget);
        var c = egecanvasList[pimg].canvas;
        var ctx = c.getContext("2d");
        ctx.fillStyle = egeColorToWeb(egecanvasList[pimg].fillcolor);
        ctx.fillRect(Math.min(left, right), Math.min(top, bottom), Math.abs(right - left), Math.abs(top - bottom));
    });

    //画圆
    mod.circle = mod.circlef = new Sk.builtin.func(function (x, y, radius, pimg) {
        x = egeInitValue(x);
        y = egeInitValue(y);
        radius = egeInitValue(radius);
        pimg = egeInitValue(pimg, egetarget);
        var c = egecanvasList[pimg].canvas;
        var ctx = c.getContext("2d");
        ctx.strokeStyle = egeColorToWeb(egecanvasList[pimg].color);
        ctx.lineWidth = egecanvasList[pimg].linewidth;
        ctx.beginPath();
        ctx.arc(x,y,radius,0,2*Math.PI);
        ctx.stroke();
    });

    //画填充圆
    mod.fillcircle = mod.fillcirclef = new Sk.builtin.func(function (x, y, radius, pimg) {
        x = egeInitValue(x);
        y = egeInitValue(y);
        radius = egeInitValue(radius);
        pimg = egeInitValue(pimg, egetarget);
        var c = egecanvasList[pimg].canvas;
        var ctx = c.getContext("2d");
        ctx.fillStyle = egeColorToWeb(egecanvasList[pimg].fillcolor);
        ctx.beginPath();
        ctx.arc(x,y,radius,0,2*Math.PI);
        ctx.fill();
    });

    //画空心矩形
    mod.rectangle = mod.rectanglef = new Sk.builtin.func(function (left, top, right, bottom, pimg) {
        left = egeInitValue(left);
        top = egeInitValue(top);
        right = egeInitValue(right);
        bottom = egeInitValue(bottom);
        pimg = egeInitValue(pimg, egetarget);
        var c = egecanvasList[pimg].canvas;
        var ctx = c.getContext("2d");
        ctx.strokeStyle = egeColorToWeb(egecanvasList[pimg].color);
        ctx.lineWidth = egecanvasList[pimg].linewidth;
        ctx.strokeRect(Math.min(left, right), Math.min(top, bottom), Math.abs(right - left), Math.abs(top - bottom));
    });

    //画有边框填充矩形
    mod.fillrect = mod.fillrectf = new Sk.builtin.func(function (left, top, right, bottom, pimg) {
        left = egeInitValue(left);
        top = egeInitValue(top);
        right = egeInitValue(right);
        bottom = egeInitValue(bottom);
        pimg = egeInitValue(pimg, egetarget);
        var c = egecanvasList[pimg].canvas;
        var ctx = c.getContext("2d");
        ctx.strokeStyle = egeColorToWeb(egecanvasList[pimg].color);
        ctx.fillStyle = egeColorToWeb(egecanvasList[pimg].fillcolor);
        ctx.lineWidth = egecanvasList[pimg].linewidth;
        ctx.fillRect(Math.min(left, right), Math.min(top, bottom), Math.abs(right - left), Math.abs(top - bottom));
        ctx.strokeRect(Math.min(left, right), Math.min(top, bottom), Math.abs(right - left), Math.abs(top - bottom));
    });

    //画线
    mod.line = mod.line_f = new Sk.builtin.func(function (x1, y1, x2, y2, pimg) {
        x1 = egeInitValue(x1);
        y1 = egeInitValue(y1);
        x2 = egeInitValue(x2);
        y2 = egeInitValue(y2);
        pimg = egeInitValue(pimg, egetarget);
        var c = egecanvasList[pimg].canvas;
        var ctx = c.getContext("2d");
        ctx.strokeStyle = egeColorToWeb(egecanvasList[pimg].color);
        ctx.lineWidth = egecanvasList[pimg].linewidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });

    //设置当前线宽
    mod.setlinewidth = new Sk.builtin.func(function (width, pimg) {
        pimg = egeInitValue(pimg, egetarget);
        egecanvasList[pimg].linewidth = egeInitValue(width);
    });
    
    //获取当前线宽
    mod.getlinewidth = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg, egetarget);
        return egecanvasList[pimg].linewidth;
    });

    //创建图像
    mod.newimage = new Sk.builtin.func(function (width, height) {
        width = egeInitValue(width, 1);
        height = egeInitValue(height, 1);
        var c = document.createElement("canvas");
        c.width = width;
        c.height = height;
        return egecanvasAdd(c);
    });
    //销毁图像
    mod.delimage = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg);
        egecanvasDel(pimg)
    });
    //从URL或PIMAGE中获取图像（替代EGE从屏幕 / 文件 / 资源 / PIMAGE中获取图像）
    mod.getimage = new Sk.builtin.func(function (i1, i2, i3, i4, i5, i6) {
        console.log(i1, i2, i3, i4, i5, i6)
        i1 = egeInitValue(i1);
        i2 = egeInitValue(i2);
        i3 = egeInitValue(i3);
        i4 = egeInitValue(i4);
        i5 = egeInitValue(i5);
        i6 = egeInitValue(i6);
        console.log(i1, i2, i3, i4, i5, i6)
        if (typeof i1 === 'string'
            && (typeof i2 === 'string' && !(/^[0-9a-zA-Z]+$/.test(i2)))
            && (typeof i3 === 'number' || typeof i3 === 'undefined')
            && (typeof i4 === 'number' || typeof i4 === 'undefined')
            && typeof i5 === 'undefined') {
            console.log(i2)
            return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
                var pDstImg = i1;                             // 保存图像的 IMAGE 对象指针
                var pImgFile = i2;                            // URL（图片文件名）
                var zoomWidth = 0; if (i3) zoomWidth = i3;    // 设定图像缩放至的宽度（0 表示默认宽度，不缩放）
                var zoomHeight = 0; if (i4) zoomHeight = i4;  // 设定图像缩放至的高度（0 表示默认高度，不缩放）
                var newImg = null;
                if (zoomWidth && zoomHeight) {
                    newImg = new Image(zoomWidth, zoomHeight);
                }
                else {
                    newImg = new Image();
                }
                newImg.crossOrigin = "";
                newImg.onerror = function () {
                    reject(Error("Failed to load URL: " + newImg.src));
                };
                newImg.onload = function () {
                    egecanvasList[pDstImg].canvas.width = this.width;
                    egecanvasList[pDstImg].canvas.height = this.height;
                    var ctx = egecanvasList[pDstImg].canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, egecanvasList[pDstImg].canvas.width, egecanvasList[pDstImg].canvas.height);
                    resolve();
                };
                newImg.src = pImgFile;
            }));
        }
        else if (typeof i1 === 'string'
            && (typeof i2 === 'string' && /^[0-9a-zA-Z]+$/.test(i2))
            && (typeof i3 === 'number' || typeof i3 === 'undefined')
            && (typeof i3 === 'number' || typeof i4 === 'undefined')
            && (typeof i5 === 'number' || typeof i5 === 'undefined')
            && (typeof i6 === 'number' || typeof i6 === 'undefined')) {
            console.log(i2)
            var pDstImg = i1;          // 保存图像的 IMAGE 对象指针
            var pSrcImg = i2;          // 源图像 IMAGE 对象
            var srcX = i3 || 0;             // 要获取图像的区域左上角 x 坐标
            var srcY = i4 || 0;             // 要获取图像的区域左上角 y 坐标
            var srcWidth = i5 || egecanvasList[pSrcImg].canvas.width;         // 要获取图像的区域宽度
            var srcHeight = i6 || egecanvasList[pSrcImg].canvas.height;        // 要获取图像的区域高度
            egecanvasList[pDstImg].canvas.width = srcWidth;
            egecanvasList[pDstImg].canvas.height = srcHeight;
            var ctx = egecanvasList[pDstImg].canvas.getContext("2d");
            ctx.drawImage(egecanvasList[pSrcImg].canvas, srcX, srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight);
        }
    });
    //绘制指定图像
    mod.putimage = new Sk.builtin.func(function (i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11) {
        i1 = egeInitValue(i1);
        i2 = egeInitValue(i2);
        i3 = egeInitValue(i3);
        i4 = egeInitValue(i4);
        i5 = egeInitValue(i5);
        i6 = egeInitValue(i6);
        i7 = egeInitValue(i7);
        i8 = egeInitValue(i8);
        i9 = egeInitValue(i9);
        i10 = egeInitValue(i10);
        i11 = egeInitValue(i11);
        if (typeof i1 === 'number'
            && typeof i2 === 'number'
            && typeof i3 !== 'number'
            && typeof i5 === 'undefined') {
            var pDstImg = egecanvasList[egetarget].canvas;// 目标 IMAGE 对象指针
            var dstX = i1;// 绘制位置的 x 坐标
            var dstY = i2;// 绘制位置的 y 坐标
            var pSrcImg = i3;// 要绘制的 IMAGE 对象指针
            var dwRop = i4;// 三元光栅操作码（详见备注）
            var ctx = pDstImg.getContext("2d");
            ctx.drawImage(egecanvasList[pSrcImg].canvas, dstX, dstY);
        }
        else if (typeof i1 === 'number'
            && typeof i2 === 'number'
            && typeof i3 === 'number'
            && typeof i4 === 'number'
            && typeof i5 !== 'number'
            && typeof i6 === 'number'
            && typeof i7 === 'number'
            && typeof i9 === 'undefined') {
            var pDstImg = egecanvasList[egetarget].canvas;// 目标 IMAGE 对象指针
            var dstX = i1;// 绘制位置的 x 坐标
            var dstY = i2;// 绘制位置的 y 坐标
            var dstWidth = i3;// 绘制的宽度
            var dstHeight = i4;// 绘制的高度
            var pSrcImg = i5;// 要绘制的 IMAGE 对象指针
            var srcX = i6;// 绘制内容在 IMAGE 对象中的左上角 x 坐标
            var srcY = i7;// 绘制内容在 IMAGE 对象中的左上角 y 坐标
            var srcWidth = dstWidth;// 绘制内容在源 IMAGE 对象中的宽度
            var srcHeight = dstHeight;// 绘制内容在源 IMAGE 对象中的高度
            var dwRop = i8;// 三元光栅操作码（详见备注）
            var ctx = pDstImg.getContext("2d");
            ctx.drawImage(egecanvasList[pSrcImg].canvas, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight);
        }
        else if (typeof i1 === 'number'
            && typeof i2 === 'number'
            && typeof i3 === 'number'
            && typeof i4 === 'number'
            && typeof i5 !== 'number'
            && typeof i6 === 'number'
            && typeof i7 === 'number'
            && typeof i8 === 'number'
            && typeof i9 === 'number'
            && typeof i11 === 'undefined') {
            var pDstImg = egecanvasList[egetarget].canvas;// 目标 IMAGE 对象指针
            var dstX = i1;// 绘制位置的 x 坐标
            var dstY = i2;// 绘制位置的 y 坐标
            var dstWidth = i3;// 绘制的宽度
            var dstHeight = i4;// 绘制的高度
            var pSrcImg = i5;// 要绘制的 IMAGE 对象指针
            var srcX = i6;// 绘制内容在 IMAGE 对象中的左上角 x 坐标
            var srcY = i7;// 绘制内容在 IMAGE 对象中的左上角 y 坐标
            var srcWidth = i8;// 绘制内容在源 IMAGE 对象中的宽度
            var srcHeight = i9;// 绘制内容在源 IMAGE 对象中的高度
            var dwRop = i10;// 三元光栅操作码（详见备注）
            var ctx = pDstImg.getContext("2d");
            ctx.drawImage(egecanvasList[pSrcImg].canvas, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight);
        }
        else if (typeof i1 !== 'number'
            && typeof i2 === 'number'
            && typeof i3 === 'number'
            && typeof i4 !== 'number'
            && typeof i6 === 'undefined') {
            var pDstImg = egecanvasList[i1].canvas;// 目标 IMAGE 对象指针
            var dstX = i2;// 绘制位置的 x 坐标
            var dstY = i3;// 绘制位置的 y 坐标
            var pSrcImg = i4;// 要绘制的 IMAGE 对象指针
            var dwRop = i5;// 三元光栅操作码（详见备注）
            var ctx = pDstImg.getContext("2d");
            ctx.drawImage(egecanvasList[pSrcImg].canvas, dstX, dstY);
        }
        else if (typeof i1 !== 'number'
            && typeof i2 === 'number'
            && typeof i3 === 'number'
            && typeof i4 === 'number'
            && typeof i5 === 'number'
            && typeof i6 !== 'number'
            && typeof i7 === 'number'
            && typeof i8 === 'number'
            && typeof i10 === 'undefined') {
            var pDstImg = egecanvasList[i1].canvas;// 目标 IMAGE 对象指针
            var dstX = i2;// 绘制位置的 x 坐标
            var dstY = i3;// 绘制位置的 y 坐标
            var dstWidth = i4;// 绘制的宽度
            var dstHeight = i5;// 绘制的高度
            var pSrcImg = i6;// 要绘制的 IMAGE 对象指针
            var srcX = i7;// 绘制内容在 IMAGE 对象中的左上角 x 坐标
            var srcY = i8;// 绘制内容在 IMAGE 对象中的左上角 y 坐标
            var srcWidth = dstWidth;// 绘制内容在源 IMAGE 对象中的宽度
            var srcHeight = dstHeight;// 绘制内容在源 IMAGE 对象中的高度
            var dwRop = i9;// 三元光栅操作码（详见备注）
            var ctx = pDstImg.getContext("2d");
            ctx.drawImage(egecanvasList[pSrcImg].canvas, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight);
        }
        else if (typeof i1 !== 'number'
            && typeof i2 === 'number'
            && typeof i3 === 'number'
            && typeof i4 === 'number'
            && typeof i5 === 'number'
            && typeof i6 !== 'number'
            && typeof i7 === 'number'
            && typeof i8 === 'number'
            && typeof i9 === 'number'
            && typeof i10 === 'number') {
            var pDstImg = egecanvasList[i1].canvas;// 目标 IMAGE 对象指针
            var dstX = i2;// 绘制位置的 x 坐标
            var dstY = i3;// 绘制位置的 y 坐标
            var dstWidth = i4;// 绘制的宽度
            var dstHeight = i5;// 绘制的高度
            var pSrcImg = i6;// 要绘制的 IMAGE 对象指针
            var srcX = i7;// 绘制内容在 IMAGE 对象中的左上角 x 坐标
            var srcY = i8;// 绘制内容在 IMAGE 对象中的左上角 y 坐标
            var srcWidth = i9;// 绘制内容在源 IMAGE 对象中的宽度
            var srcHeight = i10;// 绘制内容在源 IMAGE 对象中的高度
            var dwRop = i11;// 三元光栅操作码（详见备注）
            var ctx = pDstImg.getContext("2d");
            ctx.drawImage(egecanvasList[pSrcImg].canvas, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight);
        }
    });

    //调整图像尺寸
    mod.resize = new Sk.builtin.func(function (pimg, width, height) {
        pimg = egeInitValue(pimg);
        width = egeInitValue(width);
        height = egeInitValue(height);
        egecanvasList[pimg].canvas.width = width;
        egecanvasList[pimg].canvas.height = height;
    });

    //获取图像宽度
    mod.getwidth = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg, egetarget);
        return egecanvasList[pimg].canvas.width;
    });

    //获取图像高度
    mod.getheight = new Sk.builtin.func(function (pimg) {
        pimg = egeInitValue(pimg, egetarget);
        return egecanvasList[pimg].canvas.height;
    });

    //获取一个键盘字符输入。如果当前没有输入的字符就一直等待
    mod.getch = new Sk.builtin.func(function () {
        return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
            var key = null;
            function _getch(event) {
                document.body.removeEventListener("keydown", _getch);
                resolve(event.keyCode);
            }
            document.body.addEventListener("keydown", _getch);
        }));
    });

    //至少延迟以毫秒为单位的时间
    mod.delay = new Sk.builtin.func(function (Milliseconds) {
        Milliseconds = egeInitValue(Milliseconds);
        return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
            Sk.setTimeout(function () {
                resolve();
            }, Milliseconds);
        }));
    });

    mod.fclock = new Sk.builtin.func(function (Milliseconds) {
        return new Date().getTime() / 1000 - egeinittime;
    });

    return mod;
};
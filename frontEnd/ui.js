/**
 * Copyright (c) 2023 SNANG
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
/**
 * TODO 当前为半成品
 * @param {*} opt 导航的选项
 * @param {'left'|'right'|'bottom'|'top'} direction 导航栏的方位
 * @returns {createElement}
 */
function Nav(opt, dom = null) {
    let body = createElement({
        cssText: `
background-color: var(--navBgColor);
color: var(--navColor);` }, null);
    for (let i = 0; i < opt.length; i++) {
        if (opt[i].checked && opt[i].body) {
            body = opt[i].body;
            break;
        }
    }
    if (body.render) body.render();
    body.style.flex = 1;
    body.style.overflow = 'auto';
    if (!dom) dom = createElement({ cssText: 'width:100%;height:100%;' }, null);
    let nav = createElement({ cssText: 'overflow:auto;height:3.5rem;' }, null);
    dom.flex({ flexDirection: 'column-reverse' }, nav, body);
    nav.flex({ flexDirection: 'row', justifyContent: 'space-around' });
    for (let i = 0; i < opt.length; i++) {
        let a = nav.createElement({
            cssText: opt[i].checked ? `
cursor: pointer;
padding: 1.2rem 1rem;
display: flex;
background-color: var(--navBgHoverColor) !important;
color: var(--navHoverColor) !important;
fill: var(--navHoverColor) !important;
stroke: var(--navHoverColor) !important;            
`: `cursor: pointer;
padding: 1.2rem 1rem;
display: flex;`,
            onclick: () => {
                for (let j = 0; j < opt.length; j++) {
                    opt[j].checked = false;

                }
                opt[i].checked = true;
                dom.render();
            },
        });
        a.createElement({
            cssText: `
padding-left: 0.25rem;
display: block;
text-align: center;
font-size: 0.8rem;
white-space: nowrap;`,
            innerHTML: opt[i].name,
        })
    }
    dom.onrender = () => {
        dom.innerHTML = '';
        Nav(opt, dom);
        return true;
    }
    return dom;
}
//TODO 当前为半成品
function Header(title, body) {
    let left = createElement({}, null).flex({ justifyContent: 'center', alignItems: 'center' });
    let center = createElement({ innerHTML: title }, null).flex({ justifyContent: 'center', alignItems: 'center' });
    let right = createElement({}, null).flex({ justifyContent: 'center', alignItems: 'center' });
    let header = createElement({ cssText: 'height:3.5rem;background-color: var(--navBgColor); color: var(--navColor);' }, null).flex({ justifyContent: "space-between" }, left, center, right);
    let dom = createElement({ cssText: 'height:100%;overflow:hidden;' }, null).flex({ flexDirection: 'column' }, header, body);
    try {
        body.style.height = 'calc(100% - 3.5rem)';
    } catch (err) { }
    dom.leftdom = left;
    dom.rightdom = right;
    dom.setTitle = (title) => {
        center.innerHTML = title;
    }
    return dom;
}
/**
 * TODO 当前为半成品
 * 基础输入组件
 * @param {'switch'} type 输入框类型
 * @param {string} title 输入框标题
 * @param {string} placeholder 输入框说明
 * @param {{checked:boolean,disabled:'disabled',max:number,min:number,value:string,readonly:'readonly',selected:boolean}} opt 输入框选项
 * @returns 
 */
function Input(type, title, placeholder, opt) {
    let div = createElement({ className: `input input-${type}` }, null);
    let id = opt.id || `input-${Date.now()}-${parseInt(Math.random() * 100000)}`;
    if (type == "input") {
        let label = div.createElement({ tagName: 'label', className: `label`, htmlFor: id });
        label.createElement({ innerHTML: title });
        label.createElement({ innerHTML: placeholder });
        div.createElement({ tagName: 'input', className: `input`, ...opt, id: id });
    }
    else if (type == "button") {
        div.createElement({
            className: "button",
            cssText: 'cursor: pointer;',
            innerHTML: title,
            title: placeholder,
            ...opt
        });
    }
    return div;
}
async function Alert(msg, time = 3000, color = "#0000ff", bgcolor = "#eeeeee") {
    let dom = createElement({
        cssText: `
color:${color};
background-color:${bgcolor};
position:fixed;
top:3.5rem;
left:50%;
transform: translate(-50%, 0);
opacity:0;
transition: opacity 0.5s;
padding:0.5rem 1rem;
border-radius:0.5rem;
`, innerHTML: msg
    }, null);
    document.body.append(dom);
    await sleep(500);
    dom.style.opacity = 0.8;
    await sleep(time - 1000 > 0 ? time - 1000 : 0);
    dom.style.opacity = 0;
    await sleep(500);
    document.body.removeChild(dom);
}
//TODO 当前为半成品
let login = async () => {
    let name = document?.getElementById("login_username")?.value || '';
    let pass = document?.getElementById("login_password")?.value || '';
    let data = { name, pass };
    try {
        let res = await fetch('/login'/* Use your own interface */, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        let json = await res.json();
        console.log(json)
        if (json.code == "ok" && pageNav[json.type]) {
            app.removeChild(navbar);
            navbar = Nav(pageNav[json.type])
            app.append(navbar);
        }
        if (json.msg) {
            Alert(json.msg, 5000);
        }
    } catch (err) {
        Alert(err, undefined, "#ff0000");
    }
}
login();
loginPage.append(Input('input', '用户名', null, {
    id: "login_username"
}))
loginPage.append(Input('input', '密码', null, {
    id: "login_password"
}))
loginPage.append(Input('button', '登录', null, {
    onclick: login
}))
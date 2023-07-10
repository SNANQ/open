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
 * 基于原生dom扩展的创建元素方法，半成品，用以实现组件化，不影响vue、react等使用
 */
//document.body.innerHTML = "";
/**
 * 创建元素
 * @author shanghuo <shanghuo@studio.snang.cc> 20230607
 * @function createElement
 * @param {{className:string,id:string,cssText:string,innerHTML:string,tagName:string}|string} [opt] 直接的className字符串，或包含{className,id,cssText,innerHTML,tagName,...}的对象（对象属性均为可选属性）
 * @param {HTMLElement} [dom=document.body] HTMLElement，默认为document.body
 * @returns {HTMLDivElement&{createElement:createElement_createElement,flex:createElement_flex,render:createElement_render,onrender:createElement_onrender}} 
 */
function createElement(opt = {}, dom = document.body) {
    let div;
    if (opt.tagName) div = document.createElement(opt.tagName);
    else div = document.createElement("div");
    if (dom) dom.append(div);
    if (typeof opt == "string") div.className = opt;
    else {
        //if (opt.className) div.className = opt.className;
        //if (opt.id) div.id = opt.id;
        //if (opt.innerHTML) div.innerHTML = opt.innerHTML;
        if (opt.cssText) div.style.cssText = opt.cssText;
        for (let k in opt) {
            if (k != "cssText" && k != "tagName") div[k] = opt[k];
        }
    }
    /**
     * 在当前元素内创建子元素
     * @author shanghuo <shanghuo@studio.snang.cc> 20230607
     * @callback createElement_createElement 
     * @param {{className:string,id:string,cssText:string,innerHTML:string,tagName:string}|string} [opt] 直接的className字符串，或包含{className,id,cssText,innerHTML,tagName,...}的对象（对象属性均为可选属性）
     * @returns {HTMLDivElement&{createElement:createElement}} 
     */
    div.createElement = (opt) => {
        return createElement(opt, div);
    }
    /**
     * 创建Flex布局
     * @author shanghuo <shanghuo@studio.snang.cc> 20230616
     * @callback createElement_flex 
     * @param {{flexDirection:'row'|'row-reverse'|'column'|'column-reverse',flexWrap:'nowrap'|'wrap'|'wrap-reverse',justifyContent:'flex-start'|'flex-end'|'center'|'space-between'|'space-around',alignItems:'flex-start'|'flex-end'|'center'|'baseline'|'stretch',alignContent:'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'stretch'}} [opt] 设置Flex布局的参数
     * @param {HTMLElement} [dom] 要添加到布局中的元素，个数不限
     * @returns {HTMLDivElement&{createElement:createElement}} 
     */
    div.flex = (opt = {}, ...dom) => {
        div.style.display = 'flex';
        div.style.flexDirection = opt.flexDirection || "row";//主轴的方向
        div.style.flexWrap = opt.flexWrap || "nowrap";//一条轴线排不下，如何换行
        div.style.justifyContent = opt.justifyContent || "flex-start";//在主轴上的对齐方式
        div.style.alignItems = opt.alignItems || "stretch";//在交叉轴上如何对齐
        div.style.alignContent = opt.alignContent || "stretch";//多根轴线的对齐方式
        for (let k in dom) {
            div.append(dom[k]);
        }
        return div;
    }
    /**
     * 执行渲染 render
     * render(id,...opt)需与onrender(id,...opt)搭配使用
     * @author shanghuo <shanghuo@studio.snang.cc> 202300707
     * @callback createElement_render 
     * @param {string} [id] 调用时传递的id，用于发给特定接收者，建议，非必须
     * @param {{}} [opt] 发给onrender的任意参数
     */
    /**
     * 渲染时方法 onrender 由使用的开发者定义
     * render(id,...opt)需与onrender(id,...opt)搭配使用
     * @author shanghuo <shanghuo@studio.snang.cc> 202300707
     * @callback createElement_onrender 
     * @param {string} [id] 调用时传递的id，用于发给特定接收者，建议，非必须
     * @param {{}} [opt] 发给onrender的任意参数
     * @returns {boolean} 如果阻止当前层渲染传递，那么为true
     */
    div.render = (...opt) => {
        let notnext = false;
        if (div.onrender) notnext = div.onrender(...opt);
        if (!notnext && div.childNodes && div.childNodes.length > 0) {
            console.log("reader1", div.childNodes, opt)
            for (let k in div.childNodes) {
                if (div.childNodes[k].render) div.childNodes[k].render(...opt);
            }
        }
    }
    return div;
}
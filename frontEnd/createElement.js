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
document.body.innerHTML = "";
function createElement(opt = {}) {
    let div = document.createElement("div");
    if (typeof opt == "string") div.className = opt;
    else {
        if (opt.className) div.className = opt.className;
        if (opt.id) div.id = opt.id;
        if (opt.innerHTML) div.innerHTML = opt.innerHTML;
        if (opt.cssText) div.style.cssText = opt.cssText;
    }
    return div;
}
# -*- coding: UTF-8 -*-
"""
Copyright (c) 2021 SNANG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

SNANG website: https://www.snang.cc
"""

import pygame as pg
import math
import time
import re

egeinittime = 0
egecanvasList = {}
egecanvasListNum = 0
egetarget="egecanvas"

def egecanvasAdd(c):
    global egecanvasList
    global egecanvasListNum
    i = 'egeimg' + bytes(egecanvasListNum)
    egecanvasListNum += 1
    egecanvasList[i]= {
        "canvas":c,
        "bgcolor":(0,0,0),
        "fillcolor":(255,0,0),
        "color":(255,255,255),
        "fontbgcolor":(0,0,0),
        "linewidth":1
    }
    return i

def egecanvasDel(i):
    global egecanvasList
    del egecanvasList[i]

#绘图环境相关函数

def initgraph(width, height):#初始化绘图环境
    global egecanvasList
    global egeinittime
    egeinittime=time.time()
    pg.init()
    egecanvasList["egecanvas"]={
        "canvas":pg.display.set_mode((width, height), pg.SCALED),
        "bgcolor":(0,0,0),
        "fillcolor":(255,0,0),
        "color":(255,255,255),
        "fontbgcolor":(0,0,0),
        "linewidth":1
    }

def closegraph():#关闭图形环境
    pg.quit()
    egecanvasDel("egecanvas")

def cleardevice(pimg=0):#清除屏幕
    global egetarget
    if not pimg:
        pimg=egetarget
    egecanvasList[pimg]["canvas"].fill(egecanvasList[pimg]["bgcolor"])
    if pimg=="egecanvas":
        pg.display.flip()

def setcaption(caption):#设置窗口标题
    pg.display.set_caption(caption)

def gettarget():#获取当前绘图对象
    global egetarget
    return egetarget

def settarget(pbuf=0):#设置当前绘图对象
    global egetarget
    if not pbuf:
        pbuf="egecanvas"
    egetarget = pbuf

#颜色表示及相关函数

#通过红、绿、蓝颜色分量合成颜色
def EGERGB(byRed,byGreen,byBlue):
    return (byRed,byGreen,byBlue)

#获取当前绘图背景色
def getbkcolor(pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    return egecanvasList[pimg]["bgcolor"]

#获取当前绘图前景色
def getcolor(pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    return egecanvasList[pimg]["color"]

#获取当前绘图填充色
def getfillcolor(pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    return egecanvasList[pimg]["fillcolor"]

#获取当前文字背景色
def getfontbkcolor(pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    return egecanvasList[pimg]["fontbgcolor"]

#设置当前绘图背景色
def setbkcolor(color,pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    egecanvasList[pimg]["bgcolor"]=color
    #TODO 立刻更改

#设置清屏时所用的背景色
def setbkcolor_f(color,pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    egecanvasList[pimg]["bgcolor"]=color

#设置当前绘图前景色
def setcolor(color,pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    egecanvasList[pimg]["color"]=color

#设置当前绘图填充色
def setfillcolor(color,pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    egecanvasList[pimg]["fillcolor"]=color

#设置当前文字背景色
def setfontbkcolor(color,pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    egecanvasList[pimg]["fontbgcolor"]=color

#绘制图形相关函数

#画圆弧
def arc(x, y, stangle, endangle, radius, pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    pg.draw.arc(egecanvasList[pimg]["canvas"], egecanvasList[pimg]["color"], (x,y,radius*2,radius*2), stangle * (2 * math.pi / 360), endangle * (2 * math.pi / 360))
    pg.display.flip()

def arcf(x, y, stangle, endangle, radius, pimg=0):
    arc(x, y, stangle, endangle, radius, pimg)

#画无边框填充矩形
def bar(left, top, right, bottom, pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    pg.draw.rect(egecanvasList[pimg]["canvas"], egecanvasList[pimg]["fillcolor"], (min(left,right),min(top,bottom),abs(right-left),abs(top-bottom)), 0)
    pg.display.flip()

def barf(left, top, right, bottom, pimg=0):
    bar(left, top, right, bottom, pimg)

#画圆
def circle(x, y, radius, pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    pg.draw.circle(egecanvasList[pimg]["canvas"], egecanvasList[pimg]["color"], (x,y), radius, egecanvasList[pimg]["linewidth"])
    pg.display.flip()

def circlef(x, y, radius, pimg=0):
    circle(x, y, radius, pimg)
    
#画填充圆
def fillcircle(x, y, radius, pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    pg.draw.circle(egecanvasList[pimg]["canvas"], egecanvasList[pimg]["fillcolor"], (x,y), radius, 0)
    pg.display.flip()
    
def fillcirclef(x, y, radius, pimg=0):
    fillcircle(x, y, radius, pimg)

#画空心矩形
def rectangle(left, top, right, bottom, pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    pg.draw.rect(egecanvasList[pimg]["canvas"], egecanvasList[pimg]["color"], (min(left,right),min(top,bottom),abs(right-left),abs(top-bottom)), egecanvasList[pimg]["linewidth"])
    pg.display.flip()

def rectanglef(left, top, right, bottom, pimg=0):
    rectangle(left, top, right, bottom, pimg)

#画有边框填充矩形
def fillrect(left, top, right, bottom, pimg=0):
    bar(left, top, right, bottom, pimg)
    rectangle(left, top, right, bottom, pimg)

def fillrectf(left, top, right, bottom, pimg=0):
    bar(left, top, right, bottom, pimg)
    rectangle(left, top, right, bottom, pimg)

#画线
def line(x1,y1,x2,y2, pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    pg.draw.line(egecanvasList[pimg]["canvas"], egecanvasList[pimg]["color"], (x1,y1), (x2,y2), egecanvasList[pimg]["linewidth"])
    pg.display.flip()

def line_f(x1,y1,x2,y2, pimg=0):
    line(x1,y1,x2,y2, pimg)

#设置当前线宽
def setlinewidth(width,pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    egecanvasList[pimg]["linewidth"]=width

#获取当前线宽
def getlinewidth(pimg=0):
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    return egecanvasList[pimg]["linewidth"]

#文字输出相关函数

#图像处理相关函数

def newimage(width=1, height=1):#创建图像
    c = pg.Surface((width, height))
    return egecanvasAdd(c)

def delimage(pimg):#销毁图像
    egecanvasDel(pimg)

def getimage(i1, i2, i3=0, i4=0, i5=0, i6=0):
    global egecanvasList
    if not re.search('^[0-9a-zA-Z]+$',i2):
        #从文件读取
        img=pg.image.load(i2)
        egecanvasList[i1]["canvas"]=pg.transform.scale(egecanvasList[i1]["canvas"], (img.get_width(), img.get_height()))
        egecanvasList[i1]["canvas"].blit(img,(0,0))
        if i3 and i4:
            egecanvasList[i1]["canvas"]=pg.transform.scale(egecanvasList[i1]["canvas"], (i3, i4))
    else:
        #从另一个 IMAGE 对象中获取图像
        egecanvasList[i1]["canvas"].blit(egecanvasList[i2]["canvas"],(i3,i4))
        if i5 and i6:
            egecanvasList[i1]["canvas"]=pg.transform.scale(egecanvasList[i1]["canvas"], (i5, i6))

def putimage(i1,i2,i3,i4=0,i5=0,i6=0,i7=0,i8=0,i9=0,i10=0,i11=0):
    global egecanvasList
    global egetarget
    if isinstance(i1,int) and isinstance(i2,int) and not isinstance(i3,int) and not i5:
        egecanvasList[egetarget]["canvas"].blit(egecanvasList[i3]["canvas"],(i1,i2))
        pg.display.flip()
    elif isinstance(i1,int) and isinstance(i2,int) and isinstance(i3,int) and isinstance(i4,int) and not isinstance(i5,int) and isinstance(i6,int) and isinstance(i7,int) and not i9:
        rect=egecanvasList[i5]["canvas"].get_rect()
        rect.x=i6
        rect.y=i7
        rect.width=min(i3, egecanvasList[i5]["canvas"].get_width()-rect.x)
        rect.height=min(i4, egecanvasList[i5]["canvas"].get_height()-rect.y)
        egecanvasList[egetarget]["canvas"].blit(pg.transform.scale(egecanvasList[i5]["canvas"].subsurface(rect), (i3, i4)), (i1, i2))
        pg.display.flip()
    elif isinstance(i1,int) and isinstance(i2,int) and isinstance(i3,int) and isinstance(i4,int) and not isinstance(i5,int) and isinstance(i6,int) and isinstance(i7,int) and isinstance(i8,int) and isinstance(i9,int) and not i11:
        rect=egecanvasList[i5]["canvas"].get_rect()
        rect.x=i6
        rect.y=i7
        rect.width=min(i8, egecanvasList[i5]["canvas"].get_width()-rect.x)
        rect.height=min(i9, egecanvasList[i5]["canvas"].get_height()-rect.y)
        egecanvasList[egetarget]["canvas"].blit(pg.transform.scale(egecanvasList[i5]["canvas"].subsurface(rect), (i3, i4)), (i1, i2))
        pg.display.flip()
    elif not isinstance(i1,int) and isinstance(i2,int) and isinstance(i3,int) and not isinstance(i4,int) and not i6:
        egecanvasList[i1]["canvas"].blit(egecanvasList[i4]["canvas"],(i2,i3))
    elif not isinstance(i1,int) and isinstance(i2,int) and isinstance(i3,int) and isinstance(i4,int) and isinstance(i5,int) and not isinstance(i6,int) and isinstance(i7,int) and isinstance(i8,int) and not i10:
        rect=egecanvasList[i6]["canvas"].get_rect()
        rect.x=i7
        rect.y=i8
        rect.width=min(i4, egecanvasList[i6]["canvas"].get_width()-rect.x)
        rect.height=min(i5, egecanvasList[i6]["canvas"].get_height()-rect.y)
        egecanvasList[i1]["canvas"].blit(pg.transform.scale(egecanvasList[i6]["canvas"].subsurface(rect), (i4, i5)), (i2, i3))
    elif not isinstance(i1,int) and isinstance(i2,int) and isinstance(i3,int) and isinstance(i4,int) and isinstance(i5,int) and not isinstance(i6,int) and isinstance(i7,int) and isinstance(i8,int) and isinstance(i9,int) and isinstance(i10,int):
        rect=egecanvasList[i6]["canvas"].get_rect()
        rect.x=i7
        rect.y=i8
        rect.width=min(i9, egecanvasList[i6]["canvas"].get_width()-rect.x)
        rect.height=min(i10, egecanvasList[i6]["canvas"].get_height()-rect.y)
        egecanvasList[i1]["canvas"].blit(pg.transform.scale(egecanvasList[i6]["canvas"].subsurface(rect), (i4, i5)), (i2, i3))


def resize(pimg, width, height):#调整图像尺寸
    global egecanvasList
    del egecanvasList[pimg]["canvas"]
    c = pg.Surface((width, height))
    egecanvasList[pimg]["canvas"] = c

def getwidth(pimg=0):#获取图像宽度
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    return egecanvasList[pimg]["canvas"].get_width()

def getheight(pimg=0):#获取图像高度
    global egetarget
    global egecanvasList
    if not pimg:
        pimg=egetarget
    return egecanvasList[pimg]["canvas"].get_height()



#键盘鼠标输入函数

def getch():
    while True:
        arr = pg.event.get(pg.KEYDOWN)
        if arr:
            if arr[0].key ==pg.K_BACKSPACE:
                return 8
            if arr[0].key ==pg.K_TAB:
                return 9
            if arr[0].key ==pg.K_CLEAR:
                return 12
            if arr[0].key ==pg.K_RETURN:
                return 13
            if arr[0].key ==pg.K_RSHIFT:
                return 16
            if arr[0].key ==pg.K_LSHIFT:
                return 16
            if arr[0].key ==pg.K_RCTRL:
                return 17
            if arr[0].key ==pg.K_LCTRL:
                return 17
            if arr[0].key ==pg.K_RALT:
                return 18
            if arr[0].key ==pg.K_LALT:
                return 18
            if arr[0].key ==pg.K_CAPSLOCK:
                return 20
            if arr[0].key ==pg.K_ESCAPE:
                return 27
            if arr[0].key ==pg.K_SPACE:
                return 32
            if arr[0].key ==pg.K_PAGEUP:
                return 33
            if arr[0].key ==pg.K_PAGEDOWN:
                return 34
            if arr[0].key ==pg.K_END:
                return 35
            if arr[0].key ==pg.K_HOME:
                return 36
            if arr[0].key ==pg.K_LEFT:
                return 37
            if arr[0].key ==pg.K_UP:
                return 38
            if arr[0].key ==pg.K_RIGHT:
                return 39
            if arr[0].key ==pg.K_DOWN:
                return 40
            if arr[0].key ==pg.K_INSERT:
                return 45
            if arr[0].key ==pg.K_DELETE:
                return 46
            if arr[0].key ==pg.K_0:
                return 48
            if arr[0].key ==pg.K_1:
                return 49
            if arr[0].key ==pg.K_2:
                return 50
            if arr[0].key ==pg.K_3:
                return 51
            if arr[0].key ==pg.K_4:
                return 52
            if arr[0].key ==pg.K_5:
                return 53
            if arr[0].key ==pg.K_6:
                return 54
            if arr[0].key ==pg.K_7:
                return 55
            if arr[0].key ==pg.K_8:
                return 56
            if arr[0].key ==pg.K_9:
                return 57
            if arr[0].key ==pg.K_a:
                return 65
            if arr[0].key ==pg.K_b:
                return 66
            if arr[0].key ==pg.K_c:
                return 67
            if arr[0].key ==pg.K_d:
                return 68
            if arr[0].key ==pg.K_e:
                return 69
            if arr[0].key ==pg.K_f:
                return 70
            if arr[0].key ==pg.K_g:
                return 71
            if arr[0].key ==pg.K_h:
                return 72
            if arr[0].key ==pg.K_i:
                return 73
            if arr[0].key ==pg.K_j:
                return 74
            if arr[0].key ==pg.K_k:
                return 75
            if arr[0].key ==pg.K_l:
                return 76
            if arr[0].key ==pg.K_m:
                return 77
            if arr[0].key ==pg.K_n:
                return 78
            if arr[0].key ==pg.K_o:
                return 79
            if arr[0].key ==pg.K_p:
                return 80
            if arr[0].key ==pg.K_q:
                return 81
            if arr[0].key ==pg.K_r:
                return 82
            if arr[0].key ==pg.K_s:
                return 83
            if arr[0].key ==pg.K_t:
                return 84
            if arr[0].key ==pg.K_u:
                return 85
            if arr[0].key ==pg.K_v:
                return 86
            if arr[0].key ==pg.K_w:
                return 87
            if arr[0].key ==pg.K_x:
                return 88
            if arr[0].key ==pg.K_y:
                return 89
            if arr[0].key ==pg.K_z:
                return 90
            if arr[0].key ==pg.K_KP0:
                return 96
            if arr[0].key ==pg.K_KP1:
                return 97
            if arr[0].key ==pg.K_KP2:
                return 98
            if arr[0].key ==pg.K_KP3:
                return 99
            if arr[0].key ==pg.K_KP4:
                return 100
            if arr[0].key ==pg.K_KP5:
                return 101
            if arr[0].key ==pg.K_KP6:
                return 102
            if arr[0].key ==pg.K_KP7:
                return 103
            if arr[0].key ==pg.K_KP8:
                return 104
            if arr[0].key ==pg.K_KP9:
                return 105
            if arr[0].key ==pg.K_KP_MULTIPLY:
                return 106
            if arr[0].key ==pg.K_KP_PLUS:
                return 107
            if arr[0].key ==pg.K_KP_ENTER:
                return 108
            if arr[0].key ==pg.K_KP_MINUS:
                return 109
            if arr[0].key ==pg.K_KP_PERIOD:
                return 110
            if arr[0].key ==pg.K_KP_DIVIDE:
                return 111
            if arr[0].key ==pg.K_F1:
                return 112
            if arr[0].key ==pg.K_F2:
                return 113
            if arr[0].key ==pg.K_F3:
                return 114
            if arr[0].key ==pg.K_F4:
                return 115
            if arr[0].key ==pg.K_F5:
                return 116
            if arr[0].key ==pg.K_F6:
                return 117
            if arr[0].key ==pg.K_F7:
                return 118
            if arr[0].key ==pg.K_F8:
                return 119
            if arr[0].key ==pg.K_F9:
                return 120
            if arr[0].key ==pg.K_F10:
                return 121
            if arr[0].key ==pg.K_F11:
                return 122
            if arr[0].key ==pg.K_F12:
                return 123
            if arr[0].key ==pg.K_NUMLOCK:
                return 144
            if arr[0].key ==pg.K_SEMICOLON:
                return 186
            if arr[0].key ==pg.K_EQUALS:
                return 187
            if arr[0].key ==pg.K_COMMA:
                return 188
            if arr[0].key ==pg.K_MINUS:
                return 189
            if arr[0].key ==pg.K_PERIOD:
                return 190
            if arr[0].key ==pg.K_SLASH:
                return 191
            if arr[0].key ==pg.K_BACKQUOTE:
                return 192
            if arr[0].key ==pg.K_LEFTBRACKET:
                return 219
            if arr[0].key ==pg.K_BACKSLASH:
                return 220
            if arr[0].key ==pg.K_RIGHTBRACKET:
                return 221
            if arr[0].key ==pg.K_QUOTE:
                return 222
            #if arr[0].key ==pg.K_COLON:
            #    return 
            #if arr[0].key ==pg.K_PAUSE:
            #    return 
            #if arr[0].key ==pg.K_EXCLAIM:
            #    return 
            #if arr[0].key ==pg.K_QUOTEDBL:
            #    return 
            #if arr[0].key ==pg.K_HASH:
            #    return 
            #if arr[0].key ==pg.K_DOLLAR:
            #    return 
            #if arr[0].key ==pg.K_AMPERSAND:
            #    return 
            #if arr[0].key ==pg.K_LEFTPAREN:
            #    return 
            #if arr[0].key ==pg.K_RIGHTPAREN:
            #    return 
            #if arr[0].key ==pg.K_ASTERISK:
            #    return 
            #if arr[0].key ==pg.K_PLUS:
            #    return 
            #if arr[0].key ==pg.K_LESS:
            #    return 
            #if arr[0].key ==pg.K_GREATER:
            #    return 
            #if arr[0].key ==pg.K_QUESTION:
            #    return 
            #if arr[0].key ==pg.K_AT:
            #    return 
            #if arr[0].key ==pg.K_CARET:
            #    return 
            #if arr[0].key ==pg.K_UNDERSCORE:
            #    return 
            #if arr[0].key ==pg.K_KP_EQUALS:
            #    return 
            #if arr[0].key ==pg.K_F13:
            #    return 
            #if arr[0].key ==pg.K_F14:
            #    return 
            #if arr[0].key ==pg.K_F15:
            #    return 
            #if arr[0].key ==pg.K_SCROLLOCK:
            #    return 
            #if arr[0].key ==pg.K_RMETA:
            #    return 
            #if arr[0].key ==pg.K_LMETA:
            #    return 
            #if arr[0].key ==pg.K_LSUPER:
            #    return 
            #if arr[0].key ==pg.K_RSUPER:
            #    return 
            #if arr[0].key ==pg.K_MODE:
            #    return 
            #if arr[0].key ==pg.K_HELP:
            #    return 
            #if arr[0].key ==pg.K_PRINT:
            #    return 
            #if arr[0].key ==pg.K_SYSREQ:
            #    return 
            #if arr[0].key ==pg.K_BREAK:
            #    return 
            #if arr[0].key ==pg.K_MENU:
            #    return 
            #if arr[0].key ==pg.K_POWER:
            #    return 
            #if arr[0].key ==pg.K_EURO:
            #    return 
            #if arr[0].key ==pg.K_AC:
            #    return 

#时间函数

def delay(Milliseconds):
    pg.time.wait(Milliseconds)

def fclock():
    return time.time()-egeinittime

#数学函数

#随机函数

#其它函数
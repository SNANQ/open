#  openblock扩展

这是用于[openblock](https://github.com/openblockcc/openblock-desktop/)的一些扩展

## 使用方式
1. 将external-resources文件夹复制到openblock的安装目录中，与openblock原有的external-resources文件夹合并，如有冲突文件，那么直接替换（一般直接覆盖替换即可，若同时安有其它插件时请手动替换）。
2. 将目录中的config.json中（通常位于最后一条）的哈希属性删掉。（即意味着允许第三方插件，详见openblock文档）
3. 清理openblock的缓存并重启

## 本文件夹中已包含的插件（扩展）
- GY-906温度传感器
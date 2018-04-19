# Highcharts客户端导出

Highcharts 客户端导出扩展。

你可能需要将你的 Highcharts 图表导出为 图片或者 PDF文件，默认情况下，Highcharts 提供了在线导出服务器（[http://export.highcharts.com]），只需要点击对应的导出按钮即可实现导出功能。不幸的是，你可能遇到下述情况：

* 你的应用无法联网；
* 你的图表包含机密数据，你不想通过不安全的通道传输；
* 在线导出不符合你公司的安全隐私策略；
* 你不想在本地搭建导出服务器；
* 都什么年代了，浏览器端完全可以实现这些功能.


另外，本插件还提供了官方导出模块支持及导出“cvs”功能。


## 安装

推荐使用 bower 进行安装相关依赖，在确保 bower 已经完全正确后，进入到本扩展下载目录，执行如下命令

```(sh)
bower install
```

命令执行完毕后，打开 ``` example.html``` 即可看到效果了。

## 依赖

本扩展一下的库或者文件如下：


* [HighCharts](http://www.highcharts.com/) ，注意，Highcharts 并不是免费的软件，如果用于商业用途，请购买相应的授权；
* highcharts 导出模块，即 exporting.js；
* 对于图片（PNG，JPEG）, 需要 highcharts 的提供的基于 [canvg](https://github.com/gabelerner/canvg) （基于MIT授权）的工具 ’canvas-tools‘；
* [jsPDF](https://parall.ax/products/jspdf) (its GitHub page is [overthere](https://github.com/MrRio/jsPDF)) 提供导出PDF支持；
* Pseudo-official [export-csv](https://github.com/highslide-software/export-csv/tree/master) 提供 CSV 及 XLS支持。

The only dependencies you must use are HighCharts and HighCharts exporting module. If you want PNG/JPEG, add `canvas-tools`. If you want PDF support, add both `canvas-tools` and `jsPDF`. If a dependency is missing for a file type, the option will not be available in the export menu.

<sup>1</sup> There are issues with canvg, title/subtitle appearing twice, this kind of things which `canvas-tools` fixes. So I'd suggest to go with this one.

## Remarks, Issues, Other stuff

* ~~Rasterized images have an aspect ratio issue. I probably made a boo-boo somewhere.~~ That's fixed.
* This probably won't work on Internet Explorer has it uses HTML5 download feature and opens a data-uri as a fallback. ~~But IE has limited data-uri support so who knows.~~ Nope, but there are some shim/sham/polyfills so that's possible to do.
* When exporting into PDF, `sourceWidth` and `sourceHeight` are expressed in millimeters.

## Changelog

### v1.0.1 – 2015-04-27

* handling of URL options in export-csv options (highslide-software/export-csv#40)

## Credits

Written with the help of the following resources:
* that  [Stack Overflow Q/A](http://stackoverflow.com/questions/25630811/export-highcharts-to-pdf-using-javascript-and-local-server-no-internet-connec) and this [snippet/project](https://github.com/leighquince/HighChartLocalExport/) by @leighquince;
* this [JSFiddle](http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/exporting/offline-download/) from the official [HighCharts documentation](http://www.highcharts.com/docs/export-module/export-module-overview)


### .removeClass( )方法

1. .removeClass( [className ] )：每个匹配元素移除的一个或多个用空格隔开的样式名
2. .removeClass( function(index, class) ) ： 一个函数，返回一个或多个将要被移除的样式名

__注意事项：如果一个样式类名作为一个参数,只有这样式类会被从匹配的元素集合中删除 。 如果没有样式名作为参数，那么所有的样式类将被移除__

__demo__

```html
	<p class="orgClass">
	$("p").addClass("newClass")

	//通过className(fucntion)方法
    //这个函数返回一个或更多用空格隔开的要增加的样式名。
    //接收index 参数表示元素在匹配集合中的索引位置和html 参数表示元素上原来的 HTML 内容

    //找到所有的div，然后通过addClass设置颜色，根据返回的className的判断，
    $("div").addClass(function(index,className) {

        //找到类名中包含了imooc的元素
        if(-1 !== className.indexOf('imooc')){
            //this指向匹配元素集合中的当前元素
            $(this).addClass('imoocClass')
        }
    });
```
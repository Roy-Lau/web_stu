
### .addClass( className )方法

1. .addClass( className ) : 为每个匹配元素所要增加的一个或多个样式名
2. .addClass( function(index, currentClass) ) : 这个函数返回一个或更多用空格隔开的要增加的样式名

__注意事项：.addClass()方法不会替换一个样式类名。它只是简单的添加一个样式类名到元素上__

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
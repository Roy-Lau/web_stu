
### .addClass( className )方法

1. .addClass( className ) : 为每个匹配元素所要增加的一个或多个样式名
2. .addClass( function(index, currentClass) ) : 这个函数返回一个或更多用空格隔开的要增加的样式名

__注意事项：.addClass()方法不会替换一个样式类名。它只是简单的添加一个样式类名到元素上__

__demo__

```javaScript
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


### .removeClass( )方法

1. .removeClass( [className ] )：每个匹配元素移除的一个或多个用空格隔开的样式名
2. .removeClass( function(index, class) ) ： 一个函数，返回一个或多个将要被移除的样式名

__注意事项：如果一个样式类名作为一个参数,只有这样式类会被从匹配的元素集合中删除 。 如果没有样式名作为参数，那么所有的样式类将被移除__

__demo__

```javaScript
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


### .toggleClass( )方法

> .toggleClass( )方法：在匹配的元素集合中的每个元素上添加或删除一个或多个样式类,取决于这个样式类是否存在或值切换属性。即：如果存在（不存在）就删除（添加）一个类

1. .toggleClass( className )：在匹配的元素集合中的每个元素上用来切换的一个或多个（用空格隔开）样式类名
2. .toggleClass( className, switch )：一个布尔值，用于判断样式是否应该被添加或移除
3. .toggleClass( [switch ] )：一个用来判断样式类添加还是移除的 布尔值
4. .toggleClass( function(index, class, switch) [, switch ] )：用来返回在匹配的元素集合中的每个元素上用来切换的样式类名的一个函数。接收元素的索引位置和元素旧的样式类作为参数

__注意事项：
    toggleClass是一个互斥的逻辑，也就是通过判断对应的元素上是否存在指定的Class名，如果有就删除，如果没有就增加
    toggleClass会保留原有的Class名后新增，通过空格隔开__

__demo__

```javaScript
    //给所有的tr元素加一个class="c"的样式
    $("#table tr").toggleClass("c");

    //给所有的偶数tr元素切换class="c"的样式
    //所有基数的样式保留，偶数的被删除
    $("#table tr:odd").toggleClass("c");

    //第二个参数判断样式类是否应该被添加或删除
    //true，那么这个样式类将被添加;
    //false，那么这个样式类将被移除
    //所有的奇数tr元素，应该都保留class="c"样式
    $("#table tr:even").toggleClass("c", true); //这个操作没有变化，因为样式已经是存在的
```

### .css( )方法

> .css() 方法：获取元素样式属性的计算值或者设置元素的CSS属性获取：

1. .css( propertyName ) ：获取匹配元素集合中的第一个元素的样式属性的计算值
2. .css( propertyNames )：传递一组数组，返回一个对象结果

__设置：__

1. .css( propertyName, value )：设置CSS
2. .css( propertyName, function )：可以传入一个回调函数，返回取到对应的值进行处理
3. .css( properties )：可以传一个对象，同时设置多个样式


__注意事项：__

1. 浏览器属性获取方式不同，在获取某些值的时候都jQuery采用统一的处理，比如颜色采用RBG，尺寸采用px
2. .css()方法支持驼峰写法与大小写混搭的写法，内部做了容错的处理
3. 当一个数只被作为值（value）的时候， jQuery会将其转换为一个字符串，并添在字符串的结尾处添加px，例如 .css("width",50}) 与 .css("width","50px"})一样

__demo__

```javaScript
    //background-color:blue; => rgb(0, 0, 255)
    //颜色都会转化成统一的rgb标示
    $('p:eq(0)').text( $('.first').css('background-color') )

    //字体大小都会转化成统px大小 em=>px
    $('p:eq(1)').text( $('.first').css('font-size') )

    //获取尺寸，传入CSS属性组成的一个数组
    //{width: "60px", height: "60px"}
    var value = $('.first').css(['width','height']);

    //因为获取的是一个对象，取到对应的值
    $('p:eq(2)').text( 'widht:' + value.width +  ' height:' +value.height )

    //多种写法设置颜色
    $('.fourth').css("background-color","red")
    $('.fifth').css("backgroundColor","yellow")

    //多种写法设置字体大小
    $('.fourth').css("font-size","15px")
    $('.fifth').css("fontSize","0.9em")

    //获取到指定元素的宽度，在回调返回宽度值
    //通过处理这个value，重新设置新的宽度
    $('.sixth').css("width",function(index,value){
        //value带单位，先分解
        value = value.split('px');
        //返回一个新的值，在原有的值上，增加50px
        return (Number(value[0]) + 50) + value[1];
    })

    //合并设置,通过对象传设置多个样式
    $('.seventh').css({
        'font-size'        :"15px",
        "background-color" :"#40E0D0",
        "border"           :"1px solid red"
    })

```


### .css()与.addClass()设置样式的区别

__可维护性：__

.addClass()的本质是通过定义个class类的样式规则，给元素添加一个或多个类。css方法是通过JavaScript大量代码进行改变元素的样式

通过.addClass()我们可以批量的给相同的元素设置统一规则，变动起来比较方便，可以统一修改删除。如果通过.css()方法就需要指定每一个元素是一一的修改，日后维护也要一一的修改，比较麻烦

__灵活性：__

通过.css()方式可以很容易动态的去改变一个样式的属性，不需要在去繁琐的定义个class类的规则。一般来说在不确定开始布局规则，通过动态生成的HTML代码结构中，都是通过.css()方法处理的

__样式值：__

.addClass()本质只是针对class的类的增加删除，不能获取到指定样式的属性的值，.css()可以获取到指定的样式值。

__样式的优先级：__

css的样式是有优先级的，当外部样式、内部样式和内联样式__同一样式规则__同时应用于同一个元素的时候，优先级如下

    外部样式 < 内部样式 < 内联样式


1. .addClass()方法是通过增加class名的方式，那么这个样式是在外部文件或者内部样式中先定义好的，等到需要的时候在附加到元素上
2. 通过.css()方法处理的是内联样式，直接通过元素的style属性附加到元素上的

__通过.css方法设置的样式属性优先级要高于.addClass方法__

__总结：__

> .addClass与.css方法各有利弊，一般是静态的结构，都确定了布局的规则，可以用addClass的方法，增加统一的类规则
> 如果是动态的HTML结构，在不确定规则，或者经常变化的情况下，一般多考虑.css()方式


### jQuery的属性与样式之元素的数据存储

> `html5 dataset`是新的`HTML5`标准，允许你在普通的元素标签里嵌入类似`data-*`的属性，来实现一些简单数据的存取。它的数量不受限制，并且也能由`JavaScript`动态修改，也支持CSS选择器进行样式设置。这使得data属性特别灵活，也非常强大。有了这样的属性我们能够更加有序直观的进行数据预设或存储。那么在不支持`HTML5`标准的浏览器中，我们如何实现数据存取?  `jQuery`就提供了一个`.data()`的方法来处理这个问题

> 使用`jQuery`初学者一般不是很关心`data`方式，这个方法是`jquery`内部预用的，可以用来做性能优化，比如`sizzle`选择中可以用来缓存部分结果集等等。当然这个也是非常重要的一个API了，常常用于我们存放临时的一些数据，因为它是直接跟DOM元素对象绑定在一起的

__jQuery提供的存储接口__

```javaScript
    jQuery.data( element, key, value )   //静态接口,存数据
    jQuery.data( element, key )  //静态接口,取数据
    .data( key, value ) //实例接口,存数据
    .data( key ) //实例接口,存数据
```

2个方法在使用上存取都是通一个接口，传递元素，键值数据。在jQuery的官方文档中，建议用.data()方法来代替。

我们把DOM可以看作一个对象，那么我们往对象上是可以存在基本类型，引用类型的数据的，但是这里会引发一个问题，可能会存在循环引用的内存泄漏风险

通过jQuery提供的数据接口，就很好的处理了这个问题了，我们不需要关心它底层是如何实现，只需要按照对应的data方法使用就行了

同样的也提供2个对应的删除接口，使用上与data方法其实是一致的，只不过是一个是增加一个是删除罢了

    jQuery.removeData( element [, name ] )
    .removeData( [name ] )
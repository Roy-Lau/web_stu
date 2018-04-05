#  图片动态提示（css3）

### 学习目标

1. 掌握`figure`以及`figcaption`标签的用法
2. 掌握`transform`的属性特点，并熟练应用
3. 通过`transition`以及`transfrom`的配合，制作动画。
4. 学习简单的媒体查询应用

### 标签及属性介绍

* `figure`以及`figcaption`标签

**figure：** 用于独立的流内容（图像、图标、照片、代码等等）

**figcaption：** 与`figure`配套使用，用户定义标签`figure`元素的标题

```html5
<figure>
	<img src="" alt="" />
	<figcaption> figcaption </figcaption>
</figure>
```

**transform** 以及 **transition** 标签

* `Transform` 为CSS3属性，主要用于变形处理
属性： `translate(平移)，Rotate(缩放)，scale(旋转)，skew(斜切)`

`translate`: 指定对象2D translation(2D平移)。第一个参数为X轴，第二个参数对应Y轴。如果第二个参数未提供，则默认为0， <br />
_例如_ `translate(10px,10px)`

`rotate`: 指定对象的2D rotation（2D旋转），需要先有`transform-origin`属性的定义 <br />
_例如_ `rotate(90deg),transform-orgin:0 0;`

`scale`: 指定对象的2D scale (2D缩放)。第一个参数对应X轴，第二个参数对应Y轴。如果第二个参数未提供，则默认取第一个参数的值。 <br />
_例如_ `scale(0.5,0.5)`

`skew`: 指定对象skew transformation(斜切扭曲)。第一个参数对应X轴，第二个参数对应Y轴。如果第二个参数未提供，则默认值为0。 <br />
_例如_： `skew(50deg,20deg)`


* `Transition` 为CSS3的属性，主要用于元素过渡动画处理属性： `property`,`duration`,`timing-function,dely`

`property`: 检索或设置对象中的参与过渡属性
`duration`: 过渡动画的持续时间
`timing-function`: 检索或设置对象中过渡的动画类型。(Linear,ease,ease-in,ease-out,ease-in-out)
`dely`: 检索或设置对象延迟过渡的时间
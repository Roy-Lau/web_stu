/*
    方法一： 使用原生js实现
 */
// window.onload = function() {
//     var obtn = document.getElementById('btn-back-top'),
//         // 获取页面可视区域的高度
//         clientHeight = document.documentElement.clientHeight,
//         timer = null,
//         isTop = true;
//     // 页面发生滚动时触发
//     window.onscroll = function() {
//         // 获取滚动条距离顶部的高度
//         var barTop = document.documentElement.scrollTop || document.body.scrollTop
//         // 控制 回到顶部 按钮显示隐藏
//         barTop >= clientHeight ?
//             obtn.style.display = 'block' :
//             obtn.style.display = 'none';
//         // 判断滚动条是否在顶部
//         !isTop ? clearInterval(timer) : isTop = false
//     }
//     // 点击回到顶部
//     obtn.onclick = function() {
//         // 设置定时器
//         timer = setInterval(function() {
//             // 获取滚动条距离顶部的高度
//             var barTop = document.documentElement.scrollTop || document.body.scrollTop,
//                 ispeed = Math.floor(-barTop / 5);
//             // 设置滚动条距离顶部的高度
//             document.documentElement.scrollTop = document.body.scrollTop = barTop + ispeed;
//             console.log(barTop, ispeed)
//             isTop = true;
//             if (barTop === 0) {
//                 clearInterval(timer); // 清除定时器
//             }
//         }, 30)
//     }
// }


/**
 * 方法二： 返回顶部 js函数实现
 * @param  {[type]} el    dom 元素
 * @param  {[type]} model "go" 直接到顶部（默认），"move" 滚动到顶部
 * @return {[type]}       [description]
 */
function js_backTop(el, model) {
    var obtn = document.getElementById(el),
        // 获取页面可视区域的高度
        clientHeight = document.documentElement.clientHeight,
        timer = null,
        isTop = true;
    // 页面发生滚动时触发
    window.onscroll = function() {
        // 获取滚动条距离顶部的高度
        var barTop = document.documentElement.scrollTop || document.body.scrollTop
        // 控制 回到顶部 按钮显示隐藏
        barTop >= clientHeight ?
            obtn.style.display = 'block' :
            obtn.style.display = 'none';
        // 判断滚动条是否在顶部
        !isTop ? clearInterval(timer) : isTop = false
    }
    // 点击回到顶部
    obtn.onclick = function() {
        // 设置定时器
        timer = setInterval(function() {
            // 获取滚动条距离顶部的高度
            var barTop = document.documentElement.scrollTop || document.body.scrollTop,
                ispeed = Math.floor(-barTop / 5);
            // 设置滚动条距离顶部的高度
            document.documentElement.scrollTop = document.body.scrollTop = model === 'move' ? barTop + ispeed : 0;
            console.log(barTop, ispeed)
            isTop = true;
            if (barTop === 0) {
                clearInterval(timer); // 清除定时器
            }
        }, 30)
    }
}
/**
 * 方法二： 返回顶部 js函数实现
 * @param  {[type]} el    dom 元素
 * @param  {[type]} opt    {mode: "go直接到顶部，move滚动到顶部",}
 * @return {[type]}       [description]
 */
function ScrollTo_js(el, opt) {
    this.opts = Object.assign({}, ScrollTo_js.defaults, opt)
    this.el = document.querySelector(el)
    this._checkPosition()
    var self = this
    this.el.onclick = function() {
        self._move()
    }

    window.onscroll = function() {
        self._checkPosition()
    }
}
// 默认参数
ScrollTo_js.defaults = {
    mode: 'move',
    pos: 0,
    speed: 800
}
ScrollTo_js.prototype._move = function() {
    var self = this
    // 设置定时器
    var timer = setInterval(function() {
        console.log(self.opts)
        // 获取滚动条距离顶部的高度
        var barTop = document.documentElement.scrollTop || document.body.scrollTop,
            ispeed = Math.floor(-barTop / self.opts.speed);
        // 设置滚动条距离顶部的高度
        var setTop = document.documentElement.scrollTop = document.body.scrollTop
            // 如果 mode 是 'move' 则滚动到顶部，如果mode不为 'move' 直接跳转到顶部
            document.documentElement.scrollTop = document.body.scrollTop = self.opts.mode === 'move' ? barTop + ispeed : 0;

            console.log(document.documentElement.scrollTop = document.body.scrollTop)
        if (setTop === self.opts.pos) {
            clearInterval(timer); // 清除定时器
        }
    }, 30)
};

ScrollTo_js.prototype._checkPosition = function() {
    // 获取滚动条距离顶部的高度
    var barTop = document.documentElement.scrollTop || document.body.scrollTop,
        height = document.documentElement.clientHeight
    if (barTop > height) {
        this.el.style.display = 'block'
    } else {
        this.el.style.display = 'none'
    }
}
/**
 * 方法三： 返回顶部 jq 实现
 * @param  {[type]} el    dom 元素
 * @param  {[type]} model "go" 直接到顶部（默认），"move" 滚动到顶部
 * @return {[type]}       [description]
 */
function jq_backTop() {
    // 点击返回按钮，触发XXX事件
    $('#btn-back-top').on('click', move)
    $(window).on('scroll', function() {
        // $(window).height() 一屏的高度
        checkPosition($(window).height())
    })

    function move() {
        $("html,body").animate({
            scrollTop: 0
        }, 800)
    }

    function go() {
        $("html,body").scrollTop(0)
    }

    function checkPosition(pos) {
        // 滚动条的位置 > 一屏的高度
        if ($(window).scrollTop() > pos) {
            $("#btn-back-top").fadeIn() // 渐隐
        } else {
            $("#btn-back-top").fadeOut() // 渐显
        }
    }
}
/**
 * 方法三： 返回顶部 jq 实现 封裝成 ScrollTo 类
 * @param  {[type]} el    dom 元素
 * @param  {[type]} model "go" 直接到顶部（默认），"move" 滚动到顶部
 * @return {[type]}       [description]
 */
function ScrollTo_jq(el, opt) {
    this.opts = $.extend({}, ScrollTo_jq.defaults, opt)
    this.$root = $("html,body")
    this.$el = $(el)
    this._checkPosition()
    if (this.opts.mode === 'move') {
        this.$el.on('click', $.proxy(this._move, this))
    } else {
        this.$el.on('click', $.proxy(this._go, this))
    }
    $(window).on('scroll', $.proxy(this._checkPosition, this))

}
// 默认参数
ScrollTo_jq.defaults = {
    mode: 'move',
    pos: 0,
    speed: 800
}
// 移动至
ScrollTo_jq.prototype._move = function() {
    var opts = this.opts
    this.$root.animate({
        scrollTop: opts.pos
    }, opts.speed)
};
// 跳转至
ScrollTo_jq.prototype._go = function() {
    this.$root.scrollTop(this.opts.pos)
};
// 检查位置
ScrollTo_jq.prototype._checkPosition = function() {
    // 滚动条的位置 > 一屏的高度
    if ($(window).scrollTop() > this.opts.pos) {
        this.$el.fadeIn() // 渐隐
    } else {
        this.$el.fadeOut() // 渐显
    }
}
window.onload = function() {
    // js_backTop('btn-back-top','move')
    // jq_backTop()
    new ScrollTo_js('#btn-back-top',{mode:'move',pos:100,speed:80})
    // new ScrollTo_jq('#btn-back-top',{mode:'go'})
}
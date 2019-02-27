// 1. 数据定义（实际生产环境中，通过后台传递）
let data = [
	{'img':1,'h2':'h2的文字——1','h3':'h3的文字——1'},
	{'img':2,'h2':'h2的文字——2','h3':'h3的文字——2'},
	{'img':3,'h2':'h2的文字——3','h3':'h3的文字——3'},
	{'img':4,'h2':'h2的文字——4','h3':'h3的文字——4'},
	{'img':5,'h2':'h2的文字——5','h3':'h3的文字——5'},
	{'img':6,'h2':'h2的文字——6','h3':'h3的文字——6'},
	{'img':7,'h2':'h2的文字——7','h3':'h3的文字——7'},
]

// 2. 通用函数(获取id class)
let g = function (id) {
	if (id.substr(0,1) === '.') {
		return document.getElementsByClassName(id.substr(1));
	}
	return document.getElementById(id)
}

// 3. 添加幻灯片的操作（所有幻灯片&对应的按钮）
function addSliders(){
	// 3.1 获取模板
		// 幻灯片
	let tpl_main = g('templateMain').innerHTML
									.replace(/^\s*/,'')
									.replace(/\s*$/,''),
		// 控制按钮
		tpl_ctrl = g('templateCtrl').innerHTML
									.replace(/^\s*/,'')
									.replace(/\s*$/,''),
		// 3.2 定义最终输出的 HTML 变量
		out_main = [],
		out_ctrl = []
		// 3.3 遍历所有数据，构建最终输出的 HTML
		for(var k in data){
			let _htmlMain = tpl_main
							.replace(/{{index}}/g, data[k].img)
							.replace(/{{h2}}/g, data[k].h2)
							.replace(/{{h3}}/g, data[k].h3)
							.replace(/{{css}}/g, ['','main-item_right'][k%2]), // 控制左右切换
				_htmlCtrl = tpl_ctrl
							.replace(/{{index}}/g, data[k].img)

			out_main.push(_htmlMain)
			out_ctrl.push(_htmlCtrl)
		}
		// 3.4 把 HTML 回写到对应的DOM里面
		g('templateMain').innerHTML = out_main.join('')
		g('templateCtrl').innerHTML = out_ctrl.join('')

		// 7. 增加 #main_background
		g('templateMain').innerHTML += tpl_main
										.replace(/{{index}}/g, 'tmp')
										.replace(/{{h2}}/g, data[k].h2)
										.replace(/{{h3}}/g, data[k].h3)

		g('main_tmp').id = 'main_background'
}

// 5. 幻灯片切换
function switchSlider(n){
	// 5.1 获得要展现的幻灯片 & 控制按钮 DOM
	let main = g('main_'+n),
		ctrl = g('ctrl_'+n)

	// 5.2 获得所有的幻灯片以及控制按钮
	let clear_main = g('.main-item'),
		clear_ctrl = g('.ctrl-item')
	// 5.3 清除 active 样式
	for(let i = 0; i < clear_ctrl.length; i++){
		clear_main[i].className = clear_main[i].className.replace(' main-item_active','')
		clear_ctrl[i].className = clear_ctrl[i].className.replace(' ctrl-item_active','')
	}
	// 5.4 为当前控制按钮和幻灯片附加样式
	main.className += ' main-item_active';
	ctrl.className += ' ctrl-item_active';

	// 7.2 切换时，复制上一张幻灯片到 main_background 中
	setTimeout(function(){
		g('main_background').innerHTML = main.innerHTML
	},100)
}

// 6. 动态调整图片的 margin-top 使其水平垂直居中
function movePictures(){
	let pictures = g('.picture')
	for( let i=0; i < pictures.length; i++){
		pictures[i].style.marginTop = (-1 * pictures[i].clientHeight / 2) + 'px'
	}
}
// 4. 定义何时处理幻灯片输出
window.onload = function(){
	addSliders()
	switchSlider(2)
	setTimeout(function(){
		movePictures() // 幻灯片切换的时候动态调整图片位置(需等图片加载完成)
	},100)
}
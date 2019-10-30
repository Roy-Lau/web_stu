// Make a map and return a function for checking if a key is in that map.
// 制作一个 map ，并返回一个用于检查键是否在该 map 中的函数。

// IMPORTANT: all calls of this function must be prefixed with /*#__PURE__*/
// So that rollup can tree-shake them if necessary.
// 重要说明：此函数的所有调用必须以/*＃__ PURE __ * /开头，以便 rollup 可以在必要时摇晃它们。

/**
 * 制作值唯一的数组
 * @param {string} str              传入以逗号分隔的字符串
 * @param {string} expectsLowerCase 是否将字符串转为小写
 * @return {Function}  返回一个检测函数，判断传入的键是否在其中
 */
export function makeMap(
  str: string,
  expectsLowerCase?: boolean
): (key: string) => boolean {

	// 创建一个纯净的对象常量
  const map: Record<string, boolean> = Object.create(null)
  	// 将传入的 str 以逗号分隔为数组，保存在 list 常量中
  const list: Array<string> = str.split(',')
  // 遍历 list
  for (let i = 0; i < list.length; i++) {
  	/**
  	 * 将 list 内的值做为 map 的 key，并赋值为 true
  	 */
    map[list[i]] = true
  }
  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}

/*
	function makeMap(str,expectsLowerCase){
		const map = Object.create(null)
		const list = str.split(',')
		for(let i = 0; i < list.length; i++){
			map[list[i]] = true
		}
		return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
	}
	let isInMap = makeMap('Object,Boolean,String,RegExp,Map,Set,JSON,Intl')
	isInMap() // false
	isInMap('String') // ture
 */
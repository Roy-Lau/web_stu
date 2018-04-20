                       __
                      /\ \                                                         __
     __  __    ___    \_\ \     __   _ __   ____    ___    ___   _ __    __       /\_\    ____
    /\ \/\ \ /' _ `\  /'_  \  /'__`\/\  __\/ ,__\  / ___\ / __`\/\  __\/'__`\     \/\ \  /',__\
    \ \ \_\ \/\ \/\ \/\ \ \ \/\  __/\ \ \//\__, `\/\ \__//\ \ \ \ \ \//\  __/  __  \ \ \/\__, `\
     \ \____/\ \_\ \_\ \___,_\ \____\\ \_\\/\____/\ \____\ \____/\ \_\\ \____\/\_\ _\ \ \/\____/
      \/___/  \/_/\/_/\/__,_ /\/____/ \/_/ \/___/  \/____/\/___/  \/_/ \/____/\/_//\ \_\ \/___/
                                                                                  \ \____/
                                                                                   \/___/

# 源码阅读笔记


先找出 `_` 上挂载的函数

```js
for(keys in _){console.log(keys)}
	VERSION : underscore的当前版本
	iteratee
	forEach
	each
	collect
	map
	inject
	foldl
	reduce
	foldr
	reduceRight
	detect
	find
	select
	filter
	reject
	all
	every
	any
	some
	include
	includes
	contains
	invoke
	pluck
	where
	findWhere
	max
	min
	shuffle
	sample
	sortBy
	groupBy
	indexBy
	countBy
	toArray
	size
	partition
	take
	head
	first
	initial
	last
	drop
	tail
	rest
	compact
	flatten
	without
	unique
	uniq
	union
	intersection
	difference
	zip
	unzip
	object
	findIndex
	findLastIndex
	sortedIndex
	indexOf
	lastIndexOf
	range
	bind
	partial
	bindAll
	memoize
	delay
	defer
	throttle
	debounce
	wrap
	negate
	compose
	after
	before
	once
	keys
	allKeys
	values
	mapObject
	pairs
	invert
	methods
	functions
	extend
	assign
	extendOwn
	findKey
	pick
	omit
	defaults
	create
	clone
	tap
	isMatch
	isEqual
	isEmpty
	isElement
	isArray
	isObject
	isArguments
	isFunction
	isString
	isNumber
	isDate
	isRegExp
	isError
	isFinite
	isNaN
	isBoolean
	isNull
	isUndefined
	has
	noConflict
	identity
	constant
	noop
	property
	propertyOf
	matches
	matcher
	times
	random
	now
	escape
	unescape
	result
	uniqueId
	templateSettings
	template
	chain
	mixin
```
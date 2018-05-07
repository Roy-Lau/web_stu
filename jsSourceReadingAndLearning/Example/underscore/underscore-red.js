//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  // 在浏览器中建立根对象，“窗口”，或者在服务器上“导出”。
  var root = this;

  // Save the previous value of the `_` variable.
  // 在根对象上挂载 `_`,并赋值给 `previousUnderscore`,变量
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  // 缩小字节：保存 `数组，对象，方法`都的原型
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  // 为快速访问核心原型创建快速引用变量
  var
    push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty; // 用来判断某个对象是否含有指定的属性的

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  // 希望所有的功能都用 ECMA5 的原生方法实现
  var
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind,
    nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  // 代理原型交换的裸函数引用。
  var Ctor = function() {};

  // Create a safe reference to the Underscore object for use below.
  /**
   * 为下划线对象创建一个安全的引用，供下面使用。
   * @param  { Object } obj [description]
   * @return { Object }     [description]
   */
  var _ = function(obj) {
    if (obj instanceof _) return obj; // 如果传入的对象的原型上已经有 `_`,直接返回该对象
    if (!(this instanceof _)) return new _(obj); // 这里的 `this` 指向 `window`。如果`wundow`上没有`_`,返回一个`_`对象
    this._wrapped = obj; // 包装传入的对象
    console.log(this) // 这里的 `this` 指向 `window`。
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  // 这一部分代码是为了在 `node.js` 环境下将 `underscore` 作为一个模块使用，
  // 并向后兼容旧版的模块 `API` ，即 `require` 。如果在浏览器环境中，则将 `underscore` 以 `_` 暴露到全局。
  // 值得注意的是使用nodeType来确保exports和module并不是HTML的元素。
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  // 当前版本

  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.

  /**
   * @title 优化回调(尽量用指定参数，而不是用 arguments，并且改变所执行函数的作用域)
   * 内部函数，返回传入的回调的有效（当前引擎）版本，在其他下划线函数中重复应用。
   *
   * @param  {Function} func   [待优化回调函数]
   * @param  {[type]} context  [执行上下文]
   * @param  {Number} argCount [函数参数的个数，针对不同参数个数进行不同的处理]
   * @return {[type]}          [description]
   */
  var optimizeCb = function(func, context, argCount) {

    // `void 0` 返回 `undefined` ，即未传入上下文信息时直接返回相应的函数
    if (context === void 0) return func;

    // 如果传入了 `argCount` ，那么参数数量为 `argCount` ，如果传入等价为 `null` ，则为 `3` ，包括未传值得情况
    switch (argCount == null ? 3 : argCount) {
      // 1个参数的时候，只需要传递当前值(为单值的情况，例如times函数)
      case 1:
        return function(value) {
          return func.call(context, value);
        };
        // 因为2个参数的情况没用被用到，所以在新版中被删除了
      case 2:
        return function(value, other) {
          return func.call(context, value, other);
        };
      case 3:
        /**
         * 3个参数用于一些迭代器函数，例如map函数
         *
         * @param  {[type]} value      [当前值]
         * @param  {[type]} index      [当前索引]
         * @param  {[type]} collection [整个集合]
         * @return {[type]}            [description]
         */
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        /**
         * 4个参数用于reduce和reduceRight函数
         *
         * @param  {[type]} accumulator [累计值]
         * @param  {[type]} value       [当前值]
         * @param  {[type]} index       [当前索引]
         * @param  {[type]} collection  [整个集合]
         * @return {[type]}             [description]
         */
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    // 如果都不符合上述的任一条件，直接使用apply调用相关函数
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  /**
   * @title 回调
   * 一个主要的内部函数生成回调函数，可以应用到每个元素的集合，返回预期的结果或身份，
   * 任意一个回调，一个属性或属性访问器。
   *
   * @param  {[type]}   value    [description]
   * @param  {[type]}   context  [执行上下文]
   * @param  {Number}   argCount [函数参数的个数，针对不同参数个数进行不同的处理]
   * @return {Function}          [description]
   */
  var cb = function(value, context, argCount) {
    // 如果 `value` 为空，就返回一个返回参数自身的回调函数
    if (value == null) return _.identity;

    // 如果 `value` 是一个函数，则改变所执行函数的作用域
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);

    // 如果 `value` 是一个对象，返回一个是否匹配属性的函数
    if (_.isObject(value)) return _.matcher(value);

    // 否则返回一个 读取对象 `value` 属性的回调函数
    return _.property(value);
  };

  /**
   * @title迭代(重复;反复申明)
   * 通过调用cb函数，生成每个元素的回调
   *
   * @param  {[String,Number,Boolean]} value   [对象的value值]
   * @param  {[type]} context   [执行上下文]
   * @return {Function}         [返回一个回调函数]
   */
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  /**
   * 创建一个分配器功能的内部函数。
   *
   * @param  {Function} keysFunc      [description]
   * @param  {Boolean} undefinedOnly [description]
   * @return {[Function,Object]}               [description]
   */
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  /**
   * 创建一个继承另一个新对象的内部函数。
   * @param  {Object} prototype [原型]
   * @return {[type]}           [description]
   */
  var baseCreate = function(prototype) {
    // 如果传进来的(原型prototype)不是对象，直接返回 {}
    if (!_.isObject(prototype)) return {};

    /*
      nativeCreate = Object.create;
      如果 nativeCreate存在，
      则 create一个(原型prototype)，return出去
     */
    if (nativeCreate) return nativeCreate(prototype);

    // var Ctor = function(){};
    // Ctor的原型继承传进来的原型
    Ctor.prototype = prototype;
    // 创建一个Ctor实例对象
    var result = new Ctor;
    // 为了下一次使用，将原型清空
    Ctor.prototype = null;
    // 最后将实例返回
    return result;
  };

  /**
   * @title 获取属性值
   * 通过传入键名，返回可以访问以传入对象为参数，并可以获取该对象相应键值对的函数
   *
   * @param  {String} key [description]
   * @return {Object}     [description]
   *
   * @example
   * var obj = {a:1,b:2,length:3},
   *   getLength = property('length'),
   *   length = getLength(obj);
   */
  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094

  /**
   * js的精确整数最大为: 9007199254740991
   * @type {Number} 正无穷大
   */
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  /**
   * 获取对象的长度
   * @type {String}
   */
  var getLength = property('length');
  /**
   * @title `isArrayLike` 判断对象是否为类数组
   * 判断对象是否为类数组，
   * 以确定集合是否应该作为数组或作为对象相关：http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength。
   * HTMLα秒长度避免了ARM64上非常讨厌的IOS 8 JIT错误。#2094
   *
   * @param  {Object}  collection [集合]
   * @return {Boolean}            [是否为类数组]
   *
   * @extends {类数组}
   *  即拥有 length 属性并且 length 属性值为 Number 类型的元素，
   *  例如数组、arguments、HTMLCollection 以及 NodeList 等等,
   *  当然 {length: 3} 这种对象也满足条件，但是_.each一般不会传这种值。
   */
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    // collection 的长度是'number', 且大于等于0， 小于等于js的最大数值, 返回true
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // 集合函数
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  /**
   * @title 遍历
   * 这个方法是'each'实现，也就是`forEach`。
   * 除了数组之外，还处理原始对象。
   * 对待所有稀疏数组，就像它们很密集一样。
   *
   * @param  {Object} obj      [对象]
   * @param  {[type]} iteratee [迭代，遍历，重复]
   * @param  {[type]} context  [执行上下文]
   * @return {Array}          [description]】
   *
   * @example1
   * _.each({name:"roy",age:18},function(value,key,obj){
   *   console.log(value,key,obj)
   * })
   * > roy name {name: "roy", age: 18}
   * > 18 "age" {name: "roy", age: 18}
   */
  _.each = _.forEach = function(obj, iteratee, context) {

    // 优化遍历函数`iteratee`，将 `iteratee` 中的 `this` 动态设置为 `context`
    //
    // 先处理一下传入的迭代函数，回顾一下，这里如果没有context，则直接使用iteratee作为函数遍历，
    // 否则迭代函数将以当前值、当前索引、完整集合作为参数进行调用
    iteratee = optimizeCb(iteratee, context);

    var i, length;
    // 如果传入的是类数组对象，则遍历每一个位置
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj); // 参数是值、索引、完整集合
      }
      // 否则遍历每一个键值对
    } else {
      // 获取传入对象的keys值(Array类型)
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj); // 参数是值、键、完整集合
      }
    }
    return obj; // 返回对象自身
  };

  // Return the results of applying the iteratee to each element.
  // 返回将迭代器应用于每个元素的结果。
  /**
   * map 会对集合内的元素依次使用用户提供的回调函数进行处理，然后返回处理后的新的集合。
   *
   * @param  {Object} obj      [description]
   * @param  {Function} iteratee 迭代
   * @param  {[type]} context  [执行上下文]
   * @return {Array}          返回对象值的数组
   *
   * @example1
   * _.map({a:1,b:2})
   * > [1,2]
   * @example2
   * _.map([{name:'roy',age:18}],'name')
   * > ['roy']
   * @example3
   * _.map({a:2,b:3},function(value,key,obj){
   *   console.log(value,key,obj)
   *  })
   * > 2 "a" {a:2,b:3}
   * > 3 "b" {a:2,b:3}
   */
  _.map = _.collect = function(obj, iteratee, context) {

    // 根据 `iteratee` 决定是返回等价、函数调用、属性匹配或者属性访问
    iteratee = cb(iteratee, context);

    // 类数组对象如果为 `false` ，否则 则取对象全部键
    var keys = !isArrayLike(obj) && _.keys(obj),
      // 类数组对象为 `length` 属性，否则为对象键值对数量
      length = (keys || obj).length,
      // 要返回的新的集合
      results = Array(length);

    for (var index = 0; index < length; index++) {

      // 类数组对象取索引，否则取键名
      var currentKey = keys ? keys[index] : index;

      // 放入对应位置的值经过 `iteratee` 处理后的值
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  // 创建左或右迭代的还原函数。
  /**
   * 抽象递归过程
   * @param  {Number} dir [1: 左递归, -1: 右递归]
   * @return {[type]}     [description]
   */
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    /**
     * 迭代器(包装递归)
     *
     * @param  {[type]} obj      [description]
     * @param  {[type]} iteratee [description]
     * @param  {[type]} memo     [description]
     * @param  {[type]} keys     [description]
     * @param  {[type]} index    [description]
     * @param  {[type]} length   [description]
     * @return {[type]}          [description]
     */
    function iterator(obj, iteratee, memo, keys, index, length) {
      // 根据方向递归遍历
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }
    /**
     * 传入要遍历的对象、迭代器、记录、上下文
     *
     * @param  {Object} obj      [要遍历的对象]
     * @param  {[type]} iteratee [迭代器]
     * @param  {[type]} memo     [记录]
     * @param  {[type]} context  [上下文]
     * @return {Function}        [累加器的迭代函数]
     */
    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.(如果没有提供，则确定初始值。)
      // 前三次的时候创建 `memo` 用来存储
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      // 返回迭代为累加器的迭代函数
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  // 从左往右递归
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  // 从右往左递归
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  // 传入三个参数，分别是要查找的对象、判断条件、上下文
  /**
   * 查找函数
   *
   * @param  {[type]} obj       [查找的对象]
   * @param  {[type]} predicate [判断条件]
   * @param  {[type]} context   [上下文]
   * @return {[type]}           [description]
   *
   * @example1  {Object}
   * _.find({name:'roylau',age:18},function(item, key, obj){
   *   console.log(item, key, obj)
   * })
   * > roylau name {name: "roylau", age: 18}
   * > 18 "age" {name: "roylau", age: 18}
   *
   * @example2 {Array}
   * _.find([1,2,3],function(item, index ,arr){
   *    console.log(item, index ,arr)
   * })
   * > 1 0 [1, 2, 3]
   * > 2 1 [1, 2, 3]
   * > 3 2 [1, 2, 3]
   */
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    // 数组则查找索引(findIndex)，对象查找键(findKey)
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  /**
   * 从原数组中寻找符合条件的并组成新的数组返回
   *
   * @param  {Object} obj         要查询的对象
   * @param  {Function} predicate 判断函数
   * @param  {[type]} context     上下文
   * @return {Array}           [description]
   */
  _.filter = _.select = function(obj, predicate, context) {

    // 要返回的新数组
    var results = [];

    // 处理预测函数
    predicate = cb(predicate, context);

    // 遍历处理
    _.each(obj, function(value, index, list) {
      // 复合条件的放入数组
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  /**
   * 对 `filter` 函数的判断函数取反
   *
   * @param  {Object} obj       [要处理的对象]
   * @param  {Function} predicate [判断函数]
   * @param  {[type]} context   [上下文]
   * @return {[type]}           [description]
   */
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  /**
   * 判断是不是所有项目都符合条件，全部符合才返回 `true`，否则返回 `false`。
   *
   * @param  {Object} obj       [要处理的对象]
   * @param  {Function} predicate [判断函数]
   * @param  {[type]} context   [上下文]
   * @return {Boolean}          [description]
   */
  _.every = _.all = function(obj, predicate, context) {

    // 处理判断函数
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length;

    // 依次遍历，一旦有不符合的就返回 `false`
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  /**
   * 只要存在复合条件的项目就返回 `true`，否则返回 `false`。
   *
   * @param  {Object} obj       [要处理的对象]
   * @param  {Function} predicate [判断函数]
   * @param  {[type]} context   [上下文]
   * @return {Boolean}           [description]
   */
  _.some = _.any = function(obj, predicate, context) {

    // 处理判断函数
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length;

    // 依次遍历，一旦有符合的就返回 `true`
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  /**
   * 判断集合里是否包含(使用===检测)某一项。
   *
   * @param  {Object} obj       [是否存在于此对象]
   * @param  {[type]} item      [需要判断的项]
   * @param  {Number} fromIndex [开始判断的位置]
   * @param  {[type]} guard     [description]
   * @return {Boolean}          [true:包含，false:不包含]
   *
   * @example
   * _.contains([1, 2, 3], 3);
   * > true
   */
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    // 如果是对象，取其键值对的值重组数组
    if (!isArrayLike(obj)) obj = _.values(obj);
    // 如果 `fromIndex` 不是数字 或 `guard` 不存在, 将 `fromIndex` 重置为 `0`
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    // 判断从 `fromIndex` 开始是否存在该 `item`
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  /**
   * 依次对集合内的每一项调用提供的方法，并将多余的参数作为该方法的参数使用。
   *
   * @param  {Object} obj    [description]
   * @param  {String} method [方法名]
   * @return {Array}         [description]
   *
   * @example
   * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
   * > [[1, 5, 7], [1, 2, 3]]
   */
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    // 先判断一下是不是函数
    var isFunc = _.isFunction(method);
    // 依次调用执行
    return _.map(obj, function(value) {
      // 如果是函数的话就调用该方法，否则调用 `value` 中的该方法
      var func = isFunc ? method : value[method];
      // `func` 不为 `null` 就调用该方法
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  /**
   * 取集合中对象某一个键对应值的简便写法。
   *
   * @param  {Array} obj [数组对象]
   * @param  {String} key [对应的 key]
   * @return {Array}     [对象值的数组]
   *
   * @example
   * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
   * _.pluck(stooges, 'name');
   * > ["moe", "larry", "curly"]
   */
  _.pluck = function(obj, key) {
    // 依次取 `key` 对应的属性值
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  /**
   * 筛选符合某一条件的集合中的对象的简便写法。
   *
   * @param  {Array} obj   [description]
   * @param  {Object} attrs [要匹配对象]
   * @return {Array}       [将对象的value以数组的方式返回]
   *
   * @example1 将对象转化为数组
   * _.where({author: "Shakespeare", year: 1611})
   * > ["Shakespeare", 1611]
   *
   * @example2 遍历list中的每一个值，返回一个数组，这个数组里的元素包含 **attrs** 所列出的键 - 值对。
   * var list = [{title: "Cymbeline", author: "Shakespeare", year: 1611},
   *   {title: "The Tempest", author: "Shakespeare", year: 1611},
   *   {title: "The day", author: "Shakespeare", year: 1612}
   * ]
   * _.where(list, {author: "Shakespeare", year: 1611});
   * > [{title: "Cymbeline", author: "Shakespeare", year: 1611},
   *   {title: "The Tempest", author: "Shakespeare", year: 1611}]
   */
  _.where = function(obj, attrs) {
    // 取符合attrs的
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  /**
   * 寻找集合中第一个符合某条件的对象的简便写法。
   *
   * @param  {Array} obj   [description]
   * @param  {Object} attrs [要匹配对象]
   * @return {Object}       [description]
   *
   * @example 遍历整个list，返回匹配 attrs 参数所列出的所有 键 - 值 对的第一个值。
   * var list = [{title: "Cymbeline", author: "Shakespeare", year: 1611},
   *   {title: "The Tempest", author: "Shakespeare", year: 1611},
   *   {title: "The day", author: "Shakespeare", year: 1612}
   * ]
   * _.findWhere(list, {author: "Shakespeare", year: 1611});
   * {title: "Cymbeline", author: "Shakespeare", year: 1611}
   */
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  /**
   * 返回最大元素（或基于元素的计算）。
   * 寻找集合中的最大值，如果集合是无法直接比较的，应当提供比较函数。
   *
   * @param  {Array} obj      [需要查找的数组对象]
   * @param  {Function} iteratee [迭代器]
   * @param  {[type]} context  [执行上下文]
   * @return {[type]}          [最大值 或者 最大值的对象]
   *
   * @example1 寻找数组的最大值
   * _.max([3,2,1,4,5])
   * > 5
   * @example
   * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
   * _.max(stooges, function(stooge){ return stooge.age; });
   * > {name: 'curly', age: 60};
   */
  _.max = function(obj, iteratee, context) {
     // 先设定两个初值，一个是结果(result)，一个是上一次的计算值(lastComputed)
    var result = -Infinity,
      lastComputed = -Infinity,
      value, computed;

    // 如果不提供迭代器，或者集合内不是对象，则直接比较
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);

      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      // 否则根据迭代器比较
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  /**
   * 返回最小元素（或基于元素的计算）。
   * 寻找集合中的最小值，如果集合是无法直接比较的，应当提供比较函数。这个和上面的(max)就是判断条件不一样，
   *
   * @param  {Array} obj      [需要查找的数组]
   * @param  {Function} iteratee [迭代器]
   * @param  {[type]} context  [执行上下文]
   * @return {Number}          [最小值 或者 最小值的对象]
   *
   * @example 寻找数组的最小值
   * _.max([3,2,1,4,5])
   * > 1
   */
  _.min = function(obj, iteratee, context) {
    var result = Infinity,
      lastComputed = Infinity,
      value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  /**
   * 费雪耶兹 高纳德 洗牌 算法（三个名字，指的都是这个算法）
   *
   * @param  {Object} obj [需要洗牌的数组对象]
   * @return {Array}      [洗牌后的数组]
   *
   * @example
   * _.shuffle([1, 2, 3, 4, 5, 6]);
   * > [4, 1, 6, 3, 5, 2]
   */
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    // 获取传入对象的长度
    var length = set.length;
    // 根据对象长度，创建一个数组
    var shuffled = Array(length);

    // 循环传入对象的长度
    for (var index = 0, rand; index < length; index++) {
      // 根据对象长度的 `index`,生成一个随机数 `rand`
      rand = _.random(0, index);
      // 如果 `rand` 不等于 `index`, 将数组`shuffled`随机值 传入 数组`shuffled`的顺序位置
      if (rand !== index) shuffled[index] = shuffled[rand];
      // 将对象 `set` 的顺序值 传入 数组 `shuffled` 的随机位置
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  /**
   * 取样函数，随机取集合中的某些值成为新的集合。
   *
   * @param  {Array} obj    [数组对象]
   * @param  {Number} n     [要获取都的对象个数]
   * @param  {[type]} guard [description]
   * @return {Number,Array}       [description]
   *
   * @example
   * 从 list中产生一个随机样本。传递一个数字表示从list中返回 `n` 个随机元素。否则将返回一个单一的随机项。
   * _.sample([1, 2, 3, 4, 5, 6]);
   * > 4
   * _.sample([1, 2, 3, 4, 5, 6], 3);
   * > [1, 6, 2]
   *
   */
  _.sample = function(obj, n, guard) {
    // 如果不传入n，随机取一个索引对应的值
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    // 从 洗牌算法 中获取 `n` 个值
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  /**
   * 根据给定的函数，对集合进行排序。
   *
   * @param  {[type]} obj      [description]
   * @param  {[type]} iteratee [迭代器]
   * @param  {[type]} context  [上下文]
   * @return {Array}           [排序后的数组对象]
   *
   * @example 数字排序
   * _.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
   * > [5, 4, 6, 3, 1, 2]
   *
   * @example2 字符串排序
   * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
   * _.sortBy(stooges, 'name');
   * > [{name: 'curly', age: 60}, {name: 'larry', age: 50}, {name: 'moe', age: 40}];
   */
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);

    // 首先，最外面用 `pluck` 包裹，最后会取 `value` 作为新的集合
    return _.pluck(_.map(obj, function(value, index, list) {
      // 对原对象进行处理，返回一个由新对象组成的集合
      return {
        value: value, // 实际值
        index: index, // 索引
        criteria: iteratee(value, index, list) // 要比较的值
      };
    // 然后，调用 `sort` 函数进行排序，首先更具比较值进行比较，一样的话按原顺序排列
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  /**
   * 抽象分组函数
   *
   * @param  {[type]} behavior [行为函数]
   * @return {[type]}          [description]
   */
  var group = function(behavior) {
    /**
     *
     * @param  {[type]} obj         传入集合
     * @param  {Function} iteratee  迭代器
     * @param  {[type]} context     上下文
     * @return {Object}             结果
     */
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        // 进行处理，传入参数为结果、当前值、当前键
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  /**
   * 根据传入的函数对集合进行分组，如果函数处理结果一致则放在同一组。
   *
   * @param  {[type]} result [description]
   * @param  {[type]} value  [description]
   * @param  {Array}  key
   * @return {Object}        [json数组]
   *
   * @example 向下取整 相同的分为一组
   * _.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
   * > {1: [1.3], 2: [2.1, 2.4]}
   *
   * @example 单词长度相同的分为一组
   * _.groupBy(['one', 'two', 'three'], 'length');
   * > {3: ["one", "two"], 5: ["three"]}
   */
  _.groupBy = group(function(result, value, key) {

    // 如果结果中存在 `key` 值而非原型链上的，就放入进去对应的数组，否则创建一个新数组
    if (_.has(result, key)) result[key].push(value);
    else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  /**
   * 根据某个唯一索引，将集合进行分组，需要注意的是，这里应当保证传入的key唯一。
   *
   * @param  {Object} result [对象]
   * @param  {[type]} value  [键]
   * @param  {[type]} key    [值]
   * @return {Object}        [对象]
   *
   * @example
   * var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
   * _.indexBy(stooges, 'age');
   * > {
   *   "40": {name: 'moe', age: 40},
   *   "50": {name: 'larry', age: 50},
   *   "60": {name: 'curly', age: 60}
   * }
   */
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  /**
   * 类似于 `groupBy` ，但是这里是显示数量。
   *
   * @param  {Object} result [对象]
   * @param  {[type]} value  [键]
   * @param  {[type]} key    [值]
   * @return {Object}        [对象]
   *
   * @example
   * _.countBy([1, 2, 3, 4, 5], function(num) {
   *   return num % 2 == 0 ? 'even': 'odd';
   * });
   * > {odd: 3, even: 2}
   */
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++;
    else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    // 如果无参数，返回空数组
    if (!obj) return [];
    // 如果本身是数组，则使用 `slice` 创建一个等价的新数组
    if (_.isArray(obj)) return slice.call(obj);
    // 如果是类数组的对象，直接返回自身构成的新数组
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    // 对象，将其值组成新数组
    return _.values(obj);
  };

  // Return the number of elements in an object.
  /**
   * 返回一个对象的长度
   * @param  {Object} obj [description]
   * @return {Number}     [对象的长度]
   */
  _.size = function(obj) {
    // 如果传入的对象等于 `null` 则返回 0
    if (obj == null) return 0;
    // 如果传入的对象那个是一个类数组,返回传入对象的长度。否则返回对象 `keys` 的长度。
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  /**
   * 根据给定的条件将集合分为两个部分，通过放入第一个数组，不通过放入二个数组。
   *
   * @param  {Object} obj       [要处理的对象]
   * @param  {Function} predicate [判断函数]
   * @param  {[type]} context   [上下文]
   * @return {Array}            [0 通过，1 不通过]
   *
   * @example 奇数放在第一个数组，偶数放在第二个数组。
   * _.partition([0, 1, 2, 3, 4, 5], isOdd);
   * > [[1, 3, 5], [0, 2, 4]]
   */
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [],
      fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // 数组函数
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [],
      idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0,
          len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value) {
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  /**
   * 查找索引的抽象
   *
   * @param  {Number} dir   [1 or -1]
   * @return {Function}     [回调函数]
   */
  function createPredicateIndexFinder(dir) {
    /**
     * 返回 回调函数
     *
     * @param  {Array} array      [要的处理的数组]
     * @param  {Object} predicate [判断条件(key or index)]
     * @param  {[type]} context   [上下文]
     * @return {Number}           [index or -1]
     */
    return function(array, predicate, context) {

      // 假设函数会进行迭代执行
      predicate = cb(predicate, context);

      var length = getLength(array);

      // 根据 `dir` 判断方向
      var index = dir > 0 ? 0 : length - 1;
      // 依次遍历
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  // 查找从左往右第一个符合的
  _.findIndex = createPredicateIndexFinder(1);
  // 查找从右往左第一个符合的
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0,
      high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1;
      else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0,
        length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // 与函数有关的函数
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0,
        length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length,
      key;
    if (length <= 1) throw new Error('bindAll must be passed function names'); // bindAll 必须传递函数名
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  // 对传入的判断函数，将其判断条件取反然后返回新的判断函数。
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments); // 对结果取反
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // 对象函数
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  /**
   * 在IE <9中的键不会被 `for key in ...` 重复，因此错过了。
   *
   * 判断浏览器是否存在枚举bug，如果有，在取反操作前会返回false
   * Object.propertyIsEnumerable: 判断一个对象是否可以枚举
   * @type {Boolean}
   */
  var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
  // 所有需要处理的可能存在枚举问题的属性(不可枚举的属性)
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'
  ];

  // 处理ie9以下的一个枚举bug
  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    // 读取obj的原型
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    // Constructor单独处理部分.
    var prop = 'constructor';

    // 如果对象和 `keys` 都存在 `constructor` 属性，则把他存入 `keys` 数组当中
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      // `nonEnumerableProps` 中的属性出现在 `obj` 中，并且和原型中的同名方法不等，再者 `keys` 中不存在该属性，就添加进去
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  /**
   * @title 遍历对象的key值，并以数组的方式返回
   * 将对象自己的委托的名称检索到 **ECMAScript 5** 的本地 `Object.keys` 。
   *
   * @param  {Object} obj [传入一个对象]
   * @return {Array}      [返回对象的key值]
   */
  _.keys = function(obj) {

    // 如果传入的不是一个对象，返回一个空数组
    if (!_.isObject(obj)) return [];

    // 如果原生的Object.keys存在，则使用Object.keys处理传来的对象
    if (nativeKeys) return nativeKeys(obj);
    /*
      创建一个空数组keys，用来存key
      通过key遍历传来的对象，
      如果 `obj` 的 `key` 存在，则将 `key` push到 `keys`内。
     */
    var keys = [];
    for (var key in obj)
      if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    /*
      咳咳， IE < 9
      这里主要处理ie9以下的浏览器的bug，
      会将对象上一些本该枚举的属性认为不可枚举，详细可以看 collectNonEnumProps 分析
     */
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  /**
   * 传入一个对象，返回对象所有key的数组
   * @param  {Object} obj [需要处理的对象]
   * @return {Array}     [对象所有的key值]
   */
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    // 获取所有的key
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    // 依然是IE9以下枚举bug的兼容处理
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  /**
   * 将对象中的键值对的值取出来组成一个新的数组。
   *
   * @param  {Object} obj [键值对的对象]
   * @return {Array}     [对象的值组成的数组]
   */
  _.values = function(obj) {
    // 取出所有的键
    var keys = _.keys(obj);
    // 取长度
    var length = keys.length;
    // 创建新数组
    var values = Array(length);
    // 依次放入相应的值
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
      length = keys.length,
      results = {},
      currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  // 查找键
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj),
      key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {},
      obj = object,
      iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

  // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  /**
   * @title 是否匹配
   * 告诉你properties中的键和值是否包含在object中。
   *
   * @param  {Object}  object [description]
   * @param  {Object}  attrs  [description]
   * @return {Boolean}        [是否包含]
   *
   * @example
   * var stooge = {name: 'moe', age: 32};
   * _.isMatch(stooge, {age: 32});
   * > true
   */
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs),
      length = keys.length;

    // 如果传入的对象为空，返回非 `length`
    if (object == null) return !length;

    // 转化为对象
    var obj = Object(object);

    // 循环
    for (var i = 0; i < length; i++) {

      // 获取每次的 `key`
      var key = keys[i];

      // 如果 `attrs`的值 和 `obj` 的值 不相等，且 `attrs`的key 不在 `obj` 内。返回 `false`
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }

    // 如果以上条件都满足，返回 `true`
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor,
        bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
          _.isFunction(bCtor) && bCtor instanceof bCtor) &&
        ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a),
        key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  // 执行深度比较以检查两个对象是否相等。
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  // “空”对象没有可枚举的自身属性。
  //
  // 判断传入的对象是否为空
  _.isEmpty = function(obj) {
    // 如果 `obj == null` 直接返回 true
    if (obj == null) return true;

    // 如果传入的对象是一个类数组，且是一个数组或者是字符串或是 `arguments`. 对象的长度为0 返回ture(是空对象)
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;

    // 如果传入的对象上没有 `key` ,说明传入的是个空对象
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  // 判断传入的对象是不是一个DOM元素
  /*
    @title nodeType 返回值
    @extend
    |常量                              |值   |描述
    |----------------------------------|-----|--------------------------------------
    |Node.ELEMENT_NODE                 |1    |一个 `元素` 节点，例如 <p> 和 <div>。
    |Node.TEXT_NODE                    |3    |Element 或者 Attr 中实际的  文字
    |Node.PROCESSING_INSTRUCTION_NODE  |7    |一个用于XML文档的 ProcessingInstruction ，例如 <?xml-stylesheet ... ?> 声明。
    |Node.COMMENT_NODE                 |8    |一个 Comment 节点。
    |Node.DOCUMENT_NODE                |9    |一个 Document 节点。
    |Node.DOCUMENT_TYPE_NODE           |10   |描述文档类型的 DocumentType 节点。例如 <!DOCTYPE html>  就是用于 HTML5 的。
    |Node.DOCUMENT_FRAGMENT_NODE       |11   |一个 DocumentFragment 节点
   */
  _.isElement = function(obj) {
    // 如果 `obj`不为空，且 `obj` 的nodeType绝对等于1，返回true
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  // 判断传来的对象那个是不是个数组
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  /**
   * 判断传入的参数是不是对象
   *
   * @param  {Object}  obj [接收一个对象]
   * @return {Boolean}     [{ture：是对象，false:不是对象}]
   */
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  // 添加一些判断类型方法：`isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.`
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) { // 遍历数组
    // 拼接数组项（前面加is），并赋值个 `_`
    _['is' + name] = function(obj) {
      // 判断每个数组项的类型
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  //
  // 判断是否为arguments, arguments有个特有属性callee。

  // 因为IE<9下对arguments调用Object.prototype.toString.call()，返回的是[object Object]，
  // 而非[object Arguments]，所以遇到这种情况需要判断一下是否还有callee属性。
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  // 如果合适的话，优化`isFunction`。在旧V8中工作一些类型的bug，即IE 11（#1621）和Safari 8（#1929）。
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  // 如果object是一个有限(无穷与无穷小之间)的数字，返回true。
  /**
   * @example
   *  _.isFinite(-101);
   * > true
   * _.isFinite(-Infinity);
   * > false
   */
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  // 判断传入的对象是否是 `NaN`， (NaN 是唯一一个不等于自身的数字).
  _.isNaN = function(obj) {
    // 1. 首先，传入的对象必须是个`Number`类型的
    // 2. 且 自身不等于自身
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  // 判断传入的对象是否是 `boolean` 类型的
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  // 判断传入的对象是否等于 `null`
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  // 判断传入的对象是否等于 `undefined`, `void 0 === undefined`
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  /**
   * 判断对象`obj`上是否有key值
   *
   * @param  {Object}  obj [对象，且不等于null]
   * @param  {String}  key [要判断的key]
   * @return {Boolean}     [对象上是否有key]
   */
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // 实用功能(Utility Functions)
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  /**
   * 改名。将 `_` 全局变量 改为其他名字
   *
   * @return {[type]} [description]
   * @example
   * var underscore = _.noConflict();
   */
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  /**
   * 保持默认迭代的身份函数。
   *
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  // 返回undefined，不论传递给它的是什么参数。 可以用作默认可选的回调参数。
  _.noop = function() {};

  /**
   * 返回一个函数，这个函数返回任何传入的对象的key属性。
   *
   * @type {String}
   * var stooge = {name: 'moe'};
   * 'moe' === _.property('name')(stooge);
   * > true
   */
  _.property = property;

  // Generates a function for a given object that returns a given property.
  /**
   * 和 `_.property` 相反。需要一个对象，并返回一个函数,这个函数将返回一个提供的属性的值。
   *
   * @param  {Object} obj [description]
   * @return {Object}     [description]
   *
   * @example
   * var stooge = {name: 'moe'};
   * _.propertyOf(stooge)('name');
   * > 'moe'
   */
  _.propertyOf = function(obj) {
    return obj == null ? function() {} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  /**
   * 匹配器
   * 返回一个谓词，用于检查一个对象是否有一组给定的 键值对。
   *
   * @param  {Object} attrs [key:value，类型的对象]
   * @return {[type]}       [description]
   *
   * @example
   * var ready = _.matcher({selected: true, visible: true});
   * var readyToGoList = _.filter(list, ready);
   */
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs); // 扩展 `attrs` 为一个键值对 对象
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  /**
   * 一个优化的方式来获得一个当前时间的整数时间戳。 可用于实现定时/动画功能。
   *
   * @return {Date} [返回一个毫秒的时间戳]
   */
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  /**
   * 创建逃生器
   *
   * @param  {[type]} map [description]
   * @return {[type]}     [description]
   */
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  // 处理 HTML
  _.escape = createEscaper(escapeMap);
  // 反处理 HTML
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  // 模板配置
  _.templateSettings = {
    /* 三种渲染模板 */
    /*
      js

      <% %> - to execute some code (执行一些代码),
      包裹的是一些可执行的 `JavaScript` 语句，比如 `if-else` 语句，`for` 循环语句，等等。
    */
    evaluate: /<%([\s\S]+?)%>/g,
    /*
      varaible

      <%= %> 中的内容是插入变量，这里如果不指定score（通过settings.variable来指定），则是从obj中获取。
      interpolate: /\{\{(.+?)\}\}/g ( 自定义成 {{ }} 的形式 )
    */
    interpolate: /<%=([\s\S]+?)%>/g,
    /*
      html

      <%- %> - to print some values HTML escaped （打印一些HTML转义的值）
      和前者相比，多了步 HTML 实体编码的过程，可以有效防止 XSS 攻击。
    */
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  // 当自定义 `templateSettings` 时，如果不想定义插值、评估或逃避正则表达式，则需要一个保证 **不匹配** 的方法。
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  // 需要获取命中部分是否有 ` ', \\ , \r, \n, \u2028 和 \u2029` (行分隔符 和段落分隔符)。如果有的话，需要做一步转义
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  /**
   * [template description]
   * @param  {String} text        模板文本
   * @param  {Object} settings    默认配置
   * @param  {Object} oldSettings 旧的配置
   * @return {[type]}             [description]
   */
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    // 获取可以解析的内容。如果没有提供的话，用默认的配置
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    // 将占位符构造为正则表达式。获取可以解析的全部部分。
    // `evaluate` 是 `js` ，`interpolate` 是变量，`escape` 是 `html`
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    /* 解析模版: */
    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    // 开始构造function 的内容。
    var source = "__p+='";
    /**
     * 依次读取模版的内容，然后把匹配到的内容抽取出来。
     *
     * @param  {RegExp} match       匹配的子串
     * @param  {String} escape      HTML
     * @param  {Object} interpolate 变量
     * @param  {Object} evaluate    js 代码
     * @param  {Number} offset      匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是“abcd”，匹配到的子字符串是“bc”，那么这个参数将是1）
     * @return {Object}             match
     */
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      // 需要做二次过滤，因为模版中可能有js不能执行的部分，如换行符等。
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      // 这一块 是对html做过滤。如果是escape，那么调用_.escape方法。
      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        // 如果是变量，那么直接得到_t = interpolate
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        // 如果是js，可以直接执行。
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      // Adobe VMs 需要返回匹配来产生正确的偏移量。
      return match;
    });
    // 分析完模版，获取可执行的source
    source += "';\n";

    /* 指定数据源： */
    // If a variable is not specified, place data values in local scope.
    // 如果没有指定 `varable` ，那么从 `obj` 中取数据否则从前面拼装一段 取 `arguments` 的过程。
    // 在 `_p` 前面 先获取 `arguments` 。然后再执行`source`
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    /* 封装函数： */
    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      // 封装方法
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    // 指定arguments
    var argument = settings.variable || 'obj';
    // 把模版内容保存在 `source` 属性里面。
    // tops： 执行 `source` 还可以用 `eval()` 来执行，但是本身 `eval` 执行效率很低。先包装为一个 `function`，再调用 `apply`，效率会提升很多。
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  // 创建一个chain函数，用来支持链式调用
  _.chain = function(obj) {
    var instance = _(obj);
    // 是否使用链式操作
    instance._chain = true;
    return instance;
  };

  // OOP 面向对象编程
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  // 如果下划线被称为函数，它将返回一个可以使用 `OO-style` 的被包装对象。
  // 这个包装器保存所有下划线函数的更改版本。包裹的对象可以链接。

  // Helper function to continue chaining intermediate results.
  /**
   * 返回 `_.chain` 里是否调用的结果, 如果为 `true` , 则返回一个被包装的 `Underscore` 对象, 否则返回对象本身
   *
   * @param  {[type]} instance [迭代]
   * @param  {Object} obj      [对象]
   * @return {Boolean}         [description]
   */
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  /**
   *  用于扩展underscore自身的接口函数
   *
   * @param  {Object} obj [description]
   * @return {Object}     [description]
   */
  _.mixin = function(obj) {
    // 通过循环遍历对象来浅拷贝对象属性
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        // 支持链式操作
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  // 将Array.prototype中的相关方法添加到Underscore对象中, 这样Underscore对象也可以直接调用Array.prototype中的方法
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    // 方法引用
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      // 赋给obj引用变量方便调用
      var obj = this._wrapped;
      // 调用Array对应的方法
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      // 支持链式操作
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  // 将所有访问器数组函数添加到包装器中。
  _.each(['concat', 'join', 'slice'], function(name) {
    // 方法引用
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      // 返回Array对象或者封装后的Array
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  // 返回存放在_wrapped属性中的underscore对象
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  // 提供一些方法方便其他情况使用
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  //
  // 对AMD支持的一些处理
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));
/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;
(function(factory) {
	// 判断运行环境
    var registeredInModuleLoader; // 注册模块加载器
    // 当前是 AMD 运行环境
    if (typeof define === 'function' && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
    }
    // 当前是 CommonJS 运行环境
    if (typeof exports === 'object') {
        module.exports = factory();
        registeredInModuleLoader = true;
    }
    // 当前是 浏览器 环境
    if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function() {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function() {
	// 扩展
    function extend() {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[i];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }
    /**
     * decode
     *
     * @param  {String} s 字符串
     * @return {String}   编码后的字符串
     *
     * @description 解URI编码，节省内存
     * @example
     *  处理顺序为 百分号开头 数字 大写字母 结尾的字符串
     * 	decode("%3A")  // ":"
     * 	decode("%2F")  // "/"
     */
    function decode(s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }

    function init(converter) {
        function api() {}

        function set(key, value, attributes) {
        	/* 如果document不存在（不是浏览器环境），直接返回 */
            if (typeof document === 'undefined') {
                return;
            }

            attributes = extend({
                path: '/'
            }, api.defaults, attributes);

            // 如果 attributes.expires（到期时间）是number（数字)
            if (typeof attributes.expires === 'number') {
            	/**
            	 * 将传入的 attributes.expires（数字类型），转为 attributes.expires（时间格式）
            	 *
            	 * new Date() * 1 		当前时间的毫秒数
            	 * attributes.expires 	传入的到期时间
            	 * 864e+5  				24小时的毫秒数
            	 */
                attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
            }

            // We're using "expires" because "max-age" is not supported by IE
            // 我们使用 "expires" 应为 ie 不支持 "max-age"（最大过期时间）
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

            try {
            	// 先将 value 转为字符串，赋值给 result
                var result = JSON.stringify(value);
                // 如果 result 中有 “”
                if (/^[\{\[]/.test(result)) {
                	// 将 result 再赋值给 value
                    value = result;
                }
            } catch (e) {}

            value = converter.write ?
                converter.write(value, key) :
                // 先将 value 转为字符串，然后 encodeURIComponent (编码)
                encodeURIComponent(String(value))
                // 将处理后的值 decodeURIComponent(解码)
                .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

            key = encodeURIComponent(String(key))
                .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                .replace(/[\(\)]/g, escape);

            var stringifiedAttributes = '';
            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }
                stringifiedAttributes += '; ' + attributeName;
                if (attributes[attributeName] === true) {
                    continue;
                }

                // Considers RFC 6265 section 5.2:
                // ...
                // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                //
                //     character:
                // Consume the characters of the unparsed-attributes up to,
                // not including, the first %x3B (";") character.
                // ...
                /**
                 * 考虑RFC 6265第5.2节：
                 * 3. 如果剩余的未解析属性包含％x3B (";")字符:
                 * 		使用未解析属性的字符，而不包括第一个％x3B(";")字符。
                 */
                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
            }
            // 写入处理后的 cookie
            return (document.cookie = key + '=' + value + stringifiedAttributes);
        }

        function get(key, json) {
        	/* 如果document不存在（不是浏览器环境），直接返回 */
            if (typeof document === 'undefined') {
                return;
            }

            var jar = {};
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            // 为了防止for循环，首先分配一个空数组，以防根本没有 cookie。
            /*
                1. 如果 document.cookie 存在，必然为 String（即使什么也没写入，也是个空字符串""）
                    document.cookie.split('; ') 后，cookies 为 [""]。
                    document.cookie 如果写入，一般是这种格式：
                    "userInfo={%22name%22:%22roy%22}; path=/"

                2. 非常巧妙的一点，如果 document.cookie 不存在。
                    则 cookies 为空数组，空数组的长度为0，循环的i也为0,
                    0<0 是 false 所以不会进入循环（节省内存，亦不会报错）
             */
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var i = 0;

            for (; i < cookies.length; i++) {
                // 将 cookies 字符串，以等号分割为数组，赋值给 parts
                var parts = cookies[i].split('=');
                // 取 parts 数组的第二个以后的值，然后重新以等号链接为字符串，赋值给 cookie
                var cookie = parts.slice(1).join('=');
                /*
                    ？？？？？？？？？？？？？
                 */
                if (!json && cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    // parts[0] 取得的是 document.cookie 值的 第一个等号前的元素（即 key）
                    // decode() 解编码
                    var name = decode(parts[0]);
                    // 经过一系列判断后，解码 cookie
                    cookie = (converter.read || converter)(cookie, name) ||
                        decode(cookie);

                    // 如果 json 存在, 即调用的是 Cookies.getJSON
                    if (json) {
                        try {
                            // 解析 cookie 并赋值
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }
                    /*
                        ？？？？？？？？？？？？？
                     */
                    jar[name] = cookie;

                    // 如果传入的 key ，等于解析出来的 key（name），跳过循环。
                    if (key === name) {
                        break;
                    }
                } catch (e) {}
            }
            /*
                ？？？？？？？？？？？？？
             */
            return key ? jar[key] : jar;
        }

        api.set = set;
        api.get = function(key) {
            return get(key, false /* read as raw */ );
        };
        api.getJSON = function(key) {
            return get(key, true /* read as json */ );
        };
        // 直接将 value 写入空字符串，过期时间设置 -1
        api.remove = function(key, attributes) {
            set(key, '', extend(attributes, {
                expires: -1
            }));
        };

        /* 默认参数 */
        api.defaults = {};
        /* 与转换器 */
        api.withConverter = init;

        return api;
    }

    return init(function() {});
}));
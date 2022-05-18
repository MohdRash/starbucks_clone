! function (root, factory) {
    "function" == typeof define && define.amd ? define(function () {
        return factory(root)
    }) : "object" == typeof exports ? module.exports = factory : root.echo = factory(root)
}(this, function (root) {
    "use strict";
    var offset, poll, delay, useDebounce, unload, echo = {},
        callback = function () {},
        inView = function (element, view) {
            var box = element.getBoundingClientRect();
            return box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b
        },
        debounceOrThrottle = function () {
            !useDebounce && poll || (clearTimeout(poll), poll = setTimeout(function () {
                echo.render(), poll = null
            }, delay))
        };
    return echo.init = function (opts) {
        opts = opts || {};
        var offsetAll = opts.offset || 0,
            offsetVertical = opts.offsetVertical || offsetAll,
            offsetHorizontal = opts.offsetHorizontal || offsetAll,
            optionToInt = function (opt, fallback) {
                return parseInt(opt || fallback, 10)
            };
        offset = {
            t: optionToInt(opts.offsetTop, offsetVertical),
            b: optionToInt(opts.offsetBottom, offsetVertical),
            l: optionToInt(opts.offsetLeft, offsetHorizontal),
            r: optionToInt(opts.offsetRight, offsetHorizontal)
        }, delay = optionToInt(opts.throttle, 250), useDebounce = opts.debounce !== !1, unload = !!opts.unload, callback = opts.callback || callback, echo.render(), document.addEventListener ? (root.addEventListener("scroll", debounceOrThrottle, !1), root.addEventListener("load", debounceOrThrottle, !1)) : (root.attachEvent("onscroll", debounceOrThrottle), root.attachEvent("onload", debounceOrThrottle))
    }, echo.render = function () {
        for (var src, elem, nodes = document.querySelectorAll("img[data-echo]"), length = nodes.length, view = {
                l: 0 - offset.l,
                t: 0 - offset.t,
                b: (root.innerHeight || document.documentElement.clientHeight) + offset.b,
                r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
            }, i = 0; i < length; i++) elem = nodes[i], inView(elem, view) ? (unload && elem.setAttribute("data-echo-placeholder", elem.src), elem.src = elem.getAttribute("data-echo"), unload || elem.removeAttribute("data-echo"), callback(elem, "load")) : unload && (src = elem.getAttribute("data-echo-placeholder")) && (elem.src = src, elem.removeAttribute("data-echo-placeholder"), callback(elem, "unload"));
        length || echo.detach()
    }, echo.detach = function () {
        document.removeEventListener ? root.removeEventListener("scroll", debounceOrThrottle) : root.detachEvent("onscroll", debounceOrThrottle), clearTimeout(poll)
    }, echo
}),
function () {
    function createReduce(dir) {
        function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj)
            }
            return memo
        }
        return function (obj, iteratee, memo, context) {
            iteratee = optimizeCb(iteratee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            return arguments.length < 3 && (memo = obj[keys ? keys[index] : index], index += dir), iterator(obj, iteratee, memo, keys, index, length)
        }
    }

    function createPredicateIndexFinder(dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            for (var length = getLength(array), index = dir > 0 ? 0 : length - 1; index >= 0 && index < length; index += dir)
                if (predicate(array[index], index, array)) return index;
            return -1
        }
    }

    function createIndexFinder(dir, predicateFind, sortedIndex) {
        return function (array, item, idx) {
            var i = 0,
                length = getLength(array);
            if ("number" == typeof idx) dir > 0 ? i = idx >= 0 ? idx : Math.max(idx + length, i) : length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
            else if (sortedIndex && idx && length) return idx = sortedIndex(array, item), array[idx] === item ? idx : -1;
            if (item !== item) return idx = predicateFind(slice.call(array, i, length), _.isNaN), idx >= 0 ? idx + i : -1;
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir)
                if (array[idx] === item) return idx;
            return -1
        }
    }

    function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length,
            constructor = obj.constructor,
            proto = _.isFunction(constructor) && constructor.prototype || ObjProto,
            prop = "constructor";
        for (_.has(obj, prop) && !_.contains(keys, prop) && keys.push(prop); nonEnumIdx--;) prop = nonEnumerableProps[nonEnumIdx], prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop) && keys.push(prop)
    }
    var root = this,
        previousUnderscore = root._,
        ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype,
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty,
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create,
        Ctor = function () {},
        _ = function (obj) {
            return obj instanceof _ ? obj : this instanceof _ ? void(this._wrapped = obj) : new _(obj)
        };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = _), exports._ = _) : root._ = _, _.VERSION = "1.8.3";
    var optimizeCb = function (func, context, argCount) {
            if (void 0 === context) return func;
            switch (null == argCount ? 3 : argCount) {
                case 1:
                    return function (value) {
                        return func.call(context, value)
                    };
                case 2:
                    return function (value, other) {
                        return func.call(context, value, other)
                    };
                case 3:
                    return function (value, index, collection) {
                        return func.call(context, value, index, collection)
                    };
                case 4:
                    return function (accumulator, value, index, collection) {
                        return func.call(context, accumulator, value, index, collection)
                    }
            }
            return function () {
                return func.apply(context, arguments)
            }
        },
        cb = function (value, context, argCount) {
            return null == value ? _.identity : _.isFunction(value) ? optimizeCb(value, context, argCount) : _.isObject(value) ? _.matcher(value) : _.property(value)
        };
    _.iteratee = function (value, context) {
        return cb(value, context, 1 / 0)
    };
    var createAssigner = function (keysFunc, undefinedOnly) {
            return function (obj) {
                var length = arguments.length;
                if (length < 2 || null == obj) return obj;
                for (var index = 1; index < length; index++)
                    for (var source = arguments[index], keys = keysFunc(source), l = keys.length, i = 0; i < l; i++) {
                        var key = keys[i];
                        undefinedOnly && void 0 !== obj[key] || (obj[key] = source[key])
                    }
                return obj
            }
        },
        baseCreate = function (prototype) {
            if (!_.isObject(prototype)) return {};
            if (nativeCreate) return nativeCreate(prototype);
            Ctor.prototype = prototype;
            var result = new Ctor;
            return Ctor.prototype = null, result
        },
        property = function (key) {
            return function (obj) {
                return null == obj ? void 0 : obj[key]
            }
        },
        MAX_ARRAY_INDEX = Math.pow(2, 53) - 1,
        getLength = property("length"),
        isArrayLike = function (collection) {
            var length = getLength(collection);
            return "number" == typeof length && length >= 0 && length <= MAX_ARRAY_INDEX
        };
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj))
            for (i = 0, length = obj.length; i < length; i++) iteratee(obj[i], i, obj);
        else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) iteratee(obj[keys[i]], keys[i], obj)
        }
        return obj
    }, _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, results = Array(length), index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj)
        }
        return results
    }, _.reduce = _.foldl = _.inject = createReduce(1), _.reduceRight = _.foldr = createReduce(-1), _.find = _.detect = function (obj, predicate, context) {
        var key;
        if (key = isArrayLike(obj) ? _.findIndex(obj, predicate, context) : _.findKey(obj, predicate, context), void 0 !== key && key !== -1) return obj[key]
    }, _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        return predicate = cb(predicate, context), _.each(obj, function (value, index, list) {
            predicate(value, index, list) && results.push(value)
        }), results
    }, _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context)
    }, _.every = _.all = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return !1
        }
        return !0
    }, _.some = _.any = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return !0
        }
        return !1
    }, _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        return isArrayLike(obj) || (obj = _.values(obj)), ("number" != typeof fromIndex || guard) && (fromIndex = 0), _.indexOf(obj, item, fromIndex) >= 0
    }, _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2),
            isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            return null == func ? func : func.apply(value, args)
        })
    }, _.pluck = function (obj, key) {
        return _.map(obj, _.property(key))
    }, _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs))
    }, _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs))
    }, _.max = function (obj, iteratee, context) {
        var value, computed, result = -(1 / 0),
            lastComputed = -(1 / 0);
        if (null == iteratee && null != obj) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) value = obj[i], value > result && (result = value)
        } else iteratee = cb(iteratee, context), _.each(obj, function (value, index, list) {
            computed = iteratee(value, index, list), (computed > lastComputed || computed === -(1 / 0) && result === -(1 / 0)) && (result = value, lastComputed = computed)
        });
        return result
    }, _.min = function (obj, iteratee, context) {
        var value, computed, result = 1 / 0,
            lastComputed = 1 / 0;
        if (null == iteratee && null != obj) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) value = obj[i], value < result && (result = value)
        } else iteratee = cb(iteratee, context), _.each(obj, function (value, index, list) {
            computed = iteratee(value, index, list), (computed < lastComputed || computed === 1 / 0 && result === 1 / 0) && (result = value, lastComputed = computed)
        });
        return result
    }, _.shuffle = function (obj) {
        for (var rand, set = isArrayLike(obj) ? obj : _.values(obj), length = set.length, shuffled = Array(length), index = 0; index < length; index++) rand = _.random(0, index), rand !== index && (shuffled[index] = shuffled[rand]), shuffled[rand] = set[index];
        return shuffled
    }, _.sample = function (obj, n, guard) {
        return null == n || guard ? (isArrayLike(obj) || (obj = _.values(obj)), obj[_.random(obj.length - 1)]) : _.shuffle(obj).slice(0, Math.max(0, n))
    }, _.sortBy = function (obj, iteratee, context) {
        return iteratee = cb(iteratee, context), _.pluck(_.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            }
        }).sort(function (left, right) {
            var a = left.criteria,
                b = right.criteria;
            if (a !== b) {
                if (a > b || void 0 === a) return 1;
                if (a < b || void 0 === b) return -1
            }
            return left.index - right.index
        }), "value")
    };
    var group = function (behavior) {
        return function (obj, iteratee, context) {
            var result = {};
            return iteratee = cb(iteratee, context), _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key)
            }), result
        }
    };
    _.groupBy = group(function (result, value, key) {
        _.has(result, key) ? result[key].push(value) : result[key] = [value]
    }), _.indexBy = group(function (result, value, key) {
        result[key] = value
    }), _.countBy = group(function (result, value, key) {
        _.has(result, key) ? result[key]++ : result[key] = 1
    }), _.toArray = function (obj) {
        return obj ? _.isArray(obj) ? slice.call(obj) : isArrayLike(obj) ? _.map(obj, _.identity) : _.values(obj) : []
    }, _.size = function (obj) {
        return null == obj ? 0 : isArrayLike(obj) ? obj.length : _.keys(obj).length
    }, _.partition = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var pass = [],
            fail = [];
        return _.each(obj, function (value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value)
        }), [pass, fail]
    }, _.first = _.head = _.take = function (array, n, guard) {
        if (null != array) return null == n || guard ? array[0] : _.initial(array, array.length - n)
    }, _.initial = function (array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (null == n || guard ? 1 : n)))
    }, _.last = function (array, n, guard) {
        if (null != array) return null == n || guard ? array[array.length - 1] : _.rest(array, Math.max(0, array.length - n))
    }, _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, null == n || guard ? 1 : n)
    }, _.compact = function (array) {
        return _.filter(array, _.identity)
    };
    var flatten = function (input, shallow, strict, startIndex) {
        for (var output = [], idx = 0, i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                shallow || (value = flatten(value, shallow, strict));
                var j = 0,
                    len = value.length;
                for (output.length += len; j < len;) output[idx++] = value[j++]
            } else strict || (output[idx++] = value)
        }
        return output
    };
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, !1)
    }, _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1))
    }, _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        _.isBoolean(isSorted) || (context = iteratee, iteratee = isSorted, isSorted = !1), null != iteratee && (iteratee = cb(iteratee, context));
        for (var result = [], seen = [], i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            isSorted ? (i && seen === computed || result.push(value), seen = computed) : iteratee ? _.contains(seen, computed) || (seen.push(computed), result.push(value)) : _.contains(result, value) || result.push(value)
        }
        return result
    }, _.union = function () {
        return _.uniq(flatten(arguments, !0, !0))
    }, _.intersection = function (array) {
        for (var result = [], argsLength = arguments.length, i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if (!_.contains(result, item)) {
                for (var j = 1; j < argsLength && _.contains(arguments[j], item); j++);
                j === argsLength && result.push(item)
            }
        }
        return result
    }, _.difference = function (array) {
        var rest = flatten(arguments, !0, !0, 1);
        return _.filter(array, function (value) {
            return !_.contains(rest, value)
        })
    }, _.zip = function () {
        return _.unzip(arguments)
    }, _.unzip = function (array) {
        for (var length = array && _.max(array, getLength).length || 0, result = Array(length), index = 0; index < length; index++) result[index] = _.pluck(array, index);
        return result
    }, _.object = function (list, values) {
        for (var result = {}, i = 0, length = getLength(list); i < length; i++) values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
        return result
    }, _.findIndex = createPredicateIndexFinder(1), _.findLastIndex = createPredicateIndexFinder(-1), _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        for (var value = iteratee(obj), low = 0, high = getLength(array); low < high;) {
            var mid = Math.floor((low + high) / 2);
            iteratee(array[mid]) < value ? low = mid + 1 : high = mid
        }
        return low
    }, _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex), _.lastIndexOf = createIndexFinder(-1, _.findLastIndex), _.range = function (start, stop, step) {
        null == stop && (stop = start || 0, start = 0), step = step || 1;
        for (var length = Math.max(Math.ceil((stop - start) / step), 0), range = Array(length), idx = 0; idx < length; idx++, start += step) range[idx] = start;
        return range
    };
    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype),
            result = sourceFunc.apply(self, args);
        return _.isObject(result) ? result : self
    };
    _.bind = function (func, context) {
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError("Bind must be called on a function");
        var args = slice.call(arguments, 2),
            bound = function () {
                return executeBound(func, bound, context, this, args.concat(slice.call(arguments)))
            };
        return bound
    }, _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1),
            bound = function () {
                for (var position = 0, length = boundArgs.length, args = Array(length), i = 0; i < length; i++) args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
                for (; position < arguments.length;) args.push(arguments[position++]);
                return executeBound(func, bound, this, this, args)
            };
        return bound
    }, _.bindAll = function (obj) {
        var i, key, length = arguments.length;
        if (length <= 1) throw new Error("bindAll must be passed function names");
        for (i = 1; i < length; i++) key = arguments[i], obj[key] = _.bind(obj[key], obj);
        return obj
    }, _.memoize = function (func, hasher) {
        var memoize = function (key) {
            var cache = memoize.cache,
                address = "" + (hasher ? hasher.apply(this, arguments) : key);
            return _.has(cache, address) || (cache[address] = func.apply(this, arguments)), cache[address]
        };
        return memoize.cache = {}, memoize
    }, _.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () {
            return func.apply(null, args)
        }, wait)
    }, _.defer = _.partial(_.delay, _, 1), _.throttle = function (func, wait, options) {
        var context, args, result, timeout = null,
            previous = 0;
        options || (options = {});
        var later = function () {
            previous = options.leading === !1 ? 0 : _.now(), timeout = null, result = func.apply(context, args), timeout || (context = args = null)
        };
        return function () {
            var now = _.now();
            previous || options.leading !== !1 || (previous = now);
            var remaining = wait - (now - previous);
            return context = this, args = arguments, remaining <= 0 || remaining > wait ? (timeout && (clearTimeout(timeout), timeout = null), previous = now, result = func.apply(context, args), timeout || (context = args = null)) : timeout || options.trailing === !1 || (timeout = setTimeout(later, remaining)), result
        }
    }, _.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result, later = function () {
            var last = _.now() - timestamp;
            last < wait && last >= 0 ? timeout = setTimeout(later, wait - last) : (timeout = null, immediate || (result = func.apply(context, args), timeout || (context = args = null)))
        };
        return function () {
            context = this, args = arguments, timestamp = _.now();
            var callNow = immediate && !timeout;
            return timeout || (timeout = setTimeout(later, wait)), callNow && (result = func.apply(context, args), context = args = null), result
        }
    }, _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func)
    }, _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments)
        }
    }, _.compose = function () {
        var args = arguments,
            start = args.length - 1;
        return function () {
            for (var i = start, result = args[start].apply(this, arguments); i--;) result = args[i].call(this, result);
            return result
        }
    }, _.after = function (times, func) {
        return function () {
            if (--times < 1) return func.apply(this, arguments)
        }
    }, _.before = function (times, func) {
        var memo;
        return function () {
            return --times > 0 && (memo = func.apply(this, arguments)), times <= 1 && (func = null), memo
        }
    }, _.once = _.partial(_.before, 2);
    var hasEnumBug = !{
            toString: null
        }.propertyIsEnumerable("toString"),
        nonEnumerableProps = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) _.has(obj, key) && keys.push(key);
        return hasEnumBug && collectNonEnumProps(obj, keys), keys
    }, _.allKeys = function (obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return hasEnumBug && collectNonEnumProps(obj, keys), keys
    }, _.values = function (obj) {
        for (var keys = _.keys(obj), length = keys.length, values = Array(length), i = 0; i < length; i++) values[i] = obj[keys[i]];
        return values
    }, _.mapObject = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        for (var currentKey, keys = _.keys(obj), length = keys.length, results = {}, index = 0; index < length; index++) currentKey = keys[index], results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        return results
    }, _.pairs = function (obj) {
        for (var keys = _.keys(obj), length = keys.length, pairs = Array(length), i = 0; i < length; i++) pairs[i] = [keys[i], obj[keys[i]]];
        return pairs
    }, _.invert = function (obj) {
        for (var result = {}, keys = _.keys(obj), i = 0, length = keys.length; i < length; i++) result[obj[keys[i]]] = keys[i];
        return result
    }, _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) _.isFunction(obj[key]) && names.push(key);
        return names.sort()
    }, _.extend = createAssigner(_.allKeys), _.extendOwn = _.assign = createAssigner(_.keys), _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        for (var key, keys = _.keys(obj), i = 0, length = keys.length; i < length; i++)
            if (key = keys[i], predicate(obj[key], key, obj)) return key
    }, _.pick = function (object, oiteratee, context) {
        var iteratee, keys, result = {},
            obj = object;
        if (null == obj) return result;
        _.isFunction(oiteratee) ? (keys = _.allKeys(obj), iteratee = optimizeCb(oiteratee, context)) : (keys = flatten(arguments, !1, !1, 1), iteratee = function (value, key, obj) {
            return key in obj
        }, obj = Object(obj));
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i],
                value = obj[key];
            iteratee(value, key, obj) && (result[key] = value)
        }
        return result
    }, _.omit = function (obj, iteratee, context) {
        if (_.isFunction(iteratee)) iteratee = _.negate(iteratee);
        else {
            var keys = _.map(flatten(arguments, !1, !1, 1), String);
            iteratee = function (value, key) {
                return !_.contains(keys, key)
            }
        }
        return _.pick(obj, iteratee, context)
    }, _.defaults = createAssigner(_.allKeys, !0), _.create = function (prototype, props) {
        var result = baseCreate(prototype);
        return props && _.extendOwn(result, props), result
    }, _.clone = function (obj) {
        return _.isObject(obj) ? _.isArray(obj) ? obj.slice() : _.extend({}, obj) : obj
    }, _.tap = function (obj, interceptor) {
        return interceptor(obj), obj
    }, _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs),
            length = keys.length;
        if (null == object) return !length;
        for (var obj = Object(object), i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return !1
        }
        return !0
    };
    var eq = function (a, b, aStack, bStack) {
        if (a === b) return 0 !== a || 1 / a === 1 / b;
        if (null == a || null == b) return a === b;
        a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
        var className = toString.call(a);
        if (className !== toString.call(b)) return !1;
        switch (className) {
            case "[object RegExp]":
            case "[object String]":
                return "" + a == "" + b;
            case "[object Number]":
                return +a !== +a ? +b !== +b : 0 === +a ? 1 / +a === 1 / b : +a === +b;
            case "[object Date]":
            case "[object Boolean]":
                return +a === +b
        }
        var areArrays = "[object Array]" === className;
        if (!areArrays) {
            if ("object" != typeof a || "object" != typeof b) return !1;
            var aCtor = a.constructor,
                bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) return !1
        }
        aStack = aStack || [], bStack = bStack || [];
        for (var length = aStack.length; length--;)
            if (aStack[length] === a) return bStack[length] === b;
        if (aStack.push(a), bStack.push(b), areArrays) {
            if (length = a.length, length !== b.length) return !1;
            for (; length--;)
                if (!eq(a[length], b[length], aStack, bStack)) return !1
        } else {
            var key, keys = _.keys(a);
            if (length = keys.length, _.keys(b).length !== length) return !1;
            for (; length--;)
                if (key = keys[length], !_.has(b, key) || !eq(a[key], b[key], aStack, bStack)) return !1
        }
        return aStack.pop(), bStack.pop(), !0
    };
    _.isEqual = function (a, b) {
        return eq(a, b)
    }, _.isEmpty = function (obj) {
        return null == obj || (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) ? 0 === obj.length : 0 === _.keys(obj).length)
    }, _.isElement = function (obj) {
        return !(!obj || 1 !== obj.nodeType)
    }, _.isArray = nativeIsArray || function (obj) {
        return "[object Array]" === toString.call(obj)
    }, _.isObject = function (obj) {
        var type = typeof obj;
        return "function" === type || "object" === type && !!obj
    }, _.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (name) {
        _["is" + name] = function (obj) {
            return toString.call(obj) === "[object " + name + "]"
        }
    }), _.isArguments(arguments) || (_.isArguments = function (obj) {
        return _.has(obj, "callee")
    }), "function" != typeof /./ && "object" != typeof Int8Array && (_.isFunction = function (obj) {
        return "function" == typeof obj || !1
    }), _.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj))
    }, _.isNaN = function (obj) {
        return _.isNumber(obj) && obj !== +obj
    }, _.isBoolean = function (obj) {
        return obj === !0 || obj === !1 || "[object Boolean]" === toString.call(obj)
    }, _.isNull = function (obj) {
        return null === obj
    }, _.isUndefined = function (obj) {
        return void 0 === obj
    }, _.has = function (obj, key) {
        return null != obj && hasOwnProperty.call(obj, key)
    }, _.noConflict = function () {
        return root._ = previousUnderscore, this
    }, _.identity = function (value) {
        return value
    }, _.constant = function (value) {
        return function () {
            return value
        }
    }, _.noop = function () {}, _.property = property, _.propertyOf = function (obj) {
        return null == obj ? function () {} : function (key) {
            return obj[key]
        }
    }, _.matcher = _.matches = function (attrs) {
        return attrs = _.extendOwn({}, attrs),
            function (obj) {
                return _.isMatch(obj, attrs)
            }
    }, _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum
    }, _.random = function (min, max) {
        return null == max && (max = min, min = 0), min + Math.floor(Math.random() * (max - min + 1))
    }, _.now = Date.now || function () {
        return (new Date).getTime()
    };
    var escapeMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        },
        unescapeMap = _.invert(escapeMap),
        createEscaper = function (map) {
            var escaper = function (match) {
                    return map[match]
                },
                source = "(?:" + _.keys(map).join("|") + ")",
                testRegexp = RegExp(source),
                replaceRegexp = RegExp(source, "g");
            return function (string) {
                return string = null == string ? "" : "" + string, testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string
            }
        };
    _.escape = createEscaper(escapeMap), _.unescape = createEscaper(unescapeMap), _.result = function (object, property, fallback) {
        var value = null == object ? void 0 : object[property];
        return void 0 === value && (value = fallback), _.isFunction(value) ? value.call(object) : value
    };
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id
    }, _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var noMatch = /(.)^/,
        escapes = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        escaper = /\\|'|\r|\n|\u2028|\u2029/g,
        escapeChar = function (match) {
            return "\\" + escapes[match]
        };
    _.template = function (text, settings, oldSettings) {
        !settings && oldSettings && (settings = oldSettings), settings = _.defaults({}, settings, _.templateSettings);
        var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g"),
            index = 0,
            source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            return source += text.slice(index, offset).replace(escaper, escapeChar), index = offset + match.length, escape ? source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" : interpolate ? source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" : evaluate && (source += "';\n" + evaluate + "\n__p+='"), match
        }), source += "';\n", settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
        try {
            var render = new Function(settings.variable || "obj", "_", source)
        } catch (e) {
            throw e.source = source, e
        }
        var template = function (data) {
                return render.call(this, data, _)
            },
            argument = settings.variable || "obj";
        return template.source = "function(" + argument + "){\n" + source + "}", template
    }, _.chain = function (obj) {
        var instance = _(obj);
        return instance._chain = !0, instance
    };
    var result = function (instance, obj) {
        return instance._chain ? _(obj).chain() : obj
    };
    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                return push.apply(args, arguments), result(this, func.apply(_, args))
            }
        })
    }, _.mixin(_), _.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            return method.apply(obj, arguments), "shift" !== name && "splice" !== name || 0 !== obj.length || delete obj[0], result(this, obj)
        }
    }), _.each(["concat", "join", "slice"], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return result(this, method.apply(this._wrapped, arguments))
        }
    }), _.prototype.value = function () {
        return this._wrapped
    }, _.prototype.valueOf = _.prototype.toJSON = _.prototype.value, _.prototype.toString = function () {
        return "" + this._wrapped
    }, "function" == typeof define && define.amd && define("underscore", [], function () {
        return _
    })
}.call(this),
    function (root, factory) {
        if ("function" == typeof define && define.amd) define(["underscore", "jquery", "exports"], function (_, $, exports) {
            root.Backbone = factory(root, exports, _, $)
        });
        else if ("undefined" != typeof exports) {
            var _ = require("underscore");
            factory(root, exports, _)
        } else root.Backbone = factory(root, {}, root._, root.jQuery || root.Zepto || root.ender || root.$)
    }(this, function (root, Backbone, _, $) {
        var previousBackbone = root.Backbone,
            array = [],
            slice = (array.push, array.slice);
        array.splice;
        Backbone.VERSION = "1.1.2", Backbone.$ = $, Backbone.noConflict = function () {
            return root.Backbone = previousBackbone, this
        }, Backbone.emulateHTTP = !1, Backbone.emulateJSON = !1;
        var Events = Backbone.Events = {
                on: function (name, callback, context) {
                    if (!eventsApi(this, "on", name, [callback, context]) || !callback) return this;
                    this._events || (this._events = {});
                    var events = this._events[name] || (this._events[name] = []);
                    return events.push({
                        callback: callback,
                        context: context,
                        ctx: context || this
                    }), this
                },
                once: function (name, callback, context) {
                    if (!eventsApi(this, "once", name, [callback, context]) || !callback) return this;
                    var self = this,
                        once = _.once(function () {
                            self.off(name, once), callback.apply(this, arguments)
                        });
                    return once._callback = callback, this.on(name, once, context)
                },
                off: function (name, callback, context) {
                    var retain, ev, events, names, i, l, j, k;
                    if (!this._events || !eventsApi(this, "off", name, [callback, context])) return this;
                    if (!name && !callback && !context) return this._events = void 0, this;
                    for (names = name ? [name] : _.keys(this._events), i = 0, l = names.length; i < l; i++)
                        if (name = names[i], events = this._events[name]) {
                            if (this._events[name] = retain = [], callback || context)
                                for (j = 0, k = events.length; j < k; j++) ev = events[j], (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) && retain.push(ev);
                            retain.length || delete this._events[name]
                        } return this
                },
                trigger: function (name) {
                    if (!this._events) return this;
                    var args = slice.call(arguments, 1);
                    if (!eventsApi(this, "trigger", name, args)) return this;
                    var events = this._events[name],
                        allEvents = this._events.all;
                    return events && triggerEvents(events, args), allEvents && triggerEvents(allEvents, arguments), this
                },
                stopListening: function (obj, name, callback) {
                    var listeningTo = this._listeningTo;
                    if (!listeningTo) return this;
                    var remove = !name && !callback;
                    callback || "object" != typeof name || (callback = this), obj && ((listeningTo = {})[obj._listenId] = obj);
                    for (var id in listeningTo) obj = listeningTo[id], obj.off(name, callback, this), (remove || _.isEmpty(obj._events)) && delete this._listeningTo[id];
                    return this
                }
            },
            eventSplitter = /\s+/,
            eventsApi = function (obj, action, name, rest) {
                if (!name) return !0;
                if ("object" == typeof name) {
                    for (var key in name) obj[action].apply(obj, [key, name[key]].concat(rest));
                    return !1
                }
                if (eventSplitter.test(name)) {
                    for (var names = name.split(eventSplitter), i = 0, l = names.length; i < l; i++) obj[action].apply(obj, [names[i]].concat(rest));
                    return !1
                }
                return !0
            },
            triggerEvents = function (events, args) {
                var ev, i = -1,
                    l = events.length,
                    a1 = args[0],
                    a2 = args[1],
                    a3 = args[2];
                switch (args.length) {
                    case 0:
                        for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx);
                        return;
                    case 1:
                        for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1);
                        return;
                    case 2:
                        for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1, a2);
                        return;
                    case 3:
                        for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                        return;
                    default:
                        for (; ++i < l;)(ev = events[i]).callback.apply(ev.ctx, args);
                        return
                }
            },
            listenMethods = {
                listenTo: "on",
                listenToOnce: "once"
            };
        _.each(listenMethods, function (implementation, method) {
            Events[method] = function (obj, name, callback) {
                var listeningTo = this._listeningTo || (this._listeningTo = {}),
                    id = obj._listenId || (obj._listenId = _.uniqueId("l"));
                return listeningTo[id] = obj, callback || "object" != typeof name || (callback = this), obj[implementation](name, callback, this), this
            }
        }), Events.bind = Events.on, Events.unbind = Events.off, _.extend(Backbone, Events);
        var Model = Backbone.Model = function (attributes, options) {
            var attrs = attributes || {};
            options || (options = {}), this.cid = _.uniqueId("c"), this.attributes = {}, options.collection && (this.collection = options.collection), options.parse && (attrs = this.parse(attrs, options) || {}), attrs = _.defaults({}, attrs, _.result(this, "defaults")), this.set(attrs, options), this.changed = {}, this.initialize.apply(this, arguments)
        };
        _.extend(Model.prototype, Events, {
            changed: null,
            validationError: null,
            idAttribute: "id",
            initialize: function () {},
            toJSON: function (options) {
                return _.clone(this.attributes)
            },
            sync: function () {
                return Backbone.sync.apply(this, arguments)
            },
            get: function (attr) {
                return this.attributes[attr]
            },
            escape: function (attr) {
                return _.escape(this.get(attr))
            },
            has: function (attr) {
                return null != this.get(attr)
            },
            set: function (key, val, options) {
                var attr, attrs, unset, changes, silent, changing, prev, current;
                if (null == key) return this;
                if ("object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, options || (options = {}), !this._validate(attrs, options)) return !1;
                unset = options.unset, silent = options.silent, changes = [], changing = this._changing, this._changing = !0, changing || (this._previousAttributes = _.clone(this.attributes), this.changed = {}), current = this.attributes, prev = this._previousAttributes, this.idAttribute in attrs && (this.id = attrs[this.idAttribute]);
                for (attr in attrs) val = attrs[attr], _.isEqual(current[attr], val) || changes.push(attr), _.isEqual(prev[attr], val) ? delete this.changed[attr] : this.changed[attr] = val, unset ? delete current[attr] : current[attr] = val;
                if (!silent) {
                    changes.length && (this._pending = options);
                    for (var i = 0, l = changes.length; i < l; i++) this.trigger("change:" + changes[i], this, current[changes[i]], options);
                }
                if (changing) return this;
                if (!silent)
                    for (; this._pending;) options = this._pending, this._pending = !1, this.trigger("change", this, options);
                return this._pending = !1, this._changing = !1, this
            },
            unset: function (attr, options) {
                return this.set(attr, void 0, _.extend({}, options, {
                    unset: !0
                }))
            },
            clear: function (options) {
                var attrs = {};
                for (var key in this.attributes) attrs[key] = void 0;
                return this.set(attrs, _.extend({}, options, {
                    unset: !0
                }))
            },
            hasChanged: function (attr) {
                return null == attr ? !_.isEmpty(this.changed) : _.has(this.changed, attr)
            },
            changedAttributes: function (diff) {
                if (!diff) return !!this.hasChanged() && _.clone(this.changed);
                var val, changed = !1,
                    old = this._changing ? this._previousAttributes : this.attributes;
                for (var attr in diff) _.isEqual(old[attr], val = diff[attr]) || ((changed || (changed = {}))[attr] = val);
                return changed
            },
            previous: function (attr) {
                return null != attr && this._previousAttributes ? this._previousAttributes[attr] : null
            },
            previousAttributes: function () {
                return _.clone(this._previousAttributes)
            },
            fetch: function (options) {
                options = options ? _.clone(options) : {}, void 0 === options.parse && (options.parse = !0);
                var model = this,
                    success = options.success;
                return options.success = function (resp) {
                    return !!model.set(model.parse(resp, options), options) && (success && success(model, resp, options), void model.trigger("sync", model, resp, options))
                }, wrapError(this, options), this.sync("read", this, options)
            },
            save: function (key, val, options) {
                var attrs, method, xhr, attributes = this.attributes;
                if (null == key || "object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, options = _.extend({
                        validate: !0
                    }, options), attrs && !options.wait) {
                    if (!this.set(attrs, options)) return !1
                } else if (!this._validate(attrs, options)) return !1;
                attrs && options.wait && (this.attributes = _.extend({}, attributes, attrs)), void 0 === options.parse && (options.parse = !0);
                var model = this,
                    success = options.success;
                return options.success = function (resp) {
                    model.attributes = attributes;
                    var serverAttrs = model.parse(resp, options);
                    return options.wait && (serverAttrs = _.extend(attrs || {}, serverAttrs)), !(_.isObject(serverAttrs) && !model.set(serverAttrs, options)) && (success && success(model, resp, options), void model.trigger("sync", model, resp, options))
                }, wrapError(this, options), method = this.isNew() ? "create" : options.patch ? "patch" : "update", "patch" === method && (options.attrs = attrs), xhr = this.sync(method, this, options), attrs && options.wait && (this.attributes = attributes), xhr
            },
            destroy: function (options) {
                options = options ? _.clone(options) : {};
                var model = this,
                    success = options.success,
                    destroy = function () {
                        model.trigger("destroy", model, model.collection, options)
                    };
                if (options.success = function (resp) {
                        (options.wait || model.isNew()) && destroy(), success && success(model, resp, options), model.isNew() || model.trigger("sync", model, resp, options)
                    }, this.isNew()) return options.success(), !1;
                wrapError(this, options);
                var xhr = this.sync("delete", this, options);
                return options.wait || destroy(), xhr
            },
            url: function () {
                var base = _.result(this, "urlRoot") || _.result(this.collection, "url") || urlError();
                return this.isNew() ? base : base.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id)
            },
            parse: function (resp, options) {
                return resp
            },
            clone: function () {
                return new this.constructor(this.attributes)
            },
            isNew: function () {
                return !this.has(this.idAttribute)
            },
            isValid: function (options) {
                return this._validate({}, _.extend(options || {}, {
                    validate: !0
                }))
            },
            _validate: function (attrs, options) {
                if (!options.validate || !this.validate) return !0;
                attrs = _.extend({}, this.attributes, attrs);
                var error = this.validationError = this.validate(attrs, options) || null;
                return !error || (this.trigger("invalid", this, error, _.extend(options, {
                    validationError: error
                })), !1)
            }
        });
        var modelMethods = ["keys", "values", "pairs", "invert", "pick", "omit"];
        _.each(modelMethods, function (method) {
            Model.prototype[method] = function () {
                var args = slice.call(arguments);
                return args.unshift(this.attributes), _[method].apply(_, args)
            }
        });
        var Collection = Backbone.Collection = function (models, options) {
                options || (options = {}), options.model && (this.model = options.model), void 0 !== options.comparator && (this.comparator = options.comparator), this._reset(), this.initialize.apply(this, arguments), models && this.reset(models, _.extend({
                    silent: !0
                }, options))
            },
            setOptions = {
                add: !0,
                remove: !0,
                merge: !0
            },
            addOptions = {
                add: !0,
                remove: !1
            };
        _.extend(Collection.prototype, Events, {
            model: Model,
            initialize: function () {},
            toJSON: function (options) {
                return this.map(function (model) {
                    return model.toJSON(options)
                })
            },
            sync: function () {
                return Backbone.sync.apply(this, arguments)
            },
            add: function (models, options) {
                return this.set(models, _.extend({
                    merge: !1
                }, options, addOptions))
            },
            remove: function (models, options) {
                var singular = !_.isArray(models);
                models = singular ? [models] : _.clone(models), options || (options = {});
                var i, l, index, model;
                for (i = 0, l = models.length; i < l; i++) model = models[i] = this.get(models[i]), model && (delete this._byId[model.id], delete this._byId[model.cid], index = this.indexOf(model), this.models.splice(index, 1), this.length--, options.silent || (options.index = index, model.trigger("remove", model, this, options)), this._removeReference(model, options));
                return singular ? models[0] : models
            },
            set: function (models, options) {
                options = _.defaults({}, options, setOptions), options.parse && (models = this.parse(models, options));
                var singular = !_.isArray(models);
                models = singular ? models ? [models] : [] : _.clone(models);
                var i, l, id, model, attrs, existing, sort, at = options.at,
                    targetModel = this.model,
                    sortable = this.comparator && null == at && options.sort !== !1,
                    sortAttr = _.isString(this.comparator) ? this.comparator : null,
                    toAdd = [],
                    toRemove = [],
                    modelMap = {},
                    add = options.add,
                    merge = options.merge,
                    remove = options.remove,
                    order = !(sortable || !add || !remove) && [];
                for (i = 0, l = models.length; i < l; i++) {
                    if (attrs = models[i] || {}, id = attrs instanceof Model ? model = attrs : attrs[targetModel.prototype.idAttribute || "id"], existing = this.get(id)) remove && (modelMap[existing.cid] = !0), merge && (attrs = attrs === model ? model.attributes : attrs, options.parse && (attrs = existing.parse(attrs, options)), existing.set(attrs, options), sortable && !sort && existing.hasChanged(sortAttr) && (sort = !0)), models[i] = existing;
                    else if (add) {
                        if (model = models[i] = this._prepareModel(attrs, options), !model) continue;
                        toAdd.push(model), this._addReference(model, options)
                    }
                    model = existing || model, !order || !model.isNew() && modelMap[model.id] || order.push(model), modelMap[model.id] = !0
                }
                if (remove) {
                    for (i = 0, l = this.length; i < l; ++i) modelMap[(model = this.models[i]).cid] || toRemove.push(model);
                    toRemove.length && this.remove(toRemove, options)
                }
                if (toAdd.length || order && order.length)
                    if (sortable && (sort = !0), this.length += toAdd.length, null != at)
                        for (i = 0, l = toAdd.length; i < l; i++) this.models.splice(at + i, 0, toAdd[i]);
                    else {
                        order && (this.models.length = 0);
                        var orderedModels = order || toAdd;
                        for (i = 0, l = orderedModels.length; i < l; i++) this.models.push(orderedModels[i])
                    } if (sort && this.sort({
                        silent: !0
                    }), !options.silent) {
                    for (i = 0, l = toAdd.length; i < l; i++)(model = toAdd[i]).trigger("add", model, this, options);
                    (sort || order && order.length) && this.trigger("sort", this, options)
                }
                return singular ? models[0] : models
            },
            reset: function (models, options) {
                options || (options = {});
                for (var i = 0, l = this.models.length; i < l; i++) this._removeReference(this.models[i], options);
                return options.previousModels = this.models, this._reset(), models = this.add(models, _.extend({
                    silent: !0
                }, options)), options.silent || this.trigger("reset", this, options), models
            },
            push: function (model, options) {
                return this.add(model, _.extend({
                    at: this.length
                }, options))
            },
            pop: function (options) {
                var model = this.at(this.length - 1);
                return this.remove(model, options), model
            },
            unshift: function (model, options) {
                return this.add(model, _.extend({
                    at: 0
                }, options))
            },
            shift: function (options) {
                var model = this.at(0);
                return this.remove(model, options), model
            },
            slice: function () {
                return slice.apply(this.models, arguments)
            },
            get: function (obj) {
                if (null != obj) return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid]
            },
            at: function (index) {
                return this.models[index]
            },
            where: function (attrs, first) {
                return _.isEmpty(attrs) ? first ? void 0 : [] : this[first ? "find" : "filter"](function (model) {
                    for (var key in attrs)
                        if (attrs[key] !== model.get(key)) return !1;
                    return !0
                })
            },
            findWhere: function (attrs) {
                return this.where(attrs, !0)
            },
            sort: function (options) {
                if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
                return options || (options = {}), _.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(_.bind(this.comparator, this)), options.silent || this.trigger("sort", this, options), this
            },
            pluck: function (attr) {
                return _.invoke(this.models, "get", attr)
            },
            fetch: function (options) {
                options = options ? _.clone(options) : {}, void 0 === options.parse && (options.parse = !0);
                var success = options.success,
                    collection = this;
                return options.success = function (resp) {
                    var method = options.reset ? "reset" : "set";
                    collection[method](resp, options), success && success(collection, resp, options), collection.trigger("sync", collection, resp, options)
                }, wrapError(this, options), this.sync("read", this, options)
            },
            create: function (model, options) {
                if (options = options ? _.clone(options) : {}, !(model = this._prepareModel(model, options))) return !1;
                options.wait || this.add(model, options);
                var collection = this,
                    success = options.success;
                return options.success = function (model, resp) {
                    options.wait && collection.add(model, options), success && success(model, resp, options)
                }, model.save(null, options), model
            },
            parse: function (resp, options) {
                return resp
            },
            clone: function () {
                return new this.constructor(this.models)
            },
            _reset: function () {
                this.length = 0, this.models = [], this._byId = {}
            },
            _prepareModel: function (attrs, options) {
                if (attrs instanceof Model) return attrs;
                options = options ? _.clone(options) : {}, options.collection = this;
                var model = new this.model(attrs, options);
                return model.validationError ? (this.trigger("invalid", this, model.validationError, options), !1) : model
            },
            _addReference: function (model, options) {
                this._byId[model.cid] = model, null != model.id && (this._byId[model.id] = model), model.collection || (model.collection = this), model.on("all", this._onModelEvent, this)
            },
            _removeReference: function (model, options) {
                this === model.collection && delete model.collection, model.off("all", this._onModelEvent, this)
            },
            _onModelEvent: function (event, model, collection, options) {
                ("add" !== event && "remove" !== event || collection === this) && ("destroy" === event && this.remove(model, options), model && event === "change:" + model.idAttribute && (delete this._byId[model.previous(model.idAttribute)], null != model.id && (this._byId[model.id] = model)), this.trigger.apply(this, arguments))
            }
        });
        var methods = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain", "sample"];
        _.each(methods, function (method) {
            Collection.prototype[method] = function () {
                var args = slice.call(arguments);
                return args.unshift(this.models), _[method].apply(_, args)
            }
        });
        var attributeMethods = ["groupBy", "countBy", "sortBy", "indexBy"];
        _.each(attributeMethods, function (method) {
            Collection.prototype[method] = function (value, context) {
                var iterator = _.isFunction(value) ? value : function (model) {
                    return model.get(value)
                };
                return _[method](this.models, iterator, context)
            }
        });
        var View = Backbone.View = function (options) {
                this.cid = _.uniqueId("view"), options || (options = {}), _.extend(this, _.pick(options, viewOptions)), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
            },
            delegateEventSplitter = /^(\S+)\s*(.*)$/,
            viewOptions = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
        _.extend(View.prototype, Events, {
            tagName: "div",
            $: function (selector) {
                return this.$el.find(selector)
            },
            initialize: function () {},
            render: function () {
                return this
            },
            remove: function () {
                return this.$el.remove(), this.stopListening(), this
            },
            setElement: function (element, delegate) {
                return this.$el && this.undelegateEvents(), this.$el = element instanceof Backbone.$ ? element : Backbone.$(element), this.el = this.$el[0], delegate !== !1 && this.delegateEvents(), this
            },
            delegateEvents: function (events) {
                if (!events && !(events = _.result(this, "events"))) return this;
                this.undelegateEvents();
                for (var key in events) {
                    var method = events[key];
                    if (_.isFunction(method) || (method = this[events[key]]), method) {
                        var match = key.match(delegateEventSplitter),
                            eventName = match[1],
                            selector = match[2];
                        method = _.bind(method, this), eventName += ".delegateEvents" + this.cid, "" === selector ? this.$el.on(eventName, method) : this.$el.on(eventName, selector, method)
                    }
                }
                return this
            },
            undelegateEvents: function () {
                return this.$el.off(".delegateEvents" + this.cid), this
            },
            _ensureElement: function () {
                if (this.el) this.setElement(_.result(this, "el"), !1);
                else {
                    var attrs = _.extend({}, _.result(this, "attributes"));
                    this.id && (attrs.id = _.result(this, "id")), this.className && (attrs["class"] = _.result(this, "className"));
                    var $el = Backbone.$("<" + _.result(this, "tagName") + ">").attr(attrs);
                    this.setElement($el, !1)
                }
            }
        }), Backbone.sync = function (method, model, options) {
            var type = methodMap[method];
            _.defaults(options || (options = {}), {
                emulateHTTP: Backbone.emulateHTTP,
                emulateJSON: Backbone.emulateJSON
            });
            var params = {
                type: type,
                dataType: "json"
            };
            if (options.url || (params.url = _.result(model, "url") || urlError()), null != options.data || !model || "create" !== method && "update" !== method && "patch" !== method || (params.contentType = "application/json", params.data = JSON.stringify(options.attrs || model.toJSON(options))), options.emulateJSON && (params.contentType = "application/x-www-form-urlencoded", params.data = params.data ? {
                    model: params.data
                } : {}), options.emulateHTTP && ("PUT" === type || "DELETE" === type || "PATCH" === type)) {
                params.type = "POST", options.emulateJSON && (params.data._method = type);
                var beforeSend = options.beforeSend;
                options.beforeSend = function (xhr) {
                    if (xhr.setRequestHeader("X-HTTP-Method-Override", type), beforeSend) return beforeSend.apply(this, arguments)
                }
            }
            "GET" === params.type || options.emulateJSON || (params.processData = !1), "PATCH" === params.type && noXhrPatch && (params.xhr = function () {
                return new ActiveXObject("Microsoft.XMLHTTP")
            });
            var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
            return model.trigger("request", model, xhr, options), xhr
        };
        var noXhrPatch = !("undefined" == typeof window || !window.ActiveXObject || window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent),
            methodMap = {
                create: "POST",
                update: "PUT",
                patch: "PATCH",
                "delete": "DELETE",
                read: "GET"
            };
        Backbone.ajax = function () {
            return Backbone.$.ajax.apply(Backbone.$, arguments)
        };
        var Router = Backbone.Router = function (options) {
                options || (options = {}), options.routes && (this.routes = options.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
            },
            optionalParam = /\((.*?)\)/g,
            namedParam = /(\(\?)?:\w+/g,
            splatParam = /\*\w+/g,
            escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
        _.extend(Router.prototype, Events, {
            initialize: function () {},
            route: function (route, name, callback) {
                _.isRegExp(route) || (route = this._routeToRegExp(route)), _.isFunction(name) && (callback = name, name = ""), callback || (callback = this[name]);
                var router = this;
                return Backbone.history.route(route, function (fragment) {
                    var args = router._extractParameters(route, fragment);
                    router.execute(callback, args), router.trigger.apply(router, ["route:" + name].concat(args)), router.trigger("route", name, args), Backbone.history.trigger("route", router, name, args)
                }), this
            },
            execute: function (callback, args) {
                callback && callback.apply(this, args)
            },
            navigate: function (fragment, options) {
                return Backbone.history.navigate(fragment, options), this
            },
            _bindRoutes: function () {
                if (this.routes) {
                    this.routes = _.result(this, "routes");
                    for (var route, routes = _.keys(this.routes); null != (route = routes.pop());) this.route(route, this.routes[route])
                }
            },
            _routeToRegExp: function (route) {
                return route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function (match, optional) {
                    return optional ? match : "([^/?]+)"
                }).replace(splatParam, "([^?]*?)"), new RegExp("^" + route + "(?:\\?([\\s\\S]*))?$")
            },
            _extractParameters: function (route, fragment) {
                var params = route.exec(fragment).slice(1);
                return _.map(params, function (param, i) {
                    return i === params.length - 1 ? param || null : param ? decodeURIComponent(param) : null
                })
            }
        });
        var History = Backbone.History = function () {
                this.handlers = [], _.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, this.history = window.history)
            },
            routeStripper = /^[#\/]|\s+$/g,
            rootStripper = /^\/+|\/+$/g,
            isExplorer = /msie [\w.]+/,
            trailingSlash = /\/$/,
            pathStripper = /#.*$/;
        History.started = !1, _.extend(History.prototype, Events, {
            interval: 50,
            atRoot: function () {
                return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root
            },
            getHash: function (window) {
                var match = (window || this).location.href.match(/#(.*)$/);
                return match ? match[1] : ""
            },
            getFragment: function (fragment, forcePushState) {
                if (null == fragment)
                    if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                        fragment = decodeURI(this.location.pathname + this.location.search);
                        var root = this.root.replace(trailingSlash, "");
                        fragment.indexOf(root) || (fragment = fragment.slice(root.length))
                    } else fragment = this.getHash();
                return fragment.replace(routeStripper, "")
            },
            start: function (options) {
                if (History.started) throw new Error("Backbone.history has already been started");
                History.started = !0, this.options = _.extend({
                    root: "/"
                }, this.options, options), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
                var fragment = this.getFragment(),
                    docMode = document.documentMode,
                    oldIE = isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7);
                if (this.root = ("/" + this.root + "/").replace(rootStripper, "/"), oldIE && this._wantsHashChange) {
                    var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
                    this.iframe = frame.hide().appendTo("body")[0].contentWindow, this.navigate(fragment)
                }
                this._hasPushState ? Backbone.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !oldIE ? Backbone.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = fragment;
                var loc = this.location;
                if (this._wantsHashChange && this._wantsPushState) {
                    if (!this._hasPushState && !this.atRoot()) return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + "#" + this.fragment), !0;
                    this._hasPushState && this.atRoot() && loc.hash && (this.fragment = this.getHash().replace(routeStripper, ""), this.history.replaceState({}, document.title, this.root + this.fragment))
                }
                if (!this.options.silent) return this.loadUrl()
            },
            stop: function () {
                Backbone.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), this._checkUrlInterval && clearInterval(this._checkUrlInterval), History.started = !1
            },
            route: function (route, callback) {
                this.handlers.unshift({
                    route: route,
                    callback: callback
                })
            },
            checkUrl: function (e) {
                var current = this.getFragment();
                return current === this.fragment && this.iframe && (current = this.getFragment(this.getHash(this.iframe))), current !== this.fragment && (this.iframe && this.navigate(current), void this.loadUrl())
            },
            loadUrl: function (fragment) {
                return fragment = this.fragment = this.getFragment(fragment), _.any(this.handlers, function (handler) {
                    if (handler.route.test(fragment)) return handler.callback(fragment), !0
                })
            },
            navigate: function (fragment, options) {
                if (!History.started) return !1;
                options && options !== !0 || (options = {
                    trigger: !!options
                });
                var url = this.root + (fragment = this.getFragment(fragment || ""));
                if (fragment = fragment.replace(pathStripper, ""), this.fragment !== fragment) {
                    if (this.fragment = fragment, "" === fragment && "/" !== url && (url = url.slice(0, -1)), this._hasPushState) this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url);
                    else {
                        if (!this._wantsHashChange) return this.location.assign(url);
                        this._updateHash(this.location, fragment, options.replace), this.iframe && fragment !== this.getFragment(this.getHash(this.iframe)) && (options.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, fragment, options.replace))
                    }
                    return options.trigger ? this.loadUrl(fragment) : void 0
                }
            },
            _updateHash: function (location, fragment, replace) {
                if (replace) {
                    var href = location.href.replace(/(javascript:|#).*$/, "");
                    location.replace(href + "#" + fragment)
                } else location.hash = "#" + fragment
            }
        }), Backbone.history = new History;
        var extend = function (protoProps, staticProps) {
            var child, parent = this;
            child = protoProps && _.has(protoProps, "constructor") ? protoProps.constructor : function () {
                return parent.apply(this, arguments)
            }, _.extend(child, parent, staticProps);
            var Surrogate = function () {
                this.constructor = child
            };
            return Surrogate.prototype = parent.prototype, child.prototype = new Surrogate, protoProps && _.extend(child.prototype, protoProps), child.__super__ = parent.prototype, child
        };
        Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
        var urlError = function () {
                throw new Error('A "url" property or function must be specified')
            },
            wrapError = function (model, options) {
                var error = options.error;
                options.error = function (resp) {
                    error && error(model, resp, options), model.trigger("error", model, resp, options)
                }
            };
        return Backbone
    });
var ourCoffees = ourCoffees || {};
ourCoffees.eventTracker = _.extend({}, Backbone.Events), ourCoffees.DrawerView = function ($, rwd, vent) {
    return Backbone.View.extend({
        template: "#coffeeDetails-template",
        className: "coffeeDetails",
        initialize: function (options) {
            var self = this;
            this.model = options.model, this.element = options.element, this.windowWidth = $(window).width(), this.drawerClass = ".coffeeDetails", this.template = _.template($(this.template).html()), rwd.onDelayedResize(function () {
                $(window).width() != self.windowWidth && self.isOpen() && ($(".coffeeItem .minor a.less").toggleClass("less more"), self.close(), self.windowWidth = $(window).width())
            }, !1)
        },
        render: function () {
            if (this.isOpen()) {
                var oldLink = $(".coffeeItem .minor a.less").toggleClass("less more");
                if (oldLink.parents(".coffeeItem").offset().top === this.element.offset().top) {
                    var that = this;
                    $(this.drawerClass).find(".marker").animate({
                        left: that.element.offset().left + that.element.width() / 2
                    }, 200, function () {
                        that.moveDrawer()
                    })
                } else this.close(this.element)
            } else this.moveDrawer();
            return this
        },
        close: function (reopen) {
            var that = this;
            $(this.drawerClass).slideUp(function () {
                $(this).remove(), reopen && that.moveDrawer(reopen, that.$el)
            })
        },
        isOpen: function () {
            return $(this.drawerClass).is(":visible")
        },
        moveDrawer: function (allowShortening) {
            var drawer = this.isOpen() ? $(this.drawerClass) : this.$el;
            this.$el.css("margin-left", $(".coffeeItems").width() / 2 - $(window).width() / 2);
            var top = this.element.offset().top,
                $blocks = this.element.nextAll(".coffeeItem");
            0 === $blocks.length && this.element.after(drawer), $blocks.each(function (i) {
                return $(this).offset().top != top ? ($(this).prev(".coffeeItem").after(drawer), !1) : i + 1 === $blocks.length ? ($(this).after(drawer), !1) : void 0
            }), drawer.html(this.template(this.model.attributes)).attr("id", this.model.get("roast")), drawer.find(".marker").css("left", this.element.offset().left + this.element.width() / 2), drawer.slideDown(300, function () {
                var containerHeight = drawer.find(".container").height() + 50;
                (containerHeight > drawer.height() || allowShortening === !0) && drawer.animate({
                    height: containerHeight
                }, 150), drawer.css("display", "inline-block")
            }), this.$el = drawer, vent.trigger("trackEvent", {
                action: "DrawerOpen",
                label: "Learn more"
            })
        }
    })
}(jQuery, sb.rwd, ourCoffees.eventTracker);
var ourCoffees = ourCoffees || {};
ourCoffees.Filter = function () {
    return Backbone.Model.extend({
        defaults: {
            val: "",
            name: "",
            category: "",
            selected: !1
        },
        select: function () {
            this.set({
                selected: !0
            })
        },
        deselect: function () {
            this.set("selected", !1)
        }
    })
}(), ourCoffees.FilterView = function ($, vent) {
    return Backbone.View.extend({
        tagName: "li",
        events: {
            click: "filterChanged",
            keypress: "filterChanged"
        },
        initialize: function () {
            this.listenTo(this.model, "change:selected", this.toggleSelected)
        },
        filterChanged: function (e) {
            "click" != e.type && 13 != e.which || this.$el.parent().height() > 0 && (this.$el.hasClass("selected") ? this.model.deselect() : this.model.select())
        },
        toggleSelected: function () {
            this.model.get("selected") ? (this.$el.addClass("selected"), this.$el.attr("aria-checked", !0)) : (this.$el.removeClass("selected"), this.$el.attr("aria-checked", !1)), vent.trigger("trackEvent", {
                action: "FilterClicked",
                label: this.model.get("val")
            })
        },
        render: function () {
            return this.$el.html(this.model.get("name")), this
        }
    })
}(jQuery, ourCoffees.eventTracker);
var ourCoffees = ourCoffees || {};
ourCoffees.FilterList = function (Filter) {
    "use strict";
    return Backbone.Collection.extend({
        model: Filter,
        setRequestedFeatures: function (features) {
            this.requestedFeatures = features, this.trigger("filterRequested")
        }
    })
}(ourCoffees.Filter), ourCoffees.FiltersView = function (Filter, FilterView) {
    "use strict";
    return Backbone.View.extend({
        el: ".coffeeFilters",
        events: {
            "click .coffeeFilters > li": "toggleSubfilters"
        },
        initialize: function (options) {
            this.config = options.config, this.route = options.route, this.toggleFilterLink = $("#ToggleFilters"), this.toggleFilterLink.addClass("less").html(this.config.hideFilters), this.resetFiltersLink = $("#ResetFilters"), this.breadCrumbArea = $(".coffeeBCrumbs");
            var that = this;
            this.toggleFilterLink.click(function (e) {
                e.preventDefault(), that.toggleFilters(that.toggleFilterLink, that.resetFiltersLink, that.breadCrumbArea, that.$el, that.config)
            }), this.resetFiltersLink.click(function (e) {
                e.preventDefault(), that.resetFilters()
            }), this.breadCrumbArea.on("click", ".breadCrumb", function () {
                var breadcrumb = $(this);
                that.collection.each(function (filter) {
                    if (filter.get("val") == breadcrumb.data("filter")) return filter.set("selected", !1), breadcrumb.remove(), !1
                })
            }), this.listenTo(this.collection, "change:selected", this.updateRoute), this.listenTo(this.collection, "change:selected", this.handleBreadcrumbs), this.render()
        },
        render: function () {
            var currentCategory = "",
                that = this,
                tabindex = 1;
            this.collection.each(function (filter) {
                var category = filter.get("category");
                category != currentCategory && that.$el.append("<li class='" + ("format" == category ? "less" : "more") + " filter' >" + filter.get("catName") + "<span class='tags all'>" + that.config.all + "</span><ul class='" + category + "'></ul></li>");
                var f = new FilterView({
                    model: filter
                }).render().el;
                that.$("ul." + category).append($(f).attr({
                    tabindex: tabindex++,
                    role: "checkbox",
                    "aria-checked": "false"
                })), currentCategory = category
            })
        },
        updateRoute: function () {
            var newRoute = "",
                that = this,
                selectedCategories = this.getSelectedCategories();
            selectedCategories.length ? this.resetFiltersLink.addClass("filtersApplied") : this.resetFiltersLink.removeClass("filtersApplied"), $.each(selectedCategories, function (i, category) {
                newRoute += "/" + category + "/";
                var items = that.collection.where({
                    category: category,
                    selected: !0
                });
                newRoute += _.map(items, function (filterItems) {
                    return filterItems.get("val")
                }).join(",")
            }), this.route.set("routeString", newRoute)
        },
        getSelectedCategories: function () {
            var selectedCategories = this.collection.where({
                selected: !0
            });
            return _.uniq(_.map(selectedCategories, function (cat) {
                return cat.get("category")
            }))
        },
        toggleSubfilters: function (event) {
            event.stopPropagation();
            var target = $(event.target);
            target.parent().hasClass("coffeeFilters") && document.body.clientWidth < 481 && (this.$el.find("> li").not(target).removeClass("less").addClass("more"), target.toggleClass("more less"))
        },
        toggleFilters: function (toggleFilterLink, resetFiltersLink, breadCrumbArea, filters, config) {
            toggleFilterLink.hasClass("less") ? toggleFilterLink.html(config.showFilters) : toggleFilterLink.html(config.hideFilters), breadCrumbArea.toggleClass("more"), resetFiltersLink.toggleClass("more"), toggleFilterLink.toggleClass("more less"), filters.slideToggle()
        },
        resetFilters: function () {
            this.collection.each(function (filter) {
                filter.set("selected", !1)
            })
        },
        handleBreadcrumbs: function (changed) {
            var $filter = $(".filter").find("." + changed.attributes.category),
                $tagArea = $filter.siblings(".tags").empty(),
                selectedForCategory = this.collection.where({
                    selected: !0,
                    category: changed.attributes.category
                }).map(function (filter) {
                    return filter.attributes.name
                });
            0 != selectedForCategory.length && selectedForCategory.length != $filter.find("li").length ? $tagArea.append(selectedForCategory.join(", ")).removeClass("all") : $tagArea.append(this.config.all).addClass("all");
            var breadCrumbs = this.breadCrumbArea.empty();
            _.each(this.collection.models, function (filter) {
                1 == filter.attributes.selected && breadCrumbs.append('<a class="breadCrumb" data-filter="' + filter.attributes.val + '">' + filter.attributes.name + "</a>")
            })
        }
    })
}(ourCoffees.Filter, ourCoffees.FilterView);
var ourCoffees = ourCoffees || {};
ourCoffees.CoffeeItem = function () {
    return Backbone.Model.extend({
        defaults: {
            name: "",
            roast: "",
            roastDisplay: "",
            params: "",
            image: "",
            imageAlt: "",
            detailUrl: "",
            storeUrl: "",
            details: "",
            shortDescription: "",
            drawerImage: "",
            isOnline: !0,
            isLocal: !0,
            isStore: !0
        }
    })
}();
var _gaq = _gaq || [];
! function (Drawer, tracker) {
    ourCoffees.eventTracker.on("renderDrawer", function (args) {
        var drawer = new Drawer({
            model: args.model,
            element: args.element
        });
        args.doClose ? drawer.close() : drawer.render()
    }), ourCoffees.eventTracker.on("trackEvent", function (args) {
        var action = args.action || "",
            label = args.label || "",
            value = args.value || (sb && sb.rwd && sb.rwd.viewportWidth ? sb.rwd.viewportWidth() : 0);
        tracker && tracker.push && action && tracker.push(["_trackEvent", "OurCoffeesGoogle", action, label, value])
    })
}(ourCoffees.DrawerView, _gaq), ourCoffees.CoffeeView = function ($, vent) {
    return Backbone.View.extend({
        template: "#coffee-template",
        className: "coffeeItem",
        events: {
            "click .minor a": "drawDrawer"
        },
        initialize: function () {
            this.template = _.template($(this.template).html())
        },
        render: function () {
            return this.$el.html(this.template(this.model.attributes)), this
        },
        drawDrawer: function (event) {
            event.preventDefault();
            var link = this.$el.find(".minor a");
            vent.trigger("renderDrawer", {
                element: this.$el,
                model: this.model,
                doClose: link.hasClass("less")
            }), link.toggleClass("less more")
        }
    })
}(jQuery, ourCoffees.eventTracker);
var ourCoffees = ourCoffees || {};
ourCoffees.Route = function () {
    return Backbone.Model.extend({})
}(jQuery);
var ourCoffees = ourCoffees || {};
ourCoffees.CoffeeList = function (CoffeeItem) {
    "use strict";
    return Backbone.Collection.extend({
        model: CoffeeItem
    })
}(ourCoffees.CoffeeItem), ourCoffees.CoffeesView = function (CoffeeView, CoffeeList) {
    return Backbone.View.extend({
        el: ".coffeeItems",
        initialize: function (options) {
            this.filters = options.filters, this.collection = options.collection, this.config = options.config, this.filteredCollection = new CoffeeList(this.collection.models), this.CoffeeCount = $("#CoffeeCount"), this.listenTo(this.filters, "change:selected", this.getFilteredCollection), this.listenTo(this.filteredCollection, "reset", this.render), this.render()
        },
        render: function () {
            return this.addAll(), this.filteredCollection.length > 1 ? this.CoffeeCount.html(this.config.resultsFound.replace("{0}", this.filteredCollection.length)) : 1 == this.filteredCollection.length ? this.CoffeeCount.html(this.config.resultFound) : this.CoffeeCount.html(this.config.noResultsFound), this
        },
        addAll: function () {
            this.$el.empty();
            var container = document.createDocumentFragment();
            this.filteredCollection.each(function (coffee) {
                container.appendChild(new CoffeeView({
                    model: coffee
                }).render().el)
            }, this), this.$el.append(container), echo.init({
                offset: 0,
                throttle: 250,
                unload: !1,
                callback: function (element, op) {
                    $(element).addClass("active"), $(element).parent().css("background-image", "none")
                }
            })
        },
        getFilteredCollection: function () {
            return this.filteredCollection.reset(this.getFilteredCoffees()), this
        },
        getFilteredCoffees: function () {
            var self = this,
                filteredCoffees = this.collection.models,
                selectedFilters = _.groupBy(this.filters.where({
                    selected: !0
                }), function (filter) {
                    return filter.get("category")
                });
            return _.each(selectedFilters, function (filterGroup) {
                var addedFilteredCoffees = [];
                _.each(filterGroup, function (filter) {
                    var filterVal = filter.get("val"),
                        filtered = _.filter(self.collection.models, function (coffee) {
                            if (_.indexOf(coffee.get("params"), filterVal) !== -1) return coffee
                        });
                    addedFilteredCoffees = addedFilteredCoffees.concat(filtered)
                }), filteredCoffees = _.intersection(filteredCoffees, addedFilteredCoffees)
            }, this), filteredCoffees
        }
    })
}(ourCoffees.CoffeeView, ourCoffees.CoffeeList);
var ourCoffees = ourCoffees || {},
    configData = configData || {};
ourCoffees.CoffeesRouter = function (configData, FiltersView, FilterList, CoffeesView, CoffeeList, Route) {
    return Backbone.Router.extend({
        routes: {
            "format/:form/roast/:roast/caffeine/:caf/flavored/:fla/buy/:loc": "setFilterFive",
            "format/:form/roast/:roast/caffeine/:caf/flavored/:fla": "setFilterFour",
            "format/:form/roast/:roast/caffeine/:caf/buy/:loc": "setFilterFour",
            "format/:form/roast/:roast/flavored/:fla/buy/:loc": "setFilterFour",
            "format/:form/caffeine/:caf/flavored/:fla/buy/:loc": "setFilterFour",
            "roast/:roast/caffeine/:caf/flavored/:fla/buy/:loc": "setFilterFour",
            "format/:form/roast/:roast/caffeine/:caf": "setFilterThree",
            "format/:form/roast/:roast/flavored/:fla": "setFilterThree",
            "format/:form/roast/:roast/buy/:loc": "setFilterThree",
            "format/:form/caffeine/:caf/flavored/:fla": "setFilterThree",
            "format/:form/caffeine/:caf/buy/:loc": "setFilterThree",
            "format/:form/flavored/:fla/buy/:loc": "setFilterThree",
            "roast/:roast/caffeine/:caf/flavored/:fla": "setFilterThree",
            "roast/:roast/caffeine/:caf/buy/:loc": "setFilterThree",
            "caffeine/:caf/flavored/:fla/buy/:loc": "setFilterThree",
            "format/:form/roast/:roast": "setFilterTwo",
            "format/:form/caffeine/:caf": "setFilterTwo",
            "format/:form/flavored/:fla": "setFilterTwo",
            "format/:form/buy/:loc": "setFilterTwo",
            "roast/:roast/caffeine/:caf": "setFilterTwo",
            "roast/:roast/flavored/:fla": "setFilterTwo",
            "roast/:roast/buy/:loc": "setFilterTwo",
            "caffeine/:caf/flavored/:fla": "setFilterTwo",
            "caffeine/:caf/buy/:loc": "setFilterTwo",
            "flavored/:fla/buy/:loc": "setFilterTwo",
            "format/:form": "setFilterOne",
            "roast/:roast": "setFilterOne",
            "caffeine/:caf": "setFilterOne",
            "flavored/:fla": "setFilterOne",
            "buy/:loc": "setFilterOne",
            "*path": "defaultRoute"
        },
        defaultRoute: function () {
            _.each(this.filtersView.collection.models, function (filterValue) {
                filterValue.deselect()
            })
        },
        setFilterOne: function (params) {
            this.selectFilters(params.split(","))
        },
        setFilterTwo: function (params1, params2) {
            this.setFilterOne(params1 + "," + params2)
        },
        setFilterThree: function (params1, params2, params3) {
            this.setFilterOne(params1 + "," + params2 + "," + params3)
        },
        setFilterFour: function (params1, params2, params3, params4) {
            this.setFilterOne(params1 + "," + params2 + "," + params3 + "," + params4)
        },
        setFilterFive: function (params1, params2, params3, params4, params5) {
            this.setFilterOne(params1 + "," + params2 + "," + params3 + "," + params4 + "," + params5)
        },
        // updateUrl: function () {
        //     this.navigate(this.route.get("routeString"))
        // },
        selectFilters: function (filterList) {
            _.each(this.filtersView.collection.models, function (filterValue) {
                _.contains(filterList, filterValue.attributes.val) ? filterValue.select() : filterValue.deselect()
            })
        },
        initialize: function () {
            this.route = new Route, this.filters = new FilterList(configData.filterValues), this.filtersView = new FiltersView({
                collection: this.filters,
                route: this.route,
                config: configData
            });
            var coffeesInDom = $(".coffeeItem").map(function () {
                var $this = $(this);
                return {
                    roast: $this.data("type"),
                    roastDisplay: $this.data("roast-display"),
                    params: $this.data("filters") ? $this.data("filters").toLowerCase().split(" ") : "",
                    detailUrl: $this.find(".button_wrap a").prop("href"),
                    details: $this.data("detail"),
                    placeholder_image: $this.find("img").prop("src"),
                    image: $this.data("echo"),
                    shortDescription: $this.find("p").text(),
                    imageAlt: $this.find("img").prop("alt"),
                    name: $this.find("h5").text(),
                    format: $this.data("format"),
                    drawerImage: $this.data("drawer"),
                    storeUrl: $this.data("storelink"),
                    isOnline: "True" == $this.data("isonline"),
                    isLocal: "True" == $this.data("isgrocery"),
                    isStore: "True" == $this.data("store")
                }
            }).toArray();
            this.coffeesView = new CoffeesView({
                collection: new CoffeeList(coffeesInDom),
                filters: this.filters,
                config: configData
            }), this.listenTo(this.route, "change", this.updateUrl)
        }
    })
}(configData, ourCoffees.FiltersView, ourCoffees.FilterList, ourCoffees.CoffeesView, ourCoffees.CoffeeList, ourCoffees.Route), $(".ourCoffeeContainer").length > 0 && (new ourCoffees.CoffeesRouter, Backbone.history.start({
    pushState: !0,
    root: decodeURI(document.location.pathname.split("/")[1] + "/" + document.location.pathname.split("/")[2])
}));
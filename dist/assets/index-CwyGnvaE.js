var e = Object.create,
  t = Object.defineProperty,
  n = Object.getOwnPropertyDescriptor,
  r = Object.getOwnPropertyNames,
  i = Object.getPrototypeOf,
  a = Object.prototype.hasOwnProperty,
  o = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  s = (e, i, o, s) => {
    if ((i && typeof i == `object`) || typeof i == `function`)
      for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
        ((d = c[l]),
          !a.call(e, d) &&
            d !== o &&
            t(e, d, {
              get: ((e) => i[e]).bind(null, d),
              enumerable: !(s = n(i, d)) || s.enumerable,
            }));
    return e;
  },
  c = (n, r, a) => (
    (a = n == null ? {} : e(i(n))),
    s(
      r || !n || !n.__esModule
        ? t(a, `default`, { value: n, enumerable: !0 })
        : a,
      n,
    )
  );
(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes)
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var l = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.portal`),
      r = Symbol.for(`react.fragment`),
      i = Symbol.for(`react.strict_mode`),
      a = Symbol.for(`react.profiler`),
      o = Symbol.for(`react.consumer`),
      s = Symbol.for(`react.context`),
      c = Symbol.for(`react.forward_ref`),
      l = Symbol.for(`react.suspense`),
      u = Symbol.for(`react.memo`),
      d = Symbol.for(`react.lazy`),
      f = Symbol.for(`react.activity`),
      p = Symbol.iterator;
    function m(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (p && e[p]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var h = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      g = Object.assign,
      _ = {};
    function v(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = _),
        (this.updater = n || h));
    }
    ((v.prototype.isReactComponent = {}),
      (v.prototype.setState = function (e, t) {
        if (typeof e != `object` && typeof e != `function` && e != null)
          throw Error(
            `takes an object of state variables to update or a function which returns an object of state variables.`,
          );
        this.updater.enqueueSetState(this, e, t, `setState`);
      }),
      (v.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
      }));
    function y() {}
    y.prototype = v.prototype;
    function b(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = _),
        (this.updater = n || h));
    }
    var x = (b.prototype = new y());
    ((x.constructor = b), g(x, v.prototype), (x.isPureReactComponent = !0));
    var S = Array.isArray;
    function C() {}
    var w = { H: null, A: null, T: null, S: null },
      ee = Object.prototype.hasOwnProperty;
    function T(e, n, r) {
      var i = r.ref;
      return {
        $$typeof: t,
        type: e,
        key: n,
        ref: i === void 0 ? null : i,
        props: r,
      };
    }
    function te(e, t) {
      return T(e.type, t, e.props);
    }
    function ne(e) {
      return typeof e == `object` && !!e && e.$$typeof === t;
    }
    function re(e) {
      var t = { "=": `=0`, ":": `=2` };
      return (
        `$` +
        e.replace(/[=:]/g, function (e) {
          return t[e];
        })
      );
    }
    var ie = /\/+/g;
    function ae(e, t) {
      return typeof e == `object` && e && e.key != null
        ? re(`` + e.key)
        : t.toString(36);
    }
    function oe(e) {
      switch (e.status) {
        case `fulfilled`:
          return e.value;
        case `rejected`:
          throw e.reason;
        default:
          switch (
            (typeof e.status == `string`
              ? e.then(C, C)
              : ((e.status = `pending`),
                e.then(
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `fulfilled`), (e.value = t));
                  },
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `rejected`), (e.reason = t));
                  },
                )),
            e.status)
          ) {
            case `fulfilled`:
              return e.value;
            case `rejected`:
              throw e.reason;
          }
      }
      throw e;
    }
    function se(e, r, i, a, o) {
      var s = typeof e;
      (s === `undefined` || s === `boolean`) && (e = null);
      var c = !1;
      if (e === null) c = !0;
      else
        switch (s) {
          case `bigint`:
          case `string`:
          case `number`:
            c = !0;
            break;
          case `object`:
            switch (e.$$typeof) {
              case t:
              case n:
                c = !0;
                break;
              case d:
                return ((c = e._init), se(c(e._payload), r, i, a, o));
            }
        }
      if (c)
        return (
          (o = o(e)),
          (c = a === `` ? `.` + ae(e, 0) : a),
          S(o)
            ? ((i = ``),
              c != null && (i = c.replace(ie, `$&/`) + `/`),
              se(o, r, i, ``, function (e) {
                return e;
              }))
            : o != null &&
              (ne(o) &&
                (o = te(
                  o,
                  i +
                    (o.key == null || (e && e.key === o.key)
                      ? ``
                      : (`` + o.key).replace(ie, `$&/`) + `/`) +
                    c,
                )),
              r.push(o)),
          1
        );
      c = 0;
      var l = a === `` ? `.` : a + `:`;
      if (S(e))
        for (var u = 0; u < e.length; u++)
          ((a = e[u]), (s = l + ae(a, u)), (c += se(a, r, i, s, o)));
      else if (((u = m(e)), typeof u == `function`))
        for (e = u.call(e), u = 0; !(a = e.next()).done; )
          ((a = a.value), (s = l + ae(a, u++)), (c += se(a, r, i, s, o)));
      else if (s === `object`) {
        if (typeof e.then == `function`) return se(oe(e), r, i, a, o);
        throw (
          (r = String(e)),
          Error(
            `Objects are not valid as a React child (found: ` +
              (r === `[object Object]`
                ? `object with keys {` + Object.keys(e).join(`, `) + `}`
                : r) +
              `). If you meant to render a collection of children, use an array instead.`,
          )
        );
      }
      return c;
    }
    function ce(e, t, n) {
      if (e == null) return e;
      var r = [],
        i = 0;
      return (
        se(e, r, ``, ``, function (e) {
          return t.call(n, e, i++);
        }),
        r
      );
    }
    function le(e) {
      if (e._status === -1) {
        var t = e._result;
        ((t = t()),
          t.then(
            function (t) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 1), (e._result = t));
            },
            function (t) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 2), (e._result = t));
            },
          ),
          e._status === -1 && ((e._status = 0), (e._result = t)));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var E =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (
                typeof window == `object` &&
                typeof window.ErrorEvent == `function`
              ) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (
                typeof process == `object` &&
                typeof process.emit == `function`
              ) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      D = {
        map: ce,
        forEach: function (e, t, n) {
          ce(
            e,
            function () {
              t.apply(this, arguments);
            },
            n,
          );
        },
        count: function (e) {
          var t = 0;
          return (
            ce(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            ce(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!ne(e))
            throw Error(
              `React.Children.only expected to receive a single React element child.`,
            );
          return e;
        },
      };
    ((e.Activity = f),
      (e.Children = D),
      (e.Component = v),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = b),
      (e.StrictMode = i),
      (e.Suspense = l),
      (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w),
      (e.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (e) {
          return w.H.useMemoCache(e);
        },
      }),
      (e.cache = function (e) {
        return function () {
          return e.apply(null, arguments);
        };
      }),
      (e.cacheSignal = function () {
        return null;
      }),
      (e.cloneElement = function (e, t, n) {
        if (e == null)
          throw Error(
            `The argument must be a React element, but you passed ` + e + `.`,
          );
        var r = g({}, e.props),
          i = e.key;
        if (t != null)
          for (a in (t.key !== void 0 && (i = `` + t.key), t))
            !ee.call(t, a) ||
              a === `key` ||
              a === `__self` ||
              a === `__source` ||
              (a === `ref` && t.ref === void 0) ||
              (r[a] = t[a]);
        var a = arguments.length - 2;
        if (a === 1) r.children = n;
        else if (1 < a) {
          for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
          r.children = o;
        }
        return T(e.type, i, r);
      }),
      (e.createContext = function (e) {
        return (
          (e = {
            $$typeof: s,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }),
          (e.Provider = e),
          (e.Consumer = { $$typeof: o, _context: e }),
          e
        );
      }),
      (e.createElement = function (e, t, n) {
        var r,
          i = {},
          a = null;
        if (t != null)
          for (r in (t.key !== void 0 && (a = `` + t.key), t))
            ee.call(t, r) &&
              r !== `key` &&
              r !== `__self` &&
              r !== `__source` &&
              (i[r] = t[r]);
        var o = arguments.length - 2;
        if (o === 1) i.children = n;
        else if (1 < o) {
          for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
          i.children = s;
        }
        if (e && e.defaultProps)
          for (r in ((o = e.defaultProps), o)) i[r] === void 0 && (i[r] = o[r]);
        return T(e, a, i);
      }),
      (e.createRef = function () {
        return { current: null };
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: c, render: e };
      }),
      (e.isValidElement = ne),
      (e.lazy = function (e) {
        return {
          $$typeof: d,
          _payload: { _status: -1, _result: e },
          _init: le,
        };
      }),
      (e.memo = function (e, t) {
        return { $$typeof: u, type: e, compare: t === void 0 ? null : t };
      }),
      (e.startTransition = function (e) {
        var t = w.T,
          n = {};
        w.T = n;
        try {
          var r = e(),
            i = w.S;
          (i !== null && i(n, r),
            typeof r == `object` &&
              r &&
              typeof r.then == `function` &&
              r.then(C, E));
        } catch (e) {
          E(e);
        } finally {
          (t !== null && n.types !== null && (t.types = n.types), (w.T = t));
        }
      }),
      (e.unstable_useCacheRefresh = function () {
        return w.H.useCacheRefresh();
      }),
      (e.use = function (e) {
        return w.H.use(e);
      }),
      (e.useActionState = function (e, t, n) {
        return w.H.useActionState(e, t, n);
      }),
      (e.useCallback = function (e, t) {
        return w.H.useCallback(e, t);
      }),
      (e.useContext = function (e) {
        return w.H.useContext(e);
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e, t) {
        return w.H.useDeferredValue(e, t);
      }),
      (e.useEffect = function (e, t) {
        return w.H.useEffect(e, t);
      }),
      (e.useEffectEvent = function (e) {
        return w.H.useEffectEvent(e);
      }),
      (e.useId = function () {
        return w.H.useId();
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return w.H.useImperativeHandle(e, t, n);
      }),
      (e.useInsertionEffect = function (e, t) {
        return w.H.useInsertionEffect(e, t);
      }),
      (e.useLayoutEffect = function (e, t) {
        return w.H.useLayoutEffect(e, t);
      }),
      (e.useMemo = function (e, t) {
        return w.H.useMemo(e, t);
      }),
      (e.useOptimistic = function (e, t) {
        return w.H.useOptimistic(e, t);
      }),
      (e.useReducer = function (e, t, n) {
        return w.H.useReducer(e, t, n);
      }),
      (e.useRef = function (e) {
        return w.H.useRef(e);
      }),
      (e.useState = function (e) {
        return w.H.useState(e);
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return w.H.useSyncExternalStore(e, t, n);
      }),
      (e.useTransition = function () {
        return w.H.useTransition();
      }),
      (e.version = `19.2.5`));
  }),
  u = o((e, t) => {
    t.exports = l();
  }),
  d = o((e) => {
    function t(e, t) {
      var n = e.length;
      e.push(t);
      a: for (; 0 < n; ) {
        var r = (n - 1) >>> 1,
          a = e[r];
        if (0 < i(a, t)) ((e[r] = t), (e[n] = a), (n = r));
        else break a;
      }
    }
    function n(e) {
      return e.length === 0 ? null : e[0];
    }
    function r(e) {
      if (e.length === 0) return null;
      var t = e[0],
        n = e.pop();
      if (n !== t) {
        e[0] = n;
        a: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
          var s = 2 * (r + 1) - 1,
            c = e[s],
            l = s + 1,
            u = e[l];
          if (0 > i(c, n))
            l < a && 0 > i(u, c)
              ? ((e[r] = u), (e[l] = n), (r = l))
              : ((e[r] = c), (e[s] = n), (r = s));
          else if (l < a && 0 > i(u, n)) ((e[r] = u), (e[l] = n), (r = l));
          else break a;
        }
      }
      return t;
    }
    function i(e, t) {
      var n = e.sortIndex - t.sortIndex;
      return n === 0 ? e.id - t.id : n;
    }
    if (
      ((e.unstable_now = void 0),
      typeof performance == `object` && typeof performance.now == `function`)
    ) {
      var a = performance;
      e.unstable_now = function () {
        return a.now();
      };
    } else {
      var o = Date,
        s = o.now();
      e.unstable_now = function () {
        return o.now() - s;
      };
    }
    var c = [],
      l = [],
      u = 1,
      d = null,
      f = 3,
      p = !1,
      m = !1,
      h = !1,
      g = !1,
      _ = typeof setTimeout == `function` ? setTimeout : null,
      v = typeof clearTimeout == `function` ? clearTimeout : null,
      y = typeof setImmediate < `u` ? setImmediate : null;
    function b(e) {
      for (var i = n(l); i !== null; ) {
        if (i.callback === null) r(l);
        else if (i.startTime <= e)
          (r(l), (i.sortIndex = i.expirationTime), t(c, i));
        else break;
        i = n(l);
      }
    }
    function x(e) {
      if (((h = !1), b(e), !m))
        if (n(c) !== null) ((m = !0), S || ((S = !0), ne()));
        else {
          var t = n(l);
          t !== null && ae(x, t.startTime - e);
        }
    }
    var S = !1,
      C = -1,
      w = 5,
      ee = -1;
    function T() {
      return g ? !0 : !(e.unstable_now() - ee < w);
    }
    function te() {
      if (((g = !1), S)) {
        var t = e.unstable_now();
        ee = t;
        var i = !0;
        try {
          a: {
            ((m = !1), h && ((h = !1), v(C), (C = -1)), (p = !0));
            var a = f;
            try {
              b: {
                for (
                  b(t), d = n(c);
                  d !== null && !(d.expirationTime > t && T());
                ) {
                  var o = d.callback;
                  if (typeof o == `function`) {
                    ((d.callback = null), (f = d.priorityLevel));
                    var s = o(d.expirationTime <= t);
                    if (((t = e.unstable_now()), typeof s == `function`)) {
                      ((d.callback = s), b(t), (i = !0));
                      break b;
                    }
                    (d === n(c) && r(c), b(t));
                  } else r(c);
                  d = n(c);
                }
                if (d !== null) i = !0;
                else {
                  var u = n(l);
                  (u !== null && ae(x, u.startTime - t), (i = !1));
                }
              }
              break a;
            } finally {
              ((d = null), (f = a), (p = !1));
            }
            i = void 0;
          }
        } finally {
          i ? ne() : (S = !1);
        }
      }
    }
    var ne;
    if (typeof y == `function`)
      ne = function () {
        y(te);
      };
    else if (typeof MessageChannel < `u`) {
      var re = new MessageChannel(),
        ie = re.port2;
      ((re.port1.onmessage = te),
        (ne = function () {
          ie.postMessage(null);
        }));
    } else
      ne = function () {
        _(te, 0);
      };
    function ae(t, n) {
      C = _(function () {
        t(e.unstable_now());
      }, n);
    }
    ((e.unstable_IdlePriority = 5),
      (e.unstable_ImmediatePriority = 1),
      (e.unstable_LowPriority = 4),
      (e.unstable_NormalPriority = 3),
      (e.unstable_Profiling = null),
      (e.unstable_UserBlockingPriority = 2),
      (e.unstable_cancelCallback = function (e) {
        e.callback = null;
      }),
      (e.unstable_forceFrameRate = function (e) {
        0 > e || 125 < e
          ? console.error(
              `forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`,
            )
          : (w = 0 < e ? Math.floor(1e3 / e) : 5);
      }),
      (e.unstable_getCurrentPriorityLevel = function () {
        return f;
      }),
      (e.unstable_next = function (e) {
        switch (f) {
          case 1:
          case 2:
          case 3:
            var t = 3;
            break;
          default:
            t = f;
        }
        var n = f;
        f = t;
        try {
          return e();
        } finally {
          f = n;
        }
      }),
      (e.unstable_requestPaint = function () {
        g = !0;
      }),
      (e.unstable_runWithPriority = function (e, t) {
        switch (e) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            e = 3;
        }
        var n = f;
        f = e;
        try {
          return t();
        } finally {
          f = n;
        }
      }),
      (e.unstable_scheduleCallback = function (r, i, a) {
        var o = e.unstable_now();
        switch (
          (typeof a == `object` && a
            ? ((a = a.delay), (a = typeof a == `number` && 0 < a ? o + a : o))
            : (a = o),
          r)
        ) {
          case 1:
            var s = -1;
            break;
          case 2:
            s = 250;
            break;
          case 5:
            s = 1073741823;
            break;
          case 4:
            s = 1e4;
            break;
          default:
            s = 5e3;
        }
        return (
          (s = a + s),
          (r = {
            id: u++,
            callback: i,
            priorityLevel: r,
            startTime: a,
            expirationTime: s,
            sortIndex: -1,
          }),
          a > o
            ? ((r.sortIndex = a),
              t(l, r),
              n(c) === null &&
                r === n(l) &&
                (h ? (v(C), (C = -1)) : (h = !0), ae(x, a - o)))
            : ((r.sortIndex = s),
              t(c, r),
              m || p || ((m = !0), S || ((S = !0), ne()))),
          r
        );
      }),
      (e.unstable_shouldYield = T),
      (e.unstable_wrapCallback = function (e) {
        var t = f;
        return function () {
          var n = f;
          f = t;
          try {
            return e.apply(this, arguments);
          } finally {
            f = n;
          }
        };
      }));
  }),
  f = o((e, t) => {
    t.exports = d();
  }),
  p = o((e) => {
    var t = u();
    function n(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function r() {}
    var i = {
        d: {
          f: r,
          r: function () {
            throw Error(n(522));
          },
          D: r,
          C: r,
          L: r,
          m: r,
          X: r,
          S: r,
          M: r,
        },
        p: 0,
        findDOMNode: null,
      },
      a = Symbol.for(`react.portal`);
    function o(e, t, n) {
      var r =
        3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: a,
        key: r == null ? null : `` + r,
        children: e,
        containerInfo: t,
        implementation: n,
      };
    }
    var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function c(e, t) {
      if (e === `font`) return ``;
      if (typeof t == `string`) return t === `use-credentials` ? t : ``;
    }
    ((e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i),
      (e.createPortal = function (e, t) {
        var r =
          2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11))
          throw Error(n(299));
        return o(e, t, null, r);
      }),
      (e.flushSync = function (e) {
        var t = s.T,
          n = i.p;
        try {
          if (((s.T = null), (i.p = 2), e)) return e();
        } finally {
          ((s.T = t), (i.p = n), i.d.f());
        }
      }),
      (e.preconnect = function (e, t) {
        typeof e == `string` &&
          (t
            ? ((t = t.crossOrigin),
              (t =
                typeof t == `string`
                  ? t === `use-credentials`
                    ? t
                    : ``
                  : void 0))
            : (t = null),
          i.d.C(e, t));
      }),
      (e.prefetchDNS = function (e) {
        typeof e == `string` && i.d.D(e);
      }),
      (e.preinit = function (e, t) {
        if (typeof e == `string` && t && typeof t.as == `string`) {
          var n = t.as,
            r = c(n, t.crossOrigin),
            a = typeof t.integrity == `string` ? t.integrity : void 0,
            o = typeof t.fetchPriority == `string` ? t.fetchPriority : void 0;
          n === `style`
            ? i.d.S(
                e,
                typeof t.precedence == `string` ? t.precedence : void 0,
                { crossOrigin: r, integrity: a, fetchPriority: o },
              )
            : n === `script` &&
              i.d.X(e, {
                crossOrigin: r,
                integrity: a,
                fetchPriority: o,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
        }
      }),
      (e.preinitModule = function (e, t) {
        if (typeof e == `string`)
          if (typeof t == `object` && t) {
            if (t.as == null || t.as === `script`) {
              var n = c(t.as, t.crossOrigin);
              i.d.M(e, {
                crossOrigin: n,
                integrity:
                  typeof t.integrity == `string` ? t.integrity : void 0,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
            }
          } else t ?? i.d.M(e);
      }),
      (e.preload = function (e, t) {
        if (
          typeof e == `string` &&
          typeof t == `object` &&
          t &&
          typeof t.as == `string`
        ) {
          var n = t.as,
            r = c(n, t.crossOrigin);
          i.d.L(e, n, {
            crossOrigin: r,
            integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            nonce: typeof t.nonce == `string` ? t.nonce : void 0,
            type: typeof t.type == `string` ? t.type : void 0,
            fetchPriority:
              typeof t.fetchPriority == `string` ? t.fetchPriority : void 0,
            referrerPolicy:
              typeof t.referrerPolicy == `string` ? t.referrerPolicy : void 0,
            imageSrcSet:
              typeof t.imageSrcSet == `string` ? t.imageSrcSet : void 0,
            imageSizes: typeof t.imageSizes == `string` ? t.imageSizes : void 0,
            media: typeof t.media == `string` ? t.media : void 0,
          });
        }
      }),
      (e.preloadModule = function (e, t) {
        if (typeof e == `string`)
          if (t) {
            var n = c(t.as, t.crossOrigin);
            i.d.m(e, {
              as: typeof t.as == `string` && t.as !== `script` ? t.as : void 0,
              crossOrigin: n,
              integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            });
          } else i.d.m(e);
      }),
      (e.requestFormReset = function (e) {
        i.d.r(e);
      }),
      (e.unstable_batchedUpdates = function (e, t) {
        return e(t);
      }),
      (e.useFormState = function (e, t, n) {
        return s.H.useFormState(e, t, n);
      }),
      (e.useFormStatus = function () {
        return s.H.useHostTransitionStatus();
      }),
      (e.version = `19.2.5`));
  }),
  m = o((e, t) => {
    function n() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = p()));
  }),
  h = o((e) => {
    var t = f(),
      n = u(),
      r = m();
    function i(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function a(e) {
      return !(
        !e ||
        (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
      );
    }
    function o(e) {
      var t = e,
        n = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
        while (e);
      }
      return t.tag === 3 ? n : null;
    }
    function s(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (
          (t === null &&
            ((e = e.alternate), e !== null && (t = e.memoizedState)),
          t !== null)
        )
          return t.dehydrated;
      }
      return null;
    }
    function c(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if (
          (t === null &&
            ((e = e.alternate), e !== null && (t = e.memoizedState)),
          t !== null)
        )
          return t.dehydrated;
      }
      return null;
    }
    function l(e) {
      if (o(e) !== e) throw Error(i(188));
    }
    function d(e) {
      var t = e.alternate;
      if (!t) {
        if (((t = o(e)), t === null)) throw Error(i(188));
        return t === e ? e : null;
      }
      for (var n = e, r = t; ; ) {
        var a = n.return;
        if (a === null) break;
        var s = a.alternate;
        if (s === null) {
          if (((r = a.return), r !== null)) {
            n = r;
            continue;
          }
          break;
        }
        if (a.child === s.child) {
          for (s = a.child; s; ) {
            if (s === n) return (l(a), e);
            if (s === r) return (l(a), t);
            s = s.sibling;
          }
          throw Error(i(188));
        }
        if (n.return !== r.return) ((n = a), (r = s));
        else {
          for (var c = !1, u = a.child; u; ) {
            if (u === n) {
              ((c = !0), (n = a), (r = s));
              break;
            }
            if (u === r) {
              ((c = !0), (r = a), (n = s));
              break;
            }
            u = u.sibling;
          }
          if (!c) {
            for (u = s.child; u; ) {
              if (u === n) {
                ((c = !0), (n = s), (r = a));
                break;
              }
              if (u === r) {
                ((c = !0), (r = s), (n = a));
                break;
              }
              u = u.sibling;
            }
            if (!c) throw Error(i(189));
          }
        }
        if (n.alternate !== r) throw Error(i(190));
      }
      if (n.tag !== 3) throw Error(i(188));
      return n.stateNode.current === n ? e : t;
    }
    function p(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null; ) {
        if (((t = p(e)), t !== null)) return t;
        e = e.sibling;
      }
      return null;
    }
    var h = Object.assign,
      g = Symbol.for(`react.element`),
      _ = Symbol.for(`react.transitional.element`),
      v = Symbol.for(`react.portal`),
      y = Symbol.for(`react.fragment`),
      b = Symbol.for(`react.strict_mode`),
      x = Symbol.for(`react.profiler`),
      S = Symbol.for(`react.consumer`),
      C = Symbol.for(`react.context`),
      w = Symbol.for(`react.forward_ref`),
      ee = Symbol.for(`react.suspense`),
      T = Symbol.for(`react.suspense_list`),
      te = Symbol.for(`react.memo`),
      ne = Symbol.for(`react.lazy`),
      re = Symbol.for(`react.activity`),
      ie = Symbol.for(`react.memo_cache_sentinel`),
      ae = Symbol.iterator;
    function oe(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (ae && e[ae]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var se = Symbol.for(`react.client.reference`);
    function ce(e) {
      if (e == null) return null;
      if (typeof e == `function`)
        return e.$$typeof === se ? null : e.displayName || e.name || null;
      if (typeof e == `string`) return e;
      switch (e) {
        case y:
          return `Fragment`;
        case x:
          return `Profiler`;
        case b:
          return `StrictMode`;
        case ee:
          return `Suspense`;
        case T:
          return `SuspenseList`;
        case re:
          return `Activity`;
      }
      if (typeof e == `object`)
        switch (e.$$typeof) {
          case v:
            return `Portal`;
          case C:
            return e.displayName || `Context`;
          case S:
            return (e._context.displayName || `Context`) + `.Consumer`;
          case w:
            var t = e.render;
            return (
              (e = e.displayName),
              (e ||=
                ((e = t.displayName || t.name || ``),
                e === `` ? `ForwardRef` : `ForwardRef(` + e + `)`)),
              e
            );
          case te:
            return (
              (t = e.displayName || null),
              t === null ? ce(e.type) || `Memo` : t
            );
          case ne:
            ((t = e._payload), (e = e._init));
            try {
              return ce(e(t));
            } catch {}
        }
      return null;
    }
    var le = Array.isArray,
      E = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      D = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      ue = { pending: !1, data: null, method: null, action: null },
      de = [],
      fe = -1;
    function pe(e) {
      return { current: e };
    }
    function O(e) {
      0 > fe || ((e.current = de[fe]), (de[fe] = null), fe--);
    }
    function k(e, t) {
      (fe++, (de[fe] = e.current), (e.current = t));
    }
    var me = pe(null),
      he = pe(null),
      ge = pe(null),
      _e = pe(null);
    function ve(e, t) {
      switch ((k(ge, t), k(he, e), k(me, null), t.nodeType)) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Vd(e) : 0;
          break;
        default:
          if (((e = t.tagName), (t = t.namespaceURI)))
            ((t = Vd(t)), (e = Hd(t, e)));
          else
            switch (e) {
              case `svg`:
                e = 1;
                break;
              case `math`:
                e = 2;
                break;
              default:
                e = 0;
            }
      }
      (O(me), k(me, e));
    }
    function ye() {
      (O(me), O(he), O(ge));
    }
    function be(e) {
      e.memoizedState !== null && k(_e, e);
      var t = me.current,
        n = Hd(t, e.type);
      t !== n && (k(he, e), k(me, n));
    }
    function xe(e) {
      (he.current === e && (O(me), O(he)),
        _e.current === e && (O(_e), (Qf._currentValue = ue)));
    }
    var Se, Ce;
    function we(e) {
      if (Se === void 0)
        try {
          throw Error();
        } catch (e) {
          var t = e.stack.trim().match(/\n( *(at )?)/);
          ((Se = (t && t[1]) || ``),
            (Ce =
              -1 <
              e.stack.indexOf(`
    at`)
                ? ` (<anonymous>)`
                : -1 < e.stack.indexOf(`@`)
                  ? `@unknown:0:0`
                  : ``));
        }
      return (
        `
` +
        Se +
        e +
        Ce
      );
    }
    var Te = !1;
    function Ee(e, t) {
      if (!e || Te) return ``;
      Te = !0;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var r = {
          DetermineComponentFrameRoot: function () {
            try {
              if (t) {
                var n = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(n.prototype, `props`, {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == `object` && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(n, []);
                  } catch (e) {
                    var r = e;
                  }
                  Reflect.construct(e, [], n);
                } else {
                  try {
                    n.call();
                  } catch (e) {
                    r = e;
                  }
                  e.call(n.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (e) {
                  r = e;
                }
                (n = e()) &&
                  typeof n.catch == `function` &&
                  n.catch(function () {});
              }
            } catch (e) {
              if (e && r && typeof e.stack == `string`)
                return [e.stack, r.stack];
            }
            return [null, null];
          },
        };
        r.DetermineComponentFrameRoot.displayName = `DetermineComponentFrameRoot`;
        var i = Object.getOwnPropertyDescriptor(
          r.DetermineComponentFrameRoot,
          `name`,
        );
        i &&
          i.configurable &&
          Object.defineProperty(r.DetermineComponentFrameRoot, `name`, {
            value: `DetermineComponentFrameRoot`,
          });
        var a = r.DetermineComponentFrameRoot(),
          o = a[0],
          s = a[1];
        if (o && s) {
          var c = o.split(`
`),
            l = s.split(`
`);
          for (
            i = r = 0;
            r < c.length && !c[r].includes(`DetermineComponentFrameRoot`);
          )
            r++;
          for (
            ;
            i < l.length && !l[i].includes(`DetermineComponentFrameRoot`);
          )
            i++;
          if (r === c.length || i === l.length)
            for (
              r = c.length - 1, i = l.length - 1;
              1 <= r && 0 <= i && c[r] !== l[i];
            )
              i--;
          for (; 1 <= r && 0 <= i; r--, i--)
            if (c[r] !== l[i]) {
              if (r !== 1 || i !== 1)
                do
                  if ((r--, i--, 0 > i || c[r] !== l[i])) {
                    var u =
                      `
` + c[r].replace(` at new `, ` at `);
                    return (
                      e.displayName &&
                        u.includes(`<anonymous>`) &&
                        (u = u.replace(`<anonymous>`, e.displayName)),
                      u
                    );
                  }
                while (1 <= r && 0 <= i);
              break;
            }
        }
      } finally {
        ((Te = !1), (Error.prepareStackTrace = n));
      }
      return (n = e ? e.displayName || e.name : ``) ? we(n) : ``;
    }
    function De(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return we(e.type);
        case 16:
          return we(`Lazy`);
        case 13:
          return e.child !== t && t !== null
            ? we(`Suspense Fallback`)
            : we(`Suspense`);
        case 19:
          return we(`SuspenseList`);
        case 0:
        case 15:
          return Ee(e.type, !1);
        case 11:
          return Ee(e.type.render, !1);
        case 1:
          return Ee(e.type, !0);
        case 31:
          return we(`Activity`);
        default:
          return ``;
      }
    }
    function Oe(e) {
      try {
        var t = ``,
          n = null;
        do ((t += De(e, n)), (n = e), (e = e.return));
        while (e);
        return t;
      } catch (e) {
        return (
          `
Error generating stack: ` +
          e.message +
          `
` +
          e.stack
        );
      }
    }
    var ke = Object.prototype.hasOwnProperty,
      Ae = t.unstable_scheduleCallback,
      je = t.unstable_cancelCallback,
      Me = t.unstable_shouldYield,
      Ne = t.unstable_requestPaint,
      Pe = t.unstable_now,
      Fe = t.unstable_getCurrentPriorityLevel,
      Ie = t.unstable_ImmediatePriority,
      Le = t.unstable_UserBlockingPriority,
      A = t.unstable_NormalPriority,
      Re = t.unstable_LowPriority,
      ze = t.unstable_IdlePriority,
      Be = t.log,
      Ve = t.unstable_setDisableYieldValue,
      He = null,
      Ue = null;
    function We(e) {
      if (
        (typeof Be == `function` && Ve(e),
        Ue && typeof Ue.setStrictMode == `function`)
      )
        try {
          Ue.setStrictMode(He, e);
        } catch {}
    }
    var j = Math.clz32 ? Math.clz32 : qe,
      Ge = Math.log,
      Ke = Math.LN2;
    function qe(e) {
      return ((e >>>= 0), e === 0 ? 32 : (31 - ((Ge(e) / Ke) | 0)) | 0);
    }
    var Je = 256,
      Ye = 262144,
      Xe = 4194304;
    function Ze(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function Qe(e, t, n) {
      var r = e.pendingLanes;
      if (r === 0) return 0;
      var i = 0,
        a = e.suspendedLanes,
        o = e.pingedLanes;
      e = e.warmLanes;
      var s = r & 134217727;
      return (
        s === 0
          ? ((s = r & ~a),
            s === 0
              ? o === 0
                ? n || ((n = r & ~e), n !== 0 && (i = Ze(n)))
                : (i = Ze(o))
              : (i = Ze(s)))
          : ((r = s & ~a),
            r === 0
              ? ((o &= s),
                o === 0
                  ? n || ((n = s & ~e), n !== 0 && (i = Ze(n)))
                  : (i = Ze(o)))
              : (i = Ze(r))),
        i === 0
          ? 0
          : t !== 0 &&
              t !== i &&
              (t & a) === 0 &&
              ((a = i & -i), (n = t & -t), a >= n || (a === 32 && n & 4194048))
            ? t
            : i
      );
    }
    function $e(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function et(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function tt() {
      var e = Xe;
      return ((Xe <<= 1), !(Xe & 62914560) && (Xe = 4194304), e);
    }
    function nt(e) {
      for (var t = [], n = 0; 31 > n; n++) t.push(e);
      return t;
    }
    function rt(e, t) {
      ((e.pendingLanes |= t),
        t !== 268435456 &&
          ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
    }
    function it(e, t, n, r, i, a) {
      var o = e.pendingLanes;
      ((e.pendingLanes = n),
        (e.suspendedLanes = 0),
        (e.pingedLanes = 0),
        (e.warmLanes = 0),
        (e.expiredLanes &= n),
        (e.entangledLanes &= n),
        (e.errorRecoveryDisabledLanes &= n),
        (e.shellSuspendCounter = 0));
      var s = e.entanglements,
        c = e.expirationTimes,
        l = e.hiddenUpdates;
      for (n = o & ~n; 0 < n; ) {
        var u = 31 - j(n),
          d = 1 << u;
        ((s[u] = 0), (c[u] = -1));
        var f = l[u];
        if (f !== null)
          for (l[u] = null, u = 0; u < f.length; u++) {
            var p = f[u];
            p !== null && (p.lane &= -536870913);
          }
        n &= ~d;
      }
      (r !== 0 && at(e, r, 0),
        a !== 0 &&
          i === 0 &&
          e.tag !== 0 &&
          (e.suspendedLanes |= a & ~(o & ~t)));
    }
    function at(e, t, n) {
      ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
      var r = 31 - j(t);
      ((e.entangledLanes |= t),
        (e.entanglements[r] = e.entanglements[r] | 1073741824 | (n & 261930)));
    }
    function ot(e, t) {
      var n = (e.entangledLanes |= t);
      for (e = e.entanglements; n; ) {
        var r = 31 - j(n),
          i = 1 << r;
        ((i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i));
      }
    }
    function st(e, t) {
      var n = t & -t;
      return (
        (n = n & 42 ? 1 : M(n)),
        (n & (e.suspendedLanes | t)) === 0 ? n : 0
      );
    }
    function M(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function ct(e) {
      return (
        (e &= -e),
        2 < e ? (8 < e ? (e & 134217727 ? 32 : 268435456) : 8) : 2
      );
    }
    function lt() {
      var e = D.p;
      return e === 0 ? ((e = window.event), e === void 0 ? 32 : mp(e.type)) : e;
    }
    function ut(e, t) {
      var n = D.p;
      try {
        return ((D.p = e), t());
      } finally {
        D.p = n;
      }
    }
    var dt = Math.random().toString(36).slice(2),
      ft = `__reactFiber$` + dt,
      pt = `__reactProps$` + dt,
      mt = `__reactContainer$` + dt,
      ht = `__reactEvents$` + dt,
      gt = `__reactListeners$` + dt,
      _t = `__reactHandles$` + dt,
      vt = `__reactResources$` + dt,
      yt = `__reactMarker$` + dt;
    function bt(e) {
      (delete e[ft], delete e[pt], delete e[ht], delete e[gt], delete e[_t]);
    }
    function xt(e) {
      var t = e[ft];
      if (t) return t;
      for (var n = e.parentNode; n; ) {
        if ((t = n[mt] || n[ft])) {
          if (
            ((n = t.alternate),
            t.child !== null || (n !== null && n.child !== null))
          )
            for (e = df(e); e !== null; ) {
              if ((n = e[ft])) return n;
              e = df(e);
            }
          return t;
        }
        ((e = n), (n = e.parentNode));
      }
      return null;
    }
    function St(e) {
      if ((e = e[ft] || e[mt])) {
        var t = e.tag;
        if (
          t === 5 ||
          t === 6 ||
          t === 13 ||
          t === 31 ||
          t === 26 ||
          t === 27 ||
          t === 3
        )
          return e;
      }
      return null;
    }
    function Ct(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(i(33));
    }
    function wt(e) {
      var t = e[vt];
      return (
        (t ||= e[vt] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
        t
      );
    }
    function Tt(e) {
      e[yt] = !0;
    }
    var Et = new Set(),
      Dt = {};
    function Ot(e, t) {
      (kt(e, t), kt(e + `Capture`, t));
    }
    function kt(e, t) {
      for (Dt[e] = t, e = 0; e < t.length; e++) Et.add(t[e]);
    }
    var At = RegExp(
        `^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`,
      ),
      jt = {},
      Mt = {};
    function Nt(e) {
      return ke.call(Mt, e)
        ? !0
        : ke.call(jt, e)
          ? !1
          : At.test(e)
            ? (Mt[e] = !0)
            : ((jt[e] = !0), !1);
    }
    function N(e, t, n) {
      if (Nt(t))
        if (n === null) e.removeAttribute(t);
        else {
          switch (typeof n) {
            case `undefined`:
            case `function`:
            case `symbol`:
              e.removeAttribute(t);
              return;
            case `boolean`:
              var r = t.toLowerCase().slice(0, 5);
              if (r !== `data-` && r !== `aria-`) {
                e.removeAttribute(t);
                return;
              }
          }
          e.setAttribute(t, `` + n);
        }
    }
    function Pt(e, t, n) {
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, `` + n);
      }
    }
    function Ft(e, t, n, r) {
      if (r === null) e.removeAttribute(n);
      else {
        switch (typeof r) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(n);
            return;
        }
        e.setAttributeNS(t, n, `` + r);
      }
    }
    function It(e) {
      switch (typeof e) {
        case `bigint`:
        case `boolean`:
        case `number`:
        case `string`:
        case `undefined`:
          return e;
        case `object`:
          return e;
        default:
          return ``;
      }
    }
    function Lt(e) {
      var t = e.type;
      return (
        (e = e.nodeName) &&
        e.toLowerCase() === `input` &&
        (t === `checkbox` || t === `radio`)
      );
    }
    function Rt(e, t, n) {
      var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (
        !e.hasOwnProperty(t) &&
        r !== void 0 &&
        typeof r.get == `function` &&
        typeof r.set == `function`
      ) {
        var i = r.get,
          a = r.set;
        return (
          Object.defineProperty(e, t, {
            configurable: !0,
            get: function () {
              return i.call(this);
            },
            set: function (e) {
              ((n = `` + e), a.call(this, e));
            },
          }),
          Object.defineProperty(e, t, { enumerable: r.enumerable }),
          {
            getValue: function () {
              return n;
            },
            setValue: function (e) {
              n = `` + e;
            },
            stopTracking: function () {
              ((e._valueTracker = null), delete e[t]);
            },
          }
        );
      }
    }
    function zt(e) {
      if (!e._valueTracker) {
        var t = Lt(e) ? `checked` : `value`;
        e._valueTracker = Rt(e, t, `` + e[t]);
      }
    }
    function Bt(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var n = t.getValue(),
        r = ``;
      return (
        e && (r = Lt(e) ? (e.checked ? `true` : `false`) : e.value),
        (e = r),
        e === n ? !1 : (t.setValue(e), !0)
      );
    }
    function Vt(e) {
      if (((e ||= typeof document < `u` ? document : void 0), e === void 0))
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Ht = /[\n"\\]/g;
    function Ut(e) {
      return e.replace(Ht, function (e) {
        return `\\` + e.charCodeAt(0).toString(16) + ` `;
      });
    }
    function P(e, t, n, r, i, a, o, s) {
      ((e.name = ``),
        o != null &&
        typeof o != `function` &&
        typeof o != `symbol` &&
        typeof o != `boolean`
          ? (e.type = o)
          : e.removeAttribute(`type`),
        t == null
          ? (o !== `submit` && o !== `reset`) || e.removeAttribute(`value`)
          : o === `number`
            ? ((t === 0 && e.value === ``) || e.value != t) &&
              (e.value = `` + It(t))
            : e.value !== `` + It(t) && (e.value = `` + It(t)),
        t == null
          ? n == null
            ? r != null && e.removeAttribute(`value`)
            : Gt(e, o, It(n))
          : Gt(e, o, It(t)),
        i == null && a != null && (e.defaultChecked = !!a),
        i != null &&
          (e.checked = i && typeof i != `function` && typeof i != `symbol`),
        s != null &&
        typeof s != `function` &&
        typeof s != `symbol` &&
        typeof s != `boolean`
          ? (e.name = `` + It(s))
          : e.removeAttribute(`name`));
    }
    function Wt(e, t, n, r, i, a, o, s) {
      if (
        (a != null &&
          typeof a != `function` &&
          typeof a != `symbol` &&
          typeof a != `boolean` &&
          (e.type = a),
        t != null || n != null)
      ) {
        if (!((a !== `submit` && a !== `reset`) || t != null)) {
          zt(e);
          return;
        }
        ((n = n == null ? `` : `` + It(n)),
          (t = t == null ? n : `` + It(t)),
          s || t === e.value || (e.value = t),
          (e.defaultValue = t));
      }
      ((r ??= i),
        (r = typeof r != `function` && typeof r != `symbol` && !!r),
        (e.checked = s ? e.checked : !!r),
        (e.defaultChecked = !!r),
        o != null &&
          typeof o != `function` &&
          typeof o != `symbol` &&
          typeof o != `boolean` &&
          (e.name = o),
        zt(e));
    }
    function Gt(e, t, n) {
      (t === `number` && Vt(e.ownerDocument) === e) ||
        e.defaultValue === `` + n ||
        (e.defaultValue = `` + n);
    }
    function Kt(e, t, n, r) {
      if (((e = e.options), t)) {
        t = {};
        for (var i = 0; i < n.length; i++) t[`$` + n[i]] = !0;
        for (n = 0; n < e.length; n++)
          ((i = t.hasOwnProperty(`$` + e[n].value)),
            e[n].selected !== i && (e[n].selected = i),
            i && r && (e[n].defaultSelected = !0));
      } else {
        for (n = `` + It(n), t = null, i = 0; i < e.length; i++) {
          if (e[i].value === n) {
            ((e[i].selected = !0), r && (e[i].defaultSelected = !0));
            return;
          }
          t !== null || e[i].disabled || (t = e[i]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function qt(e, t, n) {
      if (
        t != null &&
        ((t = `` + It(t)), t !== e.value && (e.value = t), n == null)
      ) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = n == null ? `` : `` + It(n);
    }
    function Jt(e, t, n, r) {
      if (t == null) {
        if (r != null) {
          if (n != null) throw Error(i(92));
          if (le(r)) {
            if (1 < r.length) throw Error(i(93));
            r = r[0];
          }
          n = r;
        }
        ((n ??= ``), (t = n));
      }
      ((n = It(t)),
        (e.defaultValue = n),
        (r = e.textContent),
        r === n && r !== `` && r !== null && (e.value = r),
        zt(e));
    }
    function Yt(e, t) {
      if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && n.nodeType === 3) {
          n.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var Xt = new Set(
      `animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(
        ` `,
      ),
    );
    function Zt(e, t, n) {
      var r = t.indexOf(`--`) === 0;
      n == null || typeof n == `boolean` || n === ``
        ? r
          ? e.setProperty(t, ``)
          : t === `float`
            ? (e.cssFloat = ``)
            : (e[t] = ``)
        : r
          ? e.setProperty(t, n)
          : typeof n != `number` || n === 0 || Xt.has(t)
            ? t === `float`
              ? (e.cssFloat = n)
              : (e[t] = (`` + n).trim())
            : (e[t] = n + `px`);
    }
    function Qt(e, t, n) {
      if (t != null && typeof t != `object`) throw Error(i(62));
      if (((e = e.style), n != null)) {
        for (var r in n)
          !n.hasOwnProperty(r) ||
            (t != null && t.hasOwnProperty(r)) ||
            (r.indexOf(`--`) === 0
              ? e.setProperty(r, ``)
              : r === `float`
                ? (e.cssFloat = ``)
                : (e[r] = ``));
        for (var a in t)
          ((r = t[a]), t.hasOwnProperty(a) && n[a] !== r && Zt(e, a, r));
      } else for (var o in t) t.hasOwnProperty(o) && Zt(e, o, t[o]);
    }
    function $t(e) {
      if (e.indexOf(`-`) === -1) return !1;
      switch (e) {
        case `annotation-xml`:
        case `color-profile`:
        case `font-face`:
        case `font-face-src`:
        case `font-face-uri`:
        case `font-face-format`:
        case `font-face-name`:
        case `missing-glyph`:
          return !1;
        default:
          return !0;
      }
    }
    var en = new Map([
        [`acceptCharset`, `accept-charset`],
        [`htmlFor`, `for`],
        [`httpEquiv`, `http-equiv`],
        [`crossOrigin`, `crossorigin`],
        [`accentHeight`, `accent-height`],
        [`alignmentBaseline`, `alignment-baseline`],
        [`arabicForm`, `arabic-form`],
        [`baselineShift`, `baseline-shift`],
        [`capHeight`, `cap-height`],
        [`clipPath`, `clip-path`],
        [`clipRule`, `clip-rule`],
        [`colorInterpolation`, `color-interpolation`],
        [`colorInterpolationFilters`, `color-interpolation-filters`],
        [`colorProfile`, `color-profile`],
        [`colorRendering`, `color-rendering`],
        [`dominantBaseline`, `dominant-baseline`],
        [`enableBackground`, `enable-background`],
        [`fillOpacity`, `fill-opacity`],
        [`fillRule`, `fill-rule`],
        [`floodColor`, `flood-color`],
        [`floodOpacity`, `flood-opacity`],
        [`fontFamily`, `font-family`],
        [`fontSize`, `font-size`],
        [`fontSizeAdjust`, `font-size-adjust`],
        [`fontStretch`, `font-stretch`],
        [`fontStyle`, `font-style`],
        [`fontVariant`, `font-variant`],
        [`fontWeight`, `font-weight`],
        [`glyphName`, `glyph-name`],
        [`glyphOrientationHorizontal`, `glyph-orientation-horizontal`],
        [`glyphOrientationVertical`, `glyph-orientation-vertical`],
        [`horizAdvX`, `horiz-adv-x`],
        [`horizOriginX`, `horiz-origin-x`],
        [`imageRendering`, `image-rendering`],
        [`letterSpacing`, `letter-spacing`],
        [`lightingColor`, `lighting-color`],
        [`markerEnd`, `marker-end`],
        [`markerMid`, `marker-mid`],
        [`markerStart`, `marker-start`],
        [`overlinePosition`, `overline-position`],
        [`overlineThickness`, `overline-thickness`],
        [`paintOrder`, `paint-order`],
        [`panose-1`, `panose-1`],
        [`pointerEvents`, `pointer-events`],
        [`renderingIntent`, `rendering-intent`],
        [`shapeRendering`, `shape-rendering`],
        [`stopColor`, `stop-color`],
        [`stopOpacity`, `stop-opacity`],
        [`strikethroughPosition`, `strikethrough-position`],
        [`strikethroughThickness`, `strikethrough-thickness`],
        [`strokeDasharray`, `stroke-dasharray`],
        [`strokeDashoffset`, `stroke-dashoffset`],
        [`strokeLinecap`, `stroke-linecap`],
        [`strokeLinejoin`, `stroke-linejoin`],
        [`strokeMiterlimit`, `stroke-miterlimit`],
        [`strokeOpacity`, `stroke-opacity`],
        [`strokeWidth`, `stroke-width`],
        [`textAnchor`, `text-anchor`],
        [`textDecoration`, `text-decoration`],
        [`textRendering`, `text-rendering`],
        [`transformOrigin`, `transform-origin`],
        [`underlinePosition`, `underline-position`],
        [`underlineThickness`, `underline-thickness`],
        [`unicodeBidi`, `unicode-bidi`],
        [`unicodeRange`, `unicode-range`],
        [`unitsPerEm`, `units-per-em`],
        [`vAlphabetic`, `v-alphabetic`],
        [`vHanging`, `v-hanging`],
        [`vIdeographic`, `v-ideographic`],
        [`vMathematical`, `v-mathematical`],
        [`vectorEffect`, `vector-effect`],
        [`vertAdvY`, `vert-adv-y`],
        [`vertOriginX`, `vert-origin-x`],
        [`vertOriginY`, `vert-origin-y`],
        [`wordSpacing`, `word-spacing`],
        [`writingMode`, `writing-mode`],
        [`xmlnsXlink`, `xmlns:xlink`],
        [`xHeight`, `x-height`],
      ]),
      tn =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function nn(e) {
      return tn.test(`` + e)
        ? `javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`
        : e;
    }
    function rn() {}
    var an = null;
    function on(e) {
      return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
      );
    }
    var sn = null,
      cn = null;
    function ln(e) {
      var t = St(e);
      if (t && (e = t.stateNode)) {
        var n = e[pt] || null;
        a: switch (((e = t.stateNode), t.type)) {
          case `input`:
            if (
              (P(
                e,
                n.value,
                n.defaultValue,
                n.defaultValue,
                n.checked,
                n.defaultChecked,
                n.type,
                n.name,
              ),
              (t = n.name),
              n.type === `radio` && t != null)
            ) {
              for (n = e; n.parentNode; ) n = n.parentNode;
              for (
                n = n.querySelectorAll(
                  `input[name="` + Ut(`` + t) + `"][type="radio"]`,
                ),
                  t = 0;
                t < n.length;
                t++
              ) {
                var r = n[t];
                if (r !== e && r.form === e.form) {
                  var a = r[pt] || null;
                  if (!a) throw Error(i(90));
                  P(
                    r,
                    a.value,
                    a.defaultValue,
                    a.defaultValue,
                    a.checked,
                    a.defaultChecked,
                    a.type,
                    a.name,
                  );
                }
              }
              for (t = 0; t < n.length; t++)
                ((r = n[t]), r.form === e.form && Bt(r));
            }
            break a;
          case `textarea`:
            qt(e, n.value, n.defaultValue);
            break a;
          case `select`:
            ((t = n.value), t != null && Kt(e, !!n.multiple, t, !1));
        }
      }
    }
    var un = !1;
    function dn(e, t, n) {
      if (un) return e(t, n);
      un = !0;
      try {
        return e(t);
      } finally {
        if (
          ((un = !1),
          (sn !== null || cn !== null) &&
            (bu(), sn && ((t = sn), (e = cn), (cn = sn = null), ln(t), e)))
        )
          for (t = 0; t < e.length; t++) ln(e[t]);
      }
    }
    function fn(e, t) {
      var n = e.stateNode;
      if (n === null) return null;
      var r = n[pt] || null;
      if (r === null) return null;
      n = r[t];
      a: switch (t) {
        case `onClick`:
        case `onClickCapture`:
        case `onDoubleClick`:
        case `onDoubleClickCapture`:
        case `onMouseDown`:
        case `onMouseDownCapture`:
        case `onMouseMove`:
        case `onMouseMoveCapture`:
        case `onMouseUp`:
        case `onMouseUpCapture`:
        case `onMouseEnter`:
          ((r = !r.disabled) ||
            ((e = e.type),
            (r = !(
              e === `button` ||
              e === `input` ||
              e === `select` ||
              e === `textarea`
            ))),
            (e = !r));
          break a;
        default:
          e = !1;
      }
      if (e) return null;
      if (n && typeof n != `function`) throw Error(i(231, t, typeof n));
      return n;
    }
    var pn = !(
        typeof window > `u` ||
        window.document === void 0 ||
        window.document.createElement === void 0
      ),
      mn = !1;
    if (pn)
      try {
        var hn = {};
        (Object.defineProperty(hn, `passive`, {
          get: function () {
            mn = !0;
          },
        }),
          window.addEventListener(`test`, hn, hn),
          window.removeEventListener(`test`, hn, hn));
      } catch {
        mn = !1;
      }
    var gn = null,
      _n = null,
      vn = null;
    function yn() {
      if (vn) return vn;
      var e,
        t = _n,
        n = t.length,
        r,
        i = `value` in gn ? gn.value : gn.textContent,
        a = i.length;
      for (e = 0; e < n && t[e] === i[e]; e++);
      var o = n - e;
      for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
      return (vn = i.slice(e, 1 < r ? 1 - r : void 0));
    }
    function bn(e) {
      var t = e.keyCode;
      return (
        `charCode` in e
          ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
          : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
      );
    }
    function xn() {
      return !0;
    }
    function Sn() {
      return !1;
    }
    function Cn(e) {
      function t(t, n, r, i, a) {
        for (var o in ((this._reactName = t),
        (this._targetInst = r),
        (this.type = n),
        (this.nativeEvent = i),
        (this.target = a),
        (this.currentTarget = null),
        e))
          e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(i) : i[o]));
        return (
          (this.isDefaultPrevented = (
            i.defaultPrevented == null
              ? !1 === i.returnValue
              : i.defaultPrevented
          )
            ? xn
            : Sn),
          (this.isPropagationStopped = Sn),
          this
        );
      }
      return (
        h(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var e = this.nativeEvent;
            e &&
              (e.preventDefault
                ? e.preventDefault()
                : typeof e.returnValue != `unknown` && (e.returnValue = !1),
              (this.isDefaultPrevented = xn));
          },
          stopPropagation: function () {
            var e = this.nativeEvent;
            e &&
              (e.stopPropagation
                ? e.stopPropagation()
                : typeof e.cancelBubble != `unknown` && (e.cancelBubble = !0),
              (this.isPropagationStopped = xn));
          },
          persist: function () {},
          isPersistent: xn,
        }),
        t
      );
    }
    var wn = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      Tn = Cn(wn),
      En = h({}, wn, { view: 0, detail: 0 }),
      Dn = Cn(En),
      On,
      kn,
      An,
      jn = h({}, En, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Hn,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
          return e.relatedTarget === void 0
            ? e.fromElement === e.srcElement
              ? e.toElement
              : e.fromElement
            : e.relatedTarget;
        },
        movementX: function (e) {
          return `movementX` in e
            ? e.movementX
            : (e !== An &&
                (An && e.type === `mousemove`
                  ? ((On = e.screenX - An.screenX),
                    (kn = e.screenY - An.screenY))
                  : (kn = On = 0),
                (An = e)),
              On);
        },
        movementY: function (e) {
          return `movementY` in e ? e.movementY : kn;
        },
      }),
      Mn = Cn(jn),
      Nn = Cn(h({}, jn, { dataTransfer: 0 })),
      Pn = Cn(h({}, En, { relatedTarget: 0 })),
      Fn = Cn(
        h({}, wn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      ),
      In = Cn(
        h({}, wn, {
          clipboardData: function (e) {
            return `clipboardData` in e
              ? e.clipboardData
              : window.clipboardData;
          },
        }),
      ),
      Ln = Cn(h({}, wn, { data: 0 })),
      Rn = {
        Esc: `Escape`,
        Spacebar: ` `,
        Left: `ArrowLeft`,
        Up: `ArrowUp`,
        Right: `ArrowRight`,
        Down: `ArrowDown`,
        Del: `Delete`,
        Win: `OS`,
        Menu: `ContextMenu`,
        Apps: `ContextMenu`,
        Scroll: `ScrollLock`,
        MozPrintableKey: `Unidentified`,
      },
      zn = {
        8: `Backspace`,
        9: `Tab`,
        12: `Clear`,
        13: `Enter`,
        16: `Shift`,
        17: `Control`,
        18: `Alt`,
        19: `Pause`,
        20: `CapsLock`,
        27: `Escape`,
        32: ` `,
        33: `PageUp`,
        34: `PageDown`,
        35: `End`,
        36: `Home`,
        37: `ArrowLeft`,
        38: `ArrowUp`,
        39: `ArrowRight`,
        40: `ArrowDown`,
        45: `Insert`,
        46: `Delete`,
        112: `F1`,
        113: `F2`,
        114: `F3`,
        115: `F4`,
        116: `F5`,
        117: `F6`,
        118: `F7`,
        119: `F8`,
        120: `F9`,
        121: `F10`,
        122: `F11`,
        123: `F12`,
        144: `NumLock`,
        145: `ScrollLock`,
        224: `Meta`,
      },
      Bn = {
        Alt: `altKey`,
        Control: `ctrlKey`,
        Meta: `metaKey`,
        Shift: `shiftKey`,
      };
    function Vn(e) {
      var t = this.nativeEvent;
      return t.getModifierState
        ? t.getModifierState(e)
        : (e = Bn[e])
          ? !!t[e]
          : !1;
    }
    function Hn() {
      return Vn;
    }
    var Un = Cn(
        h({}, En, {
          key: function (e) {
            if (e.key) {
              var t = Rn[e.key] || e.key;
              if (t !== `Unidentified`) return t;
            }
            return e.type === `keypress`
              ? ((e = bn(e)), e === 13 ? `Enter` : String.fromCharCode(e))
              : e.type === `keydown` || e.type === `keyup`
                ? zn[e.keyCode] || `Unidentified`
                : ``;
          },
          code: 0,
          location: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          repeat: 0,
          locale: 0,
          getModifierState: Hn,
          charCode: function (e) {
            return e.type === `keypress` ? bn(e) : 0;
          },
          keyCode: function (e) {
            return e.type === `keydown` || e.type === `keyup` ? e.keyCode : 0;
          },
          which: function (e) {
            return e.type === `keypress`
              ? bn(e)
              : e.type === `keydown` || e.type === `keyup`
                ? e.keyCode
                : 0;
          },
        }),
      ),
      Wn = Cn(
        h({}, jn, {
          pointerId: 0,
          width: 0,
          height: 0,
          pressure: 0,
          tangentialPressure: 0,
          tiltX: 0,
          tiltY: 0,
          twist: 0,
          pointerType: 0,
          isPrimary: 0,
        }),
      ),
      Gn = Cn(
        h({}, En, {
          touches: 0,
          targetTouches: 0,
          changedTouches: 0,
          altKey: 0,
          metaKey: 0,
          ctrlKey: 0,
          shiftKey: 0,
          getModifierState: Hn,
        }),
      ),
      Kn = Cn(h({}, wn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
      qn = Cn(
        h({}, jn, {
          deltaX: function (e) {
            return `deltaX` in e
              ? e.deltaX
              : `wheelDeltaX` in e
                ? -e.wheelDeltaX
                : 0;
          },
          deltaY: function (e) {
            return `deltaY` in e
              ? e.deltaY
              : `wheelDeltaY` in e
                ? -e.wheelDeltaY
                : `wheelDelta` in e
                  ? -e.wheelDelta
                  : 0;
          },
          deltaZ: 0,
          deltaMode: 0,
        }),
      ),
      Jn = Cn(h({}, wn, { newState: 0, oldState: 0 })),
      Yn = [9, 13, 27, 32],
      Xn = pn && `CompositionEvent` in window,
      Zn = null;
    pn && `documentMode` in document && (Zn = document.documentMode);
    var Qn = pn && `TextEvent` in window && !Zn,
      $n = pn && (!Xn || (Zn && 8 < Zn && 11 >= Zn)),
      er = ` `,
      tr = !1;
    function nr(e, t) {
      switch (e) {
        case `keyup`:
          return Yn.indexOf(t.keyCode) !== -1;
        case `keydown`:
          return t.keyCode !== 229;
        case `keypress`:
        case `mousedown`:
        case `focusout`:
          return !0;
        default:
          return !1;
      }
    }
    function rr(e) {
      return (
        (e = e.detail),
        typeof e == `object` && `data` in e ? e.data : null
      );
    }
    var F = !1;
    function ir(e, t) {
      switch (e) {
        case `compositionend`:
          return rr(t);
        case `keypress`:
          return t.which === 32 ? ((tr = !0), er) : null;
        case `textInput`:
          return ((e = t.data), e === er && tr ? null : e);
        default:
          return null;
      }
    }
    function ar(e, t) {
      if (F)
        return e === `compositionend` || (!Xn && nr(e, t))
          ? ((e = yn()), (vn = _n = gn = null), (F = !1), e)
          : null;
      switch (e) {
        case `paste`:
          return null;
        case `keypress`:
          if (
            !(t.ctrlKey || t.altKey || t.metaKey) ||
            (t.ctrlKey && t.altKey)
          ) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case `compositionend`:
          return $n && t.locale !== `ko` ? null : t.data;
        default:
          return null;
      }
    }
    var or = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function sr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === `input` ? !!or[e.type] : t === `textarea`;
    }
    function cr(e, t, n, r) {
      (sn ? (cn ? cn.push(r) : (cn = [r])) : (sn = r),
        (t = Ed(t, `onChange`)),
        0 < t.length &&
          ((n = new Tn(`onChange`, `change`, null, n, r)),
          e.push({ event: n, listeners: t })));
    }
    var lr = null,
      ur = null;
    function dr(e) {
      yd(e, 0);
    }
    function fr(e) {
      if (Bt(Ct(e))) return e;
    }
    function pr(e, t) {
      if (e === `change`) return t;
    }
    var mr = !1;
    if (pn) {
      var hr;
      if (pn) {
        var gr = `oninput` in document;
        if (!gr) {
          var _r = document.createElement(`div`);
          (_r.setAttribute(`oninput`, `return;`),
            (gr = typeof _r.oninput == `function`));
        }
        hr = gr;
      } else hr = !1;
      mr = hr && (!document.documentMode || 9 < document.documentMode);
    }
    function vr() {
      lr && (lr.detachEvent(`onpropertychange`, yr), (ur = lr = null));
    }
    function yr(e) {
      if (e.propertyName === `value` && fr(ur)) {
        var t = [];
        (cr(t, ur, e, on(e)), dn(dr, t));
      }
    }
    function br(e, t, n) {
      e === `focusin`
        ? (vr(), (lr = t), (ur = n), lr.attachEvent(`onpropertychange`, yr))
        : e === `focusout` && vr();
    }
    function xr(e) {
      if (e === `selectionchange` || e === `keyup` || e === `keydown`)
        return fr(ur);
    }
    function Sr(e, t) {
      if (e === `click`) return fr(t);
    }
    function Cr(e, t) {
      if (e === `input` || e === `change`) return fr(t);
    }
    function wr(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
    }
    var Tr = typeof Object.is == `function` ? Object.is : wr;
    function Er(e, t) {
      if (Tr(e, t)) return !0;
      if (typeof e != `object` || !e || typeof t != `object` || !t) return !1;
      var n = Object.keys(e),
        r = Object.keys(t);
      if (n.length !== r.length) return !1;
      for (r = 0; r < n.length; r++) {
        var i = n[r];
        if (!ke.call(t, i) || !Tr(e[i], t[i])) return !1;
      }
      return !0;
    }
    function Dr(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function Or(e, t) {
      var n = Dr(e);
      e = 0;
      for (var r; n; ) {
        if (n.nodeType === 3) {
          if (((r = e + n.textContent.length), e <= t && r >= t))
            return { node: n, offset: t - e };
          e = r;
        }
        a: {
          for (; n; ) {
            if (n.nextSibling) {
              n = n.nextSibling;
              break a;
            }
            n = n.parentNode;
          }
          n = void 0;
        }
        n = Dr(n);
      }
    }
    function kr(e, t) {
      return e && t
        ? e === t
          ? !0
          : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
              ? kr(e, t.parentNode)
              : `contains` in e
                ? e.contains(t)
                : e.compareDocumentPosition
                  ? !!(e.compareDocumentPosition(t) & 16)
                  : !1
        : !1;
    }
    function Ar(e) {
      e =
        e != null &&
        e.ownerDocument != null &&
        e.ownerDocument.defaultView != null
          ? e.ownerDocument.defaultView
          : window;
      for (var t = Vt(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var n = typeof t.contentWindow.location.href == `string`;
        } catch {
          n = !1;
        }
        if (n) e = t.contentWindow;
        else break;
        t = Vt(e.document);
      }
      return t;
    }
    function jr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return (
        t &&
        ((t === `input` &&
          (e.type === `text` ||
            e.type === `search` ||
            e.type === `tel` ||
            e.type === `url` ||
            e.type === `password`)) ||
          t === `textarea` ||
          e.contentEditable === `true`)
      );
    }
    var Mr = pn && `documentMode` in document && 11 >= document.documentMode,
      Nr = null,
      Pr = null,
      Fr = null,
      Ir = !1;
    function Lr(e, t, n) {
      var r =
        n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
      Ir ||
        Nr == null ||
        Nr !== Vt(r) ||
        ((r = Nr),
        `selectionStart` in r && jr(r)
          ? (r = { start: r.selectionStart, end: r.selectionEnd })
          : ((r = (
              (r.ownerDocument && r.ownerDocument.defaultView) ||
              window
            ).getSelection()),
            (r = {
              anchorNode: r.anchorNode,
              anchorOffset: r.anchorOffset,
              focusNode: r.focusNode,
              focusOffset: r.focusOffset,
            })),
        (Fr && Er(Fr, r)) ||
          ((Fr = r),
          (r = Ed(Pr, `onSelect`)),
          0 < r.length &&
            ((t = new Tn(`onSelect`, `select`, null, t, n)),
            e.push({ event: t, listeners: r }),
            (t.target = Nr))));
    }
    function Rr(e, t) {
      var n = {};
      return (
        (n[e.toLowerCase()] = t.toLowerCase()),
        (n[`Webkit` + e] = `webkit` + t),
        (n[`Moz` + e] = `moz` + t),
        n
      );
    }
    var zr = {
        animationend: Rr(`Animation`, `AnimationEnd`),
        animationiteration: Rr(`Animation`, `AnimationIteration`),
        animationstart: Rr(`Animation`, `AnimationStart`),
        transitionrun: Rr(`Transition`, `TransitionRun`),
        transitionstart: Rr(`Transition`, `TransitionStart`),
        transitioncancel: Rr(`Transition`, `TransitionCancel`),
        transitionend: Rr(`Transition`, `TransitionEnd`),
      },
      Br = {},
      Vr = {};
    pn &&
      ((Vr = document.createElement(`div`).style),
      `AnimationEvent` in window ||
        (delete zr.animationend.animation,
        delete zr.animationiteration.animation,
        delete zr.animationstart.animation),
      `TransitionEvent` in window || delete zr.transitionend.transition);
    function Hr(e) {
      if (Br[e]) return Br[e];
      if (!zr[e]) return e;
      var t = zr[e],
        n;
      for (n in t) if (t.hasOwnProperty(n) && n in Vr) return (Br[e] = t[n]);
      return e;
    }
    var Ur = Hr(`animationend`),
      Wr = Hr(`animationiteration`),
      Gr = Hr(`animationstart`),
      Kr = Hr(`transitionrun`),
      qr = Hr(`transitionstart`),
      Jr = Hr(`transitioncancel`),
      Yr = Hr(`transitionend`),
      Xr = new Map(),
      Zr =
        `abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(
          ` `,
        );
    Zr.push(`scrollEnd`);
    function Qr(e, t) {
      (Xr.set(e, t), Ot(t, [e]));
    }
    var $r =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (
                typeof window == `object` &&
                typeof window.ErrorEvent == `function`
              ) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (
                typeof process == `object` &&
                typeof process.emit == `function`
              ) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      ei = [],
      ti = 0,
      ni = 0;
    function ri() {
      for (var e = ti, t = (ni = ti = 0); t < e; ) {
        var n = ei[t];
        ei[t++] = null;
        var r = ei[t];
        ei[t++] = null;
        var i = ei[t];
        ei[t++] = null;
        var a = ei[t];
        if (((ei[t++] = null), r !== null && i !== null)) {
          var o = r.pending;
          (o === null ? (i.next = i) : ((i.next = o.next), (o.next = i)),
            (r.pending = i));
        }
        a !== 0 && si(n, i, a);
      }
    }
    function ii(e, t, n, r) {
      ((ei[ti++] = e),
        (ei[ti++] = t),
        (ei[ti++] = n),
        (ei[ti++] = r),
        (ni |= r),
        (e.lanes |= r),
        (e = e.alternate),
        e !== null && (e.lanes |= r));
    }
    function ai(e, t, n, r) {
      return (ii(e, t, n, r), ci(e));
    }
    function oi(e, t) {
      return (ii(e, null, null, t), ci(e));
    }
    function si(e, t, n) {
      e.lanes |= n;
      var r = e.alternate;
      r !== null && (r.lanes |= n);
      for (var i = !1, a = e.return; a !== null; )
        ((a.childLanes |= n),
          (r = a.alternate),
          r !== null && (r.childLanes |= n),
          a.tag === 22 &&
            ((e = a.stateNode), e === null || e._visibility & 1 || (i = !0)),
          (e = a),
          (a = a.return));
      return e.tag === 3
        ? ((a = e.stateNode),
          i &&
            t !== null &&
            ((i = 31 - j(n)),
            (e = a.hiddenUpdates),
            (r = e[i]),
            r === null ? (e[i] = [t]) : r.push(t),
            (t.lane = n | 536870912)),
          a)
        : null;
    }
    function ci(e) {
      if (50 < du) throw ((du = 0), (fu = null), Error(i(185)));
      for (var t = e.return; t !== null; ) ((e = t), (t = e.return));
      return e.tag === 3 ? e.stateNode : null;
    }
    var li = {};
    function ui(e, t, n, r) {
      ((this.tag = e),
        (this.key = n),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = t),
        (this.dependencies =
          this.memoizedState =
          this.updateQueue =
          this.memoizedProps =
            null),
        (this.mode = r),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function di(e, t, n, r) {
      return new ui(e, t, n, r);
    }
    function fi(e) {
      return ((e = e.prototype), !(!e || !e.isReactComponent));
    }
    function pi(e, t) {
      var n = e.alternate;
      return (
        n === null
          ? ((n = di(e.tag, t, e.key, e.mode)),
            (n.elementType = e.elementType),
            (n.type = e.type),
            (n.stateNode = e.stateNode),
            (n.alternate = e),
            (e.alternate = n))
          : ((n.pendingProps = t),
            (n.type = e.type),
            (n.flags = 0),
            (n.subtreeFlags = 0),
            (n.deletions = null)),
        (n.flags = e.flags & 65011712),
        (n.childLanes = e.childLanes),
        (n.lanes = e.lanes),
        (n.child = e.child),
        (n.memoizedProps = e.memoizedProps),
        (n.memoizedState = e.memoizedState),
        (n.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (n.dependencies =
          t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
        (n.sibling = e.sibling),
        (n.index = e.index),
        (n.ref = e.ref),
        (n.refCleanup = e.refCleanup),
        n
      );
    }
    function mi(e, t) {
      e.flags &= 65011714;
      var n = e.alternate;
      return (
        n === null
          ? ((e.childLanes = 0),
            (e.lanes = t),
            (e.child = null),
            (e.subtreeFlags = 0),
            (e.memoizedProps = null),
            (e.memoizedState = null),
            (e.updateQueue = null),
            (e.dependencies = null),
            (e.stateNode = null))
          : ((e.childLanes = n.childLanes),
            (e.lanes = n.lanes),
            (e.child = n.child),
            (e.subtreeFlags = 0),
            (e.deletions = null),
            (e.memoizedProps = n.memoizedProps),
            (e.memoizedState = n.memoizedState),
            (e.updateQueue = n.updateQueue),
            (e.type = n.type),
            (t = n.dependencies),
            (e.dependencies =
              t === null
                ? null
                : { lanes: t.lanes, firstContext: t.firstContext })),
        e
      );
    }
    function hi(e, t, n, r, a, o) {
      var s = 0;
      if (((r = e), typeof e == `function`)) fi(e) && (s = 1);
      else if (typeof e == `string`)
        s = Uf(e, n, me.current)
          ? 26
          : e === `html` || e === `head` || e === `body`
            ? 27
            : 5;
      else
        a: switch (e) {
          case re:
            return (
              (e = di(31, n, t, a)),
              (e.elementType = re),
              (e.lanes = o),
              e
            );
          case y:
            return gi(n.children, a, o, t);
          case b:
            ((s = 8), (a |= 24));
            break;
          case x:
            return (
              (e = di(12, n, t, a | 2)),
              (e.elementType = x),
              (e.lanes = o),
              e
            );
          case ee:
            return (
              (e = di(13, n, t, a)),
              (e.elementType = ee),
              (e.lanes = o),
              e
            );
          case T:
            return (
              (e = di(19, n, t, a)),
              (e.elementType = T),
              (e.lanes = o),
              e
            );
          default:
            if (typeof e == `object` && e)
              switch (e.$$typeof) {
                case C:
                  s = 10;
                  break a;
                case S:
                  s = 9;
                  break a;
                case w:
                  s = 11;
                  break a;
                case te:
                  s = 14;
                  break a;
                case ne:
                  ((s = 16), (r = null));
                  break a;
              }
            ((s = 29),
              (n = Error(i(130, e === null ? `null` : typeof e, ``))),
              (r = null));
        }
      return (
        (t = di(s, n, t, a)),
        (t.elementType = e),
        (t.type = r),
        (t.lanes = o),
        t
      );
    }
    function gi(e, t, n, r) {
      return ((e = di(7, e, r, t)), (e.lanes = n), e);
    }
    function _i(e, t, n) {
      return ((e = di(6, e, null, t)), (e.lanes = n), e);
    }
    function vi(e) {
      var t = di(18, null, null, 0);
      return ((t.stateNode = e), t);
    }
    function yi(e, t, n) {
      return (
        (t = di(4, e.children === null ? [] : e.children, e.key, t)),
        (t.lanes = n),
        (t.stateNode = {
          containerInfo: e.containerInfo,
          pendingChildren: null,
          implementation: e.implementation,
        }),
        t
      );
    }
    var bi = new WeakMap();
    function xi(e, t) {
      if (typeof e == `object` && e) {
        var n = bi.get(e);
        return n === void 0
          ? ((t = { value: e, source: t, stack: Oe(t) }), bi.set(e, t), t)
          : n;
      }
      return { value: e, source: t, stack: Oe(t) };
    }
    var Si = [],
      Ci = 0,
      wi = null,
      Ti = 0,
      Ei = [],
      Di = 0,
      Oi = null,
      ki = 1,
      Ai = ``;
    function ji(e, t) {
      ((Si[Ci++] = Ti), (Si[Ci++] = wi), (wi = e), (Ti = t));
    }
    function Mi(e, t, n) {
      ((Ei[Di++] = ki), (Ei[Di++] = Ai), (Ei[Di++] = Oi), (Oi = e));
      var r = ki;
      e = Ai;
      var i = 32 - j(r) - 1;
      ((r &= ~(1 << i)), (n += 1));
      var a = 32 - j(t) + i;
      if (30 < a) {
        var o = i - (i % 5);
        ((a = (r & ((1 << o) - 1)).toString(32)),
          (r >>= o),
          (i -= o),
          (ki = (1 << (32 - j(t) + i)) | (n << i) | r),
          (Ai = a + e));
      } else ((ki = (1 << a) | (n << i) | r), (Ai = e));
    }
    function Ni(e) {
      e.return !== null && (ji(e, 1), Mi(e, 1, 0));
    }
    function Pi(e) {
      for (; e === wi; )
        ((wi = Si[--Ci]), (Si[Ci] = null), (Ti = Si[--Ci]), (Si[Ci] = null));
      for (; e === Oi; )
        ((Oi = Ei[--Di]),
          (Ei[Di] = null),
          (Ai = Ei[--Di]),
          (Ei[Di] = null),
          (ki = Ei[--Di]),
          (Ei[Di] = null));
    }
    function Fi(e, t) {
      ((Ei[Di++] = ki),
        (Ei[Di++] = Ai),
        (Ei[Di++] = Oi),
        (ki = t.id),
        (Ai = t.overflow),
        (Oi = e));
    }
    var Ii = null,
      I = null,
      L = !1,
      Li = null,
      Ri = !1,
      zi = Error(i(519));
    function Bi(e) {
      throw (
        Ki(
          xi(
            Error(
              i(
                418,
                1 < arguments.length && arguments[1] !== void 0 && arguments[1]
                  ? `text`
                  : `HTML`,
                ``,
              ),
            ),
            e,
          ),
        ),
        zi
      );
    }
    function Vi(e) {
      var t = e.stateNode,
        n = e.type,
        r = e.memoizedProps;
      switch (((t[ft] = e), (t[pt] = r), n)) {
        case `dialog`:
          (Q(`cancel`, t), Q(`close`, t));
          break;
        case `iframe`:
        case `object`:
        case `embed`:
          Q(`load`, t);
          break;
        case `video`:
        case `audio`:
          for (n = 0; n < _d.length; n++) Q(_d[n], t);
          break;
        case `source`:
          Q(`error`, t);
          break;
        case `img`:
        case `image`:
        case `link`:
          (Q(`error`, t), Q(`load`, t));
          break;
        case `details`:
          Q(`toggle`, t);
          break;
        case `input`:
          (Q(`invalid`, t),
            Wt(
              t,
              r.value,
              r.defaultValue,
              r.checked,
              r.defaultChecked,
              r.type,
              r.name,
              !0,
            ));
          break;
        case `select`:
          Q(`invalid`, t);
          break;
        case `textarea`:
          (Q(`invalid`, t), Jt(t, r.value, r.defaultValue, r.children));
      }
      ((n = r.children),
        (typeof n != `string` &&
          typeof n != `number` &&
          typeof n != `bigint`) ||
        t.textContent === `` + n ||
        !0 === r.suppressHydrationWarning ||
        Md(t.textContent, n)
          ? (r.popover != null && (Q(`beforetoggle`, t), Q(`toggle`, t)),
            r.onScroll != null && Q(`scroll`, t),
            r.onScrollEnd != null && Q(`scrollend`, t),
            r.onClick != null && (t.onclick = rn),
            (t = !0))
          : (t = !1),
        t || Bi(e, !0));
    }
    function Hi(e) {
      for (Ii = e.return; Ii; )
        switch (Ii.tag) {
          case 5:
          case 31:
          case 13:
            Ri = !1;
            return;
          case 27:
          case 3:
            Ri = !0;
            return;
          default:
            Ii = Ii.return;
        }
    }
    function Ui(e) {
      if (e !== Ii) return !1;
      if (!L) return (Hi(e), (L = !0), !1);
      var t = e.tag,
        n;
      if (
        ((n = t !== 3 && t !== 27) &&
          ((n = t === 5) &&
            ((n = e.type),
            (n =
              !(n !== `form` && n !== `button`) ||
              Ud(e.type, e.memoizedProps))),
          (n = !n)),
        n && I && Bi(e),
        Hi(e),
        t === 13)
      ) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(i(317));
        I = uf(e);
      } else if (t === 31) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(i(317));
        I = uf(e);
      } else
        t === 27
          ? ((t = I), Zd(e.type) ? ((e = lf), (lf = null), (I = e)) : (I = t))
          : (I = Ii ? cf(e.stateNode.nextSibling) : null);
      return !0;
    }
    function Wi() {
      ((I = Ii = null), (L = !1));
    }
    function Gi() {
      var e = Li;
      return (
        e !== null &&
          (Zl === null ? (Zl = e) : Zl.push.apply(Zl, e), (Li = null)),
        e
      );
    }
    function Ki(e) {
      Li === null ? (Li = [e]) : Li.push(e);
    }
    var qi = pe(null),
      Ji = null,
      Yi = null;
    function Xi(e, t, n) {
      (k(qi, t._currentValue), (t._currentValue = n));
    }
    function Zi(e) {
      ((e._currentValue = qi.current), O(qi));
    }
    function Qi(e, t, n) {
      for (; e !== null; ) {
        var r = e.alternate;
        if (
          ((e.childLanes & t) === t
            ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t)
            : ((e.childLanes |= t), r !== null && (r.childLanes |= t)),
          e === n)
        )
          break;
        e = e.return;
      }
    }
    function $i(e, t, n, r) {
      var a = e.child;
      for (a !== null && (a.return = e); a !== null; ) {
        var o = a.dependencies;
        if (o !== null) {
          var s = a.child;
          o = o.firstContext;
          a: for (; o !== null; ) {
            var c = o;
            o = a;
            for (var l = 0; l < t.length; l++)
              if (c.context === t[l]) {
                ((o.lanes |= n),
                  (c = o.alternate),
                  c !== null && (c.lanes |= n),
                  Qi(o.return, n, e),
                  r || (s = null));
                break a;
              }
            o = c.next;
          }
        } else if (a.tag === 18) {
          if (((s = a.return), s === null)) throw Error(i(341));
          ((s.lanes |= n),
            (o = s.alternate),
            o !== null && (o.lanes |= n),
            Qi(s, n, e),
            (s = null));
        } else s = a.child;
        if (s !== null) s.return = a;
        else
          for (s = a; s !== null; ) {
            if (s === e) {
              s = null;
              break;
            }
            if (((a = s.sibling), a !== null)) {
              ((a.return = s.return), (s = a));
              break;
            }
            s = s.return;
          }
        a = s;
      }
    }
    function ea(e, t, n, r) {
      e = null;
      for (var a = t, o = !1; a !== null; ) {
        if (!o) {
          if (a.flags & 524288) o = !0;
          else if (a.flags & 262144) break;
        }
        if (a.tag === 10) {
          var s = a.alternate;
          if (s === null) throw Error(i(387));
          if (((s = s.memoizedProps), s !== null)) {
            var c = a.type;
            Tr(a.pendingProps.value, s.value) ||
              (e === null ? (e = [c]) : e.push(c));
          }
        } else if (a === _e.current) {
          if (((s = a.alternate), s === null)) throw Error(i(387));
          s.memoizedState.memoizedState !== a.memoizedState.memoizedState &&
            (e === null ? (e = [Qf]) : e.push(Qf));
        }
        a = a.return;
      }
      (e !== null && $i(t, e, n, r), (t.flags |= 262144));
    }
    function ta(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!Tr(e.context._currentValue, e.memoizedValue)) return !0;
        e = e.next;
      }
      return !1;
    }
    function na(e) {
      ((Ji = e),
        (Yi = null),
        (e = e.dependencies),
        e !== null && (e.firstContext = null));
    }
    function ra(e) {
      return aa(Ji, e);
    }
    function ia(e, t) {
      return (Ji === null && na(e), aa(e, t));
    }
    function aa(e, t) {
      var n = t._currentValue;
      if (((t = { context: t, memoizedValue: n, next: null }), Yi === null)) {
        if (e === null) throw Error(i(308));
        ((Yi = t),
          (e.dependencies = { lanes: 0, firstContext: t }),
          (e.flags |= 524288));
      } else Yi = Yi.next = t;
      return n;
    }
    var oa =
        typeof AbortController < `u`
          ? AbortController
          : function () {
              var e = [],
                t = (this.signal = {
                  aborted: !1,
                  addEventListener: function (t, n) {
                    e.push(n);
                  },
                });
              this.abort = function () {
                ((t.aborted = !0),
                  e.forEach(function (e) {
                    return e();
                  }));
              };
            },
      sa = t.unstable_scheduleCallback,
      ca = t.unstable_NormalPriority,
      la = {
        $$typeof: C,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function ua() {
      return { controller: new oa(), data: new Map(), refCount: 0 };
    }
    function da(e) {
      (e.refCount--,
        e.refCount === 0 &&
          sa(ca, function () {
            e.controller.abort();
          }));
    }
    var fa = null,
      pa = 0,
      ma = 0,
      ha = null;
    function ga(e, t) {
      if (fa === null) {
        var n = (fa = []);
        ((pa = 0),
          (ma = dd()),
          (ha = {
            status: `pending`,
            value: void 0,
            then: function (e) {
              n.push(e);
            },
          }));
      }
      return (pa++, t.then(_a, _a), t);
    }
    function _a() {
      if (--pa === 0 && fa !== null) {
        ha !== null && (ha.status = `fulfilled`);
        var e = fa;
        ((fa = null), (ma = 0), (ha = null));
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function va(e, t) {
      var n = [],
        r = {
          status: `pending`,
          value: null,
          reason: null,
          then: function (e) {
            n.push(e);
          },
        };
      return (
        e.then(
          function () {
            ((r.status = `fulfilled`), (r.value = t));
            for (var e = 0; e < n.length; e++) (0, n[e])(t);
          },
          function (e) {
            for (r.status = `rejected`, r.reason = e, e = 0; e < n.length; e++)
              (0, n[e])(void 0);
          },
        ),
        r
      );
    }
    var ya = E.S;
    E.S = function (e, t) {
      ((eu = Pe()),
        typeof t == `object` && t && typeof t.then == `function` && ga(e, t),
        ya !== null && ya(e, t));
    };
    var ba = pe(null);
    function xa() {
      var e = ba.current;
      return e === null ? K.pooledCache : e;
    }
    function Sa(e, t) {
      t === null ? k(ba, ba.current) : k(ba, t.pool);
    }
    function Ca() {
      var e = xa();
      return e === null ? null : { parent: la._currentValue, pool: e };
    }
    var wa = Error(i(460)),
      Ta = Error(i(474)),
      Ea = Error(i(542)),
      Da = { then: function () {} };
    function Oa(e) {
      return ((e = e.status), e === `fulfilled` || e === `rejected`);
    }
    function ka(e, t, n) {
      switch (
        ((n = e[n]),
        n === void 0 ? e.push(t) : n !== t && (t.then(rn, rn), (t = n)),
        t.status)
      ) {
        case `fulfilled`:
          return t.value;
        case `rejected`:
          throw ((e = t.reason), Na(e), e);
        default:
          if (typeof t.status == `string`) t.then(rn, rn);
          else {
            if (((e = K), e !== null && 100 < e.shellSuspendCounter))
              throw Error(i(482));
            ((e = t),
              (e.status = `pending`),
              e.then(
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    ((n.status = `fulfilled`), (n.value = e));
                  }
                },
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    ((n.status = `rejected`), (n.reason = e));
                  }
                },
              ));
          }
          switch (t.status) {
            case `fulfilled`:
              return t.value;
            case `rejected`:
              throw ((e = t.reason), Na(e), e);
          }
          throw ((ja = t), wa);
      }
    }
    function Aa(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (e) {
        throw typeof e == `object` && e && typeof e.then == `function`
          ? ((ja = e), wa)
          : e;
      }
    }
    var ja = null;
    function Ma() {
      if (ja === null) throw Error(i(459));
      var e = ja;
      return ((ja = null), e);
    }
    function Na(e) {
      if (e === wa || e === Ea) throw Error(i(483));
    }
    var Pa = null,
      Fa = 0;
    function Ia(e) {
      var t = Fa;
      return ((Fa += 1), Pa === null && (Pa = []), ka(Pa, e, t));
    }
    function La(e, t) {
      ((t = t.props.ref), (e.ref = t === void 0 ? null : t));
    }
    function Ra(e, t) {
      throw t.$$typeof === g
        ? Error(i(525))
        : ((e = Object.prototype.toString.call(t)),
          Error(
            i(
              31,
              e === `[object Object]`
                ? `object with keys {` + Object.keys(t).join(`, `) + `}`
                : e,
            ),
          ));
    }
    function za(e) {
      function t(t, n) {
        if (e) {
          var r = t.deletions;
          r === null ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
        }
      }
      function n(n, r) {
        if (!e) return null;
        for (; r !== null; ) (t(n, r), (r = r.sibling));
        return null;
      }
      function r(e) {
        for (var t = new Map(); e !== null; )
          (e.key === null ? t.set(e.index, e) : t.set(e.key, e),
            (e = e.sibling));
        return t;
      }
      function a(e, t) {
        return ((e = pi(e, t)), (e.index = 0), (e.sibling = null), e);
      }
      function o(t, n, r) {
        return (
          (t.index = r),
          e
            ? ((r = t.alternate),
              r === null
                ? ((t.flags |= 67108866), n)
                : ((r = r.index), r < n ? ((t.flags |= 67108866), n) : r))
            : ((t.flags |= 1048576), n)
        );
      }
      function s(t) {
        return (e && t.alternate === null && (t.flags |= 67108866), t);
      }
      function c(e, t, n, r) {
        return t === null || t.tag !== 6
          ? ((t = _i(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function l(e, t, n, r) {
        var i = n.type;
        return i === y
          ? d(e, t, n.props.children, r, n.key)
          : t !== null &&
              (t.elementType === i ||
                (typeof i == `object` &&
                  i &&
                  i.$$typeof === ne &&
                  Aa(i) === t.type))
            ? ((t = a(t, n.props)), La(t, n), (t.return = e), t)
            : ((t = hi(n.type, n.key, n.props, null, e.mode, r)),
              La(t, n),
              (t.return = e),
              t);
      }
      function u(e, t, n, r) {
        return t === null ||
          t.tag !== 4 ||
          t.stateNode.containerInfo !== n.containerInfo ||
          t.stateNode.implementation !== n.implementation
          ? ((t = yi(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n.children || [])), (t.return = e), t);
      }
      function d(e, t, n, r, i) {
        return t === null || t.tag !== 7
          ? ((t = gi(n, e.mode, r, i)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function f(e, t, n) {
        if (
          (typeof t == `string` && t !== ``) ||
          typeof t == `number` ||
          typeof t == `bigint`
        )
          return ((t = _i(`` + t, e.mode, n)), (t.return = e), t);
        if (typeof t == `object` && t) {
          switch (t.$$typeof) {
            case _:
              return (
                (n = hi(t.type, t.key, t.props, null, e.mode, n)),
                La(n, t),
                (n.return = e),
                n
              );
            case v:
              return ((t = yi(t, e.mode, n)), (t.return = e), t);
            case ne:
              return ((t = Aa(t)), f(e, t, n));
          }
          if (le(t) || oe(t))
            return ((t = gi(t, e.mode, n, null)), (t.return = e), t);
          if (typeof t.then == `function`) return f(e, Ia(t), n);
          if (t.$$typeof === C) return f(e, ia(e, t), n);
          Ra(e, t);
        }
        return null;
      }
      function p(e, t, n, r) {
        var i = t === null ? null : t.key;
        if (
          (typeof n == `string` && n !== ``) ||
          typeof n == `number` ||
          typeof n == `bigint`
        )
          return i === null ? c(e, t, `` + n, r) : null;
        if (typeof n == `object` && n) {
          switch (n.$$typeof) {
            case _:
              return n.key === i ? l(e, t, n, r) : null;
            case v:
              return n.key === i ? u(e, t, n, r) : null;
            case ne:
              return ((n = Aa(n)), p(e, t, n, r));
          }
          if (le(n) || oe(n)) return i === null ? d(e, t, n, r, null) : null;
          if (typeof n.then == `function`) return p(e, t, Ia(n), r);
          if (n.$$typeof === C) return p(e, t, ia(e, n), r);
          Ra(e, n);
        }
        return null;
      }
      function m(e, t, n, r, i) {
        if (
          (typeof r == `string` && r !== ``) ||
          typeof r == `number` ||
          typeof r == `bigint`
        )
          return ((e = e.get(n) || null), c(t, e, `` + r, i));
        if (typeof r == `object` && r) {
          switch (r.$$typeof) {
            case _:
              return (
                (e = e.get(r.key === null ? n : r.key) || null),
                l(t, e, r, i)
              );
            case v:
              return (
                (e = e.get(r.key === null ? n : r.key) || null),
                u(t, e, r, i)
              );
            case ne:
              return ((r = Aa(r)), m(e, t, n, r, i));
          }
          if (le(r) || oe(r))
            return ((e = e.get(n) || null), d(t, e, r, i, null));
          if (typeof r.then == `function`) return m(e, t, n, Ia(r), i);
          if (r.$$typeof === C) return m(e, t, n, ia(t, r), i);
          Ra(t, r);
        }
        return null;
      }
      function h(i, a, s, c) {
        for (
          var l = null, u = null, d = a, h = (a = 0), g = null;
          d !== null && h < s.length;
          h++
        ) {
          d.index > h ? ((g = d), (d = null)) : (g = d.sibling);
          var _ = p(i, d, s[h], c);
          if (_ === null) {
            d === null && (d = g);
            break;
          }
          (e && d && _.alternate === null && t(i, d),
            (a = o(_, a, h)),
            u === null ? (l = _) : (u.sibling = _),
            (u = _),
            (d = g));
        }
        if (h === s.length) return (n(i, d), L && ji(i, h), l);
        if (d === null) {
          for (; h < s.length; h++)
            ((d = f(i, s[h], c)),
              d !== null &&
                ((a = o(d, a, h)),
                u === null ? (l = d) : (u.sibling = d),
                (u = d)));
          return (L && ji(i, h), l);
        }
        for (d = r(d); h < s.length; h++)
          ((g = m(d, i, h, s[h], c)),
            g !== null &&
              (e &&
                g.alternate !== null &&
                d.delete(g.key === null ? h : g.key),
              (a = o(g, a, h)),
              u === null ? (l = g) : (u.sibling = g),
              (u = g)));
        return (
          e &&
            d.forEach(function (e) {
              return t(i, e);
            }),
          L && ji(i, h),
          l
        );
      }
      function g(a, s, c, l) {
        if (c == null) throw Error(i(151));
        for (
          var u = null, d = null, h = s, g = (s = 0), _ = null, v = c.next();
          h !== null && !v.done;
          g++, v = c.next()
        ) {
          h.index > g ? ((_ = h), (h = null)) : (_ = h.sibling);
          var y = p(a, h, v.value, l);
          if (y === null) {
            h === null && (h = _);
            break;
          }
          (e && h && y.alternate === null && t(a, h),
            (s = o(y, s, g)),
            d === null ? (u = y) : (d.sibling = y),
            (d = y),
            (h = _));
        }
        if (v.done) return (n(a, h), L && ji(a, g), u);
        if (h === null) {
          for (; !v.done; g++, v = c.next())
            ((v = f(a, v.value, l)),
              v !== null &&
                ((s = o(v, s, g)),
                d === null ? (u = v) : (d.sibling = v),
                (d = v)));
          return (L && ji(a, g), u);
        }
        for (h = r(h); !v.done; g++, v = c.next())
          ((v = m(h, a, g, v.value, l)),
            v !== null &&
              (e &&
                v.alternate !== null &&
                h.delete(v.key === null ? g : v.key),
              (s = o(v, s, g)),
              d === null ? (u = v) : (d.sibling = v),
              (d = v)));
        return (
          e &&
            h.forEach(function (e) {
              return t(a, e);
            }),
          L && ji(a, g),
          u
        );
      }
      function b(e, r, o, c) {
        if (
          (typeof o == `object` &&
            o &&
            o.type === y &&
            o.key === null &&
            (o = o.props.children),
          typeof o == `object` && o)
        ) {
          switch (o.$$typeof) {
            case _:
              a: {
                for (var l = o.key; r !== null; ) {
                  if (r.key === l) {
                    if (((l = o.type), l === y)) {
                      if (r.tag === 7) {
                        (n(e, r.sibling),
                          (c = a(r, o.props.children)),
                          (c.return = e),
                          (e = c));
                        break a;
                      }
                    } else if (
                      r.elementType === l ||
                      (typeof l == `object` &&
                        l &&
                        l.$$typeof === ne &&
                        Aa(l) === r.type)
                    ) {
                      (n(e, r.sibling),
                        (c = a(r, o.props)),
                        La(c, o),
                        (c.return = e),
                        (e = c));
                      break a;
                    }
                    n(e, r);
                    break;
                  } else t(e, r);
                  r = r.sibling;
                }
                o.type === y
                  ? ((c = gi(o.props.children, e.mode, c, o.key)),
                    (c.return = e),
                    (e = c))
                  : ((c = hi(o.type, o.key, o.props, null, e.mode, c)),
                    La(c, o),
                    (c.return = e),
                    (e = c));
              }
              return s(e);
            case v:
              a: {
                for (l = o.key; r !== null; ) {
                  if (r.key === l)
                    if (
                      r.tag === 4 &&
                      r.stateNode.containerInfo === o.containerInfo &&
                      r.stateNode.implementation === o.implementation
                    ) {
                      (n(e, r.sibling),
                        (c = a(r, o.children || [])),
                        (c.return = e),
                        (e = c));
                      break a;
                    } else {
                      n(e, r);
                      break;
                    }
                  else t(e, r);
                  r = r.sibling;
                }
                ((c = yi(o, e.mode, c)), (c.return = e), (e = c));
              }
              return s(e);
            case ne:
              return ((o = Aa(o)), b(e, r, o, c));
          }
          if (le(o)) return h(e, r, o, c);
          if (oe(o)) {
            if (((l = oe(o)), typeof l != `function`)) throw Error(i(150));
            return ((o = l.call(o)), g(e, r, o, c));
          }
          if (typeof o.then == `function`) return b(e, r, Ia(o), c);
          if (o.$$typeof === C) return b(e, r, ia(e, o), c);
          Ra(e, o);
        }
        return (typeof o == `string` && o !== ``) ||
          typeof o == `number` ||
          typeof o == `bigint`
          ? ((o = `` + o),
            r !== null && r.tag === 6
              ? (n(e, r.sibling), (c = a(r, o)), (c.return = e), (e = c))
              : (n(e, r), (c = _i(o, e.mode, c)), (c.return = e), (e = c)),
            s(e))
          : n(e, r);
      }
      return function (e, t, n, r) {
        try {
          Fa = 0;
          var i = b(e, t, n, r);
          return ((Pa = null), i);
        } catch (t) {
          if (t === wa || t === Ea) throw t;
          var a = di(29, t, null, e.mode);
          return ((a.lanes = r), (a.return = e), a);
        }
      };
    }
    var Ba = za(!0),
      Va = za(!1),
      Ha = !1;
    function Ua(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function Wa(e, t) {
      ((e = e.updateQueue),
        t.updateQueue === e &&
          (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            callbacks: null,
          }));
    }
    function Ga(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function Ka(e, t, n) {
      var r = e.updateQueue;
      if (r === null) return null;
      if (((r = r.shared), G & 2)) {
        var i = r.pending;
        return (
          i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
          (r.pending = t),
          (t = ci(e)),
          si(e, null, n),
          t
        );
      }
      return (ii(e, r, t, n), ci(e));
    }
    function qa(e, t, n) {
      if (((t = t.updateQueue), t !== null && ((t = t.shared), n & 4194048))) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), ot(e, n));
      }
    }
    function Ja(e, t) {
      var n = e.updateQueue,
        r = e.alternate;
      if (r !== null && ((r = r.updateQueue), n === r)) {
        var i = null,
          a = null;
        if (((n = n.firstBaseUpdate), n !== null)) {
          do {
            var o = {
              lane: n.lane,
              tag: n.tag,
              payload: n.payload,
              callback: null,
              next: null,
            };
            (a === null ? (i = a = o) : (a = a.next = o), (n = n.next));
          } while (n !== null);
          a === null ? (i = a = t) : (a = a.next = t);
        } else i = a = t;
        ((n = {
          baseState: r.baseState,
          firstBaseUpdate: i,
          lastBaseUpdate: a,
          shared: r.shared,
          callbacks: r.callbacks,
        }),
          (e.updateQueue = n));
        return;
      }
      ((e = n.lastBaseUpdate),
        e === null ? (n.firstBaseUpdate = t) : (e.next = t),
        (n.lastBaseUpdate = t));
    }
    var Ya = !1;
    function Xa() {
      if (Ya) {
        var e = ha;
        if (e !== null) throw e;
      }
    }
    function Za(e, t, n, r) {
      Ya = !1;
      var i = e.updateQueue;
      Ha = !1;
      var a = i.firstBaseUpdate,
        o = i.lastBaseUpdate,
        s = i.shared.pending;
      if (s !== null) {
        i.shared.pending = null;
        var c = s,
          l = c.next;
        ((c.next = null), o === null ? (a = l) : (o.next = l), (o = c));
        var u = e.alternate;
        u !== null &&
          ((u = u.updateQueue),
          (s = u.lastBaseUpdate),
          s !== o &&
            (s === null ? (u.firstBaseUpdate = l) : (s.next = l),
            (u.lastBaseUpdate = c)));
      }
      if (a !== null) {
        var d = i.baseState;
        ((o = 0), (u = l = c = null), (s = a));
        do {
          var f = s.lane & -536870913,
            p = f !== s.lane;
          if (p ? (J & f) === f : (r & f) === f) {
            (f !== 0 && f === ma && (Ya = !0),
              u !== null &&
                (u = u.next =
                  {
                    lane: 0,
                    tag: s.tag,
                    payload: s.payload,
                    callback: null,
                    next: null,
                  }));
            a: {
              var m = e,
                g = s;
              f = t;
              var _ = n;
              switch (g.tag) {
                case 1:
                  if (((m = g.payload), typeof m == `function`)) {
                    d = m.call(_, d, f);
                    break a;
                  }
                  d = m;
                  break a;
                case 3:
                  m.flags = (m.flags & -65537) | 128;
                case 0:
                  if (
                    ((m = g.payload),
                    (f = typeof m == `function` ? m.call(_, d, f) : m),
                    f == null)
                  )
                    break a;
                  d = h({}, d, f);
                  break a;
                case 2:
                  Ha = !0;
              }
            }
            ((f = s.callback),
              f !== null &&
                ((e.flags |= 64),
                p && (e.flags |= 8192),
                (p = i.callbacks),
                p === null ? (i.callbacks = [f]) : p.push(f)));
          } else
            ((p = {
              lane: f,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            }),
              u === null ? ((l = u = p), (c = d)) : (u = u.next = p),
              (o |= f));
          if (((s = s.next), s === null)) {
            if (((s = i.shared.pending), s === null)) break;
            ((p = s),
              (s = p.next),
              (p.next = null),
              (i.lastBaseUpdate = p),
              (i.shared.pending = null));
          }
        } while (1);
        (u === null && (c = d),
          (i.baseState = c),
          (i.firstBaseUpdate = l),
          (i.lastBaseUpdate = u),
          a === null && (i.shared.lanes = 0),
          (Gl |= o),
          (e.lanes = o),
          (e.memoizedState = d));
      }
    }
    function Qa(e, t) {
      if (typeof e != `function`) throw Error(i(191, e));
      e.call(t);
    }
    function $a(e, t) {
      var n = e.callbacks;
      if (n !== null)
        for (e.callbacks = null, e = 0; e < n.length; e++) Qa(n[e], t);
    }
    var eo = pe(null),
      to = pe(0);
    function no(e, t) {
      ((e = Wl), k(to, e), k(eo, t), (Wl = e | t.baseLanes));
    }
    function ro() {
      (k(to, Wl), k(eo, eo.current));
    }
    function io() {
      ((Wl = to.current), O(eo), O(to));
    }
    var ao = pe(null),
      oo = null;
    function so(e) {
      var t = e.alternate;
      (k(R, R.current & 1),
        k(ao, e),
        oo === null &&
          (t === null || eo.current !== null || t.memoizedState !== null) &&
          (oo = e));
    }
    function co(e) {
      (k(R, R.current), k(ao, e), oo === null && (oo = e));
    }
    function lo(e) {
      e.tag === 22
        ? (k(R, R.current), k(ao, e), oo === null && (oo = e))
        : uo(e);
    }
    function uo() {
      (k(R, R.current), k(ao, ao.current));
    }
    function fo(e) {
      (O(ao), oo === e && (oo = null), O(R));
    }
    var R = pe(0);
    function po(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var n = t.memoizedState;
          if (n !== null && ((n = n.dehydrated), n === null || af(n) || of(n)))
            return t;
        } else if (
          t.tag === 19 &&
          (t.memoizedProps.revealOrder === `forwards` ||
            t.memoizedProps.revealOrder === `backwards` ||
            t.memoizedProps.revealOrder === `unstable_legacy-backwards` ||
            t.memoizedProps.revealOrder === `together`)
        ) {
          if (t.flags & 128) return t;
        } else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
      return null;
    }
    var mo = 0,
      z = null,
      B = null,
      ho = null,
      go = !1,
      _o = !1,
      vo = !1,
      yo = 0,
      bo = 0,
      xo = null,
      So = 0;
    function V() {
      throw Error(i(321));
    }
    function Co(e, t) {
      if (t === null) return !1;
      for (var n = 0; n < t.length && n < e.length; n++)
        if (!Tr(e[n], t[n])) return !1;
      return !0;
    }
    function wo(e, t, n, r, i, a) {
      return (
        (mo = a),
        (z = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (E.H = e === null || e.memoizedState === null ? Bs : Vs),
        (vo = !1),
        (a = n(r, i)),
        (vo = !1),
        _o && (a = Eo(t, n, r, i)),
        To(e),
        a
      );
    }
    function To(e) {
      E.H = zs;
      var t = B !== null && B.next !== null;
      if (((mo = 0), (ho = B = z = null), (go = !1), (bo = 0), (xo = null), t))
        throw Error(i(300));
      e === null ||
        ic ||
        ((e = e.dependencies), e !== null && ta(e) && (ic = !0));
    }
    function Eo(e, t, n, r) {
      z = e;
      var a = 0;
      do {
        if ((_o && (xo = null), (bo = 0), (_o = !1), 25 <= a))
          throw Error(i(301));
        if (((a += 1), (ho = B = null), e.updateQueue != null)) {
          var o = e.updateQueue;
          ((o.lastEffect = null),
            (o.events = null),
            (o.stores = null),
            o.memoCache != null && (o.memoCache.index = 0));
        }
        ((E.H = Hs), (o = t(n, r)));
      } while (_o);
      return o;
    }
    function Do() {
      var e = E.H,
        t = e.useState()[0];
      return (
        (t = typeof t.then == `function` ? No(t) : t),
        (e = e.useState()[0]),
        (B === null ? null : B.memoizedState) !== e && (z.flags |= 1024),
        t
      );
    }
    function Oo() {
      var e = yo !== 0;
      return ((yo = 0), e);
    }
    function ko(e, t, n) {
      ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
    }
    function Ao(e) {
      if (go) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          (t !== null && (t.pending = null), (e = e.next));
        }
        go = !1;
      }
      ((mo = 0), (ho = B = z = null), (_o = !1), (bo = yo = 0), (xo = null));
    }
    function jo() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
      };
      return (
        ho === null ? (z.memoizedState = ho = e) : (ho = ho.next = e),
        ho
      );
    }
    function H() {
      if (B === null) {
        var e = z.alternate;
        e = e === null ? null : e.memoizedState;
      } else e = B.next;
      var t = ho === null ? z.memoizedState : ho.next;
      if (t !== null) ((ho = t), (B = e));
      else {
        if (e === null)
          throw z.alternate === null ? Error(i(467)) : Error(i(310));
        ((B = e),
          (e = {
            memoizedState: B.memoizedState,
            baseState: B.baseState,
            baseQueue: B.baseQueue,
            queue: B.queue,
            next: null,
          }),
          ho === null ? (z.memoizedState = ho = e) : (ho = ho.next = e));
      }
      return ho;
    }
    function Mo() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function No(e) {
      var t = bo;
      return (
        (bo += 1),
        xo === null && (xo = []),
        (e = ka(xo, e, t)),
        (t = z),
        (ho === null ? t.memoizedState : ho.next) === null &&
          ((t = t.alternate),
          (E.H = t === null || t.memoizedState === null ? Bs : Vs)),
        e
      );
    }
    function Po(e) {
      if (typeof e == `object` && e) {
        if (typeof e.then == `function`) return No(e);
        if (e.$$typeof === C) return ra(e);
      }
      throw Error(i(438, String(e)));
    }
    function Fo(e) {
      var t = null,
        n = z.updateQueue;
      if ((n !== null && (t = n.memoCache), t == null)) {
        var r = z.alternate;
        r !== null &&
          ((r = r.updateQueue),
          r !== null &&
            ((r = r.memoCache),
            r != null &&
              (t = {
                data: r.data.map(function (e) {
                  return e.slice();
                }),
                index: 0,
              })));
      }
      if (
        ((t ??= { data: [], index: 0 }),
        n === null && ((n = Mo()), (z.updateQueue = n)),
        (n.memoCache = t),
        (n = t.data[t.index]),
        n === void 0)
      )
        for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ie;
      return (t.index++, n);
    }
    function Io(e, t) {
      return typeof t == `function` ? t(e) : t;
    }
    function Lo(e) {
      return Ro(H(), B, e);
    }
    function Ro(e, t, n) {
      var r = e.queue;
      if (r === null) throw Error(i(311));
      r.lastRenderedReducer = n;
      var a = e.baseQueue,
        o = r.pending;
      if (o !== null) {
        if (a !== null) {
          var s = a.next;
          ((a.next = o.next), (o.next = s));
        }
        ((t.baseQueue = a = o), (r.pending = null));
      }
      if (((o = e.baseState), a === null)) e.memoizedState = o;
      else {
        t = a.next;
        var c = (s = null),
          l = null,
          u = t,
          d = !1;
        do {
          var f = u.lane & -536870913;
          if (f === u.lane ? (mo & f) === f : (J & f) === f) {
            var p = u.revertLane;
            if (p === 0)
              (l !== null &&
                (l = l.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: u.action,
                    hasEagerState: u.hasEagerState,
                    eagerState: u.eagerState,
                    next: null,
                  }),
                f === ma && (d = !0));
            else if ((mo & p) === p) {
              ((u = u.next), p === ma && (d = !0));
              continue;
            } else
              ((f = {
                lane: 0,
                revertLane: u.revertLane,
                gesture: null,
                action: u.action,
                hasEagerState: u.hasEagerState,
                eagerState: u.eagerState,
                next: null,
              }),
                l === null ? ((c = l = f), (s = o)) : (l = l.next = f),
                (z.lanes |= p),
                (Gl |= p));
            ((f = u.action),
              vo && n(o, f),
              (o = u.hasEagerState ? u.eagerState : n(o, f)));
          } else
            ((p = {
              lane: f,
              revertLane: u.revertLane,
              gesture: u.gesture,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
              l === null ? ((c = l = p), (s = o)) : (l = l.next = p),
              (z.lanes |= f),
              (Gl |= f));
          u = u.next;
        } while (u !== null && u !== t);
        if (
          (l === null ? (s = o) : (l.next = c),
          !Tr(o, e.memoizedState) && ((ic = !0), d && ((n = ha), n !== null)))
        )
          throw n;
        ((e.memoizedState = o),
          (e.baseState = s),
          (e.baseQueue = l),
          (r.lastRenderedState = o));
      }
      return (a === null && (r.lanes = 0), [e.memoizedState, r.dispatch]);
    }
    function zo(e) {
      var t = H(),
        n = t.queue;
      if (n === null) throw Error(i(311));
      n.lastRenderedReducer = e;
      var r = n.dispatch,
        a = n.pending,
        o = t.memoizedState;
      if (a !== null) {
        n.pending = null;
        var s = (a = a.next);
        do ((o = e(o, s.action)), (s = s.next));
        while (s !== a);
        (Tr(o, t.memoizedState) || (ic = !0),
          (t.memoizedState = o),
          t.baseQueue === null && (t.baseState = o),
          (n.lastRenderedState = o));
      }
      return [o, r];
    }
    function Bo(e, t, n) {
      var r = z,
        a = H(),
        o = L;
      if (o) {
        if (n === void 0) throw Error(i(407));
        n = n();
      } else n = t();
      var s = !Tr((B || a).memoizedState, n);
      if (
        (s && ((a.memoizedState = n), (ic = !0)),
        (a = a.queue),
        ds(Uo.bind(null, r, a, e), [e]),
        a.getSnapshot !== t || s || (ho !== null && ho.memoizedState.tag & 1))
      ) {
        if (
          ((r.flags |= 2048),
          os(9, { destroy: void 0 }, Ho.bind(null, r, a, n, t), null),
          K === null)
        )
          throw Error(i(349));
        o || mo & 127 || Vo(r, t, n);
      }
      return n;
    }
    function Vo(e, t, n) {
      ((e.flags |= 16384),
        (e = { getSnapshot: t, value: n }),
        (t = z.updateQueue),
        t === null
          ? ((t = Mo()), (z.updateQueue = t), (t.stores = [e]))
          : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
    }
    function Ho(e, t, n, r) {
      ((t.value = n), (t.getSnapshot = r), Wo(t) && Go(e));
    }
    function Uo(e, t, n) {
      return n(function () {
        Wo(t) && Go(e);
      });
    }
    function Wo(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !Tr(e, n);
      } catch {
        return !0;
      }
    }
    function Go(e) {
      var t = oi(e, 2);
      t !== null && hu(t, e, 2);
    }
    function Ko(e) {
      var t = jo();
      if (typeof e == `function`) {
        var n = e;
        if (((e = n()), vo)) {
          We(!0);
          try {
            n();
          } finally {
            We(!1);
          }
        }
      }
      return (
        (t.memoizedState = t.baseState = e),
        (t.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Io,
          lastRenderedState: e,
        }),
        t
      );
    }
    function qo(e, t, n, r) {
      return ((e.baseState = n), Ro(e, B, typeof r == `function` ? r : Io));
    }
    function Jo(e, t, n, r, a) {
      if (Is(e)) throw Error(i(485));
      if (((e = t.action), e !== null)) {
        var o = {
          payload: a,
          action: e,
          next: null,
          isTransition: !0,
          status: `pending`,
          value: null,
          reason: null,
          listeners: [],
          then: function (e) {
            o.listeners.push(e);
          },
        };
        (E.T === null ? (o.isTransition = !1) : n(!0),
          r(o),
          (n = t.pending),
          n === null
            ? ((o.next = t.pending = o), Yo(t, o))
            : ((o.next = n.next), (t.pending = n.next = o)));
      }
    }
    function Yo(e, t) {
      var n = t.action,
        r = t.payload,
        i = e.state;
      if (t.isTransition) {
        var a = E.T,
          o = {};
        E.T = o;
        try {
          var s = n(i, r),
            c = E.S;
          (c !== null && c(o, s), Xo(e, t, s));
        } catch (n) {
          Qo(e, t, n);
        } finally {
          (a !== null && o.types !== null && (a.types = o.types), (E.T = a));
        }
      } else
        try {
          ((a = n(i, r)), Xo(e, t, a));
        } catch (n) {
          Qo(e, t, n);
        }
    }
    function Xo(e, t, n) {
      typeof n == `object` && n && typeof n.then == `function`
        ? n.then(
            function (n) {
              Zo(e, t, n);
            },
            function (n) {
              return Qo(e, t, n);
            },
          )
        : Zo(e, t, n);
    }
    function Zo(e, t, n) {
      ((t.status = `fulfilled`),
        (t.value = n),
        $o(t),
        (e.state = n),
        (t = e.pending),
        t !== null &&
          ((n = t.next),
          n === t
            ? (e.pending = null)
            : ((n = n.next), (t.next = n), Yo(e, n))));
    }
    function Qo(e, t, n) {
      var r = e.pending;
      if (((e.pending = null), r !== null)) {
        r = r.next;
        do ((t.status = `rejected`), (t.reason = n), $o(t), (t = t.next));
        while (t !== r);
      }
      e.action = null;
    }
    function $o(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function es(e, t) {
      return t;
    }
    function ts(e, t) {
      if (L) {
        var n = K.formState;
        if (n !== null) {
          a: {
            var r = z;
            if (L) {
              if (I) {
                b: {
                  for (var i = I, a = Ri; i.nodeType !== 8; ) {
                    if (!a) {
                      i = null;
                      break b;
                    }
                    if (((i = cf(i.nextSibling)), i === null)) {
                      i = null;
                      break b;
                    }
                  }
                  ((a = i.data), (i = a === `F!` || a === `F` ? i : null));
                }
                if (i) {
                  ((I = cf(i.nextSibling)), (r = i.data === `F!`));
                  break a;
                }
              }
              Bi(r);
            }
            r = !1;
          }
          r && (t = n[0]);
        }
      }
      return (
        (n = jo()),
        (n.memoizedState = n.baseState = t),
        (r = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: es,
          lastRenderedState: t,
        }),
        (n.queue = r),
        (n = Ns.bind(null, z, r)),
        (r.dispatch = n),
        (r = Ko(!1)),
        (a = Fs.bind(null, z, !1, r.queue)),
        (r = jo()),
        (i = { state: t, dispatch: null, action: e, pending: null }),
        (r.queue = i),
        (n = Jo.bind(null, z, i, a, n)),
        (i.dispatch = n),
        (r.memoizedState = e),
        [t, n, !1]
      );
    }
    function ns(e) {
      return rs(H(), B, e);
    }
    function rs(e, t, n) {
      if (
        ((t = Ro(e, t, es)[0]),
        (e = Lo(Io)[0]),
        typeof t == `object` && t && typeof t.then == `function`)
      )
        try {
          var r = No(t);
        } catch (e) {
          throw e === wa ? Ea : e;
        }
      else r = t;
      t = H();
      var i = t.queue,
        a = i.dispatch;
      return (
        n !== t.memoizedState &&
          ((z.flags |= 2048),
          os(9, { destroy: void 0 }, is.bind(null, i, n), null)),
        [r, a, e]
      );
    }
    function is(e, t) {
      e.action = t;
    }
    function as(e) {
      var t = H(),
        n = B;
      if (n !== null) return rs(t, n, e);
      (H(), (t = t.memoizedState), (n = H()));
      var r = n.queue.dispatch;
      return ((n.memoizedState = e), [t, r, !1]);
    }
    function os(e, t, n, r) {
      return (
        (e = { tag: e, create: n, deps: r, inst: t, next: null }),
        (t = z.updateQueue),
        t === null && ((t = Mo()), (z.updateQueue = t)),
        (n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
        e
      );
    }
    function ss() {
      return H().memoizedState;
    }
    function cs(e, t, n, r) {
      var i = jo();
      ((z.flags |= e),
        (i.memoizedState = os(
          1 | t,
          { destroy: void 0 },
          n,
          r === void 0 ? null : r,
        )));
    }
    function ls(e, t, n, r) {
      var i = H();
      r = r === void 0 ? null : r;
      var a = i.memoizedState.inst;
      B !== null && r !== null && Co(r, B.memoizedState.deps)
        ? (i.memoizedState = os(t, a, n, r))
        : ((z.flags |= e), (i.memoizedState = os(1 | t, a, n, r)));
    }
    function us(e, t) {
      cs(8390656, 8, e, t);
    }
    function ds(e, t) {
      ls(2048, 8, e, t);
    }
    function fs(e) {
      z.flags |= 4;
      var t = z.updateQueue;
      if (t === null) ((t = Mo()), (z.updateQueue = t), (t.events = [e]));
      else {
        var n = t.events;
        n === null ? (t.events = [e]) : n.push(e);
      }
    }
    function ps(e) {
      var t = H().memoizedState;
      return (
        fs({ ref: t, nextImpl: e }),
        function () {
          if (G & 2) throw Error(i(440));
          return t.impl.apply(void 0, arguments);
        }
      );
    }
    function ms(e, t) {
      return ls(4, 2, e, t);
    }
    function hs(e, t) {
      return ls(4, 4, e, t);
    }
    function gs(e, t) {
      if (typeof t == `function`) {
        e = e();
        var n = t(e);
        return function () {
          typeof n == `function` ? n() : t(null);
        };
      }
      if (t != null)
        return (
          (e = e()),
          (t.current = e),
          function () {
            t.current = null;
          }
        );
    }
    function _s(e, t, n) {
      ((n = n == null ? null : n.concat([e])),
        ls(4, 4, gs.bind(null, t, e), n));
    }
    function vs() {}
    function ys(e, t) {
      var n = H();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      return t !== null && Co(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
    }
    function bs(e, t) {
      var n = H();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      if (t !== null && Co(t, r[1])) return r[0];
      if (((r = e()), vo)) {
        We(!0);
        try {
          e();
        } finally {
          We(!1);
        }
      }
      return ((n.memoizedState = [r, t]), r);
    }
    function xs(e, t, n) {
      return n === void 0 || (mo & 1073741824 && !(J & 261930))
        ? (e.memoizedState = t)
        : ((e.memoizedState = n), (e = mu()), (z.lanes |= e), (Gl |= e), n);
    }
    function Ss(e, t, n, r) {
      return Tr(n, t)
        ? n
        : eo.current === null
          ? !(mo & 42) || (mo & 1073741824 && !(J & 261930))
            ? ((ic = !0), (e.memoizedState = n))
            : ((e = mu()), (z.lanes |= e), (Gl |= e), t)
          : ((e = xs(e, n, r)), Tr(e, t) || (ic = !0), e);
    }
    function Cs(e, t, n, r, i) {
      var a = D.p;
      D.p = a !== 0 && 8 > a ? a : 8;
      var o = E.T,
        s = {};
      ((E.T = s), Fs(e, !1, t, n));
      try {
        var c = i(),
          l = E.S;
        (l !== null && l(s, c),
          typeof c == `object` && c && typeof c.then == `function`
            ? Ps(e, t, va(c, r), pu(e))
            : Ps(e, t, r, pu(e)));
      } catch (n) {
        Ps(e, t, { then: function () {}, status: `rejected`, reason: n }, pu());
      } finally {
        ((D.p = a),
          o !== null && s.types !== null && (o.types = s.types),
          (E.T = o));
      }
    }
    function ws() {}
    function Ts(e, t, n, r) {
      if (e.tag !== 5) throw Error(i(476));
      var a = Es(e).queue;
      Cs(
        e,
        a,
        t,
        ue,
        n === null
          ? ws
          : function () {
              return (Ds(e), n(r));
            },
      );
    }
    function Es(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: ue,
        baseState: ue,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Io,
          lastRenderedState: ue,
        },
        next: null,
      };
      var n = {};
      return (
        (t.next = {
          memoizedState: n,
          baseState: n,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Io,
            lastRenderedState: n,
          },
          next: null,
        }),
        (e.memoizedState = t),
        (e = e.alternate),
        e !== null && (e.memoizedState = t),
        t
      );
    }
    function Ds(e) {
      var t = Es(e);
      (t.next === null && (t = e.alternate.memoizedState),
        Ps(e, t.next.queue, {}, pu()));
    }
    function Os() {
      return ra(Qf);
    }
    function ks() {
      return H().memoizedState;
    }
    function As() {
      return H().memoizedState;
    }
    function js(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var n = pu();
            e = Ga(n);
            var r = Ka(t, e, n);
            (r !== null && (hu(r, t, n), qa(r, t, n)),
              (t = { cache: ua() }),
              (e.payload = t));
            return;
        }
        t = t.return;
      }
    }
    function Ms(e, t, n) {
      var r = pu();
      ((n = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        Is(e)
          ? Ls(t, n)
          : ((n = ai(e, t, n, r)), n !== null && (hu(n, e, r), Rs(n, t, r))));
    }
    function Ns(e, t, n) {
      Ps(e, t, n, pu());
    }
    function Ps(e, t, n, r) {
      var i = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (Is(e)) Ls(t, i);
      else {
        var a = e.alternate;
        if (
          e.lanes === 0 &&
          (a === null || a.lanes === 0) &&
          ((a = t.lastRenderedReducer), a !== null)
        )
          try {
            var o = t.lastRenderedState,
              s = a(o, n);
            if (((i.hasEagerState = !0), (i.eagerState = s), Tr(s, o)))
              return (ii(e, t, i, 0), K === null && ri(), !1);
          } catch {}
        if (((n = ai(e, t, i, r)), n !== null))
          return (hu(n, e, r), Rs(n, t, r), !0);
      }
      return !1;
    }
    function Fs(e, t, n, r) {
      if (
        ((r = {
          lane: 2,
          revertLane: dd(),
          gesture: null,
          action: r,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        Is(e))
      ) {
        if (t) throw Error(i(479));
      } else ((t = ai(e, n, r, 2)), t !== null && hu(t, e, 2));
    }
    function Is(e) {
      var t = e.alternate;
      return e === z || (t !== null && t === z);
    }
    function Ls(e, t) {
      _o = go = !0;
      var n = e.pending;
      (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
        (e.pending = t));
    }
    function Rs(e, t, n) {
      if (n & 4194048) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), ot(e, n));
      }
    }
    var zs = {
      readContext: ra,
      use: Po,
      useCallback: V,
      useContext: V,
      useEffect: V,
      useImperativeHandle: V,
      useLayoutEffect: V,
      useInsertionEffect: V,
      useMemo: V,
      useReducer: V,
      useRef: V,
      useState: V,
      useDebugValue: V,
      useDeferredValue: V,
      useTransition: V,
      useSyncExternalStore: V,
      useId: V,
      useHostTransitionStatus: V,
      useFormState: V,
      useActionState: V,
      useOptimistic: V,
      useMemoCache: V,
      useCacheRefresh: V,
    };
    zs.useEffectEvent = V;
    var Bs = {
        readContext: ra,
        use: Po,
        useCallback: function (e, t) {
          return ((jo().memoizedState = [e, t === void 0 ? null : t]), e);
        },
        useContext: ra,
        useEffect: us,
        useImperativeHandle: function (e, t, n) {
          ((n = n == null ? null : n.concat([e])),
            cs(4194308, 4, gs.bind(null, t, e), n));
        },
        useLayoutEffect: function (e, t) {
          return cs(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          cs(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var n = jo();
          t = t === void 0 ? null : t;
          var r = e();
          if (vo) {
            We(!0);
            try {
              e();
            } finally {
              We(!1);
            }
          }
          return ((n.memoizedState = [r, t]), r);
        },
        useReducer: function (e, t, n) {
          var r = jo();
          if (n !== void 0) {
            var i = n(t);
            if (vo) {
              We(!0);
              try {
                n(t);
              } finally {
                We(!1);
              }
            }
          } else i = t;
          return (
            (r.memoizedState = r.baseState = i),
            (e = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: e,
              lastRenderedState: i,
            }),
            (r.queue = e),
            (e = e.dispatch = Ms.bind(null, z, e)),
            [r.memoizedState, e]
          );
        },
        useRef: function (e) {
          var t = jo();
          return ((e = { current: e }), (t.memoizedState = e));
        },
        useState: function (e) {
          e = Ko(e);
          var t = e.queue,
            n = Ns.bind(null, z, t);
          return ((t.dispatch = n), [e.memoizedState, n]);
        },
        useDebugValue: vs,
        useDeferredValue: function (e, t) {
          return xs(jo(), e, t);
        },
        useTransition: function () {
          var e = Ko(!1);
          return (
            (e = Cs.bind(null, z, e.queue, !0, !1)),
            (jo().memoizedState = e),
            [!1, e]
          );
        },
        useSyncExternalStore: function (e, t, n) {
          var r = z,
            a = jo();
          if (L) {
            if (n === void 0) throw Error(i(407));
            n = n();
          } else {
            if (((n = t()), K === null)) throw Error(i(349));
            J & 127 || Vo(r, t, n);
          }
          a.memoizedState = n;
          var o = { value: n, getSnapshot: t };
          return (
            (a.queue = o),
            us(Uo.bind(null, r, o, e), [e]),
            (r.flags |= 2048),
            os(9, { destroy: void 0 }, Ho.bind(null, r, o, n, t), null),
            n
          );
        },
        useId: function () {
          var e = jo(),
            t = K.identifierPrefix;
          if (L) {
            var n = Ai,
              r = ki;
            ((n = (r & ~(1 << (32 - j(r) - 1))).toString(32) + n),
              (t = `_` + t + `R_` + n),
              (n = yo++),
              0 < n && (t += `H` + n.toString(32)),
              (t += `_`));
          } else ((n = So++), (t = `_` + t + `r_` + n.toString(32) + `_`));
          return (e.memoizedState = t);
        },
        useHostTransitionStatus: Os,
        useFormState: ts,
        useActionState: ts,
        useOptimistic: function (e) {
          var t = jo();
          t.memoizedState = t.baseState = e;
          var n = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return (
            (t.queue = n),
            (t = Fs.bind(null, z, !0, n)),
            (n.dispatch = t),
            [e, t]
          );
        },
        useMemoCache: Fo,
        useCacheRefresh: function () {
          return (jo().memoizedState = js.bind(null, z));
        },
        useEffectEvent: function (e) {
          var t = jo(),
            n = { impl: e };
          return (
            (t.memoizedState = n),
            function () {
              if (G & 2) throw Error(i(440));
              return n.impl.apply(void 0, arguments);
            }
          );
        },
      },
      Vs = {
        readContext: ra,
        use: Po,
        useCallback: ys,
        useContext: ra,
        useEffect: ds,
        useImperativeHandle: _s,
        useInsertionEffect: ms,
        useLayoutEffect: hs,
        useMemo: bs,
        useReducer: Lo,
        useRef: ss,
        useState: function () {
          return Lo(Io);
        },
        useDebugValue: vs,
        useDeferredValue: function (e, t) {
          return Ss(H(), B.memoizedState, e, t);
        },
        useTransition: function () {
          var e = Lo(Io)[0],
            t = H().memoizedState;
          return [typeof e == `boolean` ? e : No(e), t];
        },
        useSyncExternalStore: Bo,
        useId: ks,
        useHostTransitionStatus: Os,
        useFormState: ns,
        useActionState: ns,
        useOptimistic: function (e, t) {
          return qo(H(), B, e, t);
        },
        useMemoCache: Fo,
        useCacheRefresh: As,
      };
    Vs.useEffectEvent = ps;
    var Hs = {
      readContext: ra,
      use: Po,
      useCallback: ys,
      useContext: ra,
      useEffect: ds,
      useImperativeHandle: _s,
      useInsertionEffect: ms,
      useLayoutEffect: hs,
      useMemo: bs,
      useReducer: zo,
      useRef: ss,
      useState: function () {
        return zo(Io);
      },
      useDebugValue: vs,
      useDeferredValue: function (e, t) {
        var n = H();
        return B === null ? xs(n, e, t) : Ss(n, B.memoizedState, e, t);
      },
      useTransition: function () {
        var e = zo(Io)[0],
          t = H().memoizedState;
        return [typeof e == `boolean` ? e : No(e), t];
      },
      useSyncExternalStore: Bo,
      useId: ks,
      useHostTransitionStatus: Os,
      useFormState: as,
      useActionState: as,
      useOptimistic: function (e, t) {
        var n = H();
        return B === null
          ? ((n.baseState = e), [e, n.queue.dispatch])
          : qo(n, B, e, t);
      },
      useMemoCache: Fo,
      useCacheRefresh: As,
    };
    Hs.useEffectEvent = ps;
    function Us(e, t, n, r) {
      ((t = e.memoizedState),
        (n = n(r, t)),
        (n = n == null ? t : h({}, t, n)),
        (e.memoizedState = n),
        e.lanes === 0 && (e.updateQueue.baseState = n));
    }
    var Ws = {
      enqueueSetState: function (e, t, n) {
        e = e._reactInternals;
        var r = pu(),
          i = Ga(r);
        ((i.payload = t),
          n != null && (i.callback = n),
          (t = Ka(e, i, r)),
          t !== null && (hu(t, e, r), qa(t, e, r)));
      },
      enqueueReplaceState: function (e, t, n) {
        e = e._reactInternals;
        var r = pu(),
          i = Ga(r);
        ((i.tag = 1),
          (i.payload = t),
          n != null && (i.callback = n),
          (t = Ka(e, i, r)),
          t !== null && (hu(t, e, r), qa(t, e, r)));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var n = pu(),
          r = Ga(n);
        ((r.tag = 2),
          t != null && (r.callback = t),
          (t = Ka(e, r, n)),
          t !== null && (hu(t, e, n), qa(t, e, n)));
      },
    };
    function Gs(e, t, n, r, i, a, o) {
      return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == `function`
          ? e.shouldComponentUpdate(r, a, o)
          : t.prototype && t.prototype.isPureReactComponent
            ? !Er(n, r) || !Er(i, a)
            : !0
      );
    }
    function Ks(e, t, n, r) {
      ((e = t.state),
        typeof t.componentWillReceiveProps == `function` &&
          t.componentWillReceiveProps(n, r),
        typeof t.UNSAFE_componentWillReceiveProps == `function` &&
          t.UNSAFE_componentWillReceiveProps(n, r),
        t.state !== e && Ws.enqueueReplaceState(t, t.state, null));
    }
    function qs(e, t) {
      var n = t;
      if (`ref` in t) for (var r in ((n = {}), t)) r !== `ref` && (n[r] = t[r]);
      if ((e = e.defaultProps))
        for (var i in (n === t && (n = h({}, n)), e))
          n[i] === void 0 && (n[i] = e[i]);
      return n;
    }
    function Js(e) {
      $r(e);
    }
    function Ys(e) {
      console.error(e);
    }
    function Xs(e) {
      $r(e);
    }
    function Zs(e, t) {
      try {
        var n = e.onUncaughtError;
        n(t.value, { componentStack: t.stack });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function Qs(e, t, n) {
      try {
        var r = e.onCaughtError;
        r(n.value, {
          componentStack: n.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null,
        });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function $s(e, t, n) {
      return (
        (n = Ga(n)),
        (n.tag = 3),
        (n.payload = { element: null }),
        (n.callback = function () {
          Zs(e, t);
        }),
        n
      );
    }
    function ec(e) {
      return ((e = Ga(e)), (e.tag = 3), e);
    }
    function tc(e, t, n, r) {
      var i = n.type.getDerivedStateFromError;
      if (typeof i == `function`) {
        var a = r.value;
        ((e.payload = function () {
          return i(a);
        }),
          (e.callback = function () {
            Qs(t, n, r);
          }));
      }
      var o = n.stateNode;
      o !== null &&
        typeof o.componentDidCatch == `function` &&
        (e.callback = function () {
          (Qs(t, n, r),
            typeof i != `function` &&
              (ru === null ? (ru = new Set([this])) : ru.add(this)));
          var e = r.stack;
          this.componentDidCatch(r.value, {
            componentStack: e === null ? `` : e,
          });
        });
    }
    function nc(e, t, n, r, a) {
      if (
        ((n.flags |= 32768),
        typeof r == `object` && r && typeof r.then == `function`)
      ) {
        if (
          ((t = n.alternate),
          t !== null && ea(t, n, a, !0),
          (n = ao.current),
          n !== null)
        ) {
          switch (n.tag) {
            case 31:
            case 13:
              return (
                oo === null ? Du() : n.alternate === null && X === 0 && (X = 3),
                (n.flags &= -257),
                (n.flags |= 65536),
                (n.lanes = a),
                r === Da
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null ? (n.updateQueue = new Set([r])) : t.add(r),
                    Gu(e, r, a)),
                !1
              );
            case 22:
              return (
                (n.flags |= 65536),
                r === Da
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null
                      ? ((t = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([r]),
                        }),
                        (n.updateQueue = t))
                      : ((n = t.retryQueue),
                        n === null ? (t.retryQueue = new Set([r])) : n.add(r)),
                    Gu(e, r, a)),
                !1
              );
          }
          throw Error(i(435, n.tag));
        }
        return (Gu(e, r, a), Du(), !1);
      }
      if (L)
        return (
          (t = ao.current),
          t === null
            ? (r !== zi && ((t = Error(i(423), { cause: r })), Ki(xi(t, n))),
              (e = e.current.alternate),
              (e.flags |= 65536),
              (a &= -a),
              (e.lanes |= a),
              (r = xi(r, n)),
              (a = $s(e.stateNode, r, a)),
              Ja(e, a),
              X !== 4 && (X = 2))
            : (!(t.flags & 65536) && (t.flags |= 256),
              (t.flags |= 65536),
              (t.lanes = a),
              r !== zi && ((e = Error(i(422), { cause: r })), Ki(xi(e, n)))),
          !1
        );
      var o = Error(i(520), { cause: r });
      if (
        ((o = xi(o, n)),
        Xl === null ? (Xl = [o]) : Xl.push(o),
        X !== 4 && (X = 2),
        t === null)
      )
        return !0;
      ((r = xi(r, n)), (n = t));
      do {
        switch (n.tag) {
          case 3:
            return (
              (n.flags |= 65536),
              (e = a & -a),
              (n.lanes |= e),
              (e = $s(n.stateNode, r, e)),
              Ja(n, e),
              !1
            );
          case 1:
            if (
              ((t = n.type),
              (o = n.stateNode),
              !(n.flags & 128) &&
                (typeof t.getDerivedStateFromError == `function` ||
                  (o !== null &&
                    typeof o.componentDidCatch == `function` &&
                    (ru === null || !ru.has(o)))))
            )
              return (
                (n.flags |= 65536),
                (a &= -a),
                (n.lanes |= a),
                (a = ec(a)),
                tc(a, e, n, r),
                Ja(n, a),
                !1
              );
        }
        n = n.return;
      } while (n !== null);
      return !1;
    }
    var rc = Error(i(461)),
      ic = !1;
    function ac(e, t, n, r) {
      t.child = e === null ? Va(t, null, n, r) : Ba(t, e.child, n, r);
    }
    function oc(e, t, n, r, i) {
      n = n.render;
      var a = t.ref;
      if (`ref` in r) {
        var o = {};
        for (var s in r) s !== `ref` && (o[s] = r[s]);
      } else o = r;
      return (
        na(t),
        (r = wo(e, t, n, o, a, i)),
        (s = Oo()),
        e !== null && !ic
          ? (ko(e, t, i), Ac(e, t, i))
          : (L && s && Ni(t), (t.flags |= 1), ac(e, t, r, i), t.child)
      );
    }
    function sc(e, t, n, r, i) {
      if (e === null) {
        var a = n.type;
        return typeof a == `function` &&
          !fi(a) &&
          a.defaultProps === void 0 &&
          n.compare === null
          ? ((t.tag = 15), (t.type = a), cc(e, t, a, r, i))
          : ((e = hi(n.type, null, r, t, t.mode, i)),
            (e.ref = t.ref),
            (e.return = t),
            (t.child = e));
      }
      if (((a = e.child), !jc(e, i))) {
        var o = a.memoizedProps;
        if (
          ((n = n.compare),
          (n = n === null ? Er : n),
          n(o, r) && e.ref === t.ref)
        )
          return Ac(e, t, i);
      }
      return (
        (t.flags |= 1),
        (e = pi(a, r)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e)
      );
    }
    function cc(e, t, n, r, i) {
      if (e !== null) {
        var a = e.memoizedProps;
        if (Er(a, r) && e.ref === t.ref)
          if (((ic = !1), (t.pendingProps = r = a), jc(e, i)))
            e.flags & 131072 && (ic = !0);
          else return ((t.lanes = e.lanes), Ac(e, t, i));
      }
      return gc(e, t, n, r, i);
    }
    function lc(e, t, n, r) {
      var i = r.children,
        a = e === null ? null : e.memoizedState;
      if (
        (e === null &&
          t.stateNode === null &&
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        r.mode === `hidden`)
      ) {
        if (t.flags & 128) {
          if (((a = a === null ? n : a.baseLanes | n), e !== null)) {
            for (r = t.child = e.child, i = 0; r !== null; )
              ((i = i | r.lanes | r.childLanes), (r = r.sibling));
            r = i & ~a;
          } else ((r = 0), (t.child = null));
          return dc(e, t, a, n, r);
        }
        if (n & 536870912)
          ((t.memoizedState = { baseLanes: 0, cachePool: null }),
            e !== null && Sa(t, a === null ? null : a.cachePool),
            a === null ? ro() : no(t, a),
            lo(t));
        else
          return (
            (r = t.lanes = 536870912),
            dc(e, t, a === null ? n : a.baseLanes | n, n, r)
          );
      } else
        a === null
          ? (e !== null && Sa(t, null), ro(), uo(t))
          : (Sa(t, a.cachePool), no(t, a), uo(t), (t.memoizedState = null));
      return (ac(e, t, i, n), t.child);
    }
    function uc(e, t) {
      return (
        (e !== null && e.tag === 22) ||
          t.stateNode !== null ||
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        t.sibling
      );
    }
    function dc(e, t, n, r, i) {
      var a = xa();
      return (
        (a = a === null ? null : { parent: la._currentValue, pool: a }),
        (t.memoizedState = { baseLanes: n, cachePool: a }),
        e !== null && Sa(t, null),
        ro(),
        lo(t),
        e !== null && ea(e, t, r, !0),
        (t.childLanes = i),
        null
      );
    }
    function fc(e, t) {
      return (
        (t = Tc({ mode: t.mode, children: t.children }, e.mode)),
        (t.ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function pc(e, t, n) {
      return (
        Ba(t, e.child, null, n),
        (e = fc(t, t.pendingProps)),
        (e.flags |= 2),
        fo(t),
        (t.memoizedState = null),
        e
      );
    }
    function mc(e, t, n) {
      var r = t.pendingProps,
        a = (t.flags & 128) != 0;
      if (((t.flags &= -129), e === null)) {
        if (L) {
          if (r.mode === `hidden`)
            return ((e = fc(t, r)), (t.lanes = 536870912), uc(null, e));
          if (
            (co(t),
            (e = I)
              ? ((e = rf(e, Ri)),
                (e = e !== null && e.data === `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: Oi === null ? null : { id: ki, overflow: Ai },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = vi(e)),
                  (n.return = t),
                  (t.child = n),
                  (Ii = t),
                  (I = null)))
              : (e = null),
            e === null)
          )
            throw Bi(t);
          return ((t.lanes = 536870912), null);
        }
        return fc(t, r);
      }
      var o = e.memoizedState;
      if (o !== null) {
        var s = o.dehydrated;
        if ((co(t), a))
          if (t.flags & 256) ((t.flags &= -257), (t = pc(e, t, n)));
          else if (t.memoizedState !== null)
            ((t.child = e.child), (t.flags |= 128), (t = null));
          else throw Error(i(558));
        else if (
          (ic || ea(e, t, n, !1), (a = (n & e.childLanes) !== 0), ic || a)
        ) {
          if (
            ((r = K),
            r !== null && ((s = st(r, n)), s !== 0 && s !== o.retryLane))
          )
            throw ((o.retryLane = s), oi(e, s), hu(r, e, s), rc);
          (Du(), (t = pc(e, t, n)));
        } else
          ((e = o.treeContext),
            (I = cf(s.nextSibling)),
            (Ii = t),
            (L = !0),
            (Li = null),
            (Ri = !1),
            e !== null && Fi(t, e),
            (t = fc(t, r)),
            (t.flags |= 4096));
        return t;
      }
      return (
        (e = pi(e.child, { mode: r.mode, children: r.children })),
        (e.ref = t.ref),
        (t.child = e),
        (e.return = t),
        e
      );
    }
    function hc(e, t) {
      var n = t.ref;
      if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof n != `function` && typeof n != `object`) throw Error(i(284));
        (e === null || e.ref !== n) && (t.flags |= 4194816);
      }
    }
    function gc(e, t, n, r, i) {
      return (
        na(t),
        (n = wo(e, t, n, r, void 0, i)),
        (r = Oo()),
        e !== null && !ic
          ? (ko(e, t, i), Ac(e, t, i))
          : (L && r && Ni(t), (t.flags |= 1), ac(e, t, n, i), t.child)
      );
    }
    function _c(e, t, n, r, i, a) {
      return (
        na(t),
        (t.updateQueue = null),
        (n = Eo(t, r, n, i)),
        To(e),
        (r = Oo()),
        e !== null && !ic
          ? (ko(e, t, a), Ac(e, t, a))
          : (L && r && Ni(t), (t.flags |= 1), ac(e, t, n, a), t.child)
      );
    }
    function vc(e, t, n, r, i) {
      if ((na(t), t.stateNode === null)) {
        var a = li,
          o = n.contextType;
        (typeof o == `object` && o && (a = ra(o)),
          (a = new n(r, a)),
          (t.memoizedState =
            a.state !== null && a.state !== void 0 ? a.state : null),
          (a.updater = Ws),
          (t.stateNode = a),
          (a._reactInternals = t),
          (a = t.stateNode),
          (a.props = r),
          (a.state = t.memoizedState),
          (a.refs = {}),
          Ua(t),
          (o = n.contextType),
          (a.context = typeof o == `object` && o ? ra(o) : li),
          (a.state = t.memoizedState),
          (o = n.getDerivedStateFromProps),
          typeof o == `function` &&
            (Us(t, n, o, r), (a.state = t.memoizedState)),
          typeof n.getDerivedStateFromProps == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function` ||
            (typeof a.UNSAFE_componentWillMount != `function` &&
              typeof a.componentWillMount != `function`) ||
            ((o = a.state),
            typeof a.componentWillMount == `function` && a.componentWillMount(),
            typeof a.UNSAFE_componentWillMount == `function` &&
              a.UNSAFE_componentWillMount(),
            o !== a.state && Ws.enqueueReplaceState(a, a.state, null),
            Za(t, r, a, i),
            Xa(),
            (a.state = t.memoizedState)),
          typeof a.componentDidMount == `function` && (t.flags |= 4194308),
          (r = !0));
      } else if (e === null) {
        a = t.stateNode;
        var s = t.memoizedProps,
          c = qs(n, s);
        a.props = c;
        var l = a.context,
          u = n.contextType;
        ((o = li), typeof u == `object` && u && (o = ra(u)));
        var d = n.getDerivedStateFromProps;
        ((u =
          typeof d == `function` ||
          typeof a.getSnapshotBeforeUpdate == `function`),
          (s = t.pendingProps !== s),
          u ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((s || l !== o) && Ks(t, a, r, o)),
          (Ha = !1));
        var f = t.memoizedState;
        ((a.state = f),
          Za(t, r, a, i),
          Xa(),
          (l = t.memoizedState),
          s || f !== l || Ha
            ? (typeof d == `function` &&
                (Us(t, n, d, r), (l = t.memoizedState)),
              (c = Ha || Gs(t, n, c, r, f, l, o))
                ? (u ||
                    (typeof a.UNSAFE_componentWillMount != `function` &&
                      typeof a.componentWillMount != `function`) ||
                    (typeof a.componentWillMount == `function` &&
                      a.componentWillMount(),
                    typeof a.UNSAFE_componentWillMount == `function` &&
                      a.UNSAFE_componentWillMount()),
                  typeof a.componentDidMount == `function` &&
                    (t.flags |= 4194308))
                : (typeof a.componentDidMount == `function` &&
                    (t.flags |= 4194308),
                  (t.memoizedProps = r),
                  (t.memoizedState = l)),
              (a.props = r),
              (a.state = l),
              (a.context = o),
              (r = c))
            : (typeof a.componentDidMount == `function` && (t.flags |= 4194308),
              (r = !1)));
      } else {
        ((a = t.stateNode),
          Wa(e, t),
          (o = t.memoizedProps),
          (u = qs(n, o)),
          (a.props = u),
          (d = t.pendingProps),
          (f = a.context),
          (l = n.contextType),
          (c = li),
          typeof l == `object` && l && (c = ra(l)),
          (s = n.getDerivedStateFromProps),
          (l =
            typeof s == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function`) ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((o !== d || f !== c) && Ks(t, a, r, c)),
          (Ha = !1),
          (f = t.memoizedState),
          (a.state = f),
          Za(t, r, a, i),
          Xa());
        var p = t.memoizedState;
        o !== d ||
        f !== p ||
        Ha ||
        (e !== null && e.dependencies !== null && ta(e.dependencies))
          ? (typeof s == `function` && (Us(t, n, s, r), (p = t.memoizedState)),
            (u =
              Ha ||
              Gs(t, n, u, r, f, p, c) ||
              (e !== null && e.dependencies !== null && ta(e.dependencies)))
              ? (l ||
                  (typeof a.UNSAFE_componentWillUpdate != `function` &&
                    typeof a.componentWillUpdate != `function`) ||
                  (typeof a.componentWillUpdate == `function` &&
                    a.componentWillUpdate(r, p, c),
                  typeof a.UNSAFE_componentWillUpdate == `function` &&
                    a.UNSAFE_componentWillUpdate(r, p, c)),
                typeof a.componentDidUpdate == `function` && (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate == `function` &&
                  (t.flags |= 1024))
              : (typeof a.componentDidUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = r),
                (t.memoizedState = p)),
            (a.props = r),
            (a.state = p),
            (a.context = c),
            (r = u))
          : (typeof a.componentDidUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (r = !1));
      }
      return (
        (a = r),
        hc(e, t),
        (r = (t.flags & 128) != 0),
        a || r
          ? ((a = t.stateNode),
            (n =
              r && typeof n.getDerivedStateFromError != `function`
                ? null
                : a.render()),
            (t.flags |= 1),
            e !== null && r
              ? ((t.child = Ba(t, e.child, null, i)),
                (t.child = Ba(t, null, n, i)))
              : ac(e, t, n, i),
            (t.memoizedState = a.state),
            (e = t.child))
          : (e = Ac(e, t, i)),
        e
      );
    }
    function yc(e, t, n, r) {
      return (Wi(), (t.flags |= 256), ac(e, t, n, r), t.child);
    }
    var bc = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null,
    };
    function xc(e) {
      return { baseLanes: e, cachePool: Ca() };
    }
    function Sc(e, t, n) {
      return ((e = e === null ? 0 : e.childLanes & ~n), t && (e |= Jl), e);
    }
    function Cc(e, t, n) {
      var r = t.pendingProps,
        a = !1,
        o = (t.flags & 128) != 0,
        s;
      if (
        ((s = o) ||
          (s =
            e !== null && e.memoizedState === null ? !1 : (R.current & 2) != 0),
        s && ((a = !0), (t.flags &= -129)),
        (s = (t.flags & 32) != 0),
        (t.flags &= -33),
        e === null)
      ) {
        if (L) {
          if (
            (a ? so(t) : uo(t),
            (e = I)
              ? ((e = rf(e, Ri)),
                (e = e !== null && e.data !== `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: Oi === null ? null : { id: ki, overflow: Ai },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = vi(e)),
                  (n.return = t),
                  (t.child = n),
                  (Ii = t),
                  (I = null)))
              : (e = null),
            e === null)
          )
            throw Bi(t);
          return (of(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
        }
        var c = r.children;
        return (
          (r = r.fallback),
          a
            ? (uo(t),
              (a = t.mode),
              (c = Tc({ mode: `hidden`, children: c }, a)),
              (r = gi(r, a, n, null)),
              (c.return = t),
              (r.return = t),
              (c.sibling = r),
              (t.child = c),
              (r = t.child),
              (r.memoizedState = xc(n)),
              (r.childLanes = Sc(e, s, n)),
              (t.memoizedState = bc),
              uc(null, r))
            : (so(t), wc(t, c))
        );
      }
      var l = e.memoizedState;
      if (l !== null && ((c = l.dehydrated), c !== null)) {
        if (o)
          t.flags & 256
            ? (so(t), (t.flags &= -257), (t = Ec(e, t, n)))
            : t.memoizedState === null
              ? (uo(t),
                (c = r.fallback),
                (a = t.mode),
                (r = Tc({ mode: `visible`, children: r.children }, a)),
                (c = gi(c, a, n, null)),
                (c.flags |= 2),
                (r.return = t),
                (c.return = t),
                (r.sibling = c),
                (t.child = r),
                Ba(t, e.child, null, n),
                (r = t.child),
                (r.memoizedState = xc(n)),
                (r.childLanes = Sc(e, s, n)),
                (t.memoizedState = bc),
                (t = uc(null, r)))
              : (uo(t), (t.child = e.child), (t.flags |= 128), (t = null));
        else if ((so(t), of(c))) {
          if (((s = c.nextSibling && c.nextSibling.dataset), s)) var u = s.dgst;
          ((s = u),
            (r = Error(i(419))),
            (r.stack = ``),
            (r.digest = s),
            Ki({ value: r, source: null, stack: null }),
            (t = Ec(e, t, n)));
        } else if (
          (ic || ea(e, t, n, !1), (s = (n & e.childLanes) !== 0), ic || s)
        ) {
          if (
            ((s = K),
            s !== null && ((r = st(s, n)), r !== 0 && r !== l.retryLane))
          )
            throw ((l.retryLane = r), oi(e, r), hu(s, e, r), rc);
          (af(c) || Du(), (t = Ec(e, t, n)));
        } else
          af(c)
            ? ((t.flags |= 192), (t.child = e.child), (t = null))
            : ((e = l.treeContext),
              (I = cf(c.nextSibling)),
              (Ii = t),
              (L = !0),
              (Li = null),
              (Ri = !1),
              e !== null && Fi(t, e),
              (t = wc(t, r.children)),
              (t.flags |= 4096));
        return t;
      }
      return a
        ? (uo(t),
          (c = r.fallback),
          (a = t.mode),
          (l = e.child),
          (u = l.sibling),
          (r = pi(l, { mode: `hidden`, children: r.children })),
          (r.subtreeFlags = l.subtreeFlags & 65011712),
          u === null
            ? ((c = gi(c, a, n, null)), (c.flags |= 2))
            : (c = pi(u, c)),
          (c.return = t),
          (r.return = t),
          (r.sibling = c),
          (t.child = r),
          uc(null, r),
          (r = t.child),
          (c = e.child.memoizedState),
          c === null
            ? (c = xc(n))
            : ((a = c.cachePool),
              a === null
                ? (a = Ca())
                : ((l = la._currentValue),
                  (a = a.parent === l ? a : { parent: l, pool: l })),
              (c = { baseLanes: c.baseLanes | n, cachePool: a })),
          (r.memoizedState = c),
          (r.childLanes = Sc(e, s, n)),
          (t.memoizedState = bc),
          uc(e.child, r))
        : (so(t),
          (n = e.child),
          (e = n.sibling),
          (n = pi(n, { mode: `visible`, children: r.children })),
          (n.return = t),
          (n.sibling = null),
          e !== null &&
            ((s = t.deletions),
            s === null ? ((t.deletions = [e]), (t.flags |= 16)) : s.push(e)),
          (t.child = n),
          (t.memoizedState = null),
          n);
    }
    function wc(e, t) {
      return (
        (t = Tc({ mode: `visible`, children: t }, e.mode)),
        (t.return = e),
        (e.child = t)
      );
    }
    function Tc(e, t) {
      return ((e = di(22, e, null, t)), (e.lanes = 0), e);
    }
    function Ec(e, t, n) {
      return (
        Ba(t, e.child, null, n),
        (e = wc(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function Dc(e, t, n) {
      e.lanes |= t;
      var r = e.alternate;
      (r !== null && (r.lanes |= t), Qi(e.return, t, n));
    }
    function Oc(e, t, n, r, i, a) {
      var o = e.memoizedState;
      o === null
        ? (e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: n,
            tailMode: i,
            treeForkCount: a,
          })
        : ((o.isBackwards = t),
          (o.rendering = null),
          (o.renderingStartTime = 0),
          (o.last = r),
          (o.tail = n),
          (o.tailMode = i),
          (o.treeForkCount = a));
    }
    function kc(e, t, n) {
      var r = t.pendingProps,
        i = r.revealOrder,
        a = r.tail;
      r = r.children;
      var o = R.current,
        s = (o & 2) != 0;
      if (
        (s ? ((o = (o & 1) | 2), (t.flags |= 128)) : (o &= 1),
        k(R, o),
        ac(e, t, r, n),
        (r = L ? Ti : 0),
        !s && e !== null && e.flags & 128)
      )
        a: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && Dc(e, n, t);
          else if (e.tag === 19) Dc(e, n, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break a;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break a;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      switch (i) {
        case `forwards`:
          for (n = t.child, i = null; n !== null; )
            ((e = n.alternate),
              e !== null && po(e) === null && (i = n),
              (n = n.sibling));
          ((n = i),
            n === null
              ? ((i = t.child), (t.child = null))
              : ((i = n.sibling), (n.sibling = null)),
            Oc(t, !1, i, n, a, r));
          break;
        case `backwards`:
        case `unstable_legacy-backwards`:
          for (n = null, i = t.child, t.child = null; i !== null; ) {
            if (((e = i.alternate), e !== null && po(e) === null)) {
              t.child = i;
              break;
            }
            ((e = i.sibling), (i.sibling = n), (n = i), (i = e));
          }
          Oc(t, !0, n, null, a, r);
          break;
        case `together`:
          Oc(t, !1, null, null, void 0, r);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function Ac(e, t, n) {
      if (
        (e !== null && (t.dependencies = e.dependencies),
        (Gl |= t.lanes),
        (n & t.childLanes) === 0)
      )
        if (e !== null) {
          if ((ea(e, t, n, !1), (n & t.childLanes) === 0)) return null;
        } else return null;
      if (e !== null && t.child !== e.child) throw Error(i(153));
      if (t.child !== null) {
        for (
          e = t.child, n = pi(e, e.pendingProps), t.child = n, n.return = t;
          e.sibling !== null;
        )
          ((e = e.sibling),
            (n = n.sibling = pi(e, e.pendingProps)),
            (n.return = t));
        n.sibling = null;
      }
      return t.child;
    }
    function jc(e, t) {
      return (e.lanes & t) === 0
        ? ((e = e.dependencies), !!(e !== null && ta(e)))
        : !0;
    }
    function Mc(e, t, n) {
      switch (t.tag) {
        case 3:
          (ve(t, t.stateNode.containerInfo),
            Xi(t, la, e.memoizedState.cache),
            Wi());
          break;
        case 27:
        case 5:
          be(t);
          break;
        case 4:
          ve(t, t.stateNode.containerInfo);
          break;
        case 10:
          Xi(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return ((t.flags |= 128), co(t), null);
          break;
        case 13:
          var r = t.memoizedState;
          if (r !== null)
            return r.dehydrated === null
              ? (n & t.child.childLanes) === 0
                ? (so(t), (e = Ac(e, t, n)), e === null ? null : e.sibling)
                : Cc(e, t, n)
              : (so(t), (t.flags |= 128), null);
          so(t);
          break;
        case 19:
          var i = (e.flags & 128) != 0;
          if (
            ((r = (n & t.childLanes) !== 0),
            (r ||= (ea(e, t, n, !1), (n & t.childLanes) !== 0)),
            i)
          ) {
            if (r) return kc(e, t, n);
            t.flags |= 128;
          }
          if (
            ((i = t.memoizedState),
            i !== null &&
              ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
            k(R, R.current),
            r)
          )
            break;
          return null;
        case 22:
          return ((t.lanes = 0), lc(e, t, n, t.pendingProps));
        case 24:
          Xi(t, la, e.memoizedState.cache);
      }
      return Ac(e, t, n);
    }
    function Nc(e, t, n) {
      if (e !== null)
        if (e.memoizedProps !== t.pendingProps) ic = !0;
        else {
          if (!jc(e, n) && !(t.flags & 128)) return ((ic = !1), Mc(e, t, n));
          ic = !!(e.flags & 131072);
        }
      else ((ic = !1), L && t.flags & 1048576 && Mi(t, Ti, t.index));
      switch (((t.lanes = 0), t.tag)) {
        case 16:
          a: {
            var r = t.pendingProps;
            if (((e = Aa(t.elementType)), (t.type = e), typeof e == `function`))
              fi(e)
                ? ((r = qs(e, r)), (t.tag = 1), (t = vc(null, t, e, r, n)))
                : ((t.tag = 0), (t = gc(null, t, e, r, n)));
            else {
              if (e != null) {
                var a = e.$$typeof;
                if (a === w) {
                  ((t.tag = 11), (t = oc(null, t, e, r, n)));
                  break a;
                } else if (a === te) {
                  ((t.tag = 14), (t = sc(null, t, e, r, n)));
                  break a;
                }
              }
              throw ((t = ce(e) || e), Error(i(306, t, ``)));
            }
          }
          return t;
        case 0:
          return gc(e, t, t.type, t.pendingProps, n);
        case 1:
          return ((r = t.type), (a = qs(r, t.pendingProps)), vc(e, t, r, a, n));
        case 3:
          a: {
            if ((ve(t, t.stateNode.containerInfo), e === null))
              throw Error(i(387));
            r = t.pendingProps;
            var o = t.memoizedState;
            ((a = o.element), Wa(e, t), Za(t, r, null, n));
            var s = t.memoizedState;
            if (
              ((r = s.cache),
              Xi(t, la, r),
              r !== o.cache && $i(t, [la], n, !0),
              Xa(),
              (r = s.element),
              o.isDehydrated)
            )
              if (
                ((o = { element: r, isDehydrated: !1, cache: s.cache }),
                (t.updateQueue.baseState = o),
                (t.memoizedState = o),
                t.flags & 256)
              ) {
                t = yc(e, t, r, n);
                break a;
              } else if (r !== a) {
                ((a = xi(Error(i(424)), t)), Ki(a), (t = yc(e, t, r, n)));
                break a;
              } else {
                switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                  case 9:
                    e = e.body;
                    break;
                  default:
                    e = e.nodeName === `HTML` ? e.ownerDocument.body : e;
                }
                for (
                  I = cf(e.firstChild),
                    Ii = t,
                    L = !0,
                    Li = null,
                    Ri = !0,
                    n = Va(t, null, r, n),
                    t.child = n;
                  n;
                )
                  ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
              }
            else {
              if ((Wi(), r === a)) {
                t = Ac(e, t, n);
                break a;
              }
              ac(e, t, r, n);
            }
            t = t.child;
          }
          return t;
        case 26:
          return (
            hc(e, t),
            e === null
              ? (n = kf(t.type, null, t.pendingProps, null))
                ? (t.memoizedState = n)
                : L ||
                  ((n = t.type),
                  (e = t.pendingProps),
                  (r = Bd(ge.current).createElement(n)),
                  (r[ft] = t),
                  (r[pt] = e),
                  Pd(r, n, e),
                  Tt(r),
                  (t.stateNode = r))
              : (t.memoizedState = kf(
                  t.type,
                  e.memoizedProps,
                  t.pendingProps,
                  e.memoizedState,
                )),
            null
          );
        case 27:
          return (
            be(t),
            e === null &&
              L &&
              ((r = t.stateNode = ff(t.type, t.pendingProps, ge.current)),
              (Ii = t),
              (Ri = !0),
              (a = I),
              Zd(t.type) ? ((lf = a), (I = cf(r.firstChild))) : (I = a)),
            ac(e, t, t.pendingProps.children, n),
            hc(e, t),
            e === null && (t.flags |= 4194304),
            t.child
          );
        case 5:
          return (
            e === null &&
              L &&
              ((a = r = I) &&
                ((r = tf(r, t.type, t.pendingProps, Ri)),
                r === null
                  ? (a = !1)
                  : ((t.stateNode = r),
                    (Ii = t),
                    (I = cf(r.firstChild)),
                    (Ri = !1),
                    (a = !0))),
              a || Bi(t)),
            be(t),
            (a = t.type),
            (o = t.pendingProps),
            (s = e === null ? null : e.memoizedProps),
            (r = o.children),
            Ud(a, o) ? (r = null) : s !== null && Ud(a, s) && (t.flags |= 32),
            t.memoizedState !== null &&
              ((a = wo(e, t, Do, null, null, n)), (Qf._currentValue = a)),
            hc(e, t),
            ac(e, t, r, n),
            t.child
          );
        case 6:
          return (
            e === null &&
              L &&
              ((e = n = I) &&
                ((n = nf(n, t.pendingProps, Ri)),
                n === null
                  ? (e = !1)
                  : ((t.stateNode = n), (Ii = t), (I = null), (e = !0))),
              e || Bi(t)),
            null
          );
        case 13:
          return Cc(e, t, n);
        case 4:
          return (
            ve(t, t.stateNode.containerInfo),
            (r = t.pendingProps),
            e === null ? (t.child = Ba(t, null, r, n)) : ac(e, t, r, n),
            t.child
          );
        case 11:
          return oc(e, t, t.type, t.pendingProps, n);
        case 7:
          return (ac(e, t, t.pendingProps, n), t.child);
        case 8:
          return (ac(e, t, t.pendingProps.children, n), t.child);
        case 12:
          return (ac(e, t, t.pendingProps.children, n), t.child);
        case 10:
          return (
            (r = t.pendingProps),
            Xi(t, t.type, r.value),
            ac(e, t, r.children, n),
            t.child
          );
        case 9:
          return (
            (a = t.type._context),
            (r = t.pendingProps.children),
            na(t),
            (a = ra(a)),
            (r = r(a)),
            (t.flags |= 1),
            ac(e, t, r, n),
            t.child
          );
        case 14:
          return sc(e, t, t.type, t.pendingProps, n);
        case 15:
          return cc(e, t, t.type, t.pendingProps, n);
        case 19:
          return kc(e, t, n);
        case 31:
          return mc(e, t, n);
        case 22:
          return lc(e, t, n, t.pendingProps);
        case 24:
          return (
            na(t),
            (r = ra(la)),
            e === null
              ? ((a = xa()),
                a === null &&
                  ((a = K),
                  (o = ua()),
                  (a.pooledCache = o),
                  o.refCount++,
                  o !== null && (a.pooledCacheLanes |= n),
                  (a = o)),
                (t.memoizedState = { parent: r, cache: a }),
                Ua(t),
                Xi(t, la, a))
              : ((e.lanes & n) !== 0 && (Wa(e, t), Za(t, null, null, n), Xa()),
                (a = e.memoizedState),
                (o = t.memoizedState),
                a.parent === r
                  ? ((r = o.cache),
                    Xi(t, la, r),
                    r !== a.cache && $i(t, [la], n, !0))
                  : ((a = { parent: r, cache: r }),
                    (t.memoizedState = a),
                    t.lanes === 0 &&
                      (t.memoizedState = t.updateQueue.baseState = a),
                    Xi(t, la, r))),
            ac(e, t, t.pendingProps.children, n),
            t.child
          );
        case 29:
          throw t.pendingProps;
      }
      throw Error(i(156, t.tag));
    }
    function Pc(e) {
      e.flags |= 4;
    }
    function Fc(e, t, n, r, i) {
      if (((t = (e.mode & 32) != 0) && (t = !1), t)) {
        if (((e.flags |= 16777216), (i & 335544128) === i))
          if (e.stateNode.complete) e.flags |= 8192;
          else if (wu()) e.flags |= 8192;
          else throw ((ja = Da), Ta);
      } else e.flags &= -16777217;
    }
    function Ic(e, t) {
      if (t.type !== `stylesheet` || t.state.loading & 4) e.flags &= -16777217;
      else if (((e.flags |= 16777216), !Wf(t)))
        if (wu()) e.flags |= 8192;
        else throw ((ja = Da), Ta);
    }
    function Lc(e, t) {
      (t !== null && (e.flags |= 4),
        e.flags & 16384 &&
          ((t = e.tag === 22 ? 536870912 : tt()), (e.lanes |= t), (Yl |= t)));
    }
    function Rc(e, t) {
      if (!L)
        switch (e.tailMode) {
          case `hidden`:
            t = e.tail;
            for (var n = null; t !== null; )
              (t.alternate !== null && (n = t), (t = t.sibling));
            n === null ? (e.tail = null) : (n.sibling = null);
            break;
          case `collapsed`:
            n = e.tail;
            for (var r = null; n !== null; )
              (n.alternate !== null && (r = n), (n = n.sibling));
            r === null
              ? t || e.tail === null
                ? (e.tail = null)
                : (e.tail.sibling = null)
              : (r.sibling = null);
        }
    }
    function U(e) {
      var t = e.alternate !== null && e.alternate.child === e.child,
        n = 0,
        r = 0;
      if (t)
        for (var i = e.child; i !== null; )
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags & 65011712),
            (r |= i.flags & 65011712),
            (i.return = e),
            (i = i.sibling));
      else
        for (i = e.child; i !== null; )
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags),
            (r |= i.flags),
            (i.return = e),
            (i = i.sibling));
      return ((e.subtreeFlags |= r), (e.childLanes = n), t);
    }
    function zc(e, t, n) {
      var r = t.pendingProps;
      switch ((Pi(t), t.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (U(t), null);
        case 1:
          return (U(t), null);
        case 3:
          return (
            (n = t.stateNode),
            (r = null),
            e !== null && (r = e.memoizedState.cache),
            t.memoizedState.cache !== r && (t.flags |= 2048),
            Zi(la),
            ye(),
            n.pendingContext &&
              ((n.context = n.pendingContext), (n.pendingContext = null)),
            (e === null || e.child === null) &&
              (Ui(t)
                ? Pc(t)
                : e === null ||
                  (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
                  ((t.flags |= 1024), Gi())),
            U(t),
            null
          );
        case 26:
          var a = t.type,
            o = t.memoizedState;
          return (
            e === null
              ? (Pc(t),
                o === null ? (U(t), Fc(t, a, null, r, n)) : (U(t), Ic(t, o)))
              : o
                ? o === e.memoizedState
                  ? (U(t), (t.flags &= -16777217))
                  : (Pc(t), U(t), Ic(t, o))
                : ((e = e.memoizedProps),
                  e !== r && Pc(t),
                  U(t),
                  Fc(t, a, e, r, n)),
            null
          );
        case 27:
          if (
            (xe(t),
            (n = ge.current),
            (a = t.type),
            e !== null && t.stateNode != null)
          )
            e.memoizedProps !== r && Pc(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(i(166));
              return (U(t), null);
            }
            ((e = me.current),
              Ui(t) ? Vi(t, e) : ((e = ff(a, r, n)), (t.stateNode = e), Pc(t)));
          }
          return (U(t), null);
        case 5:
          if ((xe(t), (a = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== r && Pc(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(i(166));
              return (U(t), null);
            }
            if (((o = me.current), Ui(t))) Vi(t, o);
            else {
              var s = Bd(ge.current);
              switch (o) {
                case 1:
                  o = s.createElementNS(`http://www.w3.org/2000/svg`, a);
                  break;
                case 2:
                  o = s.createElementNS(
                    `http://www.w3.org/1998/Math/MathML`,
                    a,
                  );
                  break;
                default:
                  switch (a) {
                    case `svg`:
                      o = s.createElementNS(`http://www.w3.org/2000/svg`, a);
                      break;
                    case `math`:
                      o = s.createElementNS(
                        `http://www.w3.org/1998/Math/MathML`,
                        a,
                      );
                      break;
                    case `script`:
                      ((o = s.createElement(`div`)),
                        (o.innerHTML = `<script><\/script>`),
                        (o = o.removeChild(o.firstChild)));
                      break;
                    case `select`:
                      ((o =
                        typeof r.is == `string`
                          ? s.createElement(`select`, { is: r.is })
                          : s.createElement(`select`)),
                        r.multiple
                          ? (o.multiple = !0)
                          : r.size && (o.size = r.size));
                      break;
                    default:
                      o =
                        typeof r.is == `string`
                          ? s.createElement(a, { is: r.is })
                          : s.createElement(a);
                  }
              }
              ((o[ft] = t), (o[pt] = r));
              a: for (s = t.child; s !== null; ) {
                if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
                else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                  ((s.child.return = s), (s = s.child));
                  continue;
                }
                if (s === t) break a;
                for (; s.sibling === null; ) {
                  if (s.return === null || s.return === t) break a;
                  s = s.return;
                }
                ((s.sibling.return = s.return), (s = s.sibling));
              }
              t.stateNode = o;
              a: switch ((Pd(o, a, r), a)) {
                case `button`:
                case `input`:
                case `select`:
                case `textarea`:
                  r = !!r.autoFocus;
                  break a;
                case `img`:
                  r = !0;
                  break a;
                default:
                  r = !1;
              }
              r && Pc(t);
            }
          }
          return (
            U(t),
            Fc(
              t,
              t.type,
              e === null ? null : e.memoizedProps,
              t.pendingProps,
              n,
            ),
            null
          );
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== r && Pc(t);
          else {
            if (typeof r != `string` && t.stateNode === null)
              throw Error(i(166));
            if (((e = ge.current), Ui(t))) {
              if (
                ((e = t.stateNode),
                (n = t.memoizedProps),
                (r = null),
                (a = Ii),
                a !== null)
              )
                switch (a.tag) {
                  case 27:
                  case 5:
                    r = a.memoizedProps;
                }
              ((e[ft] = t),
                (e = !!(
                  e.nodeValue === n ||
                  (r !== null && !0 === r.suppressHydrationWarning) ||
                  Md(e.nodeValue, n)
                )),
                e || Bi(t, !0));
            } else
              ((e = Bd(e).createTextNode(r)), (e[ft] = t), (t.stateNode = e));
          }
          return (U(t), null);
        case 31:
          if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
            if (((r = Ui(t)), n !== null)) {
              if (e === null) {
                if (!r) throw Error(i(318));
                if (
                  ((e = t.memoizedState),
                  (e = e === null ? null : e.dehydrated),
                  !e)
                )
                  throw Error(i(557));
                e[ft] = t;
              } else
                (Wi(),
                  !(t.flags & 128) && (t.memoizedState = null),
                  (t.flags |= 4));
              (U(t), (e = !1));
            } else
              ((n = Gi()),
                e !== null &&
                  e.memoizedState !== null &&
                  (e.memoizedState.hydrationErrors = n),
                (e = !0));
            if (!e) return t.flags & 256 ? (fo(t), t) : (fo(t), null);
            if (t.flags & 128) throw Error(i(558));
          }
          return (U(t), null);
        case 13:
          if (
            ((r = t.memoizedState),
            e === null ||
              (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
          ) {
            if (((a = Ui(t)), r !== null && r.dehydrated !== null)) {
              if (e === null) {
                if (!a) throw Error(i(318));
                if (
                  ((a = t.memoizedState),
                  (a = a === null ? null : a.dehydrated),
                  !a)
                )
                  throw Error(i(317));
                a[ft] = t;
              } else
                (Wi(),
                  !(t.flags & 128) && (t.memoizedState = null),
                  (t.flags |= 4));
              (U(t), (a = !1));
            } else
              ((a = Gi()),
                e !== null &&
                  e.memoizedState !== null &&
                  (e.memoizedState.hydrationErrors = a),
                (a = !0));
            if (!a) return t.flags & 256 ? (fo(t), t) : (fo(t), null);
          }
          return (
            fo(t),
            t.flags & 128
              ? ((t.lanes = n), t)
              : ((n = r !== null),
                (e = e !== null && e.memoizedState !== null),
                n &&
                  ((r = t.child),
                  (a = null),
                  r.alternate !== null &&
                    r.alternate.memoizedState !== null &&
                    r.alternate.memoizedState.cachePool !== null &&
                    (a = r.alternate.memoizedState.cachePool.pool),
                  (o = null),
                  r.memoizedState !== null &&
                    r.memoizedState.cachePool !== null &&
                    (o = r.memoizedState.cachePool.pool),
                  o !== a && (r.flags |= 2048)),
                n !== e && n && (t.child.flags |= 8192),
                Lc(t, t.updateQueue),
                U(t),
                null)
          );
        case 4:
          return (
            ye(),
            e === null && Sd(t.stateNode.containerInfo),
            U(t),
            null
          );
        case 10:
          return (Zi(t.type), U(t), null);
        case 19:
          if ((O(R), (r = t.memoizedState), r === null)) return (U(t), null);
          if (((a = (t.flags & 128) != 0), (o = r.rendering), o === null))
            if (a) Rc(r, !1);
            else {
              if (X !== 0 || (e !== null && e.flags & 128))
                for (e = t.child; e !== null; ) {
                  if (((o = po(e)), o !== null)) {
                    for (
                      t.flags |= 128,
                        Rc(r, !1),
                        e = o.updateQueue,
                        t.updateQueue = e,
                        Lc(t, e),
                        t.subtreeFlags = 0,
                        e = n,
                        n = t.child;
                      n !== null;
                    )
                      (mi(n, e), (n = n.sibling));
                    return (
                      k(R, (R.current & 1) | 2),
                      L && ji(t, r.treeForkCount),
                      t.child
                    );
                  }
                  e = e.sibling;
                }
              r.tail !== null &&
                Pe() > tu &&
                ((t.flags |= 128), (a = !0), Rc(r, !1), (t.lanes = 4194304));
            }
          else {
            if (!a)
              if (((e = po(o)), e !== null)) {
                if (
                  ((t.flags |= 128),
                  (a = !0),
                  (e = e.updateQueue),
                  (t.updateQueue = e),
                  Lc(t, e),
                  Rc(r, !0),
                  r.tail === null &&
                    r.tailMode === `hidden` &&
                    !o.alternate &&
                    !L)
                )
                  return (U(t), null);
              } else
                2 * Pe() - r.renderingStartTime > tu &&
                  n !== 536870912 &&
                  ((t.flags |= 128), (a = !0), Rc(r, !1), (t.lanes = 4194304));
            r.isBackwards
              ? ((o.sibling = t.child), (t.child = o))
              : ((e = r.last),
                e === null ? (t.child = o) : (e.sibling = o),
                (r.last = o));
          }
          return r.tail === null
            ? (U(t), null)
            : ((e = r.tail),
              (r.rendering = e),
              (r.tail = e.sibling),
              (r.renderingStartTime = Pe()),
              (e.sibling = null),
              (n = R.current),
              k(R, a ? (n & 1) | 2 : n & 1),
              L && ji(t, r.treeForkCount),
              e);
        case 22:
        case 23:
          return (
            fo(t),
            io(),
            (r = t.memoizedState !== null),
            e === null
              ? r && (t.flags |= 8192)
              : (e.memoizedState !== null) !== r && (t.flags |= 8192),
            r
              ? n & 536870912 &&
                !(t.flags & 128) &&
                (U(t), t.subtreeFlags & 6 && (t.flags |= 8192))
              : U(t),
            (n = t.updateQueue),
            n !== null && Lc(t, n.retryQueue),
            (n = null),
            e !== null &&
              e.memoizedState !== null &&
              e.memoizedState.cachePool !== null &&
              (n = e.memoizedState.cachePool.pool),
            (r = null),
            t.memoizedState !== null &&
              t.memoizedState.cachePool !== null &&
              (r = t.memoizedState.cachePool.pool),
            r !== n && (t.flags |= 2048),
            e !== null && O(ba),
            null
          );
        case 24:
          return (
            (n = null),
            e !== null && (n = e.memoizedState.cache),
            t.memoizedState.cache !== n && (t.flags |= 2048),
            Zi(la),
            U(t),
            null
          );
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(i(156, t.tag));
    }
    function Bc(e, t) {
      switch ((Pi(t), t.tag)) {
        case 1:
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 3:
          return (
            Zi(la),
            ye(),
            (e = t.flags),
            e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 26:
        case 27:
        case 5:
          return (xe(t), null);
        case 31:
          if (t.memoizedState !== null) {
            if ((fo(t), t.alternate === null)) throw Error(i(340));
            Wi();
          }
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 13:
          if (
            (fo(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)
          ) {
            if (t.alternate === null) throw Error(i(340));
            Wi();
          }
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 19:
          return (O(R), null);
        case 4:
          return (ye(), null);
        case 10:
          return (Zi(t.type), null);
        case 22:
        case 23:
          return (
            fo(t),
            io(),
            e !== null && O(ba),
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 24:
          return (Zi(la), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Vc(e, t) {
      switch ((Pi(t), t.tag)) {
        case 3:
          (Zi(la), ye());
          break;
        case 26:
        case 27:
        case 5:
          xe(t);
          break;
        case 4:
          ye();
          break;
        case 31:
          t.memoizedState !== null && fo(t);
          break;
        case 13:
          fo(t);
          break;
        case 19:
          O(R);
          break;
        case 10:
          Zi(t.type);
          break;
        case 22:
        case 23:
          (fo(t), io(), e !== null && O(ba));
          break;
        case 24:
          Zi(la);
      }
    }
    function Hc(e, t) {
      try {
        var n = t.updateQueue,
          r = n === null ? null : n.lastEffect;
        if (r !== null) {
          var i = r.next;
          n = i;
          do {
            if ((n.tag & e) === e) {
              r = void 0;
              var a = n.create,
                o = n.inst;
              ((r = a()), (o.destroy = r));
            }
            n = n.next;
          } while (n !== i);
        }
      } catch (e) {
        Z(t, t.return, e);
      }
    }
    function Uc(e, t, n) {
      try {
        var r = t.updateQueue,
          i = r === null ? null : r.lastEffect;
        if (i !== null) {
          var a = i.next;
          r = a;
          do {
            if ((r.tag & e) === e) {
              var o = r.inst,
                s = o.destroy;
              if (s !== void 0) {
                ((o.destroy = void 0), (i = t));
                var c = n,
                  l = s;
                try {
                  l();
                } catch (e) {
                  Z(i, c, e);
                }
              }
            }
            r = r.next;
          } while (r !== a);
        }
      } catch (e) {
        Z(t, t.return, e);
      }
    }
    function Wc(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var n = e.stateNode;
        try {
          $a(t, n);
        } catch (t) {
          Z(e, e.return, t);
        }
      }
    }
    function Gc(e, t, n) {
      ((n.props = qs(e.type, e.memoizedProps)), (n.state = e.memoizedState));
      try {
        n.componentWillUnmount();
      } catch (n) {
        Z(e, t, n);
      }
    }
    function Kc(e, t) {
      try {
        var n = e.ref;
        if (n !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var r = e.stateNode;
              break;
            case 30:
              r = e.stateNode;
              break;
            default:
              r = e.stateNode;
          }
          typeof n == `function` ? (e.refCleanup = n(r)) : (n.current = r);
        }
      } catch (n) {
        Z(e, t, n);
      }
    }
    function qc(e, t) {
      var n = e.ref,
        r = e.refCleanup;
      if (n !== null)
        if (typeof r == `function`)
          try {
            r();
          } catch (n) {
            Z(e, t, n);
          } finally {
            ((e.refCleanup = null),
              (e = e.alternate),
              e != null && (e.refCleanup = null));
          }
        else if (typeof n == `function`)
          try {
            n(null);
          } catch (n) {
            Z(e, t, n);
          }
        else n.current = null;
    }
    function Jc(e) {
      var t = e.type,
        n = e.memoizedProps,
        r = e.stateNode;
      try {
        a: switch (t) {
          case `button`:
          case `input`:
          case `select`:
          case `textarea`:
            n.autoFocus && r.focus();
            break a;
          case `img`:
            n.src ? (r.src = n.src) : n.srcSet && (r.srcset = n.srcSet);
        }
      } catch (t) {
        Z(e, e.return, t);
      }
    }
    function Yc(e, t, n) {
      try {
        var r = e.stateNode;
        (Fd(r, e.type, n, t), (r[pt] = t));
      } catch (t) {
        Z(e, e.return, t);
      }
    }
    function Xc(e) {
      return (
        e.tag === 5 ||
        e.tag === 3 ||
        e.tag === 26 ||
        (e.tag === 27 && Zd(e.type)) ||
        e.tag === 4
      );
    }
    function Zc(e) {
      a: for (;;) {
        for (; e.sibling === null; ) {
          if (e.return === null || Xc(e.return)) return null;
          e = e.return;
        }
        for (
          e.sibling.return = e.return, e = e.sibling;
          e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
        ) {
          if (
            (e.tag === 27 && Zd(e.type)) ||
            e.flags & 2 ||
            e.child === null ||
            e.tag === 4
          )
            continue a;
          ((e.child.return = e), (e = e.child));
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Qc(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6)
        ((e = e.stateNode),
          t
            ? (n.nodeType === 9
                ? n.body
                : n.nodeName === `HTML`
                  ? n.ownerDocument.body
                  : n
              ).insertBefore(e, t)
            : ((t =
                n.nodeType === 9
                  ? n.body
                  : n.nodeName === `HTML`
                    ? n.ownerDocument.body
                    : n),
              t.appendChild(e),
              (n = n._reactRootContainer),
              n != null || t.onclick !== null || (t.onclick = rn)));
      else if (
        r !== 4 &&
        (r === 27 && Zd(e.type) && ((n = e.stateNode), (t = null)),
        (e = e.child),
        e !== null)
      )
        for (Qc(e, t, n), e = e.sibling; e !== null; )
          (Qc(e, t, n), (e = e.sibling));
    }
    function $c(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6)
        ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
      else if (
        r !== 4 &&
        (r === 27 && Zd(e.type) && (n = e.stateNode), (e = e.child), e !== null)
      )
        for ($c(e, t, n), e = e.sibling; e !== null; )
          ($c(e, t, n), (e = e.sibling));
    }
    function el(e) {
      var t = e.stateNode,
        n = e.memoizedProps;
      try {
        for (var r = e.type, i = t.attributes; i.length; )
          t.removeAttributeNode(i[0]);
        (Pd(t, r, n), (t[ft] = e), (t[pt] = n));
      } catch (t) {
        Z(e, e.return, t);
      }
    }
    var tl = !1,
      nl = !1,
      rl = !1,
      il = typeof WeakSet == `function` ? WeakSet : Set,
      al = null;
    function ol(e, t) {
      if (((e = e.containerInfo), (Rd = sp), (e = Ar(e)), jr(e))) {
        if (`selectionStart` in e)
          var n = { start: e.selectionStart, end: e.selectionEnd };
        else
          a: {
            n = ((n = e.ownerDocument) && n.defaultView) || window;
            var r = n.getSelection && n.getSelection();
            if (r && r.rangeCount !== 0) {
              n = r.anchorNode;
              var a = r.anchorOffset,
                o = r.focusNode;
              r = r.focusOffset;
              try {
                (n.nodeType, o.nodeType);
              } catch {
                n = null;
                break a;
              }
              var s = 0,
                c = -1,
                l = -1,
                u = 0,
                d = 0,
                f = e,
                p = null;
              b: for (;;) {
                for (
                  var m;
                  f !== n || (a !== 0 && f.nodeType !== 3) || (c = s + a),
                    f !== o || (r !== 0 && f.nodeType !== 3) || (l = s + r),
                    f.nodeType === 3 && (s += f.nodeValue.length),
                    (m = f.firstChild) !== null;
                )
                  ((p = f), (f = m));
                for (;;) {
                  if (f === e) break b;
                  if (
                    (p === n && ++u === a && (c = s),
                    p === o && ++d === r && (l = s),
                    (m = f.nextSibling) !== null)
                  )
                    break;
                  ((f = p), (p = f.parentNode));
                }
                f = m;
              }
              n = c === -1 || l === -1 ? null : { start: c, end: l };
            } else n = null;
          }
        n ||= { start: 0, end: 0 };
      } else n = null;
      for (
        zd = { focusedElem: e, selectionRange: n }, sp = !1, al = t;
        al !== null;
      )
        if (((t = al), (e = t.child), t.subtreeFlags & 1028 && e !== null))
          ((e.return = t), (al = e));
        else
          for (; al !== null; ) {
            switch (((t = al), (o = t.alternate), (e = t.flags), t.tag)) {
              case 0:
                if (
                  e & 4 &&
                  ((e = t.updateQueue),
                  (e = e === null ? null : e.events),
                  e !== null)
                )
                  for (n = 0; n < e.length; n++)
                    ((a = e[n]), (a.ref.impl = a.nextImpl));
                break;
              case 11:
              case 15:
                break;
              case 1:
                if (e & 1024 && o !== null) {
                  ((e = void 0),
                    (n = t),
                    (a = o.memoizedProps),
                    (o = o.memoizedState),
                    (r = n.stateNode));
                  try {
                    var h = qs(n.type, a);
                    ((e = r.getSnapshotBeforeUpdate(h, o)),
                      (r.__reactInternalSnapshotBeforeUpdate = e));
                  } catch (e) {
                    Z(n, n.return, e);
                  }
                }
                break;
              case 3:
                if (e & 1024) {
                  if (
                    ((e = t.stateNode.containerInfo), (n = e.nodeType), n === 9)
                  )
                    ef(e);
                  else if (n === 1)
                    switch (e.nodeName) {
                      case `HEAD`:
                      case `HTML`:
                      case `BODY`:
                        ef(e);
                        break;
                      default:
                        e.textContent = ``;
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if (e & 1024) throw Error(i(163));
            }
            if (((e = t.sibling), e !== null)) {
              ((e.return = t.return), (al = e));
              break;
            }
            al = t.return;
          }
    }
    function sl(e, t, n) {
      var r = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (xl(e, n), r & 4 && Hc(5, n));
          break;
        case 1:
          if ((xl(e, n), r & 4))
            if (((e = n.stateNode), t === null))
              try {
                e.componentDidMount();
              } catch (e) {
                Z(n, n.return, e);
              }
            else {
              var i = qs(n.type, t.memoizedProps);
              t = t.memoizedState;
              try {
                e.componentDidUpdate(
                  i,
                  t,
                  e.__reactInternalSnapshotBeforeUpdate,
                );
              } catch (e) {
                Z(n, n.return, e);
              }
            }
          (r & 64 && Wc(n), r & 512 && Kc(n, n.return));
          break;
        case 3:
          if ((xl(e, n), r & 64 && ((e = n.updateQueue), e !== null))) {
            if (((t = null), n.child !== null))
              switch (n.child.tag) {
                case 27:
                case 5:
                  t = n.child.stateNode;
                  break;
                case 1:
                  t = n.child.stateNode;
              }
            try {
              $a(e, t);
            } catch (e) {
              Z(n, n.return, e);
            }
          }
          break;
        case 27:
          t === null && r & 4 && el(n);
        case 26:
        case 5:
          (xl(e, n), t === null && r & 4 && Jc(n), r & 512 && Kc(n, n.return));
          break;
        case 12:
          xl(e, n);
          break;
        case 31:
          (xl(e, n), r & 4 && fl(e, n));
          break;
        case 13:
          (xl(e, n),
            r & 4 && pl(e, n),
            r & 64 &&
              ((e = n.memoizedState),
              e !== null &&
                ((e = e.dehydrated),
                e !== null && ((n = Ju.bind(null, n)), sf(e, n)))));
          break;
        case 22:
          if (((r = n.memoizedState !== null || tl), !r)) {
            ((t = (t !== null && t.memoizedState !== null) || nl), (i = tl));
            var a = nl;
            ((tl = r),
              (nl = t) && !a
                ? Cl(e, n, (n.subtreeFlags & 8772) != 0)
                : xl(e, n),
              (tl = i),
              (nl = a));
          }
          break;
        case 30:
          break;
        default:
          xl(e, n);
      }
    }
    function cl(e) {
      var t = e.alternate;
      (t !== null && ((e.alternate = null), cl(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 && ((t = e.stateNode), t !== null && bt(t)),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null));
    }
    var W = null,
      ll = !1;
    function ul(e, t, n) {
      for (n = n.child; n !== null; ) (dl(e, t, n), (n = n.sibling));
    }
    function dl(e, t, n) {
      if (Ue && typeof Ue.onCommitFiberUnmount == `function`)
        try {
          Ue.onCommitFiberUnmount(He, n);
        } catch {}
      switch (n.tag) {
        case 26:
          (nl || qc(n, t),
            ul(e, t, n),
            n.memoizedState
              ? n.memoizedState.count--
              : n.stateNode &&
                ((n = n.stateNode), n.parentNode.removeChild(n)));
          break;
        case 27:
          nl || qc(n, t);
          var r = W,
            i = ll;
          (Zd(n.type) && ((W = n.stateNode), (ll = !1)),
            ul(e, t, n),
            pf(n.stateNode),
            (W = r),
            (ll = i));
          break;
        case 5:
          nl || qc(n, t);
        case 6:
          if (
            ((r = W),
            (i = ll),
            (W = null),
            ul(e, t, n),
            (W = r),
            (ll = i),
            W !== null)
          )
            if (ll)
              try {
                (W.nodeType === 9
                  ? W.body
                  : W.nodeName === `HTML`
                    ? W.ownerDocument.body
                    : W
                ).removeChild(n.stateNode);
              } catch (e) {
                Z(n, t, e);
              }
            else
              try {
                W.removeChild(n.stateNode);
              } catch (e) {
                Z(n, t, e);
              }
          break;
        case 18:
          W !== null &&
            (ll
              ? ((e = W),
                Qd(
                  e.nodeType === 9
                    ? e.body
                    : e.nodeName === `HTML`
                      ? e.ownerDocument.body
                      : e,
                  n.stateNode,
                ),
                Np(e))
              : Qd(W, n.stateNode));
          break;
        case 4:
          ((r = W),
            (i = ll),
            (W = n.stateNode.containerInfo),
            (ll = !0),
            ul(e, t, n),
            (W = r),
            (ll = i));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (Uc(2, n, t), nl || Uc(4, n, t), ul(e, t, n));
          break;
        case 1:
          (nl ||
            (qc(n, t),
            (r = n.stateNode),
            typeof r.componentWillUnmount == `function` && Gc(n, t, r)),
            ul(e, t, n));
          break;
        case 21:
          ul(e, t, n);
          break;
        case 22:
          ((nl = (r = nl) || n.memoizedState !== null), ul(e, t, n), (nl = r));
          break;
        default:
          ul(e, t, n);
      }
    }
    function fl(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
      ) {
        e = e.dehydrated;
        try {
          Np(e);
        } catch (e) {
          Z(t, t.return, e);
        }
      }
    }
    function pl(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate),
        e !== null &&
          ((e = e.memoizedState),
          e !== null && ((e = e.dehydrated), e !== null)))
      )
        try {
          Np(e);
        } catch (e) {
          Z(t, t.return, e);
        }
    }
    function ml(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return (t === null && (t = e.stateNode = new il()), t);
        case 22:
          return (
            (e = e.stateNode),
            (t = e._retryCache),
            t === null && (t = e._retryCache = new il()),
            t
          );
        default:
          throw Error(i(435, e.tag));
      }
    }
    function hl(e, t) {
      var n = ml(e);
      t.forEach(function (t) {
        if (!n.has(t)) {
          n.add(t);
          var r = Yu.bind(null, e, t);
          t.then(r, r);
        }
      });
    }
    function gl(e, t) {
      var n = t.deletions;
      if (n !== null)
        for (var r = 0; r < n.length; r++) {
          var a = n[r],
            o = e,
            s = t,
            c = s;
          a: for (; c !== null; ) {
            switch (c.tag) {
              case 27:
                if (Zd(c.type)) {
                  ((W = c.stateNode), (ll = !1));
                  break a;
                }
                break;
              case 5:
                ((W = c.stateNode), (ll = !1));
                break a;
              case 3:
              case 4:
                ((W = c.stateNode.containerInfo), (ll = !0));
                break a;
            }
            c = c.return;
          }
          if (W === null) throw Error(i(160));
          (dl(o, s, a),
            (W = null),
            (ll = !1),
            (o = a.alternate),
            o !== null && (o.return = null),
            (a.return = null));
        }
      if (t.subtreeFlags & 13886)
        for (t = t.child; t !== null; ) (vl(t, e), (t = t.sibling));
    }
    var _l = null;
    function vl(e, t) {
      var n = e.alternate,
        r = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (gl(t, e),
            yl(e),
            r & 4 && (Uc(3, e, e.return), Hc(3, e), Uc(5, e, e.return)));
          break;
        case 1:
          (gl(t, e),
            yl(e),
            r & 512 && (nl || n === null || qc(n, n.return)),
            r & 64 &&
              tl &&
              ((e = e.updateQueue),
              e !== null &&
                ((r = e.callbacks),
                r !== null &&
                  ((n = e.shared.hiddenCallbacks),
                  (e.shared.hiddenCallbacks = n === null ? r : n.concat(r))))));
          break;
        case 26:
          var a = _l;
          if (
            (gl(t, e),
            yl(e),
            r & 512 && (nl || n === null || qc(n, n.return)),
            r & 4)
          ) {
            var o = n === null ? null : n.memoizedState;
            if (((r = e.memoizedState), n === null))
              if (r === null)
                if (e.stateNode === null) {
                  a: {
                    ((r = e.type),
                      (n = e.memoizedProps),
                      (a = a.ownerDocument || a));
                    b: switch (r) {
                      case `title`:
                        ((o = a.getElementsByTagName(`title`)[0]),
                          (!o ||
                            o[yt] ||
                            o[ft] ||
                            o.namespaceURI === `http://www.w3.org/2000/svg` ||
                            o.hasAttribute(`itemprop`)) &&
                            ((o = a.createElement(r)),
                            a.head.insertBefore(
                              o,
                              a.querySelector(`head > title`),
                            )),
                          Pd(o, r, n),
                          (o[ft] = e),
                          Tt(o),
                          (r = o));
                        break a;
                      case `link`:
                        var s = Vf(`link`, `href`, a).get(r + (n.href || ``));
                        if (s) {
                          for (var c = 0; c < s.length; c++)
                            if (
                              ((o = s[c]),
                              o.getAttribute(`href`) ===
                                (n.href == null || n.href === ``
                                  ? null
                                  : n.href) &&
                                o.getAttribute(`rel`) ===
                                  (n.rel == null ? null : n.rel) &&
                                o.getAttribute(`title`) ===
                                  (n.title == null ? null : n.title) &&
                                o.getAttribute(`crossorigin`) ===
                                  (n.crossOrigin == null
                                    ? null
                                    : n.crossOrigin))
                            ) {
                              s.splice(c, 1);
                              break b;
                            }
                        }
                        ((o = a.createElement(r)),
                          Pd(o, r, n),
                          a.head.appendChild(o));
                        break;
                      case `meta`:
                        if (
                          (s = Vf(`meta`, `content`, a).get(
                            r + (n.content || ``),
                          ))
                        ) {
                          for (c = 0; c < s.length; c++)
                            if (
                              ((o = s[c]),
                              o.getAttribute(`content`) ===
                                (n.content == null ? null : `` + n.content) &&
                                o.getAttribute(`name`) ===
                                  (n.name == null ? null : n.name) &&
                                o.getAttribute(`property`) ===
                                  (n.property == null ? null : n.property) &&
                                o.getAttribute(`http-equiv`) ===
                                  (n.httpEquiv == null ? null : n.httpEquiv) &&
                                o.getAttribute(`charset`) ===
                                  (n.charSet == null ? null : n.charSet))
                            ) {
                              s.splice(c, 1);
                              break b;
                            }
                        }
                        ((o = a.createElement(r)),
                          Pd(o, r, n),
                          a.head.appendChild(o));
                        break;
                      default:
                        throw Error(i(468, r));
                    }
                    ((o[ft] = e), Tt(o), (r = o));
                  }
                  e.stateNode = r;
                } else Hf(a, e.type, e.stateNode);
              else e.stateNode = If(a, r, e.memoizedProps);
            else
              o === r
                ? r === null &&
                  e.stateNode !== null &&
                  Yc(e, e.memoizedProps, n.memoizedProps)
                : (o === null
                    ? n.stateNode !== null &&
                      ((n = n.stateNode), n.parentNode.removeChild(n))
                    : o.count--,
                  r === null
                    ? Hf(a, e.type, e.stateNode)
                    : If(a, r, e.memoizedProps));
          }
          break;
        case 27:
          (gl(t, e),
            yl(e),
            r & 512 && (nl || n === null || qc(n, n.return)),
            n !== null && r & 4 && Yc(e, e.memoizedProps, n.memoizedProps));
          break;
        case 5:
          if (
            (gl(t, e),
            yl(e),
            r & 512 && (nl || n === null || qc(n, n.return)),
            e.flags & 32)
          ) {
            a = e.stateNode;
            try {
              Yt(a, ``);
            } catch (t) {
              Z(e, e.return, t);
            }
          }
          (r & 4 &&
            e.stateNode != null &&
            ((a = e.memoizedProps), Yc(e, a, n === null ? a : n.memoizedProps)),
            r & 1024 && (rl = !0));
          break;
        case 6:
          if ((gl(t, e), yl(e), r & 4)) {
            if (e.stateNode === null) throw Error(i(162));
            ((r = e.memoizedProps), (n = e.stateNode));
            try {
              n.nodeValue = r;
            } catch (t) {
              Z(e, e.return, t);
            }
          }
          break;
        case 3:
          if (
            ((Bf = null),
            (a = _l),
            (_l = gf(t.containerInfo)),
            gl(t, e),
            (_l = a),
            yl(e),
            r & 4 && n !== null && n.memoizedState.isDehydrated)
          )
            try {
              Np(t.containerInfo);
            } catch (t) {
              Z(e, e.return, t);
            }
          rl && ((rl = !1), bl(e));
          break;
        case 4:
          ((r = _l),
            (_l = gf(e.stateNode.containerInfo)),
            gl(t, e),
            yl(e),
            (_l = r));
          break;
        case 12:
          (gl(t, e), yl(e));
          break;
        case 31:
          (gl(t, e),
            yl(e),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), hl(e, r))));
          break;
        case 13:
          (gl(t, e),
            yl(e),
            e.child.flags & 8192 &&
              (e.memoizedState !== null) !=
                (n !== null && n.memoizedState !== null) &&
              ($l = Pe()),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), hl(e, r))));
          break;
        case 22:
          a = e.memoizedState !== null;
          var l = n !== null && n.memoizedState !== null,
            u = tl,
            d = nl;
          if (
            ((tl = u || a),
            (nl = d || l),
            gl(t, e),
            (nl = d),
            (tl = u),
            yl(e),
            r & 8192)
          )
            a: for (
              t = e.stateNode,
                t._visibility = a ? t._visibility & -2 : t._visibility | 1,
                a && (n === null || l || tl || nl || Sl(e)),
                n = null,
                t = e;
              ;
            ) {
              if (t.tag === 5 || t.tag === 26) {
                if (n === null) {
                  l = n = t;
                  try {
                    if (((o = l.stateNode), a))
                      ((s = o.style),
                        typeof s.setProperty == `function`
                          ? s.setProperty(`display`, `none`, `important`)
                          : (s.display = `none`));
                    else {
                      c = l.stateNode;
                      var f = l.memoizedProps.style,
                        p =
                          f != null && f.hasOwnProperty(`display`)
                            ? f.display
                            : null;
                      c.style.display =
                        p == null || typeof p == `boolean`
                          ? ``
                          : (`` + p).trim();
                    }
                  } catch (e) {
                    Z(l, l.return, e);
                  }
                }
              } else if (t.tag === 6) {
                if (n === null) {
                  l = t;
                  try {
                    l.stateNode.nodeValue = a ? `` : l.memoizedProps;
                  } catch (e) {
                    Z(l, l.return, e);
                  }
                }
              } else if (t.tag === 18) {
                if (n === null) {
                  l = t;
                  try {
                    var m = l.stateNode;
                    a ? $d(m, !0) : $d(l.stateNode, !1);
                  } catch (e) {
                    Z(l, l.return, e);
                  }
                }
              } else if (
                ((t.tag !== 22 && t.tag !== 23) ||
                  t.memoizedState === null ||
                  t === e) &&
                t.child !== null
              ) {
                ((t.child.return = t), (t = t.child));
                continue;
              }
              if (t === e) break a;
              for (; t.sibling === null; ) {
                if (t.return === null || t.return === e) break a;
                (n === t && (n = null), (t = t.return));
              }
              (n === t && (n = null),
                (t.sibling.return = t.return),
                (t = t.sibling));
            }
          r & 4 &&
            ((r = e.updateQueue),
            r !== null &&
              ((n = r.retryQueue),
              n !== null && ((r.retryQueue = null), hl(e, n))));
          break;
        case 19:
          (gl(t, e),
            yl(e),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), hl(e, r))));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          (gl(t, e), yl(e));
      }
    }
    function yl(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var n, r = e.return; r !== null; ) {
            if (Xc(r)) {
              n = r;
              break;
            }
            r = r.return;
          }
          if (n == null) throw Error(i(160));
          switch (n.tag) {
            case 27:
              var a = n.stateNode;
              $c(e, Zc(e), a);
              break;
            case 5:
              var o = n.stateNode;
              (n.flags & 32 && (Yt(o, ``), (n.flags &= -33)), $c(e, Zc(e), o));
              break;
            case 3:
            case 4:
              var s = n.stateNode.containerInfo;
              Qc(e, Zc(e), s);
              break;
            default:
              throw Error(i(161));
          }
        } catch (t) {
          Z(e, e.return, t);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function bl(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; e !== null; ) {
          var t = e;
          (bl(t),
            t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
            (e = e.sibling));
        }
    }
    function xl(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null; )
          (sl(e, t.alternate, t), (t = t.sibling));
    }
    function Sl(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (Uc(4, t, t.return), Sl(t));
            break;
          case 1:
            qc(t, t.return);
            var n = t.stateNode;
            (typeof n.componentWillUnmount == `function` && Gc(t, t.return, n),
              Sl(t));
            break;
          case 27:
            pf(t.stateNode);
          case 26:
          case 5:
            (qc(t, t.return), Sl(t));
            break;
          case 22:
            t.memoizedState === null && Sl(t);
            break;
          case 30:
            Sl(t);
            break;
          default:
            Sl(t);
        }
        e = e.sibling;
      }
    }
    function Cl(e, t, n) {
      for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null; ) {
        var r = t.alternate,
          i = e,
          a = t,
          o = a.flags;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            (Cl(i, a, n), Hc(4, a));
            break;
          case 1:
            if (
              (Cl(i, a, n),
              (r = a),
              (i = r.stateNode),
              typeof i.componentDidMount == `function`)
            )
              try {
                i.componentDidMount();
              } catch (e) {
                Z(r, r.return, e);
              }
            if (((r = a), (i = r.updateQueue), i !== null)) {
              var s = r.stateNode;
              try {
                var c = i.shared.hiddenCallbacks;
                if (c !== null)
                  for (
                    i.shared.hiddenCallbacks = null, i = 0;
                    i < c.length;
                    i++
                  )
                    Qa(c[i], s);
              } catch (e) {
                Z(r, r.return, e);
              }
            }
            (n && o & 64 && Wc(a), Kc(a, a.return));
            break;
          case 27:
            el(a);
          case 26:
          case 5:
            (Cl(i, a, n), n && r === null && o & 4 && Jc(a), Kc(a, a.return));
            break;
          case 12:
            Cl(i, a, n);
            break;
          case 31:
            (Cl(i, a, n), n && o & 4 && fl(i, a));
            break;
          case 13:
            (Cl(i, a, n), n && o & 4 && pl(i, a));
            break;
          case 22:
            (a.memoizedState === null && Cl(i, a, n), Kc(a, a.return));
            break;
          case 30:
            break;
          default:
            Cl(i, a, n);
        }
        t = t.sibling;
      }
    }
    function wl(e, t) {
      var n = null;
      (e !== null &&
        e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (n = e.memoizedState.cachePool.pool),
        (e = null),
        t.memoizedState !== null &&
          t.memoizedState.cachePool !== null &&
          (e = t.memoizedState.cachePool.pool),
        e !== n && (e != null && e.refCount++, n != null && da(n)));
    }
    function Tl(e, t) {
      ((e = null),
        t.alternate !== null && (e = t.alternate.memoizedState.cache),
        (t = t.memoizedState.cache),
        t !== e && (t.refCount++, e != null && da(e)));
    }
    function El(e, t, n, r) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; ) (Dl(e, t, n, r), (t = t.sibling));
    }
    function Dl(e, t, n, r) {
      var i = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (El(e, t, n, r), i & 2048 && Hc(9, t));
          break;
        case 1:
          El(e, t, n, r);
          break;
        case 3:
          (El(e, t, n, r),
            i & 2048 &&
              ((e = null),
              t.alternate !== null && (e = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache),
              t !== e && (t.refCount++, e != null && da(e))));
          break;
        case 12:
          if (i & 2048) {
            (El(e, t, n, r), (e = t.stateNode));
            try {
              var a = t.memoizedProps,
                o = a.id,
                s = a.onPostCommit;
              typeof s == `function` &&
                s(
                  o,
                  t.alternate === null ? `mount` : `update`,
                  e.passiveEffectDuration,
                  -0,
                );
            } catch (e) {
              Z(t, t.return, e);
            }
          } else El(e, t, n, r);
          break;
        case 31:
          El(e, t, n, r);
          break;
        case 13:
          El(e, t, n, r);
          break;
        case 23:
          break;
        case 22:
          ((a = t.stateNode),
            (o = t.alternate),
            t.memoizedState === null
              ? a._visibility & 2
                ? El(e, t, n, r)
                : ((a._visibility |= 2),
                  Ol(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1))
              : a._visibility & 2
                ? El(e, t, n, r)
                : kl(e, t),
            i & 2048 && wl(o, t));
          break;
        case 24:
          (El(e, t, n, r), i & 2048 && Tl(t.alternate, t));
          break;
        default:
          El(e, t, n, r);
      }
    }
    function Ol(e, t, n, r, i) {
      for (
        i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child;
        t !== null;
      ) {
        var a = e,
          o = t,
          s = n,
          c = r,
          l = o.flags;
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            (Ol(a, o, s, c, i), Hc(8, o));
            break;
          case 23:
            break;
          case 22:
            var u = o.stateNode;
            (o.memoizedState === null
              ? ((u._visibility |= 2), Ol(a, o, s, c, i))
              : u._visibility & 2
                ? Ol(a, o, s, c, i)
                : kl(a, o),
              i && l & 2048 && wl(o.alternate, o));
            break;
          case 24:
            (Ol(a, o, s, c, i), i && l & 2048 && Tl(o.alternate, o));
            break;
          default:
            Ol(a, o, s, c, i);
        }
        t = t.sibling;
      }
    }
    function kl(e, t) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; ) {
          var n = e,
            r = t,
            i = r.flags;
          switch (r.tag) {
            case 22:
              (kl(n, r), i & 2048 && wl(r.alternate, r));
              break;
            case 24:
              (kl(n, r), i & 2048 && Tl(r.alternate, r));
              break;
            default:
              kl(n, r);
          }
          t = t.sibling;
        }
    }
    var Al = 8192;
    function jl(e, t, n) {
      if (e.subtreeFlags & Al)
        for (e = e.child; e !== null; ) (Ml(e, t, n), (e = e.sibling));
    }
    function Ml(e, t, n) {
      switch (e.tag) {
        case 26:
          (jl(e, t, n),
            e.flags & Al &&
              e.memoizedState !== null &&
              Gf(n, _l, e.memoizedState, e.memoizedProps));
          break;
        case 5:
          jl(e, t, n);
          break;
        case 3:
        case 4:
          var r = _l;
          ((_l = gf(e.stateNode.containerInfo)), jl(e, t, n), (_l = r));
          break;
        case 22:
          e.memoizedState === null &&
            ((r = e.alternate),
            r !== null && r.memoizedState !== null
              ? ((r = Al), (Al = 16777216), jl(e, t, n), (Al = r))
              : jl(e, t, n));
          break;
        default:
          jl(e, t, n);
      }
    }
    function Nl(e) {
      var t = e.alternate;
      if (t !== null && ((e = t.child), e !== null)) {
        t.child = null;
        do ((t = e.sibling), (e.sibling = null), (e = t));
        while (e !== null);
      }
    }
    function Pl(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((al = r), Ll(r, e));
          }
        Nl(e);
      }
      if (e.subtreeFlags & 10256)
        for (e = e.child; e !== null; ) (Fl(e), (e = e.sibling));
    }
    function Fl(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (Pl(e), e.flags & 2048 && Uc(9, e, e.return));
          break;
        case 3:
          Pl(e);
          break;
        case 12:
          Pl(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null &&
          t._visibility & 2 &&
          (e.return === null || e.return.tag !== 13)
            ? ((t._visibility &= -3), Il(e))
            : Pl(e);
          break;
        default:
          Pl(e);
      }
    }
    function Il(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((al = r), Ll(r, e));
          }
        Nl(e);
      }
      for (e = e.child; e !== null; ) {
        switch (((t = e), t.tag)) {
          case 0:
          case 11:
          case 15:
            (Uc(8, t, t.return), Il(t));
            break;
          case 22:
            ((n = t.stateNode),
              n._visibility & 2 && ((n._visibility &= -3), Il(t)));
            break;
          default:
            Il(t);
        }
        e = e.sibling;
      }
    }
    function Ll(e, t) {
      for (; al !== null; ) {
        var n = al;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            Uc(8, n, t);
            break;
          case 23:
          case 22:
            if (
              n.memoizedState !== null &&
              n.memoizedState.cachePool !== null
            ) {
              var r = n.memoizedState.cachePool.pool;
              r != null && r.refCount++;
            }
            break;
          case 24:
            da(n.memoizedState.cache);
        }
        if (((r = n.child), r !== null)) ((r.return = n), (al = r));
        else
          a: for (n = e; al !== null; ) {
            r = al;
            var i = r.sibling,
              a = r.return;
            if ((cl(r), r === n)) {
              al = null;
              break a;
            }
            if (i !== null) {
              ((i.return = a), (al = i));
              break a;
            }
            al = a;
          }
      }
    }
    var Rl = {
        getCacheForType: function (e) {
          var t = ra(la),
            n = t.data.get(e);
          return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
        },
        cacheSignal: function () {
          return ra(la).controller.signal;
        },
      },
      zl = typeof WeakMap == `function` ? WeakMap : Map,
      G = 0,
      K = null,
      q = null,
      J = 0,
      Y = 0,
      Bl = null,
      Vl = !1,
      Hl = !1,
      Ul = !1,
      Wl = 0,
      X = 0,
      Gl = 0,
      Kl = 0,
      ql = 0,
      Jl = 0,
      Yl = 0,
      Xl = null,
      Zl = null,
      Ql = !1,
      $l = 0,
      eu = 0,
      tu = 1 / 0,
      nu = null,
      ru = null,
      iu = 0,
      au = null,
      ou = null,
      su = 0,
      cu = 0,
      lu = null,
      uu = null,
      du = 0,
      fu = null;
    function pu() {
      return G & 2 && J !== 0 ? J & -J : E.T === null ? lt() : dd();
    }
    function mu() {
      if (Jl === 0)
        if (!(J & 536870912) || L) {
          var e = Ye;
          ((Ye <<= 1), !(Ye & 3932160) && (Ye = 262144), (Jl = e));
        } else Jl = 536870912;
      return ((e = ao.current), e !== null && (e.flags |= 32), Jl);
    }
    function hu(e, t, n) {
      (((e === K && (Y === 2 || Y === 9)) || e.cancelPendingCommit !== null) &&
        (Su(e, 0), yu(e, J, Jl, !1)),
        rt(e, n),
        (!(G & 2) || e !== K) &&
          (e === K && (!(G & 2) && (Kl |= n), X === 4 && yu(e, J, Jl, !1)),
          rd(e)));
    }
    function gu(e, t, n) {
      if (G & 6) throw Error(i(327));
      var r = (!n && (t & 127) == 0 && (t & e.expiredLanes) === 0) || $e(e, t),
        a = r ? Au(e, t) : Ou(e, t, !0),
        o = r;
      do {
        if (a === 0) {
          Hl && !r && yu(e, t, 0, !1);
          break;
        } else {
          if (((n = e.current.alternate), o && !vu(n))) {
            ((a = Ou(e, t, !1)), (o = !1));
            continue;
          }
          if (a === 2) {
            if (((o = t), e.errorRecoveryDisabledLanes & o)) var s = 0;
            else
              ((s = e.pendingLanes & -536870913),
                (s = s === 0 ? (s & 536870912 ? 536870912 : 0) : s));
            if (s !== 0) {
              t = s;
              a: {
                var c = e;
                a = Xl;
                var l = c.current.memoizedState.isDehydrated;
                if (
                  (l && (Su(c, s).flags |= 256), (s = Ou(c, s, !1)), s !== 2)
                ) {
                  if (Ul && !l) {
                    ((c.errorRecoveryDisabledLanes |= o), (Kl |= o), (a = 4));
                    break a;
                  }
                  ((o = Zl),
                    (Zl = a),
                    o !== null &&
                      (Zl === null ? (Zl = o) : Zl.push.apply(Zl, o)));
                }
                a = s;
              }
              if (((o = !1), a !== 2)) continue;
            }
          }
          if (a === 1) {
            (Su(e, 0), yu(e, t, 0, !0));
            break;
          }
          a: {
            switch (((r = e), (o = a), o)) {
              case 0:
              case 1:
                throw Error(i(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                yu(r, t, Jl, !Vl);
                break a;
              case 2:
                Zl = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(i(329));
            }
            if ((t & 62914560) === t && ((a = $l + 300 - Pe()), 10 < a)) {
              if ((yu(r, t, Jl, !Vl), Qe(r, 0, !0) !== 0)) break a;
              ((su = t),
                (r.timeoutHandle = Kd(
                  _u.bind(
                    null,
                    r,
                    n,
                    Zl,
                    nu,
                    Ql,
                    t,
                    Jl,
                    Kl,
                    Yl,
                    Vl,
                    o,
                    `Throttled`,
                    -0,
                    0,
                  ),
                  a,
                )));
              break a;
            }
            _u(r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Vl, o, null, -0, 0);
          }
        }
        break;
      } while (1);
      rd(e);
    }
    function _u(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
      if (
        ((e.timeoutHandle = -1),
        (d = t.subtreeFlags),
        d & 8192 || (d & 16785408) == 16785408)
      ) {
        ((d = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: rn,
        }),
          Ml(t, a, d));
        var m =
          (a & 62914560) === a
            ? $l - Pe()
            : (a & 4194048) === a
              ? eu - Pe()
              : 0;
        if (((m = qf(d, m)), m !== null)) {
          ((su = a),
            (e.cancelPendingCommit = m(
              Lu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p),
            )),
            yu(e, a, o, !l));
          return;
        }
      }
      Lu(e, t, a, n, r, i, o, s, c);
    }
    function vu(e) {
      for (var t = e; ; ) {
        var n = t.tag;
        if (
          (n === 0 || n === 11 || n === 15) &&
          t.flags & 16384 &&
          ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
        )
          for (var r = 0; r < n.length; r++) {
            var i = n[r],
              a = i.getSnapshot;
            i = i.value;
            try {
              if (!Tr(a(), i)) return !1;
            } catch {
              return !1;
            }
          }
        if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
          ((n.return = t), (t = n));
        else {
          if (t === e) break;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return !0;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      }
      return !0;
    }
    function yu(e, t, n, r) {
      ((t &= ~ql),
        (t &= ~Kl),
        (e.suspendedLanes |= t),
        (e.pingedLanes &= ~t),
        r && (e.warmLanes |= t),
        (r = e.expirationTimes));
      for (var i = t; 0 < i; ) {
        var a = 31 - j(i),
          o = 1 << a;
        ((r[a] = -1), (i &= ~o));
      }
      n !== 0 && at(e, n, t);
    }
    function bu() {
      return G & 6 ? !0 : (id(0, !1), !1);
    }
    function xu() {
      if (q !== null) {
        if (Y === 0) var e = q.return;
        else ((e = q), (Yi = Ji = null), Ao(e), (Pa = null), (Fa = 0), (e = q));
        for (; e !== null; ) (Vc(e.alternate, e), (e = e.return));
        q = null;
      }
    }
    function Su(e, t) {
      var n = e.timeoutHandle;
      (n !== -1 && ((e.timeoutHandle = -1), qd(n)),
        (n = e.cancelPendingCommit),
        n !== null && ((e.cancelPendingCommit = null), n()),
        (su = 0),
        xu(),
        (K = e),
        (q = n = pi(e.current, null)),
        (J = t),
        (Y = 0),
        (Bl = null),
        (Vl = !1),
        (Hl = $e(e, t)),
        (Ul = !1),
        (Yl = Jl = ql = Kl = Gl = X = 0),
        (Zl = Xl = null),
        (Ql = !1),
        t & 8 && (t |= t & 32));
      var r = e.entangledLanes;
      if (r !== 0)
        for (e = e.entanglements, r &= t; 0 < r; ) {
          var i = 31 - j(r),
            a = 1 << i;
          ((t |= e[i]), (r &= ~a));
        }
      return ((Wl = t), ri(), n);
    }
    function Cu(e, t) {
      ((z = null),
        (E.H = zs),
        t === wa || t === Ea
          ? ((t = Ma()), (Y = 3))
          : t === Ta
            ? ((t = Ma()), (Y = 4))
            : (Y =
                t === rc
                  ? 8
                  : typeof t == `object` && t && typeof t.then == `function`
                    ? 6
                    : 1),
        (Bl = t),
        q === null && ((X = 1), Zs(e, xi(t, e.current))));
    }
    function wu() {
      var e = ao.current;
      return e === null
        ? !0
        : (J & 4194048) === J
          ? oo === null
          : (J & 62914560) === J || J & 536870912
            ? e === oo
            : !1;
    }
    function Tu() {
      var e = E.H;
      return ((E.H = zs), e === null ? zs : e);
    }
    function Eu() {
      var e = E.A;
      return ((E.A = Rl), e);
    }
    function Du() {
      ((X = 4),
        Vl || ((J & 4194048) !== J && ao.current !== null) || (Hl = !0),
        (!(Gl & 134217727) && !(Kl & 134217727)) ||
          K === null ||
          yu(K, J, Jl, !1));
    }
    function Ou(e, t, n) {
      var r = G;
      G |= 2;
      var i = Tu(),
        a = Eu();
      ((K !== e || J !== t) && ((nu = null), Su(e, t)), (t = !1));
      var o = X;
      a: do
        try {
          if (Y !== 0 && q !== null) {
            var s = q,
              c = Bl;
            switch (Y) {
              case 8:
                (xu(), (o = 6));
                break a;
              case 3:
              case 2:
              case 9:
              case 6:
                ao.current === null && (t = !0);
                var l = Y;
                if (((Y = 0), (Bl = null), Pu(e, s, c, l), n && Hl)) {
                  o = 0;
                  break a;
                }
                break;
              default:
                ((l = Y), (Y = 0), (Bl = null), Pu(e, s, c, l));
            }
          }
          (ku(), (o = X));
          break;
        } catch (t) {
          Cu(e, t);
        }
      while (1);
      return (
        t && e.shellSuspendCounter++,
        (Yi = Ji = null),
        (G = r),
        (E.H = i),
        (E.A = a),
        q === null && ((K = null), (J = 0), ri()),
        o
      );
    }
    function ku() {
      for (; q !== null; ) Mu(q);
    }
    function Au(e, t) {
      var n = G;
      G |= 2;
      var r = Tu(),
        a = Eu();
      K !== e || J !== t
        ? ((nu = null), (tu = Pe() + 500), Su(e, t))
        : (Hl = $e(e, t));
      a: do
        try {
          if (Y !== 0 && q !== null) {
            t = q;
            var o = Bl;
            b: switch (Y) {
              case 1:
                ((Y = 0), (Bl = null), Pu(e, t, o, 1));
                break;
              case 2:
              case 9:
                if (Oa(o)) {
                  ((Y = 0), (Bl = null), Nu(t));
                  break;
                }
                ((t = function () {
                  ((Y !== 2 && Y !== 9) || K !== e || (Y = 7), rd(e));
                }),
                  o.then(t, t));
                break a;
              case 3:
                Y = 7;
                break a;
              case 4:
                Y = 5;
                break a;
              case 7:
                Oa(o)
                  ? ((Y = 0), (Bl = null), Nu(t))
                  : ((Y = 0), (Bl = null), Pu(e, t, o, 7));
                break;
              case 5:
                var s = null;
                switch (q.tag) {
                  case 26:
                    s = q.memoizedState;
                  case 5:
                  case 27:
                    var c = q;
                    if (s ? Wf(s) : c.stateNode.complete) {
                      ((Y = 0), (Bl = null));
                      var l = c.sibling;
                      if (l !== null) q = l;
                      else {
                        var u = c.return;
                        u === null ? (q = null) : ((q = u), Fu(u));
                      }
                      break b;
                    }
                }
                ((Y = 0), (Bl = null), Pu(e, t, o, 5));
                break;
              case 6:
                ((Y = 0), (Bl = null), Pu(e, t, o, 6));
                break;
              case 8:
                (xu(), (X = 6));
                break a;
              default:
                throw Error(i(462));
            }
          }
          ju();
          break;
        } catch (t) {
          Cu(e, t);
        }
      while (1);
      return (
        (Yi = Ji = null),
        (E.H = r),
        (E.A = a),
        (G = n),
        q === null ? ((K = null), (J = 0), ri(), X) : 0
      );
    }
    function ju() {
      for (; q !== null && !Me(); ) Mu(q);
    }
    function Mu(e) {
      var t = Nc(e.alternate, e, Wl);
      ((e.memoizedProps = e.pendingProps), t === null ? Fu(e) : (q = t));
    }
    function Nu(e) {
      var t = e,
        n = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = _c(n, t, t.pendingProps, t.type, void 0, J);
          break;
        case 11:
          t = _c(n, t, t.pendingProps, t.type.render, t.ref, J);
          break;
        case 5:
          Ao(t);
        default:
          (Vc(n, t), (t = q = mi(t, Wl)), (t = Nc(n, t, Wl)));
      }
      ((e.memoizedProps = e.pendingProps), t === null ? Fu(e) : (q = t));
    }
    function Pu(e, t, n, r) {
      ((Yi = Ji = null), Ao(t), (Pa = null), (Fa = 0));
      var i = t.return;
      try {
        if (nc(e, i, t, n, J)) {
          ((X = 1), Zs(e, xi(n, e.current)), (q = null));
          return;
        }
      } catch (t) {
        if (i !== null) throw ((q = i), t);
        ((X = 1), Zs(e, xi(n, e.current)), (q = null));
        return;
      }
      t.flags & 32768
        ? (L || r === 1
            ? (e = !0)
            : Hl || J & 536870912
              ? (e = !1)
              : ((Vl = e = !0),
                (r === 2 || r === 9 || r === 3 || r === 6) &&
                  ((r = ao.current),
                  r !== null && r.tag === 13 && (r.flags |= 16384))),
          Iu(t, e))
        : Fu(t);
    }
    function Fu(e) {
      var t = e;
      do {
        if (t.flags & 32768) {
          Iu(t, Vl);
          return;
        }
        e = t.return;
        var n = zc(t.alternate, t, Wl);
        if (n !== null) {
          q = n;
          return;
        }
        if (((t = t.sibling), t !== null)) {
          q = t;
          return;
        }
        q = t = e;
      } while (t !== null);
      X === 0 && (X = 5);
    }
    function Iu(e, t) {
      do {
        var n = Bc(e.alternate, e);
        if (n !== null) {
          ((n.flags &= 32767), (q = n));
          return;
        }
        if (
          ((n = e.return),
          n !== null &&
            ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
          !t && ((e = e.sibling), e !== null))
        ) {
          q = e;
          return;
        }
        q = e = n;
      } while (e !== null);
      ((X = 6), (q = null));
    }
    function Lu(e, t, n, r, a, o, s, c, l) {
      e.cancelPendingCommit = null;
      do Hu();
      while (iu !== 0);
      if (G & 6) throw Error(i(327));
      if (t !== null) {
        if (t === e.current) throw Error(i(177));
        if (
          ((o = t.lanes | t.childLanes),
          (o |= ni),
          it(e, n, o, s, c, l),
          e === K && ((q = K = null), (J = 0)),
          (ou = t),
          (au = e),
          (su = n),
          (cu = o),
          (lu = a),
          (uu = r),
          t.subtreeFlags & 10256 || t.flags & 10256
            ? ((e.callbackNode = null),
              (e.callbackPriority = 0),
              Xu(A, function () {
                return (Uu(), null);
              }))
            : ((e.callbackNode = null), (e.callbackPriority = 0)),
          (r = (t.flags & 13878) != 0),
          t.subtreeFlags & 13878 || r)
        ) {
          ((r = E.T), (E.T = null), (a = D.p), (D.p = 2), (s = G), (G |= 4));
          try {
            ol(e, t, n);
          } finally {
            ((G = s), (D.p = a), (E.T = r));
          }
        }
        ((iu = 1), Ru(), zu(), Bu());
      }
    }
    function Ru() {
      if (iu === 1) {
        iu = 0;
        var e = au,
          t = ou,
          n = (t.flags & 13878) != 0;
        if (t.subtreeFlags & 13878 || n) {
          ((n = E.T), (E.T = null));
          var r = D.p;
          D.p = 2;
          var i = G;
          G |= 4;
          try {
            vl(t, e);
            var a = zd,
              o = Ar(e.containerInfo),
              s = a.focusedElem,
              c = a.selectionRange;
            if (
              o !== s &&
              s &&
              s.ownerDocument &&
              kr(s.ownerDocument.documentElement, s)
            ) {
              if (c !== null && jr(s)) {
                var l = c.start,
                  u = c.end;
                if ((u === void 0 && (u = l), `selectionStart` in s))
                  ((s.selectionStart = l),
                    (s.selectionEnd = Math.min(u, s.value.length)));
                else {
                  var d = s.ownerDocument || document,
                    f = (d && d.defaultView) || window;
                  if (f.getSelection) {
                    var p = f.getSelection(),
                      m = s.textContent.length,
                      h = Math.min(c.start, m),
                      g = c.end === void 0 ? h : Math.min(c.end, m);
                    !p.extend && h > g && ((o = g), (g = h), (h = o));
                    var _ = Or(s, h),
                      v = Or(s, g);
                    if (
                      _ &&
                      v &&
                      (p.rangeCount !== 1 ||
                        p.anchorNode !== _.node ||
                        p.anchorOffset !== _.offset ||
                        p.focusNode !== v.node ||
                        p.focusOffset !== v.offset)
                    ) {
                      var y = d.createRange();
                      (y.setStart(_.node, _.offset),
                        p.removeAllRanges(),
                        h > g
                          ? (p.addRange(y), p.extend(v.node, v.offset))
                          : (y.setEnd(v.node, v.offset), p.addRange(y)));
                    }
                  }
                }
              }
              for (d = [], p = s; (p = p.parentNode); )
                p.nodeType === 1 &&
                  d.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for (
                typeof s.focus == `function` && s.focus(), s = 0;
                s < d.length;
                s++
              ) {
                var b = d[s];
                ((b.element.scrollLeft = b.left),
                  (b.element.scrollTop = b.top));
              }
            }
            ((sp = !!Rd), (zd = Rd = null));
          } finally {
            ((G = i), (D.p = r), (E.T = n));
          }
        }
        ((e.current = t), (iu = 2));
      }
    }
    function zu() {
      if (iu === 2) {
        iu = 0;
        var e = au,
          t = ou,
          n = (t.flags & 8772) != 0;
        if (t.subtreeFlags & 8772 || n) {
          ((n = E.T), (E.T = null));
          var r = D.p;
          D.p = 2;
          var i = G;
          G |= 4;
          try {
            sl(e, t.alternate, t);
          } finally {
            ((G = i), (D.p = r), (E.T = n));
          }
        }
        iu = 3;
      }
    }
    function Bu() {
      if (iu === 4 || iu === 3) {
        ((iu = 0), Ne());
        var e = au,
          t = ou,
          n = su,
          r = uu;
        t.subtreeFlags & 10256 || t.flags & 10256
          ? (iu = 5)
          : ((iu = 0), (ou = au = null), Vu(e, e.pendingLanes));
        var i = e.pendingLanes;
        if (
          (i === 0 && (ru = null),
          ct(n),
          (t = t.stateNode),
          Ue && typeof Ue.onCommitFiberRoot == `function`)
        )
          try {
            Ue.onCommitFiberRoot(He, t, void 0, (t.current.flags & 128) == 128);
          } catch {}
        if (r !== null) {
          ((t = E.T), (i = D.p), (D.p = 2), (E.T = null));
          try {
            for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
              var s = r[o];
              a(s.value, { componentStack: s.stack });
            }
          } finally {
            ((E.T = t), (D.p = i));
          }
        }
        (su & 3 && Hu(),
          rd(e),
          (i = e.pendingLanes),
          n & 261930 && i & 42
            ? e === fu
              ? du++
              : ((du = 0), (fu = e))
            : (du = 0),
          id(0, !1));
      }
    }
    function Vu(e, t) {
      (e.pooledCacheLanes &= t) === 0 &&
        ((t = e.pooledCache), t != null && ((e.pooledCache = null), da(t)));
    }
    function Hu() {
      return (Ru(), zu(), Bu(), Uu());
    }
    function Uu() {
      if (iu !== 5) return !1;
      var e = au,
        t = cu;
      cu = 0;
      var n = ct(su),
        r = E.T,
        a = D.p;
      try {
        ((D.p = 32 > n ? 32 : n), (E.T = null), (n = lu), (lu = null));
        var o = au,
          s = su;
        if (((iu = 0), (ou = au = null), (su = 0), G & 6)) throw Error(i(331));
        var c = G;
        if (
          ((G |= 4),
          Fl(o.current),
          Dl(o, o.current, s, n),
          (G = c),
          id(0, !1),
          Ue && typeof Ue.onPostCommitFiberRoot == `function`)
        )
          try {
            Ue.onPostCommitFiberRoot(He, o);
          } catch {}
        return !0;
      } finally {
        ((D.p = a), (E.T = r), Vu(e, t));
      }
    }
    function Wu(e, t, n) {
      ((t = xi(n, t)),
        (t = $s(e.stateNode, t, 2)),
        (e = Ka(e, t, 2)),
        e !== null && (rt(e, 2), rd(e)));
    }
    function Z(e, t, n) {
      if (e.tag === 3) Wu(e, e, n);
      else
        for (; t !== null; ) {
          if (t.tag === 3) {
            Wu(t, e, n);
            break;
          } else if (t.tag === 1) {
            var r = t.stateNode;
            if (
              typeof t.type.getDerivedStateFromError == `function` ||
              (typeof r.componentDidCatch == `function` &&
                (ru === null || !ru.has(r)))
            ) {
              ((e = xi(n, e)),
                (n = ec(2)),
                (r = Ka(t, n, 2)),
                r !== null && (tc(n, r, t, e), rt(r, 2), rd(r)));
              break;
            }
          }
          t = t.return;
        }
    }
    function Gu(e, t, n) {
      var r = e.pingCache;
      if (r === null) {
        r = e.pingCache = new zl();
        var i = new Set();
        r.set(t, i);
      } else ((i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i)));
      i.has(n) ||
        ((Ul = !0), i.add(n), (e = Ku.bind(null, e, t, n)), t.then(e, e));
    }
    function Ku(e, t, n) {
      var r = e.pingCache;
      (r !== null && r.delete(t),
        (e.pingedLanes |= e.suspendedLanes & n),
        (e.warmLanes &= ~n),
        K === e &&
          (J & n) === n &&
          (X === 4 || (X === 3 && (J & 62914560) === J && 300 > Pe() - $l)
            ? !(G & 2) && Su(e, 0)
            : (ql |= n),
          Yl === J && (Yl = 0)),
        rd(e));
    }
    function qu(e, t) {
      (t === 0 && (t = tt()), (e = oi(e, t)), e !== null && (rt(e, t), rd(e)));
    }
    function Ju(e) {
      var t = e.memoizedState,
        n = 0;
      (t !== null && (n = t.retryLane), qu(e, n));
    }
    function Yu(e, t) {
      var n = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var r = e.stateNode,
            a = e.memoizedState;
          a !== null && (n = a.retryLane);
          break;
        case 19:
          r = e.stateNode;
          break;
        case 22:
          r = e.stateNode._retryCache;
          break;
        default:
          throw Error(i(314));
      }
      (r !== null && r.delete(t), qu(e, n));
    }
    function Xu(e, t) {
      return Ae(e, t);
    }
    var Zu = null,
      Qu = null,
      $u = !1,
      ed = !1,
      td = !1,
      nd = 0;
    function rd(e) {
      (e !== Qu &&
        e.next === null &&
        (Qu === null ? (Zu = Qu = e) : (Qu = Qu.next = e)),
        (ed = !0),
        $u || (($u = !0), ud()));
    }
    function id(e, t) {
      if (!td && ed) {
        td = !0;
        do
          for (var n = !1, r = Zu; r !== null; ) {
            if (!t)
              if (e !== 0) {
                var i = r.pendingLanes;
                if (i === 0) var a = 0;
                else {
                  var o = r.suspendedLanes,
                    s = r.pingedLanes;
                  ((a = (1 << (31 - j(42 | e) + 1)) - 1),
                    (a &= i & ~(o & ~s)),
                    (a = a & 201326741 ? (a & 201326741) | 1 : a ? a | 2 : 0));
                }
                a !== 0 && ((n = !0), ld(r, a));
              } else
                ((a = J),
                  (a = Qe(
                    r,
                    r === K ? a : 0,
                    r.cancelPendingCommit !== null || r.timeoutHandle !== -1,
                  )),
                  !(a & 3) || $e(r, a) || ((n = !0), ld(r, a)));
            r = r.next;
          }
        while (n);
        td = !1;
      }
    }
    function ad() {
      od();
    }
    function od() {
      ed = $u = !1;
      var e = 0;
      nd !== 0 && Gd() && (e = nd);
      for (var t = Pe(), n = null, r = Zu; r !== null; ) {
        var i = r.next,
          a = sd(r, t);
        (a === 0
          ? ((r.next = null),
            n === null ? (Zu = i) : (n.next = i),
            i === null && (Qu = n))
          : ((n = r), (e !== 0 || a & 3) && (ed = !0)),
          (r = i));
      }
      ((iu !== 0 && iu !== 5) || id(e, !1), nd !== 0 && (nd = 0));
    }
    function sd(e, t) {
      for (
        var n = e.suspendedLanes,
          r = e.pingedLanes,
          i = e.expirationTimes,
          a = e.pendingLanes & -62914561;
        0 < a;
      ) {
        var o = 31 - j(a),
          s = 1 << o,
          c = i[o];
        (c === -1
          ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = et(s, t))
          : c <= t && (e.expiredLanes |= s),
          (a &= ~s));
      }
      if (
        ((t = K),
        (n = J),
        (n = Qe(
          e,
          e === t ? n : 0,
          e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
        )),
        (r = e.callbackNode),
        n === 0 ||
          (e === t && (Y === 2 || Y === 9)) ||
          e.cancelPendingCommit !== null)
      )
        return (
          r !== null && r !== null && je(r),
          (e.callbackNode = null),
          (e.callbackPriority = 0)
        );
      if (!(n & 3) || $e(e, n)) {
        if (((t = n & -n), t === e.callbackPriority)) return t;
        switch ((r !== null && je(r), ct(n))) {
          case 2:
          case 8:
            n = Le;
            break;
          case 32:
            n = A;
            break;
          case 268435456:
            n = ze;
            break;
          default:
            n = A;
        }
        return (
          (r = cd.bind(null, e)),
          (n = Ae(n, r)),
          (e.callbackPriority = t),
          (e.callbackNode = n),
          t
        );
      }
      return (
        r !== null && r !== null && je(r),
        (e.callbackPriority = 2),
        (e.callbackNode = null),
        2
      );
    }
    function cd(e, t) {
      if (iu !== 0 && iu !== 5)
        return ((e.callbackNode = null), (e.callbackPriority = 0), null);
      var n = e.callbackNode;
      if (Hu() && e.callbackNode !== n) return null;
      var r = J;
      return (
        (r = Qe(
          e,
          e === K ? r : 0,
          e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
        )),
        r === 0
          ? null
          : (gu(e, r, t),
            sd(e, Pe()),
            e.callbackNode != null && e.callbackNode === n
              ? cd.bind(null, e)
              : null)
      );
    }
    function ld(e, t) {
      if (Hu()) return null;
      gu(e, t, !0);
    }
    function ud() {
      Yd(function () {
        G & 6 ? Ae(Ie, ad) : od();
      });
    }
    function dd() {
      if (nd === 0) {
        var e = ma;
        (e === 0 && ((e = Je), (Je <<= 1), !(Je & 261888) && (Je = 256)),
          (nd = e));
      }
      return nd;
    }
    function fd(e) {
      return e == null || typeof e == `symbol` || typeof e == `boolean`
        ? null
        : typeof e == `function`
          ? e
          : nn(`` + e);
    }
    function pd(e, t) {
      var n = t.ownerDocument.createElement(`input`);
      return (
        (n.name = t.name),
        (n.value = t.value),
        e.id && n.setAttribute(`form`, e.id),
        t.parentNode.insertBefore(n, t),
        (e = new FormData(e)),
        n.parentNode.removeChild(n),
        e
      );
    }
    function md(e, t, n, r, i) {
      if (t === `submit` && n && n.stateNode === i) {
        var a = fd((i[pt] || null).action),
          o = r.submitter;
        o &&
          ((t = (t = o[pt] || null)
            ? fd(t.formAction)
            : o.getAttribute(`formAction`)),
          t !== null && ((a = t), (o = null)));
        var s = new Tn(`action`, `action`, null, r, i);
        e.push({
          event: s,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (r.defaultPrevented) {
                  if (nd !== 0) {
                    var e = o ? pd(i, o) : new FormData(i);
                    Ts(
                      n,
                      { pending: !0, data: e, method: i.method, action: a },
                      null,
                      e,
                    );
                  }
                } else
                  typeof a == `function` &&
                    (s.preventDefault(),
                    (e = o ? pd(i, o) : new FormData(i)),
                    Ts(
                      n,
                      { pending: !0, data: e, method: i.method, action: a },
                      a,
                      e,
                    ));
              },
              currentTarget: i,
            },
          ],
        });
      }
    }
    for (var hd = 0; hd < Zr.length; hd++) {
      var gd = Zr[hd];
      Qr(gd.toLowerCase(), `on` + (gd[0].toUpperCase() + gd.slice(1)));
    }
    (Qr(Ur, `onAnimationEnd`),
      Qr(Wr, `onAnimationIteration`),
      Qr(Gr, `onAnimationStart`),
      Qr(`dblclick`, `onDoubleClick`),
      Qr(`focusin`, `onFocus`),
      Qr(`focusout`, `onBlur`),
      Qr(Kr, `onTransitionRun`),
      Qr(qr, `onTransitionStart`),
      Qr(Jr, `onTransitionCancel`),
      Qr(Yr, `onTransitionEnd`),
      kt(`onMouseEnter`, [`mouseout`, `mouseover`]),
      kt(`onMouseLeave`, [`mouseout`, `mouseover`]),
      kt(`onPointerEnter`, [`pointerout`, `pointerover`]),
      kt(`onPointerLeave`, [`pointerout`, `pointerover`]),
      Ot(
        `onChange`,
        `change click focusin focusout input keydown keyup selectionchange`.split(
          ` `,
        ),
      ),
      Ot(
        `onSelect`,
        `focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(
          ` `,
        ),
      ),
      Ot(`onBeforeInput`, [`compositionend`, `keypress`, `textInput`, `paste`]),
      Ot(
        `onCompositionEnd`,
        `compositionend focusout keydown keypress keyup mousedown`.split(` `),
      ),
      Ot(
        `onCompositionStart`,
        `compositionstart focusout keydown keypress keyup mousedown`.split(` `),
      ),
      Ot(
        `onCompositionUpdate`,
        `compositionupdate focusout keydown keypress keyup mousedown`.split(
          ` `,
        ),
      ));
    var _d =
        `abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(
          ` `,
        ),
      vd = new Set(
        `beforetoggle cancel close invalid load scroll scrollend toggle`
          .split(` `)
          .concat(_d),
      );
    function yd(e, t) {
      t = (t & 4) != 0;
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          i = r.event;
        r = r.listeners;
        a: {
          var a = void 0;
          if (t)
            for (var o = r.length - 1; 0 <= o; o--) {
              var s = r[o],
                c = s.instance,
                l = s.currentTarget;
              if (((s = s.listener), c !== a && i.isPropagationStopped()))
                break a;
              ((a = s), (i.currentTarget = l));
              try {
                a(i);
              } catch (e) {
                $r(e);
              }
              ((i.currentTarget = null), (a = c));
            }
          else
            for (o = 0; o < r.length; o++) {
              if (
                ((s = r[o]),
                (c = s.instance),
                (l = s.currentTarget),
                (s = s.listener),
                c !== a && i.isPropagationStopped())
              )
                break a;
              ((a = s), (i.currentTarget = l));
              try {
                a(i);
              } catch (e) {
                $r(e);
              }
              ((i.currentTarget = null), (a = c));
            }
        }
      }
    }
    function Q(e, t) {
      var n = t[ht];
      n === void 0 && (n = t[ht] = new Set());
      var r = e + `__bubble`;
      n.has(r) || (Cd(t, e, 2, !1), n.add(r));
    }
    function bd(e, t, n) {
      var r = 0;
      (t && (r |= 4), Cd(n, e, r, t));
    }
    var xd = `_reactListening` + Math.random().toString(36).slice(2);
    function Sd(e) {
      if (!e[xd]) {
        ((e[xd] = !0),
          Et.forEach(function (t) {
            t !== `selectionchange` &&
              (vd.has(t) || bd(t, !1, e), bd(t, !0, e));
          }));
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[xd] || ((t[xd] = !0), bd(`selectionchange`, !1, t));
      }
    }
    function Cd(e, t, n, r) {
      switch (mp(t)) {
        case 2:
          var i = cp;
          break;
        case 8:
          i = lp;
          break;
        default:
          i = up;
      }
      ((n = i.bind(null, t, n, e)),
        (i = void 0),
        !mn ||
          (t !== `touchstart` && t !== `touchmove` && t !== `wheel`) ||
          (i = !0),
        r
          ? i === void 0
            ? e.addEventListener(t, n, !0)
            : e.addEventListener(t, n, { capture: !0, passive: i })
          : i === void 0
            ? e.addEventListener(t, n, !1)
            : e.addEventListener(t, n, { passive: i }));
    }
    function wd(e, t, n, r, i) {
      var a = r;
      if (!(t & 1) && !(t & 2) && r !== null)
        a: for (;;) {
          if (r === null) return;
          var s = r.tag;
          if (s === 3 || s === 4) {
            var c = r.stateNode.containerInfo;
            if (c === i) break;
            if (s === 4)
              for (s = r.return; s !== null; ) {
                var l = s.tag;
                if ((l === 3 || l === 4) && s.stateNode.containerInfo === i)
                  return;
                s = s.return;
              }
            for (; c !== null; ) {
              if (((s = xt(c)), s === null)) return;
              if (((l = s.tag), l === 5 || l === 6 || l === 26 || l === 27)) {
                r = a = s;
                continue a;
              }
              c = c.parentNode;
            }
          }
          r = r.return;
        }
      dn(function () {
        var r = a,
          i = on(n),
          s = [];
        a: {
          var c = Xr.get(e);
          if (c !== void 0) {
            var l = Tn,
              u = e;
            switch (e) {
              case `keypress`:
                if (bn(n) === 0) break a;
              case `keydown`:
              case `keyup`:
                l = Un;
                break;
              case `focusin`:
                ((u = `focus`), (l = Pn));
                break;
              case `focusout`:
                ((u = `blur`), (l = Pn));
                break;
              case `beforeblur`:
              case `afterblur`:
                l = Pn;
                break;
              case `click`:
                if (n.button === 2) break a;
              case `auxclick`:
              case `dblclick`:
              case `mousedown`:
              case `mousemove`:
              case `mouseup`:
              case `mouseout`:
              case `mouseover`:
              case `contextmenu`:
                l = Mn;
                break;
              case `drag`:
              case `dragend`:
              case `dragenter`:
              case `dragexit`:
              case `dragleave`:
              case `dragover`:
              case `dragstart`:
              case `drop`:
                l = Nn;
                break;
              case `touchcancel`:
              case `touchend`:
              case `touchmove`:
              case `touchstart`:
                l = Gn;
                break;
              case Ur:
              case Wr:
              case Gr:
                l = Fn;
                break;
              case Yr:
                l = Kn;
                break;
              case `scroll`:
              case `scrollend`:
                l = Dn;
                break;
              case `wheel`:
                l = qn;
                break;
              case `copy`:
              case `cut`:
              case `paste`:
                l = In;
                break;
              case `gotpointercapture`:
              case `lostpointercapture`:
              case `pointercancel`:
              case `pointerdown`:
              case `pointermove`:
              case `pointerout`:
              case `pointerover`:
              case `pointerup`:
                l = Wn;
                break;
              case `toggle`:
              case `beforetoggle`:
                l = Jn;
            }
            var d = (t & 4) != 0,
              f = !d && (e === `scroll` || e === `scrollend`),
              p = d ? (c === null ? null : c + `Capture`) : c;
            d = [];
            for (var m = r, h; m !== null; ) {
              var g = m;
              if (
                ((h = g.stateNode),
                (g = g.tag),
                (g !== 5 && g !== 26 && g !== 27) ||
                  h === null ||
                  p === null ||
                  ((g = fn(m, p)), g != null && d.push(Td(m, g, h))),
                f)
              )
                break;
              m = m.return;
            }
            0 < d.length &&
              ((c = new l(c, u, null, n, i)),
              s.push({ event: c, listeners: d }));
          }
        }
        if (!(t & 7)) {
          a: {
            if (
              ((c = e === `mouseover` || e === `pointerover`),
              (l = e === `mouseout` || e === `pointerout`),
              c &&
                n !== an &&
                (u = n.relatedTarget || n.fromElement) &&
                (xt(u) || u[mt]))
            )
              break a;
            if (
              (l || c) &&
              ((c =
                i.window === i
                  ? i
                  : (c = i.ownerDocument)
                    ? c.defaultView || c.parentWindow
                    : window),
              l
                ? ((u = n.relatedTarget || n.toElement),
                  (l = r),
                  (u = u ? xt(u) : null),
                  u !== null &&
                    ((f = o(u)),
                    (d = u.tag),
                    u !== f || (d !== 5 && d !== 27 && d !== 6)) &&
                    (u = null))
                : ((l = null), (u = r)),
              l !== u)
            ) {
              if (
                ((d = Mn),
                (g = `onMouseLeave`),
                (p = `onMouseEnter`),
                (m = `mouse`),
                (e === `pointerout` || e === `pointerover`) &&
                  ((d = Wn),
                  (g = `onPointerLeave`),
                  (p = `onPointerEnter`),
                  (m = `pointer`)),
                (f = l == null ? c : Ct(l)),
                (h = u == null ? c : Ct(u)),
                (c = new d(g, m + `leave`, l, n, i)),
                (c.target = f),
                (c.relatedTarget = h),
                (g = null),
                xt(i) === r &&
                  ((d = new d(p, m + `enter`, u, n, i)),
                  (d.target = h),
                  (d.relatedTarget = f),
                  (g = d)),
                (f = g),
                l && u)
              )
                b: {
                  for (d = Dd, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
                  g = 0;
                  for (var _ = m; _; _ = d(_)) g++;
                  for (; 0 < h - g; ) ((p = d(p)), h--);
                  for (; 0 < g - h; ) ((m = d(m)), g--);
                  for (; h--; ) {
                    if (p === m || (m !== null && p === m.alternate)) {
                      d = p;
                      break b;
                    }
                    ((p = d(p)), (m = d(m)));
                  }
                  d = null;
                }
              else d = null;
              (l !== null && Od(s, c, l, d, !1),
                u !== null && f !== null && Od(s, f, u, d, !0));
            }
          }
          a: {
            if (
              ((c = r ? Ct(r) : window),
              (l = c.nodeName && c.nodeName.toLowerCase()),
              l === `select` || (l === `input` && c.type === `file`))
            )
              var v = pr;
            else if (sr(c))
              if (mr) v = Cr;
              else {
                v = xr;
                var y = br;
              }
            else
              ((l = c.nodeName),
                !l ||
                l.toLowerCase() !== `input` ||
                (c.type !== `checkbox` && c.type !== `radio`)
                  ? r && $t(r.elementType) && (v = pr)
                  : (v = Sr));
            if ((v &&= v(e, r))) {
              cr(s, v, n, i);
              break a;
            }
            (y && y(e, c, r),
              e === `focusout` &&
                r &&
                c.type === `number` &&
                r.memoizedProps.value != null &&
                Gt(c, `number`, c.value));
          }
          switch (((y = r ? Ct(r) : window), e)) {
            case `focusin`:
              (sr(y) || y.contentEditable === `true`) &&
                ((Nr = y), (Pr = r), (Fr = null));
              break;
            case `focusout`:
              Fr = Pr = Nr = null;
              break;
            case `mousedown`:
              Ir = !0;
              break;
            case `contextmenu`:
            case `mouseup`:
            case `dragend`:
              ((Ir = !1), Lr(s, n, i));
              break;
            case `selectionchange`:
              if (Mr) break;
            case `keydown`:
            case `keyup`:
              Lr(s, n, i);
          }
          var b;
          if (Xn)
            b: {
              switch (e) {
                case `compositionstart`:
                  var x = `onCompositionStart`;
                  break b;
                case `compositionend`:
                  x = `onCompositionEnd`;
                  break b;
                case `compositionupdate`:
                  x = `onCompositionUpdate`;
                  break b;
              }
              x = void 0;
            }
          else
            F
              ? nr(e, n) && (x = `onCompositionEnd`)
              : e === `keydown` &&
                n.keyCode === 229 &&
                (x = `onCompositionStart`);
          (x &&
            ($n &&
              n.locale !== `ko` &&
              (F || x !== `onCompositionStart`
                ? x === `onCompositionEnd` && F && (b = yn())
                : ((gn = i),
                  (_n = `value` in gn ? gn.value : gn.textContent),
                  (F = !0))),
            (y = Ed(r, x)),
            0 < y.length &&
              ((x = new Ln(x, e, null, n, i)),
              s.push({ event: x, listeners: y }),
              b ? (x.data = b) : ((b = rr(n)), b !== null && (x.data = b)))),
            (b = Qn ? ir(e, n) : ar(e, n)) &&
              ((x = Ed(r, `onBeforeInput`)),
              0 < x.length &&
                ((y = new Ln(`onBeforeInput`, `beforeinput`, null, n, i)),
                s.push({ event: y, listeners: x }),
                (y.data = b))),
            md(s, e, r, n, i));
        }
        yd(s, t);
      });
    }
    function Td(e, t, n) {
      return { instance: e, listener: t, currentTarget: n };
    }
    function Ed(e, t) {
      for (var n = t + `Capture`, r = []; e !== null; ) {
        var i = e,
          a = i.stateNode;
        if (
          ((i = i.tag),
          (i !== 5 && i !== 26 && i !== 27) ||
            a === null ||
            ((i = fn(e, n)),
            i != null && r.unshift(Td(e, i, a)),
            (i = fn(e, t)),
            i != null && r.push(Td(e, i, a))),
          e.tag === 3)
        )
          return r;
        e = e.return;
      }
      return [];
    }
    function Dd(e) {
      if (e === null) return null;
      do e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function Od(e, t, n, r, i) {
      for (var a = t._reactName, o = []; n !== null && n !== r; ) {
        var s = n,
          c = s.alternate,
          l = s.stateNode;
        if (((s = s.tag), c !== null && c === r)) break;
        ((s !== 5 && s !== 26 && s !== 27) ||
          l === null ||
          ((c = l),
          i
            ? ((l = fn(n, a)), l != null && o.unshift(Td(n, l, c)))
            : i || ((l = fn(n, a)), l != null && o.push(Td(n, l, c)))),
          (n = n.return));
      }
      o.length !== 0 && e.push({ event: t, listeners: o });
    }
    var kd = /\r\n?/g,
      Ad = /\u0000|\uFFFD/g;
    function jd(e) {
      return (typeof e == `string` ? e : `` + e)
        .replace(
          kd,
          `
`,
        )
        .replace(Ad, ``);
    }
    function Md(e, t) {
      return ((t = jd(t)), jd(e) === t);
    }
    function $(e, t, n, r, a, o) {
      switch (n) {
        case `children`:
          typeof r == `string`
            ? t === `body` || (t === `textarea` && r === ``) || Yt(e, r)
            : (typeof r == `number` || typeof r == `bigint`) &&
              t !== `body` &&
              Yt(e, `` + r);
          break;
        case `className`:
          Pt(e, `class`, r);
          break;
        case `tabIndex`:
          Pt(e, `tabindex`, r);
          break;
        case `dir`:
        case `role`:
        case `viewBox`:
        case `width`:
        case `height`:
          Pt(e, n, r);
          break;
        case `style`:
          Qt(e, r, o);
          break;
        case `data`:
          if (t !== `object`) {
            Pt(e, `data`, r);
            break;
          }
        case `src`:
        case `href`:
          if (r === `` && (t !== `a` || n !== `href`)) {
            e.removeAttribute(n);
            break;
          }
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `symbol` ||
            typeof r == `boolean`
          ) {
            e.removeAttribute(n);
            break;
          }
          ((r = nn(`` + r)), e.setAttribute(n, r));
          break;
        case `action`:
        case `formAction`:
          if (typeof r == `function`) {
            e.setAttribute(
              n,
              `javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`,
            );
            break;
          } else
            typeof o == `function` &&
              (n === `formAction`
                ? (t !== `input` && $(e, t, `name`, a.name, a, null),
                  $(e, t, `formEncType`, a.formEncType, a, null),
                  $(e, t, `formMethod`, a.formMethod, a, null),
                  $(e, t, `formTarget`, a.formTarget, a, null))
                : ($(e, t, `encType`, a.encType, a, null),
                  $(e, t, `method`, a.method, a, null),
                  $(e, t, `target`, a.target, a, null)));
          if (r == null || typeof r == `symbol` || typeof r == `boolean`) {
            e.removeAttribute(n);
            break;
          }
          ((r = nn(`` + r)), e.setAttribute(n, r));
          break;
        case `onClick`:
          r != null && (e.onclick = rn);
          break;
        case `onScroll`:
          r != null && Q(`scroll`, e);
          break;
        case `onScrollEnd`:
          r != null && Q(`scrollend`, e);
          break;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(i(61));
            if (((n = r.__html), n != null)) {
              if (a.children != null) throw Error(i(60));
              e.innerHTML = n;
            }
          }
          break;
        case `multiple`:
          e.multiple = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `muted`:
          e.muted = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `defaultValue`:
        case `defaultChecked`:
        case `innerHTML`:
        case `ref`:
          break;
        case `autoFocus`:
          break;
        case `xlinkHref`:
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `boolean` ||
            typeof r == `symbol`
          ) {
            e.removeAttribute(`xlink:href`);
            break;
          }
          ((n = nn(`` + r)),
            e.setAttributeNS(`http://www.w3.org/1999/xlink`, `xlink:href`, n));
          break;
        case `contentEditable`:
        case `spellCheck`:
        case `draggable`:
        case `value`:
        case `autoReverse`:
        case `externalResourcesRequired`:
        case `focusable`:
        case `preserveAlpha`:
          r != null && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, `` + r)
            : e.removeAttribute(n);
          break;
        case `inert`:
        case `allowFullScreen`:
        case `async`:
        case `autoPlay`:
        case `controls`:
        case `default`:
        case `defer`:
        case `disabled`:
        case `disablePictureInPicture`:
        case `disableRemotePlayback`:
        case `formNoValidate`:
        case `hidden`:
        case `loop`:
        case `noModule`:
        case `noValidate`:
        case `open`:
        case `playsInline`:
        case `readOnly`:
        case `required`:
        case `reversed`:
        case `scoped`:
        case `seamless`:
        case `itemScope`:
          r && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, ``)
            : e.removeAttribute(n);
          break;
        case `capture`:
        case `download`:
          !0 === r
            ? e.setAttribute(n, ``)
            : !1 !== r &&
                r != null &&
                typeof r != `function` &&
                typeof r != `symbol`
              ? e.setAttribute(n, r)
              : e.removeAttribute(n);
          break;
        case `cols`:
        case `rows`:
        case `size`:
        case `span`:
          r != null &&
          typeof r != `function` &&
          typeof r != `symbol` &&
          !isNaN(r) &&
          1 <= r
            ? e.setAttribute(n, r)
            : e.removeAttribute(n);
          break;
        case `rowSpan`:
        case `start`:
          r == null ||
          typeof r == `function` ||
          typeof r == `symbol` ||
          isNaN(r)
            ? e.removeAttribute(n)
            : e.setAttribute(n, r);
          break;
        case `popover`:
          (Q(`beforetoggle`, e), Q(`toggle`, e), N(e, `popover`, r));
          break;
        case `xlinkActuate`:
          Ft(e, `http://www.w3.org/1999/xlink`, `xlink:actuate`, r);
          break;
        case `xlinkArcrole`:
          Ft(e, `http://www.w3.org/1999/xlink`, `xlink:arcrole`, r);
          break;
        case `xlinkRole`:
          Ft(e, `http://www.w3.org/1999/xlink`, `xlink:role`, r);
          break;
        case `xlinkShow`:
          Ft(e, `http://www.w3.org/1999/xlink`, `xlink:show`, r);
          break;
        case `xlinkTitle`:
          Ft(e, `http://www.w3.org/1999/xlink`, `xlink:title`, r);
          break;
        case `xlinkType`:
          Ft(e, `http://www.w3.org/1999/xlink`, `xlink:type`, r);
          break;
        case `xmlBase`:
          Ft(e, `http://www.w3.org/XML/1998/namespace`, `xml:base`, r);
          break;
        case `xmlLang`:
          Ft(e, `http://www.w3.org/XML/1998/namespace`, `xml:lang`, r);
          break;
        case `xmlSpace`:
          Ft(e, `http://www.w3.org/XML/1998/namespace`, `xml:space`, r);
          break;
        case `is`:
          N(e, `is`, r);
          break;
        case `innerText`:
        case `textContent`:
          break;
        default:
          (!(2 < n.length) ||
            (n[0] !== `o` && n[0] !== `O`) ||
            (n[1] !== `n` && n[1] !== `N`)) &&
            ((n = en.get(n) || n), N(e, n, r));
      }
    }
    function Nd(e, t, n, r, a, o) {
      switch (n) {
        case `style`:
          Qt(e, r, o);
          break;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(i(61));
            if (((n = r.__html), n != null)) {
              if (a.children != null) throw Error(i(60));
              e.innerHTML = n;
            }
          }
          break;
        case `children`:
          typeof r == `string`
            ? Yt(e, r)
            : (typeof r == `number` || typeof r == `bigint`) && Yt(e, `` + r);
          break;
        case `onScroll`:
          r != null && Q(`scroll`, e);
          break;
        case `onScrollEnd`:
          r != null && Q(`scrollend`, e);
          break;
        case `onClick`:
          r != null && (e.onclick = rn);
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `innerHTML`:
        case `ref`:
          break;
        case `innerText`:
        case `textContent`:
          break;
        default:
          if (!Dt.hasOwnProperty(n))
            a: {
              if (
                n[0] === `o` &&
                n[1] === `n` &&
                ((a = n.endsWith(`Capture`)),
                (t = n.slice(2, a ? n.length - 7 : void 0)),
                (o = e[pt] || null),
                (o = o == null ? null : o[n]),
                typeof o == `function` && e.removeEventListener(t, o, a),
                typeof r == `function`)
              ) {
                (typeof o != `function` &&
                  o !== null &&
                  (n in e
                    ? (e[n] = null)
                    : e.hasAttribute(n) && e.removeAttribute(n)),
                  e.addEventListener(t, r, a));
                break a;
              }
              n in e
                ? (e[n] = r)
                : !0 === r
                  ? e.setAttribute(n, ``)
                  : N(e, n, r);
            }
      }
    }
    function Pd(e, t, n) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `img`:
          (Q(`error`, e), Q(`load`, e));
          var r = !1,
            a = !1,
            o;
          for (o in n)
            if (n.hasOwnProperty(o)) {
              var s = n[o];
              if (s != null)
                switch (o) {
                  case `src`:
                    r = !0;
                    break;
                  case `srcSet`:
                    a = !0;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    throw Error(i(137, t));
                  default:
                    $(e, t, o, s, n, null);
                }
            }
          (a && $(e, t, `srcSet`, n.srcSet, n, null),
            r && $(e, t, `src`, n.src, n, null));
          return;
        case `input`:
          Q(`invalid`, e);
          var c = (o = s = a = null),
            l = null,
            u = null;
          for (r in n)
            if (n.hasOwnProperty(r)) {
              var d = n[r];
              if (d != null)
                switch (r) {
                  case `name`:
                    a = d;
                    break;
                  case `type`:
                    s = d;
                    break;
                  case `checked`:
                    l = d;
                    break;
                  case `defaultChecked`:
                    u = d;
                    break;
                  case `value`:
                    o = d;
                    break;
                  case `defaultValue`:
                    c = d;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    if (d != null) throw Error(i(137, t));
                    break;
                  default:
                    $(e, t, r, d, n, null);
                }
            }
          Wt(e, o, c, l, u, s, a, !1);
          return;
        case `select`:
          for (a in (Q(`invalid`, e), (r = s = o = null), n))
            if (n.hasOwnProperty(a) && ((c = n[a]), c != null))
              switch (a) {
                case `value`:
                  o = c;
                  break;
                case `defaultValue`:
                  s = c;
                  break;
                case `multiple`:
                  r = c;
                default:
                  $(e, t, a, c, n, null);
              }
          ((t = o),
            (n = s),
            (e.multiple = !!r),
            t == null ? n != null && Kt(e, !!r, n, !0) : Kt(e, !!r, t, !1));
          return;
        case `textarea`:
          for (s in (Q(`invalid`, e), (o = a = r = null), n))
            if (n.hasOwnProperty(s) && ((c = n[s]), c != null))
              switch (s) {
                case `value`:
                  r = c;
                  break;
                case `defaultValue`:
                  a = c;
                  break;
                case `children`:
                  o = c;
                  break;
                case `dangerouslySetInnerHTML`:
                  if (c != null) throw Error(i(91));
                  break;
                default:
                  $(e, t, s, c, n, null);
              }
          Jt(e, r, a, o);
          return;
        case `option`:
          for (l in n)
            if (n.hasOwnProperty(l) && ((r = n[l]), r != null))
              switch (l) {
                case `selected`:
                  e.selected =
                    r && typeof r != `function` && typeof r != `symbol`;
                  break;
                default:
                  $(e, t, l, r, n, null);
              }
          return;
        case `dialog`:
          (Q(`beforetoggle`, e), Q(`toggle`, e), Q(`cancel`, e), Q(`close`, e));
          break;
        case `iframe`:
        case `object`:
          Q(`load`, e);
          break;
        case `video`:
        case `audio`:
          for (r = 0; r < _d.length; r++) Q(_d[r], e);
          break;
        case `image`:
          (Q(`error`, e), Q(`load`, e));
          break;
        case `details`:
          Q(`toggle`, e);
          break;
        case `embed`:
        case `source`:
        case `link`:
          (Q(`error`, e), Q(`load`, e));
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (u in n)
            if (n.hasOwnProperty(u) && ((r = n[u]), r != null))
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  throw Error(i(137, t));
                default:
                  $(e, t, u, r, n, null);
              }
          return;
        default:
          if ($t(t)) {
            for (d in n)
              n.hasOwnProperty(d) &&
                ((r = n[d]), r !== void 0 && Nd(e, t, d, r, n, void 0));
            return;
          }
      }
      for (c in n)
        n.hasOwnProperty(c) &&
          ((r = n[c]), r != null && $(e, t, c, r, n, null));
    }
    function Fd(e, t, n, r) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `input`:
          var a = null,
            o = null,
            s = null,
            c = null,
            l = null,
            u = null,
            d = null;
          for (m in n) {
            var f = n[m];
            if (n.hasOwnProperty(m) && f != null)
              switch (m) {
                case `checked`:
                  break;
                case `value`:
                  break;
                case `defaultValue`:
                  l = f;
                default:
                  r.hasOwnProperty(m) || $(e, t, m, null, r, f);
              }
          }
          for (var p in r) {
            var m = r[p];
            if (((f = n[p]), r.hasOwnProperty(p) && (m != null || f != null)))
              switch (p) {
                case `type`:
                  o = m;
                  break;
                case `name`:
                  a = m;
                  break;
                case `checked`:
                  u = m;
                  break;
                case `defaultChecked`:
                  d = m;
                  break;
                case `value`:
                  s = m;
                  break;
                case `defaultValue`:
                  c = m;
                  break;
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (m != null) throw Error(i(137, t));
                  break;
                default:
                  m !== f && $(e, t, p, m, r, f);
              }
          }
          P(e, s, c, l, u, d, o, a);
          return;
        case `select`:
          for (o in ((m = s = c = p = null), n))
            if (((l = n[o]), n.hasOwnProperty(o) && l != null))
              switch (o) {
                case `value`:
                  break;
                case `multiple`:
                  m = l;
                default:
                  r.hasOwnProperty(o) || $(e, t, o, null, r, l);
              }
          for (a in r)
            if (
              ((o = r[a]),
              (l = n[a]),
              r.hasOwnProperty(a) && (o != null || l != null))
            )
              switch (a) {
                case `value`:
                  p = o;
                  break;
                case `defaultValue`:
                  c = o;
                  break;
                case `multiple`:
                  s = o;
                default:
                  o !== l && $(e, t, a, o, r, l);
              }
          ((t = c),
            (n = s),
            (r = m),
            p == null
              ? !!r != !!n &&
                (t == null ? Kt(e, !!n, n ? [] : ``, !1) : Kt(e, !!n, t, !0))
              : Kt(e, !!n, p, !1));
          return;
        case `textarea`:
          for (c in ((m = p = null), n))
            if (
              ((a = n[c]),
              n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c))
            )
              switch (c) {
                case `value`:
                  break;
                case `children`:
                  break;
                default:
                  $(e, t, c, null, r, a);
              }
          for (s in r)
            if (
              ((a = r[s]),
              (o = n[s]),
              r.hasOwnProperty(s) && (a != null || o != null))
            )
              switch (s) {
                case `value`:
                  p = a;
                  break;
                case `defaultValue`:
                  m = a;
                  break;
                case `children`:
                  break;
                case `dangerouslySetInnerHTML`:
                  if (a != null) throw Error(i(91));
                  break;
                default:
                  a !== o && $(e, t, s, a, r, o);
              }
          qt(e, p, m);
          return;
        case `option`:
          for (var h in n)
            if (
              ((p = n[h]),
              n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h))
            )
              switch (h) {
                case `selected`:
                  e.selected = !1;
                  break;
                default:
                  $(e, t, h, null, r, p);
              }
          for (l in r)
            if (
              ((p = r[l]),
              (m = n[l]),
              r.hasOwnProperty(l) && p !== m && (p != null || m != null))
            )
              switch (l) {
                case `selected`:
                  e.selected =
                    p && typeof p != `function` && typeof p != `symbol`;
                  break;
                default:
                  $(e, t, l, p, r, m);
              }
          return;
        case `img`:
        case `link`:
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `embed`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `source`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (var g in n)
            ((p = n[g]),
              n.hasOwnProperty(g) &&
                p != null &&
                !r.hasOwnProperty(g) &&
                $(e, t, g, null, r, p));
          for (u in r)
            if (
              ((p = r[u]),
              (m = n[u]),
              r.hasOwnProperty(u) && p !== m && (p != null || m != null))
            )
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (p != null) throw Error(i(137, t));
                  break;
                default:
                  $(e, t, u, p, r, m);
              }
          return;
        default:
          if ($t(t)) {
            for (var _ in n)
              ((p = n[_]),
                n.hasOwnProperty(_) &&
                  p !== void 0 &&
                  !r.hasOwnProperty(_) &&
                  Nd(e, t, _, void 0, r, p));
            for (d in r)
              ((p = r[d]),
                (m = n[d]),
                !r.hasOwnProperty(d) ||
                  p === m ||
                  (p === void 0 && m === void 0) ||
                  Nd(e, t, d, p, r, m));
            return;
          }
      }
      for (var v in n)
        ((p = n[v]),
          n.hasOwnProperty(v) &&
            p != null &&
            !r.hasOwnProperty(v) &&
            $(e, t, v, null, r, p));
      for (f in r)
        ((p = r[f]),
          (m = n[f]),
          !r.hasOwnProperty(f) ||
            p === m ||
            (p == null && m == null) ||
            $(e, t, f, p, r, m));
    }
    function Id(e) {
      switch (e) {
        case `css`:
        case `script`:
        case `font`:
        case `img`:
        case `image`:
        case `input`:
        case `link`:
          return !0;
        default:
          return !1;
      }
    }
    function Ld() {
      if (typeof performance.getEntriesByType == `function`) {
        for (
          var e = 0, t = 0, n = performance.getEntriesByType(`resource`), r = 0;
          r < n.length;
          r++
        ) {
          var i = n[r],
            a = i.transferSize,
            o = i.initiatorType,
            s = i.duration;
          if (a && s && Id(o)) {
            for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
              var c = n[r],
                l = c.startTime;
              if (l > s) break;
              var u = c.transferSize,
                d = c.initiatorType;
              u &&
                Id(d) &&
                ((c = c.responseEnd),
                (o += u * (c < s ? 1 : (s - l) / (c - l))));
            }
            if ((--r, (t += (8 * (a + o)) / (i.duration / 1e3)), e++, 10 < e))
              break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection &&
        ((e = navigator.connection.downlink), typeof e == `number`)
        ? e
        : 5;
    }
    var Rd = null,
      zd = null;
    function Bd(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Vd(e) {
      switch (e) {
        case `http://www.w3.org/2000/svg`:
          return 1;
        case `http://www.w3.org/1998/Math/MathML`:
          return 2;
        default:
          return 0;
      }
    }
    function Hd(e, t) {
      if (e === 0)
        switch (t) {
          case `svg`:
            return 1;
          case `math`:
            return 2;
          default:
            return 0;
        }
      return e === 1 && t === `foreignObject` ? 0 : e;
    }
    function Ud(e, t) {
      return (
        e === `textarea` ||
        e === `noscript` ||
        typeof t.children == `string` ||
        typeof t.children == `number` ||
        typeof t.children == `bigint` ||
        (typeof t.dangerouslySetInnerHTML == `object` &&
          t.dangerouslySetInnerHTML !== null &&
          t.dangerouslySetInnerHTML.__html != null)
      );
    }
    var Wd = null;
    function Gd() {
      var e = window.event;
      return e && e.type === `popstate`
        ? e === Wd
          ? !1
          : ((Wd = e), !0)
        : ((Wd = null), !1);
    }
    var Kd = typeof setTimeout == `function` ? setTimeout : void 0,
      qd = typeof clearTimeout == `function` ? clearTimeout : void 0,
      Jd = typeof Promise == `function` ? Promise : void 0,
      Yd =
        typeof queueMicrotask == `function`
          ? queueMicrotask
          : Jd === void 0
            ? Kd
            : function (e) {
                return Jd.resolve(null).then(e).catch(Xd);
              };
    function Xd(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function Zd(e) {
      return e === `head`;
    }
    function Qd(e, t) {
      var n = t,
        r = 0;
      do {
        var i = n.nextSibling;
        if ((e.removeChild(n), i && i.nodeType === 8))
          if (((n = i.data), n === `/$` || n === `/&`)) {
            if (r === 0) {
              (e.removeChild(i), Np(t));
              return;
            }
            r--;
          } else if (
            n === `$` ||
            n === `$?` ||
            n === `$~` ||
            n === `$!` ||
            n === `&`
          )
            r++;
          else if (n === `html`) pf(e.ownerDocument.documentElement);
          else if (n === `head`) {
            ((n = e.ownerDocument.head), pf(n));
            for (var a = n.firstChild; a; ) {
              var o = a.nextSibling,
                s = a.nodeName;
              (a[yt] ||
                s === `SCRIPT` ||
                s === `STYLE` ||
                (s === `LINK` && a.rel.toLowerCase() === `stylesheet`) ||
                n.removeChild(a),
                (a = o));
            }
          } else n === `body` && pf(e.ownerDocument.body);
        n = i;
      } while (n);
      Np(t);
    }
    function $d(e, t) {
      var n = e;
      e = 0;
      do {
        var r = n.nextSibling;
        if (
          (n.nodeType === 1
            ? t
              ? ((n._stashedDisplay = n.style.display),
                (n.style.display = `none`))
              : ((n.style.display = n._stashedDisplay || ``),
                n.getAttribute(`style`) === `` && n.removeAttribute(`style`))
            : n.nodeType === 3 &&
              (t
                ? ((n._stashedText = n.nodeValue), (n.nodeValue = ``))
                : (n.nodeValue = n._stashedText || ``)),
          r && r.nodeType === 8)
        )
          if (((n = r.data), n === `/$`)) {
            if (e === 0) break;
            e--;
          } else (n !== `$` && n !== `$?` && n !== `$~` && n !== `$!`) || e++;
        n = r;
      } while (n);
    }
    function ef(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var n = t;
        switch (((t = t.nextSibling), n.nodeName)) {
          case `HTML`:
          case `HEAD`:
          case `BODY`:
            (ef(n), bt(n));
            continue;
          case `SCRIPT`:
          case `STYLE`:
            continue;
          case `LINK`:
            if (n.rel.toLowerCase() === `stylesheet`) continue;
        }
        e.removeChild(n);
      }
    }
    function tf(e, t, n, r) {
      for (; e.nodeType === 1; ) {
        var i = n;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!r && (e.nodeName !== `INPUT` || e.type !== `hidden`)) break;
        } else if (!r)
          if (t === `input` && e.type === `hidden`) {
            var a = i.name == null ? null : `` + i.name;
            if (i.type === `hidden` && e.getAttribute(`name`) === a) return e;
          } else return e;
        else if (!e[yt])
          switch (t) {
            case `meta`:
              if (!e.hasAttribute(`itemprop`)) break;
              return e;
            case `link`:
              if (
                ((a = e.getAttribute(`rel`)),
                (a === `stylesheet` && e.hasAttribute(`data-precedence`)) ||
                  a !== i.rel ||
                  e.getAttribute(`href`) !==
                    (i.href == null || i.href === `` ? null : i.href) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin) ||
                  e.getAttribute(`title`) !==
                    (i.title == null ? null : i.title))
              )
                break;
              return e;
            case `style`:
              if (e.hasAttribute(`data-precedence`)) break;
              return e;
            case `script`:
              if (
                ((a = e.getAttribute(`src`)),
                (a !== (i.src == null ? null : i.src) ||
                  e.getAttribute(`type`) !== (i.type == null ? null : i.type) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin)) &&
                  a &&
                  e.hasAttribute(`async`) &&
                  !e.hasAttribute(`itemprop`))
              )
                break;
              return e;
            default:
              return e;
          }
        if (((e = cf(e.nextSibling)), e === null)) break;
      }
      return null;
    }
    function nf(e, t, n) {
      if (t === ``) return null;
      for (; e.nodeType !== 3; )
        if (
          ((e.nodeType !== 1 ||
            e.nodeName !== `INPUT` ||
            e.type !== `hidden`) &&
            !n) ||
          ((e = cf(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function rf(e, t) {
      for (; e.nodeType !== 8; )
        if (
          ((e.nodeType !== 1 ||
            e.nodeName !== `INPUT` ||
            e.type !== `hidden`) &&
            !t) ||
          ((e = cf(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function af(e) {
      return e.data === `$?` || e.data === `$~`;
    }
    function of(e) {
      return (
        e.data === `$!` ||
        (e.data === `$?` && e.ownerDocument.readyState !== `loading`)
      );
    }
    function sf(e, t) {
      var n = e.ownerDocument;
      if (e.data === `$~`) e._reactRetry = t;
      else if (e.data !== `$?` || n.readyState !== `loading`) t();
      else {
        var r = function () {
          (t(), n.removeEventListener(`DOMContentLoaded`, r));
        };
        (n.addEventListener(`DOMContentLoaded`, r), (e._reactRetry = r));
      }
    }
    function cf(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (
            ((t = e.data),
            t === `$` ||
              t === `$!` ||
              t === `$?` ||
              t === `$~` ||
              t === `&` ||
              t === `F!` ||
              t === `F`)
          )
            break;
          if (t === `/$` || t === `/&`) return null;
        }
      }
      return e;
    }
    var lf = null;
    function uf(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === `/$` || n === `/&`) {
            if (t === 0) return cf(e.nextSibling);
            t--;
          } else
            (n !== `$` &&
              n !== `$!` &&
              n !== `$?` &&
              n !== `$~` &&
              n !== `&`) ||
              t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function df(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (
            n === `$` ||
            n === `$!` ||
            n === `$?` ||
            n === `$~` ||
            n === `&`
          ) {
            if (t === 0) return e;
            t--;
          } else (n !== `/$` && n !== `/&`) || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function ff(e, t, n) {
      switch (((t = Bd(n)), e)) {
        case `html`:
          if (((e = t.documentElement), !e)) throw Error(i(452));
          return e;
        case `head`:
          if (((e = t.head), !e)) throw Error(i(453));
          return e;
        case `body`:
          if (((e = t.body), !e)) throw Error(i(454));
          return e;
        default:
          throw Error(i(451));
      }
    }
    function pf(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      bt(e);
    }
    var mf = new Map(),
      hf = new Set();
    function gf(e) {
      return typeof e.getRootNode == `function`
        ? e.getRootNode()
        : e.nodeType === 9
          ? e
          : e.ownerDocument;
    }
    var _f = D.d;
    D.d = { f: vf, r: yf, D: Sf, C: Cf, L: wf, m: Tf, X: Df, S: Ef, M: Of };
    function vf() {
      var e = _f.f(),
        t = bu();
      return e || t;
    }
    function yf(e) {
      var t = St(e);
      t !== null && t.tag === 5 && t.type === `form` ? Ds(t) : _f.r(e);
    }
    var bf = typeof document > `u` ? null : document;
    function xf(e, t, n) {
      var r = bf;
      if (r && typeof t == `string` && t) {
        var i = Ut(t);
        ((i = `link[rel="` + e + `"][href="` + i + `"]`),
          typeof n == `string` && (i += `[crossorigin="` + n + `"]`),
          hf.has(i) ||
            (hf.add(i),
            (e = { rel: e, crossOrigin: n, href: t }),
            r.querySelector(i) === null &&
              ((t = r.createElement(`link`)),
              Pd(t, `link`, e),
              Tt(t),
              r.head.appendChild(t))));
      }
    }
    function Sf(e) {
      (_f.D(e), xf(`dns-prefetch`, e, null));
    }
    function Cf(e, t) {
      (_f.C(e, t), xf(`preconnect`, e, t));
    }
    function wf(e, t, n) {
      _f.L(e, t, n);
      var r = bf;
      if (r && e && t) {
        var i = `link[rel="preload"][as="` + Ut(t) + `"]`;
        t === `image` && n && n.imageSrcSet
          ? ((i += `[imagesrcset="` + Ut(n.imageSrcSet) + `"]`),
            typeof n.imageSizes == `string` &&
              (i += `[imagesizes="` + Ut(n.imageSizes) + `"]`))
          : (i += `[href="` + Ut(e) + `"]`);
        var a = i;
        switch (t) {
          case `style`:
            a = Af(e);
            break;
          case `script`:
            a = Pf(e);
        }
        mf.has(a) ||
          ((e = h(
            {
              rel: `preload`,
              href: t === `image` && n && n.imageSrcSet ? void 0 : e,
              as: t,
            },
            n,
          )),
          mf.set(a, e),
          r.querySelector(i) !== null ||
            (t === `style` && r.querySelector(jf(a))) ||
            (t === `script` && r.querySelector(Ff(a))) ||
            ((t = r.createElement(`link`)),
            Pd(t, `link`, e),
            Tt(t),
            r.head.appendChild(t)));
      }
    }
    function Tf(e, t) {
      _f.m(e, t);
      var n = bf;
      if (n && e) {
        var r = t && typeof t.as == `string` ? t.as : `script`,
          i =
            `link[rel="modulepreload"][as="` +
            Ut(r) +
            `"][href="` +
            Ut(e) +
            `"]`,
          a = i;
        switch (r) {
          case `audioworklet`:
          case `paintworklet`:
          case `serviceworker`:
          case `sharedworker`:
          case `worker`:
          case `script`:
            a = Pf(e);
        }
        if (
          !mf.has(a) &&
          ((e = h({ rel: `modulepreload`, href: e }, t)),
          mf.set(a, e),
          n.querySelector(i) === null)
        ) {
          switch (r) {
            case `audioworklet`:
            case `paintworklet`:
            case `serviceworker`:
            case `sharedworker`:
            case `worker`:
            case `script`:
              if (n.querySelector(Ff(a))) return;
          }
          ((r = n.createElement(`link`)),
            Pd(r, `link`, e),
            Tt(r),
            n.head.appendChild(r));
        }
      }
    }
    function Ef(e, t, n) {
      _f.S(e, t, n);
      var r = bf;
      if (r && e) {
        var i = wt(r).hoistableStyles,
          a = Af(e);
        t ||= `default`;
        var o = i.get(a);
        if (!o) {
          var s = { loading: 0, preload: null };
          if ((o = r.querySelector(jf(a)))) s.loading = 5;
          else {
            ((e = h({ rel: `stylesheet`, href: e, "data-precedence": t }, n)),
              (n = mf.get(a)) && Rf(e, n));
            var c = (o = r.createElement(`link`));
            (Tt(c),
              Pd(c, `link`, e),
              (c._p = new Promise(function (e, t) {
                ((c.onload = e), (c.onerror = t));
              })),
              c.addEventListener(`load`, function () {
                s.loading |= 1;
              }),
              c.addEventListener(`error`, function () {
                s.loading |= 2;
              }),
              (s.loading |= 4),
              Lf(o, t, r));
          }
          ((o = { type: `stylesheet`, instance: o, count: 1, state: s }),
            i.set(a, o));
        }
      }
    }
    function Df(e, t) {
      _f.X(e, t);
      var n = bf;
      if (n && e) {
        var r = wt(n).hoistableScripts,
          i = Pf(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(Ff(i))),
          a ||
            ((e = h({ src: e, async: !0 }, t)),
            (t = mf.get(i)) && zf(e, t),
            (a = n.createElement(`script`)),
            Tt(a),
            Pd(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function Of(e, t) {
      _f.M(e, t);
      var n = bf;
      if (n && e) {
        var r = wt(n).hoistableScripts,
          i = Pf(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(Ff(i))),
          a ||
            ((e = h({ src: e, async: !0, type: `module` }, t)),
            (t = mf.get(i)) && zf(e, t),
            (a = n.createElement(`script`)),
            Tt(a),
            Pd(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function kf(e, t, n, r) {
      var a = (a = ge.current) ? gf(a) : null;
      if (!a) throw Error(i(446));
      switch (e) {
        case `meta`:
        case `title`:
          return null;
        case `style`:
          return typeof n.precedence == `string` && typeof n.href == `string`
            ? ((t = Af(n.href)),
              (n = wt(a).hoistableStyles),
              (r = n.get(t)),
              r ||
                ((r = { type: `style`, instance: null, count: 0, state: null }),
                n.set(t, r)),
              r)
            : { type: `void`, instance: null, count: 0, state: null };
        case `link`:
          if (
            n.rel === `stylesheet` &&
            typeof n.href == `string` &&
            typeof n.precedence == `string`
          ) {
            e = Af(n.href);
            var o = wt(a).hoistableStyles,
              s = o.get(e);
            if (
              (s ||
                ((a = a.ownerDocument || a),
                (s = {
                  type: `stylesheet`,
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                o.set(e, s),
                (o = a.querySelector(jf(e))) &&
                  !o._p &&
                  ((s.instance = o), (s.state.loading = 5)),
                mf.has(e) ||
                  ((n = {
                    rel: `preload`,
                    as: `style`,
                    href: n.href,
                    crossOrigin: n.crossOrigin,
                    integrity: n.integrity,
                    media: n.media,
                    hrefLang: n.hrefLang,
                    referrerPolicy: n.referrerPolicy,
                  }),
                  mf.set(e, n),
                  o || Nf(a, e, n, s.state))),
              t && r === null)
            )
              throw Error(i(528, ``));
            return s;
          }
          if (t && r !== null) throw Error(i(529, ``));
          return null;
        case `script`:
          return (
            (t = n.async),
            (n = n.src),
            typeof n == `string` &&
            t &&
            typeof t != `function` &&
            typeof t != `symbol`
              ? ((t = Pf(n)),
                (n = wt(a).hoistableScripts),
                (r = n.get(t)),
                r ||
                  ((r = {
                    type: `script`,
                    instance: null,
                    count: 0,
                    state: null,
                  }),
                  n.set(t, r)),
                r)
              : { type: `void`, instance: null, count: 0, state: null }
          );
        default:
          throw Error(i(444, e));
      }
    }
    function Af(e) {
      return `href="` + Ut(e) + `"`;
    }
    function jf(e) {
      return `link[rel="stylesheet"][` + e + `]`;
    }
    function Mf(e) {
      return h({}, e, { "data-precedence": e.precedence, precedence: null });
    }
    function Nf(e, t, n, r) {
      e.querySelector(`link[rel="preload"][as="style"][` + t + `]`)
        ? (r.loading = 1)
        : ((t = e.createElement(`link`)),
          (r.preload = t),
          t.addEventListener(`load`, function () {
            return (r.loading |= 1);
          }),
          t.addEventListener(`error`, function () {
            return (r.loading |= 2);
          }),
          Pd(t, `link`, n),
          Tt(t),
          e.head.appendChild(t));
    }
    function Pf(e) {
      return `[src="` + Ut(e) + `"]`;
    }
    function Ff(e) {
      return `script[async]` + e;
    }
    function If(e, t, n) {
      if ((t.count++, t.instance === null))
        switch (t.type) {
          case `style`:
            var r = e.querySelector(`style[data-href~="` + Ut(n.href) + `"]`);
            if (r) return ((t.instance = r), Tt(r), r);
            var a = h({}, n, {
              "data-href": n.href,
              "data-precedence": n.precedence,
              href: null,
              precedence: null,
            });
            return (
              (r = (e.ownerDocument || e).createElement(`style`)),
              Tt(r),
              Pd(r, `style`, a),
              Lf(r, n.precedence, e),
              (t.instance = r)
            );
          case `stylesheet`:
            a = Af(n.href);
            var o = e.querySelector(jf(a));
            if (o) return ((t.state.loading |= 4), (t.instance = o), Tt(o), o);
            ((r = Mf(n)),
              (a = mf.get(a)) && Rf(r, a),
              (o = (e.ownerDocument || e).createElement(`link`)),
              Tt(o));
            var s = o;
            return (
              (s._p = new Promise(function (e, t) {
                ((s.onload = e), (s.onerror = t));
              })),
              Pd(o, `link`, r),
              (t.state.loading |= 4),
              Lf(o, n.precedence, e),
              (t.instance = o)
            );
          case `script`:
            return (
              (o = Pf(n.src)),
              (a = e.querySelector(Ff(o)))
                ? ((t.instance = a), Tt(a), a)
                : ((r = n),
                  (a = mf.get(o)) && ((r = h({}, n)), zf(r, a)),
                  (e = e.ownerDocument || e),
                  (a = e.createElement(`script`)),
                  Tt(a),
                  Pd(a, `link`, r),
                  e.head.appendChild(a),
                  (t.instance = a))
            );
          case `void`:
            return null;
          default:
            throw Error(i(443, t.type));
        }
      else
        t.type === `stylesheet` &&
          !(t.state.loading & 4) &&
          ((r = t.instance), (t.state.loading |= 4), Lf(r, n.precedence, e));
      return t.instance;
    }
    function Lf(e, t, n) {
      for (
        var r = n.querySelectorAll(
            `link[rel="stylesheet"][data-precedence],style[data-precedence]`,
          ),
          i = r.length ? r[r.length - 1] : null,
          a = i,
          o = 0;
        o < r.length;
        o++
      ) {
        var s = r[o];
        if (s.dataset.precedence === t) a = s;
        else if (a !== i) break;
      }
      a
        ? a.parentNode.insertBefore(e, a.nextSibling)
        : ((t = n.nodeType === 9 ? n.head : n),
          t.insertBefore(e, t.firstChild));
    }
    function Rf(e, t) {
      ((e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.title ??= t.title));
    }
    function zf(e, t) {
      ((e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.integrity ??= t.integrity));
    }
    var Bf = null;
    function Vf(e, t, n) {
      if (Bf === null) {
        var r = new Map(),
          i = (Bf = new Map());
        i.set(n, r);
      } else ((i = Bf), (r = i.get(n)), r || ((r = new Map()), i.set(n, r)));
      if (r.has(e)) return r;
      for (
        r.set(e, null), n = n.getElementsByTagName(e), i = 0;
        i < n.length;
        i++
      ) {
        var a = n[i];
        if (
          !(
            a[yt] ||
            a[ft] ||
            (e === `link` && a.getAttribute(`rel`) === `stylesheet`)
          ) &&
          a.namespaceURI !== `http://www.w3.org/2000/svg`
        ) {
          var o = a.getAttribute(t) || ``;
          o = e + o;
          var s = r.get(o);
          s ? s.push(a) : r.set(o, [a]);
        }
      }
      return r;
    }
    function Hf(e, t, n) {
      ((e = e.ownerDocument || e),
        e.head.insertBefore(
          n,
          t === `title` ? e.querySelector(`head > title`) : null,
        ));
    }
    function Uf(e, t, n) {
      if (n === 1 || t.itemProp != null) return !1;
      switch (e) {
        case `meta`:
        case `title`:
          return !0;
        case `style`:
          if (
            typeof t.precedence != `string` ||
            typeof t.href != `string` ||
            t.href === ``
          )
            break;
          return !0;
        case `link`:
          if (
            typeof t.rel != `string` ||
            typeof t.href != `string` ||
            t.href === `` ||
            t.onLoad ||
            t.onError
          )
            break;
          switch (t.rel) {
            case `stylesheet`:
              return (
                (e = t.disabled),
                typeof t.precedence == `string` && e == null
              );
            default:
              return !0;
          }
        case `script`:
          if (
            t.async &&
            typeof t.async != `function` &&
            typeof t.async != `symbol` &&
            !t.onLoad &&
            !t.onError &&
            t.src &&
            typeof t.src == `string`
          )
            return !0;
      }
      return !1;
    }
    function Wf(e) {
      return !(e.type === `stylesheet` && !(e.state.loading & 3));
    }
    function Gf(e, t, n, r) {
      if (
        n.type === `stylesheet` &&
        (typeof r.media != `string` || !1 !== matchMedia(r.media).matches) &&
        !(n.state.loading & 4)
      ) {
        if (n.instance === null) {
          var i = Af(r.href),
            a = t.querySelector(jf(i));
          if (a) {
            ((t = a._p),
              typeof t == `object` &&
                t &&
                typeof t.then == `function` &&
                (e.count++, (e = Jf.bind(e)), t.then(e, e)),
              (n.state.loading |= 4),
              (n.instance = a),
              Tt(a));
            return;
          }
          ((a = t.ownerDocument || t),
            (r = Mf(r)),
            (i = mf.get(i)) && Rf(r, i),
            (a = a.createElement(`link`)),
            Tt(a));
          var o = a;
          ((o._p = new Promise(function (e, t) {
            ((o.onload = e), (o.onerror = t));
          })),
            Pd(a, `link`, r),
            (n.instance = a));
        }
        (e.stylesheets === null && (e.stylesheets = new Map()),
          e.stylesheets.set(n, t),
          (t = n.state.preload) &&
            !(n.state.loading & 3) &&
            (e.count++,
            (n = Jf.bind(e)),
            t.addEventListener(`load`, n),
            t.addEventListener(`error`, n)));
      }
    }
    var Kf = 0;
    function qf(e, t) {
      return (
        e.stylesheets && e.count === 0 && Xf(e, e.stylesheets),
        0 < e.count || 0 < e.imgCount
          ? function (n) {
              var r = setTimeout(function () {
                if ((e.stylesheets && Xf(e, e.stylesheets), e.unsuspend)) {
                  var t = e.unsuspend;
                  ((e.unsuspend = null), t());
                }
              }, 6e4 + t);
              0 < e.imgBytes && Kf === 0 && (Kf = 62500 * Ld());
              var i = setTimeout(
                function () {
                  if (
                    ((e.waitingForImages = !1),
                    e.count === 0 &&
                      (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend))
                  ) {
                    var t = e.unsuspend;
                    ((e.unsuspend = null), t());
                  }
                },
                (e.imgBytes > Kf ? 50 : 800) + t,
              );
              return (
                (e.unsuspend = n),
                function () {
                  ((e.unsuspend = null), clearTimeout(r), clearTimeout(i));
                }
              );
            }
          : null
      );
    }
    function Jf() {
      if (
        (this.count--,
        this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
      ) {
        if (this.stylesheets) Xf(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          ((this.unsuspend = null), e());
        }
      }
    }
    var Yf = null;
    function Xf(e, t) {
      ((e.stylesheets = null),
        e.unsuspend !== null &&
          (e.count++,
          (Yf = new Map()),
          t.forEach(Zf, e),
          (Yf = null),
          Jf.call(e)));
    }
    function Zf(e, t) {
      if (!(t.state.loading & 4)) {
        var n = Yf.get(e);
        if (n) var r = n.get(null);
        else {
          ((n = new Map()), Yf.set(e, n));
          for (
            var i = e.querySelectorAll(
                `link[data-precedence],style[data-precedence]`,
              ),
              a = 0;
            a < i.length;
            a++
          ) {
            var o = i[a];
            (o.nodeName === `LINK` || o.getAttribute(`media`) !== `not all`) &&
              (n.set(o.dataset.precedence, o), (r = o));
          }
          r && n.set(null, r);
        }
        ((i = t.instance),
          (o = i.getAttribute(`data-precedence`)),
          (a = n.get(o) || r),
          a === r && n.set(null, i),
          n.set(o, i),
          this.count++,
          (r = Jf.bind(this)),
          i.addEventListener(`load`, r),
          i.addEventListener(`error`, r),
          a
            ? a.parentNode.insertBefore(i, a.nextSibling)
            : ((e = e.nodeType === 9 ? e.head : e),
              e.insertBefore(i, e.firstChild)),
          (t.state.loading |= 4));
      }
    }
    var Qf = {
      $$typeof: C,
      Provider: null,
      Consumer: null,
      _currentValue: ue,
      _currentValue2: ue,
      _threadCount: 0,
    };
    function $f(e, t, n, r, i, a, o, s, c) {
      ((this.tag = 1),
        (this.containerInfo = e),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = nt(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = nt(0)),
        (this.hiddenUpdates = nt(null)),
        (this.identifierPrefix = r),
        (this.onUncaughtError = i),
        (this.onCaughtError = a),
        (this.onRecoverableError = o),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = c),
        (this.incompleteTransitions = new Map()));
    }
    function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
      return (
        (e = new $f(e, t, n, o, c, l, u, d, s)),
        (t = 1),
        !0 === a && (t |= 24),
        (a = di(3, null, null, t)),
        (e.current = a),
        (a.stateNode = e),
        (t = ua()),
        t.refCount++,
        (e.pooledCache = t),
        t.refCount++,
        (a.memoizedState = { element: r, isDehydrated: n, cache: t }),
        Ua(a),
        e
      );
    }
    function tp(e) {
      return e ? ((e = li), e) : li;
    }
    function np(e, t, n, r, i, a) {
      ((i = tp(i)),
        r.context === null ? (r.context = i) : (r.pendingContext = i),
        (r = Ga(t)),
        (r.payload = { element: n }),
        (a = a === void 0 ? null : a),
        a !== null && (r.callback = a),
        (n = Ka(e, r, t)),
        n !== null && (hu(n, e, t), qa(n, e, t)));
    }
    function rp(e, t) {
      if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var n = e.retryLane;
        e.retryLane = n !== 0 && n < t ? n : t;
      }
    }
    function ip(e, t) {
      (rp(e, t), (e = e.alternate) && rp(e, t));
    }
    function ap(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = oi(e, 67108864);
        (t !== null && hu(t, e, 67108864), ip(e, 67108864));
      }
    }
    function op(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = pu();
        t = M(t);
        var n = oi(e, t);
        (n !== null && hu(n, e, t), ip(e, t));
      }
    }
    var sp = !0;
    function cp(e, t, n, r) {
      var i = E.T;
      E.T = null;
      var a = D.p;
      try {
        ((D.p = 2), up(e, t, n, r));
      } finally {
        ((D.p = a), (E.T = i));
      }
    }
    function lp(e, t, n, r) {
      var i = E.T;
      E.T = null;
      var a = D.p;
      try {
        ((D.p = 8), up(e, t, n, r));
      } finally {
        ((D.p = a), (E.T = i));
      }
    }
    function up(e, t, n, r) {
      if (sp) {
        var i = dp(r);
        if (i === null) (wd(e, t, r, fp, n), Cp(e, r));
        else if (Tp(i, e, t, n, r)) r.stopPropagation();
        else if ((Cp(e, r), t & 4 && -1 < Sp.indexOf(e))) {
          for (; i !== null; ) {
            var a = St(i);
            if (a !== null)
              switch (a.tag) {
                case 3:
                  if (
                    ((a = a.stateNode), a.current.memoizedState.isDehydrated)
                  ) {
                    var o = Ze(a.pendingLanes);
                    if (o !== 0) {
                      var s = a;
                      for (s.pendingLanes |= 2, s.entangledLanes |= 2; o; ) {
                        var c = 1 << (31 - j(o));
                        ((s.entanglements[1] |= c), (o &= ~c));
                      }
                      (rd(a), !(G & 6) && ((tu = Pe() + 500), id(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((s = oi(a, 2)), s !== null && hu(s, a, 2), bu(), ip(a, 2));
              }
            if (((a = dp(r)), a === null && wd(e, t, r, fp, n), a === i)) break;
            i = a;
          }
          i !== null && r.stopPropagation();
        } else wd(e, t, r, null, n);
      }
    }
    function dp(e) {
      return ((e = on(e)), pp(e));
    }
    var fp = null;
    function pp(e) {
      if (((fp = null), (e = xt(e)), e !== null)) {
        var t = o(e);
        if (t === null) e = null;
        else {
          var n = t.tag;
          if (n === 13) {
            if (((e = s(t)), e !== null)) return e;
            e = null;
          } else if (n === 31) {
            if (((e = c(t)), e !== null)) return e;
            e = null;
          } else if (n === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return ((fp = e), null);
    }
    function mp(e) {
      switch (e) {
        case `beforetoggle`:
        case `cancel`:
        case `click`:
        case `close`:
        case `contextmenu`:
        case `copy`:
        case `cut`:
        case `auxclick`:
        case `dblclick`:
        case `dragend`:
        case `dragstart`:
        case `drop`:
        case `focusin`:
        case `focusout`:
        case `input`:
        case `invalid`:
        case `keydown`:
        case `keypress`:
        case `keyup`:
        case `mousedown`:
        case `mouseup`:
        case `paste`:
        case `pause`:
        case `play`:
        case `pointercancel`:
        case `pointerdown`:
        case `pointerup`:
        case `ratechange`:
        case `reset`:
        case `resize`:
        case `seeked`:
        case `submit`:
        case `toggle`:
        case `touchcancel`:
        case `touchend`:
        case `touchstart`:
        case `volumechange`:
        case `change`:
        case `selectionchange`:
        case `textInput`:
        case `compositionstart`:
        case `compositionend`:
        case `compositionupdate`:
        case `beforeblur`:
        case `afterblur`:
        case `beforeinput`:
        case `blur`:
        case `fullscreenchange`:
        case `focus`:
        case `hashchange`:
        case `popstate`:
        case `select`:
        case `selectstart`:
          return 2;
        case `drag`:
        case `dragenter`:
        case `dragexit`:
        case `dragleave`:
        case `dragover`:
        case `mousemove`:
        case `mouseout`:
        case `mouseover`:
        case `pointermove`:
        case `pointerout`:
        case `pointerover`:
        case `scroll`:
        case `touchmove`:
        case `wheel`:
        case `mouseenter`:
        case `mouseleave`:
        case `pointerenter`:
        case `pointerleave`:
          return 8;
        case `message`:
          switch (Fe()) {
            case Ie:
              return 2;
            case Le:
              return 8;
            case A:
            case Re:
              return 32;
            case ze:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var hp = !1,
      gp = null,
      _p = null,
      vp = null,
      yp = new Map(),
      bp = new Map(),
      xp = [],
      Sp =
        `mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(
          ` `,
        );
    function Cp(e, t) {
      switch (e) {
        case `focusin`:
        case `focusout`:
          gp = null;
          break;
        case `dragenter`:
        case `dragleave`:
          _p = null;
          break;
        case `mouseover`:
        case `mouseout`:
          vp = null;
          break;
        case `pointerover`:
        case `pointerout`:
          yp.delete(t.pointerId);
          break;
        case `gotpointercapture`:
        case `lostpointercapture`:
          bp.delete(t.pointerId);
      }
    }
    function wp(e, t, n, r, i, a) {
      return e === null || e.nativeEvent !== a
        ? ((e = {
            blockedOn: t,
            domEventName: n,
            eventSystemFlags: r,
            nativeEvent: a,
            targetContainers: [i],
          }),
          t !== null && ((t = St(t)), t !== null && ap(t)),
          e)
        : ((e.eventSystemFlags |= r),
          (t = e.targetContainers),
          i !== null && t.indexOf(i) === -1 && t.push(i),
          e);
    }
    function Tp(e, t, n, r, i) {
      switch (t) {
        case `focusin`:
          return ((gp = wp(gp, e, t, n, r, i)), !0);
        case `dragenter`:
          return ((_p = wp(_p, e, t, n, r, i)), !0);
        case `mouseover`:
          return ((vp = wp(vp, e, t, n, r, i)), !0);
        case `pointerover`:
          var a = i.pointerId;
          return (yp.set(a, wp(yp.get(a) || null, e, t, n, r, i)), !0);
        case `gotpointercapture`:
          return (
            (a = i.pointerId),
            bp.set(a, wp(bp.get(a) || null, e, t, n, r, i)),
            !0
          );
      }
      return !1;
    }
    function Ep(e) {
      var t = xt(e.target);
      if (t !== null) {
        var n = o(t);
        if (n !== null) {
          if (((t = n.tag), t === 13)) {
            if (((t = s(n)), t !== null)) {
              ((e.blockedOn = t),
                ut(e.priority, function () {
                  op(n);
                }));
              return;
            }
          } else if (t === 31) {
            if (((t = c(n)), t !== null)) {
              ((e.blockedOn = t),
                ut(e.priority, function () {
                  op(n);
                }));
              return;
            }
          } else if (
            t === 3 &&
            n.stateNode.current.memoizedState.isDehydrated
          ) {
            e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function Dp(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var n = dp(e.nativeEvent);
        if (n === null) {
          n = e.nativeEvent;
          var r = new n.constructor(n.type, n);
          ((an = r), n.target.dispatchEvent(r), (an = null));
        } else return ((t = St(n)), t !== null && ap(t), (e.blockedOn = n), !1);
        t.shift();
      }
      return !0;
    }
    function Op(e, t, n) {
      Dp(e) && n.delete(t);
    }
    function kp() {
      ((hp = !1),
        gp !== null && Dp(gp) && (gp = null),
        _p !== null && Dp(_p) && (_p = null),
        vp !== null && Dp(vp) && (vp = null),
        yp.forEach(Op),
        bp.forEach(Op));
    }
    function Ap(e, n) {
      e.blockedOn === n &&
        ((e.blockedOn = null),
        hp ||
          ((hp = !0),
          t.unstable_scheduleCallback(t.unstable_NormalPriority, kp)));
    }
    var jp = null;
    function Mp(e) {
      jp !== e &&
        ((jp = e),
        t.unstable_scheduleCallback(t.unstable_NormalPriority, function () {
          jp === e && (jp = null);
          for (var t = 0; t < e.length; t += 3) {
            var n = e[t],
              r = e[t + 1],
              i = e[t + 2];
            if (typeof r != `function`) {
              if (pp(r || n) === null) continue;
              break;
            }
            var a = St(n);
            a !== null &&
              (e.splice(t, 3),
              (t -= 3),
              Ts(
                a,
                { pending: !0, data: i, method: n.method, action: r },
                r,
                i,
              ));
          }
        }));
    }
    function Np(e) {
      function t(t) {
        return Ap(t, e);
      }
      (gp !== null && Ap(gp, e),
        _p !== null && Ap(_p, e),
        vp !== null && Ap(vp, e),
        yp.forEach(t),
        bp.forEach(t));
      for (var n = 0; n < xp.length; n++) {
        var r = xp[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
      for (; 0 < xp.length && ((n = xp[0]), n.blockedOn === null); )
        (Ep(n), n.blockedOn === null && xp.shift());
      if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
        for (r = 0; r < n.length; r += 3) {
          var i = n[r],
            a = n[r + 1],
            o = i[pt] || null;
          if (typeof a == `function`) o || Mp(n);
          else if (o) {
            var s = null;
            if (a && a.hasAttribute(`formAction`)) {
              if (((i = a), (o = a[pt] || null))) s = o.formAction;
              else if (pp(i) !== null) continue;
            } else s = o.action;
            (typeof s == `function`
              ? (n[r + 1] = s)
              : (n.splice(r, 3), (r -= 3)),
              Mp(n));
          }
        }
    }
    function Pp() {
      function e(e) {
        e.canIntercept &&
          e.info === `react-transition` &&
          e.intercept({
            handler: function () {
              return new Promise(function (e) {
                return (i = e);
              });
            },
            focusReset: `manual`,
            scroll: `manual`,
          });
      }
      function t() {
        (i !== null && (i(), (i = null)), r || setTimeout(n, 20));
      }
      function n() {
        if (!r && !navigation.transition) {
          var e = navigation.currentEntry;
          e &&
            e.url != null &&
            navigation.navigate(e.url, {
              state: e.getState(),
              info: `react-transition`,
              history: `replace`,
            });
        }
      }
      if (typeof navigation == `object`) {
        var r = !1,
          i = null;
        return (
          navigation.addEventListener(`navigate`, e),
          navigation.addEventListener(`navigatesuccess`, t),
          navigation.addEventListener(`navigateerror`, t),
          setTimeout(n, 100),
          function () {
            ((r = !0),
              navigation.removeEventListener(`navigate`, e),
              navigation.removeEventListener(`navigatesuccess`, t),
              navigation.removeEventListener(`navigateerror`, t),
              i !== null && (i(), (i = null)));
          }
        );
      }
    }
    function Fp(e) {
      this._internalRoot = e;
    }
    ((Ip.prototype.render = Fp.prototype.render =
      function (e) {
        var t = this._internalRoot;
        if (t === null) throw Error(i(409));
        var n = t.current;
        np(n, pu(), e, t, null, null);
      }),
      (Ip.prototype.unmount = Fp.prototype.unmount =
        function () {
          var e = this._internalRoot;
          if (e !== null) {
            this._internalRoot = null;
            var t = e.containerInfo;
            (np(e.current, 2, null, e, null, null), bu(), (t[mt] = null));
          }
        }));
    function Ip(e) {
      this._internalRoot = e;
    }
    Ip.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = lt();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < xp.length && t !== 0 && t < xp[n].priority; n++);
        (xp.splice(n, 0, e), n === 0 && Ep(e));
      }
    };
    var Lp = n.version;
    if (Lp !== `19.2.5`) throw Error(i(527, Lp, `19.2.5`));
    D.findDOMNode = function (e) {
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == `function`
          ? Error(i(188))
          : ((e = Object.keys(e).join(`,`)), Error(i(268, e)));
      return (
        (e = d(t)),
        (e = e === null ? null : p(e)),
        (e = e === null ? null : e.stateNode),
        e
      );
    };
    var Rp = {
      bundleType: 0,
      version: `19.2.5`,
      rendererPackageName: `react-dom`,
      currentDispatcherRef: E,
      reconcilerVersion: `19.2.5`,
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u`) {
      var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!zp.isDisabled && zp.supportsFiber)
        try {
          ((He = zp.inject(Rp)), (Ue = zp));
        } catch {}
    }
    e.createRoot = function (e, t) {
      if (!a(e)) throw Error(i(299));
      var n = !1,
        r = ``,
        o = Js,
        s = Ys,
        c = Xs;
      return (
        t != null &&
          (!0 === t.unstable_strictMode && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
          t.onCaughtError !== void 0 && (s = t.onCaughtError),
          t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
        (t = ep(e, 1, !1, null, null, n, r, null, o, s, c, Pp)),
        (e[mt] = t.current),
        Sd(e),
        new Fp(t)
      );
    };
  }),
  g = o((e, t) => {
    function n() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = h()));
  }),
  _ = c(u()),
  v = g(),
  y = (e) => typeof e == `string`,
  b = () => {
    let e,
      t,
      n = new Promise((n, r) => {
        ((e = n), (t = r));
      });
    return ((n.resolve = e), (n.reject = t), n);
  },
  x = (e) => (e == null ? `` : String(e)),
  S = (e, t, n) => {
    e.forEach((e) => {
      t[e] && (n[e] = t[e]);
    });
  },
  C = /###/g,
  w = (e) => (e && e.includes(`###`) ? e.replace(C, `.`) : e),
  ee = (e) => !e || y(e),
  T = (e, t, n) => {
    let r = y(t) ? t.split(`.`) : t,
      i = 0;
    for (; i < r.length - 1; ) {
      if (ee(e)) return {};
      let t = w(r[i]);
      (!e[t] && n && (e[t] = new n()),
        (e = Object.prototype.hasOwnProperty.call(e, t) ? e[t] : {}),
        ++i);
    }
    return ee(e) ? {} : { obj: e, k: w(r[i]) };
  },
  te = (e, t, n) => {
    let { obj: r, k: i } = T(e, t, Object);
    if (r !== void 0 || t.length === 1) {
      r[i] = n;
      return;
    }
    let a = t[t.length - 1],
      o = t.slice(0, t.length - 1),
      s = T(e, o, Object);
    for (; s.obj === void 0 && o.length; )
      ((a = `${o[o.length - 1]}.${a}`),
        (o = o.slice(0, o.length - 1)),
        (s = T(e, o, Object)),
        s?.obj && s.obj[`${s.k}.${a}`] !== void 0 && (s.obj = void 0));
    s.obj[`${s.k}.${a}`] = n;
  },
  ne = (e, t, n, r) => {
    let { obj: i, k: a } = T(e, t, Object);
    ((i[a] = i[a] || []), i[a].push(n));
  },
  re = (e, t) => {
    let { obj: n, k: r } = T(e, t);
    if (n && Object.prototype.hasOwnProperty.call(n, r)) return n[r];
  },
  ie = (e, t, n) => {
    let r = re(e, n);
    return r === void 0 ? re(t, n) : r;
  },
  ae = (e, t, n) => {
    for (let r in t)
      r !== `__proto__` &&
        r !== `constructor` &&
        (r in e
          ? y(e[r]) ||
            e[r] instanceof String ||
            y(t[r]) ||
            t[r] instanceof String
            ? n && (e[r] = t[r])
            : ae(e[r], t[r], n)
          : (e[r] = t[r]));
    return e;
  },
  oe = (e) => e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, `\\$&`),
  se = {
    "&": `&amp;`,
    "<": `&lt;`,
    ">": `&gt;`,
    '"': `&quot;`,
    "'": `&#39;`,
    "/": `&#x2F;`,
  },
  ce = (e) => (y(e) ? e.replace(/[&<>"'\/]/g, (e) => se[e]) : e),
  le = class {
    constructor(e) {
      ((this.capacity = e),
        (this.regExpMap = new Map()),
        (this.regExpQueue = []));
    }
    getRegExp(e) {
      let t = this.regExpMap.get(e);
      if (t !== void 0) return t;
      let n = new RegExp(e);
      return (
        this.regExpQueue.length === this.capacity &&
          this.regExpMap.delete(this.regExpQueue.shift()),
        this.regExpMap.set(e, n),
        this.regExpQueue.push(e),
        n
      );
    }
  },
  E = [` `, `,`, `?`, `!`, `;`],
  D = new le(20),
  ue = (e, t, n) => {
    ((t ||= ``), (n ||= ``));
    let r = E.filter((e) => !t.includes(e) && !n.includes(e));
    if (r.length === 0) return !0;
    let i = D.getRegExp(`(${r.map((e) => (e === `?` ? `\\?` : e)).join(`|`)})`),
      a = !i.test(e);
    if (!a) {
      let t = e.indexOf(n);
      t > 0 && !i.test(e.substring(0, t)) && (a = !0);
    }
    return a;
  },
  de = (e, t, n = `.`) => {
    if (!e) return;
    if (e[t]) return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0;
    let r = t.split(n),
      i = e;
    for (let e = 0; e < r.length; ) {
      if (!i || typeof i != `object`) return;
      let t,
        a = ``;
      for (let o = e; o < r.length; ++o)
        if ((o !== e && (a += n), (a += r[o]), (t = i[a]), t !== void 0)) {
          if (
            [`string`, `number`, `boolean`].includes(typeof t) &&
            o < r.length - 1
          )
            continue;
          e += o - e + 1;
          break;
        }
      i = t;
    }
    return i;
  },
  fe = (e) => e?.replace(/_/g, `-`),
  pe = {
    type: `logger`,
    log(e) {
      this.output(`log`, e);
    },
    warn(e) {
      this.output(`warn`, e);
    },
    error(e) {
      this.output(`error`, e);
    },
    output(e, t) {
      console?.[e]?.apply?.(console, t);
    },
  },
  O = new (class e {
    constructor(e, t = {}) {
      this.init(e, t);
    }
    init(e, t = {}) {
      ((this.prefix = t.prefix || `i18next:`),
        (this.logger = e || pe),
        (this.options = t),
        (this.debug = t.debug));
    }
    log(...e) {
      return this.forward(e, `log`, ``, !0);
    }
    warn(...e) {
      return this.forward(e, `warn`, ``, !0);
    }
    error(...e) {
      return this.forward(e, `error`, ``);
    }
    deprecate(...e) {
      return this.forward(e, `warn`, `WARNING DEPRECATED: `, !0);
    }
    forward(e, t, n, r) {
      return r && !this.debug
        ? null
        : (y(e[0]) && (e[0] = `${n}${this.prefix} ${e[0]}`), this.logger[t](e));
    }
    create(t) {
      return new e(this.logger, {
        prefix: `${this.prefix}:${t}:`,
        ...this.options,
      });
    }
    clone(t) {
      return (
        (t ||= this.options),
        (t.prefix = t.prefix || this.prefix),
        new e(this.logger, t)
      );
    }
  })(),
  k = class {
    constructor() {
      this.observers = {};
    }
    on(e, t) {
      return (
        e.split(` `).forEach((e) => {
          this.observers[e] || (this.observers[e] = new Map());
          let n = this.observers[e].get(t) || 0;
          this.observers[e].set(t, n + 1);
        }),
        this
      );
    }
    off(e, t) {
      if (this.observers[e]) {
        if (!t) {
          delete this.observers[e];
          return;
        }
        this.observers[e].delete(t);
      }
    }
    once(e, t) {
      let n = (...r) => {
        (t(...r), this.off(e, n));
      };
      return (this.on(e, n), this);
    }
    emit(e, ...t) {
      (this.observers[e] &&
        Array.from(this.observers[e].entries()).forEach(([e, n]) => {
          for (let r = 0; r < n; r++) e(...t);
        }),
        this.observers[`*`] &&
          Array.from(this.observers[`*`].entries()).forEach(([n, r]) => {
            for (let i = 0; i < r; i++) n(e, ...t);
          }));
    }
  },
  me = class extends k {
    constructor(e, t = { ns: [`translation`], defaultNS: `translation` }) {
      (super(),
        (this.data = e || {}),
        (this.options = t),
        this.options.keySeparator === void 0 &&
          (this.options.keySeparator = `.`),
        this.options.ignoreJSONStructure === void 0 &&
          (this.options.ignoreJSONStructure = !0));
    }
    addNamespaces(e) {
      this.options.ns.includes(e) || this.options.ns.push(e);
    }
    removeNamespaces(e) {
      let t = this.options.ns.indexOf(e);
      t > -1 && this.options.ns.splice(t, 1);
    }
    getResource(e, t, n, r = {}) {
      let i =
          r.keySeparator === void 0
            ? this.options.keySeparator
            : r.keySeparator,
        a =
          r.ignoreJSONStructure === void 0
            ? this.options.ignoreJSONStructure
            : r.ignoreJSONStructure,
        o;
      e.includes(`.`)
        ? (o = e.split(`.`))
        : ((o = [e, t]),
          n &&
            (Array.isArray(n)
              ? o.push(...n)
              : y(n) && i
                ? o.push(...n.split(i))
                : o.push(n)));
      let s = re(this.data, o);
      return (
        !s &&
          !t &&
          !n &&
          e.includes(`.`) &&
          ((e = o[0]), (t = o[1]), (n = o.slice(2).join(`.`))),
        s || !a || !y(n) ? s : de(this.data?.[e]?.[t], n, i)
      );
    }
    addResource(e, t, n, r, i = { silent: !1 }) {
      let a =
          i.keySeparator === void 0
            ? this.options.keySeparator
            : i.keySeparator,
        o = [e, t];
      (n && (o = o.concat(a ? n.split(a) : n)),
        e.includes(`.`) && ((o = e.split(`.`)), (r = t), (t = o[1])),
        this.addNamespaces(t),
        te(this.data, o, r),
        i.silent || this.emit(`added`, e, t, n, r));
    }
    addResources(e, t, n, r = { silent: !1 }) {
      for (let r in n)
        (y(n[r]) || Array.isArray(n[r])) &&
          this.addResource(e, t, r, n[r], { silent: !0 });
      r.silent || this.emit(`added`, e, t, n);
    }
    addResourceBundle(e, t, n, r, i, a = { silent: !1, skipCopy: !1 }) {
      let o = [e, t];
      (e.includes(`.`) && ((o = e.split(`.`)), (r = n), (n = t), (t = o[1])),
        this.addNamespaces(t));
      let s = re(this.data, o) || {};
      (a.skipCopy || (n = JSON.parse(JSON.stringify(n))),
        r ? ae(s, n, i) : (s = { ...s, ...n }),
        te(this.data, o, s),
        a.silent || this.emit(`added`, e, t, n));
    }
    removeResourceBundle(e, t) {
      (this.hasResourceBundle(e, t) && delete this.data[e][t],
        this.removeNamespaces(t),
        this.emit(`removed`, e, t));
    }
    hasResourceBundle(e, t) {
      return this.getResource(e, t) !== void 0;
    }
    getResourceBundle(e, t) {
      return ((t ||= this.options.defaultNS), this.getResource(e, t));
    }
    getDataByLanguage(e) {
      return this.data[e];
    }
    hasLanguageSomeTranslations(e) {
      let t = this.getDataByLanguage(e);
      return !!((t && Object.keys(t)) || []).find(
        (e) => t[e] && Object.keys(t[e]).length > 0,
      );
    }
    toJSON() {
      return this.data;
    }
  },
  he = {
    processors: {},
    addPostProcessor(e) {
      this.processors[e.name] = e;
    },
    handle(e, t, n, r, i) {
      return (
        e.forEach((e) => {
          t = this.processors[e]?.process(t, n, r, i) ?? t;
        }),
        t
      );
    },
  },
  ge = Symbol(`i18next/PATH_KEY`);
function _e() {
  let e = [],
    t = Object.create(null),
    n;
  return (
    (t.get = (r, i) => (
      n?.revoke?.(),
      i === ge ? e : (e.push(i), (n = Proxy.revocable(r, t)), n.proxy)
    )),
    Proxy.revocable(Object.create(null), t).proxy
  );
}
function ve(e, t) {
  let { [ge]: n } = e(_e()),
    r = t?.keySeparator ?? `.`,
    i = t?.nsSeparator ?? `:`;
  if (n.length > 1 && i) {
    let e = t?.ns,
      a = Array.isArray(e) ? e : null;
    if (a && a.length > 1 && a.slice(1).includes(n[0]))
      return `${n[0]}${i}${n.slice(1).join(r)}`;
  }
  return n.join(r);
}
var ye = (e) => !y(e) && typeof e != `boolean` && typeof e != `number`,
  be = class e extends k {
    constructor(e, t = {}) {
      (super(),
        S(
          [
            `resourceStore`,
            `languageUtils`,
            `pluralResolver`,
            `interpolator`,
            `backendConnector`,
            `i18nFormat`,
            `utils`,
          ],
          e,
          this,
        ),
        (this.options = t),
        this.options.keySeparator === void 0 &&
          (this.options.keySeparator = `.`),
        (this.logger = O.create(`translator`)),
        (this.checkedLoadedFor = {}));
    }
    changeLanguage(e) {
      e && (this.language = e);
    }
    exists(e, t = { interpolation: {} }) {
      let n = { ...t };
      if (e == null) return !1;
      let r = this.resolve(e, n);
      if (r?.res === void 0) return !1;
      let i = ye(r.res);
      return !(n.returnObjects === !1 && i);
    }
    extractFromKey(e, t) {
      let n =
        t.nsSeparator === void 0 ? this.options.nsSeparator : t.nsSeparator;
      n === void 0 && (n = `:`);
      let r =
          t.keySeparator === void 0
            ? this.options.keySeparator
            : t.keySeparator,
        i = t.ns || this.options.defaultNS || [],
        a = n && e.includes(n),
        o =
          !this.options.userDefinedKeySeparator &&
          !t.keySeparator &&
          !this.options.userDefinedNsSeparator &&
          !t.nsSeparator &&
          !ue(e, n, r);
      if (a && !o) {
        let t = e.match(this.interpolator.nestingRegexp);
        if (t && t.length > 0) return { key: e, namespaces: y(i) ? [i] : i };
        let a = e.split(n);
        ((n !== r || (n === r && this.options.ns.includes(a[0]))) &&
          (i = a.shift()),
          (e = a.join(r)));
      }
      return { key: e, namespaces: y(i) ? [i] : i };
    }
    translate(t, n, r) {
      let i = typeof n == `object` ? { ...n } : n;
      if (
        (typeof i != `object` &&
          this.options.overloadTranslationOptionHandler &&
          (i = this.options.overloadTranslationOptionHandler(arguments)),
        typeof i == `object` && (i = { ...i }),
        (i ||= {}),
        t == null)
      )
        return ``;
      (typeof t == `function` && (t = ve(t, { ...this.options, ...i })),
        Array.isArray(t) || (t = [String(t)]),
        (t = t.map((e) =>
          typeof e == `function` ? ve(e, { ...this.options, ...i }) : String(e),
        )));
      let a =
          i.returnDetails === void 0
            ? this.options.returnDetails
            : i.returnDetails,
        o =
          i.keySeparator === void 0
            ? this.options.keySeparator
            : i.keySeparator,
        { key: s, namespaces: c } = this.extractFromKey(t[t.length - 1], i),
        l = c[c.length - 1],
        u = i.nsSeparator === void 0 ? this.options.nsSeparator : i.nsSeparator;
      u === void 0 && (u = `:`);
      let d = i.lng || this.language,
        f = i.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
      if (d?.toLowerCase() === `cimode`)
        return f
          ? a
            ? {
                res: `${l}${u}${s}`,
                usedKey: s,
                exactUsedKey: s,
                usedLng: d,
                usedNS: l,
                usedParams: this.getUsedParamsDetails(i),
              }
            : `${l}${u}${s}`
          : a
            ? {
                res: s,
                usedKey: s,
                exactUsedKey: s,
                usedLng: d,
                usedNS: l,
                usedParams: this.getUsedParamsDetails(i),
              }
            : s;
      let p = this.resolve(t, i),
        m = p?.res,
        h = p?.usedKey || s,
        g = p?.exactUsedKey || s,
        _ = [`[object Number]`, `[object Function]`, `[object RegExp]`],
        v = i.joinArrays === void 0 ? this.options.joinArrays : i.joinArrays,
        b = !this.i18nFormat || this.i18nFormat.handleAsObject,
        x = i.count !== void 0 && !y(i.count),
        S = e.hasDefaultValue(i),
        C = x ? this.pluralResolver.getSuffix(d, i.count, i) : ``,
        w =
          i.ordinal && x
            ? this.pluralResolver.getSuffix(d, i.count, { ordinal: !1 })
            : ``,
        ee = x && !i.ordinal && i.count === 0,
        T =
          (ee && i[`defaultValue${this.options.pluralSeparator}zero`]) ||
          i[`defaultValue${C}`] ||
          i[`defaultValue${w}`] ||
          i.defaultValue,
        te = m;
      b && !m && S && (te = T);
      let ne = ye(te),
        re = Object.prototype.toString.apply(te);
      if (b && te && ne && !_.includes(re) && !(y(v) && Array.isArray(te))) {
        if (!i.returnObjects && !this.options.returnObjects) {
          this.options.returnedObjectHandler ||
            this.logger.warn(
              `accessing an object - but returnObjects options is not enabled!`,
            );
          let e = this.options.returnedObjectHandler
            ? this.options.returnedObjectHandler(h, te, { ...i, ns: c })
            : `key '${s} (${this.language})' returned an object instead of string.`;
          return a
            ? ((p.res = e), (p.usedParams = this.getUsedParamsDetails(i)), p)
            : e;
        }
        if (o) {
          let e = Array.isArray(te),
            t = e ? [] : {},
            n = e ? g : h;
          for (let e in te)
            if (Object.prototype.hasOwnProperty.call(te, e)) {
              let r = `${n}${o}${e}`;
              (S && !m
                ? (t[e] = this.translate(r, {
                    ...i,
                    defaultValue: ye(T) ? T[e] : void 0,
                    joinArrays: !1,
                    ns: c,
                  }))
                : (t[e] = this.translate(r, { ...i, joinArrays: !1, ns: c })),
                t[e] === r && (t[e] = te[e]));
            }
          m = t;
        }
      } else if (b && y(v) && Array.isArray(m))
        ((m = m.join(v)), (m &&= this.extendTranslation(m, t, i, r)));
      else {
        let e = !1,
          n = !1;
        (!this.isValidLookup(m) && S && ((e = !0), (m = T)),
          this.isValidLookup(m) || ((n = !0), (m = s)));
        let a =
            (i.missingKeyNoValueFallbackToKey ||
              this.options.missingKeyNoValueFallbackToKey) &&
            n
              ? void 0
              : m,
          c = S && T !== m && this.options.updateMissing;
        if (n || e || c) {
          if (
            (this.logger.log(
              c ? `updateKey` : `missingKey`,
              d,
              l,
              s,
              c ? T : m,
            ),
            o)
          ) {
            let e = this.resolve(s, { ...i, keySeparator: !1 });
            e &&
              e.res &&
              this.logger.warn(
                `Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.`,
              );
          }
          let e = [],
            t = this.languageUtils.getFallbackCodes(
              this.options.fallbackLng,
              i.lng || this.language,
            );
          if (this.options.saveMissingTo === `fallback` && t && t[0])
            for (let n = 0; n < t.length; n++) e.push(t[n]);
          else
            this.options.saveMissingTo === `all`
              ? (e = this.languageUtils.toResolveHierarchy(
                  i.lng || this.language,
                ))
              : e.push(i.lng || this.language);
          let n = (e, t, n) => {
            let r = S && n !== m ? n : a;
            (this.options.missingKeyHandler
              ? this.options.missingKeyHandler(e, l, t, r, c, i)
              : this.backendConnector?.saveMissing &&
                this.backendConnector.saveMissing(e, l, t, r, c, i),
              this.emit(`missingKey`, e, l, t, m));
          };
          this.options.saveMissing &&
            (this.options.saveMissingPlurals && x
              ? e.forEach((e) => {
                  let t = this.pluralResolver.getSuffixes(e, i);
                  (ee &&
                    i[`defaultValue${this.options.pluralSeparator}zero`] &&
                    !t.includes(`${this.options.pluralSeparator}zero`) &&
                    t.push(`${this.options.pluralSeparator}zero`),
                    t.forEach((t) => {
                      n([e], s + t, i[`defaultValue${t}`] || T);
                    }));
                })
              : n(e, s, T));
        }
        ((m = this.extendTranslation(m, t, i, p, r)),
          n &&
            m === s &&
            this.options.appendNamespaceToMissingKey &&
            (m = `${l}${u}${s}`),
          (n || e) &&
            this.options.parseMissingKeyHandler &&
            (m = this.options.parseMissingKeyHandler(
              this.options.appendNamespaceToMissingKey ? `${l}${u}${s}` : s,
              e ? m : void 0,
              i,
            )));
      }
      return a
        ? ((p.res = m), (p.usedParams = this.getUsedParamsDetails(i)), p)
        : m;
    }
    extendTranslation(e, t, n, r, i) {
      if (this.i18nFormat?.parse)
        e = this.i18nFormat.parse(
          e,
          { ...this.options.interpolation.defaultVariables, ...n },
          n.lng || this.language || r.usedLng,
          r.usedNS,
          r.usedKey,
          { resolved: r },
        );
      else if (!n.skipInterpolation) {
        n.interpolation &&
          this.interpolator.init({
            ...n,
            interpolation: {
              ...this.options.interpolation,
              ...n.interpolation,
            },
          });
        let a =
            y(e) &&
            (n?.interpolation?.skipOnVariables === void 0
              ? this.options.interpolation.skipOnVariables
              : n.interpolation.skipOnVariables),
          o;
        if (a) {
          let t = e.match(this.interpolator.nestingRegexp);
          o = t && t.length;
        }
        let s = n.replace && !y(n.replace) ? n.replace : n;
        if (
          (this.options.interpolation.defaultVariables &&
            (s = { ...this.options.interpolation.defaultVariables, ...s }),
          (e = this.interpolator.interpolate(
            e,
            s,
            n.lng || this.language || r.usedLng,
            n,
          )),
          a)
        ) {
          let t = e.match(this.interpolator.nestingRegexp),
            r = t && t.length;
          o < r && (n.nest = !1);
        }
        (!n.lng && r && r.res && (n.lng = this.language || r.usedLng),
          n.nest !== !1 &&
            (e = this.interpolator.nest(
              e,
              (...e) =>
                i?.[0] === e[0] && !n.context
                  ? (this.logger.warn(
                      `It seems you are nesting recursively key: ${e[0]} in key: ${t[0]}`,
                    ),
                    null)
                  : this.translate(...e, t),
              n,
            )),
          n.interpolation && this.interpolator.reset());
      }
      let a = n.postProcess || this.options.postProcess,
        o = y(a) ? [a] : a;
      return (
        e != null &&
          o?.length &&
          n.applyPostProcessor !== !1 &&
          (e = he.handle(
            o,
            e,
            t,
            this.options && this.options.postProcessPassResolved
              ? {
                  i18nResolved: {
                    ...r,
                    usedParams: this.getUsedParamsDetails(n),
                  },
                  ...n,
                }
              : n,
            this,
          )),
        e
      );
    }
    resolve(e, t = {}) {
      let n, r, i, a, o;
      return (
        y(e) && (e = [e]),
        Array.isArray(e) &&
          (e = e.map((e) =>
            typeof e == `function` ? ve(e, { ...this.options, ...t }) : e,
          )),
        e.forEach((e) => {
          if (this.isValidLookup(n)) return;
          let s = this.extractFromKey(e, t),
            c = s.key;
          r = c;
          let l = s.namespaces;
          this.options.fallbackNS && (l = l.concat(this.options.fallbackNS));
          let u = t.count !== void 0 && !y(t.count),
            d = u && !t.ordinal && t.count === 0,
            f =
              t.context !== void 0 &&
              (y(t.context) || typeof t.context == `number`) &&
              t.context !== ``,
            p = t.lngs
              ? t.lngs
              : this.languageUtils.toResolveHierarchy(
                  t.lng || this.language,
                  t.fallbackLng,
                );
          l.forEach((e) => {
            this.isValidLookup(n) ||
              ((o = e),
              !this.checkedLoadedFor[`${p[0]}-${e}`] &&
                this.utils?.hasLoadedNamespace &&
                !this.utils?.hasLoadedNamespace(o) &&
                ((this.checkedLoadedFor[`${p[0]}-${e}`] = !0),
                this.logger.warn(
                  `key "${r}" for languages "${p.join(`, `)}" won't get resolved as namespace "${o}" was not yet loaded`,
                  `This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!`,
                )),
              p.forEach((r) => {
                if (this.isValidLookup(n)) return;
                a = r;
                let o = [c];
                if (this.i18nFormat?.addLookupKeys)
                  this.i18nFormat.addLookupKeys(o, c, r, e, t);
                else {
                  let e;
                  u && (e = this.pluralResolver.getSuffix(r, t.count, t));
                  let n = `${this.options.pluralSeparator}zero`,
                    i = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                  if (
                    (u &&
                      (t.ordinal &&
                        e.startsWith(i) &&
                        o.push(c + e.replace(i, this.options.pluralSeparator)),
                      o.push(c + e),
                      d && o.push(c + n)),
                    f)
                  ) {
                    let r = `${c}${this.options.contextSeparator || `_`}${t.context}`;
                    (o.push(r),
                      u &&
                        (t.ordinal &&
                          e.startsWith(i) &&
                          o.push(
                            r + e.replace(i, this.options.pluralSeparator),
                          ),
                        o.push(r + e),
                        d && o.push(r + n)));
                  }
                }
                let s;
                for (; (s = o.pop()); )
                  this.isValidLookup(n) ||
                    ((i = s), (n = this.getResource(r, e, s, t)));
              }));
          });
        }),
        { res: n, usedKey: r, exactUsedKey: i, usedLng: a, usedNS: o }
      );
    }
    isValidLookup(e) {
      return (
        e !== void 0 &&
        !(!this.options.returnNull && e === null) &&
        !(!this.options.returnEmptyString && e === ``)
      );
    }
    getResource(e, t, n, r = {}) {
      return this.i18nFormat?.getResource
        ? this.i18nFormat.getResource(e, t, n, r)
        : this.resourceStore.getResource(e, t, n, r);
    }
    getUsedParamsDetails(e = {}) {
      let t = [
          `defaultValue`,
          `ordinal`,
          `context`,
          `replace`,
          `lng`,
          `lngs`,
          `fallbackLng`,
          `ns`,
          `keySeparator`,
          `nsSeparator`,
          `returnObjects`,
          `returnDetails`,
          `joinArrays`,
          `postProcess`,
          `interpolation`,
        ],
        n = e.replace && !y(e.replace),
        r = n ? e.replace : e;
      if (
        (n && e.count !== void 0 && (r.count = e.count),
        this.options.interpolation.defaultVariables &&
          (r = { ...this.options.interpolation.defaultVariables, ...r }),
        !n)
      ) {
        r = { ...r };
        for (let e of t) delete r[e];
      }
      return r;
    }
    static hasDefaultValue(e) {
      for (let t in e)
        if (
          Object.prototype.hasOwnProperty.call(e, t) &&
          t.startsWith(`defaultValue`) &&
          e[t] !== void 0
        )
          return !0;
      return !1;
    }
  },
  xe = class {
    constructor(e) {
      ((this.options = e),
        (this.supportedLngs = this.options.supportedLngs || !1),
        (this.logger = O.create(`languageUtils`)));
    }
    getScriptPartFromCode(e) {
      if (((e = fe(e)), !e || !e.includes(`-`))) return null;
      let t = e.split(`-`);
      return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === `x`)
        ? null
        : this.formatLanguageCode(t.join(`-`));
    }
    getLanguagePartFromCode(e) {
      if (((e = fe(e)), !e || !e.includes(`-`))) return e;
      let t = e.split(`-`);
      return this.formatLanguageCode(t[0]);
    }
    formatLanguageCode(e) {
      if (y(e) && e.includes(`-`)) {
        let t;
        try {
          t = Intl.getCanonicalLocales(e)[0];
        } catch {}
        return (
          t && this.options.lowerCaseLng && (t = t.toLowerCase()),
          t || (this.options.lowerCaseLng ? e.toLowerCase() : e)
        );
      }
      return this.options.cleanCode || this.options.lowerCaseLng
        ? e.toLowerCase()
        : e;
    }
    isSupportedCode(e) {
      return (
        (this.options.load === `languageOnly` ||
          this.options.nonExplicitSupportedLngs) &&
          (e = this.getLanguagePartFromCode(e)),
        !this.supportedLngs ||
          !this.supportedLngs.length ||
          this.supportedLngs.includes(e)
      );
    }
    getBestMatchFromCodes(e) {
      if (!e) return null;
      let t;
      return (
        e.forEach((e) => {
          if (t) return;
          let n = this.formatLanguageCode(e);
          (!this.options.supportedLngs || this.isSupportedCode(n)) && (t = n);
        }),
        !t &&
          this.options.supportedLngs &&
          e.forEach((e) => {
            if (t) return;
            let n = this.getScriptPartFromCode(e);
            if (this.isSupportedCode(n)) return (t = n);
            let r = this.getLanguagePartFromCode(e);
            if (this.isSupportedCode(r)) return (t = r);
            t = this.options.supportedLngs.find((e) =>
              e === r
                ? !0
                : !e.includes(`-`) && !r.includes(`-`)
                  ? !1
                  : !!(
                      (e.includes(`-`) &&
                        !r.includes(`-`) &&
                        e.slice(0, e.indexOf(`-`)) === r) ||
                      (e.startsWith(r) && r.length > 1)
                    ),
            );
          }),
        (t ||= this.getFallbackCodes(this.options.fallbackLng)[0]),
        t
      );
    }
    getFallbackCodes(e, t) {
      if (!e) return [];
      if (
        (typeof e == `function` && (e = e(t)),
        y(e) && (e = [e]),
        Array.isArray(e))
      )
        return e;
      if (!t) return e.default || [];
      let n = e[t];
      return (
        (n ||= e[this.getScriptPartFromCode(t)]),
        (n ||= e[this.formatLanguageCode(t)]),
        (n ||= e[this.getLanguagePartFromCode(t)]),
        (n ||= e.default),
        n || []
      );
    }
    toResolveHierarchy(e, t) {
      let n = this.getFallbackCodes(
          (t === !1 ? [] : t) || this.options.fallbackLng || [],
          e,
        ),
        r = [],
        i = (e) => {
          e &&
            (this.isSupportedCode(e)
              ? r.push(e)
              : this.logger.warn(
                  `rejecting language code not found in supportedLngs: ${e}`,
                ));
        };
      return (
        y(e) && (e.includes(`-`) || e.includes(`_`))
          ? (this.options.load !== `languageOnly` &&
              i(this.formatLanguageCode(e)),
            this.options.load !== `languageOnly` &&
              this.options.load !== `currentOnly` &&
              i(this.getScriptPartFromCode(e)),
            this.options.load !== `currentOnly` &&
              i(this.getLanguagePartFromCode(e)))
          : y(e) && i(this.formatLanguageCode(e)),
        n.forEach((e) => {
          r.includes(e) || i(this.formatLanguageCode(e));
        }),
        r
      );
    }
  },
  Se = { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 },
  Ce = {
    select: (e) => (e === 1 ? `one` : `other`),
    resolvedOptions: () => ({ pluralCategories: [`one`, `other`] }),
  },
  we = class {
    constructor(e, t = {}) {
      ((this.languageUtils = e),
        (this.options = t),
        (this.logger = O.create(`pluralResolver`)),
        (this.pluralRulesCache = {}));
    }
    clearCache() {
      this.pluralRulesCache = {};
    }
    getRule(e, t = {}) {
      let n = fe(e === `dev` ? `en` : e),
        r = t.ordinal ? `ordinal` : `cardinal`,
        i = JSON.stringify({ cleanedCode: n, type: r });
      if (i in this.pluralRulesCache) return this.pluralRulesCache[i];
      let a;
      try {
        a = new Intl.PluralRules(n, { type: r });
      } catch {
        if (typeof Intl > `u`)
          return (
            this.logger.error(`No Intl support, please use an Intl polyfill!`),
            Ce
          );
        if (!e.match(/-|_/)) return Ce;
        let n = this.languageUtils.getLanguagePartFromCode(e);
        a = this.getRule(n, t);
      }
      return ((this.pluralRulesCache[i] = a), a);
    }
    needsPlural(e, t = {}) {
      let n = this.getRule(e, t);
      return (
        (n ||= this.getRule(`dev`, t)),
        n?.resolvedOptions().pluralCategories.length > 1
      );
    }
    getPluralFormsOfKey(e, t, n = {}) {
      return this.getSuffixes(e, n).map((e) => `${t}${e}`);
    }
    getSuffixes(e, t = {}) {
      let n = this.getRule(e, t);
      return (
        (n ||= this.getRule(`dev`, t)),
        n
          ? n
              .resolvedOptions()
              .pluralCategories.sort((e, t) => Se[e] - Se[t])
              .map(
                (e) =>
                  `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ``}${e}`,
              )
          : []
      );
    }
    getSuffix(e, t, n = {}) {
      let r = this.getRule(e, n);
      return r
        ? `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ``}${r.select(t)}`
        : (this.logger.warn(`no plural rule found for: ${e}`),
          this.getSuffix(`dev`, t, n));
    }
  },
  Te = (e, t, n, r = `.`, i = !0) => {
    let a = ie(e, t, n);
    return (
      !a && i && y(n) && ((a = de(e, n, r)), a === void 0 && (a = de(t, n, r))),
      a
    );
  },
  Ee = (e) => e.replace(/\$/g, `$$$$`),
  De = class {
    constructor(e = {}) {
      ((this.logger = O.create(`interpolator`)),
        (this.options = e),
        (this.format = e?.interpolation?.format || ((e) => e)),
        this.init(e));
    }
    init(e = {}) {
      e.interpolation ||= { escapeValue: !0 };
      let {
        escape: t,
        escapeValue: n,
        useRawValueToEscape: r,
        prefix: i,
        prefixEscaped: a,
        suffix: o,
        suffixEscaped: s,
        formatSeparator: c,
        unescapeSuffix: l,
        unescapePrefix: u,
        nestingPrefix: d,
        nestingPrefixEscaped: f,
        nestingSuffix: p,
        nestingSuffixEscaped: m,
        nestingOptionsSeparator: h,
        maxReplaces: g,
        alwaysFormat: _,
      } = e.interpolation;
      ((this.escape = t === void 0 ? ce : t),
        (this.escapeValue = n === void 0 ? !0 : n),
        (this.useRawValueToEscape = r === void 0 ? !1 : r),
        (this.prefix = i ? oe(i) : a || `{{`),
        (this.suffix = o ? oe(o) : s || `}}`),
        (this.formatSeparator = c || `,`),
        (this.unescapePrefix = l ? `` : u || `-`),
        (this.unescapeSuffix = this.unescapePrefix ? `` : l || ``),
        (this.nestingPrefix = d ? oe(d) : f || oe(`$t(`)),
        (this.nestingSuffix = p ? oe(p) : m || oe(`)`)),
        (this.nestingOptionsSeparator = h || `,`),
        (this.maxReplaces = g || 1e3),
        (this.alwaysFormat = _ === void 0 ? !1 : _),
        this.resetRegExp());
    }
    reset() {
      this.options && this.init(this.options);
    }
    resetRegExp() {
      let e = (e, t) =>
        e?.source === t ? ((e.lastIndex = 0), e) : new RegExp(t, `g`);
      ((this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`)),
        (this.regexpUnescape = e(
          this.regexpUnescape,
          `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`,
        )),
        (this.nestingRegexp = e(
          this.nestingRegexp,
          `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`,
        )));
    }
    interpolate(e, t, n, r) {
      let i,
        a,
        o,
        s =
          (this.options &&
            this.options.interpolation &&
            this.options.interpolation.defaultVariables) ||
          {},
        c = (e) => {
          if (!e.includes(this.formatSeparator)) {
            let i = Te(
              t,
              s,
              e,
              this.options.keySeparator,
              this.options.ignoreJSONStructure,
            );
            return this.alwaysFormat
              ? this.format(i, void 0, n, { ...r, ...t, interpolationkey: e })
              : i;
          }
          let i = e.split(this.formatSeparator),
            a = i.shift().trim(),
            o = i.join(this.formatSeparator).trim();
          return this.format(
            Te(
              t,
              s,
              a,
              this.options.keySeparator,
              this.options.ignoreJSONStructure,
            ),
            o,
            n,
            { ...r, ...t, interpolationkey: a },
          );
        };
      this.resetRegExp();
      let l =
          r?.missingInterpolationHandler ||
          this.options.missingInterpolationHandler,
        u =
          r?.interpolation?.skipOnVariables === void 0
            ? this.options.interpolation.skipOnVariables
            : r.interpolation.skipOnVariables;
      return (
        [
          { regex: this.regexpUnescape, safeValue: (e) => Ee(e) },
          {
            regex: this.regexp,
            safeValue: (e) => (this.escapeValue ? Ee(this.escape(e)) : Ee(e)),
          },
        ].forEach((t) => {
          for (o = 0; (i = t.regex.exec(e)); ) {
            let n = i[1].trim();
            if (((a = c(n)), a === void 0))
              if (typeof l == `function`) {
                let t = l(e, i, r);
                a = y(t) ? t : ``;
              } else if (r && Object.prototype.hasOwnProperty.call(r, n))
                a = ``;
              else if (u) {
                a = i[0];
                continue;
              } else
                (this.logger.warn(
                  `missed to pass in variable ${n} for interpolating ${e}`,
                ),
                  (a = ``));
            else !y(a) && !this.useRawValueToEscape && (a = x(a));
            let s = t.safeValue(a);
            if (
              ((e = e.replace(i[0], s)),
              u
                ? ((t.regex.lastIndex += a.length),
                  (t.regex.lastIndex -= i[0].length))
                : (t.regex.lastIndex = 0),
              o++,
              o >= this.maxReplaces)
            )
              break;
          }
        }),
        e
      );
    }
    nest(e, t, n = {}) {
      let r,
        i,
        a,
        o = (e, t) => {
          let n = this.nestingOptionsSeparator;
          if (!e.includes(n)) return e;
          let r = e.split(RegExp(`${oe(n)}[ ]*{`)),
            i = `{${r[1]}`;
          ((e = r[0]), (i = this.interpolate(i, a)));
          let o = i.match(/'/g),
            s = i.match(/"/g);
          (((o?.length ?? 0) % 2 == 0 && !s) || (s?.length ?? 0) % 2 != 0) &&
            (i = i.replace(/'/g, `"`));
          try {
            ((a = JSON.parse(i)), t && (a = { ...t, ...a }));
          } catch (t) {
            return (
              this.logger.warn(
                `failed parsing options string in nesting for key ${e}`,
                t,
              ),
              `${e}${n}${i}`
            );
          }
          return (
            a.defaultValue &&
              a.defaultValue.includes(this.prefix) &&
              delete a.defaultValue,
            e
          );
        };
      for (; (r = this.nestingRegexp.exec(e)); ) {
        let s = [];
        ((a = { ...n }),
          (a = a.replace && !y(a.replace) ? a.replace : a),
          (a.applyPostProcessor = !1),
          delete a.defaultValue);
        let c = /{.*}/.test(r[1])
          ? r[1].lastIndexOf(`}`) + 1
          : r[1].indexOf(this.formatSeparator);
        if (
          (c !== -1 &&
            ((s = r[1]
              .slice(c)
              .split(this.formatSeparator)
              .map((e) => e.trim())
              .filter(Boolean)),
            (r[1] = r[1].slice(0, c))),
          (i = t(o.call(this, r[1].trim(), a), a)),
          i && r[0] === e && !y(i))
        )
          return i;
        (y(i) || (i = x(i)),
          (i ||=
            (this.logger.warn(`missed to resolve ${r[1]} for nesting ${e}`),
            ``)),
          s.length &&
            (i = s.reduce(
              (e, t) =>
                this.format(e, t, n.lng, {
                  ...n,
                  interpolationkey: r[1].trim(),
                }),
              i.trim(),
            )),
          (e = e.replace(r[0], i)),
          (this.regexp.lastIndex = 0));
      }
      return e;
    }
  },
  Oe = (e) => {
    let t = e.toLowerCase().trim(),
      n = {};
    if (e.includes(`(`)) {
      let r = e.split(`(`);
      t = r[0].toLowerCase().trim();
      let i = r[1].slice(0, -1);
      t === `currency` && !i.includes(`:`)
        ? (n.currency ||= i.trim())
        : t === `relativetime` && !i.includes(`:`)
          ? (n.range ||= i.trim())
          : i.split(`;`).forEach((e) => {
              if (e) {
                let [t, ...r] = e.split(`:`),
                  i = r
                    .join(`:`)
                    .trim()
                    .replace(/^'+|'+$/g, ``),
                  a = t.trim();
                (n[a] || (n[a] = i),
                  i === `false` && (n[a] = !1),
                  i === `true` && (n[a] = !0),
                  isNaN(i) || (n[a] = parseInt(i, 10)));
              }
            });
    }
    return { formatName: t, formatOptions: n };
  },
  ke = (e) => {
    let t = {};
    return (n, r, i) => {
      let a = i;
      i &&
        i.interpolationkey &&
        i.formatParams &&
        i.formatParams[i.interpolationkey] &&
        i[i.interpolationkey] &&
        (a = { ...a, [i.interpolationkey]: void 0 });
      let o = r + JSON.stringify(a),
        s = t[o];
      return (s || ((s = e(fe(r), i)), (t[o] = s)), s(n));
    };
  },
  Ae = (e) => (t, n, r) => e(fe(n), r)(t),
  je = class {
    constructor(e = {}) {
      ((this.logger = O.create(`formatter`)), (this.options = e), this.init(e));
    }
    init(e, t = { interpolation: {} }) {
      this.formatSeparator = t.interpolation.formatSeparator || `,`;
      let n = t.cacheInBuiltFormats ? ke : Ae;
      this.formats = {
        number: n((e, t) => {
          let n = new Intl.NumberFormat(e, { ...t });
          return (e) => n.format(e);
        }),
        currency: n((e, t) => {
          let n = new Intl.NumberFormat(e, { ...t, style: `currency` });
          return (e) => n.format(e);
        }),
        datetime: n((e, t) => {
          let n = new Intl.DateTimeFormat(e, { ...t });
          return (e) => n.format(e);
        }),
        relativetime: n((e, t) => {
          let n = new Intl.RelativeTimeFormat(e, { ...t });
          return (e) => n.format(e, t.range || `day`);
        }),
        list: n((e, t) => {
          let n = new Intl.ListFormat(e, { ...t });
          return (e) => n.format(e);
        }),
      };
    }
    add(e, t) {
      this.formats[e.toLowerCase().trim()] = t;
    }
    addCached(e, t) {
      this.formats[e.toLowerCase().trim()] = ke(t);
    }
    format(e, t, n, r = {}) {
      if (!t || e == null) return e;
      let i = t.split(this.formatSeparator);
      if (
        i.length > 1 &&
        i[0].indexOf(`(`) > 1 &&
        !i[0].includes(`)`) &&
        i.find((e) => e.includes(`)`))
      ) {
        let e = i.findIndex((e) => e.includes(`)`));
        i[0] = [i[0], ...i.splice(1, e)].join(this.formatSeparator);
      }
      return i.reduce((e, t) => {
        let { formatName: i, formatOptions: a } = Oe(t);
        if (this.formats[i]) {
          let t = e;
          try {
            let o = r?.formatParams?.[r.interpolationkey] || {},
              s = o.locale || o.lng || r.locale || r.lng || n;
            t = this.formats[i](e, s, { ...a, ...r, ...o });
          } catch (e) {
            this.logger.warn(e);
          }
          return t;
        } else this.logger.warn(`there was no format function for ${i}`);
        return e;
      }, e);
    }
  },
  Me = (e, t) => {
    e.pending[t] !== void 0 && (delete e.pending[t], e.pendingCount--);
  },
  Ne = class extends k {
    constructor(e, t, n, r = {}) {
      (super(),
        (this.backend = e),
        (this.store = t),
        (this.services = n),
        (this.languageUtils = n.languageUtils),
        (this.options = r),
        (this.logger = O.create(`backendConnector`)),
        (this.waitingReads = []),
        (this.maxParallelReads = r.maxParallelReads || 10),
        (this.readingCalls = 0),
        (this.maxRetries = r.maxRetries >= 0 ? r.maxRetries : 5),
        (this.retryTimeout = r.retryTimeout >= 1 ? r.retryTimeout : 350),
        (this.state = {}),
        (this.queue = []),
        this.backend?.init?.(n, r.backend, r));
    }
    queueLoad(e, t, n, r) {
      let i = {},
        a = {},
        o = {},
        s = {};
      return (
        e.forEach((e) => {
          let r = !0;
          (t.forEach((t) => {
            let o = `${e}|${t}`;
            !n.reload && this.store.hasResourceBundle(e, t)
              ? (this.state[o] = 2)
              : this.state[o] < 0 ||
                (this.state[o] === 1
                  ? a[o] === void 0 && (a[o] = !0)
                  : ((this.state[o] = 1),
                    (r = !1),
                    a[o] === void 0 && (a[o] = !0),
                    i[o] === void 0 && (i[o] = !0),
                    s[t] === void 0 && (s[t] = !0)));
          }),
            r || (o[e] = !0));
        }),
        (Object.keys(i).length || Object.keys(a).length) &&
          this.queue.push({
            pending: a,
            pendingCount: Object.keys(a).length,
            loaded: {},
            errors: [],
            callback: r,
          }),
        {
          toLoad: Object.keys(i),
          pending: Object.keys(a),
          toLoadLanguages: Object.keys(o),
          toLoadNamespaces: Object.keys(s),
        }
      );
    }
    loaded(e, t, n) {
      let r = e.split(`|`),
        i = r[0],
        a = r[1];
      (t && this.emit(`failedLoading`, i, a, t),
        !t &&
          n &&
          this.store.addResourceBundle(i, a, n, void 0, void 0, {
            skipCopy: !0,
          }),
        (this.state[e] = t ? -1 : 2),
        t && n && (this.state[e] = 0));
      let o = {};
      (this.queue.forEach((n) => {
        (ne(n.loaded, [i], a),
          Me(n, e),
          t && n.errors.push(t),
          n.pendingCount === 0 &&
            !n.done &&
            (Object.keys(n.loaded).forEach((e) => {
              o[e] || (o[e] = {});
              let t = n.loaded[e];
              t.length &&
                t.forEach((t) => {
                  o[e][t] === void 0 && (o[e][t] = !0);
                });
            }),
            (n.done = !0),
            n.errors.length ? n.callback(n.errors) : n.callback()));
      }),
        this.emit(`loaded`, o),
        (this.queue = this.queue.filter((e) => !e.done)));
    }
    read(e, t, n, r = 0, i = this.retryTimeout, a) {
      if (!e.length) return a(null, {});
      if (this.readingCalls >= this.maxParallelReads) {
        this.waitingReads.push({
          lng: e,
          ns: t,
          fcName: n,
          tried: r,
          wait: i,
          callback: a,
        });
        return;
      }
      this.readingCalls++;
      let o = (o, s) => {
          if ((this.readingCalls--, this.waitingReads.length > 0)) {
            let e = this.waitingReads.shift();
            this.read(e.lng, e.ns, e.fcName, e.tried, e.wait, e.callback);
          }
          if (o && s && r < this.maxRetries) {
            setTimeout(() => {
              this.read(e, t, n, r + 1, i * 2, a);
            }, i);
            return;
          }
          a(o, s);
        },
        s = this.backend[n].bind(this.backend);
      if (s.length === 2) {
        try {
          let n = s(e, t);
          n && typeof n.then == `function`
            ? n.then((e) => o(null, e)).catch(o)
            : o(null, n);
        } catch (e) {
          o(e);
        }
        return;
      }
      return s(e, t, o);
    }
    prepareLoading(e, t, n = {}, r) {
      if (!this.backend)
        return (
          this.logger.warn(
            `No backend was added via i18next.use. Will not load resources.`,
          ),
          r && r()
        );
      (y(e) && (e = this.languageUtils.toResolveHierarchy(e)),
        y(t) && (t = [t]));
      let i = this.queueLoad(e, t, n, r);
      if (!i.toLoad.length) return (i.pending.length || r(), null);
      i.toLoad.forEach((e) => {
        this.loadOne(e);
      });
    }
    load(e, t, n) {
      this.prepareLoading(e, t, {}, n);
    }
    reload(e, t, n) {
      this.prepareLoading(e, t, { reload: !0 }, n);
    }
    loadOne(e, t = ``) {
      let n = e.split(`|`),
        r = n[0],
        i = n[1];
      this.read(r, i, `read`, void 0, void 0, (n, a) => {
        (n &&
          this.logger.warn(
            `${t}loading namespace ${i} for language ${r} failed`,
            n,
          ),
          !n &&
            a &&
            this.logger.log(`${t}loaded namespace ${i} for language ${r}`, a),
          this.loaded(e, n, a));
      });
    }
    saveMissing(e, t, n, r, i, a = {}, o = () => {}) {
      if (
        this.services?.utils?.hasLoadedNamespace &&
        !this.services?.utils?.hasLoadedNamespace(t)
      ) {
        this.logger.warn(
          `did not save key "${n}" as the namespace "${t}" was not yet loaded`,
          `This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!`,
        );
        return;
      }
      if (!(n == null || n === ``)) {
        if (this.backend?.create) {
          let s = { ...a, isUpdate: i },
            c = this.backend.create.bind(this.backend);
          if (c.length < 6)
            try {
              let i;
              ((i = c.length === 5 ? c(e, t, n, r, s) : c(e, t, n, r)),
                i && typeof i.then == `function`
                  ? i.then((e) => o(null, e)).catch(o)
                  : o(null, i));
            } catch (e) {
              o(e);
            }
          else c(e, t, n, r, o, s);
        }
        !e || !e[0] || this.store.addResource(e[0], t, n, r);
      }
    }
  },
  Pe = () => ({
    debug: !1,
    initAsync: !0,
    ns: [`translation`],
    defaultNS: [`translation`],
    fallbackLng: [`dev`],
    fallbackNS: !1,
    supportedLngs: !1,
    nonExplicitSupportedLngs: !1,
    load: `all`,
    preload: !1,
    keySeparator: `.`,
    nsSeparator: `:`,
    pluralSeparator: `_`,
    contextSeparator: `_`,
    partialBundledLanguages: !1,
    saveMissing: !1,
    updateMissing: !1,
    saveMissingTo: `fallback`,
    saveMissingPlurals: !0,
    missingKeyHandler: !1,
    missingInterpolationHandler: !1,
    postProcess: !1,
    postProcessPassResolved: !1,
    returnNull: !1,
    returnEmptyString: !0,
    returnObjects: !1,
    joinArrays: !1,
    returnedObjectHandler: !1,
    parseMissingKeyHandler: !1,
    appendNamespaceToMissingKey: !1,
    appendNamespaceToCIMode: !1,
    overloadTranslationOptionHandler: (e) => {
      let t = {};
      if (
        (typeof e[1] == `object` && (t = e[1]),
        y(e[1]) && (t.defaultValue = e[1]),
        y(e[2]) && (t.tDescription = e[2]),
        typeof e[2] == `object` || typeof e[3] == `object`)
      ) {
        let n = e[3] || e[2];
        Object.keys(n).forEach((e) => {
          t[e] = n[e];
        });
      }
      return t;
    },
    interpolation: {
      escapeValue: !0,
      prefix: `{{`,
      suffix: `}}`,
      formatSeparator: `,`,
      unescapePrefix: `-`,
      nestingPrefix: `$t(`,
      nestingSuffix: `)`,
      nestingOptionsSeparator: `,`,
      maxReplaces: 1e3,
      skipOnVariables: !0,
    },
    cacheInBuiltFormats: !0,
  }),
  Fe = (e) => (
    y(e.ns) && (e.ns = [e.ns]),
    y(e.fallbackLng) && (e.fallbackLng = [e.fallbackLng]),
    y(e.fallbackNS) && (e.fallbackNS = [e.fallbackNS]),
    e.supportedLngs &&
      !e.supportedLngs.includes(`cimode`) &&
      (e.supportedLngs = e.supportedLngs.concat([`cimode`])),
    e
  ),
  Ie = () => {},
  Le = (e) => {
    Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach((t) => {
      typeof e[t] == `function` && (e[t] = e[t].bind(e));
    });
  },
  A = class e extends k {
    constructor(e = {}, t) {
      if (
        (super(),
        (this.options = Fe(e)),
        (this.services = {}),
        (this.logger = O),
        (this.modules = { external: [] }),
        Le(this),
        t && !this.isInitialized && !e.isClone)
      ) {
        if (!this.options.initAsync) return (this.init(e, t), this);
        setTimeout(() => {
          this.init(e, t);
        }, 0);
      }
    }
    init(e = {}, t) {
      ((this.isInitializing = !0),
        typeof e == `function` && ((t = e), (e = {})),
        e.defaultNS == null &&
          e.ns &&
          (y(e.ns)
            ? (e.defaultNS = e.ns)
            : e.ns.includes(`translation`) || (e.defaultNS = e.ns[0])));
      let n = Pe();
      ((this.options = { ...n, ...this.options, ...Fe(e) }),
        (this.options.interpolation = {
          ...n.interpolation,
          ...this.options.interpolation,
        }),
        e.keySeparator !== void 0 &&
          (this.options.userDefinedKeySeparator = e.keySeparator),
        e.nsSeparator !== void 0 &&
          (this.options.userDefinedNsSeparator = e.nsSeparator),
        typeof this.options.overloadTranslationOptionHandler != `function` &&
          (this.options.overloadTranslationOptionHandler =
            n.overloadTranslationOptionHandler));
      let r = (e) => (e ? (typeof e == `function` ? new e() : e) : null);
      if (!this.options.isClone) {
        this.modules.logger
          ? O.init(r(this.modules.logger), this.options)
          : O.init(null, this.options);
        let e;
        e = this.modules.formatter ? this.modules.formatter : je;
        let t = new xe(this.options);
        this.store = new me(this.options.resources, this.options);
        let n = this.services;
        ((n.logger = O),
          (n.resourceStore = this.store),
          (n.languageUtils = t),
          (n.pluralResolver = new we(t, {
            prepend: this.options.pluralSeparator,
          })),
          e &&
            ((n.formatter = r(e)),
            n.formatter.init && n.formatter.init(n, this.options),
            (this.options.interpolation.format = n.formatter.format.bind(
              n.formatter,
            ))),
          (n.interpolator = new De(this.options)),
          (n.utils = {
            hasLoadedNamespace: this.hasLoadedNamespace.bind(this),
          }),
          (n.backendConnector = new Ne(
            r(this.modules.backend),
            n.resourceStore,
            n,
            this.options,
          )),
          n.backendConnector.on(`*`, (e, ...t) => {
            this.emit(e, ...t);
          }),
          this.modules.languageDetector &&
            ((n.languageDetector = r(this.modules.languageDetector)),
            n.languageDetector.init &&
              n.languageDetector.init(n, this.options.detection, this.options)),
          this.modules.i18nFormat &&
            ((n.i18nFormat = r(this.modules.i18nFormat)),
            n.i18nFormat.init && n.i18nFormat.init(this)),
          (this.translator = new be(this.services, this.options)),
          this.translator.on(`*`, (e, ...t) => {
            this.emit(e, ...t);
          }),
          this.modules.external.forEach((e) => {
            e.init && e.init(this);
          }));
      }
      if (
        ((this.format = this.options.interpolation.format),
        (t ||= Ie),
        this.options.fallbackLng &&
          !this.services.languageDetector &&
          !this.options.lng)
      ) {
        let e = this.services.languageUtils.getFallbackCodes(
          this.options.fallbackLng,
        );
        e.length > 0 && e[0] !== `dev` && (this.options.lng = e[0]);
      }
      (!this.services.languageDetector &&
        !this.options.lng &&
        this.logger.warn(
          `init: no languageDetector is used and no lng is defined`,
        ),
        [
          `getResource`,
          `hasResourceBundle`,
          `getResourceBundle`,
          `getDataByLanguage`,
        ].forEach((e) => {
          this[e] = (...t) => this.store[e](...t);
        }),
        [
          `addResource`,
          `addResources`,
          `addResourceBundle`,
          `removeResourceBundle`,
        ].forEach((e) => {
          this[e] = (...t) => (this.store[e](...t), this);
        }));
      let i = b(),
        a = () => {
          let e = (e, n) => {
            ((this.isInitializing = !1),
              this.isInitialized &&
                !this.initializedStoreOnce &&
                this.logger.warn(
                  `init: i18next is already initialized. You should call init just once!`,
                ),
              (this.isInitialized = !0),
              this.options.isClone ||
                this.logger.log(`initialized`, this.options),
              this.emit(`initialized`, this.options),
              i.resolve(n),
              t(e, n));
          };
          if (this.languages && !this.isInitialized)
            return e(null, this.t.bind(this));
          this.changeLanguage(this.options.lng, e);
        };
      return (
        this.options.resources || !this.options.initAsync
          ? a()
          : setTimeout(a, 0),
        i
      );
    }
    loadResources(e, t = Ie) {
      let n = t,
        r = y(e) ? e : this.language;
      if (
        (typeof e == `function` && (n = e),
        !this.options.resources || this.options.partialBundledLanguages)
      ) {
        if (
          r?.toLowerCase() === `cimode` &&
          (!this.options.preload || this.options.preload.length === 0)
        )
          return n();
        let e = [],
          t = (t) => {
            t &&
              t !== `cimode` &&
              this.services.languageUtils.toResolveHierarchy(t).forEach((t) => {
                t !== `cimode` && (e.includes(t) || e.push(t));
              });
          };
        (r
          ? t(r)
          : this.services.languageUtils
              .getFallbackCodes(this.options.fallbackLng)
              .forEach((e) => t(e)),
          this.options.preload?.forEach?.((e) => t(e)),
          this.services.backendConnector.load(e, this.options.ns, (e) => {
            (!e &&
              !this.resolvedLanguage &&
              this.language &&
              this.setResolvedLanguage(this.language),
              n(e));
          }));
      } else n(null);
    }
    reloadResources(e, t, n) {
      let r = b();
      return (
        typeof e == `function` && ((n = e), (e = void 0)),
        typeof t == `function` && ((n = t), (t = void 0)),
        (e ||= this.languages),
        (t ||= this.options.ns),
        (n ||= Ie),
        this.services.backendConnector.reload(e, t, (e) => {
          (r.resolve(), n(e));
        }),
        r
      );
    }
    use(e) {
      if (!e)
        throw Error(
          `You are passing an undefined module! Please check the object you are passing to i18next.use()`,
        );
      if (!e.type)
        throw Error(
          `You are passing a wrong module! Please check the object you are passing to i18next.use()`,
        );
      return (
        e.type === `backend` && (this.modules.backend = e),
        (e.type === `logger` || (e.log && e.warn && e.error)) &&
          (this.modules.logger = e),
        e.type === `languageDetector` && (this.modules.languageDetector = e),
        e.type === `i18nFormat` && (this.modules.i18nFormat = e),
        e.type === `postProcessor` && he.addPostProcessor(e),
        e.type === `formatter` && (this.modules.formatter = e),
        e.type === `3rdParty` && this.modules.external.push(e),
        this
      );
    }
    setResolvedLanguage(e) {
      if (!(!e || !this.languages) && ![`cimode`, `dev`].includes(e)) {
        for (let e = 0; e < this.languages.length; e++) {
          let t = this.languages[e];
          if (
            ![`cimode`, `dev`].includes(t) &&
            this.store.hasLanguageSomeTranslations(t)
          ) {
            this.resolvedLanguage = t;
            break;
          }
        }
        !this.resolvedLanguage &&
          !this.languages.includes(e) &&
          this.store.hasLanguageSomeTranslations(e) &&
          ((this.resolvedLanguage = e), this.languages.unshift(e));
      }
    }
    changeLanguage(e, t) {
      this.isLanguageChangingTo = e;
      let n = b();
      this.emit(`languageChanging`, e);
      let r = (e) => {
          ((this.language = e),
            (this.languages =
              this.services.languageUtils.toResolveHierarchy(e)),
            (this.resolvedLanguage = void 0),
            this.setResolvedLanguage(e));
        },
        i = (i, a) => {
          (a
            ? this.isLanguageChangingTo === e &&
              (r(a),
              this.translator.changeLanguage(a),
              (this.isLanguageChangingTo = void 0),
              this.emit(`languageChanged`, a),
              this.logger.log(`languageChanged`, a))
            : (this.isLanguageChangingTo = void 0),
            n.resolve((...e) => this.t(...e)),
            t && t(i, (...e) => this.t(...e)));
        },
        a = (t) => {
          !e && !t && this.services.languageDetector && (t = []);
          let n = y(t) ? t : t && t[0],
            a = this.store.hasLanguageSomeTranslations(n)
              ? n
              : this.services.languageUtils.getBestMatchFromCodes(
                  y(t) ? [t] : t,
                );
          (a &&
            (this.language || r(a),
            this.translator.language || this.translator.changeLanguage(a),
            this.services.languageDetector?.cacheUserLanguage?.(a)),
            this.loadResources(a, (e) => {
              i(e, a);
            }));
        };
      return (
        !e &&
        this.services.languageDetector &&
        !this.services.languageDetector.async
          ? a(this.services.languageDetector.detect())
          : !e &&
              this.services.languageDetector &&
              this.services.languageDetector.async
            ? this.services.languageDetector.detect.length === 0
              ? this.services.languageDetector.detect().then(a)
              : this.services.languageDetector.detect(a)
            : a(e),
        n
      );
    }
    getFixedT(e, t, n) {
      let r = (e, t, ...i) => {
        let a;
        ((a =
          typeof t == `object`
            ? { ...t }
            : this.options.overloadTranslationOptionHandler([e, t].concat(i))),
          (a.lng = a.lng || r.lng),
          (a.lngs = a.lngs || r.lngs),
          (a.ns = a.ns || r.ns),
          a.keyPrefix !== `` &&
            (a.keyPrefix = a.keyPrefix || n || r.keyPrefix));
        let o = { ...this.options, ...a };
        typeof a.keyPrefix == `function` && (a.keyPrefix = ve(a.keyPrefix, o));
        let s = this.options.keySeparator || `.`,
          c;
        return (
          a.keyPrefix && Array.isArray(e)
            ? (c = e.map(
                (e) => (
                  typeof e == `function` && (e = ve(e, o)),
                  `${a.keyPrefix}${s}${e}`
                ),
              ))
            : (typeof e == `function` && (e = ve(e, o)),
              (c = a.keyPrefix ? `${a.keyPrefix}${s}${e}` : e)),
          this.t(c, a)
        );
      };
      return (
        y(e) ? (r.lng = e) : (r.lngs = e),
        (r.ns = t),
        (r.keyPrefix = n),
        r
      );
    }
    t(...e) {
      return this.translator?.translate(...e);
    }
    exists(...e) {
      return this.translator?.exists(...e);
    }
    setDefaultNamespace(e) {
      this.options.defaultNS = e;
    }
    hasLoadedNamespace(e, t = {}) {
      if (!this.isInitialized)
        return (
          this.logger.warn(
            `hasLoadedNamespace: i18next was not initialized`,
            this.languages,
          ),
          !1
        );
      if (!this.languages || !this.languages.length)
        return (
          this.logger.warn(
            `hasLoadedNamespace: i18n.languages were undefined or empty`,
            this.languages,
          ),
          !1
        );
      let n = t.lng || this.resolvedLanguage || this.languages[0],
        r = this.options ? this.options.fallbackLng : !1,
        i = this.languages[this.languages.length - 1];
      if (n.toLowerCase() === `cimode`) return !0;
      let a = (e, t) => {
        let n = this.services.backendConnector.state[`${e}|${t}`];
        return n === -1 || n === 0 || n === 2;
      };
      if (t.precheck) {
        let e = t.precheck(this, a);
        if (e !== void 0) return e;
      }
      return !!(
        this.hasResourceBundle(n, e) ||
        !this.services.backendConnector.backend ||
        (this.options.resources && !this.options.partialBundledLanguages) ||
        (a(n, e) && (!r || a(i, e)))
      );
    }
    loadNamespaces(e, t) {
      let n = b();
      return this.options.ns
        ? (y(e) && (e = [e]),
          e.forEach((e) => {
            this.options.ns.includes(e) || this.options.ns.push(e);
          }),
          this.loadResources((e) => {
            (n.resolve(), t && t(e));
          }),
          n)
        : (t && t(), Promise.resolve());
    }
    loadLanguages(e, t) {
      let n = b();
      y(e) && (e = [e]);
      let r = this.options.preload || [],
        i = e.filter(
          (e) =>
            !r.includes(e) && this.services.languageUtils.isSupportedCode(e),
        );
      return i.length
        ? ((this.options.preload = r.concat(i)),
          this.loadResources((e) => {
            (n.resolve(), t && t(e));
          }),
          n)
        : (t && t(), Promise.resolve());
    }
    dir(e) {
      if (
        ((e ||=
          this.resolvedLanguage ||
          (this.languages?.length > 0 ? this.languages[0] : this.language)),
        !e)
      )
        return `rtl`;
      try {
        let t = new Intl.Locale(e);
        if (t && t.getTextInfo) {
          let e = t.getTextInfo();
          if (e && e.direction) return e.direction;
        }
      } catch {}
      let t =
          `ar.shu.sqr.ssh.xaa.yhd.yud.aao.abh.abv.acm.acq.acw.acx.acy.adf.ads.aeb.aec.afb.ajp.apc.apd.arb.arq.ars.ary.arz.auz.avl.ayh.ayl.ayn.ayp.bbz.pga.he.iw.ps.pbt.pbu.pst.prp.prd.ug.ur.ydd.yds.yih.ji.yi.hbo.men.xmn.fa.jpr.peo.pes.prs.dv.sam.ckb`.split(
            `.`,
          ),
        n = this.services?.languageUtils || new xe(Pe());
      return e.toLowerCase().indexOf(`-latn`) > 1
        ? `ltr`
        : t.includes(n.getLanguagePartFromCode(e)) ||
            e.toLowerCase().indexOf(`-arab`) > 1
          ? `rtl`
          : `ltr`;
    }
    static createInstance(t = {}, n) {
      let r = new e(t, n);
      return ((r.createInstance = e.createInstance), r);
    }
    cloneInstance(t = {}, n = Ie) {
      let r = t.forkResourceStore;
      r && delete t.forkResourceStore;
      let i = { ...this.options, ...t, isClone: !0 },
        a = new e(i);
      if (
        ((t.debug !== void 0 || t.prefix !== void 0) &&
          (a.logger = a.logger.clone(t)),
        [`store`, `services`, `language`].forEach((e) => {
          a[e] = this[e];
        }),
        (a.services = { ...this.services }),
        (a.services.utils = {
          hasLoadedNamespace: a.hasLoadedNamespace.bind(a),
        }),
        r &&
          ((a.store = new me(
            Object.keys(this.store.data).reduce(
              (e, t) => (
                (e[t] = { ...this.store.data[t] }),
                (e[t] = Object.keys(e[t]).reduce(
                  (n, r) => ((n[r] = { ...e[t][r] }), n),
                  e[t],
                )),
                e
              ),
              {},
            ),
            i,
          )),
          (a.services.resourceStore = a.store)),
        t.interpolation)
      ) {
        let e = {
            ...Pe().interpolation,
            ...this.options.interpolation,
            ...t.interpolation,
          },
          n = { ...i, interpolation: e };
        a.services.interpolator = new De(n);
      }
      return (
        (a.translator = new be(a.services, i)),
        a.translator.on(`*`, (e, ...t) => {
          a.emit(e, ...t);
        }),
        a.init(i, n),
        (a.translator.options = i),
        (a.translator.backendConnector.services.utils = {
          hasLoadedNamespace: a.hasLoadedNamespace.bind(a),
        }),
        a
      );
    }
    toJSON() {
      return {
        options: this.options,
        store: this.store,
        language: this.language,
        languages: this.languages,
        resolvedLanguage: this.resolvedLanguage,
      };
    }
  }.createInstance();
(A.createInstance,
  A.dir,
  A.init,
  A.loadResources,
  A.reloadResources,
  A.use,
  A.changeLanguage,
  A.getFixedT,
  A.t,
  A.exists,
  A.setDefaultNamespace,
  A.hasLoadedNamespace,
  A.loadNamespaces,
  A.loadLanguages);
var Re = (e, t, n, r) => {
    let i = [n, { code: t, ...(r || {}) }];
    if (e?.services?.logger?.forward)
      return e.services.logger.forward(i, `warn`, `react-i18next::`, !0);
    (j(i[0]) && (i[0] = `react-i18next:: ${i[0]}`),
      e?.services?.logger?.warn
        ? e.services.logger.warn(...i)
        : console?.warn && console.warn(...i));
  },
  ze = {},
  Be = (e, t, n, r) => {
    (j(n) && ze[n]) || (j(n) && (ze[n] = new Date()), Re(e, t, n, r));
  },
  Ve = (e, t) => () => {
    if (e.isInitialized) t();
    else {
      let n = () => {
        (setTimeout(() => {
          e.off(`initialized`, n);
        }, 0),
          t());
      };
      e.on(`initialized`, n);
    }
  },
  He = (e, t, n) => {
    e.loadNamespaces(t, Ve(e, n));
  },
  Ue = (e, t, n, r) => {
    if (
      (j(n) && (n = [n]),
      e.options.preload && e.options.preload.indexOf(t) > -1)
    )
      return He(e, n, r);
    (n.forEach((t) => {
      e.options.ns.indexOf(t) < 0 && e.options.ns.push(t);
    }),
      e.loadLanguages(t, Ve(e, r)));
  },
  We = (e, t, n = {}) =>
    !t.languages || !t.languages.length
      ? (Be(t, `NO_LANGUAGES`, `i18n.languages were undefined or empty`, {
          languages: t.languages,
        }),
        !0)
      : t.hasLoadedNamespace(e, {
          lng: n.lng,
          precheck: (t, r) => {
            if (
              n.bindI18n &&
              n.bindI18n.indexOf(`languageChanging`) > -1 &&
              t.services.backendConnector.backend &&
              t.isLanguageChangingTo &&
              !r(t.isLanguageChangingTo, e)
            )
              return !1;
          },
        }),
  j = (e) => typeof e == `string`,
  Ge = (e) => typeof e == `object` && !!e,
  Ke =
    /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,
  qe = {
    "&amp;": `&`,
    "&#38;": `&`,
    "&lt;": `<`,
    "&#60;": `<`,
    "&gt;": `>`,
    "&#62;": `>`,
    "&apos;": `'`,
    "&#39;": `'`,
    "&quot;": `"`,
    "&#34;": `"`,
    "&nbsp;": ` `,
    "&#160;": ` `,
    "&copy;": `©`,
    "&#169;": `©`,
    "&reg;": `®`,
    "&#174;": `®`,
    "&hellip;": `…`,
    "&#8230;": `…`,
    "&#x2F;": `/`,
    "&#47;": `/`,
  },
  Je = (e) => qe[e],
  Ye = {
    bindI18n: `languageChanged`,
    bindI18nStore: ``,
    transEmptyNodeValue: ``,
    transSupportBasicHtmlNodes: !0,
    transWrapTextNodes: ``,
    transKeepBasicHtmlNodesFor: [`br`, `strong`, `i`, `p`],
    useSuspense: !0,
    unescape: (e) => e.replace(Ke, Je),
    transDefaultProps: void 0,
  },
  Xe = (e = {}) => {
    Ye = { ...Ye, ...e };
  },
  Ze = () => Ye,
  Qe,
  $e = (e) => {
    Qe = e;
  },
  et = () => Qe,
  tt = {
    type: `3rdParty`,
    init(e) {
      (Xe(e.options.react), $e(e));
    },
  },
  nt = (0, _.createContext)(),
  rt = class {
    constructor() {
      this.usedNamespaces = {};
    }
    addUsedNamespaces(e) {
      e.forEach((e) => {
        this.usedNamespaces[e] || (this.usedNamespaces[e] = !0);
      });
    }
    getUsedNamespaces() {
      return Object.keys(this.usedNamespaces);
    }
  },
  it = o((e) => {
    var t = u();
    function n(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
    }
    var r = typeof Object.is == `function` ? Object.is : n,
      i = t.useState,
      a = t.useEffect,
      o = t.useLayoutEffect,
      s = t.useDebugValue;
    function c(e, t) {
      var n = t(),
        r = i({ inst: { value: n, getSnapshot: t } }),
        c = r[0].inst,
        u = r[1];
      return (
        o(
          function () {
            ((c.value = n), (c.getSnapshot = t), l(c) && u({ inst: c }));
          },
          [e, n, t],
        ),
        a(
          function () {
            return (
              l(c) && u({ inst: c }),
              e(function () {
                l(c) && u({ inst: c });
              })
            );
          },
          [e],
        ),
        s(n),
        n
      );
    }
    function l(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !r(e, n);
      } catch {
        return !0;
      }
    }
    function d(e, t) {
      return t();
    }
    var f =
      typeof window > `u` ||
      window.document === void 0 ||
      window.document.createElement === void 0
        ? d
        : c;
    e.useSyncExternalStore =
      t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore;
  }),
  at = o((e, t) => {
    t.exports = it();
  })(),
  ot = {
    t: (e, t) => {
      if (j(t)) return t;
      if (Ge(t) && j(t.defaultValue)) return t.defaultValue;
      if (typeof e == `function`) return ``;
      if (Array.isArray(e)) {
        let t = e[e.length - 1];
        return typeof t == `function` ? `` : t;
      }
      return e;
    },
    ready: !1,
  },
  st = () => () => {},
  M = (e, t = {}) => {
    let { i18n: n } = t,
      { i18n: r, defaultNS: i } = (0, _.useContext)(nt) || {},
      a = n || r || et();
    (a && !a.reportNamespaces && (a.reportNamespaces = new rt()),
      a ||
        Be(
          a,
          `NO_I18NEXT_INSTANCE`,
          `useTranslation: You will need to pass in an i18next instance by using initReactI18next`,
        ));
    let o = (0, _.useMemo)(
        () => ({ ...Ze(), ...a?.options?.react, ...t }),
        [a, t],
      ),
      { useSuspense: s, keyPrefix: c } = o,
      l = e || i || a?.options?.defaultNS,
      u = j(l) ? [l] : l || [`translation`],
      d = (0, _.useMemo)(() => u, u);
    a?.reportNamespaces?.addUsedNamespaces?.(d);
    let f = (0, _.useRef)(0),
      p = (0, _.useCallback)(
        (e) => {
          if (!a) return st;
          let { bindI18n: t, bindI18nStore: n } = o,
            r = () => {
              ((f.current += 1), e());
            };
          return (
            t && a.on(t, r),
            n && a.store.on(n, r),
            () => {
              (t && t.split(` `).forEach((e) => a.off(e, r)),
                n && n.split(` `).forEach((e) => a.store.off(e, r)));
            }
          );
        },
        [a, o],
      ),
      m = (0, _.useRef)(),
      h = (0, _.useCallback)(() => {
        if (!a) return ot;
        let e =
            !!(a.isInitialized || a.initializedStoreOnce) &&
            d.every((e) => We(e, a, o)),
          n = t.lng || a.language,
          r = f.current,
          i = m.current;
        if (
          i &&
          i.ready === e &&
          i.lng === n &&
          i.keyPrefix === c &&
          i.revision === r
        )
          return i;
        let s = {
          t: a.getFixedT(n, o.nsMode === `fallback` ? d : d[0], c),
          ready: e,
          lng: n,
          keyPrefix: c,
          revision: r,
        };
        return ((m.current = s), s);
      }, [a, d, c, o, t.lng]),
      [g, v] = (0, _.useState)(0),
      { t: y, ready: b } = (0, at.useSyncExternalStore)(p, h, h);
    (0, _.useEffect)(() => {
      if (a && !b && !s) {
        let e = () => v((e) => e + 1);
        t.lng ? Ue(a, t.lng, d, e) : He(a, d, e);
      }
    }, [a, t.lng, d, b, s, g]);
    let x = a || {},
      S = (0, _.useRef)(null),
      C = (0, _.useRef)(),
      w = (e) => {
        let t = Object.getOwnPropertyDescriptors(e);
        t.__original && delete t.__original;
        let n = Object.create(Object.getPrototypeOf(e), t);
        if (!Object.prototype.hasOwnProperty.call(n, `__original`))
          try {
            Object.defineProperty(n, `__original`, {
              value: e,
              writable: !1,
              enumerable: !1,
              configurable: !1,
            });
          } catch {}
        return n;
      },
      ee = (0, _.useMemo)(() => {
        let e = x,
          t = e?.language,
          n = e;
        e &&
          (S.current && S.current.__original === e && C.current === t
            ? (n = S.current)
            : ((n = w(e)), (S.current = n), (C.current = t)));
        let r =
            !b && !s
              ? (...e) => (
                  Be(
                    a,
                    `USE_T_BEFORE_READY`,
                    `useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t.`,
                  ),
                  y(...e)
                )
              : y,
          i = [r, n, b];
        return ((i.t = r), (i.i18n = n), (i.ready = b), i);
      }, [y, x, b, x.resolvedLanguage, x.language, x.languages]);
    if (a && s && !b)
      throw new Promise((e) => {
        let n = () => e();
        t.lng ? Ue(a, t.lng, d, n) : He(a, d, n);
      });
    return ee;
  },
  { slice: ct, forEach: lt } = [];
function ut(e) {
  return (
    lt.call(ct.call(arguments, 1), (t) => {
      if (t) for (let n in t) e[n] === void 0 && (e[n] = t[n]);
    }),
    e
  );
}
function dt(e) {
  return typeof e == `string`
    ? [
        /<\s*script.*?>/i,
        /<\s*\/\s*script\s*>/i,
        /<\s*img.*?on\w+\s*=/i,
        /<\s*\w+\s*on\w+\s*=.*?>/i,
        /javascript\s*:/i,
        /vbscript\s*:/i,
        /expression\s*\(/i,
        /eval\s*\(/i,
        /alert\s*\(/i,
        /document\.cookie/i,
        /document\.write\s*\(/i,
        /window\.location/i,
        /innerHTML/i,
      ].some((t) => t.test(e))
    : !1;
}
var ft = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/,
  pt = function (e, t) {
    let n =
        arguments.length > 2 && arguments[2] !== void 0
          ? arguments[2]
          : { path: `/` },
      r = `${e}=${encodeURIComponent(t)}`;
    if (n.maxAge > 0) {
      let e = n.maxAge - 0;
      if (Number.isNaN(e)) throw Error(`maxAge should be a Number`);
      r += `; Max-Age=${Math.floor(e)}`;
    }
    if (n.domain) {
      if (!ft.test(n.domain)) throw TypeError(`option domain is invalid`);
      r += `; Domain=${n.domain}`;
    }
    if (n.path) {
      if (!ft.test(n.path)) throw TypeError(`option path is invalid`);
      r += `; Path=${n.path}`;
    }
    if (n.expires) {
      if (typeof n.expires.toUTCString != `function`)
        throw TypeError(`option expires is invalid`);
      r += `; Expires=${n.expires.toUTCString()}`;
    }
    if (
      (n.httpOnly && (r += `; HttpOnly`),
      n.secure && (r += `; Secure`),
      n.sameSite)
    )
      switch (
        typeof n.sameSite == `string` ? n.sameSite.toLowerCase() : n.sameSite
      ) {
        case !0:
          r += `; SameSite=Strict`;
          break;
        case `lax`:
          r += `; SameSite=Lax`;
          break;
        case `strict`:
          r += `; SameSite=Strict`;
          break;
        case `none`:
          r += `; SameSite=None`;
          break;
        default:
          throw TypeError(`option sameSite is invalid`);
      }
    return (n.partitioned && (r += `; Partitioned`), r);
  },
  mt = {
    create(e, t, n, r) {
      let i =
        arguments.length > 4 && arguments[4] !== void 0
          ? arguments[4]
          : { path: `/`, sameSite: `strict` };
      (n &&
        ((i.expires = new Date()),
        i.expires.setTime(i.expires.getTime() + n * 60 * 1e3)),
        r && (i.domain = r),
        (document.cookie = pt(e, t, i)));
    },
    read(e) {
      let t = `${e}=`,
        n = document.cookie.split(`;`);
      for (let e = 0; e < n.length; e++) {
        let r = n[e];
        for (; r.charAt(0) === ` `; ) r = r.substring(1, r.length);
        if (r.indexOf(t) === 0) return r.substring(t.length, r.length);
      }
      return null;
    },
    remove(e, t) {
      this.create(e, ``, -1, t);
    },
  },
  ht = {
    name: `cookie`,
    lookup(e) {
      let { lookupCookie: t } = e;
      if (t && typeof document < `u`) return mt.read(t) || void 0;
    },
    cacheUserLanguage(e, t) {
      let {
        lookupCookie: n,
        cookieMinutes: r,
        cookieDomain: i,
        cookieOptions: a,
      } = t;
      n && typeof document < `u` && mt.create(n, e, r, i, a);
    },
  },
  gt = {
    name: `querystring`,
    lookup(e) {
      let { lookupQuerystring: t } = e,
        n;
      if (typeof window < `u`) {
        let { search: e } = window.location;
        !window.location.search &&
          window.location.hash?.indexOf(`?`) > -1 &&
          (e = window.location.hash.substring(
            window.location.hash.indexOf(`?`),
          ));
        let r = e.substring(1).split(`&`);
        for (let e = 0; e < r.length; e++) {
          let i = r[e].indexOf(`=`);
          i > 0 && r[e].substring(0, i) === t && (n = r[e].substring(i + 1));
        }
      }
      return n;
    },
  },
  _t = {
    name: `hash`,
    lookup(e) {
      let { lookupHash: t, lookupFromHashIndex: n } = e,
        r;
      if (typeof window < `u`) {
        let { hash: e } = window.location;
        if (e && e.length > 2) {
          let i = e.substring(1);
          if (t) {
            let e = i.split(`&`);
            for (let n = 0; n < e.length; n++) {
              let i = e[n].indexOf(`=`);
              i > 0 &&
                e[n].substring(0, i) === t &&
                (r = e[n].substring(i + 1));
            }
          }
          if (r) return r;
          if (!r && n > -1) {
            let t = e.match(/\/([a-zA-Z-]*)/g);
            return Array.isArray(t)
              ? t[typeof n == `number` ? n : 0]?.replace(`/`, ``)
              : void 0;
          }
        }
      }
      return r;
    },
  },
  vt = null,
  yt = () => {
    if (vt !== null) return vt;
    try {
      if (((vt = typeof window < `u` && window.localStorage !== null), !vt))
        return !1;
      let e = `i18next.translate.boo`;
      (window.localStorage.setItem(e, `foo`),
        window.localStorage.removeItem(e));
    } catch {
      vt = !1;
    }
    return vt;
  },
  bt = {
    name: `localStorage`,
    lookup(e) {
      let { lookupLocalStorage: t } = e;
      if (t && yt()) return window.localStorage.getItem(t) || void 0;
    },
    cacheUserLanguage(e, t) {
      let { lookupLocalStorage: n } = t;
      n && yt() && window.localStorage.setItem(n, e);
    },
  },
  xt = null,
  St = () => {
    if (xt !== null) return xt;
    try {
      if (((xt = typeof window < `u` && window.sessionStorage !== null), !xt))
        return !1;
      let e = `i18next.translate.boo`;
      (window.sessionStorage.setItem(e, `foo`),
        window.sessionStorage.removeItem(e));
    } catch {
      xt = !1;
    }
    return xt;
  },
  Ct = {
    name: `sessionStorage`,
    lookup(e) {
      let { lookupSessionStorage: t } = e;
      if (t && St()) return window.sessionStorage.getItem(t) || void 0;
    },
    cacheUserLanguage(e, t) {
      let { lookupSessionStorage: n } = t;
      n && St() && window.sessionStorage.setItem(n, e);
    },
  },
  wt = {
    name: `navigator`,
    lookup(e) {
      let t = [];
      if (typeof navigator < `u`) {
        let { languages: e, userLanguage: n, language: r } = navigator;
        if (e) for (let n = 0; n < e.length; n++) t.push(e[n]);
        (n && t.push(n), r && t.push(r));
      }
      return t.length > 0 ? t : void 0;
    },
  },
  Tt = {
    name: `htmlTag`,
    lookup(e) {
      let { htmlTag: t } = e,
        n,
        r = t || (typeof document < `u` ? document.documentElement : null);
      return (
        r &&
          typeof r.getAttribute == `function` &&
          (n = r.getAttribute(`lang`)),
        n
      );
    },
  },
  Et = {
    name: `path`,
    lookup(e) {
      let { lookupFromPathIndex: t } = e;
      if (typeof window > `u`) return;
      let n = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
      if (Array.isArray(n))
        return n[typeof t == `number` ? t : 0]?.replace(`/`, ``);
    },
  },
  Dt = {
    name: `subdomain`,
    lookup(e) {
      let { lookupFromSubdomainIndex: t } = e,
        n = typeof t == `number` ? t + 1 : 1,
        r =
          typeof window < `u` &&
          window.location?.hostname?.match(
            /^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i,
          );
      if (r) return r[n];
    },
  },
  Ot = !1;
try {
  (document.cookie, (Ot = !0));
} catch {}
var kt = [
  `querystring`,
  `cookie`,
  `localStorage`,
  `sessionStorage`,
  `navigator`,
  `htmlTag`,
];
Ot || kt.splice(1, 1);
var At = () => ({
    order: kt,
    lookupQuerystring: `lng`,
    lookupCookie: `i18next`,
    lookupLocalStorage: `i18nextLng`,
    lookupSessionStorage: `i18nextLng`,
    caches: [`localStorage`],
    excludeCacheFor: [`cimode`],
    convertDetectedLanguage: (e) => e,
  }),
  jt = class {
    constructor(e) {
      let t =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      ((this.type = `languageDetector`),
        (this.detectors = {}),
        this.init(e, t));
    }
    init() {
      let e =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : { languageUtils: {} },
        t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      ((this.services = e),
        (this.options = ut(t, this.options || {}, At())),
        typeof this.options.convertDetectedLanguage == `string` &&
          this.options.convertDetectedLanguage.indexOf(`15897`) > -1 &&
          (this.options.convertDetectedLanguage = (e) => e.replace(`-`, `_`)),
        this.options.lookupFromUrlIndex &&
          (this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex),
        (this.i18nOptions = n),
        this.addDetector(ht),
        this.addDetector(gt),
        this.addDetector(bt),
        this.addDetector(Ct),
        this.addDetector(wt),
        this.addDetector(Tt),
        this.addDetector(Et),
        this.addDetector(Dt),
        this.addDetector(_t));
    }
    addDetector(e) {
      return ((this.detectors[e.name] = e), this);
    }
    detect() {
      let e =
          arguments.length > 0 && arguments[0] !== void 0
            ? arguments[0]
            : this.options.order,
        t = [];
      return (
        e.forEach((e) => {
          if (this.detectors[e]) {
            let n = this.detectors[e].lookup(this.options);
            (n && typeof n == `string` && (n = [n]), n && (t = t.concat(n)));
          }
        }),
        (t = t
          .filter((e) => e != null && !dt(e))
          .map((e) => this.options.convertDetectedLanguage(e))),
        this.services &&
        this.services.languageUtils &&
        this.services.languageUtils.getBestMatchFromCodes
          ? t
          : t.length > 0
            ? t[0]
            : null
      );
    }
    cacheUserLanguage(e) {
      let t =
        arguments.length > 1 && arguments[1] !== void 0
          ? arguments[1]
          : this.options.caches;
      t &&
        ((this.options.excludeCacheFor &&
          this.options.excludeCacheFor.indexOf(e) > -1) ||
          t.forEach((t) => {
            this.detectors[t] &&
              this.detectors[t].cacheUserLanguage(e, this.options);
          }));
    }
  };
((jt.type = `languageDetector`),
  A.use(jt)
    .use(tt)
    .init({
      resources: {
        vi: {
          translation: {
            setup: {
              title: `THIẾT LẬP`,
              playerCount: `Số người chơi`,
              roles: `Vai Trò`,
              library: `Thư Viện`,
              startGame: `BẮT ĐẦU GAME`,
              createCustomRole: `TẠO ROLE TÙY CHỈNH`,
              confirmDeleteRole: `Xóa vai {{name}}? Các người chơi đã gán sẽ mất vai.`,
              noTarget: `0`,
              willBeVillager: `role trùng lặp hoặc {{count}} sẽ là dân làng`,
              nightly: `Đêm`,
              limited: `Giới hạn`,
              addAbility: `Thêm kỹ năng`,
              noRoles: `Chưa có vai trò`,
              errorNameRequired: `Tên vai trò bắt buộc`,
              errorDuplicateName: `Tên đã tồn tại`,
              errorNeedAbility: `Cần ít nhất 1 kỹ năng`,
              errorMaxAbilities: `Đã đạt tối đa`,
              errorAbilityNameEmpty: `Kỹ năng {{index}}: tên trống`,
              errorAbilityTargetExceed: `Kỹ năng {{index}}: target > số người chơi`,
              roleName: `Tên vai trò`,
              roleNamePlaceholder: `Nhập tên...`,
              faction: `Phe`,
              abilities: `Kỹ năng`,
              abilityNamePlaceholder: `Tên kỹ năng`,
              nightOrder: `Thứ tự đêm`,
              targetCount: `Số mục tiêu`,
              usageLimit: `Giới hạn sử dụng`,
              skillType: `Loại kỹ năng`,
              defaultAbilityName: `Kỹ năng`,
            },
            game: {
              assignRole: `Gán Role`,
              useSkill: `Dùng Chiêu`,
              skills: `Kỹ năng`,
              usedSkills: `Đã sử dụng`,
              turn: `Lượt {{count}}`,
              endTurn: `Kết thúc Turn {{count}}?`,
              alive: `ĐANG SỐNG`,
              dead: `ĐÃ TỬ VONG`,
              villager: `Dân Làng`,
              history: `Lịch Sử`,
              noHistory: `Chưa có lịch sử`,
              debate: `Tranh Luận`,
              judgment: `Phán Quyết`,
              judgmentBtn: `Treo`,
              nextNight: `Qua Đêm`,
              kill: `Giết`,
              revive: `Hồi sinh`,
              chooseSource: `Chọn người thực hiện`,
              skip: `Bỏ qua`,
              noAbility: `Không kỹ năng`,
              actions: `Hành động`,
              undo: `Hoàn tác`,
              redo: `Làm lại`,
              deadSourceWarning: `Nguồn đã chết`,
              deadSourceConfirm: `{{name}} đã chết. Vẫn thực hiện {{ability}}?`,
              mute: `Tắt tiếng`,
              unmute: `Bật tiếng`,
              tapToSkip: `Chạm để bỏ qua`,
            },
            roles: {
              b_wolf: `Ma Sói`,
              b_seer: `Tiên Tri`,
              b_guard: `Bảo Vệ`,
              b_witch: `Phù Thủy`,
              b_hunter: `Thợ Săn`,
              b_cupid: `Cupid`,
              b_idiot: `Kẻ Khờ`,
              b_elder: `Già Làng`,
              a_silencer: `Pháp Sư Câm`,
              a_fox: `Người Cáo`,
              a_medium: `Người Gọi Hồn`,
              a_matchgirl: `Cô Bé Bán Diêm`,
              a_knight: `Hiệp Sĩ Kiếm`,
              a_rusty: `Hiệp Sĩ Rỉ Sét`,
              a_mayor: `Thị Trưởng`,
              a_mother: `Mẹ Trẻ`,
              a_chief: `Trưởng Làng`,
              a_lycan: `Người Hóa Sói`,
              a_wwolf: `Sói Trắng`,
              a_mwolf: `Sói Tiên Tri`,
              a_iwolf: `Sói Đen`,
              a_swolf: `Sói Tuyết`,
              a_cwolf: `Sói Con`,
              a_traitor: `Kẻ Phản Bội`,
              a_piper: `Kẻ Thổi Tiêu`,
              a_thief: `Kẻ Trộm`,
              a_assassin: `Sát Thủ`,
              a_sect: `Giáo Phái`,
              a_angel: `Thiên Thần`,
              a_half: `Bán Sói`,
              a_twins: `Cặp Sinh Đôi`,
              a_tanner: `Chán Đời`,
              a_godfather: `Trùm Mafia`,
              a_ucop: `Cảnh Sát Ngầm`,
              a_awolf: `Sói Ưu Tiên`,
              a_lwolf: `Sói Cô Đơn`,
              a_rwolf: `Sói Tuyển Dụng`,
              b_detective: `Thám Tử`,
              b_miller: `Nông Dân Giả`,
              a_psychic: `Nhà Ngoại Cảm`,
              a_tracker: `Theo Dõi Viên`,
              a_bodyguard: `Vệ Sĩ`,
              a_vigilante: `Dân Quân`,
              a_veteran: `Cựu Chiến Binh`,
              a_bomb: `Bom Nổ`,
              a_blocker: `Kẻ Phong Ấn`,
              a_jailer: `Cai Ngục`,
              a_nurse: `Y Tá`,
              a_priest: `Linh Mục`,
              a_lawyer: `Luật Sư`,
              a_doublevoter: `Cử Tri Kép`,
              a_baker: `Thợ Bánh`,
              a_oracle: `Tiên Tri Tối Thượng`,
              a_governor: `Thống Đốc`,
              a_coroner: `Pháp Y`,
              a_jester: `Gã Hề`,
              a_doppel: `Kẻ Giả Mạo`,
              a_witness: `Nhân Chứng`,
              a_littlegirl: `Cô Bé Nhỏ`,
              a_vampire: `Ma Cà Rồng`,
            },
            abilities: {
              bite: `Cắn`,
              see: `Soi`,
              protect: `Bảo vệ`,
              heal: `Cứu`,
              kill: `Giết`,
              shoot: `Bắn`,
              couple: `Ghép đôi`,
              killWolf: `Giết Sói`,
              infect: `Lây nhiễm`,
              freeze: `Đóng băng`,
              rageBite: `Cắn phẫn nộ`,
              silence: `Câm lặng`,
              see3: `Soi 3 người`,
              askRole: `Hỏi vai trò`,
              revokeVote: `Tước biểu quyết`,
              hypnotize: `Thôi miên`,
              stealRole: `Trộm Role`,
              assassinate: `Ám sát`,
              recruit: `Kết nạp`,
              nurture: `Nuôi dưỡng`,
              extraLives: `Nhiều mạng`,
              frame: `Đánh lừa`,
              convert: `Tuyển dụng`,
              investigate: `Điều tra`,
              readMind: `Đọc tâm trí`,
              track: `Theo dõi`,
              sacrifice: `Hy sinh`,
              execute: `Xử tử`,
              alert: `Cảnh giác`,
              block: `Phong ấn`,
              jail: `Giam giữ`,
              defend: `Bào chữa`,
              divineEye: `Thần nhãn`,
              resurrect: `Hồi sinh`,
              autopsy: `Khám nghiệm`,
              copyRole: `Sao chép`,
              peek: `Rình mò`,
              drain: `Hút máu`,
            },
            ability: {
              skill: `kỹ năng`,
              passive: `bị động`,
              night: `Đêm`,
              limited: `Lần`,
            },
            factions: { villager: `Dân`, wolf: `Sói`, third: `Phe 3` },
            history: {
              current: `Hiện tại`,
              pastTurns: `Lượt Trước`,
              actions: `hành động`,
            },
            pwa: {
              newMoon: `Trăng mới mọc...`,
              updateAvailable: `Bản cập nhật mới đã sẵn sàng!`,
              updateNow: `Cập nhật ngay`,
              later: `Để sau`,
            },
            library: {
              basicVillager: `Dân Cơ Bản`,
              basicWolf: `Sói Cơ Bản`,
              advancedVillager: `Dân Nâng Cao`,
              advancedWolf: `Sói Nâng Cao`,
              thirdParty: `Phe Thứ 3`,
              custom: `Tuỳ Chỉnh`,
            },
            settings: {
              cardView: `Chế độ xem thẻ`,
              debateTime: `Thời gian luận`,
              judgmentTime: `Thời gian treo`,
              title: `Cài Đặt`,
              resetGame: `Kết Thúc Game`,
              resetWarning: `Toàn bộ dữ liệu game sẽ bị xoá!`,
              nameFirst: `Tên trước`,
              roleFirst: `Role trước`,
              bothView: `Cả hai`,
              theme: `Giao diện`,
              dark: `Tối`,
              light: `Sáng`,
              language: `Ngôn ngữ`,
              muteSounds: `Tắt âm thanh`,
            },
            common: {
              confirm: `Xác nhận`,
              cancel: `Hủy`,
              close: `Đóng`,
              save: `Lưu`,
              delete: `Xoá`,
              back: `Quay lại`,
              systemError: `Lỗi Hệ Thống`,
              errorOccurred: `Đã xảy ra lỗi. Vui lòng tải lại trang.`,
              reloadPage: `TẢI LẠI TRANG`,
              resume: `Tiếp tục`,
              pause: `Tạm dừng`,
              stop: `Dừng`,
              playerOptions: `Tùy chọn người chơi`,
            },
          },
        },
        en: {
          translation: {
            setup: {
              title: `SETUP`,
              playerCount: `Player Count`,
              roles: `Roles`,
              library: `Library`,
              startGame: `START GAME`,
              createCustomRole: `CREATE CUSTOM ROLE`,
              confirmDeleteRole: `Delete role {{name}}? Assigned players will lose their role.`,
              noTarget: `0`,
              willBeVillager: `duplicate roles or {{count}} will be Villager`,
              nightly: `Nightly`,
              limited: `Limited`,
              addAbility: `Add Ability`,
              noRoles: `No roles added`,
              errorNameRequired: `Role name required`,
              errorDuplicateName: `Duplicate name`,
              errorNeedAbility: `Need at least 1 ability`,
              errorMaxAbilities: `Max abilities reached`,
              errorAbilityNameEmpty: `Ability {{index}}: name empty`,
              errorAbilityTargetExceed: `Ability {{index}}: target > player count`,
              roleName: `Role name`,
              roleNamePlaceholder: `Enter name...`,
              faction: `Faction`,
              abilities: `Abilities`,
              abilityNamePlaceholder: `Ability name`,
              nightOrder: `Night order`,
              targetCount: `Target count`,
              usageLimit: `Usage limit`,
              skillType: `Skill type`,
              defaultAbilityName: `Ability`,
            },
            game: {
              assignRole: `Assign Role`,
              useSkill: `Use Skill`,
              skills: `Skills`,
              usedSkills: `Used`,
              turn: `Turn {{count}}`,
              endTurn: `End Turn {{count}}?`,
              alive: `ALIVE`,
              dead: `DEAD`,
              villager: `Villager`,
              history: `History`,
              noHistory: `No history yet`,
              debate: `Debate`,
              judgment: `Judgment`,
              judgmentBtn: `Judge`,
              nextNight: `Next Night`,
              kill: `Kill`,
              revive: `Revive`,
              chooseSource: `Choose performer`,
              skip: `Skip`,
              noAbility: `No abilities`,
              actions: `Actions`,
              undo: `Undo`,
              redo: `Redo`,
              deadSourceWarning: `Dead source`,
              deadSourceConfirm: `{{name}} is dead. Still perform {{ability}}?`,
              mute: `Mute`,
              unmute: `Unmute`,
              tapToSkip: `Tap to skip`,
            },
            roles: {
              b_wolf: `Werewolf`,
              b_seer: `Seer`,
              b_guard: `Guard`,
              b_witch: `Witch`,
              b_hunter: `Hunter`,
              b_cupid: `Cupid`,
              b_idiot: `Idiot`,
              b_elder: `Elder`,
              a_silencer: `Silencer`,
              a_fox: `Fox`,
              a_medium: `Medium`,
              a_matchgirl: `Match Girl`,
              a_knight: `Knight`,
              a_rusty: `Rusty Knight`,
              a_mayor: `Mayor`,
              a_mother: `Young Mother`,
              a_chief: `Chief`,
              a_lycan: `Lycan`,
              a_wwolf: `White Wolf`,
              a_mwolf: `Seer Wolf`,
              a_iwolf: `Dark Wolf`,
              a_swolf: `Snow Wolf`,
              a_cwolf: `Wolf Cub`,
              a_traitor: `Traitor`,
              a_piper: `Pied Piper`,
              a_thief: `Thief`,
              a_assassin: `Assassin`,
              a_sect: `Sect Leader`,
              a_angel: `Angel`,
              a_half: `Half Wolf`,
              a_twins: `Twins`,
              a_tanner: `Tanner`,
              a_godfather: `Godfather`,
              a_ucop: `Undercover Cop`,
              a_awolf: `Alpha Wolf`,
              a_lwolf: `Lone Wolf`,
              a_rwolf: `Recruiter Wolf`,
              b_detective: `Detective`,
              b_miller: `Miller`,
              a_psychic: `Psychic`,
              a_tracker: `Tracker`,
              a_bodyguard: `Bodyguard`,
              a_vigilante: `Vigilante`,
              a_veteran: `Veteran`,
              a_bomb: `Bomb`,
              a_blocker: `Role Blocker`,
              a_jailer: `Jailer`,
              a_nurse: `Nurse`,
              a_priest: `Priest`,
              a_lawyer: `Lawyer`,
              a_doublevoter: `Double Voter`,
              a_baker: `Baker`,
              a_oracle: `Oracle`,
              a_governor: `Governor`,
              a_coroner: `Coroner`,
              a_jester: `Jester`,
              a_doppel: `Doppelgänger`,
              a_witness: `Witness`,
              a_littlegirl: `Little Girl`,
              a_vampire: `Vampire`,
            },
            abilities: {
              bite: `Bite`,
              see: `See`,
              protect: `Protect`,
              heal: `Heal`,
              kill: `Kill`,
              shoot: `Shoot`,
              couple: `Couple`,
              killWolf: `Kill Wolf`,
              infect: `Infect`,
              freeze: `Freeze`,
              rageBite: `Rage Bite`,
              silence: `Silence`,
              see3: `See 3 Players`,
              askRole: `Ask Role`,
              revokeVote: `Revoke Vote`,
              hypnotize: `Hypnotize`,
              stealRole: `Steal Role`,
              assassinate: `Assassinate`,
              recruit: `Recruit`,
              nurture: `Nurture`,
              extraLives: `Extra Lives`,
              frame: `Frame`,
              convert: `Convert`,
              investigate: `Investigate`,
              readMind: `Read Mind`,
              track: `Track`,
              sacrifice: `Sacrifice`,
              execute: `Execute`,
              alert: `Alert`,
              block: `Block`,
              jail: `Jail`,
              defend: `Defend`,
              divineEye: `Divine Eye`,
              resurrect: `Resurrect`,
              autopsy: `Autopsy`,
              copyRole: `Copy Role`,
              peek: `Peek`,
              drain: `Drain`,
            },
            ability: {
              skill: `skill`,
              passive: `passive`,
              night: `Night`,
              limited: `Limited`,
            },
            factions: { villager: `Village`, wolf: `Wolf`, third: `Third` },
            history: {
              current: `Current`,
              pastTurns: `Past Turns`,
              actions: `actions`,
            },
            pwa: {
              newMoon: `A new moon rises...`,
              updateAvailable: `Update available!`,
              updateNow: `Update Now`,
              later: `Later`,
            },
            library: {
              basicVillager: `Basic Villager`,
              basicWolf: `Basic Wolf`,
              advancedVillager: `Advanced Villager`,
              advancedWolf: `Advanced Wolf`,
              thirdParty: `Third Party`,
              custom: `Custom`,
            },
            settings: {
              cardView: `Card View Mode`,
              debateTime: `Debate Time`,
              judgmentTime: `Judgment Time`,
              title: `Settings`,
              resetGame: `Reset Game`,
              resetWarning: `All game data will be deleted!`,
              nameFirst: `Name First`,
              roleFirst: `Role First`,
              bothView: `Both`,
              theme: `Theme`,
              dark: `Dark`,
              light: `Light`,
              language: `Language`,
              muteSounds: `Mute sounds`,
            },
            common: {
              confirm: `Confirm`,
              cancel: `Cancel`,
              close: `Close`,
              save: `Save`,
              delete: `Delete`,
              back: `Back`,
              systemError: `System Error`,
              errorOccurred: `An error occurred. Please reload the page.`,
              reloadPage: `RELOAD PAGE`,
              resume: `Resume`,
              pause: `Pause`,
              stop: `Stop`,
              playerOptions: `Player options`,
            },
          },
        },
      },
      fallbackLng: `vi`,
      interpolation: { escapeValue: !1 },
    }));
var Mt = A,
  Nt = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.fragment`);
    function r(e, n, r) {
      var i = null;
      if (
        (r !== void 0 && (i = `` + r),
        n.key !== void 0 && (i = `` + n.key),
        `key` in n)
      )
        for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a]);
      else r = n;
      return (
        (n = r.ref),
        { $$typeof: t, type: e, key: i, ref: n === void 0 ? null : n, props: r }
      );
    }
    ((e.Fragment = n), (e.jsx = r), (e.jsxs = r));
  }),
  N = o((e, t) => {
    t.exports = Nt();
  })(),
  Pt = class extends _.Component {
    constructor(e) {
      (super(e), (this.state = { hasError: !1, error: null }));
    }
    static getDerivedStateFromError(e) {
      return { hasError: !0, error: e };
    }
    componentDidCatch(e, t) {
      console.error(`ErrorBoundary caught:`, e, t);
    }
    render() {
      return this.state.hasError
        ? (0, N.jsxs)(`div`, {
            role: `alert`,
            className: `p-6 bg-red-950 text-white h-screen font-mono text-xs overflow-auto`,
            children: [
              (0, N.jsx)(`h2`, {
                className: `text-xl font-bold mb-4`,
                children: Mt.t(`common.systemError`, `Lỗi Hệ Thống`),
              }),
              !1,
              (0, N.jsx)(`p`, {
                className: `mb-4`,
                children: Mt.t(
                  `common.errorOccurred`,
                  `Đã xảy ra lỗi. Vui lòng tải lại trang.`,
                ),
              }),
              (0, N.jsx)(`button`, {
                onClick: () => window.location.reload(),
                className: `mt-4 p-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition`,
                children: Mt.t(`common.reloadPage`, `TẢI LẠI TRANG`),
              }),
            ],
          })
        : this.props.children;
    }
  },
  Ft = (...e) =>
    e
      .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
      .join(` `)
      .trim(),
  It = (e) => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase(),
  Lt = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) =>
      n ? n.toUpperCase() : t.toLowerCase(),
    ),
  Rt = (e) => {
    let t = Lt(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  zt = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    strokeWidth: 2,
    strokeLinecap: `round`,
    strokeLinejoin: `round`,
  },
  Bt = (e) => {
    for (let t in e)
      if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
    return !1;
  },
  Vt = (0, _.createContext)({}),
  Ht = () => (0, _.useContext)(Vt),
  Ut = (0, _.forwardRef)(
    (
      {
        color: e,
        size: t,
        strokeWidth: n,
        absoluteStrokeWidth: r,
        className: i = ``,
        children: a,
        iconNode: o,
        ...s
      },
      c,
    ) => {
      let {
          size: l = 24,
          strokeWidth: u = 2,
          absoluteStrokeWidth: d = !1,
          color: f = `currentColor`,
          className: p = ``,
        } = Ht() ?? {},
        m = (r ?? d) ? (Number(n ?? u) * 24) / Number(t ?? l) : (n ?? u);
      return (0, _.createElement)(
        `svg`,
        {
          ref: c,
          ...zt,
          width: t ?? l ?? zt.width,
          height: t ?? l ?? zt.height,
          stroke: e ?? f,
          strokeWidth: m,
          className: Ft(`lucide`, p, i),
          ...(!a && !Bt(s) && { "aria-hidden": `true` }),
          ...s,
        },
        [
          ...o.map(([e, t]) => (0, _.createElement)(e, t)),
          ...(Array.isArray(a) ? a : [a]),
        ],
      );
    },
  ),
  P = (e, t) => {
    let n = (0, _.forwardRef)(({ className: n, ...r }, i) =>
      (0, _.createElement)(Ut, {
        ref: i,
        iconNode: t,
        className: Ft(`lucide-${It(Rt(e))}`, `lucide-${e}`, n),
        ...r,
      }),
    );
    return ((n.displayName = Rt(e)), n);
  },
  Wt = P(`arrow-left-right`, [
    [`path`, { d: `M8 3 4 7l4 4`, key: `9rb6wj` }],
    [`path`, { d: `M4 7h16`, key: `6tx8e3` }],
    [`path`, { d: `m16 21 4-4-4-4`, key: `siv7j2` }],
    [`path`, { d: `M20 17H4`, key: `h6l3hr` }],
  ]),
  Gt = P(`arrow-left`, [
    [`path`, { d: `m12 19-7-7 7-7`, key: `1l729n` }],
    [`path`, { d: `M19 12H5`, key: `x3x0zl` }],
  ]),
  Kt = P(`arrow-right`, [
    [`path`, { d: `M5 12h14`, key: `1ays0h` }],
    [`path`, { d: `m12 5 7 7-7 7`, key: `xquz4c` }],
  ]),
  qt = P(`book-open`, [
    [`path`, { d: `M12 7v14`, key: `1akyts` }],
    [
      `path`,
      {
        d: `M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z`,
        key: `ruj8y`,
      },
    ],
  ]),
  Jt = P(`check`, [[`path`, { d: `M20 6 9 17l-5-5`, key: `1gmf2c` }]]),
  Yt = P(`chevron-down`, [[`path`, { d: `m6 9 6 6 6-6`, key: `qrunsl` }]]),
  Xt = P(`chevron-up`, [[`path`, { d: `m18 15-6-6-6 6`, key: `153udz` }]]),
  Zt = P(`circle-plus`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`path`, { d: `M8 12h8`, key: `1wcyev` }],
    [`path`, { d: `M12 8v8`, key: `napkw2` }],
  ]),
  Qt = P(`crosshair`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`line`, { x1: `22`, x2: `18`, y1: `12`, y2: `12`, key: `l9bcsi` }],
    [`line`, { x1: `6`, x2: `2`, y1: `12`, y2: `12`, key: `13hhkx` }],
    [`line`, { x1: `12`, x2: `12`, y1: `6`, y2: `2`, key: `10w3f3` }],
    [`line`, { x1: `12`, x2: `12`, y1: `22`, y2: `18`, key: `15g9kq` }],
  ]),
  $t = P(`drama`, [
    [`path`, { d: `M10 11h.01`, key: `d2at3l` }],
    [`path`, { d: `M14 6h.01`, key: `k028ub` }],
    [`path`, { d: `M18 6h.01`, key: `1v4wsw` }],
    [`path`, { d: `M6.5 13.1h.01`, key: `1748ia` }],
    [
      `path`,
      { d: `M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3`, key: `172yzv` },
    ],
    [`path`, { d: `M17.4 9.9c-.8.8-2 .8-2.8 0`, key: `1obv0w` }],
    [
      `path`,
      {
        d: `M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7`,
        key: `rqjl8i`,
      },
    ],
    [`path`, { d: `M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4`, key: `1mr6wy` }],
  ]),
  en = P(`ellipsis-vertical`, [
    [`circle`, { cx: `12`, cy: `12`, r: `1`, key: `41hilf` }],
    [`circle`, { cx: `12`, cy: `5`, r: `1`, key: `gxeob9` }],
    [`circle`, { cx: `12`, cy: `19`, r: `1`, key: `lyex9k` }],
  ]),
  tn = P(`gavel`, [
    [
      `path`,
      { d: `m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381`, key: `pgg06f` },
    ],
    [`path`, { d: `m16 16 6-6`, key: `vzrcl6` }],
    [`path`, { d: `m21.5 10.5-8-8`, key: `a17d9x` }],
    [`path`, { d: `m8 8 6-6`, key: `18bi4p` }],
    [`path`, { d: `m8.5 7.5 8 8`, key: `1oyaui` }],
  ]),
  nn = P(`hash`, [
    [`line`, { x1: `4`, x2: `20`, y1: `9`, y2: `9`, key: `4lhtct` }],
    [`line`, { x1: `4`, x2: `20`, y1: `15`, y2: `15`, key: `vyu0kd` }],
    [`line`, { x1: `10`, x2: `8`, y1: `3`, y2: `21`, key: `1ggp8o` }],
    [`line`, { x1: `16`, x2: `14`, y1: `3`, y2: `21`, key: `weycgp` }],
  ]),
  rn = P(`heart`, [
    [
      `path`,
      {
        d: `M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`,
        key: `mvr1a0`,
      },
    ],
  ]),
  an = P(`list`, [
    [`path`, { d: `M3 5h.01`, key: `18ugdj` }],
    [`path`, { d: `M3 12h.01`, key: `nlz23k` }],
    [`path`, { d: `M3 19h.01`, key: `noohij` }],
    [`path`, { d: `M8 5h13`, key: `1pao27` }],
    [`path`, { d: `M8 12h13`, key: `1za7za` }],
    [`path`, { d: `M8 19h13`, key: `m83p4d` }],
  ]),
  on = P(`lock`, [
    [
      `rect`,
      {
        width: `18`,
        height: `11`,
        x: `3`,
        y: `11`,
        rx: `2`,
        ry: `2`,
        key: `1w4ew1`,
      },
    ],
    [`path`, { d: `M7 11V7a5 5 0 0 1 10 0v4`, key: `fwvmzm` }],
  ]),
  sn = P(`message-square`, [
    [
      `path`,
      {
        d: `M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,
        key: `18887p`,
      },
    ],
  ]),
  cn = P(`moon`, [
    [
      `path`,
      {
        d: `M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`,
        key: `kfwtm`,
      },
    ],
  ]),
  ln = P(`pause`, [
    [
      `rect`,
      { x: `14`, y: `3`, width: `5`, height: `18`, rx: `1`, key: `kaeet6` },
    ],
    [
      `rect`,
      { x: `5`, y: `3`, width: `5`, height: `18`, rx: `1`, key: `1wsw3u` },
    ],
  ]),
  un = P(`play`, [
    [
      `path`,
      {
        d: `M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z`,
        key: `10ikf1`,
      },
    ],
  ]),
  dn = P(`plus`, [
    [`path`, { d: `M5 12h14`, key: `1ays0h` }],
    [`path`, { d: `M12 5v14`, key: `s699le` }],
  ]),
  fn = P(`settings`, [
    [
      `path`,
      {
        d: `M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,
        key: `1i5ecw`,
      },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
  ]),
  pn = P(`skull`, [
    [`path`, { d: `m12.5 17-.5-1-.5 1h1z`, key: `3me087` }],
    [
      `path`,
      {
        d: `M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z`,
        key: `1o5pge`,
      },
    ],
    [`circle`, { cx: `15`, cy: `12`, r: `1`, key: `1tmaij` }],
    [`circle`, { cx: `9`, cy: `12`, r: `1`, key: `1vctgf` }],
  ]),
  mn = P(`sparkles`, [
    [
      `path`,
      {
        d: `M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,
        key: `1s2grr`,
      },
    ],
    [`path`, { d: `M20 2v4`, key: `1rf3ol` }],
    [`path`, { d: `M22 4h-4`, key: `gwowj6` }],
    [`circle`, { cx: `4`, cy: `20`, r: `2`, key: `6kqj1y` }],
  ]),
  hn = P(`square`, [
    [
      `rect`,
      { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` },
    ],
  ]),
  gn = P(`trash-2`, [
    [`path`, { d: `M10 11v6`, key: `nco0om` }],
    [`path`, { d: `M14 11v6`, key: `outv1u` }],
    [`path`, { d: `M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`, key: `miytrc` }],
    [`path`, { d: `M3 6h18`, key: `d0wm0j` }],
    [`path`, { d: `M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`, key: `e791ji` }],
  ]),
  _n = P(`triangle-alert`, [
    [
      `path`,
      {
        d: `m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,
        key: `wmoenq`,
      },
    ],
    [`path`, { d: `M12 9v4`, key: `juzpu7` }],
    [`path`, { d: `M12 17h.01`, key: `p32p05` }],
  ]),
  vn = P(`undo-2`, [
    [`path`, { d: `M9 14 4 9l5-5`, key: `102s5s` }],
    [
      `path`,
      {
        d: `M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11`,
        key: `f3b9sd`,
      },
    ],
  ]),
  yn = P(`user`, [
    [`path`, { d: `M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`, key: `975kel` }],
    [`circle`, { cx: `12`, cy: `7`, r: `4`, key: `17ys0d` }],
  ]),
  bn = P(`users`, [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
    [`path`, { d: `M16 3.128a4 4 0 0 1 0 7.744`, key: `16gr8j` }],
    [`path`, { d: `M22 21v-2a4 4 0 0 0-3-3.87`, key: `kshegd` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
  ]),
  xn = P(`volume-2`, [
    [
      `path`,
      {
        d: `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,
        key: `uqj9uw`,
      },
    ],
    [`path`, { d: `M16 9a5 5 0 0 1 0 6`, key: `1q6k2b` }],
    [`path`, { d: `M19.364 18.364a9 9 0 0 0 0-12.728`, key: `ijwkga` }],
  ]),
  Sn = P(`volume-x`, [
    [
      `path`,
      {
        d: `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,
        key: `uqj9uw`,
      },
    ],
    [`line`, { x1: `22`, x2: `16`, y1: `9`, y2: `15`, key: `1ewh16` }],
    [`line`, { x1: `16`, x2: `22`, y1: `9`, y2: `15`, key: `5ykzw1` }],
  ]),
  Cn = P(`wand-sparkles`, [
    [
      `path`,
      {
        d: `m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72`,
        key: `ul74o6`,
      },
    ],
    [`path`, { d: `m14 7 3 3`, key: `1r5n42` }],
    [`path`, { d: `M5 6v4`, key: `ilb8ba` }],
    [`path`, { d: `M19 14v4`, key: `blhpug` }],
    [`path`, { d: `M10 2v2`, key: `7u0qdc` }],
    [`path`, { d: `M7 8H3`, key: `zfb6yr` }],
    [`path`, { d: `M21 16h-4`, key: `1cnmox` }],
    [`path`, { d: `M11 3H9`, key: `1obp7u` }],
  ]),
  wn = P(`x`, [
    [`path`, { d: `M18 6 6 18`, key: `1bl5f8` }],
    [`path`, { d: `m6 6 12 12`, key: `d8bk6v` }],
  ]),
  Tn = (e) => {
    let t,
      n = new Set(),
      r = (e, r) => {
        let i = typeof e == `function` ? e(t) : e;
        if (!Object.is(i, t)) {
          let e = t;
          ((t =
            (r ?? (typeof i != `object` || !i)) ? i : Object.assign({}, t, i)),
            n.forEach((n) => n(t, e)));
        }
      },
      i = () => t,
      a = {
        setState: r,
        getState: i,
        getInitialState: () => o,
        subscribe: (e) => (n.add(e), () => n.delete(e)),
      },
      o = (t = e(r, i, a));
    return a;
  },
  En = (e) => (e ? Tn(e) : Tn),
  Dn = (e) => e;
function On(e, t = Dn) {
  let n = _.useSyncExternalStore(
    e.subscribe,
    _.useCallback(() => t(e.getState()), [e, t]),
    _.useCallback(() => t(e.getInitialState()), [e, t]),
  );
  return (_.useDebugValue(n), n);
}
var kn = (e) => {
    let t = En(e),
      n = (e) => On(t, e);
    return (Object.assign(n, t), n);
  },
  An = (e) => (e ? kn(e) : kn);
function jn(e, t) {
  let n;
  try {
    n = e();
  } catch {
    return;
  }
  return {
    getItem: (e) => {
      let r = (e) => (e === null ? null : JSON.parse(e, t?.reviver)),
        i = n.getItem(e) ?? null;
      return i instanceof Promise ? i.then(r) : r(i);
    },
    setItem: (e, r) => n.setItem(e, JSON.stringify(r, t?.replacer)),
    removeItem: (e) => n.removeItem(e),
  };
}
var Mn = (e) => (t) => {
    try {
      let n = e(t);
      return n instanceof Promise
        ? n
        : {
            then(e) {
              return Mn(e)(n);
            },
            catch(e) {
              return this;
            },
          };
    } catch (e) {
      return {
        then(e) {
          return this;
        },
        catch(t) {
          return Mn(t)(e);
        },
      };
    }
  },
  Nn = (e, t) => (n, r, i) => {
    let a = {
        storage: jn(() => window.localStorage),
        partialize: (e) => e,
        version: 0,
        merge: (e, t) => ({ ...t, ...e }),
        ...t,
      },
      o = !1,
      s = 0,
      c = new Set(),
      l = new Set(),
      u = a.storage;
    if (!u)
      return e(
        (...e) => {
          (console.warn(
            `[zustand persist middleware] Unable to update item '${a.name}', the given storage is currently unavailable.`,
          ),
            n(...e));
        },
        r,
        i,
      );
    let d = () => {
        let e = a.partialize({ ...r() });
        return u.setItem(a.name, { state: e, version: a.version });
      },
      f = i.setState;
    i.setState = (e, t) => (f(e, t), d());
    let p = e((...e) => (n(...e), d()), r, i);
    i.getInitialState = () => p;
    let m,
      h = () => {
        if (!u) return;
        let e = ++s;
        ((o = !1), c.forEach((e) => e(r() ?? p)));
        let t = a.onRehydrateStorage?.call(a, r() ?? p) || void 0;
        return Mn(u.getItem.bind(u))(a.name)
          .then((e) => {
            if (e)
              if (typeof e.version == `number` && e.version !== a.version) {
                if (a.migrate) {
                  let t = a.migrate(e.state, e.version);
                  return t instanceof Promise
                    ? t.then((e) => [!0, e])
                    : [!0, t];
                }
                console.error(
                  `State loaded from storage couldn't be migrated since no migrate function was provided`,
                );
              } else return [!1, e.state];
            return [!1, void 0];
          })
          .then((t) => {
            if (e !== s) return;
            let [i, o] = t;
            if (((m = a.merge(o, r() ?? p)), n(m, !0), i)) return d();
          })
          .then(() => {
            e === s &&
              (t?.(r(), void 0), (m = r()), (o = !0), l.forEach((e) => e(m)));
          })
          .catch((n) => {
            e === s && t?.(void 0, n);
          });
      };
    return (
      (i.persist = {
        setOptions: (e) => {
          ((a = { ...a, ...e }), e.storage && (u = e.storage));
        },
        clearStorage: () => {
          u?.removeItem(a.name);
        },
        getOptions: () => a,
        rehydrate: () => h(),
        hasHydrated: () => o,
        onHydrate: (e) => (
          c.add(e),
          () => {
            c.delete(e);
          }
        ),
        onFinishHydration: (e) => (
          l.add(e),
          () => {
            l.delete(e);
          }
        ),
      }),
      a.skipHydration || h(),
      m || p
    );
  },
  Pn = [
    {
      id: `b_wolf`,
      name: `Ma Sói`,
      nameKey: `roles.b_wolf`,
      order: 6,
      category: `basic`,
      faction: `wolf`,
      abilities: [
        {
          id: `a1`,
          name: `Cắn`,
          nameKey: `abilities.bite`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_wwolf`,
      name: `Sói Trắng`,
      nameKey: `roles.a_wwolf`,
      order: 7,
      category: `advanced`,
      faction: `wolf`,
      abilities: [
        {
          id: `a8`,
          name: `Giết Sói`,
          nameKey: `abilities.killWolf`,
          type: `limited`,
          max: 2,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_mwolf`,
      name: `Sói Tiên Tri`,
      nameKey: `roles.a_mwolf`,
      order: 5,
      category: `advanced`,
      faction: `wolf`,
      abilities: [
        {
          id: `a9`,
          name: `Soi`,
          nameKey: `abilities.see`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_iwolf`,
      name: `Sói Đen`,
      nameKey: `roles.a_iwolf`,
      order: 8,
      category: `advanced`,
      faction: `wolf`,
      abilities: [
        {
          id: `a10`,
          name: `Lây nhiễm`,
          nameKey: `abilities.infect`,
          type: `limited`,
          max: 1,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_swolf`,
      name: `Sói Tuyết`,
      nameKey: `roles.a_swolf`,
      order: 8,
      category: `advanced`,
      faction: `wolf`,
      abilities: [
        {
          id: `a11`,
          name: `Đóng băng`,
          nameKey: `abilities.freeze`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_cwolf`,
      name: `Sói Con`,
      nameKey: `roles.a_cwolf`,
      order: 6,
      category: `advanced`,
      faction: `wolf`,
      abilities: [
        {
          id: `a22`,
          name: `Cắn phẫn nộ`,
          nameKey: `abilities.rageBite`,
          type: `limited`,
          max: 1,
          targetCount: 2,
        },
      ],
    },
    {
      id: `a_traitor`,
      name: `Kẻ Phản Bội`,
      nameKey: `roles.a_traitor`,
      order: 99,
      category: `advanced`,
      faction: `wolf`,
      abilities: [],
    },
    {
      id: `a_godfather`,
      name: `Trùm Mafia`,
      nameKey: `roles.a_godfather`,
      order: 7,
      category: `advanced`,
      faction: `wolf`,
      abilities: [],
    },
    {
      id: `a_ucop`,
      name: `Cảnh Sát Ngầm`,
      nameKey: `roles.a_ucop`,
      order: 6,
      category: `advanced`,
      faction: `wolf`,
      abilities: [],
    },
    {
      id: `a_awolf`,
      name: `Sói Ưu Tiên`,
      nameKey: `roles.a_awolf`,
      order: 4,
      category: `advanced`,
      faction: `wolf`,
      abilities: [
        {
          id: `a23`,
          name: `Đánh lừa`,
          nameKey: `abilities.frame`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_lwolf`,
      name: `Sói Cô Đơn`,
      nameKey: `roles.a_lwolf`,
      order: 8,
      category: `advanced`,
      faction: `wolf`,
      abilities: [],
    },
    {
      id: `a_rwolf`,
      name: `Sói Tuyển Dụng`,
      nameKey: `roles.a_rwolf`,
      order: 7,
      category: `advanced`,
      faction: `wolf`,
      abilities: [
        {
          id: `a24`,
          name: `Tuyển dụng`,
          nameKey: `abilities.convert`,
          type: `limited`,
          max: 2,
          targetCount: 1,
        },
      ],
    },
  ],
  Fn = [
    {
      id: `b_seer`,
      name: `Tiên Tri`,
      nameKey: `roles.b_seer`,
      order: 9,
      category: `basic`,
      faction: `villager`,
      abilities: [
        {
          id: `a2`,
          name: `Soi`,
          nameKey: `abilities.see`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `b_guard`,
      name: `Bảo Vệ`,
      nameKey: `roles.b_guard`,
      order: 11,
      category: `basic`,
      faction: `villager`,
      abilities: [
        {
          id: `a3`,
          name: `Bảo vệ`,
          nameKey: `abilities.protect`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `b_witch`,
      name: `Phù Thủy`,
      nameKey: `roles.b_witch`,
      order: 12,
      category: `basic`,
      faction: `villager`,
      abilities: [
        {
          id: `a4`,
          name: `Cứu`,
          nameKey: `abilities.heal`,
          type: `limited`,
          max: 1,
          targetCount: 1,
        },
        {
          id: `a5`,
          name: `Giết`,
          nameKey: `abilities.kill`,
          type: `limited`,
          max: 1,
          targetCount: 1,
        },
      ],
    },
    {
      id: `b_hunter`,
      name: `Thợ Săn`,
      nameKey: `roles.b_hunter`,
      order: 15,
      category: `basic`,
      faction: `villager`,
      abilities: [
        {
          id: `a6`,
          name: `Bắn`,
          nameKey: `abilities.shoot`,
          type: `limited`,
          max: 1,
          targetCount: 1,
        },
      ],
    },
    {
      id: `b_cupid`,
      name: `Cupid`,
      nameKey: `roles.b_cupid`,
      order: 2,
      category: `basic`,
      faction: `villager`,
      abilities: [
        {
          id: `a7`,
          name: `Ghép đôi`,
          nameKey: `abilities.couple`,
          type: `limited`,
          max: 1,
          targetCount: 2,
        },
      ],
    },
    {
      id: `b_idiot`,
      name: `Kẻ Khờ`,
      nameKey: `roles.b_idiot`,
      order: 99,
      category: `basic`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `b_elder`,
      name: `Già Làng`,
      nameKey: `roles.b_elder`,
      order: 99,
      category: `basic`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `b_detective`,
      name: `Thám Tử`,
      nameKey: `roles.b_detective`,
      order: 10,
      category: `basic`,
      faction: `villager`,
      abilities: [
        {
          id: `a25`,
          name: `Điều tra`,
          nameKey: `abilities.investigate`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `b_miller`,
      name: `Nông Dân Giả`,
      nameKey: `roles.b_miller`,
      order: 99,
      category: `basic`,
      faction: `villager`,
      abilities: [],
    },
  ],
  In = [
    {
      id: `a_silencer`,
      name: `Pháp Sư Câm`,
      nameKey: `roles.a_silencer`,
      order: 14,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a12`,
          name: `Câm lặng`,
          nameKey: `abilities.silence`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_fox`,
      name: `Người Cáo`,
      nameKey: `roles.a_fox`,
      order: 10,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a13`,
          name: `Soi 3 người`,
          nameKey: `abilities.see3`,
          type: `nightly`,
          max: 0,
          targetCount: 3,
        },
      ],
    },
    {
      id: `a_medium`,
      name: `Người Gọi Hồn`,
      nameKey: `roles.a_medium`,
      order: 16,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a14`,
          name: `Hỏi vai trò`,
          nameKey: `abilities.askRole`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_matchgirl`,
      name: `Cô Bé Bán Diêm`,
      nameKey: `roles.a_matchgirl`,
      order: 17,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a15`,
          name: `Tước biểu quyết`,
          nameKey: `abilities.revokeVote`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_knight`,
      name: `Hiệp Sĩ Kiếm`,
      nameKey: `roles.a_knight`,
      order: 99,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_rusty`,
      name: `Hiệp Sĩ Rỉ Sét`,
      nameKey: `roles.a_rusty`,
      order: 99,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_mayor`,
      name: `Thị Trưởng`,
      nameKey: `roles.a_mayor`,
      order: 99,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_mother`,
      name: `Mẹ Trẻ`,
      nameKey: `roles.a_mother`,
      order: 10,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a20`,
          name: `Nuôi dưỡng`,
          nameKey: `abilities.nurture`,
          type: `limited`,
          max: 1,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_chief`,
      name: `Trưởng Làng`,
      nameKey: `roles.a_chief`,
      order: 99,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a21`,
          name: `Nhiều mạng`,
          nameKey: `abilities.extraLives`,
          type: `limited`,
          max: 2,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_lycan`,
      name: `Người Hóa Sói`,
      nameKey: `roles.a_lycan`,
      order: 99,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_psychic`,
      name: `Nhà Ngoại Cảm`,
      nameKey: `roles.a_psychic`,
      order: 9,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a26`,
          name: `Đọc tâm trí`,
          nameKey: `abilities.readMind`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_tracker`,
      name: `Theo Dõi Viên`,
      nameKey: `roles.a_tracker`,
      order: 11,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a27`,
          name: `Theo dõi`,
          nameKey: `abilities.track`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_bodyguard`,
      name: `Vệ Sĩ`,
      nameKey: `roles.a_bodyguard`,
      order: 13,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a28`,
          name: `Hy sinh`,
          nameKey: `abilities.sacrifice`,
          type: `limited`,
          max: 3,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_vigilante`,
      name: `Dân Quân`,
      nameKey: `roles.a_vigilante`,
      order: 12,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a29`,
          name: `Xử tử`,
          nameKey: `abilities.execute`,
          type: `limited`,
          max: 3,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_veteran`,
      name: `Cựu Chiến Binh`,
      nameKey: `roles.a_veteran`,
      order: 14,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a30`,
          name: `Cảnh giác`,
          nameKey: `abilities.alert`,
          type: `limited`,
          max: 3,
          targetCount: 0,
        },
      ],
    },
    {
      id: `a_bomb`,
      name: `Bom Nổ`,
      nameKey: `roles.a_bomb`,
      order: 99,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_blocker`,
      name: `Kẻ Phong Ấn`,
      nameKey: `roles.a_blocker`,
      order: 13,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a31`,
          name: `Phong ấn`,
          nameKey: `abilities.block`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_jailer`,
      name: `Cai Ngục`,
      nameKey: `roles.a_jailer`,
      order: 11,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a32`,
          name: `Giam giữ`,
          nameKey: `abilities.jail`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_nurse`,
      name: `Y Tá`,
      nameKey: `roles.a_nurse`,
      order: 12,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_priest`,
      name: `Linh Mục`,
      nameKey: `roles.a_priest`,
      order: 16,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_lawyer`,
      name: `Luật Sư`,
      nameKey: `roles.a_lawyer`,
      order: 14,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a33`,
          name: `Bào chữa`,
          nameKey: `abilities.defend`,
          type: `limited`,
          max: 2,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_doublevoter`,
      name: `Cử Tri Kép`,
      nameKey: `roles.a_doublevoter`,
      order: 99,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_baker`,
      name: `Thợ Bánh`,
      nameKey: `roles.a_baker`,
      order: 17,
      category: `advanced`,
      faction: `villager`,
      abilities: [],
    },
    {
      id: `a_oracle`,
      name: `Tiên Tri Tối Thượng`,
      nameKey: `roles.a_oracle`,
      order: 9,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a34`,
          name: `Thần nhãn`,
          nameKey: `abilities.divineEye`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_governor`,
      name: `Thống Đốc`,
      nameKey: `roles.a_governor`,
      order: 99,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a35`,
          name: `Hồi sinh`,
          nameKey: `abilities.resurrect`,
          type: `limited`,
          max: 2,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_coroner`,
      name: `Pháp Y`,
      nameKey: `roles.a_coroner`,
      order: 16,
      category: `advanced`,
      faction: `villager`,
      abilities: [
        {
          id: `a36`,
          name: `Khám nghiệm`,
          nameKey: `abilities.autopsy`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
  ],
  Ln = [...Fn, ...In],
  Rn = [
    {
      id: `a_piper`,
      name: `Kẻ Thổi Tiêu`,
      nameKey: `roles.a_piper`,
      order: 13,
      category: `advanced`,
      faction: `third`,
      abilities: [
        {
          id: `a16`,
          name: `Thôi miên`,
          nameKey: `abilities.hypnotize`,
          type: `nightly`,
          max: 0,
          targetCount: 2,
        },
      ],
    },
    {
      id: `a_thief`,
      name: `Kẻ Trộm`,
      nameKey: `roles.a_thief`,
      order: 1,
      category: `advanced`,
      faction: `third`,
      abilities: [
        {
          id: `a17`,
          name: `Trộm Role`,
          nameKey: `abilities.stealRole`,
          type: `limited`,
          max: 1,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_assassin`,
      name: `Sát Thủ`,
      nameKey: `roles.a_assassin`,
      order: 18,
      category: `advanced`,
      faction: `third`,
      abilities: [
        {
          id: `a18`,
          name: `Ám sát`,
          nameKey: `abilities.assassinate`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_sect`,
      name: `Giáo Phái`,
      nameKey: `roles.a_sect`,
      order: 19,
      category: `advanced`,
      faction: `third`,
      abilities: [
        {
          id: `a19`,
          name: `Kết nạp`,
          nameKey: `abilities.recruit`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_angel`,
      name: `Thiên Thần`,
      nameKey: `roles.a_angel`,
      order: 99,
      category: `advanced`,
      faction: `third`,
      abilities: [],
    },
    {
      id: `a_half`,
      name: `Bán Sói`,
      nameKey: `roles.a_half`,
      order: 3,
      category: `advanced`,
      faction: `third`,
      abilities: [],
    },
    {
      id: `a_twins`,
      name: `Cặp Sinh Đôi`,
      nameKey: `roles.a_twins`,
      order: 4,
      category: `advanced`,
      faction: `third`,
      abilities: [],
    },
    {
      id: `a_tanner`,
      name: `Chán Đời`,
      nameKey: `roles.a_tanner`,
      order: 99,
      category: `advanced`,
      faction: `third`,
      abilities: [],
    },
    {
      id: `a_jester`,
      name: `Gã Hề`,
      nameKey: `roles.a_jester`,
      order: 99,
      category: `advanced`,
      faction: `third`,
      abilities: [],
    },
    {
      id: `a_doppel`,
      name: `Kẻ Giả Mạo`,
      nameKey: `roles.a_doppel`,
      order: 2,
      category: `advanced`,
      faction: `third`,
      abilities: [
        {
          id: `a37`,
          name: `Sao chép`,
          nameKey: `abilities.copyRole`,
          type: `limited`,
          max: 1,
          targetCount: 1,
        },
      ],
    },
    {
      id: `a_witness`,
      name: `Nhân Chứng`,
      nameKey: `roles.a_witness`,
      order: 3,
      category: `advanced`,
      faction: `third`,
      abilities: [],
    },
    {
      id: `a_littlegirl`,
      name: `Cô Bé Nhỏ`,
      nameKey: `roles.a_littlegirl`,
      order: 6,
      category: `advanced`,
      faction: `third`,
      abilities: [
        {
          id: `a38`,
          name: `Rình mò`,
          nameKey: `abilities.peek`,
          type: `nightly`,
          max: 0,
          targetCount: 0,
        },
      ],
    },
    {
      id: `a_vampire`,
      name: `Ma Cà Rồng`,
      nameKey: `roles.a_vampire`,
      order: 5,
      category: `advanced`,
      faction: `third`,
      abilities: [
        {
          id: `a39`,
          name: `Hút máu`,
          nameKey: `abilities.drain`,
          type: `nightly`,
          max: 0,
          targetCount: 1,
        },
      ],
    },
  ],
  zn = [...Pn, ...Ln, ...Rn].map((e) => ({ ...e, version: e.version ?? 1 })),
  Bn = [
    `b_wolf`,
    `b_seer`,
    `b_guard`,
    `b_witch`,
    `b_hunter`,
    `a_lycan`,
    `a_traitor`,
  ];
function Vn() {
  return typeof crypto < `u` && typeof crypto.randomUUID == `function`
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 11)}_${Math.random().toString(36).slice(2, 11)}`;
}
function Hn(e) {
  return Array.from({ length: e }, (e, t) => ({
    id: t + 1,
    name: `P${t + 1}`,
    roleId: null,
    alive: !0,
    abilityUsage: {},
  }));
}
function Un() {
  return [
    ...Bn.map((e) => zn.find((t) => t.id === e)).filter((e) => e !== null),
  ]
    .sort((e, t) => e.order - t.order)
    .map((e, t) => ({
      id: `init_${Date.now()}_${t}`,
      templateId: e.id,
      name: e.name,
      nameKey: e.nameKey,
      order: t + 1,
      faction: e.faction,
      abilities: e.abilities.map((e) => ({ ...e, id: `ab_${Vn()}` })),
    }));
}
function Wn(e, t) {
  return t > e.length
    ? [
        ...e,
        ...Array.from({ length: t - e.length }, (t, n) => ({
          id: e.length + n + 1,
          name: `P${e.length + n + 1}`,
          roleId: null,
          alive: !0,
          abilityUsage: {},
        })),
      ]
    : t < e.length
      ? e.slice(0, t).map((e) => e)
      : e;
}
function Gn(e, t, n, r, i) {
  if (e.size === 0)
    return {
      actionLog: t,
      statusChangeLog: n,
      roleChangeLog: r,
      flippedCards: i,
    };
  let a = { ...i };
  return (
    e.forEach((e) => delete a[e]),
    {
      actionLog: t.filter((t) => !e.has(t.sourceId) && !e.has(t.targetId)),
      statusChangeLog: n.filter((t) => !e.has(t.playerId)),
      roleChangeLog: r.filter((t) => !e.has(t.playerId)),
      flippedCards: a,
    }
  );
}
function Kn(e, t) {
  let n = Math.max(0, ...e.map((e) => e.order)),
    r = {
      id: Vn(),
      templateId: t.id,
      name: t.name,
      nameKey: t.nameKey,
      order: n + 1,
      faction: t.faction,
      abilities: t.abilities.map((e) => ({ ...e, id: `ab_${Vn()}` })),
    };
  return [...e, r];
}
function qn(e, t, n) {
  let r = `c_${Vn()}`,
    i = Math.max(0, ...t.map((e) => e.order)),
    a = {
      id: r,
      name: n.name,
      nameKey: `roles.${r}`,
      order: i + 1,
      category: `custom`,
      faction: n.faction,
      abilities: n.abilities,
    },
    o = {
      id: Vn(),
      templateId: r,
      name: n.name,
      order: i + 1,
      faction: n.faction,
      abilities: n.abilities.map((e) => ({ ...e, id: `ab_${Vn()}` })),
    };
  return { templates: [...e, a], roles: [...t, o] };
}
function Jn(e, t, n) {
  let r = [...e].sort((e, t) => e.order - t.order),
    i = r.findIndex((e) => e.id === t);
  if (i === -1 || i + 1 === n) return e;
  let [a] = r.splice(i, 1);
  return (r.splice(n - 1, 0, a), r.map((e, t) => ({ ...e, order: t + 1 })));
}
function Yn(e, t, n, r = !1) {
  let i = e.find((e) => e.id === t);
  return i
    ? !i.alive && !r
      ? { allowed: !1, reason: `dead_source` }
      : (n.type === `limited` || n.type === `nightly`) &&
          (i.abilityUsage[n.id] || 0) >= (n.type === `nightly` ? 1 : n.max)
        ? {
            allowed: !1,
            reason:
              n.type === `nightly` ? `already_used_night` : `limit_reached`,
          }
        : { allowed: !0 }
    : { allowed: !1 };
}
function Xn(e, t, n) {
  return Yn(e, t, n, !1);
}
function Zn(e, t, n, r, i, a, o, s = !1) {
  let c = Yn(e, n, r, s);
  if (!c.allowed)
    return { players: e, actionLog: t, blocked: !0, reason: c.reason };
  let l = e.map((e) => {
      if (e.id === n) {
        let t = e.abilityUsage[r.id] || 0;
        return { ...e, abilityUsage: { ...e.abilityUsage, [r.id]: t + 1 } };
      }
      return e;
    }),
    u = Vn(),
    d = Date.now(),
    f =
      i.length > 0
        ? i.map((e) => ({
            id: Vn(),
            executionId: u,
            turnAdded: o,
            sourceId: n,
            targetId: e,
            abilityId: r.id,
            abilityName: r.name,
            abilityNameKey: r.nameKey,
            abilityType: r.type,
            faction: a,
            timestamp: d,
          }))
        : [
            {
              id: Vn(),
              executionId: u,
              turnAdded: o,
              sourceId: n,
              targetId: n,
              abilityId: r.id,
              abilityName: r.name,
              abilityNameKey: r.nameKey,
              abilityType: r.type,
              faction: a,
              timestamp: d,
            },
          ];
  return { players: l, actionLog: [...t, ...f] };
}
function Qn(e, t, n) {
  let r = t.find((e) => e.id === n);
  if (!r) return { players: e, actionLog: t };
  let i = t.filter((e) => e.executionId === r.executionId),
    a = e.map((e) => {
      if (e.id === r.sourceId) {
        let t = e.abilityUsage[r.abilityId] || 1;
        return {
          ...e,
          abilityUsage: {
            ...e.abilityUsage,
            [r.abilityId]: Math.max(0, t - 1),
          },
        };
      }
      return e;
    }),
    o = new Set(i.map((e) => e.id));
  return { players: a, actionLog: t.filter((e) => !o.has(e.id)) };
}
function $n(e, t) {
  if (!e || !Array.isArray(e)) return [...t];
  let n = new Map(e.map((e) => [e.id, e])),
    r = [];
  for (let e of t) {
    let t = n.get(e.id);
    (t && (t.version ?? 0) >= (e.version ?? 0) ? r.push(t) : r.push(e),
      n.delete(e.id));
  }
  for (let e of n.values()) r.push(e);
  return r;
}
var er = 20;
function tr(e, t) {
  return [...e.slice(-(er - 1)), t];
}
function nr(e) {
  return e.length === 0
    ? { entry: void 0, remaining: e }
    : { entry: e[e.length - 1], remaining: e.slice(0, -1) };
}
function rr() {
  return {
    step: `setup`,
    playerCount: 10,
    players: Hn(10),
    roleTemplates: [...zn],
    roles: Un(),
    actionLog: [],
    statusChangeLog: [],
    roleChangeLog: [],
    gameHistory: [],
    nightCount: 1,
    timerSettings: { debate: 120, judgment: 30, muted: !1 },
    cardViewMode: `nameFirst`,
    flippedCards: {},
  };
}
var F = An()(
    Nn(
      (e) => ({
        step: `setup`,
        playerCount: 10,
        players: Hn(10),
        roleTemplates: [...zn],
        roles: Un(),
        actionLog: [],
        statusChangeLog: [],
        roleChangeLog: [],
        gameHistory: [],
        nightCount: 1,
        timerSettings: { debate: 120, judgment: 30, muted: !1 },
        cardViewMode: `nameFirst`,
        flippedCards: {},
        redoStack: [],
        setStep: (t) => e({ step: t }),
        handlePlayerCountChange: (t) =>
          e((e) => {
            let n = Wn(e.players, t);
            return t < e.players.length
              ? {
                  playerCount: t,
                  players: n,
                  ...Gn(
                    new Set(e.players.slice(t).map((e) => e.id)),
                    e.actionLog,
                    e.statusChangeLog,
                    e.roleChangeLog,
                    e.flippedCards,
                  ),
                }
              : { playerCount: t, players: n };
          }),
        updatePlayerName: (t, n) =>
          e((e) => ({
            players: e.players.map((e) => (e.id === t ? { ...e, name: n } : e)),
          })),
        togglePlayerStatus: (t) =>
          e((e) => {
            let n = e.players.find((e) => e.id === t);
            if (!n) return e;
            let r = !n.alive,
              i = e.players.map((e) => (e.id === t ? { ...e, alive: r } : e)),
              a = e.statusChangeLog.findIndex((e) => e.playerId === t),
              o = Date.now();
            return {
              players: i,
              statusChangeLog:
                a >= 0
                  ? e.statusChangeLog.map((e, n) =>
                      n === a ? { playerId: t, toStatus: r, timestamp: o } : e,
                    )
                  : [
                      ...e.statusChangeLog,
                      { playerId: t, toStatus: r, timestamp: o },
                    ],
            };
          }),
        addRoleFromTemplate: (t) => e((e) => ({ roles: Kn(e.roles, t) })),
        createCustomRole: (t) =>
          e((e) => {
            let n = qn(e.roleTemplates, e.roles, t);
            return { roleTemplates: n.templates, roles: n.roles };
          }),
        updateRoleName: (t, n) =>
          e((e) => ({
            roles: e.roles.map((e) => (e.id === t ? { ...e, name: n } : e)),
          })),
        changeRoleOrder: (t, n) => e((e) => ({ roles: Jn(e.roles, t, n) })),
        deleteRole: (t) =>
          e((e) => ({
            roles: e.roles.filter((e) => e.id !== t),
            players: e.players.map((e) =>
              e.roleId === t ? { ...e, roleId: null } : e,
            ),
            roleChangeLog: e.roleChangeLog.filter(
              (e) => e.fromRoleId !== t && e.toRoleId !== t,
            ),
          })),
        addAbility: (t) =>
          e((e) => ({
            roles: e.roles.map((e) =>
              e.id === t
                ? {
                    ...e,
                    abilities: [
                      ...e.abilities,
                      {
                        id: `ab_${Vn()}`,
                        name: Mt.t(`setup.defaultAbilityName`, `Ability`),
                        type: `nightly`,
                        max: 1,
                        targetCount: 1,
                      },
                    ],
                  }
                : e,
            ),
          })),
        updateAbility: (t, n, r, i) =>
          e((e) => ({
            roles: e.roles.map((e) =>
              e.id === t
                ? {
                    ...e,
                    abilities: e.abilities.map((e) =>
                      e.id === n ? { ...e, [r]: i } : e,
                    ),
                  }
                : e,
            ),
          })),
        deleteAbility: (t, n) =>
          e((e) => ({
            roles: e.roles.map((e) =>
              e.id === t
                ? { ...e, abilities: e.abilities.filter((e) => e.id !== n) }
                : e,
            ),
          })),
        togglePlayerRole: (t, n) =>
          e((e) => {
            let r = e.players.find((e) => e.id === t);
            if (!r) return e;
            let i = r.roleId === n ? null : n,
              a = e.roleChangeLog.find((e) => e.playerId === t),
              o = Date.now(),
              s;
            return (
              (s = a
                ? a.fromRoleId === i
                  ? e.roleChangeLog.filter((e) => e.playerId !== t)
                  : e.roleChangeLog.map((e) =>
                      e.playerId === t
                        ? { ...e, toRoleId: i, timestamp: o }
                        : e,
                    )
                : [
                    ...e.roleChangeLog,
                    {
                      playerId: t,
                      fromRoleId: r.roleId,
                      toRoleId: i,
                      timestamp: o,
                    },
                  ]),
              {
                players: e.players.map((e) =>
                  e.id === t ? { ...e, roleId: i } : e,
                ),
                roleChangeLog: s,
              }
            );
          }),
        executeAction: (t, n, r, i, a = !1) =>
          e((e) => {
            let o = e.roles.find((e) => e.id === i)?.faction ?? `villager`,
              s = Zn(e.players, e.actionLog, t, n, r, o, e.nightCount, a);
            return s.blocked
              ? e
              : { players: s.players, actionLog: s.actionLog, redoStack: [] };
          }),
        undoAction: (t) =>
          e((e) => {
            let n = e.actionLog.find((e) => e.id === t);
            if (!n) return e;
            let r = e.actionLog.filter((e) => e.executionId === n.executionId);
            if (r.length === 0) return e;
            let i = Qn(e.players, e.actionLog, t);
            if (i.players === e.players) return e;
            let a = {},
              o = n.sourceId;
            (a[o] || (a[o] = {}), (a[o][n.abilityId] = 1));
            let s = {
              type: `action_undo`,
              actionId: t,
              executionId: n.executionId,
              removedActions: r,
              usageDecrements: a,
            };
            return { ...i, redoStack: tr(e.redoStack, s) };
          }),
        redoAction: () =>
          e((e) => {
            let { entry: t, remaining: n } = nr(e.redoStack);
            return t
              ? {
                  actionLog: [...e.actionLog, ...t.removedActions],
                  players: e.players.map((e) => {
                    let n = t.usageDecrements[e.id];
                    if (!n) return e;
                    let r = { ...e.abilityUsage };
                    for (let [e, t] of Object.entries(n))
                      r[e] = (r[e] ?? 0) + t;
                    return { ...e, abilityUsage: r };
                  }),
                  redoStack: n,
                }
              : e;
          }),
        nextNight: () =>
          e((e) => {
            let t = e.actionLog.filter((t) => t.turnAdded === e.nightCount),
              n = {
                night: e.nightCount,
                endedAt: Date.now(),
                actionLogs: t,
                statusLogs: [...e.statusChangeLog],
                roleLogs: [...e.roleChangeLog],
              },
              r = new Map(e.roles.map((e) => [e.id, e])),
              i = e.players.map((e) => {
                if (!e.roleId) return e;
                let t = r.get(e.roleId);
                if (!t) return e;
                let n = {};
                for (let r of t.abilities)
                  n[r.id] =
                    r.type === `nightly` ? 0 : (e.abilityUsage[r.id] ?? 0);
                return { ...e, abilityUsage: n };
              });
            return {
              gameHistory: [...e.gameHistory, n],
              nightCount: e.nightCount + 1,
              actionLog: [],
              statusChangeLog: [],
              roleChangeLog: [],
              players: i,
              redoStack: [],
            };
          }),
        resetGame: () =>
          e((e) => ({
            step: `setup`,
            actionLog: [],
            statusChangeLog: [],
            roleChangeLog: [],
            gameHistory: [],
            nightCount: 1,
            undoStack: [],
            redoStack: [],
            players: e.players.map((e) => ({
              ...e,
              roleId: null,
              alive: !0,
              abilityUsage: {},
            })),
            roles: Un(),
            flippedCards: {},
          })),
        flipCard: (t) =>
          e((e) => {
            if (e.flippedCards[t]) {
              let { [t]: n, ...r } = e.flippedCards;
              return { flippedCards: r };
            }
            return { flippedCards: { ...e.flippedCards, [t]: !0 } };
          }),
        setCardViewMode: (t) => e({ cardViewMode: t }),
        setTimerSettings: (t) => e({ timerSettings: t }),
        deleteCustomTemplate: (t) =>
          e((e) => {
            let n = e.roles.filter((e) => e.templateId === t).map((e) => e.id),
              r = new Set(n);
            return {
              roleTemplates: e.roleTemplates.filter((e) => e.id !== t),
              roles: e.roles.filter((e) => e.templateId !== t),
              players: e.players.map((e) =>
                e.roleId && r.has(e.roleId) ? { ...e, roleId: null } : e,
              ),
              roleChangeLog: e.roleChangeLog.filter(
                (e) => !r.has(e.fromRoleId ?? ``) && !r.has(e.toRoleId ?? ``),
              ),
            };
          }),
      }),
      {
        name: `werewolf-game`,
        storage: jn(() => localStorage),
        version: 2,
        migrate: (e, t) => {
          try {
            let n = e;
            if (
              !n ||
              typeof n != `object` ||
              !Array.isArray(n.players) ||
              typeof n.nightCount != `number`
            )
              return rr();
            if (t === 0 || t === void 0) {
              (n.actionLog?.forEach((e) => {
                typeof e.executionId == `number` &&
                  (e.executionId = String(e.executionId));
              }),
                n.gameHistory?.forEach((e) => {
                  e.actionLogs?.forEach((e) => {
                    typeof e.executionId == `number` &&
                      (e.executionId = String(e.executionId));
                  });
                }));
              let e = Date.now();
              (n.statusChangeLog?.forEach((t) => {
                t.timestamp ??= e;
              }),
                n.roleChangeLog?.forEach((t) => {
                  t.timestamp ??= e;
                }));
            }
            return n;
          } catch {
            return rr();
          }
        },
        onRehydrateStorage: () => (e, t) => {
          if (t) {
            console.error(`Zustand rehydration failed:`, t);
            let e = `werewolf-reset-guard`;
            if (sessionStorage.getItem(e)) {
              (console.error(`Reset already attempted this session, skipping`),
                sessionStorage.removeItem(e));
              return;
            }
            (sessionStorage.setItem(e, `1`),
              localStorage.removeItem(`werewolf-game`),
              window.location.reload());
            return;
          }
          if (e) {
            let t = $n(e.roleTemplates, zn);
            F.setState({ roleTemplates: t });
          }
        },
        partialize: (e) => ({
          step: e.step,
          playerCount: e.playerCount,
          players: e.players,
          roleTemplates: e.roleTemplates,
          roles: e.roles,
          actionLog: e.actionLog,
          statusChangeLog: e.statusChangeLog,
          roleChangeLog: e.roleChangeLog,
          gameHistory: e.gameHistory.slice(-50),
          nightCount: e.nightCount,
          timerSettings: e.timerSettings,
          cardViewMode: e.cardViewMode,
        }),
      },
    ),
  ),
  ir = (0, _.memo)(function ({ id: e, name: t, onNameChange: n }) {
    return (0, N.jsx)(`input`, {
      type: `text`,
      value: t,
      onChange: (t) => n(e, t.target.value),
      className: `bg-bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary focus:ring-2 focus:ring-indigo-500 focus:outline-none`,
      "aria-label": `Player ${e}`,
    });
  });
function ar() {
  let { t: e } = M(),
    t = F((e) => e.playerCount),
    n = F((e) => e.players),
    r = F((e) => e.handlePlayerCountChange),
    i = F((e) => e.updatePlayerName),
    a = (0, _.useCallback)((e, t) => i(e, t), [i]);
  return (0, N.jsxs)(`div`, {
    className: `bg-bg-elevated rounded-2xl p-4 border border-border-default`,
    children: [
      (0, N.jsxs)(`div`, {
        className: `flex items-center justify-between mb-4`,
        children: [
          (0, N.jsx)(`label`, {
            htmlFor: `player-count`,
            className: `text-sm font-bold text-text-secondary uppercase tracking-wide`,
            children: e(`setup.playerCount`),
          }),
          (0, N.jsx)(`span`, {
            className: `bg-indigo-600 text-white text-sm font-black px-3 py-1 rounded-full min-w-[2.5rem] text-center`,
            children: t,
          }),
        ],
      }),
      (0, N.jsx)(`input`, {
        id: `player-count`,
        type: `range`,
        min: 4,
        max: 30,
        value: t,
        onChange: (e) => r(parseInt(e.target.value)),
        className: `w-full accent-indigo-600 mb-4`,
        "aria-valuetext": `${t} ${e(`setup.playerCount`)}`,
      }),
      (0, N.jsx)(`div`, {
        className: `grid grid-cols-2 md:grid-cols-3 gap-2`,
        children: n.map((e) =>
          (0, N.jsx)(ir, { id: e.id, name: e.name, onNameChange: a }, e.id),
        ),
      }),
    ],
  });
}
function or() {
  let e = F((e) => e.roles);
  return (0, _.useMemo)(() => {
    let t = new Map();
    return (e.forEach((e) => t.set(e.id, e)), t);
  }, [e]);
}
function sr() {
  let e = F((e) => e.actionLog),
    t = (0, _.useRef)(new Map());
  return (0, _.useMemo)(() => {
    let n = new Map();
    e.forEach((e) => {
      let t = n.get(e.targetId) || [];
      (t.push(e), n.set(e.targetId, t));
    });
    let r = t.current,
      i = new Map();
    for (let [e, t] of n) {
      let n = r.get(e);
      n && n.length === t.length && n.every((e, n) => e.id === t[n].id)
        ? i.set(e, n)
        : i.set(e, t);
    }
    return ((t.current = i), i);
  }, [e]);
}
function cr() {
  let e = F((e) => e.players);
  return (0, _.useCallback)((t, n) => Xn(e, t, n), [e]);
}
function lr() {
  let e = F((e) => e.roles);
  return (0, _.useMemo)(() => [...e].sort((e, t) => e.order - t.order), [e]);
}
function ur() {
  let e = F((e) => e.players),
    t = or();
  return (0, _.useMemo)(
    () =>
      [...e].sort(
        (e, n) =>
          (e.roleId ? (t.get(e.roleId)?.order ?? 999) : 999) -
            (n.roleId ? (t.get(n.roleId)?.order ?? 999) : 999) || e.id - n.id,
      ),
    [e, t],
  );
}
var dr = {
  villager: {
    border: `border-blue-400/30`,
    borderSolid: `border-blue-400`,
    bg: `bg-blue-600`,
    bgLight: `bg-blue-500/10`,
    text: `text-blue-400`,
    textBright: `text-blue-300`,
    badge: `bg-blue-600`,
    shadow: `shadow-card`,
    glow: `shadow-glow-villager`,
    gradient: `linear-gradient(145deg, #1e3a5f, #161631)`,
  },
  wolf: {
    border: `border-red-400/30`,
    borderSolid: `border-red-400`,
    bg: `bg-red-600`,
    bgLight: `bg-red-500/10`,
    text: `text-red-400`,
    textBright: `text-red-300`,
    badge: `bg-red-600`,
    shadow: `shadow-card`,
    glow: `shadow-glow-wolf`,
    gradient: `linear-gradient(145deg, #5f1e1e, #161631)`,
  },
  third: {
    border: `border-purple-400/30`,
    borderSolid: `border-purple-400`,
    bg: `bg-purple-600`,
    bgLight: `bg-purple-500/10`,
    text: `text-purple-400`,
    textBright: `text-purple-300`,
    badge: `bg-purple-600`,
    shadow: `shadow-card`,
    glow: `shadow-glow-third`,
    gradient: `linear-gradient(145deg, #1e1b4b, #161631)`,
  },
  dead: {
    border: `border-red-900/30`,
    borderSolid: `border-red-900`,
    bg: `bg-red-950`,
    bgLight: `bg-red-950/10`,
    text: `text-red-800`,
    textBright: `text-red-700`,
    badge: `bg-red-900`,
    shadow: `shadow-none`,
    glow: `shadow-none`,
    gradient: `linear-gradient(145deg, #450a0a, #0f0f23)`,
  },
};
function fr(e) {
  return dr[e] ?? dr.villager;
}
function pr({ onOpenSelector: e }) {
  let { t } = M(),
    n = lr(),
    r = F((e) => e.updateRoleName),
    i = F((e) => e.deleteRole),
    a = F((e) => e.addAbility),
    o = F((e) => e.updateAbility),
    s = F((e) => e.deleteAbility);
  return (0, N.jsxs)(`div`, {
    className: `space-y-3`,
    children: [
      n.map((n) => {
        let c = fr(n.faction);
        return (0, N.jsxs)(
          `article`,
          {
            "aria-label": n.name,
            className: `relative bg-bg-elevated rounded-xl p-3 border-l-4 ${c.borderSolid} border border-border-default`,
            children: [
              (0, N.jsx)(`button`, {
                onClick: () => {
                  confirm(
                    t(
                      `setup.confirmDeleteRole`,
                      `Xóa vai {{name}}? Các người chơi đã gán sẽ mất vai.`,
                    ).replace(`{{name}}`, n.name),
                  ) && i(n.id);
                },
                className: `absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700 transition z-10`,
                "aria-label": `${t(`common.delete`)} ${n.name}`,
                children: (0, N.jsx)(wn, { size: 10 }),
              }),
              (0, N.jsxs)(`div`, {
                className: `flex items-center gap-2 mb-2`,
                children: [
                  (0, N.jsx)(`button`, {
                    onClick: () =>
                      e({
                        type: `order`,
                        roleId: n.id,
                        abilityId: null,
                        currentValue: n.order,
                      }),
                    className: `w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0 hover:bg-indigo-700 transition`,
                    "aria-label": `Order ${n.order}`,
                    children: n.order,
                  }),
                  (0, N.jsx)(`input`, {
                    type: `text`,
                    value: n.name,
                    onChange: (e) => r(n.id, e.target.value),
                    className: `flex-1 bg-transparent border-b border-border-default px-1 py-0.5 text-sm font-bold ${c.text} focus:outline-none focus:border-indigo-500`,
                    "aria-label": `Role name`,
                  }),
                ],
              }),
              (0, N.jsxs)(`div`, {
                className: `space-y-1.5 ml-10`,
                children: [
                  n.abilities.map((r) =>
                    (0, N.jsxs)(
                      `div`,
                      {
                        className: `flex items-center gap-1.5 flex-wrap`,
                        children: [
                          (0, N.jsx)(`input`, {
                            type: `text`,
                            value: r.name,
                            onChange: (e) =>
                              o(n.id, r.id, `name`, e.target.value),
                            className: `flex-1 min-w-[80px] bg-bg-card border border-border-default rounded px-2 py-1 text-[11px] text-text-primary focus:outline-none focus:ring-1 focus:ring-indigo-500`,
                          }),
                          (0, N.jsx)(`button`, {
                            onClick: () =>
                              e({
                                type: `skillType`,
                                roleId: n.id,
                                abilityId: r.id,
                                currentValue: r.type,
                              }),
                            className: `bg-bg-elevated border border-border-default rounded px-2 py-1 text-[9px] font-bold text-text-secondary`,
                            children:
                              r.type === `nightly`
                                ? t(`setup.nightly`, `Đêm`)
                                : t(`setup.limited`, `Lần`),
                          }),
                          r.type === `limited` &&
                            (0, N.jsxs)(`button`, {
                              onClick: () =>
                                e({
                                  type: `max`,
                                  roleId: n.id,
                                  abilityId: r.id,
                                  currentValue: r.max,
                                }),
                              className: `bg-bg-elevated border border-border-default rounded px-2 py-1 text-[9px] font-bold text-text-secondary`,
                              children: [`x`, r.max],
                            }),
                          (0, N.jsxs)(`button`, {
                            onClick: () =>
                              e({
                                type: `targetCount`,
                                roleId: n.id,
                                abilityId: r.id,
                                currentValue: r.targetCount,
                              }),
                            className: `bg-bg-elevated border border-border-default rounded px-2 py-1 text-[9px] font-bold text-text-secondary`,
                            children: [
                              (0, N.jsx)(Qt, {
                                size: 10,
                                className: `mr-0.5 inline`,
                              }),
                              r.targetCount,
                            ],
                          }),
                          (0, N.jsx)(`button`, {
                            onClick: () => s(n.id, r.id),
                            className: `text-red-400 hover:text-red-600 text-xs p-1`,
                            "aria-label": `${t(`common.delete`)} ${r.name}`,
                            children: (0, N.jsx)(gn, { size: 10 }),
                          }),
                        ],
                      },
                      r.id,
                    ),
                  ),
                  n.abilities.length < 5 &&
                    (0, N.jsxs)(`button`, {
                      onClick: () => a(n.id),
                      className: `text-[10px] text-indigo-400 font-bold hover:underline`,
                      children: [
                        (0, N.jsx)(dn, { size: 10, className: `mr-1 inline` }),
                        t(`setup.addAbility`, `Thêm kỹ năng`),
                      ],
                    }),
                ],
              }),
            ],
          },
          n.id,
        );
      }),
      n.length === 0 &&
        (0, N.jsx)(`p`, {
          className: `text-center text-text-muted text-sm py-8 italic`,
          children: t(
            `setup.noRoles`,
            `Chưa có vai trò nào. Mở Thư Viện để thêm.`,
          ),
        }),
    ],
  });
}
var mr = 100,
  hr = 0.5;
function gr({
  isOpen: e,
  onClose: t,
  title: n,
  icon: r,
  titleColor: i = `text-text-primary`,
  fullHeight: a = !1,
  showDragHandle: o = !0,
  children: s,
}) {
  let { t: c } = M(),
    l = (0, _.useRef)(null),
    u = (0, _.useRef)(null),
    d = (0, _.useRef)(t);
  d.current = t;
  let [f, p] = (0, _.useState)(!1),
    m = (0, _.useCallback)(() => p(!0), []);
  (0, _.useEffect)(() => {
    let e = l.current;
    if (!e || !f) return;
    let t = () => {
      (p(!1), d.current());
    };
    return (
      e.addEventListener(`animationend`, t, { once: !0 }),
      () => e.removeEventListener(`animationend`, t)
    );
  }, [f]);
  let [h, g] = (0, _.useState)(0),
    [v, y] = (0, _.useState)(!1),
    b = (0, _.useRef)(null),
    x = (0, _.useRef)(!1);
  return (
    (0, _.useEffect)(() => {
      if (!e) return;
      ((u.current = document.activeElement), (x.current = !1));
      let t = (e) => {
          if (e.key === `Escape`) {
            p(!0);
            return;
          }
          if (e.key === `Tab` && l.current) {
            let t = l.current.querySelectorAll(
              `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`,
            );
            if (t.length === 0) {
              e.preventDefault();
              return;
            }
            let n = t[0],
              r = t[t.length - 1];
            e.shiftKey && document.activeElement === n
              ? (e.preventDefault(), r.focus())
              : !e.shiftKey &&
                document.activeElement === r &&
                (e.preventDefault(), n.focus());
          }
        },
        n = () => {
          x.current = !0;
        },
        r = l.current;
      return (
        r?.addEventListener(`animationend`, n),
        document.addEventListener(`keydown`, t),
        requestAnimationFrame(() => {
          if (!l.current) return;
          let e = l.current.querySelector(
            `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`,
          );
          e
            ? e.focus()
            : requestAnimationFrame(() => {
                l.current
                  ?.querySelector(
                    `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`,
                  )
                  ?.focus();
              });
        }),
        () => {
          (document.removeEventListener(`keydown`, t),
            r?.removeEventListener(`animationend`, n),
            u.current?.focus());
        }
      );
    }, [e]),
    e
      ? (0, N.jsx)(`div`, {
          className: `fixed inset-0 z-[80] bg-black/85 flex flex-col justify-end backdrop-blur-sm md:items-center`,
          onClick: m,
          "aria-hidden": `true`,
          children: (0, N.jsxs)(`div`, {
            ref: l,
            role: `dialog`,
            "aria-modal": `true`,
            "aria-labelledby": n ? `sheet-title` : void 0,
            className: `bg-bg-surface rounded-t-[2rem] md:rounded-2xl p-5 border-t border-border-default shadow-sheet flex flex-col w-full md:max-w-[640px] ${a ? `h-[90vh]` : `max-h-[85vh]`} md:mb-8 ${v ? `sheet-dragging` : ``} ${f ? `sheet-exit` : `modal-enter`}`,
            style: v ? { transform: `translateY(${h}px)` } : void 0,
            onClick: (e) => e.stopPropagation(),
            onTouchStart: (e) => {
              if (!x.current) return;
              let t = e.target.closest(`[data-drag-handle]`) !== null,
                n = l.current?.querySelector(`[data-sheet-content]`),
                r = !n || n.scrollTop === 0;
              (!t && !r) ||
                (b.current = {
                  y: e.touches[0].clientY,
                  time: Date.now(),
                  onHandle: t,
                });
            },
            onTouchMove: (e) => {
              if (!b.current) return;
              let t = e.touches[0].clientY - b.current.y;
              t > 0 && (g(t), y(!0));
            },
            onTouchEnd: () => {
              if (!b.current || !v) {
                b.current = null;
                return;
              }
              let e = h / (Date.now() - b.current.time);
              ((h > mr || e > hr) && m(), g(0), y(!1), (b.current = null));
            },
            children: [
              o &&
                (0, N.jsx)(`div`, {
                  "data-drag-handle": !0,
                  className: `w-10 h-1 bg-bg-overlay rounded-full mx-auto mb-4 shrink-0 cursor-grab`,
                }),
              (0, N.jsxs)(`div`, {
                className: `flex justify-between items-center mb-5 shrink-0`,
                children: [
                  n &&
                    (0, N.jsxs)(`h3`, {
                      id: `sheet-title`,
                      className: `text-2xl font-black ${i} uppercase tracking-wide`,
                      children: [
                        r &&
                          (0, N.jsx)(`span`, {
                            className: `mr-3 opacity-80 inline-flex`,
                            children: r,
                          }),
                        n,
                      ],
                    }),
                  (0, N.jsx)(`button`, {
                    onClick: m,
                    className: `w-10 h-10 rounded-full bg-bg-elevated text-text-muted flex items-center justify-center hover:bg-bg-overlay transition`,
                    "aria-label": c(`common.close`),
                    children: (0, N.jsx)(wn, { size: 20 }),
                  }),
                ],
              }),
              (0, N.jsx)(`div`, {
                "data-sheet-content": !0,
                className: `flex-1 overflow-y-auto hide-scrollbar flex flex-col`,
                children: s,
              }),
            ],
          }),
        })
      : null
  );
}
var _r = [
  {
    category: `basic`,
    faction: `villager`,
    labelKey: `library.basicVillager`,
    color: `text-blue-400`,
  },
  {
    category: `basic`,
    faction: `wolf`,
    labelKey: `library.basicWolf`,
    color: `text-red-400`,
  },
  {
    category: `advanced`,
    faction: `villager`,
    labelKey: `library.advancedVillager`,
    color: `text-blue-300`,
  },
  {
    category: `advanced`,
    faction: `wolf`,
    labelKey: `library.advancedWolf`,
    color: `text-red-300`,
  },
  {
    category: `advanced`,
    faction: `third`,
    labelKey: `library.thirdParty`,
    color: `text-purple-400`,
  },
];
function vr({ isOpen: e, onClose: t, onCreateCustom: n }) {
  let { t: r } = M(),
    i = F((e) => e.roleTemplates),
    a = F((e) => e.roles),
    o = F((e) => e.addRoleFromTemplate),
    s = F((e) => e.deleteCustomTemplate),
    c = i.filter((e) => e.category === `custom`);
  return (0, N.jsxs)(gr, {
    isOpen: e,
    onClose: t,
    title: r(`setup.library`),
    icon: (0, N.jsx)(qt, { size: 20 }),
    fullHeight: !0,
    children: [
      (0, N.jsxs)(`button`, {
        onClick: n,
        className: `w-full mb-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-wide rounded-xl transition active:scale-[0.98]`,
        children: [
          (0, N.jsx)(Zt, { size: 16, className: `mr-2 inline` }),
          r(`setup.createCustomRole`),
        ],
      }),
      _r.map(({ category: e, faction: t, labelKey: n, color: s }) => {
        let c = i.filter((n) => n.category === e && n.faction === t);
        return c.length === 0
          ? null
          : (0, N.jsxs)(
              `div`,
              {
                className: `mb-4`,
                children: [
                  (0, N.jsx)(`h4`, {
                    className: `text-[10px] font-bold uppercase tracking-widest mb-2 ${s}`,
                    children: r(n),
                  }),
                  (0, N.jsx)(`div`, {
                    className: `space-y-1.5`,
                    children: c.map((e) => {
                      let t = a.some((t) => t.templateId === e.id),
                        n = fr(e.faction);
                      return (0, N.jsxs)(
                        `button`,
                        {
                          onClick: () => o(e),
                          className: `w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition active:scale-[0.98] ${t ? `${n.bgLight} ${n.border} opacity-60` : `bg-bg-card border-border-default hover:bg-bg-elevated`}`,
                          "aria-pressed": t,
                          children: [
                            (0, N.jsx)(`span`, {
                              className: `font-bold text-sm ${n.text}`,
                              children: r(e.nameKey, e.name),
                            }),
                            (0, N.jsxs)(`span`, {
                              className: `text-[10px] text-text-muted`,
                              children: [
                                e.abilities.length > 0
                                  ? `${e.abilities.length} ${r(`ability.skill`, `skill`)}`
                                  : r(`ability.passive`, `passive`),
                                t &&
                                  (0, N.jsx)(Jt, {
                                    size: 12,
                                    className: `ml-2 text-emerald-400 inline`,
                                  }),
                              ],
                            }),
                          ],
                        },
                        e.id,
                      );
                    }),
                  }),
                ],
              },
              `${e}-${t}`,
            );
      }),
      c.length > 0 &&
        (0, N.jsxs)(`div`, {
          className: `mb-4`,
          children: [
            (0, N.jsx)(`h4`, {
              className: `text-[10px] font-bold uppercase tracking-widest mb-2 text-amber-400`,
              children: r(`library.custom`),
            }),
            (0, N.jsx)(`div`, {
              className: `space-y-1.5`,
              children: c.map((e) => {
                let t = a.some((t) => t.templateId === e.id),
                  n = fr(e.faction);
                return (0, N.jsxs)(
                  `div`,
                  {
                    className: `flex items-center gap-1.5`,
                    children: [
                      (0, N.jsxs)(`button`, {
                        onClick: () => o(e),
                        className: `flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg border transition ${t ? `${n.bgLight} ${n.border} opacity-60` : `bg-bg-card border-border-default`}`,
                        children: [
                          (0, N.jsx)(`span`, {
                            className: `font-bold text-sm ${n.text}`,
                            children: e.name,
                          }),
                          t &&
                            (0, N.jsx)(Jt, {
                              size: 12,
                              className: `text-emerald-400`,
                            }),
                        ],
                      }),
                      (0, N.jsx)(`button`, {
                        onClick: () => {
                          confirm(
                            r(`setup.confirmDeleteRole`, `Delete?`).replace(
                              `{{name}}`,
                              e.name,
                            ),
                          ) && s(e.id);
                        },
                        className: `w-8 h-8 rounded-lg bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-800/50 transition shrink-0`,
                        "aria-label": `${r(`common.delete`)} ${e.name}`,
                        children: (0, N.jsx)(gn, { size: 14 }),
                      }),
                    ],
                  },
                  e.id,
                );
              }),
            }),
          ],
        }),
    ],
  });
}
var yr = [
  { value: `villager`, labelKey: `factions.villager`, color: `bg-blue-600` },
  { value: `wolf`, labelKey: `factions.wolf`, color: `bg-red-600` },
  { value: `third`, labelKey: `factions.third`, color: `bg-purple-600` },
];
function br({ isOpen: e, onClose: t }) {
  let { t: n } = M(),
    r = F((e) => e.createCustomRole),
    i = F((e) => e.playerCount),
    a = F((e) => e.roles),
    [o, s] = (0, _.useState)(``),
    [c, l] = (0, _.useState)(`villager`),
    [u, d] = (0, _.useState)([
      { id: Vn(), name: ``, type: `nightly`, max: 1, targetCount: 1 },
    ]),
    [f, p] = (0, _.useState)([]),
    m = () => {
      let e = [];
      return (
        o.trim() ||
          e.push(n(`setup.errorNameRequired`, `Tên role không được trống`)),
        a.some((e) => e.name.trim().toLowerCase() === o.trim().toLowerCase()) &&
          e.push(n(`setup.errorDuplicateName`, `Tên role đã tồn tại`)),
        u.length === 0 &&
          e.push(n(`setup.errorNeedAbility`, `Cần ít nhất 1 kỹ năng`)),
        u.length > 5 &&
          e.push(n(`setup.errorMaxAbilities`, `Tối đa 5 kỹ năng`)),
        u.forEach((t, r) => {
          (t.name.trim() ||
            e.push(
              n(`setup.errorAbilityNameEmpty`, {
                index: r + 1,
                defaultValue: `Kỹ năng ${r + 1}: tên trống`,
              }),
            ),
            t.targetCount > i &&
              e.push(
                n(`setup.errorAbilityTargetExceed`, {
                  index: r + 1,
                  defaultValue: `Kỹ năng ${r + 1}: target > số người chơi`,
                }),
              ));
        }),
        e
      );
    },
    h = () => {
      let e = m();
      if (e.length > 0) {
        p(e);
        return;
      }
      (r({ name: o.trim(), faction: c, abilities: u }),
        s(``),
        l(`villager`),
        d([{ id: Vn(), name: ``, type: `nightly`, max: 1, targetCount: 1 }]),
        p([]),
        t());
    },
    g = () => {
      u.length >= 5 ||
        d([
          ...u,
          { id: Vn(), name: ``, type: `nightly`, max: 1, targetCount: 1 },
        ]);
    },
    v = (e, t, n) => {
      d(u.map((r) => (r.id === e ? { ...r, [t]: n } : r)));
    },
    y = (e) => {
      d(u.filter((t) => t.id !== e));
    };
  return (0, N.jsxs)(gr, {
    isOpen: e,
    onClose: t,
    title: n(`setup.createCustomRole`),
    icon: (0, N.jsx)(mn, { size: 20 }),
    fullHeight: !0,
    children: [
      f.length > 0 &&
        (0, N.jsx)(`div`, {
          role: `alert`,
          className: `bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4 text-xs text-red-400`,
          children: f.map((e, t) => (0, N.jsx)(`p`, { children: e }, t)),
        }),
      (0, N.jsxs)(`div`, {
        className: `mb-4`,
        children: [
          (0, N.jsx)(`label`, {
            htmlFor: `role-name`,
            className: `text-xs font-bold text-text-secondary uppercase mb-1 block`,
            children: n(`setup.roleName`, `Tên Role`),
          }),
          (0, N.jsx)(`input`, {
            id: `role-name`,
            type: `text`,
            value: o,
            onChange: (e) => s(e.target.value),
            placeholder: n(`setup.roleNamePlaceholder`, `VD: Thợ Rèn`),
            className: `w-full bg-bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-text-primary`,
            required: !0,
            "aria-required": `true`,
          }),
        ],
      }),
      (0, N.jsxs)(`div`, {
        className: `mb-4`,
        children: [
          (0, N.jsx)(`p`, {
            className: `text-xs font-bold text-text-secondary uppercase mb-2`,
            children: n(`setup.faction`, `Phe`),
          }),
          (0, N.jsx)(`div`, {
            className: `grid grid-cols-3 gap-2`,
            children: yr.map((e) =>
              (0, N.jsx)(
                `button`,
                {
                  onClick: () => l(e.value),
                  className: `py-2 rounded-lg font-bold text-sm transition ${c === e.value ? `${e.color} text-white shadow-lg` : `bg-bg-elevated text-text-secondary`}`,
                  children: n(e.labelKey),
                },
                e.value,
              ),
            ),
          }),
        ],
      }),
      (0, N.jsxs)(`div`, {
        className: `mb-4 flex-1`,
        children: [
          (0, N.jsxs)(`p`, {
            className: `text-xs font-bold text-text-secondary uppercase mb-2`,
            children: [
              n(`setup.abilities`, `Kỹ Năng`),
              ` (`,
              u.length,
              `/`,
              5,
              `)`,
            ],
          }),
          (0, N.jsx)(`div`, {
            className: `space-y-3`,
            children: u.map((e, t) =>
              (0, N.jsxs)(
                `div`,
                {
                  className: `bg-bg-elevated rounded-lg p-3 border border-border-default`,
                  children: [
                    (0, N.jsxs)(`div`, {
                      className: `flex items-center gap-2 mb-2`,
                      children: [
                        (0, N.jsx)(`span`, {
                          className: `text-[10px] font-bold text-text-muted w-4`,
                          children: t + 1,
                        }),
                        (0, N.jsx)(`input`, {
                          type: `text`,
                          value: e.name,
                          onChange: (t) => v(e.id, `name`, t.target.value),
                          placeholder: n(
                            `setup.abilityNamePlaceholder`,
                            `Tên kỹ năng`,
                          ),
                          className: `flex-1 bg-bg-card border border-border-default rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-text-primary`,
                          required: !0,
                        }),
                        (0, N.jsx)(`button`, {
                          onClick: () => y(e.id),
                          className: `text-red-400 hover:text-red-600 p-1`,
                          children: (0, N.jsx)(gn, { size: 14 }),
                        }),
                      ],
                    }),
                    (0, N.jsxs)(`div`, {
                      className: `flex gap-2 ml-6`,
                      children: [
                        (0, N.jsx)(`button`, {
                          onClick: () =>
                            v(
                              e.id,
                              `type`,
                              e.type === `nightly` ? `limited` : `nightly`,
                            ),
                          className: `bg-bg-elevated border border-border-default rounded px-2 py-1 text-[10px] font-bold text-text-secondary`,
                          children:
                            e.type === `nightly`
                              ? n(`ability.night`, `Đêm`)
                              : n(`ability.limited`, `Lần`),
                        }),
                        e.type === `limited` &&
                          (0, N.jsx)(`input`, {
                            type: `number`,
                            min: 1,
                            max: 10,
                            value: e.max,
                            onChange: (t) =>
                              v(e.id, `max`, parseInt(t.target.value) || 1),
                            className: `w-12 bg-bg-card border border-border-default rounded px-2 py-1 text-[10px] text-center text-text-primary`,
                          }),
                        (0, N.jsx)(`input`, {
                          type: `number`,
                          min: 1,
                          max: i,
                          value: e.targetCount,
                          onChange: (t) =>
                            v(
                              e.id,
                              `targetCount`,
                              parseInt(t.target.value) || 1,
                            ),
                          className: `w-12 bg-bg-card border border-border-default rounded px-2 py-1 text-[10px] text-center text-text-primary`,
                          "aria-label": `Target count`,
                        }),
                      ],
                    }),
                  ],
                },
                e.id,
              ),
            ),
          }),
          u.length < 5 &&
            (0, N.jsxs)(`button`, {
              onClick: g,
              className: `mt-2 text-xs text-indigo-500 font-bold hover:underline`,
              children: [
                (0, N.jsx)(dn, { size: 12, className: `mr-1 inline` }),
                n(`setup.addAbility`, `Thêm kỹ năng`),
              ],
            }),
        ],
      }),
      (0, N.jsxs)(`button`, {
        onClick: h,
        className: `w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm uppercase rounded-xl shadow-lg transition active:scale-[0.98] mt-auto`,
        children: [
          (0, N.jsx)(Jt, { size: 16, className: `mr-2 inline` }),
          n(`common.save`),
        ],
      }),
    ],
  });
}
var xr = [
  { value: `nameFirst`, labelKey: `settings.nameFirst` },
  { value: `roleFirst`, labelKey: `settings.roleFirst` },
  { value: `both`, labelKey: `settings.bothView` },
];
function Sr({ isOpen: e, onClose: t }) {
  let { t: n, i18n: r } = M(),
    i = F((e) => e.cardViewMode),
    a = F((e) => e.timerSettings),
    o = F((e) => e.setCardViewMode),
    s = F((e) => e.setTimerSettings),
    c = F((e) => e.resetGame),
    [l, u] = (0, _.useState)(!1),
    d = (e) => {
      r.changeLanguage(e);
    };
  return (0, N.jsx)(gr, {
    isOpen: e,
    onClose: t,
    title: n(`settings.title`, `Cài Đặt`),
    icon: (0, N.jsx)(fn, { size: 20 }),
    fullHeight: !0,
    children: (0, N.jsxs)(`div`, {
      className: `space-y-6`,
      children: [
        (0, N.jsxs)(`div`, {
          children: [
            (0, N.jsx)(`label`, {
              className: `text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 block`,
              children: n(`settings.cardView`),
            }),
            (0, N.jsx)(`div`, {
              role: `radiogroup`,
              "aria-label": n(`settings.cardView`),
              className: `flex gap-2`,
              children: xr.map((e) =>
                (0, N.jsx)(
                  `button`,
                  {
                    role: `radio`,
                    "aria-checked": i === e.value,
                    onClick: () => o(e.value),
                    className: `flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${i === e.value ? `bg-cta text-white shadow-lg` : `bg-bg-elevated text-text-secondary`}`,
                    children: n(e.labelKey, e.value),
                  },
                  e.value,
                ),
              ),
            }),
          ],
        }),
        (0, N.jsxs)(`div`, {
          children: [
            (0, N.jsxs)(`label`, {
              className: `text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 block`,
              children: [
                n(`settings.debateTime`),
                `:`,
                ` `,
                (0, N.jsxs)(`span`, {
                  className: `text-indigo-500`,
                  children: [a.debate, `s`],
                }),
              ],
            }),
            (0, N.jsx)(`input`, {
              type: `range`,
              min: 10,
              max: 300,
              step: 10,
              value: a.debate,
              onChange: (e) => s({ ...a, debate: Number(e.target.value) }),
              "aria-label": n(`settings.debateTime`),
              "aria-valuetext": `${a.debate} seconds`,
              className: `w-full accent-indigo-600`,
            }),
          ],
        }),
        (0, N.jsxs)(`div`, {
          children: [
            (0, N.jsxs)(`label`, {
              className: `text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 block`,
              children: [
                n(`settings.judgmentTime`),
                `:`,
                ` `,
                (0, N.jsxs)(`span`, {
                  className: `text-red-500`,
                  children: [a.judgment, `s`],
                }),
              ],
            }),
            (0, N.jsx)(`input`, {
              type: `range`,
              min: 10,
              max: 120,
              step: 5,
              value: a.judgment,
              onChange: (e) => s({ ...a, judgment: Number(e.target.value) }),
              "aria-label": n(`settings.judgmentTime`),
              "aria-valuetext": `${a.judgment} seconds`,
              className: `w-full accent-red-600`,
            }),
          ],
        }),
        (0, N.jsxs)(`div`, {
          className: `flex items-center justify-between`,
          children: [
            (0, N.jsx)(`label`, {
              className: `text-sm font-bold text-text-secondary uppercase tracking-wider`,
              children: n(`settings.muteSounds`),
            }),
            (0, N.jsx)(`button`, {
              onClick: () => s({ ...a, muted: !a.muted }),
              className: `w-12 h-7 rounded-full transition-colors relative ${a.muted ? `bg-red-600` : `bg-bg-elevated`}`,
              role: `switch`,
              "aria-checked": a.muted,
              "aria-label": n(`settings.muteSounds`),
              children: (0, N.jsx)(`span`, {
                className: `absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${a.muted ? `translate-x-5` : `translate-x-0`}`,
                children: a.muted
                  ? (0, N.jsx)(Sn, { size: 12, className: `text-red-600` })
                  : (0, N.jsx)(xn, { size: 12, className: `text-text-muted` }),
              }),
            }),
          ],
        }),
        (0, N.jsxs)(`div`, {
          children: [
            (0, N.jsx)(`label`, {
              className: `text-sm font-bold text-text-secondary uppercase tracking-wider mb-2 block`,
              children: n(`settings.language`),
            }),
            (0, N.jsxs)(`div`, {
              role: `radiogroup`,
              "aria-label": n(`settings.language`),
              className: `flex gap-2`,
              children: [
                (0, N.jsx)(`button`, {
                  role: `radio`,
                  "aria-checked": r.language === `vi`,
                  onClick: () => d(`vi`),
                  className: `flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${r.language === `vi` ? `bg-cta text-white shadow-lg` : `bg-bg-elevated text-text-secondary`}`,
                  children: `Tiếng Việt`,
                }),
                (0, N.jsx)(`button`, {
                  role: `radio`,
                  "aria-checked": r.language === `en`,
                  onClick: () => d(`en`),
                  className: `flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${r.language === `en` ? `bg-cta text-white shadow-lg` : `bg-bg-elevated text-text-secondary`}`,
                  children: `English`,
                }),
              ],
            }),
          ],
        }),
        (0, N.jsx)(`div`, {
          className: `pt-4 border-t border-border-default`,
          children: l
            ? (0, N.jsxs)(`div`, {
                role: `alertdialog`,
                "aria-label": n(`settings.resetGame`),
                children: [
                  (0, N.jsx)(`p`, {
                    id: `reset-warning`,
                    className: `text-sm text-red-500 font-bold text-center mb-3`,
                    children: n(
                      `settings.resetWarning`,
                      `Toàn bộ dữ liệu game sẽ bị xoá!`,
                    ),
                  }),
                  (0, N.jsxs)(`div`, {
                    className: `flex gap-3`,
                    children: [
                      (0, N.jsx)(`button`, {
                        onClick: () => u(!1),
                        className: `flex-1 py-3 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95`,
                        children: n(`common.cancel`),
                      }),
                      (0, N.jsx)(`button`, {
                        onClick: () => {
                          (c(), u(!1), t());
                        },
                        className: `flex-1 py-3 bg-red-600 text-white font-black rounded-xl transition active:scale-95`,
                        children: n(`common.confirm`),
                      }),
                    ],
                  }),
                ],
              })
            : (0, N.jsxs)(`button`, {
                onClick: () => u(!0),
                className: `w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition active:scale-95 uppercase`,
                "aria-describedby": `reset-warning`,
                children: [
                  (0, N.jsx)(gn, { size: 16, className: `mr-2 inline` }),
                  n(`settings.resetGame`),
                ],
              }),
        }),
      ],
    }),
  });
}
function Cr({
  selector: e,
  rolesCount: t,
  playerCount: n,
  onClose: r,
  onSelect: i,
}) {
  let { t: a } = M(),
    o = ``,
    s = (0, N.jsx)(nn, { size: 20 }),
    c = [];
  switch (e.type) {
    case `order`:
      ((o = a(`setup.nightOrder`, `Thứ Tự Gọi Đêm`)),
        (c = Array.from({ length: Math.max(t, 1) }, (e, t) => ({
          value: t + 1,
          label: String(t + 1),
        }))));
      break;
    case `targetCount`:
      ((o = a(`setup.targetCount`, `Số Lượng Mục Tiêu`)),
        (s = (0, N.jsx)(bn, { size: 20 })),
        (c = Array.from({ length: n + 1 }, (e, t) => ({
          value: t,
          label: t === 0 ? a(`setup.noTarget`, `0`) : String(t),
        }))));
      break;
    case `max`:
      ((o = a(`setup.usageLimit`, `Số Lần Dùng Kỹ Năng`)),
        (c = Array.from({ length: 10 }, (e, t) => ({
          value: t + 1,
          label: String(t + 1),
        }))));
      break;
    case `skillType`:
      ((o = a(`setup.skillType`, `Loại Kỹ Năng`)),
        (s = (0, N.jsx)(an, { size: 20 })),
        (c = [
          { value: `nightly`, label: a(`setup.nightly`, `Mỗi Đêm`) },
          { value: `limited`, label: a(`setup.limited`, `Giới Hạn`) },
        ]));
      break;
  }
  let l = e.type !== `skillType`;
  return (0, N.jsx)(gr, {
    isOpen: !0,
    onClose: r,
    title: o,
    icon: s,
    children: (0, N.jsx)(`div`, {
      role: `radiogroup`,
      "aria-label": o,
      className: `grid ${l ? `grid-cols-5` : `grid-cols-2`} gap-3 pb-2`,
      children: c.map((t) => {
        let n = e.currentValue === t.value;
        return (0, N.jsx)(
          `button`,
          {
            role: `radio`,
            "aria-checked": n,
            onClick: () => i(t.value),
            className: `py-4 rounded-xl font-bold ${l ? `text-xl` : `text-sm`} transition-all transform active:scale-95 ${n ? `bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border-2 border-indigo-400` : `bg-bg-elevated text-text-secondary border-2 border-border-default`}`,
            children: t.label,
          },
          t.value,
        );
      }),
    }),
  });
}
function wr() {
  let { t: e } = M(),
    t = F((e) => e.roles),
    n = F((e) => e.playerCount),
    r = F((e) => e.setStep),
    i = F((e) => e.changeRoleOrder),
    a = F((e) => e.updateAbility),
    [o, s] = (0, _.useState)(!1),
    [c, l] = (0, _.useState)(!1),
    [u, d] = (0, _.useState)(!1),
    [f, p] = (0, _.useState)(null);
  return (0, N.jsxs)(`main`, {
    className: `min-h-screen bg-bg-app text-text-primary pb-8`,
    children: [
      (0, N.jsxs)(`div`, {
        className: `bg-bg-card border-b border-border-default p-4 sticky top-0 z-10 flex items-center justify-between`,
        children: [
          (0, N.jsx)(`div`, { className: `w-10` }),
          (0, N.jsxs)(`h1`, {
            className: `text-2xl font-black font-display uppercase tracking-wide text-indigo-400`,
            children: [
              (0, N.jsx)(cn, { size: 20, className: `mr-2 opacity-80 inline` }),
              e(`setup.title`),
            ],
          }),
          (0, N.jsx)(`button`, {
            onClick: () => d(!0),
            className: `w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:bg-bg-elevated transition`,
            "aria-label": e(`settings.title`),
            children: (0, N.jsx)(fn, { size: 18 }),
          }),
        ],
      }),
      (0, N.jsxs)(`div`, {
        className: `max-w-5xl mx-auto p-4 md:grid md:grid-cols-2 md:gap-6`,
        children: [
          (0, N.jsx)(`div`, {
            className: `mb-6 md:mb-0`,
            children: (0, N.jsx)(ar, {}),
          }),
          (0, N.jsxs)(`div`, {
            children: [
              (0, N.jsxs)(`div`, {
                className: `flex items-center justify-between mb-3`,
                children: [
                  (0, N.jsxs)(`h2`, {
                    className: `text-sm font-bold uppercase tracking-wide text-text-secondary`,
                    children: [e(`setup.roles`), ` (`, t.length, `)`],
                  }),
                  (0, N.jsxs)(`button`, {
                    onClick: () => s(!0),
                    className: `bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition active:scale-95`,
                    children: [
                      (0, N.jsx)(qt, { size: 12, className: `mr-1 inline` }),
                      e(`setup.library`),
                    ],
                  }),
                ],
              }),
              (0, N.jsx)(pr, { onOpenSelector: p }),
            ],
          }),
        ],
      }),
      (0, N.jsxs)(`div`, {
        className: `max-w-5xl mx-auto px-4 mt-4`,
        children: [
          (0, N.jsxs)(`div`, {
            className: `flex items-center justify-center gap-2 mb-3`,
            children: [
              (0, N.jsxs)(`div`, {
                className: `flex items-center gap-1 text-xs font-bold ${n > 0 ? `text-emerald-400` : `text-text-muted`}`,
                children: [
                  (0, N.jsx)(`span`, {
                    className: `w-2 h-2 rounded-full ${n > 0 ? `bg-emerald-400` : `bg-text-muted`}`,
                  }),
                  n,
                  ` `,
                  e(`setup.playerCount`),
                ],
              }),
              (0, N.jsx)(`div`, {
                className: `w-6 h-0.5 bg-border-default rounded-full`,
              }),
              (0, N.jsxs)(`div`, {
                className: `flex items-center gap-1 text-xs font-bold ${t.length > 0 ? `text-emerald-400` : `text-text-muted`}`,
                children: [
                  (0, N.jsx)(`span`, {
                    className: `w-2 h-2 rounded-full ${t.length > 0 ? `bg-emerald-400` : `bg-text-muted`}`,
                  }),
                  t.length,
                  ` `,
                  e(`setup.roles`),
                ],
              }),
              (0, N.jsx)(`div`, {
                className: `w-6 h-0.5 bg-border-default rounded-full`,
              }),
              (0, N.jsxs)(`div`, {
                className: `flex items-center gap-1 text-xs font-bold ${t.length > 0 ? `text-indigo-400` : `text-text-muted`}`,
                children: [
                  (0, N.jsx)(`span`, {
                    className: `w-2 h-2 rounded-full ${t.length > 0 ? `bg-indigo-400` : `bg-text-muted`}`,
                  }),
                  `Go!`,
                ],
              }),
            ],
          }),
          t.length > 0 &&
            t.length < n &&
            (0, N.jsxs)(`div`, {
              className: `flex items-center gap-2 bg-amber-900/20 border border-amber-500/30 rounded-lg px-3 py-2 mb-3`,
              children: [
                (0, N.jsx)(_n, {
                  size: 14,
                  className: `text-amber-400 shrink-0`,
                }),
                (0, N.jsxs)(`p`, {
                  className: `text-[11px] text-amber-400 font-bold`,
                  children: [
                    t.length,
                    ` `,
                    e(`setup.roles`),
                    ` / `,
                    n,
                    ` `,
                    e(`setup.playerCount`),
                    ` —`,
                    ` `,
                    e(`setup.willBeVillager`, {
                      count: Math.abs(n - t.length),
                    }),
                  ],
                }),
              ],
            }),
          (0, N.jsxs)(`button`, {
            onClick: () => {
              t.length !== 0 && r(`game`);
            },
            disabled: t.length === 0,
            className: `w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-lg uppercase tracking-widest rounded-xl shadow-lg transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed`,
            children: [
              (0, N.jsx)(un, { size: 16, className: `mr-2 inline` }),
              e(`setup.startGame`),
            ],
          }),
        ],
      }),
      (0, N.jsx)(vr, {
        isOpen: o,
        onClose: () => s(!1),
        onCreateCustom: () => {
          (s(!1), l(!0));
        },
      }),
      (0, N.jsx)(br, { isOpen: c, onClose: () => l(!1) }),
      (0, N.jsx)(Sr, { isOpen: u, onClose: () => d(!1) }),
      f &&
        (0, N.jsx)(Cr, {
          selector: f,
          rolesCount: t.length,
          playerCount: n,
          onClose: () => p(null),
          onSelect: (e) => {
            if (!f) return;
            let { type: t, roleId: n, abilityId: r } = f;
            (t === `order`
              ? i(n, e)
              : r && a(n, r, t === `skillType` ? `type` : t, e),
              p(null));
          },
        }),
    ],
  });
}
var Tr = {
    tick: `/sounds/timer-tick.mp3`,
    bell: `/sounds/timer-end.mp3`,
    night: `/sounds/night-ambience.mp3`,
  },
  Er = {},
  Dr = !1,
  Or = !1;
function kr(e) {
  e((e) => {
    Or = e;
  });
}
function Ar() {
  Dr ||
    ((Dr = !0),
    Object.entries(Tr).forEach(([e, t]) => {
      let n = new Audio(t);
      ((n.preload = `auto`), (Er[e] = n));
    }),
    document.addEventListener(`visibilitychange`, () => {
      document.hidden && Mr();
    }));
}
function jr(e) {
  if (!Or)
    try {
      let t = Er[e] || new Audio(Tr[e]);
      ((t.currentTime = 0), t.play().catch(() => {}));
    } catch {}
}
function Mr() {
  Object.keys(Er).forEach((e) => {
    let t = Er[e];
    t && (t.pause(), (t.currentTime = 0));
  });
}
var Nr = {
  active: !1,
  value: 0,
  initial: 0,
  type: null,
  paused: !1,
  finished: !1,
};
function Pr() {
  let [e, t] = (0, _.useState)(Nr),
    n = (0, _.useRef)(null),
    r = (0, _.useRef)(null),
    i = (0, _.useRef)(!1),
    a = (0, _.useCallback)(() => {
      n.current !== null && (clearInterval(n.current), (n.current = null));
    }, []),
    o = (0, _.useCallback)(
      (e, o) => {
        (a(),
          r.current !== null && (clearTimeout(r.current), (r.current = null)),
          (i.current = !1),
          t({
            active: !0,
            value: e,
            initial: e,
            type: o,
            paused: !1,
            finished: !1,
          }));
        let s = window.setInterval(() => {
          t((e) =>
            e.active
              ? e.paused
                ? e
                : e.value <= 1
                  ? (clearInterval(s),
                    (n.current = null),
                    { ...e, value: 0, active: !0, finished: !0 })
                  : { ...e, value: e.value - 1 }
              : (clearInterval(s), (n.current = null), e),
          );
        }, 1e3);
        n.current = s;
      },
      [a],
    ),
    s = (0, _.useCallback)(() => {
      t((e) => ({ ...e, paused: !e.paused }));
    }, []),
    c = (0, _.useCallback)(() => {
      (a(), t(Nr));
    }, [a]);
  return (
    (0, _.useEffect)(() => {
      if (e.finished) {
        let e = window.setTimeout(() => {
          ((r.current = null), t(Nr));
        }, 1500);
        return (
          (r.current = e),
          () => {
            (clearTimeout(e), (r.current = null));
          }
        );
      }
    }, [e.finished]),
    (0, _.useEffect)(() => {
      if (e.finished && navigator.vibrate)
        try {
          navigator.vibrate(200);
        } catch {}
    }, [e.finished]),
    (0, _.useEffect)(() => {
      (e.value <= 10 && e.value > 0 && e.active && jr(`tick`),
        e.value === 0 &&
          e.initial > 0 &&
          !i.current &&
          ((i.current = !0), jr(`bell`)));
    }, [e.value, e.active, e.initial]),
    (0, _.useEffect)(
      () => () => {
        n.current !== null && clearInterval(n.current);
      },
      [],
    ),
    { timer: e, start: o, togglePause: s, stop: c }
  );
}
var Fr = (0, _.memo)(function ({
  settings: e,
  nightCount: t,
  onOpenModal: n,
  onOpenAssign: r,
  onOpenSkill: i,
  timerStartRef: a,
}) {
  let { t: o } = M(),
    { timer: s, start: c, togglePause: l, stop: u } = Pr(),
    d = F((e) => e.timerSettings.muted),
    f = F((e) => e.setTimerSettings);
  return (
    (0, _.useEffect)(() => {
      if (!s.active) return;
      let e = (e) => {
        e.key === `Escape` && (e.stopPropagation(), u());
      };
      return (
        document.addEventListener(`keydown`, e, { capture: !0 }),
        () => document.removeEventListener(`keydown`, e, { capture: !0 })
      );
    }, [s.active, u]),
    (0, _.useEffect)(
      () => (
        a && (a.current = c),
        () => {
          a && (a.current = null);
        }
      ),
      [c, a],
    ),
    (0, N.jsxs)(N.Fragment, {
      children: [
        s.active &&
          (0, N.jsxs)(`div`, {
            className: `fixed inset-0 z-[100] bg-bg-app/95 backdrop-blur-md flex flex-col items-center justify-center p-6 ${s.finished ? `timer-flash` : ``}`,
            role: `status`,
            "aria-live": `polite`,
            children: [
              (0, N.jsx)(`h2`, {
                className: `text-2xl font-display font-black uppercase tracking-widest mb-10 ${s.type === `debate` ? `text-orange-400` : `text-red-400`}`,
                children:
                  s.type === `debate`
                    ? o(`game.debate`, `Tranh Luận`)
                    : o(`game.judgment`, `Phán Quyết`),
              }),
              (0, N.jsxs)(`div`, {
                className: `text-[120px] font-display font-black mb-16 leading-none ${s.type === `debate` ? `text-orange-500` : `text-red-600`} ${s.value > 30 ? `timer-glow-calm` : s.value > 10 ? `timer-glow-warn` : `timer-glow-critical`}`,
                children: [
                  Math.floor(s.value / 60)
                    .toString()
                    .padStart(2, `0`),
                  `:`,
                  (s.value % 60).toString().padStart(2, `0`),
                ],
              }),
              (0, N.jsxs)(`div`, {
                className: `flex gap-4 w-full max-w-md`,
                children: [
                  (0, N.jsx)(`button`, {
                    onClick: l,
                    className: `flex-1 py-5 bg-bg-elevated border-2 border-border-default rounded-[2rem] shadow-xl flex items-center justify-center active:scale-95 transition`,
                    "aria-label": s.paused
                      ? o(`common.resume`)
                      : o(`common.pause`),
                    children: s.paused
                      ? (0, N.jsx)(un, {
                          className: `text-emerald-400`,
                          size: 28,
                        })
                      : (0, N.jsx)(ln, {
                          className: `text-amber-400`,
                          size: 28,
                        }),
                  }),
                  (0, N.jsx)(`button`, {
                    onClick: () => f({ ...e, muted: !d }),
                    className: `py-5 px-6 bg-bg-elevated border-2 border-border-default rounded-[2rem] shadow-xl flex items-center justify-center active:scale-95 transition`,
                    "aria-label": o(d ? `game.unmute` : `game.mute`),
                    children: d
                      ? (0, N.jsx)(Sn, {
                          className: `text-text-muted`,
                          size: 24,
                        })
                      : (0, N.jsx)(xn, {
                          className: `text-indigo-400`,
                          size: 24,
                        }),
                  }),
                  (0, N.jsx)(`button`, {
                    onClick: u,
                    className: `flex-1 py-5 bg-red-900 border-2 border-red-600 rounded-[2rem] shadow-xl flex items-center justify-center active:scale-95 transition`,
                    "aria-label": o(`common.stop`),
                    children: (0, N.jsx)(hn, {
                      className: `text-red-300`,
                      size: 28,
                    }),
                  }),
                ],
              }),
            ],
          }),
        (0, N.jsx)(`div`, {
          className: `md:hidden bg-bg-card border-b border-border-default shadow-sm shrink-0 z-10`,
          children: (0, N.jsxs)(`div`, {
            className: `flex items-center justify-around px-2 pt-2 pb-1`,
            children: [
              (0, N.jsx)(`button`, {
                onClick: () => c(e.debate, `debate`),
                className: `w-10 h-10 rounded-xl flex items-center justify-center text-orange-400 hover:text-orange-300 hover:bg-bg-elevated active:scale-95 transition`,
                "aria-label": o(`game.debate`),
                children: (0, N.jsx)(sn, { size: 18 }),
              }),
              (0, N.jsx)(`button`, {
                onClick: () => c(e.judgment, `judgment`),
                className: `w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-bg-elevated active:scale-95 transition`,
                "aria-label": o(`game.judgment`),
                children: (0, N.jsx)(tn, { size: 18 }),
              }),
              (0, N.jsxs)(`button`, {
                onClick: () => n(`night`),
                className: `relative w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:bg-bg-elevated active:scale-95 transition`,
                "aria-label": o(`game.nextNight`),
                children: [
                  (0, N.jsx)(cn, { size: 18 }),
                  (0, N.jsx)(`span`, {
                    className: `absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center`,
                    children: t,
                  }),
                ],
              }),
              (0, N.jsx)(`button`, {
                onClick: () => n(`history`),
                className: `w-10 h-10 rounded-xl flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-bg-elevated active:scale-95 transition`,
                "aria-label": o(`game.history`),
                children: (0, N.jsx)(qt, { size: 18 }),
              }),
              (0, N.jsx)(`button`, {
                onClick: () => n(`settings`),
                className: `w-10 h-10 rounded-xl flex items-center justify-center text-indigo-400 hover:text-indigo-300 hover:bg-bg-elevated active:scale-95 transition`,
                "aria-label": o(`settings.title`),
                children: (0, N.jsx)(fn, { size: 18 }),
              }),
            ],
          }),
        }),
        (0, N.jsxs)(`div`, {
          className: `hidden md:flex md:flex-col justify-between bg-bg-card border-r-2 border-border-default p-4 z-10 shadow-sm shrink-0`,
          children: [
            (0, N.jsxs)(`div`, {
              className: `flex flex-col gap-2 w-full`,
              children: [
                (0, N.jsxs)(`button`, {
                  onClick: () => c(e.debate, `debate`),
                  className: `py-2 px-4 w-full rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-1 bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-lg active:scale-95 transition`,
                  children: [
                    (0, N.jsx)(sn, { size: 14 }),
                    ` `,
                    o(`game.debate`),
                  ],
                }),
                (0, N.jsxs)(`button`, {
                  onClick: () => c(e.judgment, `judgment`),
                  className: `py-2 px-4 w-full rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-1 bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg active:scale-95 transition`,
                  children: [
                    (0, N.jsx)(tn, { size: 14 }),
                    ` `,
                    o(`game.judgment`),
                  ],
                }),
              ],
            }),
            (0, N.jsxs)(`div`, {
              className: `flex flex-col items-center gap-3 py-3`,
              children: [
                (0, N.jsx)(`div`, {
                  className: `px-3 py-1 bg-indigo-600/20 rounded-full border border-indigo-500/30`,
                  children: (0, N.jsx)(`span`, {
                    className: `text-xs font-black text-indigo-400 uppercase tracking-wide whitespace-nowrap`,
                    children: o(`game.turn`, { count: t }),
                  }),
                }),
                (0, N.jsx)(`div`, {
                  className: `w-8 h-0.5 bg-bg-elevated rounded-full`,
                }),
                (0, N.jsxs)(`div`, {
                  className: `flex flex-col items-center gap-4`,
                  children: [
                    (0, N.jsxs)(`button`, {
                      onClick: () => n(`history`),
                      className: `flex flex-col items-center text-text-muted hover:text-text-primary transition`,
                      "aria-label": o(`game.history`),
                      children: [
                        (0, N.jsx)(qt, { size: 20, className: `mb-0.5` }),
                        (0, N.jsx)(`span`, {
                          className: `text-[8px] font-bold uppercase tracking-wider`,
                          children: o(`game.history`),
                        }),
                      ],
                    }),
                    (0, N.jsxs)(`button`, {
                      onClick: () => n(`night`),
                      className: `flex flex-col items-center text-emerald-400 hover:text-emerald-300 transition`,
                      "aria-label": o(`game.nextNight`),
                      children: [
                        (0, N.jsx)(cn, { size: 20, className: `mb-0.5` }),
                        (0, N.jsx)(`span`, {
                          className: `text-[8px] font-bold uppercase tracking-wider`,
                          children: o(`game.nextNight`),
                        }),
                      ],
                    }),
                    (0, N.jsxs)(`button`, {
                      onClick: () => n(`settings`),
                      className: `flex flex-col items-center text-text-muted hover:text-text-primary transition`,
                      "aria-label": o(`settings.title`),
                      children: [
                        (0, N.jsx)(fn, { size: 20, className: `mb-0.5` }),
                        (0, N.jsx)(`span`, {
                          className: `text-[8px] font-bold uppercase tracking-wider`,
                          children: o(`settings.title`),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, N.jsxs)(`div`, {
              className: `flex flex-col gap-2 w-full`,
              children: [
                (0, N.jsxs)(`button`, {
                  onClick: r,
                  className: `w-full py-2 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black rounded-xl shadow-lg active:scale-95 transition uppercase text-[10px] flex items-center justify-center gap-1`,
                  children: [
                    (0, N.jsx)($t, { size: 14 }),
                    o(`game.assignRole`),
                  ],
                }),
                (0, N.jsxs)(`button`, {
                  onClick: i,
                  className: `w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg active:scale-95 transition uppercase text-[10px] flex items-center justify-center gap-1`,
                  children: [(0, N.jsx)(Cn, { size: 14 }), o(`game.useSkill`)],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
});
function Ir(e, t, n) {
  return t ? e(t, n) : n;
}
var Lr = { wolf: `🐺`, villager: `🛡`, third: `👁` },
  Rr = {
    villager: `hover:shadow-glow-villager`,
    wolf: `hover:shadow-glow-wolf`,
    third: `hover:shadow-glow-third`,
  };
function zr() {
  return (0, N.jsx)(`div`, {
    className: `absolute inset-0 flex items-center justify-center pointer-events-none z-10`,
    children: (0, N.jsx)(pn, { size: 64, className: `text-red-900/30` }),
  });
}
var Br = 2;
function Vr({ actions: e, onUndoAction: t, onOverflowClick: n }) {
  let { t: r } = M();
  if (e.length === 0) return null;
  let i = e.length > Br;
  return (0, N.jsxs)(`div`, {
    className: `mt-auto pt-2 flex flex-wrap md:justify-center gap-1 w-full`,
    onClick: (e) => e.stopPropagation(),
    children: [
      (0, N.jsx)(`div`, {
        className: `hidden md:contents`,
        children: e.map((e) => {
          let n = fr(e.faction),
            i = Ir(r, e.abilityNameKey, e.abilityName);
          return (0, N.jsxs)(
            `button`,
            {
              onClick: (n) => t(e.id, n),
              "aria-label": `${r(`game.undo`, `Hoàn tác`)} ${i}`,
              className: `chip-appear text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 md:w-auto justify-between ${n.bgLight} ${n.borderSolid} border text-text-primary shadow-sm`,
              children: [
                (0, N.jsx)(`span`, {
                  className: `w-1.5 h-1.5 rounded-full bg-current shrink-0`,
                }),
                (0, N.jsxs)(`span`, {
                  className: `flex items-center gap-1 truncate`,
                  children: [
                    e.abilityType === `limited` &&
                      (0, N.jsx)(on, { size: 8, className: `opacity-70` }),
                    (0, N.jsx)(`span`, {
                      className: `truncate font-semibold`,
                      children: i,
                    }),
                  ],
                }),
                (0, N.jsx)(wn, { size: 10, className: `opacity-50` }),
              ],
            },
            e.id,
          );
        }),
      }),
      (0, N.jsxs)(`div`, {
        className: `contents md:hidden`,
        children: [
          e.slice(0, Br).map((e, n) => {
            let a = fr(e.faction),
              o = Ir(r, e.abilityNameKey, e.abilityName),
              s = i && n === Br - 1;
            return (0, N.jsxs)(
              `button`,
              {
                onClick: (n) => t(e.id, n),
                "aria-label": `${r(`game.undo`, `Hoàn tác`)} ${o}`,
                className: `chip-appear text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-full justify-between ${a.bgLight} ${a.borderSolid} border text-text-primary shadow-sm ${s ? `opacity-40` : ``}`,
                children: [
                  (0, N.jsx)(`span`, {
                    className: `w-1.5 h-1.5 rounded-full bg-current shrink-0`,
                  }),
                  (0, N.jsxs)(`span`, {
                    className: `flex items-center gap-1 truncate`,
                    children: [
                      e.abilityType === `limited` &&
                        (0, N.jsx)(on, { size: 8, className: `opacity-70` }),
                      (0, N.jsx)(`span`, {
                        className: `truncate font-semibold`,
                        children: o,
                      }),
                    ],
                  }),
                  (0, N.jsx)(wn, { size: 10, className: `opacity-50` }),
                ],
              },
              e.id,
            );
          }),
          i &&
            (0, N.jsxs)(`button`, {
              onClick: (e) => {
                (e.stopPropagation(), n?.(e));
              },
              className: `text-[9px] text-text-muted font-bold w-full text-center hover:text-text-primary transition`,
              children: [`+`, e.length - Br],
            }),
        ],
      }),
    ],
  });
}
function Hr({ ab: e, used: t, exhausted: n, role: r, onUseSkill: i }) {
  let { t: a } = M();
  return (0, N.jsxs)(`button`, {
    onClick: (t) => !n && i(r.id, e, t),
    disabled: n,
    className: `text-[10px] border border-dashed rounded-lg py-1 px-1.5 flex justify-between md:justify-center items-center gap-1 font-bold w-full md:w-auto transition active:scale-95 ${n ? `border-border-default text-text-muted cursor-not-allowed` : `border-text-secondary text-text-primary hover:bg-bg-elevated`}`,
    children: [
      (0, N.jsx)(`span`, {
        className: `truncate max-w-[65%]`,
        children: Ir(a, e.nameKey, e.name),
      }),
      (0, N.jsx)(`span`, {
        className: `bg-bg-elevated px-1 rounded`,
        children:
          e.type === `limited` ? `${t}/${e.max}` : (0, N.jsx)(cn, { size: 8 }),
      }),
    ],
  });
}
var Ur = (0, _.memo)(function ({
  player: e,
  role: t,
  actions: n,
  isFlipped: r,
  viewMode: i,
  onFlip: a,
  onSelect: o,
  onUndoAction: s,
  onUseSkill: c,
}) {
  let { t: l } = M(),
    u = e.roleId === null,
    d = l(`game.villager`, `Dân Làng`),
    f = u ? d : Ir(l, t?.nameKey, t?.name || d),
    p = t?.abilities || [],
    m = u ? `villager` : t?.faction || `villager`,
    h = fr(m),
    g = e.alive ? `` : `line-through opacity-60`,
    [v, y] = (0, _.useState)(``),
    b = (0, _.useRef)(e.alive);
  (0, _.useEffect)(() => {
    (b.current && !e.alive
      ? y(`death-anim`)
      : !b.current && e.alive && y(`revive-anim`),
      (b.current = e.alive));
  }, [e.alive]);
  let x = (0, _.useCallback)(() => y(``), []),
    S = !e.alive && !v ? `dead-card` : ``;
  if (i === `both`)
    return (0, N.jsx)(`div`, {
      className: `w-full h-full min-h-[140px] md:min-h-[180px] lg:min-h-[190px]`,
      children: (0, N.jsxs)(`div`, {
        className: `w-full h-full p-3 flex flex-col rounded-2xl relative border ${h.border} bg-bg-card shadow-card overflow-y-auto hide-scrollbar card-pattern-${m} ${Rr[m] ?? ``} transition-shadow ${S} ${v}`,
        onAnimationEnd: x,
        children: [
          !e.alive && (0, N.jsx)(zr, {}),
          (0, N.jsxs)(`div`, {
            className: `flex justify-between items-center mb-2`,
            children: [
              (0, N.jsx)(`span`, {
                className: `bg-bg-elevated text-text-primary w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0`,
                children: e.id,
              }),
              (0, N.jsxs)(`div`, {
                className: `text-[11px] font-black uppercase tracking-widest truncate ml-2 text-center flex-1 ${h.text}`,
                children: [Lr[m], ` `, f],
              }),
              (0, N.jsx)(`button`, {
                onClick: (t) => o(e.id, t),
                className: `text-text-muted hover:text-text-primary ml-2 p-1`,
                "aria-label": l(`common.playerOptions`),
                children: (0, N.jsx)(en, { size: 14 }),
              }),
            ],
          }),
          (0, N.jsx)(`div`, {
            className: `font-black text-lg text-text-primary truncate px-1 text-center mb-5 ${g}`,
            children: e.name,
          }),
          !u &&
            p.length > 0 &&
            t &&
            (0, N.jsx)(`div`, {
              className: `flex flex-col md:flex-row md:flex-wrap md:justify-center gap-1 mb-3`,
              onClick: (e) => e.stopPropagation(),
              children: p.map((n) => {
                let r = e.abilityUsage[n.id] || 0;
                return (0, N.jsx)(
                  Hr,
                  {
                    ab: n,
                    used: r,
                    exhausted: n.type === `limited` && r >= n.max,
                    role: t,
                    onUseSkill: c,
                  },
                  n.id,
                );
              }),
            }),
          (0, N.jsx)(Vr, {
            actions: n,
            onUndoAction: s,
            onOverflowClick: (t) => o(e.id, t),
          }),
        ],
      }),
    });
  let C = (0, N.jsxs)(`div`, {
      className: `flip-face p-3 bg-bg-card border ${h.border} rounded-xl card-pattern-mixed`,
      children: [
        !e.alive && (0, N.jsx)(zr, {}),
        (0, N.jsx)(`div`, {
          className: `flex justify-between items-start mb-2`,
          children: (0, N.jsx)(`span`, {
            className: `w-7 h-7 rounded-full flex items-center justify-center font-black text-sm bg-bg-elevated text-text-primary`,
            children: e.id,
          }),
        }),
        (0, N.jsxs)(`div`, {
          className: `text-center mt-auto mb-auto`,
          children: [
            (0, N.jsx)(`div`, {
              className: `font-black text-xl truncate px-1 text-text-primary ${g}`,
              children: e.name,
            }),
            e.roleId &&
              (0, N.jsxs)(`div`, {
                className: `text-[8px] font-bold uppercase tracking-wider mt-1 ${h.text}`,
                children: [Lr[m], ` `, l(`factions.${m}`)],
              }),
          ],
        }),
        (0, N.jsx)(Vr, {
          actions: n,
          onUndoAction: s,
          onOverflowClick: (t) => o(e.id, t),
        }),
        (0, N.jsx)(`button`, {
          onClick: (t) => o(e.id, t),
          className: `absolute top-2 right-2 text-text-muted hover:text-text-primary p-2`,
          "aria-label": l(`common.playerOptions`),
          children: (0, N.jsx)(en, { size: 14 }),
        }),
      ],
    }),
    w = (0, N.jsxs)(`div`, {
      className: `flip-face flip-back p-2 ${h.bgLight} border ${h.border} rounded-xl card-pattern-${m}`,
      children: [
        !e.alive && (0, N.jsx)(zr, {}),
        (0, N.jsxs)(`div`, {
          className: `flex justify-between items-start`,
          children: [
            (0, N.jsx)(`span`, {
              className: `bg-bg-elevated text-text-secondary w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs`,
              children: e.id,
            }),
            (0, N.jsx)(`button`, {
              onClick: (t) => o(e.id, t),
              className: `text-text-muted hover:text-text-primary p-1 -mt-1`,
              "aria-label": l(`common.playerOptions`),
              children: (0, N.jsx)(en, { size: 14 }),
            }),
          ],
        }),
        (0, N.jsx)(`div`, {
          className: `text-center mt-1 mb-4`,
          children: (0, N.jsx)(`div`, {
            className: `font-black text-[15px] truncate px-1 uppercase tracking-widest ${h.textBright}`,
            children: f,
          }),
        }),
        (0, N.jsx)(`div`, {
          className: `flex-1 flex flex-col md:flex-row md:flex-wrap md:justify-center justify-start text-center gap-1`,
          onClick: (e) => e.stopPropagation(),
          children: u
            ? (0, N.jsx)(`span`, {
                className: `text-[11px] text-text-muted italic font-bold`,
                children: l(`game.noAbility`, `Không kỹ năng`),
              })
            : t &&
              p.map((n) => {
                let r = e.abilityUsage[n.id] || 0;
                return (0, N.jsx)(
                  Hr,
                  {
                    ab: n,
                    used: r,
                    exhausted: n.type === `limited` && r >= n.max,
                    role: t,
                    onUseSkill: c,
                  },
                  n.id,
                );
              }),
        }),
        (0, N.jsx)(Vr, {
          actions: n,
          onUndoAction: s,
          onOverflowClick: (t) => o(e.id, t),
        }),
      ],
    }),
    ee = i === `roleFirst` ? !r : r;
  return (0, N.jsx)(`div`, {
    className: `flip-container w-full h-full min-h-[140px] md:min-h-[180px] lg:min-h-[190px] cursor-pointer ${ee ? `flipped` : ``} ${S} ${v}`,
    onAnimationEnd: x,
    onClick: () => a(e.id),
    role: `button`,
    "aria-label": `${e.name} - ${f}`,
    "aria-expanded": ee,
    tabIndex: 0,
    onKeyDown: (t) => {
      (t.key === `Enter` || t.key === ` `) && (t.preventDefault(), a(e.id));
    },
    children: (0, N.jsxs)(`div`, {
      className: `flip-inner shadow-card rounded-xl ${Rr[m] ?? ``} transition-shadow`,
      children: [C, w],
    }),
  });
});
function Wr({ isOpen: e, onClose: t }) {
  let { t: n } = M(),
    r = lr(),
    i = F((e) => e.players),
    a = F((e) => e.togglePlayerRole),
    [o, s] = (0, _.useState)(null);
  return (0, N.jsx)(gr, {
    isOpen: e,
    onClose: t,
    title: n(`game.assignRole`),
    icon: (0, N.jsx)($t, { size: 20 }),
    fullHeight: !0,
    children: (0, N.jsx)(`div`, {
      className: `space-y-2`,
      children: r.map((e) => {
        let t = fr(e.faction),
          r = o === e.id,
          c = i.filter((t) => t.roleId === e.id);
        return (0, N.jsxs)(
          `div`,
          {
            className: `rounded-xl border border-border-default overflow-hidden`,
            children: [
              (0, N.jsxs)(`button`, {
                onClick: () => s(r ? null : e.id),
                className: `w-full flex items-center justify-between px-4 py-3 ${t.bgLight} transition`,
                "aria-expanded": r,
                children: [
                  (0, N.jsxs)(`div`, {
                    className: `flex items-center gap-3`,
                    children: [
                      (0, N.jsx)(`span`, {
                        className: `w-7 h-7 rounded-full ${t.bg} text-white text-xs font-black flex items-center justify-center`,
                        children: e.order,
                      }),
                      (0, N.jsx)(`span`, {
                        className: `font-bold ${t.textBright}`,
                        children: Ir(n, e.nameKey, e.name),
                      }),
                    ],
                  }),
                  (0, N.jsxs)(`div`, {
                    className: `flex items-center gap-2`,
                    children: [
                      c.length > 0 &&
                        (0, N.jsx)(`span`, {
                          className: `text-[10px] font-bold ${t.badge} text-white px-2 py-0.5 rounded-full`,
                          children: c.length,
                        }),
                      r
                        ? (0, N.jsx)(Xt, {
                            size: 14,
                            className: `text-text-muted`,
                          })
                        : (0, N.jsx)(Yt, {
                            size: 14,
                            className: `text-text-muted`,
                          }),
                    ],
                  }),
                ],
              }),
              r &&
                (0, N.jsx)(`div`, {
                  className: `p-3 grid grid-cols-4 gap-2 bg-bg-elevated/50`,
                  children: i.map((n) => {
                    let r = n.roleId === e.id,
                      i = n.roleId !== null && n.roleId !== e.id;
                    return (0, N.jsx)(
                      `button`,
                      {
                        onClick: () => a(n.id, e.id),
                        disabled: i,
                        className: `py-2 px-1 rounded-lg text-[11px] font-bold text-center transition active:scale-95 ${r ? `${t.bg} text-white ${t.shadow}` : i ? `bg-bg-elevated text-text-muted opacity-40 cursor-not-allowed` : `bg-bg-card text-text-secondary border border-border-default`}`,
                        "aria-pressed": r,
                        children: n.name,
                      },
                      n.id,
                    );
                  }),
                }),
            ],
          },
          e.id,
        );
      }),
    }),
  });
}
var Gr = {
  step: 1,
  ability: null,
  roleId: null,
  sourceId: null,
  targets: [],
  possibleSources: [],
  existingActionId: null,
};
function Kr({ isOpen: e, onClose: t, initialContext: n }) {
  let { t: r } = M(),
    i = lr(),
    a = F((e) => e.players),
    o = F((e) => e.actionLog),
    s = F((e) => e.executeAction),
    c = F((e) => e.undoAction),
    l = cr(),
    [u, d] = (0, _.useState)(Gr),
    [f, p] = (0, _.useState)(null),
    [m, h] = (0, _.useState)(null),
    g = (0, _.useRef)(a);
  g.current = a;
  let v = (0, _.useRef)(o);
  v.current = o;
  let y = (0, _.useCallback)((e, t) => {
      let n = v.current.filter((n) => n.sourceId === e && n.abilityId === t);
      return n.length === 0
        ? null
        : {
            actionId: n[0].id,
            targets: n
              .filter((e) => e.targetId !== e.sourceId)
              .map((e) => e.targetId),
          };
    }, []),
    b = (0, _.useCallback)(() => {
      (d(Gr), p(null), h(null), t());
    }, [t]),
    x = (0, _.useCallback)(
      (e, t) => {
        let n = g.current.filter((e) => e.roleId === t);
        if (n.length !== 0)
          if (n.length === 1) {
            let r = y(n[0].id, e.id);
            d({
              step: 3,
              ability: e,
              roleId: t,
              sourceId: n[0].id,
              targets: r?.targets ?? [],
              possibleSources: [],
              existingActionId: r?.actionId ?? null,
            });
          } else
            d({
              step: 2,
              ability: e,
              roleId: t,
              sourceId: null,
              targets: [],
              possibleSources: n.map((e) => ({
                id: e.id,
                name: e.name,
                alive: e.alive,
              })),
              existingActionId: null,
            });
      },
      [y],
    ),
    S = (0, _.useRef)(n);
  ((S.current = n),
    (0, _.useEffect)(() => {
      e && S.current && x(S.current.ability, S.current.roleId);
    }, [e, x]));
  let C = (e) => {
      d((t) => {
        let n = t.ability ? y(e, t.ability.id) : null;
        return {
          ...t,
          step: 3,
          sourceId: e,
          targets: n?.targets ?? [],
          existingActionId: n?.actionId ?? null,
        };
      });
    },
    w = (e) => {
      u.ability &&
        d((t) =>
          t.targets.includes(e)
            ? { ...t, targets: t.targets.filter((t) => t !== e) }
            : t.targets.length < u.ability.targetCount
              ? { ...t, targets: [...t.targets, e] }
              : t,
        );
    },
    ee = (e, t = !1) => {
      if (!(!u.ability || u.sourceId === null || !u.roleId)) {
        if (!t) {
          let t = l(u.sourceId, u.ability);
          if (!t.allowed && t.reason === `dead_source`) {
            let t = a.find((e) => e.id === u.sourceId);
            h({
              sourceId: u.sourceId,
              sourceName: t?.name ?? `#${u.sourceId}`,
              ability: u.ability,
              targets: e,
              roleId: u.roleId,
            });
            return;
          }
        }
        (u.existingActionId && c(u.existingActionId),
          s(u.sourceId, u.ability, e, u.roleId, t),
          d(Gr),
          p(null),
          h(null));
      }
    };
  return (0, N.jsxs)(gr, {
    isOpen: e,
    onClose: b,
    title: r(`game.useSkill`),
    icon: (0, N.jsx)(Cn, { size: 20 }),
    fullHeight: !0,
    children: [
      m &&
        (0, N.jsx)(`div`, {
          className: `step-enter`,
          children: (0, N.jsxs)(`div`, {
            className: `bg-amber-900/30 border border-amber-600/50 rounded-xl p-4 mb-4`,
            children: [
              (0, N.jsxs)(`div`, {
                className: `flex items-center gap-2 mb-3`,
                children: [
                  (0, N.jsx)(_n, { size: 18, className: `text-amber-400` }),
                  (0, N.jsx)(`span`, {
                    className: `font-bold text-amber-300 text-sm`,
                    children: r(`game.deadSourceWarning`, `Nguồn đã chết`),
                  }),
                ],
              }),
              (0, N.jsx)(`p`, {
                className: `text-sm text-text-secondary mb-4`,
                children: r(`game.deadSourceConfirm`, {
                  name: m.sourceName,
                  ability: Ir(r, m.ability.nameKey, m.ability.name),
                  defaultValue: `${m.sourceName} đã chết. Vẫn thực hiện ${Ir(r, m.ability.nameKey, m.ability.name)}?`,
                }),
              }),
              (0, N.jsxs)(`div`, {
                className: `flex gap-3`,
                children: [
                  (0, N.jsx)(`button`, {
                    onClick: () => h(null),
                    className: `flex-1 py-2 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95`,
                    children: r(`common.cancel`),
                  }),
                  (0, N.jsx)(`button`, {
                    onClick: () => {
                      m &&
                        (s(m.sourceId, m.ability, m.targets, m.roleId, !0),
                        d(Gr),
                        p(null),
                        h(null));
                    },
                    className: `flex-1 py-2 bg-amber-600 text-white font-bold rounded-xl transition active:scale-95`,
                    children: r(`common.confirm`),
                  }),
                ],
              }),
            ],
          }),
        }),
      !m &&
        u.step === 1 &&
        (0, N.jsx)(`div`, {
          className: `space-y-2 step-enter`,
          children: i.map((e) => {
            if (e.abilities.length === 0) return null;
            let t = fr(e.faction),
              n = a.filter((t) => t.roleId === e.id),
              i = f === e.id;
            return (0, N.jsxs)(
              `div`,
              {
                className: `rounded-xl border border-border-default overflow-hidden`,
                children: [
                  (0, N.jsxs)(`button`, {
                    onClick: () => p(i ? null : e.id),
                    className: `w-full flex items-center justify-between px-4 py-3 ${t.bgLight}`,
                    "aria-expanded": i,
                    children: [
                      (0, N.jsx)(`span`, {
                        className: `font-bold ${t.textBright}`,
                        children: Ir(r, e.nameKey, e.name),
                      }),
                      (0, N.jsx)(`span`, {
                        className: `flex flex-wrap gap-1 items-center`,
                        children:
                          n.length > 0
                            ? n.map((e) =>
                                (0, N.jsx)(
                                  `span`,
                                  {
                                    className: `text-[10px] px-1.5 py-0.5 rounded-md font-bold ${e.alive ? `bg-bg-overlay text-text-secondary` : `line-through bg-bg-elevated/50 text-text-muted`}`,
                                    children: e.name,
                                  },
                                  e.id,
                                ),
                              )
                            : (0, N.jsx)(`span`, {
                                className: `text-[10px] text-text-muted`,
                                children: `—`,
                              }),
                      }),
                    ],
                  }),
                  i &&
                    (0, N.jsx)(`div`, {
                      className: `p-3 space-y-2 bg-bg-elevated/50`,
                      children: e.abilities.map((t) => {
                        let n = a.filter((t) => t.roleId === e.id),
                          i =
                            t.type === `limited` &&
                            n.length > 0 &&
                            n.every(
                              (e) => (e.abilityUsage[t.id] || 0) >= t.max,
                            );
                        return (0, N.jsx)(
                          `button`,
                          {
                            onClick: () => !i && x(t, e.id),
                            disabled: i,
                            className: `w-full text-left px-3 py-2 rounded-lg border transition active:scale-[0.98] ${i ? `opacity-40 cursor-not-allowed bg-bg-elevated border-border-default` : `bg-bg-card border-border-default hover:bg-bg-elevated`}`,
                            children: (0, N.jsxs)(`span`, {
                              className: `flex items-center gap-2`,
                              children: [
                                (0, N.jsx)(`span`, {
                                  className: `font-bold text-sm ${i ? `text-text-muted line-through` : `text-text-primary`}`,
                                  children: Ir(r, t.nameKey, t.name),
                                }),
                                (0, N.jsxs)(`span`, {
                                  className: `inline-flex items-center gap-1 text-[10px] text-text-muted`,
                                  children: [
                                    t.type === `nightly`
                                      ? (0, N.jsx)(cn, { size: 10 })
                                      : (0, N.jsxs)(`span`, {
                                          children: [t.max, `x`],
                                        }),
                                    (0, N.jsx)(Qt, { size: 10 }),
                                    (0, N.jsx)(`span`, {
                                      children: t.targetCount,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          },
                          t.id,
                        );
                      }),
                    }),
                ],
              },
              e.id,
            );
          }),
        }),
      !m &&
        u.step === 2 &&
        (0, N.jsxs)(`div`, {
          className: `step-enter`,
          children: [
            (0, N.jsxs)(`button`, {
              onClick: () => d(Gr),
              className: `mb-3 text-sm text-indigo-500 font-bold`,
              children: [
                (0, N.jsx)(Gt, { size: 12, className: `mr-1 inline` }),
                ` `,
                r(`common.back`),
              ],
            }),
            (0, N.jsx)(`p`, {
              className: `text-sm text-text-muted mb-3`,
              children: r(`game.chooseSource`, `Chọn người thực hiện`),
            }),
            (0, N.jsx)(`div`, {
              className: `grid grid-cols-3 gap-2`,
              children: u.possibleSources.map((e) =>
                (0, N.jsxs)(
                  `button`,
                  {
                    onClick: () => C(e.id),
                    className: `py-3 bg-bg-card border border-border-default rounded-xl font-bold text-sm text-center transition active:scale-95 ${e.alive ? `text-text-primary` : `text-text-muted italic`}`,
                    children: [
                      !e.alive &&
                        (0, N.jsx)(pn, {
                          size: 10,
                          className: `inline mr-1 text-red-500`,
                        }),
                      e.name,
                    ],
                  },
                  e.id,
                ),
              ),
            }),
          ],
        }),
      !m &&
        u.step === 3 &&
        u.ability &&
        (0, N.jsxs)(`div`, {
          className: `flex flex-col flex-1 step-enter`,
          children: [
            (0, N.jsxs)(`button`, {
              onClick: () =>
                d((e) => ({
                  ...e,
                  step: e.possibleSources.length > 1 ? 2 : 1,
                  targets: [],
                })),
              className: `mb-3 text-sm text-indigo-500 font-bold`,
              children: [
                (0, N.jsx)(Gt, { size: 12, className: `mr-1 inline` }),
                ` `,
                r(`common.back`),
              ],
            }),
            (0, N.jsxs)(`p`, {
              className: `text-sm text-text-muted mb-3`,
              children: [
                a.find((e) => e.id === u.sourceId)?.name,
                ` —`,
                ` `,
                (0, N.jsx)(`strong`, {
                  children: Ir(r, u.ability.nameKey, u.ability.name),
                }),
                ` `,
                `(`,
                u.targets.length,
                `/`,
                u.ability.targetCount,
                `)`,
              ],
            }),
            (0, N.jsx)(`div`, {
              className: `grid grid-cols-4 gap-2 flex-1 content-start`,
              children: a.map((e) => {
                let t = u.targets.includes(e.id),
                  n = !e.alive;
                return (0, N.jsxs)(
                  `button`,
                  {
                    onClick: () => w(e.id),
                    className: `py-2 rounded-lg text-[11px] font-bold text-center transition active:scale-95 ${t ? `bg-indigo-600 text-white shadow-lg` : n ? `bg-bg-card text-text-muted border border-border-default opacity-50 italic` : `bg-bg-card text-text-secondary border border-border-default`}`,
                    "aria-selected": t,
                    "aria-label": `${e.name}${n ? ` (${r(`game.dead`)})` : ``}`,
                    children: [
                      n &&
                        (0, N.jsx)(pn, {
                          size: 10,
                          className: `inline mr-0.5 text-red-500`,
                        }),
                      e.name,
                    ],
                  },
                  e.id,
                );
              }),
            }),
            (0, N.jsxs)(`div`, {
              className: `flex gap-3 mt-4 pt-3 border-t border-border-default`,
              children: [
                (0, N.jsx)(`button`, {
                  onClick: () => ee([]),
                  className: `flex-1 py-3 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95`,
                  children: r(`game.skip`, `Bỏ qua`),
                }),
                (0, N.jsxs)(`button`, {
                  onClick: () => ee(u.targets),
                  disabled: u.targets.length === 0,
                  className: `flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl transition active:scale-95 disabled:opacity-40`,
                  children: [r(`common.confirm`), ` (`, u.targets.length, `)`],
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
function qr({ playerId: e, onClose: t, onUseSkill: n }) {
  let { t: r } = M(),
    i = F((e) => e.players),
    a = F((e) => e.roles),
    o = F((e) => e.togglePlayerStatus),
    s = F((e) => e.undoAction),
    c = sr();
  if (e === null) return null;
  let l = i.find((t) => t.id === e);
  if (!l) return null;
  let u = l.roleId ? a.find((e) => e.id === l.roleId) : null,
    d = u?.abilities || [],
    f = c.get(e) || [],
    p = fr(u?.faction || `villager`);
  return (0, N.jsx)(gr, {
    isOpen: !0,
    onClose: t,
    title: l.name,
    icon: (0, N.jsx)(yn, { size: 20 }),
    children: (0, N.jsxs)(`div`, {
      className: `py-3`,
      children: [
        (0, N.jsxs)(`div`, {
          className: `text-center mb-4`,
          children: [
            (0, N.jsx)(`p`, {
              className: `text-lg font-black uppercase tracking-widest mb-1 ${p.text}`,
              children: u ? Ir(r, u.nameKey, u.name) : r(`game.villager`),
            }),
            (0, N.jsx)(`p`, {
              className: `text-xs font-bold uppercase tracking-wider ${l.alive ? `text-emerald-500` : `text-red-500`}`,
              children: l.alive ? r(`game.alive`) : r(`game.dead`),
            }),
          ],
        }),
        d.length > 0 &&
          (0, N.jsxs)(`div`, {
            className: `mb-4`,
            children: [
              (0, N.jsx)(`p`, {
                className: `text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 text-center`,
                children: r(`game.skills`, `Kỹ năng`),
              }),
              (0, N.jsx)(`div`, {
                className: `flex flex-wrap justify-center gap-1.5`,
                children: d.map((e) => {
                  let t = l.abilityUsage[e.id] || 0,
                    i = e.type === `limited` && t >= e.max;
                  return (0, N.jsxs)(
                    `button`,
                    {
                      onClick: () => !i && u && n(u.id, e),
                      disabled: i,
                      className: `text-[11px] font-bold border border-dashed rounded-lg py-1.5 px-2.5 flex items-center gap-1.5 transition active:scale-95 ${i ? `border-white/15 text-text-muted cursor-not-allowed` : `${p.borderSolid} ${p.text} hover:bg-white/10`}`,
                      children: [
                        (0, N.jsx)(`span`, {
                          className: `truncate`,
                          children: Ir(r, e.nameKey, e.name),
                        }),
                        (0, N.jsx)(`span`, {
                          className: `bg-bg-elevated px-1 rounded text-[10px]`,
                          children:
                            e.type === `limited`
                              ? `${t}/${e.max}`
                              : (0, N.jsx)(cn, { size: 8 }),
                        }),
                      ],
                    },
                    e.id,
                  );
                }),
              }),
            ],
          }),
        f.length > 0 &&
          (0, N.jsxs)(`div`, {
            className: `mb-4`,
            children: [
              (0, N.jsx)(`p`, {
                className: `text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 text-center`,
                children: r(`game.usedSkills`, `Đã sử dụng`),
              }),
              (0, N.jsx)(`div`, {
                className: `flex flex-wrap justify-center gap-1.5`,
                children: f.map((e) => {
                  let t = fr(e.faction),
                    n = Ir(r, e.abilityNameKey, e.abilityName),
                    a = i.find((t) => t.id === e.sourceId);
                  return (0, N.jsxs)(
                    `button`,
                    {
                      onClick: () => s(e.id),
                      className: `text-[11px] px-2.5 py-1.5 rounded-lg border-b-2 flex items-center gap-1.5 ${t.bgLight} ${t.borderSolid} text-white shadow-sm transition active:scale-95`,
                      children: [
                        e.abilityType === `limited` &&
                          (0, N.jsx)(on, { size: 10, className: `opacity-70` }),
                        (0, N.jsx)(`span`, {
                          className: `font-bold tracking-wide truncate`,
                          children: n,
                        }),
                        a &&
                          (0, N.jsx)(`span`, {
                            className: `opacity-50 text-[9px]`,
                            children: a.name,
                          }),
                        (0, N.jsx)(wn, { size: 10, className: `opacity-50` }),
                      ],
                    },
                    e.id,
                  );
                }),
              }),
            ],
          }),
        (0, N.jsxs)(`button`, {
          onClick: () => {
            (o(l.id), t());
          },
          className: `w-full py-4 rounded-xl font-black text-lg uppercase transition active:scale-95 ${l.alive ? `bg-red-600 hover:bg-red-700 text-white` : `bg-emerald-600 hover:bg-emerald-700 text-white`}`,
          children: [
            l.alive
              ? (0, N.jsx)(pn, { size: 18, className: `mr-2 inline` })
              : (0, N.jsx)(rn, { size: 18, className: `mr-2 inline` }),
            l.alive ? r(`game.kill`, `Giết`) : r(`game.revive`, `Hồi sinh`),
          ],
        }),
      ],
    }),
  });
}
function Jr({ isOpen: e, onClose: t }) {
  let { t: n } = M(),
    r = F((e) => e.gameHistory),
    i = F((e) => e.actionLog),
    a = F((e) => e.statusChangeLog),
    o = F((e) => e.roleChangeLog),
    s = F((e) => e.players),
    c = F((e) => e.roles),
    l = F((e) => e.nightCount),
    u = F((e) => e.undoAction),
    [d, f] = (0, _.useState)(null),
    p = (e) => {
      if (!e) return ``;
      let t = new Date(e);
      return `${t.getHours().toString().padStart(2, `0`)}:${t.getMinutes().toString().padStart(2, `0`)}:${t.getSeconds().toString().padStart(2, `0`)}`;
    },
    m = (e) => {
      if (!e) return ``;
      let t = new Date(e);
      return `${t.getDate().toString().padStart(2, `0`)}/${(t.getMonth() + 1).toString().padStart(2, `0`)}`;
    },
    h = (e) => s.find((t) => t.id === e)?.name ?? `#${e}`,
    g = (e) => {
      if (!e) return n(`game.villager`, `Dân Làng`);
      let t = c.find((t) => t.id === e);
      return t ? Ir(n, t.nameKey, t.name) : `?`;
    },
    v = (0, _.useMemo)(
      () =>
        [
          ...i.map((e) => ({ kind: `action`, data: e, ts: e.timestamp })),
          ...a.map((e) => ({ kind: `status`, data: e, ts: e.timestamp })),
          ...o.map((e) => ({ kind: `role`, data: e, ts: e.timestamp })),
        ].sort((e, t) => e.ts - t.ts),
      [i, a, o],
    ),
    y = (e) =>
      [
        ...e.actionLogs.map((e) => ({
          kind: `action`,
          data: e,
          ts: e.timestamp,
        })),
        ...e.statusLogs.map((e) => ({
          kind: `status`,
          data: e,
          ts: e.timestamp,
        })),
        ...e.roleLogs.map((e) => ({ kind: `role`, data: e, ts: e.timestamp })),
      ].sort((e, t) => e.ts - t.ts),
    b = (e, t) => {
      if (e.kind === `action`) {
        let r = e.data,
          i = fr(r.faction);
        return (0, N.jsxs)(
          `tr`,
          {
            className: `border-b border-border-default last:border-0`,
            children: [
              (0, N.jsx)(`td`, {
                className: `py-1.5 pr-2 text-[10px] text-text-muted whitespace-nowrap align-middle`,
                children: p(r.timestamp),
              }),
              (0, N.jsx)(`td`, {
                className: `py-1.5 pr-2 align-middle`,
                children: (0, N.jsxs)(`div`, {
                  className: `flex items-center flex-wrap text-xs`,
                  children: [
                    (0, N.jsx)(`span`, {
                      className: `font-bold text-text-secondary`,
                      children: h(r.sourceId),
                    }),
                    (0, N.jsx)(`span`, {
                      className: `text-[7px] text-text-muted mx-2`,
                      children: (0, N.jsx)(Kt, { size: 7 }),
                    }),
                    (0, N.jsx)(`span`, {
                      className: `font-black ${i.textBright}`,
                      children: Ir(n, r.abilityNameKey, r.abilityName),
                    }),
                    r.targetId !== r.sourceId &&
                      (0, N.jsxs)(N.Fragment, {
                        children: [
                          (0, N.jsx)(`span`, {
                            className: `text-[7px] text-text-muted px-1.5`,
                            children: (0, N.jsx)(Kt, { size: 7 }),
                          }),
                          (0, N.jsx)(`span`, {
                            className: `font-bold text-text-secondary`,
                            children: h(r.targetId),
                          }),
                        ],
                      }),
                  ],
                }),
              }),
              t &&
                (0, N.jsx)(`td`, {
                  className: `py-1.5 align-middle text-right`,
                  children: (0, N.jsx)(`button`, {
                    onClick: () => u(r.id),
                    className: `w-5 h-5 rounded-full bg-red-900/40 text-red-500 inline-flex items-center justify-center hover:bg-red-800/60 transition`,
                    "aria-label": n(`game.undo`),
                    children: (0, N.jsx)(vn, { size: 10 }),
                  }),
                }),
            ],
          },
          r.id,
        );
      }
      if (e.kind === `status`) {
        let r = e.data,
          i = r.toStatus ? `text-emerald-500` : `text-red-500`;
        return (0, N.jsxs)(
          `tr`,
          {
            className: `border-b border-border-default last:border-0`,
            children: [
              (0, N.jsx)(`td`, {
                className: `py-1.5 pr-2 text-[10px] text-text-muted whitespace-nowrap align-middle`,
                children: p(r.timestamp),
              }),
              (0, N.jsxs)(`td`, {
                className: `py-1.5 pr-2 text-xs font-bold align-middle ${i}`,
                colSpan: t ? 1 : void 0,
                children: [
                  r.toStatus
                    ? (0, N.jsx)(rn, { size: 10, className: `mr-2 inline` })
                    : (0, N.jsx)(pn, { size: 10, className: `mr-2 inline` }),
                  h(r.playerId),
                  ` —`,
                  ` `,
                  r.toStatus ? n(`game.alive`) : n(`game.dead`),
                ],
              }),
              t && (0, N.jsx)(`td`, { className: `py-1.5` }),
            ],
          },
          `s-${r.playerId}-${r.timestamp}`,
        );
      }
      let r = e.data;
      return (0, N.jsxs)(
        `tr`,
        {
          className: `border-b border-border-default last:border-0`,
          children: [
            (0, N.jsx)(`td`, {
              className: `py-1.5 pr-2 text-[10px] text-text-muted whitespace-nowrap align-middle`,
              children: p(r.timestamp),
            }),
            (0, N.jsxs)(`td`, {
              className: `py-1.5 pr-2 text-xs text-amber-400 font-bold align-middle`,
              colSpan: t ? 1 : void 0,
              children: [
                (0, N.jsx)(Wt, { size: 10, className: `mr-2 inline` }),
                h(r.playerId),
                ` `,
                g(r.fromRoleId),
                ` → `,
                g(r.toRoleId),
              ],
            }),
            t && (0, N.jsx)(`td`, { className: `py-1.5` }),
          ],
        },
        `r-${r.playerId}-${r.timestamp}`,
      );
    };
  return (0, N.jsxs)(gr, {
    isOpen: e,
    onClose: t,
    title: n(`game.history`),
    icon: (0, N.jsx)(qt, { size: 20 }),
    fullHeight: !0,
    children: [
      (0, N.jsxs)(`section`, {
        "aria-label": n(`game.turn`, { count: l }),
        children: [
          (0, N.jsxs)(`div`, {
            className: `flex items-center gap-2 mb-3`,
            children: [
              (0, N.jsx)(`span`, {
                className: `bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full`,
                children: n(`game.turn`, { count: l }),
              }),
              (0, N.jsxs)(`span`, {
                className: `text-[10px] text-text-muted font-bold uppercase`,
                children: [`— `, n(`history.current`, `Current`)],
              }),
            ],
          }),
          v.length === 0
            ? (0, N.jsx)(`p`, {
                className: `text-sm text-text-muted italic pl-2 mb-4`,
                children: n(`game.noHistory`),
              })
            : (0, N.jsx)(`div`, {
                className: `overflow-x-auto mb-4`,
                children: (0, N.jsx)(`table`, {
                  className: `w-full text-left`,
                  children: (0, N.jsx)(`tbody`, {
                    children: v.map((e) => b(e, !0)),
                  }),
                }),
              }),
        ],
      }),
      r.length > 0 &&
        (0, N.jsxs)(`div`, {
          className: `border-t border-border-default pt-3`,
          children: [
            (0, N.jsx)(`p`, {
              className: `text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2`,
              children: n(`history.pastTurns`, `Past Turns`),
            }),
            (0, N.jsx)(`div`, {
              className: `space-y-2`,
              children: [...r].reverse().map((e) => {
                let t = d === e.night,
                  r = y(e);
                return (0, N.jsxs)(
                  `div`,
                  {
                    className: `rounded-xl border border-border-default overflow-hidden`,
                    children: [
                      (0, N.jsxs)(`button`, {
                        onClick: () => f(t ? null : e.night),
                        className: `w-full flex items-center justify-between px-3 py-2 bg-bg-elevated/50`,
                        "aria-expanded": t,
                        children: [
                          (0, N.jsxs)(`span`, {
                            className: `flex items-center gap-2`,
                            children: [
                              (0, N.jsx)(`span`, {
                                className: `text-xs font-black text-indigo-500`,
                                children: n(`game.turn`, { count: e.night }),
                              }),
                              e.endedAt &&
                                (0, N.jsxs)(`span`, {
                                  className: `text-[10px] text-text-muted`,
                                  children: [m(e.endedAt), ` `, p(e.endedAt)],
                                }),
                            ],
                          }),
                          (0, N.jsxs)(`span`, {
                            className: `text-[10px] text-text-muted`,
                            children: [
                              r.length,
                              ` `,
                              n(`history.actions`, `actions`),
                              ` `,
                              t
                                ? (0, N.jsx)(Xt, {
                                    size: 12,
                                    className: `ml-1 inline`,
                                  })
                                : (0, N.jsx)(Yt, {
                                    size: 12,
                                    className: `ml-1 inline`,
                                  }),
                            ],
                          }),
                        ],
                      }),
                      t &&
                        (0, N.jsx)(`div`, {
                          className: `overflow-x-auto p-3 bg-bg-card`,
                          children: (0, N.jsx)(`table`, {
                            className: `w-full text-left`,
                            children: (0, N.jsx)(`tbody`, {
                              children: r.map((e) => b(e, !1)),
                            }),
                          }),
                        }),
                    ],
                  },
                  e.night,
                );
              }),
            }),
          ],
        }),
    ],
  });
}
function Yr({ isOpen: e, onClose: t }) {
  let { t: n } = M(),
    r = F((e) => e.nightCount),
    i = F((e) => e.nextNight);
  return (0, N.jsx)(gr, {
    isOpen: e,
    onClose: t,
    icon: (0, N.jsx)(cn, { size: 20 }),
    children: (0, N.jsxs)(`div`, {
      "aria-label": n(`game.endTurn`, { count: r }),
      children: [
        (0, N.jsx)(`p`, {
          className: `text-center text-xl font-black text-text-primary mb-6`,
          children: n(`game.endTurn`, { count: r }),
        }),
        (0, N.jsxs)(`div`, {
          className: `flex gap-3`,
          children: [
            (0, N.jsx)(`button`, {
              onClick: t,
              className: `flex-1 py-4 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95`,
              children: n(`common.cancel`),
            }),
            (0, N.jsxs)(`button`, {
              onClick: () => {
                (jr(`night`), i(), t());
              },
              autoFocus: !0,
              className: `flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition active:scale-95`,
              children: [
                (0, N.jsx)(cn, { size: 16, className: `mr-2 inline` }),
                n(`common.confirm`),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function Xr({ nightCount: e, onComplete: t }) {
  let { t: n } = M(),
    [r, i] = (0, _.useState)(!1);
  return (
    (0, _.useEffect)(() => {
      let e = setTimeout(() => i(!0), 500),
        n = setTimeout(t, 2e3);
      return () => {
        (clearTimeout(e), clearTimeout(n));
      };
    }, [t]),
    (0, N.jsxs)(`div`, {
      className: `fixed inset-0 z-[110] flex flex-col items-center justify-center night-overlay`,
      style: {
        background: `radial-gradient(ellipse, #1E1B4B 0%, #020203 100%)`,
      },
      onClick: (0, _.useCallback)(() => {
        r && t();
      }, [r, t]),
      role: `status`,
      "aria-live": `assertive`,
      children: [
        (0, N.jsx)(cn, {
          size: 48,
          className: `text-indigo-400 mb-6 opacity-80`,
        }),
        (0, N.jsx)(`h2`, {
          className: `text-5xl font-display font-black uppercase tracking-[0.3em] text-indigo-300`,
          children: n(`game.turn`, { count: e }),
        }),
        r &&
          (0, N.jsx)(`p`, {
            className: `mt-8 text-xs text-indigo-500/60 uppercase tracking-widest`,
            children: n(`game.tapToSkip`, `Chạm để bỏ qua`),
          }),
      ],
    })
  );
}
var Zr = [];
function Qr(e) {
  let t = e.target;
  if (!t) return !1;
  let n = t.tagName;
  return !!(
    n === `INPUT` ||
    n === `TEXTAREA` ||
    n === `SELECT` ||
    t.isContentEditable ||
    t.getAttribute(`role`) === `textbox`
  );
}
function $r() {
  let { t: e } = M(),
    t = F((e) => e.nightCount),
    n = F((e) => e.timerSettings),
    r = F((e) => e.cardViewMode),
    i = F((e) => e.flippedCards),
    a = F((e) => e.flipCard),
    o = F((e) => e.undoAction),
    s = F((e) => e.redoAction),
    c = F((e) => e.actionLog),
    l = F((e) => e.redoStack),
    u = ur(),
    d = or(),
    f = sr(),
    p = (0, _.useRef)(null),
    [m, h] = (0, _.useState)(null),
    [g, v] = (0, _.useState)(null),
    [y, b] = (0, _.useState)(null),
    [x, S] = (0, _.useState)(!1),
    C = (0, _.useCallback)((e) => {
      h(e);
    }, []),
    w = (0, _.useCallback)(() => h(null), []),
    ee = (0, _.useCallback)((e, t) => {
      (t.stopPropagation(), v(e));
    }, []),
    T = (0, _.useCallback)(
      (e, t) => {
        (t.stopPropagation(), o(e));
      },
      [o],
    ),
    te = (0, _.useCallback)((e, t, n) => {
      (n.stopPropagation(), b({ ability: t, roleId: e }), h(`skill`));
    }, []),
    ne = (0, _.useCallback)(() => {
      (h(null), b(null));
    }, []),
    re = (0, _.useCallback)(() => h(`assign`), []),
    ie = (0, _.useCallback)(() => {
      (b(null), h(`skill`));
    }, []),
    ae = (0, _.useCallback)(() => v(null), []),
    oe = (0, _.useCallback)((e, t) => {
      (v(null), b({ ability: t, roleId: e }), h(`skill`));
    }, []);
  (0, _.useEffect)(() => {
    let e = (e) => {
      if (e.key === `Escape`) {
        let t = m || g !== null;
        (m && h(null),
          g !== null && v(null),
          t && e.stopImmediatePropagation());
        return;
      }
      if (!Qr(e)) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === `z`) {
          if ((e.preventDefault(), e.shiftKey)) l.length > 0 && s();
          else if (c.length > 0) {
            let e = c[c.length - 1];
            o(e.id);
          }
          return;
        }
        switch (e.key.toLowerCase()) {
          case `n`:
            m || h(`night`);
            break;
          case `h`:
            h((e) => (e === `history` ? null : `history`));
            break;
          case `s`:
            h((e) => (e === `settings` ? null : `settings`));
            break;
          case `d`:
            m || p.current?.(n.debate, `debate`);
            break;
          case `j`:
            m || p.current?.(n.judgment, `judgment`);
            break;
        }
      }
    };
    return (
      document.addEventListener(`keydown`, e),
      () => document.removeEventListener(`keydown`, e)
    );
  }, [m, g, c, l, o, s, n]);
  let se = (0, _.useCallback)(() => S(!1), []),
    ce = (0, _.useRef)(t);
  return (
    (0, _.useEffect)(() => {
      (t > ce.current && S(!0), (ce.current = t));
    }, [t]),
    (0, N.jsxs)(`div`, {
      className: `h-dvh flex flex-col md:flex-row bg-bg-app ${t > 0 ? `night-atmosphere` : ``}`,
      children: [
        (0, N.jsx)(Fr, {
          settings: n,
          nightCount: t,
          onOpenModal: C,
          onOpenAssign: re,
          onOpenSkill: ie,
          timerStartRef: p,
        }),
        (0, N.jsx)(`main`, {
          className: `flex-1 overflow-y-auto min-h-0 p-2 md:p-4 pb-20 md:pb-4`,
          children: (0, N.jsx)(`div`, {
            className: `grid grid-cols-2 landscape:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 content-start`,
            children: u.map((e, t) =>
              (0, N.jsx)(
                `div`,
                {
                  className: `card-enter h-full`,
                  style: { animationDelay: `${t * 40}ms` },
                  children: (0, N.jsx)(Ur, {
                    player: e,
                    role: e.roleId ? d.get(e.roleId) : void 0,
                    actions: f.get(e.id) ?? Zr,
                    isFlipped: !!i[e.id],
                    viewMode: r,
                    onFlip: a,
                    onSelect: ee,
                    onUndoAction: T,
                    onUseSkill: te,
                  }),
                },
                e.id,
              ),
            ),
          }),
        }),
        (0, N.jsxs)(`div`, {
          className: `fixed bottom-4 right-4 z-20 md:hidden flex flex-col items-center gap-2`,
          children: [
            (0, N.jsx)(`button`, {
              onClick: re,
              className: `w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-elevated flex items-center justify-center active:scale-95 transition`,
              "aria-label": e(`game.assignRole`),
              children: (0, N.jsx)($t, { size: 20 }),
            }),
            (0, N.jsx)(`button`, {
              onClick: ie,
              className: `w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-elevated flex items-center justify-center active:scale-95 transition`,
              "aria-label": e(`game.useSkill`),
              children: (0, N.jsx)(Cn, { size: 20 }),
            }),
          ],
        }),
        x && (0, N.jsx)(Xr, { nightCount: t, onComplete: se }),
        m === `assign` && (0, N.jsx)(Wr, { isOpen: !0, onClose: w }),
        m === `skill` &&
          (0, N.jsx)(Kr, { isOpen: !0, onClose: ne, initialContext: y }),
        g !== null &&
          (0, N.jsx)(qr, { playerId: g, onClose: ae, onUseSkill: oe }),
        m === `history` && (0, N.jsx)(Jr, { isOpen: !0, onClose: w }),
        m === `night` && (0, N.jsx)(Yr, { isOpen: !0, onClose: w }),
        m === `settings` && (0, N.jsx)(Sr, { isOpen: !0, onClose: w }),
      ],
    })
  );
}
function ei() {
  let { t: e } = M(),
    [t, n] = (0, _.useState)(!1);
  return (
    (0, _.useEffect)(() => {
      let e = () => n(!0);
      return (
        window.addEventListener(`sw-update-available`, e),
        () => window.removeEventListener(`sw-update-available`, e)
      );
    }, []),
    t
      ? (0, N.jsx)(gr, {
          isOpen: t,
          onClose: () => n(!1),
          title: e(`pwa.newMoon`, `Trăng mới mọc...`),
          icon: (0, N.jsx)(cn, { size: 20, className: `text-indigo-400` }),
          titleColor: `text-indigo-300`,
          children: (0, N.jsxs)(`div`, {
            className: `text-center py-6`,
            children: [
              (0, N.jsx)(cn, {
                size: 48,
                className: `text-indigo-400 mx-auto mb-4 moon-glow`,
              }),
              (0, N.jsx)(`p`, {
                className: `text-text-secondary text-sm font-bold mb-8`,
                children: e(
                  `pwa.updateAvailable`,
                  `Bản cập nhật mới đã sẵn sàng!`,
                ),
              }),
              (0, N.jsxs)(`div`, {
                className: `flex gap-3`,
                children: [
                  (0, N.jsx)(`button`, {
                    onClick: () => n(!1),
                    className: `flex-1 py-3 bg-bg-elevated text-text-secondary font-bold rounded-xl transition active:scale-95`,
                    children: e(`pwa.later`, `Để sau`),
                  }),
                  (0, N.jsx)(`button`, {
                    onClick: () => {
                      (window.__updateSW?.(!0), n(!1));
                    },
                    className: `flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg transition active:scale-95 uppercase tracking-wide`,
                    children: e(`pwa.updateNow`, `Cập nhật ngay`),
                  }),
                ],
              }),
            ],
          }),
        })
      : null
  );
}
function ti() {
  return (0, N.jsxs)(Pt, {
    children: [
      (0, N.jsx)(`div`, {
        className: `w-full min-h-dvh md:min-h-screen max-w-lg md:max-w-none mx-auto bg-bg-app md:border-x md:border-border-default shadow-2xl`,
        children:
          F((e) => e.step) === `setup`
            ? (0, N.jsx)(wr, {})
            : (0, N.jsx)($r, {}),
      }),
      (0, N.jsx)(ei, {}),
    ],
  });
}
var ni = `modulepreload`,
  ri = function (e) {
    return `/` + e;
  },
  ii = {},
  ai = function (e, t, n) {
    let r = Promise.resolve();
    if (t && t.length > 0) {
      let e = document.getElementsByTagName(`link`),
        i = document.querySelector(`meta[property=csp-nonce]`),
        a = i?.nonce || i?.getAttribute(`nonce`);
      function o(e) {
        return Promise.all(
          e.map((e) =>
            Promise.resolve(e).then(
              (e) => ({ status: `fulfilled`, value: e }),
              (e) => ({ status: `rejected`, reason: e }),
            ),
          ),
        );
      }
      r = o(
        t.map((t) => {
          if (((t = ri(t, n)), t in ii)) return;
          ii[t] = !0;
          let r = t.endsWith(`.css`),
            i = r ? `[rel="stylesheet"]` : ``;
          if (n)
            for (let n = e.length - 1; n >= 0; n--) {
              let i = e[n];
              if (i.href === t && (!r || i.rel === `stylesheet`)) return;
            }
          else if (document.querySelector(`link[href="${t}"]${i}`)) return;
          let o = document.createElement(`link`);
          if (
            ((o.rel = r ? `stylesheet` : ni),
            r || (o.as = `script`),
            (o.crossOrigin = ``),
            (o.href = t),
            a && o.setAttribute(`nonce`, a),
            document.head.appendChild(o),
            r)
          )
            return new Promise((e, n) => {
              (o.addEventListener(`load`, e),
                o.addEventListener(`error`, () =>
                  n(Error(`Unable to preload CSS for ${t}`)),
                ));
            });
        }),
      );
    }
    function i(e) {
      let t = new Event(`vite:preloadError`, { cancelable: !0 });
      if (((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented))
        throw e;
    }
    return r.then((t) => {
      for (let e of t || []) e.status === `rejected` && i(e.reason);
      return e().catch(i);
    });
  },
  oi = `false`,
  si = `false`,
  ci = oi === `true`,
  li = si === `true`;
function ui(e = {}) {
  let {
      immediate: t = !1,
      onNeedRefresh: n,
      onOfflineReady: r,
      onRegistered: i,
      onRegisteredSW: a,
      onRegisterError: o,
    } = e,
    s,
    c,
    l,
    u = async (e = !0) => {
      (await c, ci || l?.());
    };
  async function d() {
    if (`serviceWorker` in navigator) {
      if (
        ((s = await ai(async () => {
          let { Workbox: e } = await import(
            `./workbox-window.prod.es5-Bq4GJJid.js`
          );
          return { Workbox: e };
        }, [])
          .then(
            ({ Workbox: e }) =>
              new e(`/sw.js`, { scope: `/`, type: `classic` }),
          )
          .catch((e) => {
            o?.(e);
          })),
        !s)
      )
        return;
      if (
        ((l = () => {
          s?.messageSkipWaiting();
        }),
        !li)
      )
        if (ci)
          (s.addEventListener(`activated`, (e) => {
            (e.isUpdate || e.isExternal) && window.location.reload();
          }),
            s.addEventListener(`installed`, (e) => {
              e.isUpdate || r?.();
            }));
        else {
          let e = !1,
            t = () => {
              ((e = !0),
                s?.addEventListener(`controlling`, (e) => {
                  e.isUpdate && window.location.reload();
                }),
                n?.());
            };
          (s.addEventListener(`installed`, (n) => {
            n.isUpdate === void 0
              ? n.isExternal === void 0
                ? !e && r?.()
                : n.isExternal
                  ? t()
                  : !e && r?.()
              : n.isUpdate || r?.();
          }),
            s.addEventListener(`waiting`, t));
        }
      s.register({ immediate: t })
        .then((e) => {
          a ? a(`/sw.js`, e) : i?.(e);
        })
        .catch((e) => {
          o?.(e);
        });
    }
  }
  return ((c = d()), u);
}
((window.requestIdleCallback || ((e) => setTimeout(e, 1)))(() => Ar()),
  kr(
    (e) => (
      e(F.getState().timerSettings.muted),
      F.subscribe((t) => e(t.timerSettings.muted))
    ),
  ));
var di = ui({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent(`sw-update-available`));
  },
});
((window.__updateSW = di),
  (0, v.createRoot)(document.getElementById(`root`)).render(
    (0, N.jsx)(_.StrictMode, { children: (0, N.jsx)(ti, {}) }),
  ));

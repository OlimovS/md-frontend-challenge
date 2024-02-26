var st = Object.defineProperty;
var nt = (e, t, r) =>
  t in e
    ? st(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
    : (e[t] = r);
var w = (e, t, r) => (nt(e, typeof t != "symbol" ? t + "" : t, r), r),
  Z = (e, t, r) => {
    if (!t.has(e)) throw TypeError("Cannot " + r);
  };
var W = (e, t, r) => (
    Z(e, t, "read from private field"), r ? r.call(e) : t.get(e)
  ),
  ee = (e, t, r) => {
    if (t.has(e))
      throw TypeError("Cannot add the same private member more than once");
    t instanceof WeakSet ? t.add(e) : t.set(e, r);
  },
  he = (e, t, r, s) => (
    Z(e, t, "write to private field"), s ? s.call(e, r) : t.set(e, r), r
  );
var G = (e, t, r) => (Z(e, t, "access private method"), r);
import { g as ot } from "./index-BrF7mM-d.js";
var it = /(%?)(%([sdijo]))/g;
function at(e, t) {
  switch (t) {
    case "s":
      return e;
    case "d":
    case "i":
      return Number(e);
    case "j":
      return JSON.stringify(e);
    case "o": {
      if (typeof e == "string") return e;
      const r = JSON.stringify(e);
      return r === "{}" || r === "[]" || /^\[object .+?\]$/.test(r) ? e : r;
    }
  }
}
function ce(e, ...t) {
  if (t.length === 0) return e;
  let r = 0,
    s = e.replace(it, (n, o, i, u) => {
      const a = t[r],
        c = at(a, u);
      return o ? n : (r++, c);
    });
  return (
    r < t.length && (s += ` ${t.slice(r).join(" ")}`),
    (s = s.replace(/%{2,2}/g, "%")),
    s
  );
}
var ct = 2;
function ut(e) {
  if (!e.stack) return;
  const t = e.stack.split(`
`);
  t.splice(1, ct),
    (e.stack = t.join(`
`));
}
var lt = class extends Error {
    constructor(t, ...r) {
      super(t),
        (this.message = t),
        (this.name = "Invariant Violation"),
        (this.message = ce(t, ...r)),
        ut(this);
    }
  },
  F = (e, t, ...r) => {
    if (!e) throw new lt(t, ...r);
  };
F.as = (e, t, r, ...s) => {
  if (!t) {
    const n = s.length === 0 ? r : ce(r, s);
    let o;
    try {
      o = Reflect.construct(e, [n]);
    } catch {
      o = e(n);
    }
    throw o;
  }
};
const dt = "[MSW]";
function ue(e, ...t) {
  const r = ce(e, ...t);
  return `${dt} ${r}`;
}
function ht(e, ...t) {
  console.warn(ue(e, ...t));
}
function ft(e, ...t) {
  console.error(ue(e, ...t));
}
const b = { formatMessage: ue, warn: ht, error: ft },
  pt = /[\/\\]msw[\/\\]src[\/\\](.+)/,
  gt =
    /(node_modules)?[\/\\]lib[\/\\](core|browser|node|native|iife)[\/\\]|^[^\/\\]*$/;
function mt(e) {
  const t = e.stack;
  if (!t) return;
  const s = t
    .split(
      `
`
    )
    .slice(1)
    .find((o) => !(pt.test(o) || gt.test(o)));
  return s
    ? s.replace(/\s*at [^()]*\(([^)]+)\)/, "$1").replace(/^@/, "")
    : void 0;
}
function vt(e) {
  return e ? typeof e[Symbol.iterator] == "function" : !1;
}
const N = class N {
  constructor(t) {
    w(this, "info");
    w(this, "isUsed");
    w(this, "resolver");
    w(this, "resolverGenerator");
    w(this, "resolverGeneratorResult");
    w(this, "options");
    (this.resolver = t.resolver), (this.options = t.options);
    const r = mt(new Error());
    (this.info = { ...t.info, callFrame: r }), (this.isUsed = !1);
  }
  async parse(t) {
    return {};
  }
  async test(t) {
    const r = await this.parse({
      request: t.request,
      resolutionContext: t.resolutionContext,
    });
    return this.predicate({
      request: t.request,
      parsedResult: r,
      resolutionContext: t.resolutionContext,
    });
  }
  extendResolverArgs(t) {
    return {};
  }
  cloneRequestOrGetFromCache(t) {
    const r = N.cache.get(t);
    if (typeof r < "u") return r;
    const s = t.clone();
    return N.cache.set(t, s), s;
  }
  async run(t) {
    var l, h;
    if (this.isUsed && (l = this.options) != null && l.once) return null;
    const r = this.cloneRequestOrGetFromCache(t.request),
      s = await this.parse({
        request: t.request,
        resolutionContext: t.resolutionContext,
      });
    if (
      !this.predicate({
        request: t.request,
        parsedResult: s,
        resolutionContext: t.resolutionContext,
      }) ||
      (this.isUsed && (h = this.options) != null && h.once)
    )
      return null;
    this.isUsed = !0;
    const o = this.wrapResolver(this.resolver),
      i = this.extendResolverArgs({ request: t.request, parsedResult: s }),
      a = await o({ ...i, requestId: t.requestId, request: t.request }).catch(
        (d) => {
          if (d instanceof Response) return d;
          throw d;
        }
      );
    return this.createExecutionResult({
      request: r,
      requestId: t.requestId,
      response: a,
      parsedResult: s,
    });
  }
  wrapResolver(t) {
    return async (r) => {
      const s = this.resolverGenerator || (await t(r));
      if (vt(s)) {
        this.isUsed = !1;
        const { value: n, done: o } = s[Symbol.iterator]().next(),
          i = await n;
        return (
          o && (this.isUsed = !0),
          !i && o
            ? (F(
                this.resolverGeneratorResult,
                "Failed to returned a previously stored generator response: the value is not a valid Response."
              ),
              this.resolverGeneratorResult.clone())
            : (this.resolverGenerator || (this.resolverGenerator = s),
              i &&
                (this.resolverGeneratorResult = i == null ? void 0 : i.clone()),
              i)
        );
      }
      return s;
    };
  }
  createExecutionResult(t) {
    return {
      handler: this,
      request: t.request,
      requestId: t.requestId,
      response: t.response,
      parsedResult: t.parsedResult,
    };
  }
};
w(N, "cache", new WeakMap());
let z = N;
var yt = async (e) => {
  try {
    return {
      error: null,
      data: await e().catch((r) => {
        throw r;
      }),
    };
  } catch (t) {
    return { error: t, data: null };
  }
};
const wt = async ({
  request: e,
  requestId: t,
  handlers: r,
  resolutionContext: s,
}) => {
  let n = null,
    o = null;
  for (const i of r)
    if (
      ((o = await i.run({ request: e, requestId: t, resolutionContext: s })),
      o !== null && (n = i),
      o != null && o.response)
    )
      break;
  return n
    ? {
        handler: n,
        parsedResult: o == null ? void 0 : o.parsedResult,
        response: o == null ? void 0 : o.response,
      }
    : null;
};
function Se(e) {
  if (typeof location > "u") return e.toString();
  const t = e instanceof URL ? e : new URL(e);
  return t.origin === location.origin ? t.pathname : t.origin + t.pathname;
}
async function bt(e, t = "warn") {
  const r = new URL(e.url),
    s = Se(r),
    n = `intercepted a request without a matching request handler:

  • ${e.method} ${s}

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks`;
  function o(i) {
    switch (i) {
      case "error":
        throw (
          (b.error("Error: %s", n),
          new Error(
            b.formatMessage(
              'Cannot bypass a request when using the "error" strategy for the "onUnhandledRequest" option.'
            )
          ))
        );
      case "warn": {
        b.warn("Warning: %s", n);
        break;
      }
      case "bypass":
        break;
      default:
        throw new Error(
          b.formatMessage(
            'Failed to react to an unhandled request: unknown strategy "%s". Please provide one of the supported strategies ("bypass", "warn", "error") or a custom callback function as the value of the "onUnhandledRequest" option.',
            i
          )
        );
    }
  }
  if (typeof t == "function") {
    t(e, { warning: o.bind(null, "warn"), error: o.bind(null, "error") });
    return;
  }
  r.protocol !== "file:" && o(t);
}
var Et = Object.create,
  Pe = Object.defineProperty,
  xt = Object.getOwnPropertyDescriptor,
  Te = Object.getOwnPropertyNames,
  kt = Object.getPrototypeOf,
  Lt = Object.prototype.hasOwnProperty,
  Rt = (e, t) =>
    function () {
      return t || (0, e[Te(e)[0]])((t = { exports: {} }).exports, t), t.exports;
    },
  St = (e, t, r, s) => {
    if ((t && typeof t == "object") || typeof t == "function")
      for (let n of Te(t))
        !Lt.call(e, n) &&
          n !== r &&
          Pe(e, n, {
            get: () => t[n],
            enumerable: !(s = xt(t, n)) || s.enumerable,
          });
    return e;
  },
  Pt = (e, t, r) => (
    (r = e != null ? Et(kt(e)) : {}),
    St(
      t || !e || !e.__esModule
        ? Pe(r, "default", { value: e, enumerable: !0 })
        : r,
      e
    )
  ),
  Tt = Rt({
    "node_modules/set-cookie-parser/lib/set-cookie.js"(e, t) {
      var r = { decodeValues: !0, map: !1, silent: !1 };
      function s(a) {
        return typeof a == "string" && !!a.trim();
      }
      function n(a, c) {
        var l = a.split(";").filter(s),
          h = l.shift(),
          d = o(h),
          p = d.name,
          g = d.value;
        c = c ? Object.assign({}, r, c) : r;
        try {
          g = c.decodeValues ? decodeURIComponent(g) : g;
        } catch (m) {
          console.error(
            "set-cookie-parser encountered an error while decoding a cookie with value '" +
              g +
              "'. Set options.decodeValues to false to disable this feature.",
            m
          );
        }
        var f = { name: p, value: g };
        return (
          l.forEach(function (m) {
            var v = m.split("="),
              E = v.shift().trimLeft().toLowerCase(),
              k = v.join("=");
            E === "expires"
              ? (f.expires = new Date(k))
              : E === "max-age"
              ? (f.maxAge = parseInt(k, 10))
              : E === "secure"
              ? (f.secure = !0)
              : E === "httponly"
              ? (f.httpOnly = !0)
              : E === "samesite"
              ? (f.sameSite = k)
              : (f[E] = k);
          }),
          f
        );
      }
      function o(a) {
        var c = "",
          l = "",
          h = a.split("=");
        return (
          h.length > 1 ? ((c = h.shift()), (l = h.join("="))) : (l = a),
          { name: c, value: l }
        );
      }
      function i(a, c) {
        if (((c = c ? Object.assign({}, r, c) : r), !a)) return c.map ? {} : [];
        if (a.headers)
          if (typeof a.headers.getSetCookie == "function")
            a = a.headers.getSetCookie();
          else if (a.headers["set-cookie"]) a = a.headers["set-cookie"];
          else {
            var l =
              a.headers[
                Object.keys(a.headers).find(function (d) {
                  return d.toLowerCase() === "set-cookie";
                })
              ];
            !l &&
              a.headers.cookie &&
              !c.silent &&
              console.warn(
                "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
              ),
              (a = l);
          }
        if (
          (Array.isArray(a) || (a = [a]),
          (c = c ? Object.assign({}, r, c) : r),
          c.map)
        ) {
          var h = {};
          return a.filter(s).reduce(function (d, p) {
            var g = n(p, c);
            return (d[g.name] = g), d;
          }, h);
        } else
          return a.filter(s).map(function (d) {
            return n(d, c);
          });
      }
      function u(a) {
        if (Array.isArray(a)) return a;
        if (typeof a != "string") return [];
        var c = [],
          l = 0,
          h,
          d,
          p,
          g,
          f;
        function m() {
          for (; l < a.length && /\s/.test(a.charAt(l)); ) l += 1;
          return l < a.length;
        }
        function v() {
          return (d = a.charAt(l)), d !== "=" && d !== ";" && d !== ",";
        }
        for (; l < a.length; ) {
          for (h = l, f = !1; m(); )
            if (((d = a.charAt(l)), d === ",")) {
              for (p = l, l += 1, m(), g = l; l < a.length && v(); ) l += 1;
              l < a.length && a.charAt(l) === "="
                ? ((f = !0), (l = g), c.push(a.substring(h, p)), (h = l))
                : (l = p + 1);
            } else l += 1;
          (!f || l >= a.length) && c.push(a.substring(h, a.length));
        }
        return c;
      }
      (t.exports = i),
        (t.exports.parse = i),
        (t.exports.parseString = n),
        (t.exports.splitCookiesString = u);
    },
  }),
  fe = Pt(Tt()),
  O = "MSW_COOKIE_STORE";
function pe() {
  try {
    if (localStorage == null) return !1;
    const e = O + "_test";
    return (
      localStorage.setItem(e, "test"),
      localStorage.getItem(e),
      localStorage.removeItem(e),
      !0
    );
  } catch {
    return !1;
  }
}
function ge(e, t) {
  try {
    return e[t], !0;
  } catch {
    return !1;
  }
}
var Ct = class {
    constructor() {
      this.store = new Map();
    }
    add(e, t) {
      if (ge(e, "credentials") && e.credentials === "omit") return;
      const r = new URL(e.url),
        s = t.headers.get("set-cookie");
      if (!s) return;
      const n = Date.now(),
        o = (0, fe.parse)(s).map(({ maxAge: u, ...a }) => ({
          ...a,
          expires: u === void 0 ? a.expires : new Date(n + u * 1e3),
          maxAge: u,
        })),
        i = this.store.get(r.origin) || new Map();
      o.forEach((u) => {
        this.store.set(r.origin, i.set(u.name, u));
      });
    }
    get(e) {
      this.deleteExpiredCookies();
      const t = new URL(e.url),
        r = this.store.get(t.origin) || new Map();
      if (!ge(e, "credentials")) return r;
      switch (e.credentials) {
        case "include":
          return (
            typeof document > "u" ||
              (0, fe.parse)(document.cookie).forEach((n) => {
                r.set(n.name, n);
              }),
            r
          );
        case "same-origin":
          return r;
        default:
          return new Map();
      }
    }
    getAll() {
      return this.deleteExpiredCookies(), this.store;
    }
    deleteAll(e) {
      const t = new URL(e.url);
      this.store.delete(t.origin);
    }
    clear() {
      this.store.clear();
    }
    hydrate() {
      if (!pe()) return;
      const e = localStorage.getItem(O);
      if (e)
        try {
          JSON.parse(e).forEach(([r, s]) => {
            this.store.set(
              r,
              new Map(
                s.map(([n, { expires: o, ...i }]) => [
                  n,
                  o === void 0 ? i : { ...i, expires: new Date(o) },
                ])
              )
            );
          });
        } catch (t) {
          console.warn(`
[virtual-cookie] Failed to parse a stored cookie from the localStorage (key "${O}").

Stored value:
${localStorage.getItem(O)}

Thrown exception:
${t}

Invalid value has been removed from localStorage to prevent subsequent failed parsing attempts.`),
            localStorage.removeItem(O);
        }
    }
    persist() {
      if (!pe()) return;
      const e = Array.from(this.store.entries()).map(([t, r]) => [
        t,
        Array.from(r.entries()),
      ]);
      localStorage.setItem(O, JSON.stringify(e));
    }
    deleteExpiredCookies() {
      const e = Date.now();
      this.store.forEach((t, r) => {
        t.forEach(({ expires: s, name: n }) => {
          s !== void 0 && s.getTime() <= e && t.delete(n);
        }),
          t.size === 0 && this.store.delete(r);
      });
    }
  },
  K = new Ct();
function _t(e, t) {
  K.add({ ...e, url: e.url.toString() }, t), K.persist();
}
async function Ce(e, t, r, s, n, o) {
  var l, h, d, p, g, f;
  if (
    (n.emit("request:start", { request: e, requestId: t }),
    e.headers.get("x-msw-intention") === "bypass")
  ) {
    n.emit("request:end", { request: e, requestId: t }),
      (l = o == null ? void 0 : o.onPassthroughResponse) == null ||
        l.call(o, e);
    return;
  }
  const i = await yt(() =>
    wt({
      request: e,
      requestId: t,
      handlers: r,
      resolutionContext: o == null ? void 0 : o.resolutionContext,
    })
  );
  if (i.error)
    throw (
      (n.emit("unhandledException", {
        error: i.error,
        request: e,
        requestId: t,
      }),
      i.error)
    );
  if (!i.data) {
    await bt(e, s.onUnhandledRequest),
      n.emit("request:unhandled", { request: e, requestId: t }),
      n.emit("request:end", { request: e, requestId: t }),
      (h = o == null ? void 0 : o.onPassthroughResponse) == null ||
        h.call(o, e);
    return;
  }
  const { response: u } = i.data;
  if (!u) {
    n.emit("request:end", { request: e, requestId: t }),
      (d = o == null ? void 0 : o.onPassthroughResponse) == null ||
        d.call(o, e);
    return;
  }
  if (u.status === 302 && u.headers.get("x-msw-intention") === "passthrough") {
    n.emit("request:end", { request: e, requestId: t }),
      (p = o == null ? void 0 : o.onPassthroughResponse) == null ||
        p.call(o, e);
    return;
  }
  _t(e, u), n.emit("request:match", { request: e, requestId: t });
  const a = i.data,
    c =
      ((g = o == null ? void 0 : o.transformResponse) == null
        ? void 0
        : g.call(o, u)) || u;
  return (
    (f = o == null ? void 0 : o.onMockedResponse) == null || f.call(o, c, a),
    n.emit("request:end", { request: e, requestId: t }),
    c
  );
}
function qt(e) {
  return {
    status: e.status,
    statusText: e.statusText,
    headers: Object.fromEntries(e.headers.entries()),
  };
}
function me(e) {
  return e != null && typeof e == "object" && !Array.isArray(e);
}
function _e(e, t) {
  return Object.entries(t).reduce((r, [s, n]) => {
    const o = r[s];
    return Array.isArray(o) && Array.isArray(n)
      ? ((r[s] = o.concat(n)), r)
      : me(o) && me(n)
      ? ((r[s] = _e(o, n)), r)
      : ((r[s] = n), r);
  }, Object.assign({}, e));
}
var At = class extends Error {
    constructor(t, r, s) {
      super(
        `Possible EventEmitter memory leak detected. ${s} ${r.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
      ),
        (this.emitter = t),
        (this.type = r),
        (this.count = s),
        (this.name = "MaxListenersExceededWarning");
    }
  },
  qe = class {
    static listenerCount(t, r) {
      return t.listenerCount(r);
    }
    constructor() {
      (this.events = new Map()),
        (this.maxListeners = qe.defaultMaxListeners),
        (this.hasWarnedAboutPotentialMemoryLeak = !1);
    }
    _emitInternalEvent(t, r, s) {
      this.emit(t, r, s);
    }
    _getListeners(t) {
      return Array.prototype.concat.apply([], this.events.get(t)) || [];
    }
    _removeListener(t, r) {
      const s = t.indexOf(r);
      return s > -1 && t.splice(s, 1), [];
    }
    _wrapOnceListener(t, r) {
      const s = (...n) => (this.removeListener(t, s), r.apply(this, n));
      return Object.defineProperty(s, "name", { value: r.name }), s;
    }
    setMaxListeners(t) {
      return (this.maxListeners = t), this;
    }
    getMaxListeners() {
      return this.maxListeners;
    }
    eventNames() {
      return Array.from(this.events.keys());
    }
    emit(t, ...r) {
      const s = this._getListeners(t);
      return (
        s.forEach((n) => {
          n.apply(this, r);
        }),
        s.length > 0
      );
    }
    addListener(t, r) {
      this._emitInternalEvent("newListener", t, r);
      const s = this._getListeners(t).concat(r);
      if (
        (this.events.set(t, s),
        this.maxListeners > 0 &&
          this.listenerCount(t) > this.maxListeners &&
          !this.hasWarnedAboutPotentialMemoryLeak)
      ) {
        this.hasWarnedAboutPotentialMemoryLeak = !0;
        const n = new At(this, t, this.listenerCount(t));
        console.warn(n);
      }
      return this;
    }
    on(t, r) {
      return this.addListener(t, r);
    }
    once(t, r) {
      return this.addListener(t, this._wrapOnceListener(t, r));
    }
    prependListener(t, r) {
      const s = this._getListeners(t);
      if (s.length > 0) {
        const n = [r].concat(s);
        this.events.set(t, n);
      } else this.events.set(t, s.concat(r));
      return this;
    }
    prependOnceListener(t, r) {
      return this.prependListener(t, this._wrapOnceListener(t, r));
    }
    removeListener(t, r) {
      const s = this._getListeners(t);
      return (
        s.length > 0 &&
          (this._removeListener(s, r),
          this.events.set(t, s),
          this._emitInternalEvent("removeListener", t, r)),
        this
      );
    }
    off(t, r) {
      return this.removeListener(t, r);
    }
    removeAllListeners(t) {
      return t ? this.events.delete(t) : this.events.clear(), this;
    }
    listeners(t) {
      return Array.from(this._getListeners(t));
    }
    listenerCount(t) {
      return this._getListeners(t).length;
    }
    rawListeners(t) {
      return this.listeners(t);
    }
  },
  se = qe;
se.defaultMaxListeners = 10;
function Mt(e, t) {
  const r = e.emit;
  if (r._isPiped) return;
  const s = function (o, ...i) {
    return t.emit(o, ...i), r.call(this, o, ...i);
  };
  (s._isPiped = !0), (e.emit = s);
}
function It(e) {
  const t = [...e];
  return Object.freeze(t), t;
}
class $t {
  constructor() {
    w(this, "subscriptions", []);
  }
  async dispose() {
    await Promise.all(this.subscriptions.map((t) => t()));
  }
}
class Ot {
  constructor(t) {
    w(this, "handlers");
    (this.initialHandlers = t), (this.handlers = [...t]);
  }
  prepend(t) {
    this.handlers.unshift(...t);
  }
  reset(t) {
    this.handlers = t.length > 0 ? [...t] : [...this.initialHandlers];
  }
  currentHandlers() {
    return this.handlers;
  }
}
class jt extends $t {
  constructor(...r) {
    super();
    w(this, "handlersController");
    w(this, "emitter");
    w(this, "publicEmitter");
    w(this, "events");
    F(
      this.validateHandlers(r),
      b.formatMessage(
        "Failed to apply given request handlers: invalid input. Did you forget to spread the request handlers Array?"
      )
    ),
      (this.handlersController = new Ot(r)),
      (this.emitter = new se()),
      (this.publicEmitter = new se()),
      Mt(this.emitter, this.publicEmitter),
      (this.events = this.createLifeCycleEvents()),
      this.subscriptions.push(() => {
        this.emitter.removeAllListeners(),
          this.publicEmitter.removeAllListeners();
      });
  }
  validateHandlers(r) {
    return r.every((s) => !Array.isArray(s));
  }
  use(...r) {
    F(
      this.validateHandlers(r),
      b.formatMessage(
        'Failed to call "use()" with the given request handlers: invalid input. Did you forget to spread the array of request handlers?'
      )
    ),
      this.handlersController.prepend(r);
  }
  restoreHandlers() {
    this.handlersController.currentHandlers().forEach((r) => {
      r.isUsed = !1;
    });
  }
  resetHandlers(...r) {
    this.handlersController.reset(r);
  }
  listHandlers() {
    return It(this.handlersController.currentHandlers());
  }
  createLifeCycleEvents() {
    return {
      on: (...r) => this.publicEmitter.on(...r),
      removeListener: (...r) => this.publicEmitter.removeListener(...r),
      removeAllListeners: (...r) => this.publicEmitter.removeAllListeners(...r),
    };
  }
}
var Ut = {},
  Dt = /(%?)(%([sdijo]))/g;
function Wt(e, t) {
  switch (t) {
    case "s":
      return e;
    case "d":
    case "i":
      return Number(e);
    case "j":
      return JSON.stringify(e);
    case "o": {
      if (typeof e == "string") return e;
      const r = JSON.stringify(e);
      return r === "{}" || r === "[]" || /^\[object .+?\]$/.test(r) ? e : r;
    }
  }
}
function B(e, ...t) {
  if (t.length === 0) return e;
  let r = 0,
    s = e.replace(Dt, (n, o, i, u) => {
      const a = t[r],
        c = Wt(a, u);
      return o ? n : (r++, c);
    });
  return (
    r < t.length && (s += ` ${t.slice(r).join(" ")}`),
    (s = s.replace(/%{2,2}/g, "%")),
    s
  );
}
var Ht = 2;
function Nt(e) {
  if (!e.stack) return;
  const t = e.stack.split(`
`);
  t.splice(1, Ht),
    (e.stack = t.join(`
`));
}
var Ft = class extends Error {
    constructor(e, ...t) {
      super(e),
        (this.message = e),
        (this.name = "Invariant Violation"),
        (this.message = B(e, ...t)),
        Nt(this);
    }
  },
  A = (e, t, ...r) => {
    if (!e) throw new Ft(t, ...r);
  };
A.as = (e, t, r, ...s) => {
  if (!t) {
    const n = s.length === 0 ? r : B(r, s);
    let o;
    try {
      o = Reflect.construct(e, [n]);
    } catch {
      o = e(n);
    }
    throw o;
  }
};
function le() {
  if (typeof navigator < "u" && navigator.product === "ReactNative") return !0;
  if (typeof process < "u") {
    const e = process.type;
    return e === "renderer" || e === "worker"
      ? !1
      : !!(process.versions && process.versions.node);
  }
  return !1;
}
var V = async (e) => {
  try {
    return {
      error: null,
      data: await e().catch((r) => {
        throw r;
      }),
    };
  } catch (t) {
    return { error: t, data: null };
  }
};
function Bt(e) {
  return new URL(e, location.href).href;
}
function te(e, t, r) {
  return (
    [e.active, e.installing, e.waiting]
      .filter((i) => i != null)
      .find((i) => r(i.scriptURL, t)) || null
  );
}
var Gt = async (e, t = {}, r) => {
  const s = Bt(e),
    n = await navigator.serviceWorker
      .getRegistrations()
      .then((u) => u.filter((a) => te(a, s, r)));
  !navigator.serviceWorker.controller && n.length > 0 && location.reload();
  const [o] = n;
  if (o) return o.update().then(() => [te(o, s, r), o]);
  const i = await V(async () => {
    const u = await navigator.serviceWorker.register(e, t);
    return [te(u, s, r), u];
  });
  if (i.error) {
    if (i.error.message.includes("(404)")) {
      const a = new URL((t == null ? void 0 : t.scope) || "/", location.href);
      throw new Error(
        b.formatMessage(`Failed to register a Service Worker for scope ('${a.href}') with script ('${s}'): Service Worker script does not exist at the given path.

Did you forget to run "npx msw init <PUBLIC_DIR>"?

Learn more about creating the Service Worker script: https://mswjs.io/docs/cli/init`)
      );
    }
    throw new Error(
      b.formatMessage(
        `Failed to register the Service Worker:

%s`,
        i.error.message
      )
    );
  }
  return i.data;
};
function Ae(e = {}) {
  if (e.quiet) return;
  const t = e.message || "Mocking enabled.";
  console.groupCollapsed(
    `%c${b.formatMessage(t)}`,
    "color:orangered;font-weight:bold;"
  ),
    console.log(
      "%cDocumentation: %chttps://mswjs.io/docs",
      "font-weight:bold",
      "font-weight:normal"
    ),
    console.log("Found an issue? https://github.com/mswjs/msw/issues"),
    e.workerUrl && console.log("Worker script URL:", e.workerUrl),
    e.workerScope && console.log("Worker scope:", e.workerScope),
    console.groupEnd();
}
async function Xt(e, t) {
  var r, s;
  if (
    (e.workerChannel.send("MOCK_ACTIVATE"),
    await e.events.once("MOCKING_ENABLED"),
    e.isMockingEnabled)
  ) {
    b.warn(
      'Found a redundant "worker.start()" call. Note that starting the worker while mocking is already enabled will have no effect. Consider removing this "worker.start()" call.'
    );
    return;
  }
  (e.isMockingEnabled = !0),
    Ae({
      quiet: t.quiet,
      workerScope: (r = e.registration) == null ? void 0 : r.scope,
      workerUrl: (s = e.worker) == null ? void 0 : s.scriptURL,
    });
}
var zt = class {
  constructor(e) {
    this.port = e;
  }
  postMessage(e, ...t) {
    const [r, s] = t;
    this.port.postMessage({ type: e, data: r }, { transfer: s });
  }
};
function Kt(e) {
  if (!["HEAD", "GET"].includes(e.method)) return e.body;
}
function Vt(e) {
  return new Request(e.url, { ...e, body: Kt(e) });
}
var Jt = (e, t) => async (r, s) => {
  const n = new zt(r.ports[0]),
    o = s.payload.id,
    i = Vt(s.payload),
    u = i.clone(),
    a = i.clone();
  z.cache.set(i, a), e.requests.set(o, a);
  try {
    await Ce(i, o, e.getRequestHandlers(), t, e.emitter, {
      onPassthroughResponse() {
        n.postMessage("NOT_FOUND");
      },
      async onMockedResponse(c, { handler: l, parsedResult: h }) {
        const d = c.clone(),
          p = c.clone(),
          g = qt(c);
        if (e.supports.readableStreamTransfer) {
          const f = c.body;
          n.postMessage("MOCK_RESPONSE", { ...g, body: f }, f ? [f] : void 0);
        } else {
          const f = c.body === null ? null : await d.arrayBuffer();
          n.postMessage("MOCK_RESPONSE", { ...g, body: f });
        }
        t.quiet ||
          e.emitter.once("response:mocked", () => {
            l.log({ request: u, response: p, parsedResult: h });
          });
      },
    });
  } catch (c) {
    c instanceof Error &&
      (b.error(
        `Uncaught exception in the request handler for "%s %s":

%s

This exception has been gracefully handled as a 500 response, however, it's strongly recommended to resolve this error, as it indicates a mistake in your code. If you wish to mock an error response, please see this guide: https://mswjs.io/docs/recipes/mocking-error-responses`,
        i.method,
        i.url,
        c.stack ?? c
      ),
      n.postMessage("MOCK_RESPONSE", {
        status: 500,
        statusText: "Request Handler Error",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: c.name,
          message: c.message,
          stack: c.stack,
        }),
      }));
  }
};
async function Qt(e, t) {
  e.workerChannel.send("INTEGRITY_CHECK_REQUEST");
  const { payload: r } = await e.events.once("INTEGRITY_CHECK_RESPONSE");
  if (r !== "223d191a56023cd36aa88c802961b911")
    throw new Error(
      `Currently active Service Worker (${r}) is behind the latest published one (223d191a56023cd36aa88c802961b911).`
    );
  return t;
}
var Yt = new TextEncoder();
function Zt(e) {
  return Yt.encode(e);
}
function er(e, t) {
  return new TextDecoder(t).decode(e);
}
function tr(e) {
  return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
}
var rr = new Set([101, 103, 204, 205, 304]);
function Me(e) {
  return rr.has(e);
}
var sr = Object.defineProperty,
  nr = (e, t) => {
    for (var r in t) sr(e, r, { get: t[r], enumerable: !0 });
  },
  ne = {};
nr(ne, {
  blue: () => ir,
  gray: () => oe,
  green: () => cr,
  red: () => ar,
  yellow: () => or,
});
function or(e) {
  return `\x1B[33m${e}\x1B[0m`;
}
function ir(e) {
  return `\x1B[34m${e}\x1B[0m`;
}
function oe(e) {
  return `\x1B[90m${e}\x1B[0m`;
}
function ar(e) {
  return `\x1B[31m${e}\x1B[0m`;
}
function cr(e) {
  return `\x1B[32m${e}\x1B[0m`;
}
var J = le(),
  Ie = class {
    constructor(e) {
      w(this, "prefix");
      (this.name = e), (this.prefix = `[${this.name}]`);
      const t = ve("DEBUG"),
        r = ve("LOG_LEVEL");
      t === "1" || t === "true" || (typeof t < "u" && this.name.startsWith(t))
        ? ((this.debug = H(r, "debug") ? L : this.debug),
          (this.info = H(r, "info") ? L : this.info),
          (this.success = H(r, "success") ? L : this.success),
          (this.warning = H(r, "warning") ? L : this.warning),
          (this.error = H(r, "error") ? L : this.error))
        : ((this.info = L),
          (this.success = L),
          (this.warning = L),
          (this.error = L),
          (this.only = L));
    }
    extend(e) {
      return new Ie(`${this.name}:${e}`);
    }
    debug(e, ...t) {
      this.logEntry({
        level: "debug",
        message: oe(e),
        positionals: t,
        prefix: this.prefix,
        colors: { prefix: "gray" },
      });
    }
    info(e, ...t) {
      this.logEntry({
        level: "info",
        message: e,
        positionals: t,
        prefix: this.prefix,
        colors: { prefix: "blue" },
      });
      const r = new ur();
      return (s, ...n) => {
        r.measure(),
          this.logEntry({
            level: "info",
            message: `${s} ${oe(`${r.deltaTime}ms`)}`,
            positionals: n,
            prefix: this.prefix,
            colors: { prefix: "blue" },
          });
      };
    }
    success(e, ...t) {
      this.logEntry({
        level: "info",
        message: e,
        positionals: t,
        prefix: `✔ ${this.prefix}`,
        colors: { timestamp: "green", prefix: "green" },
      });
    }
    warning(e, ...t) {
      this.logEntry({
        level: "warning",
        message: e,
        positionals: t,
        prefix: `⚠ ${this.prefix}`,
        colors: { timestamp: "yellow", prefix: "yellow" },
      });
    }
    error(e, ...t) {
      this.logEntry({
        level: "error",
        message: e,
        positionals: t,
        prefix: `✖ ${this.prefix}`,
        colors: { timestamp: "red", prefix: "red" },
      });
    }
    only(e) {
      e();
    }
    createEntry(e, t) {
      return { timestamp: new Date(), level: e, message: t };
    }
    logEntry(e) {
      const {
          level: t,
          message: r,
          prefix: s,
          colors: n,
          positionals: o = [],
        } = e,
        i = this.createEntry(t, r),
        u = (n == null ? void 0 : n.timestamp) || "gray",
        a = (n == null ? void 0 : n.prefix) || "gray",
        c = { timestamp: ne[u], prefix: ne[a] };
      this.getWriter(t)(
        [c.timestamp(this.formatTimestamp(i.timestamp))]
          .concat(s != null ? c.prefix(s) : [])
          .concat(ye(r))
          .join(" "),
        ...o.map(ye)
      );
    }
    formatTimestamp(e) {
      return `${e.toLocaleTimeString("en-GB")}:${e.getMilliseconds()}`;
    }
    getWriter(e) {
      switch (e) {
        case "debug":
        case "success":
        case "info":
          return lr;
        case "warning":
          return dr;
        case "error":
          return hr;
      }
    }
  },
  ur = class {
    constructor() {
      w(this, "startTime");
      w(this, "endTime");
      w(this, "deltaTime");
      this.startTime = performance.now();
    }
    measure() {
      this.endTime = performance.now();
      const e = this.endTime - this.startTime;
      this.deltaTime = e.toFixed(2);
    }
  },
  L = () => {};
function lr(e, ...t) {
  if (J) {
    process.stdout.write(
      B(e, ...t) +
        `
`
    );
    return;
  }
  console.log(e, ...t);
}
function dr(e, ...t) {
  if (J) {
    process.stderr.write(
      B(e, ...t) +
        `
`
    );
    return;
  }
  console.warn(e, ...t);
}
function hr(e, ...t) {
  if (J) {
    process.stderr.write(
      B(e, ...t) +
        `
`
    );
    return;
  }
  console.error(e, ...t);
}
function ve(e) {
  var t;
  return J ? Ut[e] : (t = globalThis[e]) == null ? void 0 : t.toString();
}
function H(e, t) {
  return e !== void 0 && e !== t;
}
function ye(e) {
  return typeof e > "u"
    ? "undefined"
    : e === null
    ? "null"
    : typeof e == "string"
    ? e
    : typeof e == "object"
    ? JSON.stringify(e)
    : e.toString();
}
var fr = class extends Error {
    constructor(e, t, r) {
      super(
        `Possible EventEmitter memory leak detected. ${r} ${t.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
      ),
        (this.emitter = e),
        (this.type = t),
        (this.count = r),
        (this.name = "MaxListenersExceededWarning");
    }
  },
  $e = class {
    static listenerCount(e, t) {
      return e.listenerCount(t);
    }
    constructor() {
      (this.events = new Map()),
        (this.maxListeners = $e.defaultMaxListeners),
        (this.hasWarnedAboutPotentialMemoryLeak = !1);
    }
    _emitInternalEvent(e, t, r) {
      this.emit(e, t, r);
    }
    _getListeners(e) {
      return Array.prototype.concat.apply([], this.events.get(e)) || [];
    }
    _removeListener(e, t) {
      const r = e.indexOf(t);
      return r > -1 && e.splice(r, 1), [];
    }
    _wrapOnceListener(e, t) {
      const r = (...s) => (this.removeListener(e, r), t.apply(this, s));
      return Object.defineProperty(r, "name", { value: t.name }), r;
    }
    setMaxListeners(e) {
      return (this.maxListeners = e), this;
    }
    getMaxListeners() {
      return this.maxListeners;
    }
    eventNames() {
      return Array.from(this.events.keys());
    }
    emit(e, ...t) {
      const r = this._getListeners(e);
      return (
        r.forEach((s) => {
          s.apply(this, t);
        }),
        r.length > 0
      );
    }
    addListener(e, t) {
      this._emitInternalEvent("newListener", e, t);
      const r = this._getListeners(e).concat(t);
      if (
        (this.events.set(e, r),
        this.maxListeners > 0 &&
          this.listenerCount(e) > this.maxListeners &&
          !this.hasWarnedAboutPotentialMemoryLeak)
      ) {
        this.hasWarnedAboutPotentialMemoryLeak = !0;
        const s = new fr(this, e, this.listenerCount(e));
        console.warn(s);
      }
      return this;
    }
    on(e, t) {
      return this.addListener(e, t);
    }
    once(e, t) {
      return this.addListener(e, this._wrapOnceListener(e, t));
    }
    prependListener(e, t) {
      const r = this._getListeners(e);
      if (r.length > 0) {
        const s = [t].concat(r);
        this.events.set(e, s);
      } else this.events.set(e, r.concat(t));
      return this;
    }
    prependOnceListener(e, t) {
      return this.prependListener(e, this._wrapOnceListener(e, t));
    }
    removeListener(e, t) {
      const r = this._getListeners(e);
      return (
        r.length > 0 &&
          (this._removeListener(r, t),
          this.events.set(e, r),
          this._emitInternalEvent("removeListener", e, t)),
        this
      );
    }
    off(e, t) {
      return this.removeListener(e, t);
    }
    removeAllListeners(e) {
      return e ? this.events.delete(e) : this.events.clear(), this;
    }
    listeners(e) {
      return Array.from(this._getListeners(e));
    }
    listenerCount(e) {
      return this._getListeners(e).length;
    }
    rawListeners(e) {
      return this.listeners(e);
    }
  },
  Oe = $e;
Oe.defaultMaxListeners = 10;
var U = Symbol("isPatchedModule");
function we(e) {
  return globalThis[e] || void 0;
}
function pr(e, t) {
  globalThis[e] = t;
}
function gr(e) {
  delete globalThis[e];
}
var de = class {
    constructor(e) {
      (this.symbol = e),
        (this.readyState = "INACTIVE"),
        (this.emitter = new Oe()),
        (this.subscriptions = []),
        (this.logger = new Ie(e.description)),
        this.emitter.setMaxListeners(0),
        this.logger.info("constructing the interceptor...");
    }
    checkEnvironment() {
      return !0;
    }
    apply() {
      const e = this.logger.extend("apply");
      if (
        (e.info("applying the interceptor..."), this.readyState === "APPLIED")
      ) {
        e.info("intercepted already applied!");
        return;
      }
      if (!this.checkEnvironment()) {
        e.info("the interceptor cannot be applied in this environment!");
        return;
      }
      this.readyState = "APPLYING";
      const r = this.getInstance();
      if (r) {
        e.info("found a running instance, reusing..."),
          (this.on = (s, n) => (
            e.info('proxying the "%s" listener', s),
            r.emitter.addListener(s, n),
            this.subscriptions.push(() => {
              r.emitter.removeListener(s, n),
                e.info('removed proxied "%s" listener!', s);
            }),
            this
          )),
          (this.readyState = "APPLIED");
        return;
      }
      e.info("no running instance found, setting up a new instance..."),
        this.setup(),
        this.setInstance(),
        (this.readyState = "APPLIED");
    }
    setup() {}
    on(e, t) {
      const r = this.logger.extend("on");
      return this.readyState === "DISPOSING" || this.readyState === "DISPOSED"
        ? (r.info("cannot listen to events, already disposed!"), this)
        : (r.info('adding "%s" event listener:', e, t),
          this.emitter.on(e, t),
          this);
    }
    once(e, t) {
      return this.emitter.once(e, t), this;
    }
    off(e, t) {
      return this.emitter.off(e, t), this;
    }
    removeAllListeners(e) {
      return this.emitter.removeAllListeners(e), this;
    }
    dispose() {
      const e = this.logger.extend("dispose");
      if (this.readyState === "DISPOSED") {
        e.info("cannot dispose, already disposed!");
        return;
      }
      if (
        (e.info("disposing the interceptor..."),
        (this.readyState = "DISPOSING"),
        !this.getInstance())
      ) {
        e.info("no interceptors running, skipping dispose...");
        return;
      }
      if (
        (this.clearInstance(),
        e.info("global symbol deleted:", we(this.symbol)),
        this.subscriptions.length > 0)
      ) {
        e.info("disposing of %d subscriptions...", this.subscriptions.length);
        for (const t of this.subscriptions) t();
        (this.subscriptions = []),
          e.info("disposed of all subscriptions!", this.subscriptions.length);
      }
      this.emitter.removeAllListeners(),
        e.info("destroyed the listener!"),
        (this.readyState = "DISPOSED");
    }
    getInstance() {
      var e;
      const t = we(this.symbol);
      return (
        this.logger.info(
          "retrieved global instance:",
          (e = t == null ? void 0 : t.constructor) == null ? void 0 : e.name
        ),
        t
      );
    }
    setInstance() {
      pr(this.symbol, this),
        this.logger.info("set global instance!", this.symbol.description);
    }
    clearInstance() {
      gr(this.symbol),
        this.logger.info("cleared global instance!", this.symbol.description);
    }
  },
  ie = class extends de {
    constructor(e) {
      (ie.symbol = Symbol(e.name)),
        super(ie.symbol),
        (this.interceptors = e.interceptors);
    }
    setup() {
      const e = this.logger.extend("setup");
      e.info("applying all %d interceptors...", this.interceptors.length);
      for (const t of this.interceptors)
        e.info('applying "%s" interceptor...', t.constructor.name),
          t.apply(),
          e.info("adding interceptor dispose subscription"),
          this.subscriptions.push(() => t.dispose());
    }
    on(e, t) {
      for (const r of this.interceptors) r.on(e, t);
      return this;
    }
    once(e, t) {
      for (const r of this.interceptors) r.once(e, t);
      return this;
    }
    off(e, t) {
      for (const r of this.interceptors) r.off(e, t);
      return this;
    }
    removeAllListeners(e) {
      for (const t of this.interceptors) t.removeAllListeners(e);
      return this;
    }
  };
function mr(e) {
  return (t, r) => {
    var u;
    const { payload: s } = r,
      { requestId: n } = s,
      o = e.requests.get(n);
    if ((e.requests.delete(n), (u = s.type) != null && u.includes("opaque")))
      return;
    const i =
      s.status === 0
        ? Response.error()
        : new Response(Me(s.status) ? null : s.body, s);
    i.url ||
      Object.defineProperty(i, "url", {
        value: o.url,
        enumerable: !0,
        writable: !1,
      }),
      e.emitter.emit(
        s.isMockedResponse ? "response:mocked" : "response:bypass",
        { response: i, request: o, requestId: s.requestId }
      );
  };
}
function vr(e, t) {
  !(t != null && t.quiet) &&
    !location.href.startsWith(e.scope) &&
    b.warn(`Cannot intercept requests on this page because it's outside of the worker's scope ("${e.scope}"). If you wish to mock API requests on this page, you must resolve this scope issue.

- (Recommended) Register the worker at the root level ("/") of your application.
- Set the "Service-Worker-Allowed" response header to allow out-of-scope workers.`);
}
var yr = (e) =>
  function (r, s) {
    return (async () => {
      e.events.removeAllListeners(),
        e.workerChannel.on("REQUEST", Jt(e, r)),
        e.workerChannel.on("RESPONSE", mr(e));
      const i = await Gt(
          r.serviceWorker.url,
          r.serviceWorker.options,
          r.findWorker
        ),
        [u, a] = i;
      if (!u) {
        const l =
          s != null && s.findWorker
            ? b.formatMessage(
                `Failed to locate the Service Worker registration using a custom "findWorker" predicate.

Please ensure that the custom predicate properly locates the Service Worker registration at "%s".
More details: https://mswjs.io/docs/api/setup-worker/start#findworker
`,
                r.serviceWorker.url
              )
            : b.formatMessage(
                `Failed to locate the Service Worker registration.

This most likely means that the worker script URL "%s" cannot resolve against the actual public hostname (%s). This may happen if your application runs behind a proxy, or has a dynamic hostname.

Please consider using a custom "serviceWorker.url" option to point to the actual worker script location, or a custom "findWorker" option to resolve the Service Worker registration manually. More details: https://mswjs.io/docs/api/setup-worker/start`,
                r.serviceWorker.url,
                location.host
              );
        throw new Error(l);
      }
      (e.worker = u),
        (e.registration = a),
        e.events.addListener(window, "beforeunload", () => {
          u.state !== "redundant" && e.workerChannel.send("CLIENT_CLOSED"),
            window.clearInterval(e.keepAliveInterval);
        });
      const c = await V(() => Qt(e, u));
      return (
        c.error &&
          b.error(`Detected outdated Service Worker: ${c.error.message}

The mocking is still enabled, but it's highly recommended that you update your Service Worker by running:

$ npx msw init <PUBLIC_DIR>

This is necessary to ensure that the Service Worker is in sync with the library to guarantee its stability.
If this message still persists after updating, please report an issue: https://github.com/open-draft/msw/issues      `),
        (e.keepAliveInterval = window.setInterval(
          () => e.workerChannel.send("KEEPALIVE_REQUEST"),
          5e3
        )),
        vr(a, e.startOptions),
        a
      );
    })().then(async (i) => {
      const u = i.installing || i.waiting;
      return (
        u &&
          (await new Promise((a) => {
            u.addEventListener("statechange", () => {
              if (u.state === "activated") return a();
            });
          })),
        await Xt(e, r).catch((a) => {
          throw new Error(
            `Failed to enable mocking: ${a == null ? void 0 : a.message}`
          );
        }),
        i
      );
    });
  };
function je(e = {}) {
  e.quiet ||
    console.log(
      `%c${b.formatMessage("Mocking disabled.")}`,
      "color:orangered;font-weight:bold;"
    );
}
var wr = (e) =>
    function () {
      var r;
      if (!e.isMockingEnabled) {
        b.warn(
          'Found a redundant "worker.stop()" call. Note that stopping the worker while mocking already stopped has no effect. Consider removing this "worker.stop()" call.'
        );
        return;
      }
      e.workerChannel.send("MOCK_DEACTIVATE"),
        (e.isMockingEnabled = !1),
        window.clearInterval(e.keepAliveInterval),
        je({ quiet: (r = e.startOptions) == null ? void 0 : r.quiet });
    },
  br = {
    serviceWorker: { url: "./mockServiceWorker.js", options: null },
    quiet: !1,
    waitUntilReady: !0,
    onUnhandledRequest: "warn",
    findWorker(e, t) {
      return e === t;
    },
  };
function Er() {
  const e = (t, r) => {
    (e.state = "pending"),
      (e.resolve = (s) => {
        if (e.state !== "pending") return;
        e.result = s;
        const n = (o) => ((e.state = "fulfilled"), o);
        return t(s instanceof Promise ? s : Promise.resolve(s).then(n));
      }),
      (e.reject = (s) => {
        if (e.state === "pending")
          return (
            queueMicrotask(() => {
              e.state = "rejected";
            }),
            r((e.rejectionReason = s))
          );
      });
  };
  return e;
}
var T,
  D,
  X,
  Re,
  Ue =
    ((Re = class extends Promise {
      constructor(t = null) {
        const r = Er();
        super((s, n) => {
          r(s, n), t == null || t(r.resolve, r.reject);
        });
        ee(this, D);
        ee(this, T, void 0);
        w(this, "resolve");
        w(this, "reject");
        he(this, T, r),
          (this.resolve = W(this, T).resolve),
          (this.reject = W(this, T).reject);
      }
      get state() {
        return W(this, T).state;
      }
      get rejectionReason() {
        return W(this, T).rejectionReason;
      }
      then(t, r) {
        return G(this, D, X).call(this, super.then(t, r));
      }
      catch(t) {
        return G(this, D, X).call(this, super.catch(t));
      }
      finally(t) {
        return G(this, D, X).call(this, super.finally(t));
      }
    }),
    (T = new WeakMap()),
    (D = new WeakSet()),
    (X = function (t) {
      return Object.defineProperties(t, {
        resolve: { configurable: !0, value: this.resolve },
        reject: { configurable: !0, value: this.reject },
      });
    }),
    Re);
function De() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
    const t = (Math.random() * 16) | 0;
    return (e == "x" ? t : (t & 3) | 8).toString(16);
  });
}
var xr = class {
  constructor(e) {
    (this.request = e), (this.responsePromise = new Ue());
  }
  respondWith(e) {
    A(
      this.responsePromise.state === "pending",
      'Failed to respond to "%s %s" request: the "request" event has already been responded to.',
      this.request.method,
      this.request.url
    ),
      this.responsePromise.resolve(e);
  }
};
function We(e) {
  const t = new xr(e);
  return (
    Reflect.set(e, "respondWith", t.respondWith.bind(t)),
    { interactiveRequest: e, requestController: t }
  );
}
async function He(e, t, ...r) {
  const s = e.listeners(t);
  if (s.length !== 0) for (const n of s) await n.apply(e, r);
}
function kr(e, t) {
  try {
    return e[t], !0;
  } catch {
    return !1;
  }
}
function Lr(e) {
  try {
    return new URL(e), !0;
  } catch {
    return !1;
  }
}
var Ne = class extends de {
    constructor() {
      super(Ne.symbol);
    }
    checkEnvironment() {
      return typeof globalThis < "u" && typeof globalThis.fetch < "u";
    }
    setup() {
      const e = globalThis.fetch;
      A(!e[U], 'Failed to patch the "fetch" module: already patched.'),
        (globalThis.fetch = async (t, r) => {
          var s;
          const n = De(),
            o =
              typeof t == "string" && typeof location < "u" && !Lr(t)
                ? new URL(t, location.origin)
                : t,
            i = new Request(o, r);
          this.logger.info("[%s] %s", i.method, i.url);
          const { interactiveRequest: u, requestController: a } = We(i);
          this.logger.info(
            'emitting the "request" event for %d listener(s)...',
            this.emitter.listenerCount("request")
          ),
            this.emitter.once("request", ({ requestId: p }) => {
              p === n &&
                a.responsePromise.state === "pending" &&
                a.responsePromise.resolve(void 0);
            }),
            this.logger.info("awaiting for the mocked response...");
          const c = u.signal,
            l = new Ue();
          c &&
            c.addEventListener(
              "abort",
              () => {
                l.reject(c.reason);
              },
              { once: !0 }
            );
          const h = await V(async () => {
            const p = He(this.emitter, "request", { request: u, requestId: n });
            await Promise.race([l, p, a.responsePromise]),
              this.logger.info("all request listeners have been resolved!");
            const g = await a.responsePromise;
            return this.logger.info("event.respondWith called with:", g), g;
          });
          if (l.state === "rejected") return Promise.reject(l.rejectionReason);
          if (h.error) return Promise.reject(be(h.error));
          const d = h.data;
          if (d && !((s = i.signal) != null && s.aborted)) {
            if (
              (this.logger.info("received mocked response:", d),
              kr(d, "type") && d.type === "error")
            )
              return (
                this.logger.info(
                  "received a network error response, rejecting the request promise..."
                ),
                Promise.reject(be(d))
              );
            const p = d.clone();
            return (
              this.emitter.emit("response", {
                response: p,
                isMockedResponse: !0,
                request: u,
                requestId: n,
              }),
              Object.defineProperty(d, "url", {
                writable: !1,
                enumerable: !0,
                configurable: !1,
                value: i.url,
              }),
              d
            );
          }
          return (
            this.logger.info("no mocked response received!"),
            e(i).then((p) => {
              const g = p.clone();
              return (
                this.logger.info("original fetch performed", g),
                this.emitter.emit("response", {
                  response: g,
                  isMockedResponse: !1,
                  request: u,
                  requestId: n,
                }),
                p
              );
            })
          );
        }),
        Object.defineProperty(globalThis.fetch, U, {
          enumerable: !0,
          configurable: !0,
          value: !0,
        }),
        this.subscriptions.push(() => {
          Object.defineProperty(globalThis.fetch, U, { value: void 0 }),
            (globalThis.fetch = e),
            this.logger.info(
              'restored native "globalThis.fetch"!',
              globalThis.fetch.name
            );
        });
    }
  },
  Fe = Ne;
Fe.symbol = Symbol("fetch");
function be(e) {
  return Object.assign(new TypeError("Failed to fetch"), { cause: e });
}
function Rr(e, t) {
  const r = new Uint8Array(e.byteLength + t.byteLength);
  return r.set(e, 0), r.set(t, e.byteLength), r;
}
var Be = class {
    constructor(e, t) {
      (this.AT_TARGET = 0),
        (this.BUBBLING_PHASE = 0),
        (this.CAPTURING_PHASE = 0),
        (this.NONE = 0),
        (this.type = ""),
        (this.srcElement = null),
        (this.currentTarget = null),
        (this.eventPhase = 0),
        (this.isTrusted = !0),
        (this.composed = !1),
        (this.cancelable = !0),
        (this.defaultPrevented = !1),
        (this.bubbles = !0),
        (this.lengthComputable = !0),
        (this.loaded = 0),
        (this.total = 0),
        (this.cancelBubble = !1),
        (this.returnValue = !0),
        (this.type = e),
        (this.target = (t == null ? void 0 : t.target) || null),
        (this.currentTarget = (t == null ? void 0 : t.currentTarget) || null),
        (this.timeStamp = Date.now());
    }
    composedPath() {
      return [];
    }
    initEvent(e, t, r) {
      (this.type = e), (this.bubbles = !!t), (this.cancelable = !!r);
    }
    preventDefault() {
      this.defaultPrevented = !0;
    }
    stopPropagation() {}
    stopImmediatePropagation() {}
  },
  Sr = class extends Be {
    constructor(e, t) {
      super(e),
        (this.lengthComputable =
          (t == null ? void 0 : t.lengthComputable) || !1),
        (this.composed = (t == null ? void 0 : t.composed) || !1),
        (this.loaded = (t == null ? void 0 : t.loaded) || 0),
        (this.total = (t == null ? void 0 : t.total) || 0);
    }
  },
  Pr = typeof ProgressEvent < "u";
function Tr(e, t, r) {
  const s = [
      "error",
      "progress",
      "loadstart",
      "loadend",
      "load",
      "timeout",
      "abort",
    ],
    n = Pr ? ProgressEvent : Sr;
  return s.includes(t)
    ? new n(t, {
        lengthComputable: !0,
        loaded: (r == null ? void 0 : r.loaded) || 0,
        total: (r == null ? void 0 : r.total) || 0,
      })
    : new Be(t, { target: e, currentTarget: e });
}
function Ge(e, t) {
  if (!(t in e)) return null;
  if (Object.prototype.hasOwnProperty.call(e, t)) return e;
  const s = Reflect.getPrototypeOf(e);
  return s ? Ge(s, t) : null;
}
function Ee(e, t) {
  return new Proxy(e, Cr(t));
}
function Cr(e) {
  const {
      constructorCall: t,
      methodCall: r,
      getProperty: s,
      setProperty: n,
    } = e,
    o = {};
  return (
    typeof t < "u" &&
      (o.construct = function (i, u, a) {
        const c = Reflect.construct.bind(null, i, u, a);
        return t.call(a, u, c);
      }),
    (o.set = function (i, u, a) {
      const c = () => {
        const l = Ge(i, u) || i,
          h = Reflect.getOwnPropertyDescriptor(l, u);
        return typeof (h == null ? void 0 : h.set) < "u"
          ? (h.set.apply(i, [a]), !0)
          : Reflect.defineProperty(l, u, {
              writable: !0,
              enumerable: !0,
              configurable: !0,
              value: a,
            });
      };
      return typeof n < "u" ? n.call(i, [u, a], c) : c();
    }),
    (o.get = function (i, u, a) {
      const c = () => i[u],
        l = typeof s < "u" ? s.call(i, [u, a], c) : c();
      return typeof l == "function"
        ? (...h) => {
            const d = l.bind(i, ...h);
            return typeof r < "u" ? r.call(i, [u, h], d) : d();
          }
        : l;
    }),
    o
  );
}
function _r(e) {
  return [
    "application/xhtml+xml",
    "application/xml",
    "image/svg+xml",
    "text/html",
    "text/xml",
  ].some((r) => e.startsWith(r));
}
function qr(e) {
  try {
    return JSON.parse(e);
  } catch {
    return null;
  }
}
function Ar(e, t) {
  const r = Me(e.status) ? null : t;
  return new Response(r, {
    status: e.status,
    statusText: e.statusText,
    headers: Mr(e.getAllResponseHeaders()),
  });
}
function Mr(e) {
  const t = new Headers(),
    r = e.split(/[\r\n]+/);
  for (const s of r) {
    if (s.trim() === "") continue;
    const [n, ...o] = s.split(": "),
      i = o.join(": ");
    t.append(n, i);
  }
  return t;
}
var xe = Symbol("isMockedResponse"),
  Ir = le(),
  $r = class {
    constructor(e, t) {
      (this.initialRequest = e),
        (this.logger = t),
        (this.method = "GET"),
        (this.url = null),
        (this.events = new Map()),
        (this.requestId = De()),
        (this.requestHeaders = new Headers()),
        (this.responseBuffer = new Uint8Array()),
        (this.request = Ee(e, {
          setProperty: ([r, s], n) => {
            switch (r) {
              case "ontimeout": {
                const o = r.slice(2);
                return this.request.addEventListener(o, s), n();
              }
              default:
                return n();
            }
          },
          methodCall: ([r, s], n) => {
            var o;
            switch (r) {
              case "open": {
                const [i, u] = s;
                return (
                  typeof u > "u"
                    ? ((this.method = "GET"), (this.url = ke(i)))
                    : ((this.method = i), (this.url = ke(u))),
                  (this.logger = this.logger.extend(
                    `${this.method} ${this.url.href}`
                  )),
                  this.logger.info("open", this.method, this.url.href),
                  n()
                );
              }
              case "addEventListener": {
                const [i, u] = s;
                return (
                  this.registerEvent(i, u),
                  this.logger.info("addEventListener", i, u),
                  n()
                );
              }
              case "setRequestHeader": {
                const [i, u] = s;
                return (
                  this.requestHeaders.set(i, u),
                  this.logger.info("setRequestHeader", i, u),
                  n()
                );
              }
              case "send": {
                const [i] = s;
                i != null &&
                  (this.requestBody = typeof i == "string" ? Zt(i) : i),
                  this.request.addEventListener("load", () => {
                    if (typeof this.onResponse < "u") {
                      const c = Ar(this.request, this.request.response);
                      this.onResponse.call(this, {
                        response: c,
                        isMockedResponse: xe in this.request,
                        request: u,
                        requestId: this.requestId,
                      });
                    }
                  });
                const u = this.toFetchApiRequest();
                (
                  ((o = this.onRequest) == null
                    ? void 0
                    : o.call(this, {
                        request: u,
                        requestId: this.requestId,
                      })) || Promise.resolve()
                ).finally(() => {
                  if (this.request.readyState < this.request.LOADING)
                    return (
                      this.logger.info(
                        "request callback settled but request has not been handled (readystate %d), performing as-is...",
                        this.request.readyState
                      ),
                      Ir &&
                        this.request.setRequestHeader(
                          "X-Request-Id",
                          this.requestId
                        ),
                      n()
                    );
                });
                break;
              }
              default:
                return n();
            }
          },
        }));
    }
    registerEvent(e, t) {
      const s = (this.events.get(e) || []).concat(t);
      this.events.set(e, s), this.logger.info('registered event "%s"', e, t);
    }
    respondWith(e) {
      this.logger.info(
        "responding with a mocked response: %d %s",
        e.status,
        e.statusText
      ),
        M(this.request, xe, !0),
        M(this.request, "status", e.status),
        M(this.request, "statusText", e.statusText),
        M(this.request, "responseURL", this.url.href),
        (this.request.getResponseHeader = new Proxy(
          this.request.getResponseHeader,
          {
            apply: (s, n, o) => {
              if (
                (this.logger.info("getResponseHeader", o[0]),
                this.request.readyState < this.request.HEADERS_RECEIVED)
              )
                return (
                  this.logger.info("headers not received yet, returning null"),
                  null
                );
              const i = e.headers.get(o[0]);
              return (
                this.logger.info('resolved response header "%s" to', o[0], i), i
              );
            },
          }
        )),
        (this.request.getAllResponseHeaders = new Proxy(
          this.request.getAllResponseHeaders,
          {
            apply: () => {
              if (
                (this.logger.info("getAllResponseHeaders"),
                this.request.readyState < this.request.HEADERS_RECEIVED)
              )
                return (
                  this.logger.info(
                    "headers not received yet, returning empty string"
                  ),
                  ""
                );
              const n = Array.from(e.headers.entries()).map(
                ([o, i]) => `${o}: ${i}`
              ).join(`\r
`);
              return this.logger.info("resolved all response headers to", n), n;
            },
          }
        )),
        Object.defineProperties(this.request, {
          response: {
            enumerable: !0,
            configurable: !1,
            get: () => this.response,
          },
          responseText: {
            enumerable: !0,
            configurable: !1,
            get: () => this.responseText,
          },
          responseXML: {
            enumerable: !0,
            configurable: !1,
            get: () => this.responseXML,
          },
        });
      const t = e.headers.has("Content-Length")
        ? Number(e.headers.get("Content-Length"))
        : void 0;
      this.logger.info("calculated response body length", t),
        this.trigger("loadstart", { loaded: 0, total: t }),
        this.setReadyState(this.request.HEADERS_RECEIVED),
        this.setReadyState(this.request.LOADING);
      const r = () => {
        this.logger.info("finalizing the mocked response..."),
          this.setReadyState(this.request.DONE),
          this.trigger("load", {
            loaded: this.responseBuffer.byteLength,
            total: t,
          }),
          this.trigger("loadend", {
            loaded: this.responseBuffer.byteLength,
            total: t,
          });
      };
      if (e.body) {
        this.logger.info("mocked response has body, streaming...");
        const s = e.body.getReader(),
          n = async () => {
            const { value: o, done: i } = await s.read();
            if (i) {
              this.logger.info("response body stream done!"), r();
              return;
            }
            o &&
              (this.logger.info("read response body chunk:", o),
              (this.responseBuffer = Rr(this.responseBuffer, o)),
              this.trigger("progress", {
                loaded: this.responseBuffer.byteLength,
                total: t,
              })),
              n();
          };
        n();
      } else r();
    }
    responseBufferToText() {
      return er(this.responseBuffer);
    }
    get response() {
      if (
        (this.logger.info(
          "getResponse (responseType: %s)",
          this.request.responseType
        ),
        this.request.readyState !== this.request.DONE)
      )
        return null;
      switch (this.request.responseType) {
        case "json": {
          const e = qr(this.responseBufferToText());
          return this.logger.info("resolved response JSON", e), e;
        }
        case "arraybuffer": {
          const e = tr(this.responseBuffer);
          return this.logger.info("resolved response ArrayBuffer", e), e;
        }
        case "blob": {
          const e =
              this.request.getResponseHeader("Content-Type") || "text/plain",
            t = new Blob([this.responseBufferToText()], { type: e });
          return (
            this.logger.info("resolved response Blob (mime type: %s)", t, e), t
          );
        }
        default: {
          const e = this.responseBufferToText();
          return (
            this.logger.info(
              'resolving "%s" response type as text',
              this.request.responseType,
              e
            ),
            e
          );
        }
      }
    }
    get responseText() {
      if (
        (A(
          this.request.responseType === "" ||
            this.request.responseType === "text",
          "InvalidStateError: The object is in invalid state."
        ),
        this.request.readyState !== this.request.LOADING &&
          this.request.readyState !== this.request.DONE)
      )
        return "";
      const e = this.responseBufferToText();
      return this.logger.info('getResponseText: "%s"', e), e;
    }
    get responseXML() {
      if (
        (A(
          this.request.responseType === "" ||
            this.request.responseType === "document",
          "InvalidStateError: The object is in invalid state."
        ),
        this.request.readyState !== this.request.DONE)
      )
        return null;
      const e = this.request.getResponseHeader("Content-Type") || "";
      return typeof DOMParser > "u"
        ? (console.warn(
            "Cannot retrieve XMLHttpRequest response body as XML: DOMParser is not defined. You are likely using an environment that is not browser or does not polyfill browser globals correctly."
          ),
          null)
        : _r(e)
        ? new DOMParser().parseFromString(this.responseBufferToText(), e)
        : null;
    }
    errorWith(e) {
      this.logger.info("responding with an error"),
        this.setReadyState(this.request.DONE),
        this.trigger("error"),
        this.trigger("loadend");
    }
    setReadyState(e) {
      if (
        (this.logger.info(
          "setReadyState: %d -> %d",
          this.request.readyState,
          e
        ),
        this.request.readyState === e)
      ) {
        this.logger.info("ready state identical, skipping transition...");
        return;
      }
      M(this.request, "readyState", e),
        this.logger.info("set readyState to: %d", e),
        e !== this.request.UNSENT &&
          (this.logger.info('triggerring "readystatechange" event...'),
          this.trigger("readystatechange"));
    }
    trigger(e, t) {
      const r = this.request[`on${e}`],
        s = Tr(this.request, e, t);
      this.logger.info('trigger "%s"', e, t || ""),
        typeof r == "function" &&
          (this.logger.info('found a direct "%s" callback, calling...', e),
          r.call(this.request, s));
      for (const [n, o] of this.events)
        n === e &&
          (this.logger.info(
            'found %d listener(s) for "%s" event, calling...',
            o.length,
            e
          ),
          o.forEach((i) => i.call(this.request, s)));
    }
    toFetchApiRequest() {
      this.logger.info("converting request to a Fetch API Request...");
      const e = new Request(this.url.href, {
          method: this.method,
          headers: this.requestHeaders,
          credentials: this.request.withCredentials ? "include" : "same-origin",
          body: ["GET", "HEAD"].includes(this.method) ? null : this.requestBody,
        }),
        t = Ee(e.headers, {
          methodCall: ([r, s], n) => {
            switch (r) {
              case "append":
              case "set": {
                const [o, i] = s;
                this.request.setRequestHeader(o, i);
                break;
              }
              case "delete": {
                const [o] = s;
                console.warn(
                  `XMLHttpRequest: Cannot remove a "${o}" header from the Fetch API representation of the "${e.method} ${e.url}" request. XMLHttpRequest headers cannot be removed.`
                );
                break;
              }
            }
            return n();
          },
        });
      return (
        M(e, "headers", t),
        this.logger.info("converted request to a Fetch API Request!", e),
        e
      );
    }
  };
function ke(e) {
  return typeof location > "u"
    ? new URL(e)
    : new URL(e.toString(), location.href);
}
function M(e, t, r) {
  Reflect.defineProperty(e, t, { writable: !0, enumerable: !0, value: r });
}
function Or({ emitter: e, logger: t }) {
  return new Proxy(globalThis.XMLHttpRequest, {
    construct(s, n, o) {
      t.info("constructed new XMLHttpRequest");
      const i = Reflect.construct(s, n, o),
        u = Object.getOwnPropertyDescriptors(s.prototype);
      for (const c in u) Reflect.defineProperty(i, c, u[c]);
      const a = new $r(i, t);
      return (
        (a.onRequest = async function ({ request: c, requestId: l }) {
          const { interactiveRequest: h, requestController: d } = We(c);
          this.logger.info("awaiting mocked response..."),
            e.once("request", ({ requestId: f }) => {
              f === l &&
                d.responsePromise.state === "pending" &&
                d.respondWith(void 0);
            });
          const p = await V(async () => {
            this.logger.info(
              'emitting the "request" event for %s listener(s)...',
              e.listenerCount("request")
            ),
              await He(e, "request", { request: h, requestId: l }),
              this.logger.info('all "request" listeners settled!');
            const f = await d.responsePromise;
            return this.logger.info("event.respondWith called with:", f), f;
          });
          if (p.error) {
            this.logger.info(
              "request listener threw an exception, aborting request...",
              p.error
            ),
              a.errorWith(p.error);
            return;
          }
          const g = p.data;
          if (typeof g < "u") {
            if (
              (this.logger.info(
                "received mocked response: %d %s",
                g.status,
                g.statusText
              ),
              g.type === "error")
            ) {
              this.logger.info(
                "received a network error response, rejecting the request promise..."
              ),
                a.errorWith(new TypeError("Network error"));
              return;
            }
            return a.respondWith(g);
          }
          this.logger.info(
            "no mocked response received, performing request as-is..."
          );
        }),
        (a.onResponse = async function ({
          response: c,
          isMockedResponse: l,
          request: h,
          requestId: d,
        }) {
          this.logger.info(
            'emitting the "response" event for %s listener(s)...',
            e.listenerCount("response")
          ),
            e.emit("response", {
              response: c,
              isMockedResponse: l,
              request: h,
              requestId: d,
            });
        }),
        a.request
      );
    },
  });
}
var Xe = class extends de {
    constructor() {
      super(Xe.interceptorSymbol);
    }
    checkEnvironment() {
      return typeof globalThis.XMLHttpRequest < "u";
    }
    setup() {
      const e = this.logger.extend("setup");
      e.info('patching "XMLHttpRequest" module...');
      const t = globalThis.XMLHttpRequest;
      A(!t[U], 'Failed to patch the "XMLHttpRequest" module: already patched.'),
        (globalThis.XMLHttpRequest = Or({
          emitter: this.emitter,
          logger: this.logger,
        })),
        e.info(
          'native "XMLHttpRequest" module patched!',
          globalThis.XMLHttpRequest.name
        ),
        Object.defineProperty(globalThis.XMLHttpRequest, U, {
          enumerable: !0,
          configurable: !0,
          value: !0,
        }),
        this.subscriptions.push(() => {
          Object.defineProperty(globalThis.XMLHttpRequest, U, {
            value: void 0,
          }),
            (globalThis.XMLHttpRequest = t),
            e.info(
              'native "XMLHttpRequest" module restored!',
              globalThis.XMLHttpRequest.name
            );
        });
    }
  },
  ze = Xe;
ze.interceptorSymbol = Symbol("xhr");
function jr(e, t) {
  const r = new ie({ name: "fallback", interceptors: [new Fe(), new ze()] });
  return (
    r.on("request", async ({ request: s, requestId: n }) => {
      const o = s.clone(),
        i = await Ce(s, n, e.getRequestHandlers(), t, e.emitter, {
          onMockedResponse(u, { handler: a, parsedResult: c }) {
            t.quiet ||
              e.emitter.once("response:mocked", ({ response: l }) => {
                a.log({ request: o, response: l, parsedResult: c });
              });
          },
        });
      i && s.respondWith(i);
    }),
    r.on(
      "response",
      ({ response: s, isMockedResponse: n, request: o, requestId: i }) => {
        e.emitter.emit(n ? "response:mocked" : "response:bypass", {
          response: s,
          request: o,
          requestId: i,
        });
      }
    ),
    r.apply(),
    r
  );
}
function Ur(e) {
  return async function (r) {
    (e.fallbackInterceptor = jr(e, r)),
      Ae({ message: "Mocking enabled (fallback mode).", quiet: r.quiet });
  };
}
function Dr(e) {
  return function () {
    var r, s;
    (r = e.fallbackInterceptor) == null || r.dispose(),
      je({ quiet: (s = e.startOptions) == null ? void 0 : s.quiet });
  };
}
function Wr() {
  try {
    const e = new ReadableStream({ start: (r) => r.close() });
    return new MessageChannel().port1.postMessage(e, [e]), !0;
  } catch {
    return !1;
  }
}
var Hr = class extends jt {
  constructor(...t) {
    super(...t);
    w(this, "context");
    w(this, "startHandler", null);
    w(this, "stopHandler", null);
    w(this, "listeners");
    A(
      !le(),
      b.formatMessage(
        "Failed to execute `setupWorker` in a non-browser environment. Consider using `setupServer` for Node.js environment instead."
      )
    ),
      (this.listeners = []),
      (this.context = this.createWorkerContext());
  }
  createWorkerContext() {
    const t = {
      isMockingEnabled: !1,
      startOptions: null,
      worker: null,
      getRequestHandlers: () => this.handlersController.currentHandlers(),
      registration: null,
      requests: new Map(),
      emitter: this.emitter,
      workerChannel: {
        on: (r, s) => {
          this.context.events.addListener(
            navigator.serviceWorker,
            "message",
            (n) => {
              if (n.source !== this.context.worker) return;
              const o = n.data;
              o && o.type === r && s(n, o);
            }
          );
        },
        send: (r) => {
          var s;
          (s = this.context.worker) == null || s.postMessage(r);
        },
      },
      events: {
        addListener: (r, s, n) => (
          r.addEventListener(s, n),
          this.listeners.push({ eventType: s, target: r, callback: n }),
          () => {
            r.removeEventListener(s, n);
          }
        ),
        removeAllListeners: () => {
          for (const { target: r, eventType: s, callback: n } of this.listeners)
            r.removeEventListener(s, n);
          this.listeners = [];
        },
        once: (r) => {
          const s = [];
          return new Promise((n, o) => {
            const i = (u) => {
              try {
                const a = u.data;
                a.type === r && n(a);
              } catch (a) {
                o(a);
              }
            };
            s.push(
              this.context.events.addListener(
                navigator.serviceWorker,
                "message",
                i
              ),
              this.context.events.addListener(
                navigator.serviceWorker,
                "messageerror",
                o
              )
            );
          }).finally(() => {
            s.forEach((n) => n());
          });
        },
      },
      supports: {
        serviceWorkerApi:
          !("serviceWorker" in navigator) || location.protocol === "file:",
        readableStreamTransfer: Wr(),
      },
    };
    return (
      (this.startHandler = t.supports.serviceWorkerApi ? Ur(t) : yr(t)),
      (this.stopHandler = t.supports.serviceWorkerApi ? Dr(t) : wr(t)),
      t
    );
  }
  async start(t = {}) {
    return (
      t.waitUntilReady === !0 &&
        b.warn(
          'The "waitUntilReady" option has been deprecated. Please remove it from this "worker.start()" call. Follow the recommended Browser integration (https://mswjs.io/docs/integrations/browser) to eliminate any race conditions between the Service Worker registration and any requests made by your application on initial render.'
        ),
      (this.context.startOptions = _e(br, t)),
      await this.startHandler(this.context.startOptions, t)
    );
  }
  stop() {
    super.dispose(),
      this.context.events.removeAllListeners(),
      this.context.emitter.removeAllListeners(),
      this.stopHandler();
  }
};
function Nr(...e) {
  return new Hr(...e);
}
function Fr() {
  F(
    typeof URL < "u",
    b.formatMessage(
      `Global "URL" class is not defined. This likely means that you're running MSW in an environment that doesn't support all Node.js standard API (e.g. React Native). If that's the case, please use an appropriate polyfill for the "URL" class, like "react-native-url-polyfill".`
    )
  );
}
function Br(e, t) {
  return e.toLowerCase() === t.toLowerCase();
}
function Gr(e) {
  return e < 300 ? "#69AB32" : e < 400 ? "#F0BB4B" : "#E95F5D";
}
function Xr() {
  const e = new Date();
  return [e.getHours(), e.getMinutes(), e.getSeconds()]
    .map(String)
    .map((t) => t.slice(0, 2))
    .map((t) => t.padStart(2, "0"))
    .join(":");
}
async function zr(e) {
  const r = await e.clone().text();
  return {
    url: new URL(e.url),
    method: e.method,
    headers: Object.fromEntries(e.headers.entries()),
    body: r,
  };
}
var Kr = Object.create,
  Ke = Object.defineProperty,
  Vr = Object.getOwnPropertyDescriptor,
  Ve = Object.getOwnPropertyNames,
  Jr = Object.getPrototypeOf,
  Qr = Object.prototype.hasOwnProperty,
  Je = (e, t) =>
    function () {
      return t || (0, e[Ve(e)[0]])((t = { exports: {} }).exports, t), t.exports;
    },
  Yr = (e, t, r, s) => {
    if ((t && typeof t == "object") || typeof t == "function")
      for (let n of Ve(t))
        !Qr.call(e, n) &&
          n !== r &&
          Ke(e, n, {
            get: () => t[n],
            enumerable: !(s = Vr(t, n)) || s.enumerable,
          });
    return e;
  },
  Zr = (e, t, r) => (
    (r = e != null ? Kr(Jr(e)) : {}),
    Yr(
      t || !e || !e.__esModule
        ? Ke(r, "default", { value: e, enumerable: !0 })
        : r,
      e
    )
  ),
  es = Je({
    "node_modules/statuses/codes.json"(e, t) {
      t.exports = {
        100: "Continue",
        101: "Switching Protocols",
        102: "Processing",
        103: "Early Hints",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        207: "Multi-Status",
        208: "Already Reported",
        226: "IM Used",
        300: "Multiple Choices",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        308: "Permanent Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Payload Too Large",
        414: "URI Too Long",
        415: "Unsupported Media Type",
        416: "Range Not Satisfiable",
        417: "Expectation Failed",
        418: "I'm a Teapot",
        421: "Misdirected Request",
        422: "Unprocessable Entity",
        423: "Locked",
        424: "Failed Dependency",
        425: "Too Early",
        426: "Upgrade Required",
        428: "Precondition Required",
        429: "Too Many Requests",
        431: "Request Header Fields Too Large",
        451: "Unavailable For Legal Reasons",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
        506: "Variant Also Negotiates",
        507: "Insufficient Storage",
        508: "Loop Detected",
        509: "Bandwidth Limit Exceeded",
        510: "Not Extended",
        511: "Network Authentication Required",
      };
    },
  }),
  ts = Je({
    "node_modules/statuses/index.js"(e, t) {
      var r = es();
      (t.exports = u),
        (u.message = r),
        (u.code = s(r)),
        (u.codes = n(r)),
        (u.redirect = {
          300: !0,
          301: !0,
          302: !0,
          303: !0,
          305: !0,
          307: !0,
          308: !0,
        }),
        (u.empty = { 204: !0, 205: !0, 304: !0 }),
        (u.retry = { 502: !0, 503: !0, 504: !0 });
      function s(a) {
        var c = {};
        return (
          Object.keys(a).forEach(function (h) {
            var d = a[h],
              p = Number(h);
            c[d.toLowerCase()] = p;
          }),
          c
        );
      }
      function n(a) {
        return Object.keys(a).map(function (l) {
          return Number(l);
        });
      }
      function o(a) {
        var c = a.toLowerCase();
        if (!Object.prototype.hasOwnProperty.call(u.code, c))
          throw new Error('invalid status message: "' + a + '"');
        return u.code[c];
      }
      function i(a) {
        if (!Object.prototype.hasOwnProperty.call(u.message, a))
          throw new Error("invalid status code: " + a);
        return u.message[a];
      }
      function u(a) {
        if (typeof a == "number") return i(a);
        if (typeof a != "string")
          throw new TypeError("code must be a number or string");
        var c = parseInt(a, 10);
        return isNaN(c) ? o(a) : i(c);
      }
    },
  }),
  rs = Zr(ts(), 1),
  Qe = rs.default;
/*! Bundled license information:

statuses/index.js:
  (*!
   * statuses
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/ const { message: ss } = Qe;
async function ns(e) {
  const t = e.clone(),
    r = await t.text(),
    s = t.status || 200,
    n = t.statusText || ss[s] || "OK";
  return {
    status: s,
    statusText: n,
    headers: Object.fromEntries(t.headers.entries()),
    body: r,
  };
}
function os(e) {
  for (var t = [], r = 0; r < e.length; ) {
    var s = e[r];
    if (s === "*" || s === "+" || s === "?") {
      t.push({ type: "MODIFIER", index: r, value: e[r++] });
      continue;
    }
    if (s === "\\") {
      t.push({ type: "ESCAPED_CHAR", index: r++, value: e[r++] });
      continue;
    }
    if (s === "{") {
      t.push({ type: "OPEN", index: r, value: e[r++] });
      continue;
    }
    if (s === "}") {
      t.push({ type: "CLOSE", index: r, value: e[r++] });
      continue;
    }
    if (s === ":") {
      for (var n = "", o = r + 1; o < e.length; ) {
        var i = e.charCodeAt(o);
        if (
          (i >= 48 && i <= 57) ||
          (i >= 65 && i <= 90) ||
          (i >= 97 && i <= 122) ||
          i === 95
        ) {
          n += e[o++];
          continue;
        }
        break;
      }
      if (!n) throw new TypeError("Missing parameter name at ".concat(r));
      t.push({ type: "NAME", index: r, value: n }), (r = o);
      continue;
    }
    if (s === "(") {
      var u = 1,
        a = "",
        o = r + 1;
      if (e[o] === "?")
        throw new TypeError('Pattern cannot start with "?" at '.concat(o));
      for (; o < e.length; ) {
        if (e[o] === "\\") {
          a += e[o++] + e[o++];
          continue;
        }
        if (e[o] === ")") {
          if ((u--, u === 0)) {
            o++;
            break;
          }
        } else if (e[o] === "(" && (u++, e[o + 1] !== "?"))
          throw new TypeError("Capturing groups are not allowed at ".concat(o));
        a += e[o++];
      }
      if (u) throw new TypeError("Unbalanced pattern at ".concat(r));
      if (!a) throw new TypeError("Missing pattern at ".concat(r));
      t.push({ type: "PATTERN", index: r, value: a }), (r = o);
      continue;
    }
    t.push({ type: "CHAR", index: r, value: e[r++] });
  }
  return t.push({ type: "END", index: r, value: "" }), t;
}
function is(e, t) {
  t === void 0 && (t = {});
  for (
    var r = os(e),
      s = t.prefixes,
      n = s === void 0 ? "./" : s,
      o = "[^".concat(j(t.delimiter || "/#?"), "]+?"),
      i = [],
      u = 0,
      a = 0,
      c = "",
      l = function (x) {
        if (a < r.length && r[a].type === x) return r[a++].value;
      },
      h = function (x) {
        var _ = l(x);
        if (_ !== void 0) return _;
        var q = r[a],
          Q = q.type,
          Y = q.index;
        throw new TypeError(
          "Unexpected ".concat(Q, " at ").concat(Y, ", expected ").concat(x)
        );
      },
      d = function () {
        for (var x = "", _; (_ = l("CHAR") || l("ESCAPED_CHAR")); ) x += _;
        return x;
      };
    a < r.length;

  ) {
    var p = l("CHAR"),
      g = l("NAME"),
      f = l("PATTERN");
    if (g || f) {
      var m = p || "";
      n.indexOf(m) === -1 && ((c += m), (m = "")),
        c && (i.push(c), (c = "")),
        i.push({
          name: g || u++,
          prefix: m,
          suffix: "",
          pattern: f || o,
          modifier: l("MODIFIER") || "",
        });
      continue;
    }
    var v = p || l("ESCAPED_CHAR");
    if (v) {
      c += v;
      continue;
    }
    c && (i.push(c), (c = ""));
    var E = l("OPEN");
    if (E) {
      var m = d(),
        k = l("NAME") || "",
        y = l("PATTERN") || "",
        C = d();
      h("CLOSE"),
        i.push({
          name: k || (y ? u++ : ""),
          pattern: k && !y ? o : y,
          prefix: m,
          suffix: C,
          modifier: l("MODIFIER") || "",
        });
      continue;
    }
    h("END");
  }
  return i;
}
function as(e, t) {
  var r = [],
    s = Ze(e, r, t);
  return cs(s, r, t);
}
function cs(e, t, r) {
  r === void 0 && (r = {});
  var s = r.decode,
    n =
      s === void 0
        ? function (o) {
            return o;
          }
        : s;
  return function (o) {
    var i = e.exec(o);
    if (!i) return !1;
    for (
      var u = i[0],
        a = i.index,
        c = Object.create(null),
        l = function (d) {
          if (i[d] === void 0) return "continue";
          var p = t[d - 1];
          p.modifier === "*" || p.modifier === "+"
            ? (c[p.name] = i[d].split(p.prefix + p.suffix).map(function (g) {
                return n(g, p);
              }))
            : (c[p.name] = n(i[d], p));
        },
        h = 1;
      h < i.length;
      h++
    )
      l(h);
    return { path: u, index: a, params: c };
  };
}
function j(e) {
  return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function Ye(e) {
  return e && e.sensitive ? "" : "i";
}
function us(e, t) {
  if (!t) return e;
  for (var r = /\((?:\?<(.*?)>)?(?!\?)/g, s = 0, n = r.exec(e.source); n; )
    t.push({
      name: n[1] || s++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: "",
    }),
      (n = r.exec(e.source));
  return e;
}
function ls(e, t, r) {
  var s = e.map(function (n) {
    return Ze(n, t, r).source;
  });
  return new RegExp("(?:".concat(s.join("|"), ")"), Ye(r));
}
function ds(e, t, r) {
  return hs(is(e, r), t, r);
}
function hs(e, t, r) {
  r === void 0 && (r = {});
  for (
    var s = r.strict,
      n = s === void 0 ? !1 : s,
      o = r.start,
      i = o === void 0 ? !0 : o,
      u = r.end,
      a = u === void 0 ? !0 : u,
      c = r.encode,
      l =
        c === void 0
          ? function (Y) {
              return Y;
            }
          : c,
      h = r.delimiter,
      d = h === void 0 ? "/#?" : h,
      p = r.endsWith,
      g = p === void 0 ? "" : p,
      f = "[".concat(j(g), "]|$"),
      m = "[".concat(j(d), "]"),
      v = i ? "^" : "",
      E = 0,
      k = e;
    E < k.length;
    E++
  ) {
    var y = k[E];
    if (typeof y == "string") v += j(l(y));
    else {
      var C = j(l(y.prefix)),
        x = j(l(y.suffix));
      if (y.pattern)
        if ((t && t.push(y), C || x))
          if (y.modifier === "+" || y.modifier === "*") {
            var _ = y.modifier === "*" ? "?" : "";
            v += "(?:"
              .concat(C, "((?:")
              .concat(y.pattern, ")(?:")
              .concat(x)
              .concat(C, "(?:")
              .concat(y.pattern, "))*)")
              .concat(x, ")")
              .concat(_);
          } else
            v += "(?:"
              .concat(C, "(")
              .concat(y.pattern, ")")
              .concat(x, ")")
              .concat(y.modifier);
        else
          y.modifier === "+" || y.modifier === "*"
            ? (v += "((?:".concat(y.pattern, ")").concat(y.modifier, ")"))
            : (v += "(".concat(y.pattern, ")").concat(y.modifier));
      else v += "(?:".concat(C).concat(x, ")").concat(y.modifier);
    }
  }
  if (a)
    n || (v += "".concat(m, "?")),
      (v += r.endsWith ? "(?=".concat(f, ")") : "$");
  else {
    var q = e[e.length - 1],
      Q = typeof q == "string" ? m.indexOf(q[q.length - 1]) > -1 : q === void 0;
    n || (v += "(?:".concat(m, "(?=").concat(f, "))?")),
      Q || (v += "(?=".concat(m, "|").concat(f, ")"));
  }
  return new RegExp(v, Ye(r));
}
function Ze(e, t, r) {
  return e instanceof RegExp
    ? us(e, t)
    : Array.isArray(e)
    ? ls(e, t, r)
    : ds(e, t, r);
}
new TextEncoder();
function fs() {
  if (typeof navigator < "u" && navigator.product === "ReactNative") return !0;
  if (typeof process < "u") {
    const e = process.type;
    return e === "renderer" || e === "worker"
      ? !1
      : !!(process.versions && process.versions.node);
  }
  return !1;
}
var ps = Object.defineProperty,
  gs = (e, t) => {
    for (var r in t) ps(e, r, { get: t[r], enumerable: !0 });
  },
  ms = {};
gs(ms, {
  blue: () => ys,
  gray: () => ws,
  green: () => Es,
  red: () => bs,
  yellow: () => vs,
});
function vs(e) {
  return `\x1B[33m${e}\x1B[0m`;
}
function ys(e) {
  return `\x1B[34m${e}\x1B[0m`;
}
function ws(e) {
  return `\x1B[90m${e}\x1B[0m`;
}
function bs(e) {
  return `\x1B[31m${e}\x1B[0m`;
}
function Es(e) {
  return `\x1B[32m${e}\x1B[0m`;
}
fs();
function xs(e, t = !0) {
  return [t && e.origin, e.pathname].filter(Boolean).join("");
}
const ks = /[\?|#].*$/g;
function Ls(e) {
  return new URL(`/${e}`, "http://localhost").searchParams;
}
function et(e) {
  return e.replace(ks, "");
}
function Rs(e) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
}
function Ss(e, t) {
  if (Rs(e) || e.startsWith("*")) return e;
  const r = t || (typeof document < "u" && document.baseURI);
  return r ? decodeURI(new URL(encodeURI(e), r).href) : e;
}
function Ps(e, t) {
  if (e instanceof RegExp) return e;
  const r = Ss(e, t);
  return et(r);
}
function Ts(e) {
  return e
    .replace(/([:a-zA-Z_-]*)(\*{1,2})+/g, (t, r, s) => {
      const n = "(.*)";
      return r ? (r.startsWith(":") ? `${r}${s}` : `${r}${n}`) : n;
    })
    .replace(/([^\/])(:)(?=\d+)/, "$1\\$2")
    .replace(/^([^\/]+)(:)(?=\/\/)/, "$1\\$2");
}
function Cs(e, t, r) {
  const s = Ps(t, r),
    n = typeof s == "string" ? Ts(s) : s,
    o = xs(e),
    i = as(n, { decode: decodeURIComponent })(o),
    u = (i && i.params) || {};
  return { matches: i !== !1, params: u };
}
var _s = Object.create,
  tt = Object.defineProperty,
  qs = Object.getOwnPropertyDescriptor,
  rt = Object.getOwnPropertyNames,
  As = Object.getPrototypeOf,
  Ms = Object.prototype.hasOwnProperty,
  Is = (e, t) =>
    function () {
      return t || (0, e[rt(e)[0]])((t = { exports: {} }).exports, t), t.exports;
    },
  $s = (e, t, r, s) => {
    if ((t && typeof t == "object") || typeof t == "function")
      for (let n of rt(t))
        !Ms.call(e, n) &&
          n !== r &&
          tt(e, n, {
            get: () => t[n],
            enumerable: !(s = qs(t, n)) || s.enumerable,
          });
    return e;
  },
  Os = (e, t, r) => (
    (r = e != null ? _s(As(e)) : {}),
    $s(
      t || !e || !e.__esModule
        ? tt(r, "default", { value: e, enumerable: !0 })
        : r,
      e
    )
  ),
  js = Is({
    "node_modules/cookie/index.js"(e) {
      (e.parse = s), (e.serialize = n);
      var t = Object.prototype.toString,
        r = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
      function s(c, l) {
        if (typeof c != "string")
          throw new TypeError("argument str must be a string");
        for (
          var h = {}, d = l || {}, p = d.decode || o, g = 0;
          g < c.length;

        ) {
          var f = c.indexOf("=", g);
          if (f === -1) break;
          var m = c.indexOf(";", g);
          if (m === -1) m = c.length;
          else if (m < f) {
            g = c.lastIndexOf(";", f - 1) + 1;
            continue;
          }
          var v = c.slice(g, f).trim();
          if (h[v] === void 0) {
            var E = c.slice(f + 1, m).trim();
            E.charCodeAt(0) === 34 && (E = E.slice(1, -1)), (h[v] = a(E, p));
          }
          g = m + 1;
        }
        return h;
      }
      function n(c, l, h) {
        var d = h || {},
          p = d.encode || i;
        if (typeof p != "function")
          throw new TypeError("option encode is invalid");
        if (!r.test(c)) throw new TypeError("argument name is invalid");
        var g = p(l);
        if (g && !r.test(g)) throw new TypeError("argument val is invalid");
        var f = c + "=" + g;
        if (d.maxAge != null) {
          var m = d.maxAge - 0;
          if (isNaN(m) || !isFinite(m))
            throw new TypeError("option maxAge is invalid");
          f += "; Max-Age=" + Math.floor(m);
        }
        if (d.domain) {
          if (!r.test(d.domain))
            throw new TypeError("option domain is invalid");
          f += "; Domain=" + d.domain;
        }
        if (d.path) {
          if (!r.test(d.path)) throw new TypeError("option path is invalid");
          f += "; Path=" + d.path;
        }
        if (d.expires) {
          var v = d.expires;
          if (!u(v) || isNaN(v.valueOf()))
            throw new TypeError("option expires is invalid");
          f += "; Expires=" + v.toUTCString();
        }
        if (
          (d.httpOnly && (f += "; HttpOnly"),
          d.secure && (f += "; Secure"),
          d.priority)
        ) {
          var E =
            typeof d.priority == "string"
              ? d.priority.toLowerCase()
              : d.priority;
          switch (E) {
            case "low":
              f += "; Priority=Low";
              break;
            case "medium":
              f += "; Priority=Medium";
              break;
            case "high":
              f += "; Priority=High";
              break;
            default:
              throw new TypeError("option priority is invalid");
          }
        }
        if (d.sameSite) {
          var k =
            typeof d.sameSite == "string"
              ? d.sameSite.toLowerCase()
              : d.sameSite;
          switch (k) {
            case !0:
              f += "; SameSite=Strict";
              break;
            case "lax":
              f += "; SameSite=Lax";
              break;
            case "strict":
              f += "; SameSite=Strict";
              break;
            case "none":
              f += "; SameSite=None";
              break;
            default:
              throw new TypeError("option sameSite is invalid");
          }
        }
        return f;
      }
      function o(c) {
        return c.indexOf("%") !== -1 ? decodeURIComponent(c) : c;
      }
      function i(c) {
        return encodeURIComponent(c);
      }
      function u(c) {
        return t.call(c) === "[object Date]" || c instanceof Date;
      }
      function a(c, l) {
        try {
          return l(c);
        } catch {
          return c;
        }
      }
    },
  }),
  Us = Os(js(), 1),
  ae = Us.default;
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/ function Le() {
  return ae.parse(document.cookie);
}
function Ds(e) {
  if (typeof document > "u" || typeof location > "u") return {};
  switch (e.credentials) {
    case "same-origin": {
      const t = new URL(e.url);
      return location.origin === t.origin ? Le() : {};
    }
    case "include":
      return Le();
    default:
      return {};
  }
}
function Ws(e) {
  var i;
  const t = e.headers.get("cookie"),
    r = t ? ae.parse(t) : {};
  K.hydrate();
  const s = Array.from((i = K.get(e)) == null ? void 0 : i.entries()).reduce(
      (u, [a, { value: c }]) => Object.assign(u, { [a.trim()]: c }),
      {}
    ),
    o = { ...Ds(e), ...s };
  for (const [u, a] of Object.entries(o))
    e.headers.append("cookie", ae.serialize(u, a));
  return { ...o, ...r };
}
var P = ((e) => (
  (e.HEAD = "HEAD"),
  (e.GET = "GET"),
  (e.POST = "POST"),
  (e.PUT = "PUT"),
  (e.PATCH = "PATCH"),
  (e.OPTIONS = "OPTIONS"),
  (e.DELETE = "DELETE"),
  e
))(P || {});
class Hs extends z {
  constructor(t, r, s, n) {
    super({
      info: { header: `${t} ${r}`, path: r, method: t },
      resolver: s,
      options: n,
    }),
      this.checkRedundantQueryParameters();
  }
  checkRedundantQueryParameters() {
    const { method: t, path: r } = this.info;
    if (r instanceof RegExp || et(r) === r) return;
    Ls(r).forEach((o, i) => {}),
      b.warn(
        `Found a redundant usage of query parameters in the request handler URL for "${t} ${r}". Please match against a path instead and access query parameters in the response resolver function using "req.url.searchParams".`
      );
  }
  async parse(t) {
    var o;
    const r = new URL(t.request.url),
      s = Cs(
        r,
        this.info.path,
        (o = t.resolutionContext) == null ? void 0 : o.baseUrl
      ),
      n = Ws(t.request);
    return { match: s, cookies: n };
  }
  predicate(t) {
    const r = this.matchMethod(t.request.method),
      s = t.parsedResult.match.matches;
    return r && s;
  }
  matchMethod(t) {
    return this.info.method instanceof RegExp
      ? this.info.method.test(t)
      : Br(this.info.method, t);
  }
  extendResolverArgs(t) {
    var r;
    return {
      params: ((r = t.parsedResult.match) == null ? void 0 : r.params) || {},
      cookies: t.parsedResult.cookies,
    };
  }
  async log(t) {
    const r = Se(t.request.url),
      s = await zr(t.request),
      n = await ns(t.response),
      o = Gr(n.status);
    console.groupCollapsed(
      b.formatMessage(
        `${Xr()} ${t.request.method} ${r} (%c${n.status} ${n.statusText}%c)`
      ),
      `color:${o}`,
      "color:inherit"
    ),
      console.log("Request", s),
      console.log("Handler:", this),
      console.log("Response", n),
      console.groupEnd();
  }
}
function S(e) {
  return (t, r, s = {}) => new Hs(e, t, r, s);
}
const re = {
    all: S(/.+/),
    head: S(P.HEAD),
    get: S(P.GET),
    post: S(P.POST),
    put: S(P.PUT),
    delete: S(P.DELETE),
    patch: S(P.PATCH),
    options: S(P.OPTIONS),
  },
  { message: Ns } = Qe;
function I(e = {}) {
  const t = (e == null ? void 0 : e.status) || 200,
    r = (e == null ? void 0 : e.statusText) || Ns[t] || "",
    s = new Headers(e == null ? void 0 : e.headers);
  return { ...e, headers: s, status: t, statusText: r };
}
function Fs(e, t) {
  var r;
  if (
    (t.type &&
      Object.defineProperty(e, "type", {
        value: t.type,
        enumerable: !0,
        writable: !1,
      }),
    typeof document < "u")
  ) {
    const s =
      ((r = t.headers.get("Set-Cookie")) == null ? void 0 : r.split(",")) || [];
    for (const n of s) document.cookie = n;
  }
  return e;
}
class R extends Response {
  constructor(t, r) {
    const s = I(r);
    super(t, s), Fs(this, s);
  }
  static text(t, r) {
    const s = I(r);
    return (
      s.headers.has("Content-Type") ||
        s.headers.set("Content-Type", "text/plain"),
      s.headers.has("Content-Length") ||
        s.headers.set("Content-Length", t ? t.length.toString() : "0"),
      new R(t, s)
    );
  }
  static json(t, r) {
    const s = I(r);
    s.headers.has("Content-Type") ||
      s.headers.set("Content-Type", "application/json");
    const n = JSON.stringify(t);
    return (
      s.headers.has("Content-Length") ||
        s.headers.set("Content-Length", n ? n.length.toString() : "0"),
      new R(n, s)
    );
  }
  static xml(t, r) {
    const s = I(r);
    return (
      s.headers.has("Content-Type") ||
        s.headers.set("Content-Type", "text/xml"),
      new R(t, s)
    );
  }
  static arrayBuffer(t, r) {
    const s = I(r);
    return (
      t && s.headers.set("Content-Length", t.byteLength.toString()), new R(t, s)
    );
  }
  static formData(t, r) {
    return new R(t, I(r));
  }
}
Fr();
const $ = [
    {
      id: "f5gH8jK2",
      name: "Christoffer",
      email: "christoffer.christiansen@example.com",
      picture: "men/0.jpg",
      bio: "Enthusiastic about technology and always eager to learn something new.",
      password: "Gh5Rt9",
      hash: "$2b$04$0DMLK2UcDismC.i2ge49Q.oIVkFOk4wJQanWIVVZJw0qT3.EeeKEG",
    },
    {
      id: "l9sF2dP6",
      name: "Valtteri",
      email: "valtteri.pulkkinen@example.com",
      picture: "men/1.jpg",
      bio: "A nature lover who enjoys hiking and exploring the outdoors.",
      password: "Jk8Pw3",
      hash: "$2b$04$a35jWHv1UoH.nb8WiOKGmeGbChK4.FOab3M5jodI1GkYP0wkT4KxG",
    },
    {
      id: "a3zR5xM8",
      name: "Todd",
      email: "todd.beck@example.com",
      picture: "men/2.jpg",
      bio: "Passionate about photography and capturing life's precious moments.",
      password: "Lm2Kx8",
      hash: "$2b$04$c.W2mGyT.IhNVkVq8al03OX67wiU3tnrFXEmPBFE3fptbMAuZ4egC",
    },
    {
      id: "b7hD3gN9",
      name: "Jimmie",
      email: "jimmie.simmons@example.com",
      picture: "men/3.jpg",
      bio: "Music enthusiast who enjoys playing guitar and composing songs.",
      password: "Dn6Kv4",
      hash: "$2b$04$mlfnS.5eJWwLTuYFwLgCROhyzGhk2iQQ.cDlKce.7E45paazwN92u",
    },
    {
      id: "s8mJ2nF4",
      name: "Benedikt",
      email: "benedikt.hein@example.com",
      picture: "men/4.jpg",
      bio: "A bookworm and avid reader, always exploring new realms through literature.",
      password: "Hb7Mt3",
      hash: "$2b$04$jvjNrS8TREWMDBQZ.juDa.Vprwt3HRsIq37StfroNgkheIReN/vFW",
    },
    {
      id: "t6wE8jU7",
      name: "Aloïs",
      email: "aloïs.moulin@example.com",
      picture: "men/5.jpg",
      bio: "Foodie and amateur chef, constantly experimenting with flavors in the kitchen.",
      password: "Qs9Ry4",
      hash: "$2b$04$nDv16p20/sjI.W11aw9Cj.MSzf3Qku.hdgLvu8CbYfMf8TRXFRC12",
    },
    {
      id: "j4kL9qW2",
      name: "Noah",
      email: "noah.smith@example.com",
      picture: "men/6.jpg",
      bio: "Adventure seeker who loves adrenaline-fueled activities like skydiving and bungee jumping.",
      password: "Tj2Hn5",
      hash: "$2b$04$zy4yV/KsoWjQR2MV6WwJseJ6CwJPysfV5NHClPOg.7szjZgTEIZh2",
    },
    {
      id: "p7tS3fU5",
      name: "Dupont",
      email: "noah.dupont@example.com",
      picture: "men/7.jpg",
      bio: "Avid traveler and explorer, always seeking new cultures and experiences.",
      password: "Vm4Gk9",
      hash: "$2b$04$aU88vSS.UoH3WrVzZkQGB.WvDfK0rfxCQt1n7x/xfI7KnGnd.0Ti6",
    },
    {
      id: "r2wE9uY5",
      name: "Necati",
      email: "necati.nalbantoglu@example.com",
      picture: "men/8.jpg",
      bio: "Tech geek with a passion for coding and building innovative solutions.",
      password: "Ck8Fj3",
      hash: "$2b$04$BIk9D3MAz3i4S8tYHpO0TOA2NhkWC9XkTh8DUT2zZ3zg0Nz1wEejy",
    },
    {
      id: "h5bM8jK3",
      name: "Arnold",
      email: "arnold.gardner@example.com",
      picture: "men/9.jpg",
      bio: "Fitness enthusiast and gym buff, dedicated to living a healthy lifestyle.",
      password: "Fn3Cs7",
      hash: "$2b$04$oRg/DY617nLK5iWLP7CUiO//4B387SpxZw7A1uEk.3M3rbe10l7ma",
    },
  ],
  Bs = [
    re.get("/api/users", () =>
      R.json($.map((e) => ({ email: e.email, id: e.id })))
    ),
    re.get("/api/user/:id", async (e) => {
      const { id: t } = e.params,
        r = $.find((s) => s.id === t);
      return r
        ? new R(JSON.stringify(r))
        : new R("User not found!", { status: 404 });
    }),
    re.patch("/api/update-profile", async (e) => {
      const t = await e.request.json(),
        r = $.findIndex((s) => s.id === t.id);
      return r > -1
        ? (($[r] = { ...$[r], ...t }), new Response(JSON.stringify(ot($[r]))))
        : new Response("No user found", { status: 404 });
    }),
  ],
  Js = Nr(...Bs);
export { Js as worker };

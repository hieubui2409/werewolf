if (!self.define) {
  let e,
    i = {};
  const s = (s, n) => (
    (s = new URL(s + ".js", n).href),
    i[s] ||
      new Promise((i) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = s), (e.onload = i), document.head.appendChild(e));
        } else ((e = s), importScripts(s), i());
      }).then(() => {
        let e = i[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, r) => {
    const o =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (i[o]) return;
    let f = {};
    const t = (e) => s(e, o),
      d = { module: { uri: o }, exports: f, require: t };
    i[o] = Promise.all(n.map((e) => d[e] || t(e))).then((e) => (r(...e), f));
  };
}
define(["./workbox-1ef09536"], function (e) {
  "use strict";
  (self.addEventListener("message", (e) => {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
  }),
    e.precacheAndRoute(
      [
        { url: "index.html", revision: "8710027bc3990c8301a9ac04d3c21a68" },
        { url: "icons.svg", revision: "3b4fcfcf393eca4d264dca4a4663bc37" },
        { url: "favicon.svg", revision: "7e840862161341271697daa99a40d76b" },
        {
          url: "sounds/timer-tick.mp3",
          revision: "5fbc2923819f0f1f8b0e12c03179cea5",
        },
        {
          url: "sounds/timer-end.mp3",
          revision: "abef5396ebc02ca00848f92d6cd1e6c6",
        },
        {
          url: "sounds/night-ambience.mp3",
          revision: "db96d1db010d11de4e3a784c7cb349fc",
        },
        {
          url: "fonts/inter-vietnamese.woff2",
          revision: "9df17551da76cba6ee2d5d35fc762ed9",
        },
        {
          url: "fonts/inter-latin.woff2",
          revision: "260c81a4759baf163c025001c4f27872",
        },
        {
          url: "fonts/inter-latin-ext.woff2",
          revision: "1ad231aac0a8a891b8374aa5526a5813",
        },
        {
          url: "fonts/bebas-neue-latin.woff2",
          revision: "2dd698f2699a5ef991625825011bff90",
        },
        {
          url: "fonts/bebas-neue-latin-ext.woff2",
          revision: "089e175e5cfe9e7e2a0a719196038fb9",
        },
        { url: "assets/workbox-window.prod.es5-Bq4GJJid.js", revision: null },
        { url: "assets/index-DzlSsHBG.css", revision: null },
        { url: "assets/index-7anyfrqR.js", revision: null },
        {
          url: "manifest.webmanifest",
          revision: "472d9d354c8e34d3947636d64100d3a2",
        },
      ],
      {},
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html")),
    ));
});

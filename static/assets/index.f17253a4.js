const p = function () {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload")) return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]')) o(t);
  new MutationObserver((t) => {
    for (const s of t)
      if (s.type === "childList")
        for (const r of s.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && o(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(t) {
    const s = {};
    return (
      t.integrity && (s.integrity = t.integrity),
      t.referrerpolicy && (s.referrerPolicy = t.referrerpolicy),
      t.crossorigin === "use-credentials"
        ? (s.credentials = "include")
        : t.crossorigin === "anonymous"
        ? (s.credentials = "omit")
        : (s.credentials = "same-origin"),
      s
    );
  }
  function o(t) {
    if (t.ep) return;
    t.ep = !0;
    const s = e(t);
    fetch(t.href, s);
  }
};
p();
class a {
  constructor(i, e) {
    (this.opts = e != null ? e : {}),
      this.opts.min == null && (this.opts.min = 0),
      this.opts.max == null && (this.opts.max = 360),
      this.opts.speed == null && (this.opts.speed = 400),
      this.opts.dispatch == null && (this.opts.dispatch = !0),
      this.opts.sync == null && (this.opts.sync = !1),
      this.opts.elastic == null && (this.opts.elastic = !0),
      this.opts.blur == null && (this.opts.blur = !0);
    const o = document.querySelector(i);
    (o.style.position = "relative"),
      (this._launcher = o.querySelector(o.getAttribute("data-launcher"))),
      (this._wrapper = document.querySelector(
        this._launcher.getAttribute("href")
      ));
    let t = this._launcher.getBoundingClientRect();
    return (
      (this._button = {
        top: t.top + document.body.scrollTop,
        left: t.left + document.body.scrollLeft,
        radius: t.height / 2,
      }),
      (this._launcher.style.zIndex = 2),
      (this._launcher.style.position = "absolute"),
      (this._wrapper.style.position = "absolute"),
      this.populate(),
      (t = this._items[0].getBoundingClientRect()),
      (this._radius = t.width / 2),
      (this._cnst = Math.PI / 180),
      this._launcher.addEventListener(
        "click",
        (s) => (
          s.preventDefault(),
          this._wrapper.classList.contains("open")
            ? (this._wrapper.classList.remove("open"),
              this._items.forEach((r) => {
                (r.style.left = 0), (r.style.top = 0), (r.style.opacity = 0);
              }))
            : this.position(),
          !1
        ),
        !1
      ),
      this
    );
  }

  position() {
    this._wrapper.classList.add("open");
    let i = this._items.length;
    let e = 2.5 * this._button.radius;
    let o = 0;
    let t = 0;
    const s = this.opts.max - this.opts.min;
    const r = () => {
      (o = ~~((s / 60) * (e / (this._radius * 2)))),
        o > i && this.opts.dispatch && (o = i),
        (t = s / o);
    };
    r();
    let l = 0;
    return (
      this._items.forEach((n) => {
        l == o && ((l = 0), (e += 2.2 * this._button.radius), (i -= o), r());
        const c = this._cnst * (this.opts.min + t * l++);
        (n.style.left = `${e * Math.cos(c)}px`),
          (n.style.top = `${-(e * Math.sin(c))}px`),
          (n.style.opacity = 100);
      }),
      this
    );
  }

  populate() {
    (this._items = []),
      Array.from(this._wrapper.children).forEach((e) => {
        e.nodeType != 8 &&
          (this._items.push(e),
          (e.style.position = "absolute"),
          (e.style.top = 0),
          (e.style.left = 0),
          (e.style.opacity = 0));
      });
    let i = 0;
    return (
      Array.from(this._wrapper.children).forEach((e) => {
        (e.style.transition = `all ease-out ${this.opts.speed}ms`),
          (e.style.transitionDelay = `${(i++ * this.opts.speed) / 10}ms`),
          this.opts.elastic &&
            (e.style.transitionTimingFunction =
              "cubic-bezier(0.66,-0.07, 0.06, 1.55)");
      }),
      this
    );
  }

  toggle() {
    const i = document.createElement("HTMLEvents");
    return i.initEvent("click", !1, !1), this._launcher.dispatchEvent(i), this;
  }
}
window.innerWidth > 640 &&
  (new a("#socials-wrapper"), new a("#projects-wrapper"));

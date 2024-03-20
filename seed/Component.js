type BaseClass = HTMLElement;

type Constructor = { new (...args: any[]): BaseClass };

export default function Component(tag: string) {
  let ntag = tag;
  if (!ntag.includes("-")) ntag = `vr-${ntag}`;

  return function <T extends Constructor>(constructor: T) {
    const cls = class extends constructor {
        this.innerHTML = "<li>TEST</li>";
    };
    customElements.define(ntag, cls);
    return cls;
  };
}

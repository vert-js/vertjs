/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { parseDocument } from "htmlparser2";
import { selectAll } from "css-select";

export default function optimizerCSS() {
  return new Promise((resolve) => {
    const promisesCSS = [];
    const cssRules = {};
    globalThis.files.css.map((css) =>
      promisesCSS.push(
        new Promise((resolveCSSEach) => {
          Bun.file(`${globalThis.dirs.dist}/${css}`)
            .text()
            .then((content) => {
              [...content.matchAll(/([^{]+)\{([^}]+)\}/gm)].map((array) => {
                if (!(array[1] in cssRules))
                  cssRules[array[1]] = {
                    found: 0,
                    kept: [],
                  };
                cssRules[array[1]].kept.push({
                  file: css,
                  rules: array[2],
                });
              });
              resolveCSSEach();
            });
        })
      )
    );
    Promise.all(promisesCSS).then(() => {
      const promisesHTML = [];
      const cssKeys = Object.keys(cssRules);
      globalThis.files.html.map((html) =>
        promisesHTML.push(
          new Promise((resolveHTMLEach) => {
            Bun.file(`${globalThis.dirs.dist}/${html}`)
              .text()
              .then((content) => {
                const document = parseDocument(content);
                cssKeys.map((rule) => {
                  cssRules[rule].found = selectAll(rule, document).length;
                });
                resolveHTMLEach();
              });
          })
        )
      );

      Promise.all(promisesHTML).then(() => {
        cssKeys.map((rule) => {
          if (cssRules[rule].found == 0) delete cssRules[rule];
        });
        let css = {};
        globalThis.files.css.map((c) => {
          css[c] = "";
        });
        Object.keys(cssRules).map((k) => {
          cssRules[k].kept.map((o) => {
            css[o.file] = `${css[o.file]}${k}{${o.rules}}`;
          });
        });
        Object.keys(css).map(async (f) => {
          await Bun.write(`${globalThis.dirs.dist}/${f}`, css[f]);
        });
        resolve();
      });
    });
  });
}

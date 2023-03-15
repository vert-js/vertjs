/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { parseDocument } from "htmlparser2";
import { selectAll } from "css-select";
import cssMinifier from "../minifier/css";
import humanFileSize from "../utils/human";

export default function optimizerCSS() {
  return new Promise((resolve) => {
    const promisesCSS = [];
    const cssRules = {};
    const cssSizes = {};
    globalThis.files.css.forEach((css) =>
      promisesCSS.push(
        new Promise((resolveCSSEach) => {
          const file = Bun.file(`${globalThis.dirs.dist}/${css}`);
          cssSizes[css] = file.size;
          file.text().then((content) => {
            [...content.matchAll(/([^{]+)\{([^}]+)\}/gm)].forEach((array) =>
              array[1].split(",").forEach((path) => {
                const r = path.trim();
                if (!(r in cssRules))
                  cssRules[r] = {
                    found: 0,
                    kept: [],
                  };
                return cssRules[r].kept.push({
                  file: css,
                  rules: array[2],
                });
              })
            );
            resolveCSSEach();
          });
        })
      )
    );
    Promise.all(promisesCSS).then(() => {
      const promisesHTML = [];
      const cssKeys = Object.keys(cssRules);
      globalThis.files.html.forEach((html) =>
        promisesHTML.push(
          new Promise((resolveHTMLEach) => {
            Bun.file(`${globalThis.dirs.dist}/${html}`)
              .text()
              .then((content) => {
                const document = parseDocument(content);
                cssKeys.forEach((rule) => {
                  if (
                    rule === "*" ||
                    rule.startsWith(":") ||
                    rule.indexOf(":") !== -1
                  )
                    cssRules[rule].found = 1;
                  else cssRules[rule].found = selectAll(rule, document).length;
                  return true;
                });
                resolveHTMLEach();
              });
          })
        )
      );

      Promise.all(promisesHTML).then(() => {
        cssKeys.forEach((rule) => {
          if (cssRules[rule].found === 0) delete cssRules[rule];
        });
        const css = {};
        globalThis.files.css.forEach((c) => {
          css[c] = "";
        });
        Object.keys(cssRules).forEach((k) => {
          cssRules[k].kept.forEach((o) => {
            css[o.file] = `${css[o.file]}${k}{${o.rules}}`;
          });
        });
        Object.keys(css).forEach(async (f) => {
          const file = Bun.file(`${globalThis.dirs.dist}/${f}`);
          await Bun.write(file, cssMinifier(css[f]));
          cssSizes[f] -= file.size;
          // eslint-disable-next-line no-console
          console.log(`🪚  ${f} gained ${humanFileSize(cssSizes[f])}`);
        });
        resolve();
      });
    });
  });
}

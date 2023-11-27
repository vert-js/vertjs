/* eslint-disable no-undef */
export default async function copyIndexHtml(JSbundles, CSSbundles) {
  const srcHTML = Bun.file(`${globalThis.dirs.src}/index.html`);
  let htmlContent = await srcHTML.text();
  const hostname = `http${globalThis.env.HTTPS === "true" ? "s" : ""}://${
    globalThis.env.STATIC_HOST ?? "localhost"
  }:${globalThis.env.PORT ?? 1312}`;
  const indexjs = JSbundles.outputs.shift();
  if (indexjs)
    htmlContent = htmlContent.replace(
      "main.js",
      `${hostname}/public${indexjs.path.substring(
        indexjs.path.lastIndexOf("/")
      )}`
    );
  const indexcss = CSSbundles.shift();
  if (indexcss)
    htmlContent = htmlContent.replace(
      "main.css",
      `${hostname}/public${indexcss.substring(indexcss.lastIndexOf("/"))}`
    );
  const destHTML = Bun.file(`${globalThis.dirs.dest}/index.html`);
  await Bun.write(destHTML, htmlContent);
}

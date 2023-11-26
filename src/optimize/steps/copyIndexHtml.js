/* eslint-disable no-undef */
export default async function copyIndexHtml(JSbundles, CSSbundles) {
  const srcHTML = Bun.file(`${globalThis.dirs.src}/index.html`);
  let htmlContent = await srcHTML.text();
  const indexjs = JSbundles.outputs.shift();
  if (indexjs)
    htmlContent = htmlContent.replace(
      "index.js",
      indexjs.path.substring(indexjs.path.lastIndexOf("/"))
    );
  const indexcss = CSSbundles.shift();
  if (indexcss)
    htmlContent = htmlContent.replace(
      "index.css",
      indexcss.substring(indexcss.lastIndexOf("/"))
    );
  const destHTML = Bun.file(`${globalThis.dirs.dest}/index.html`);
  await Bun.write(destHTML, htmlContent);
}

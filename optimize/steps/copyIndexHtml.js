/* eslint-disable no-undef */
export default async function copyIndexHtml(newIndexJsFileName) {
  const srcHTML = Bun.file(`${globalThis.dirs.src}/index.html`);
  let htmlContent = await srcHTML.text();
  htmlContent = htmlContent.replace("index.js", newIndexJsFileName);
  const destHTML = Bun.file(`${globalThis.dirs.dest}/index.html`);
  await Bun.write(destHTML, htmlContent);
}

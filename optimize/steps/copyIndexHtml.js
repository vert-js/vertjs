/* eslint-disable no-undef */
export default async function copyIndexHtml(bundles) {
  const srcHTML = Bun.file(`${globalThis.dirs.src}/index.html`);
  let htmlContent = await srcHTML.text();
  const indexjs = bundles.outputs.shift();
  htmlContent = htmlContent.replace(
    "index.js",
    indexjs.path.substring(indexjs.path.lastIndexOf("/"))
  );
  const css = [];
  bundles.outputs.forEach((output) => {
    const path = output.path.substring(output.path.lastIndexOf("/"));
    if (path.endsWith(".css")) {
      css.push(path);
    }
  });
  htmlContent = htmlContent.replace(
    "</head>",
    `${css
      .map((c) => `<link rel="stylesheet" type="text/css" href="${c}" />`)
      .join("")}</head>`
  );
  const destHTML = Bun.file(`${globalThis.dirs.dest}/index.html`);
  await Bun.write(destHTML, htmlContent);
}

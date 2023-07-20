/* eslint-disable no-undef */
export default async function copyIndexHtml(JSbundles, CSSbundles) {
  const srcHTML = Bun.file(`${globalThis.dirs.src}/index.html`);
  let htmlContent = await srcHTML.text();
  const indexjs = JSbundles.outputs.shift();
  htmlContent = htmlContent.replace(
    "index.js",
    indexjs.path.substring(indexjs.path.lastIndexOf("/"))
  );
  const indexcss = CSSbundles.shift();
  htmlContent = htmlContent.replace(
    "index.css",
    indexcss.substring(indexcss.lastIndexOf("/"))
  );
  htmlContent = htmlContent.replace(
    "</body>",
    `<script>
const socket = new WebSocket("ws://localhost:${Bun.env.PORT || 1337}/reload");
  socket.addEventListener("message", event => {
    window.location.reload();
  })</script></body>`
  );
  const destHTML = Bun.file(`${globalThis.dirs.dest}/index.html`);
  await Bun.write(destHTML, htmlContent);
}

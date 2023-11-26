/* eslint-disable no-undef */
const replaceAsync = async (str, regex, asyncFn) => {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
};

const parseCSS = async (content) =>
  replaceAsync(content, /^@import url\(([^)]*)\);$/gm, async (_, p1) => {
    let cnt;
    if (p1.startsWith("http")) {
      cnt = Bun.file(p1);
    } else {
      cnt = Bun.file(`${globalThis.dirs.src}/${p1}`);
    }
    if (cnt.size) {
      return cnt.text();
    }
    return "";
  });

export default async function cssBundler() {
  const indexcss = Bun.file(`${globalThis.dirs.src}/index.css`);
  const files = [];
  if (indexcss.size) {
    const content = await parseCSS(await indexcss.text());
    const destFile = `${globalThis.dirs.dest}/index-${Bun.hash(content)}.css`;
    Bun.write(destFile, content);
    files.push(destFile);
  }
  return files;
}

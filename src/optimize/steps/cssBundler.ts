/* eslint-disable no-undef */
const replaceAsync = async (str: string, regex: RegExp, asyncFn: Function) => {
  const promises: any[] = [];
  str.replace(regex, (match: string, ...args: any[]): string => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
    return "";
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
};

const parseCSS = async (content: string, srcPath: string) =>
  replaceAsync(
    content,
    /^@import url\(([^)]*)\);$/gm,
    async (_: unknown, p1: string) => {
      let cnt;
      if (p1.startsWith("http")) {
        cnt = Bun.file(p1);
      } else {
        cnt = Bun.file(`${srcPath}/${p1}`);
      }
      if (cnt.size) {
        return cnt.text();
      }
      return "";
    }
  );

export default async function cssBundler(
  srcPath: string,
  distPath: string
): Promise<string[]> {
  const indexcss = Bun.file(`${srcPath}/main.css`);
  const files: string[] = [];
  if (indexcss.size) {
    const content = await parseCSS(await indexcss.text(), srcPath);
    const destFile = `${distPath}/public/main-${Bun.hash(content)}.css`;
    Bun.write(destFile, content);
    files.push(destFile);
  }
  return files;
}

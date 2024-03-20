import recurseDir from "utils/recurseDir";

const { log } = console;

export default async function prepare(path: string): Promise<boolean> {
  const root = Bun.file(`${path}/root.ts`);
  if (!(await root.exists())) {
    log(`🔥 no x1b[1m\x1b[32mroot.ts\x1b[0m found!`);
    return false;
  }
  const components = recurseDir(`${path}/components`)
    .map((c) => `await import('${c.replace(path, ".")}');`)
    .join("");
  // await Bun.write(`${path}/root.ts`, `${components}${await root.text()}`);
  return true;
}

import { readdirSync } from "fs";

export default function calcFinalSize() {
  const files = readdirSync(globalThis.dirs.dist);
  files.forEach((file) => {
    // eslint-disable-next-line no-undef
    globalThis.sizes.final += Bun.file(`${globalThis.dirs.dist}/${file}`).size;
  });
}

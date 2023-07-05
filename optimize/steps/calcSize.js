import { readdirSync } from "fs";

export default function calcSize(dir) {
  const files = readdirSync(dir);
  let size = 0;
  files.forEach((file) => {
    // eslint-disable-next-line no-undef
    size += Bun.file(`${dir}/${file}`).size;
  });
  return size;
}

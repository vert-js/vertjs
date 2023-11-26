import { readdirSync } from "fs";

const recurseDir = (dir) => {
  let size = 0;
  const files = readdirSync(dir, {
    withFileTypes: true,
  });
  for (let i = 0; i < files.length; i += 1) {
    if (files[i].isFile()) {
      // eslint-disable-next-line no-undef
      size += Bun.file(`${dir}/${files[i].name}`).size;
    } else size += recurseDir(`${dir}/${files[i].name}`);
  }
  return size;
};

export default function calcSize(dir) {
  return recurseDir(dir);
}

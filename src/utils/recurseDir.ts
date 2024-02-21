import { readdirSync } from "fs";

export default function recurseDir(dir: string): string[] {
  const entries = readdirSync(dir, {
    withFileTypes: true,
  });
  const files: string[] = [];
  for (let i = 0; i < entries.length; i += 1) {
    if (entries[i].isFile()) {
      files.push(`${dir}/${entries[i].name}`);
    } else files.push(...recurseDir(`${dir}/${entries[i].name}`));
  }
  return files;
}

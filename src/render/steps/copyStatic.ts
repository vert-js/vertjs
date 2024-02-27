/* eslint-disable no-undef */
import path from "path";
import { readdirSync, lstatSync, mkdirSync } from "fs";
import truncate from "utils/truncate";

export default function copyStatic(from: string, to: string): string {
  return readdirSync(from)
    .map((element) => {
      if (lstatSync(path.join(from, element)).isFile()) {
        const input = Bun.file(`${from}/${element}`);
        const output = Bun.file(`${to}/${element}`);
        mkdirSync(to, {
          recursive: true,
        });
        Bun.write(output, input);
        return `\t${truncate(`${from}/${element}`)}`;
      }
      return copyStatic(path.join(from, element), path.join(to, element));
    })
    .join("\n");
}

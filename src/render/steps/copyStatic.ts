/* eslint-disable no-undef */
import path from "path";
import { readdirSync, lstatSync, mkdirSync } from "fs";
import truncate from "utils/truncate";

export default function copyStatic(
  from: string,
  to: string,
  dist: string,
): string {
  return readdirSync(from)
    .map((element) => {
      if (lstatSync(path.join(from, element)).isFile()) {
        const input = Bun.file(`${from}/${element}`);
        const newTo = to.replace(
          dist,
          `${dist}${element.endsWith(".nopublic") ? "" : "/public"}`,
        );
        const output = Bun.file(
          `${newTo}/${element.replace(/\.nopublic$/g, "")}`,
        );
        mkdirSync(newTo, {
          recursive: true,
        });
        Bun.write(output, input);
        return `\t${truncate(`${from}/${element}`, 50, "start")}`;
      }
      return copyStatic(path.join(from, element), path.join(to, element), dist);
    })
    .join("\n");
}

/* eslint-disable no-console */
import { readdirSync } from "fs";
import htmlMinifier from "./minifier/html";

export default function transformSrc() {
  try {
    const files = readdirSync("src");
    files.forEach(async (file) => {
      const extension = file.split(".").pop();
      if (extension === "html") {
        // eslint-disable-next-line no-undef
        await Bun.write(`./dist/${file}`, await htmlMinifier(file));
        console.log(`🗜️  ${file} done`);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

/* eslint-disable no-console */
/* eslint-disable no-undef */
import { readdirSync } from "fs";
import cssMinifier from "../minifier/css";
import htmlMinifier from "../minifier/html";

const transformFile = (file) =>
  new Promise((resolve) => {
    const extension = file.split(".").pop();
    const theFile = Bun.file(`./${file}`);
    theFile.text().then((text) => {
      let content = text;
      switch (extension) {
        case "xml":
          content = htmlMinifier(content);
          break;
        case "html":
          content = htmlMinifier(content);
          break;
        case "css":
          content = cssMinifier(content);
          break;
        default:
          break;
      }
      Bun.write(theFile, content).then(() => {
        resolve(`🗜️  ${file}`);
      });
    });
  });

const recurseDir = async (dir) =>
  new Promise((resolve, reject) => {
    try {
      const files = readdirSync(dir, {
        withFileTypes: true,
      });
      const promises = [];
      for (let i = 0; i < files.length; i += 1) {
        if (files[i].isFile()) {
          promises.push(transformFile(`${dir}/${files[i].name}`));
        } else promises.push(recurseDir(`${dir}/${files[i].name}`));
      }
      Promise.all(promises).then((logs) => {
        console.log(logs.join("\n"));
        resolve();
      });
    } catch (e) {
      console.log(e);
      reject();
    }
  });

export default async function optimize() {
  await recurseDir(globalThis.dirs.dest);
}

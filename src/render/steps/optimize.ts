/* eslint-disable no-undef */
import humanFileSize from "utils/human";
import truncate from "utils/truncate";
import recurseDir from "utils/recurseDir";
import xmlMinifier from "../minifier/xml";
import svgMinifier from "../minifier/svg";
import jsonMinifier from "../minifier/json";
import type { RenderTransformation } from "../Render.types";

const transformFile = async (file: string): Promise<RenderTransformation> =>
  new Promise((resolve) => {
    const extension = file.split(".").pop();
    const theFile = Bun.file(file);
    const { size } = theFile;
    theFile.text().then((text: string) => {
      let content = text;
      switch (extension) {
        case "xml":
          content = xmlMinifier(content);
          break;
        case "svg":
          content = svgMinifier(content);
          break;
        case "json":
          content = jsonMinifier(content);
          break;
        default:
          break;
      }
      Bun.write(theFile, content).then((newSize) => {
        resolve({
          file: truncate(file),
          original: humanFileSize(size),
          final: humanFileSize(newSize),
        });
      });
    });
  });

const optimize = async (distPath: string): Promise<RenderTransformation[]> =>
  Promise.all(recurseDir(distPath).map((file) => transformFile(file)));

export default optimize;

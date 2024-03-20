import puppeteer from "puppeteer";
import { brotliCompress, gzip, deflate } from "zlib";
import { getEcoindex, type ecoIndexType } from "../utils/ecoIndex";
import loadEnv from "../utils/loadEnv";
import type { VertJsEnv } from "../types";

const { log, table } = console;

export default async function EcoIndex(path: string): Promise<ecoIndexType> {
  const env: VertJsEnv = await loadEnv(path);
  const url = `http${env.HTTPS === "true" ? "s" : ""}://${env.HOST}:${env.PORT}`;

  const browser = await puppeteer.launch({
    args: ["disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  // get number of external requests
  let req = 0;
  await page.on("request", (request) => {
    if (!request.url().startsWith("data:")) req += 1;
  });

  // get total uncompressed size
  let size = 0;
  await page.on("response", (response) => {
    if (response.ok()) {
      switch (response.headers()["content-encoding"]) {
        case "br":
          response.buffer().then((buffer) => {
            brotliCompress(buffer, (_, result) => {
              size += result.length;
            });
          });
          break;
        case "gzip":
          response.buffer().then((buffer) => {
            gzip(buffer, (_, result) => {
              size += result.length;
            });
          });
          break;
        case "deflate":
          response.buffer().then((buffer) => {
            deflate(buffer, (_, result) => {
              size += result.length;
            });
          });
          break;
        default:
          response.buffer().then((buffer) => {
            size += buffer.length;
          });
          break;
      }
    }
  });

  log(`Calculate ecoIndex for: ${url}`);

  await page.goto(url);

  // get number of DOM elements
  const dom: number = await page.evaluate(
    () => document.querySelectorAll("*").length,
  );

  await browser.close();

  const eco = getEcoindex(dom, req, Math.round(size / 1024));

  log("Results:");
  table({
    "💚": `${eco.score} %`,
    "🎓": eco.grade,
    "💨": `${eco.ghg} gCO2e`,
    "🚰": `${eco.water} cL`,
  });
}

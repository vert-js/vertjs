import puppeteer from "puppeteer";
import { brotliCompress, gzip, deflate } from "zlib";
import { getEcoindex } from "../utils/ecoIndex";
import loadEnv from "../utils/loadEnv";
import humanFileSize from "../utils/human";
import type { VertJsEnv } from "../types";

const { log, table } = console;

const colorizeNumeric = (value: string): string =>
  value.replace(/(\d+)(\.\d+)?/g, "\u001b[33m$1$2\u001b[0m");

const joliGrade = (value: string): string => {
  let color = "";
  switch (value) {
    case "A":
      color = "42;1";
      break;
    case "B":
      color = "42";
      break;
    case "C":
      color = "43;1";
      break;
    case "D":
      color = "43";
      break;
    case "E":
      color = "41";
      break;
    case "F":
    default:
      color = "41;1";
      break;
  }
  return `\u001b[${color};1m ${value} \u001b[0m`;
};

export async function EcoIndexPage(url: string): Promise<void> {
  const browser = await puppeteer.launch({
    headless: true,
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
    "Score 💚": colorizeNumeric(`${eco.score}%`),
    "Grade 🎓": joliGrade(eco.grade),
    "Gas Emission 💨": colorizeNumeric(`${eco.ghg}gCO2e`),
    "Water Consumption 🚰": colorizeNumeric(`${eco.water}cL`),
    "Requests 🌐": colorizeNumeric(`${req}`),
    "Weight 📦": colorizeNumeric(humanFileSize(size)),
    "Dom Elements 📚": colorizeNumeric(`${dom}`),
  });
}

export default async function EcoIndex(path: string): Promise<void> {
  const env: VertJsEnv = await loadEnv(path);
  const url = `http${env.HTTPS === "true" ? "s" : ""}://${env.HOST}:${env.PORT}`;

  await EcoIndexPage(url);
}

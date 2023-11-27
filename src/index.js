#!/usr/bin/env bun
import dotenv from "dotenv";
import Server from "./server/Server";
import Optimize from "./optimize/Optimize";

let command = "serve";
let path = ".";

if (Bun.argv.length === 3) path = Bun.argv[2];
if (Bun.argv.length === 4) {
  command = Bun.argv[2].toLowerCase();
  path = Bun.argv[3];
}

globalThis.path = `${process.cwd()}/${path}`;

const loadEnv = async () => {
  const envFile = Bun.file(`${globalThis.path}/.env`);
  if (envFile.size !== 0) {
    return dotenv.parse(await envFile.text());
  }
  return {};
};

globalThis.env = await loadEnv();

if (command === "serve") Server.start();
else if (command === "optimize") Optimize.optim();

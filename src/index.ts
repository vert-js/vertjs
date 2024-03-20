#!/usr/bin/env bun
import { program } from "commander";
import FakeConsole from "./utils/FakeConsole";
import Render from "./render/Render";
import Server from "./server/Server";
import packagejson from "../package.json";
import EcoIndex from "./ecoindex/EcoIndex";

program.name(packagejson.name).version(packagejson.version, "-v");
program
  .command("serve")
  .argument("[path]", "path", ".")
  .action(async (path) => {
    await Server(`${process.cwd()}/${path}`);
  });

program
  .command("render")
  .argument("[path]", "path", ".")
  .option("-vv, --verbose", "verbose mode", false)
  .action((path, options) => {
    Render(`${process.cwd()}/${path}`, options.verbose ? console : FakeConsole);
  });

program
  .command("ecoindex")
  .argument("[path]", "path", ".")
  .action(async (path) => {
    try {
      await EcoIndex(`${process.cwd()}/${path}`);
    } catch (_) {
      // sometimes puppeteer fails to launch, so we just ignore it
      await EcoIndex(`${process.cwd()}/${path}`);
    }
  });

program.parse();

#!/usr/bin/env bun
import { program } from "commander";
import Render from "./render/Render";
import Server from "./server/Server";
import packagejson from "../package.json";
import FakeConsole from "utils/FakeConsole";

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

program.parse();

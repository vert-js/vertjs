#!/usr/bin/env bun
import { program } from "commander";
import { Server } from "./server/Server";
import Optimize from "./optimize/Optimize";
import packagejson from "../package.json";

program.name(packagejson.name).version(packagejson.version, "-v");
program
  .command("serve")
  .argument("[path]", "path", ".")
  .action(async (path) => {
    await Server(`${process.cwd()}/${path}`);
  });

program
  .command("optimize")
  .argument("[path]", "path", ".")
  .action((path) => {
    Optimize.optim(`${process.cwd()}/${path}`);
  });

program.parse();

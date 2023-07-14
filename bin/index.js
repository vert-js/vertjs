#!/usr/bin/env bun
/* eslint-disable no-console */
import { program } from "commander";
import { watch } from "fs";
import Server from "../server/Server";
import Optimize from "../optimize/Optimize";

program.description("A green-it framework").action(() => {
  console.log("🌱 VertJS");

  Optimize.optim().then(() => {
    Server.start();
  });

  watch(globalThis.dirs.src, { recursive: true }, (eventType, filename) => {
    console.log(`♻️  ${filename} is ${eventType}`);
    Optimize.optim().then(() => {
      Server.reload();
    });
  });
});
program.parse();

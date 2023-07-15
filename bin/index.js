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

  const dirs = [globalThis.dirs.src];
  const watcher = (eventType, filename) => {
    console.log(`♻️  ${filename} is ${eventType}`);
    Optimize.optim().then(() => {
      Server.reload();
    });
  };

  dirs.forEach((d) => {
    watch(d, { recursive: true }, watcher);
  });
});
program.parse();

#!/usr/bin/env bun
import { program } from "commander";
import Server from "../server/Server";
import Optimize from "../optimize/Optimize";

program.description("A green-it framework").action(() => {
  console.log("🌱 VertJS");

  Optimize.optim().then(() => {
    Server.start();
  });
});
program.parse();

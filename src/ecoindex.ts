#!/usr/bin/env bun
import { program } from "commander";
import { EcoIndexPage } from "ecoindex/EcoIndex";

program.argument("[url]").action(async (url) => {
  await EcoIndexPage(url);
});

program.parse();

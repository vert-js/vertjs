import { parse } from "dotenv";
import type { VertJsEnv } from "types";

export default async function loadEnv(path: string): Promise<VertJsEnv> {
  const envFile = Bun.file(`${path}/.env`);
  const defaults = {
    SRC: "src",
    STATIC: "static",
    DIST: "dist",
    HOST: "localhost",
    PORT: "1312",
    STATIC_HOST: "localhost",
    STATIC_PORT: "1982",
    HTTPS: "false",
  };
  if (envFile.size !== 0) {
    const content = await envFile.text();
    return {
      ...defaults,
      ...parse(content),
    };
  }
  return defaults;
}

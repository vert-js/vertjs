import { parse } from "dotenv";

export default async function loadEnv(path: string) {
  const envFile = Bun.file(`${path}/.env`);
  if (envFile.size !== 0) {
    const content = await envFile.text();
    return {
      SRC: "src",
      STATIC: "static",
      DIST: "dist",
      HOST: "localhost",
      PORT: "1312",
      STATIC_HOST: "localhost",
      STATIC_PORT: "1982",
      HTTPS: "false",
      ...parse(content),
    };
  }
  return {};
}

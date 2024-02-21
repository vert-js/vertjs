import { parse } from "dotenv";

export default async function loadEnv(path: string) {
  const envFile = Bun.file(`${path}/.env`);
  if (envFile.size !== 0) {
    const content = await envFile.text();
    return parse(content);
  }
  return {};
}

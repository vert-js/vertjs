import { parse } from "dotenv";

export const loadEnv = async (path: string): Promise<object> => {
  const envFile = Bun.file(`${path}/.env`);
  if (envFile.size !== 0) {
    return parse(await envFile.text());
  }
  return new Promise((resolve) => resolve({}));
};

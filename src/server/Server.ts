/* eslint-disable no-undef */
import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { etag } from "@bogeychan/elysia-etag";
import { existsSync } from "fs";
import { autoroutes } from "elysia-autoroutes";
import loadEnv from "utils/loadEnv";
import type { ServerEnv } from "./Server.types";

export default async function Server(path: string) {
  const env: ServerEnv = (await loadEnv(path)) as ServerEnv;
  const app = new Elysia({
    name: "🌱 VertJS",
  })
    .use(
      staticPlugin({
        assets: `${path}/public`,
      }),
    )
    .use(etag());
  if (existsSync(`${path}/routes`)) {
    app.use(autoroutes({ routesDir: `${path}/routes` }));
  }
  app
    .ws("/", {
      open(ws) {
        ws.subscribe("vertjs");
      },
      message(ws, message) {
        ws.publish("vertjs", message);
      },
      close(ws) {
        ws.unsubscribe("vertjs");
      },
    })
    .get("/", () => Bun.file(`${path}/index.html`))
    .listen(
      env.HTTPS === "true"
        ? {
            hostname: env.HOST ?? "localhost",
            port: env.PORT ?? 1312,
            keyFile: env.KEY,
            certFile: env.CERT,
            passphrase: env.PASSPHRASE,
          }
        : {
            hostname: env.HOST ?? "localhost",
            port: env.PORT ?? 1312,
          },
    );

  // eslint-disable-next-line no-console
  console.log(
    "🌱 is listening on \x1b[32m%s\x1b[0m",
    `http${env.HTTPS === "true" ? "s" : ""}://${app.server?.hostname}:${
      app.server?.port
    }`,
  );
}

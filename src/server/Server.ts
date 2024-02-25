/* eslint-disable no-undef */
import { Elysia } from "elysia";
import { etag } from "@bogeychan/elysia-etag";
import { existsSync } from "fs";
import { autoroutes } from "elysia-autoroutes";
import { cors } from "@elysiajs/cors";
import { compression } from "elysia-compression";
import loadEnv from "utils/loadEnv";
import type { VertJsEnv } from "types";

const { log } = console;

export default async function Server(path: string) {
  const env: VertJsEnv = (await loadEnv(path)) as VertJsEnv;
  const app = new Elysia({
    name: "🌱 VertJS",
  }).use(etag());
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
    .get("/*", ({ params }) => Bun.file(`${path}/${params["*"]}`))
    .listen(
      env.HTTPS === "true"
        ? {
            hostname: env.HOST,
            port: env.PORT,
            keyFile: env.KEY,
            certFile: env.CERT,
            passphrase: env.PASSPHRASE,
          }
        : {
            hostname: env.HOST,
            port: env.PORT,
          },
    );

  log(
    "🌱 is listening on \x1b[32m%s\x1b[0m",
    `http${env.HTTPS === "true" ? "s" : ""}://${app.server?.hostname}:${
      app.server?.port
    }`,
  );

  if (env.STATIC_HOST && env.STATIC_PORT) {
    const staticApp = new Elysia({
      name: "🌱 VertJS",
    })
      .use(cors())
      //.use(compression({ type: "gzip" }))
      .get("/*", ({ params }) => Bun.file(`${path}/public/${params["*"]}`))
      .listen(
        env.HTTPS === "true"
          ? {
              hostname: env.STATIC_HOST,
              port: env.STATIC_PORT,
              keyFile: env.KEY,
              certFile: env.CERT,
              passphrase: env.PASSPHRASE,
            }
          : {
              hostname: env.STATIC_HOST,
              port: env.STATIC_PORT,
            },
      );

    log(
      "🌱 is listening on \x1b[32m%s\x1b[0m (static)",
      `http${env.HTTPS === "true" ? "s" : ""}://${staticApp.server?.hostname}:${
        staticApp.server?.port
      }`,
    );
  }
}

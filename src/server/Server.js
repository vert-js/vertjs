/* eslint-disable no-undef */
import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { etag } from "@bogeychan/elysia-etag";
export default class Server {
  static start() {
    const options = {
      hostname: globalThis.env.HOST ?? "localhost",
      port: globalThis.env.PORT ?? 1312,
    };
    if (globalThis.env.HTTPS === "true") {
      options.tls = {
        key: Bun.file(globalThis.env.KEY),
        cert: Bun.file(globalThis.env.CERT),
        passphrase: globalThis.env.PASSPHRASE
          ? Bun.file(globalThis.env.PASSPHRASE)
          : "",
      };
    }
    const app = new Elysia()
      .use(
        staticPlugin({
          assets: `${globalThis.path}/${globalThis.env.DEST ?? "dest"}/public`,
        })
      )
      .use(etag())
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
      .get("/", () =>
        Bun.file(
          `${globalThis.path}/${globalThis.env.DEST ?? "dest"}/index.html`
        )
      )
      .listen(options);

    // eslint-disable-next-line no-console
    console.log(
      "🌱 is listening on \x1b[32m%s\x1b[0m",
      `http${options.tls ? "s" : ""}://${app.server?.hostname}:${
        app.server?.port
      }`
    );
  }
}

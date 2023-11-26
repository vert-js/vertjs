/* eslint-disable no-undef */
export default class Server {
  static start() {
    const options = {
      development: globalThis.env.development || false,
      hostname: globalThis.env.hostname || "localhost",
      port: globalThis.env.PORT || 1312,
      fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/")
          return new Response(Bun.file(`${globalThis.path}/index.html`));
        const file = Bun.file(`${globalThis.path}/${url.pathname}`);
        if (file.size !== 0) return new Response(file);
        return new Response(`404!`);
      },
    };
    if (globalThis.env.HTTPS === "true") {
      options.tls = {
        key: Bun.file(globalThis.env.KEY),
        cert: Bun.file(globalThis.env.CERT),
      };
    }
    if (globalThis.env.WS === "true") {
      options.websocket = {
        open(ws) {
          ws.subscribe("vertjs");
        },
        message(ws, message) {
          ws.publish("vertjs", message);
        },
        close(ws) {
          ws.unsubscribe("vertjs");
        },
      };
    }
    globalThis.server = Bun.serve(options);
    // eslint-disable-next-line no-console
    console.log(
      "🌱 is listening on \x1b[32m%s\x1b[0m",
      `http${globalThis.env.HTTPS === "true" ? "s" : ""}://${
        globalThis.server.hostname
      }${
        globalThis.server.port !== 80 && globalThis.server.port !== 443
          ? `:${globalThis.server.port}`
          : ""
      }`
    );
  }

  static reload() {
    globalThis.server.publish("vertjs", { message: "reload" });
  }
}

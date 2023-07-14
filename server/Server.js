/* eslint-disable no-undef */
export default class Server {
  static start() {
    // eslint-disable-next-line no-undef
    globalThis.server = Bun.serve({
      development: Bun.env.development || false,
      hostname: Bun.env.hostname || "localhost",
      port: Bun.env.PORT || 1337,
      fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/reload") {
          const success = globalThis.server.upgrade(req);
          return success
            ? undefined
            : new Response("WebSocket upgrade error", { status: 400 });
        }
        if (url.pathname === "/")
          return new Response(Bun.file("./dist/index.html"));
        const file = Bun.file(`./dist${url.pathname}`);
        if (file.size !== 0) return new Response(file);
        return new Response(`404!`);
      },
      websocket: {
        open(ws) {
          ws.subscribe("vertjs-livereload");
        },
        message(ws, message) {
          ws.publish("vertjs-livereload", message);
        },
        close(ws) {
          ws.unsubscribe("vertjs-livereload");
        },
      },
    });
    // eslint-disable-next-line no-console
    console.log(
      "🌱 is listening on \x1b[32m%s\x1b[0m",
      `http://${globalThis.server.hostname}:${globalThis.server.port}`
    );
  }

  static reload() {
    globalThis.server.publish("vertjs-livereload", { message: "reload" });
  }
}

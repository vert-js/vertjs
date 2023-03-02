"bun run --hot serve.js";
export default class Server {
  static start() {
    // eslint-disable-next-line no-undef
    globalThis.server = Bun.serve({
      // eslint-disable-next-line no-undef
      port: Bun.env.PORT || 1337,
      fetch() {
        // eslint-disable-next-line no-undef
        return new Response(Bun.file("./dist/index.html"));
      },
    });
    // eslint-disable-next-line no-console
    console.log(
      "🌱 is listening on \x1b[32m%s\x1b[0m",
      `http://localhost:${globalThis.server.port}`
    );
  }
}

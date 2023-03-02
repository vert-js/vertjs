export default class Server {
  static start() {
    // eslint-disable-next-line no-undef
    globalThis.server = Bun.serve({
      // eslint-disable-next-line no-undef
      port: Bun.env.PORT || 1337,
      fetch() {
        return new Response("Bun!");
      },
    });
    // eslint-disable-next-line no-console
    console.log(
      "🌱 is listening on \x1b[32m%s\x1b[0m",
      `http://localhost:${server.port}`
    );
  }
}

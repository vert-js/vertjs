/* eslint-disable no-undef */
import { readdirSync } from "fs";

export default function copyPublic() {
  try {
    const files = readdirSync("public");
    files.forEach(async (file) => {
      await Bun.write(Bun.file(`./dist/${file}`), Bun.file(`./public/${file}`));
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

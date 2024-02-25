import { renameSync, mkdirSync } from "fs";
import { dirname } from "path";
import recurseDir from "utils/recurseDir";
import truncate from "utils/truncate";
import type { RenderOrganization } from "render/Render.types";
import type { VertJsEnv } from "types";

export default async function organize(
  distPath: string,
  env: VertJsEnv,
): Promise<RenderOrganization[]> {
  const files: RenderOrganization[] = [];
  const assets: string[] = [];
  const htmls: string[] = [];
  recurseDir(distPath).forEach((file) => {
    if (!file.endsWith(".html")) {
      mkdirSync(dirname(file.replace(distPath, `${distPath}/public`)), {
        recursive: true,
      });
      renameSync(file, file.replace(distPath, `${distPath}/public`));
      files.push({
        file: truncate(file, 50, "start"),
        action: "moved",
      });
      assets.push(file.replace(distPath, ""));
    } else htmls.push(file);
  });
  if (env.STATIC_HOST) {
    const promises: any[] = [];
    htmls.forEach((html) => {
      promises.push(
        new Promise((resolve) => {
          Bun.file(html)
            .text()
            .then((content) => {
              let text = content;
              assets.forEach((asset) => {
                text = text.replaceAll(
                  `".${asset}"`,
                  `"//${env.STATIC_HOST}${asset}"`,
                );
              });
              Bun.write(html, text);
              resolve("");
            });
        }),
      );
    });
    await Promise.all(promises);
  }
  return files;
}

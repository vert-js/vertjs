import { renameSync, mkdirSync, statSync, readdirSync, rmdirSync } from "fs";
import { dirname, join } from "path";
import recurseDir from "utils/recurseDir";
import truncate from "utils/truncate";
import type { RenderOrganization } from "render/Render.types";
import type { VertJsEnv } from "types";

type OrganizationFiles = {
  files: RenderOrganization[];
  assets: string[];
  htmls: string[];
};

const move = (distPath: string): OrganizationFiles => {
  const files: RenderOrganization[] = [];
  const assets: string[] = [];
  const htmls: string[] = [];
  recurseDir(distPath).forEach((file) => {
    if (!file.endsWith(".html")) {
      if (file.indexOf(`.nopublic`) === -1) {
        mkdirSync(dirname(file.replace(distPath, `${distPath}/public`)), {
          recursive: true,
        });
        renameSync(file, file.replace(distPath, `${distPath}/public`));
        files.push({
          file: truncate(file, 50, "start"),
          action: "moved",
        });
        assets.push(file.replace(distPath, ""));
      } else {
        renameSync(file, file.replace(".nopublic", ""));
        assets.push(file.replace(`.nopublic`, ""));
      }
    } else htmls.push(file);
  });
  return {
    files,
    assets,
    htmls,
  };
};

const replace = async (htmls: string[], assets: string[], env: VertJsEnv) => {
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
                `"//${env.STATIC_HOST}${env.STATIC_PORT ? `:${env.STATIC_PORT}` : ""}${asset}"`,
              );
            });
            Bun.write(html, text);
            resolve("");
          });
      }),
    );
  });
  await Promise.all(promises);
};

const cleanEmptyFolders = (folder: string) => {
  const isDir = statSync(folder).isDirectory();
  if (!isDir) {
    return;
  }
  let files = readdirSync(folder);
  if (files.length > 0) {
    files.forEach((file) => {
      cleanEmptyFolders(join(folder, file));
    });

    // re-evaluate files; after deleting subfolder
    // we may have parent folder empty now
    files = readdirSync(folder);
  }

  if (files.length === 0) {
    rmdirSync(folder);
  }
};

export default async function organize(
  distPath: string,
  env: VertJsEnv,
): Promise<RenderOrganization[]> {
  const { files, htmls, assets } = move(distPath);
  if (env.STATIC_HOST) {
    await replace(htmls, assets, env);
  }
  cleanEmptyFolders(distPath);
  return files;
}

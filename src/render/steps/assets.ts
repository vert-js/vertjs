import recurseDir from "utils/recurseDir";

export default function assets(distPath: string): string[] {
  const files = recurseDir(distPath);
  console.log(files);
  return files;
}

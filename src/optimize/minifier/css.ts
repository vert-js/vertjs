// eslint-disable-next-line import/no-extraneous-dependencies
import { transform } from "lightningcss";

export default function cssMinifier(content: string) {
  const { code } = transform({
    code: Buffer.from(content),
    minify: true,
    sourceMap: false,
    filename: "",
  });
  return code;
}

// eslint-disable-next-line import/no-extraneous-dependencies
import { transform } from "lightningcss";

export default function cssMinifier(content) {
  const { code } = transform({
    code: Buffer.from(content),
    minify: true,
    sourceforEach: false,
  });
  return code;
}

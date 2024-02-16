import { optimize } from "svgo";

export default function svgMinifier(content: string) {
  return optimize(content, {
    multipass: true,
  }).data;
}

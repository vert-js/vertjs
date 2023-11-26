import { optimize } from "svgo";

export default function svgMinifier(content) {
  return optimize(content, {
    multipass: true,
  }).data;
}

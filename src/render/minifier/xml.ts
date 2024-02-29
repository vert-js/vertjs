import minifyXML from "minify-xml";

export default function htmlMinifier(content: string): string {
  return minifyXML(content);
}

import jsonminify from "jsonminify";

export default function jsonMinifier(content: string) {
  return jsonminify(content);
}

export default function truncate(
  str: string,
  maxLength: number = 42,
  location = "start",
): string {
  if (str.length <= maxLength) {
    return str;
  }

  const partLength = Math.ceil((maxLength - 3) / 2);
  let startStr;
  let endStr;

  switch (location) {
    case "start":
      endStr = str.substring(str.length - maxLength + 3);
      return `...${endStr}`;
    case "end":
      startStr = str.substring(0, maxLength - 3);
      return `${startStr}...`;
    case "middle":
    default:
      startStr = str.substring(0, partLength);
      endStr = str.substring(str.length - partLength);
      return `${startStr}...${endStr}`;
  }
}

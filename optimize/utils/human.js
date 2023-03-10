export default function humanFileSize(bytes) {
  const thresh = 1024;
  let res = bytes;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} bytes`;
  }

  const units = ["kB", "MB"];
  let u = -1;
  const r = 10 ** 3;

  do {
    res /= thresh;
    u += 1;
  } while (Math.round(Math.abs(res) * r) / r >= thresh && u < units.length - 1);

  return `${res.toFixed(3)}${units[u]}`;
}

/*
Based on https://github.com/cnumr/ecoindex_node
*/

const domQuantiles = [
  0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076,
  1237, 1459, 1801, 2479, 594601,
];
const reqQuantiles = [
  0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170,
  205, 281, 3920,
];
const sizeQuantiles = [
  0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47,
  1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73,
  5400.08, 8037.54, 223212.26,
];

const calculateIndex = (quantiles: number[], value: number): number => {
  for (let i = 1; i < quantiles.length; i += 1) {
    if (value < quantiles[i]) {
      return (
        i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1])
      );
    }
  }
  return quantiles.length - 1;
};

const getScore = (dom: number, req: number, size: number): number => {
  const domIndex = calculateIndex(domQuantiles, dom);
  const reqIndex = calculateIndex(reqQuantiles, req);
  const sizeIndex = calculateIndex(sizeQuantiles, size);
  return Math.round(100 - (5 * (3 * domIndex + 2 * reqIndex + sizeIndex)) / 6);
};

const getGrade = (score: number): string => {
  switch (true) {
    case score >= 75:
      return "A";
    case score >= 65:
      return "B";
    case score >= 50:
      return "C";
    case score >= 35:
      return "D";
    case score >= 20:
      return "E";
    case score >= 5:
      return "F";
    default:
      return "G";
  }
};

const getGreenhouseGasEmission = (score: number): number =>
  Math.round(100 * (2 + (2 * (50 - score)) / 100)) / 100;

const getWaterConsumption = (score: number): number =>
  Math.round(100 * (3 + (3 * (50 - score)) / 100)) / 100;

export type ecoIndexType = {
  score: number;
  grade: string;
  ghg: number;
  water: number;
};

export const getEcoindex = (
  dom: number,
  req: number,
  size: number,
): ecoIndexType => {
  const score = getScore(dom, req, size);
  return {
    score,
    grade: getGrade(score),
    ghg: getGreenhouseGasEmission(score),
    water: getWaterConsumption(score),
  };
};

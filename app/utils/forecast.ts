import { linearRegression, linearRegressionLine } from "simple-statistics";

export const predictFuture = (data: { date: string; value: number }[], futureYears: number) => {
  const points = data.map((d) => [new Date(d.date).getFullYear(), d.value]);
  const regression = linearRegression(points);
  const predict = linearRegressionLine(regression);

  const futureData = [];
  for (let year = new Date().getFullYear() + 1; year <= new Date().getFullYear() + futureYears; year++) {
    futureData.push({ date: `${year}`, value: predict(year) });
  }

  return futureData;
};

const tzFile = await fetch("/timezones.tab")
  .then((res) => res.text())
  .then((data) => data);

export const timeZones = tzFile
  .split("\n")
  .filter((row) => !row.startsWith("#"))
  .map((row) => row.split("\t"))
  .map((x) => x[2])
  .filter((x) => x);

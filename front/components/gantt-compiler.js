import * as util from "./gantt-util";

const delimiter = ",";
export function compile(input) {
  let data = input.split(/[\r|\n|\r\n]/).filter(item => item.length > 0);
  return data.map(item => {
    const ary = item.split(delimiter);
    return {
      name: ary[0],
      start: util.getNewDate(ary[1], 0).getTime(),
      end: util.getNewDate(ary[2], 1).getTime()
    };
  });
}

function zeropad(str) {
  return ("00" + str).slice(-2);
}
function ymd(d) {
  return `${d.getFullYear()}-${zeropad(d.getMonth() + 1)}-${zeropad(
    d.getDate()
  )}`;
}
function ymdFromEpoc(epoc, offset) {
  let d = new Date(epoc);
  if (offset !== undefined) {
    d.setDate(d.getDate() + offset);
  }
  return ymd(d);
}

export function serialize(tasks) {
  return (
    tasks
      .map(item => {
        return `${item.name}${delimiter}${ymdFromEpoc(
          item.start
        )}${delimiter}${ymdFromEpoc(item.end, -1)}`;
      })
      .join("\n") + "\n"
  );
}

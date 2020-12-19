export function addDigitSeparator(num) {
  let digitString = num.toString();
  let tmp = [];
  digitString = digitString.split("").reverse();
  for (let i = 0; i < digitString.length; i += 1) {
    if ((i + 1) % 3 === 0) {
      tmp.push(digitString[i]);
      tmp.push(" ");
    } else {
      tmp.push(digitString[i]);
    }
  }

  return tmp.reverse().join("");
}

export function sliceZeros(num) {
  let casesString = `${num}`;
  let n = + num;

  if (n > 1000 && n < 1000000) {
    casesString = `${casesString.slice(0, -3)}k+`;
  } else if (n >= 1000000) {
    casesString = `${casesString.slice(0, -6)}M+`;
  }

  return casesString;
}
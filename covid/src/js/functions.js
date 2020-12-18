export function addDigitSeparator (num) {
    let digitString = num.toString();
    let tmp = [];
    digitString = digitString.split('').reverse();
    for (let i = 0; i < digitString.length; i += 1) {
        if ((i+1)%3 ===0) {
            tmp.push(digitString[i]);
            tmp.push(' ');
        } else {
            tmp.push(digitString[i]);
        }
    }

    return tmp.reverse().join('');
}
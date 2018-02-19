
const Test = require('chai');


const sortEmotions = (arr, order) => {
  const m = new Map([[':D', 4], [':)', 3], [':|', 2], [':(', 1], ['T_T', 0]]);
  return arr.sort((a, b) => (order) ? m.get(b) - m.get(a) : m.get(a) - m.get(b));
};

const consonantValue = s => {
  const a = "abcdefghijklmnopqrstuvwxyz".split('');
  const v = "aeiou".split('');
  const isVowel = n => v.includes(n);
  let x = 0;
  let max = 0;
  s.split('').forEach(el => {
    if (isVowel(el)) {
      if (x > max) { max = x; }
      x = 0;
    } else {
      x += a.indexOf(el) + 1
    }
  });
  return max;
};

function testStringMix() {
  Test.assert.equal(mixOld("Are they here", "yes, they are here"), "2:eeeee/2:yy/=:hh/=:rr")
  Test.assert.equal(mixOld("looping is fun but dangerous", "less dangerous than coding"), "1:ooo/1:uuu/2:sss/=:nnn/1:ii/2:aa/2:dd/2:ee/=:gg")
  Test.assert.equal(mixOld(" In many languages", " there's a pair of functions"), "1:aaa/1:nnn/1:gg/2:ee/2:ff/2:ii/2:oo/2:rr/2:ss/2:tt")
  Test.assert.equal(mixOld("Lords of the Fallen", "gamekult"), "1:ee/1:ll/1:oo")
  Test.assert.equal(mixOld("codewars", "codewars"), "")
  Test.assert.equal(mixOld("A generation must confront the looming ", "codewarrs"), "1:nnnnn/1:ooooo/1:tttt/1:eee/1:gg/1:ii/1:mm/=:rr")

}

function mix(s1, s2) {
  let counter = str => {
    return str.replace(/[a-zA-Z]+/i).split('').sort().reduce((sum, letter) => {
      sum[letter] = 1 + (sum[letter]||0);
      return sum;
    }, {});
  };
  s1 = counter(s1), s2 = counter(s2);

  // Create list of all characters to iterate over
  const allLetters = new Set(Object.keys(s1).concat(Object.keys(s2)));

  let r = []; let str = [0, 1, 2];
  allLetters.forEach((letter) => {
    let c1 = (s1[letter] || 0);
    let c2 = (s2[letter] || 0);
    let count = Math.max(c1, c2);
    if (count > 1) {
      r.push(`${(c1 === c2) ? '=' : count === c1 ? 1 : 2}:${letter.repeat(count)}`);
    }
  });
  return r.sort((a, b) => b.length - a.length ||  (a < b ? -1 : 1)).join('/');
}


function mixOld(s1, s2) {
  let s1occur = findLowercaseOccurances(s1, '1');
  let s2occur = findLowercaseOccurances(s2, '2');
  let s1joined = s1occur.concat(s2occur);
  let occurances = s1joined.sort((a, b) => b.amount - a.amount);
  let result = new Map();
  for (let i = 0; i < occurances.length; i++) {
    if (occurances[i].amount <= 1) { continue; }
    if (result.has(occurances[i].letter)) {
      const oldAmount = result.get(occurances[i].letter).amount;
      if (oldAmount === occurances[i].amount) {
        result.set(occurances[i].letter, { str: occurances[i].str, amount: occurances[i].amount, equal: true});
      } else if (oldAmount < occurances[i].amount) {
        result.set(occurances[i].letter, { str: occurances[i].str, amount: occurances[i].amount, equal: false});
      }
    } else {
      result.set(occurances[i].letter, { str: occurances[i].str, amount: occurances[i].amount, equal: false});
    }
  }
  // Sort string
  result = Array.from(result).sort((a, b) => {
    if (a[1].amount < b[1].amount) return 1;
    if (a[1].amount > b[1].amount) return -1;
    if (a[1].equal && !b[1].equal) return 1;
    if (!a[1].equal && b[1].equal) return -1;
    if (a[1].equal && b[1].equal) {
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      return 0;
    }
    if (`${a[1].str}:${a[0]}` > `${b[1].str}:${b[0]}`) return 1;
    if (`${a[1].str}:${a[0]}` < `${b[1].str}:${b[0]}`) return -1;
    return 0
  });

  // Format string
  let output = result.map(el => {
    return `${(el[1].equal) ? '=' : el[1].str}:${el[0].repeat(el[1].amount)}`;
  });

  console.log(s1occur, s2occur);

  return output.join('/');
}

let findLowercaseOccurances = str => {
  return str.replace(/[a-zA-Z]+/i).split('').sort().reduce((sum, letter) => {
    sum[letter] = 1 + (sum[letter]||0);
    return sum;
  }, {});
};

function romanNumeralEncoder(n) {
  const symbols = [
    { value: 1000, symbol: 'M'},
    { value: 900, symbol: 'CM'},
    { value: 500, symbol: 'D'},
    { value: 400, symbol: 'CD'},
    { value: 100, symbol: 'C'},
    { value: 90, symbol: 'XC'},
    { value: 50, symbol: 'L'},
    { value: 40, symbol: 'XL'},
    { value: 10, symbol: 'X'},
    { value: 9, symbol: 'IX'},
    { value: 5, symbol: 'V'},
    { value: 4, symbol: 'IV'},
    { value: 1, symbol: 'I'}
  ];

  let result = '';
  let sum = n;
  while (sum > 0) {
    for (let i = 0; i < symbols.length; i++) {
      if (sum >= symbols[i].value) {
        result += symbols[i].symbol;
        sum -= symbols[i].value;
        break;
      }
    }
  }
  return result;
}


function testToCsvText() {
  console.log(toCsvText([
    [ 0, 1, 2, 3, 45 ],
    [ 10,11,12,13,14 ],
    [ 20,21,22,23,24 ],
    [ 30,31,32,33,34 ]
   ] ), '0,1,2,3,45\n10,11,12,13,14\n20,21,22,23,24\n30,31,32,33,34');
}

let toCsvText = a => a.join('\n');

/**
 * Calculates the haversine distance between point A, and B.
 * @param {number[]} latlngA [lat, lng] point A
 * @param {number[]} latlngB [lat, lng] point B
 * @param {boolean} isMiles If we are using miles, else km.
 */
function haversineDistance(latlngA, latlngB) {
  function toRad(x) {
    return x * (Math.PI / 180); // for more precise, but slower estimation
    // return x * 0.0174533; // fast estimation
  }
  // const R = 6371; // earth radius in km
  const R = 3390; // mars radius in km
  const dLat = toRad(latlngB[1] - latlngA[1]);
  const dLatSin = Math.sin(dLat / 2);
  const dLon = toRad(latlngB[0] - latlngA[0]);
  const dLonSin = Math.sin(dLon / 2);

  const a = (dLatSin * dLatSin) +
            (Math.cos(toRad(latlngA[0])) * Math.cos(toRad(latlngB[0])) * dLonSin * dLonSin);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function dmsToLatLng(dms) {
  return dms.split(', ').map(el => el.split('° ')).map((arr) => {
    let amount = arr[0].split('.').map((val, i) => {
      val = Number(val);
      if (i === 1) { return val / 60; }
      if (i === 2) { return val / (60 * 60); }
      return val;
    }).reduce((prev, curr) => Number.parseFloat(prev + curr).toFixed(4));
    return amount * ((arr[1] === 'S' || arr[1] === 'W') ? -1 : 1);
  });
}

function calcHaversineDistance(lat1, lat2, lon1, lon2, R) {
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  const a = Math.pow(Math.sin(dlat / 2), 2) +
          Math.cos(lat1) *
          Math.cos(lat2) *
          Math.pow(Math.sin(dlon / 2), 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function saveMark(c1, c2) {
  function toRad(x) {
    return x * (Math.PI / 180); // for more precise, but slower estimation
    // return x * 0.0174533; // fast estimation
  }

  const pointC1 = dmsToLatLng(c1);
  const pointC2 = dmsToLatLng(c2);
  let distance = haversineDistance(pointC1, pointC2);
  distance = calcHaversineDistance(toRad(pointC1[0]), toRad(pointC1[1]), toRad(pointC2[0]), toRad(pointC2[1]), 3390);
  const distRounded = Math.round(distance / 10) * 10; // fine

  return `${distRounded}KM`;
}

function testSaveMark() {
  console.log(saveMark('48.23° N, 89.10° E', '48.84° N, 89.40° E'), '30KM');
  console.log(saveMark('52.10° S, 56.25° W', '52.10° N, 56.25° W'), '6160KM');
  console.log(saveMark('11.28° S, 78.98° E', '21.28° S, 75.56° E'), '620KM');
}

// fine
function testDMStoLatLng() {
  console.log('test1: ', dmsToLatLng('48.23° N, 89.10° E'), [48.38333333, 89.16666667]);
  console.log('test2: ', dmsToLatLng('48.84° N, 89.40° E'), [49.40000000, 89.66666667]);

  console.log('test3: ', dmsToLatLng('52.10° S, 56.25° W'), [-52.16666667, -56.41666667]);
  console.log('test4: ', dmsToLatLng('52.10° N, 56.25° W'), '');

  console.log('test5: ', dmsToLatLng('11.28° S, 78.98° E'), '');
  console.log('test6: ', dmsToLatLng('21.28° S, 75.56° E'), '');
}


class TreeNode {
  constructor(d) {
    this.data = d;
    this.childrenAmount = 0;
    this.parent = undefined;
    this.left = undefined;
    this.right = undefined;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = undefined;
  }

  add(data, node) {
    // If not at root
    let temp = node;
    let childrenCount = 0;
    while (temp.parent !== undefined) {
      childrenCount += temp.childrenAmount;
      temp = temp.parent;
    }

    childrenCount++;
    node.childrenAmount = childrenCount;
    const newNode = new TreeNode(data);
    newNode.parent = node;
    newNode.childrenAmount = childrenCount;

    if (node.data > data) {
      node.l = newNode;
    } else {
      node.r = newNode;
    }
    return newNode;
  }


  push(data) {
    if (this.root !== undefined) {
      return this.add(data, this.root);
    }
    this.root = new TreeNode(data);
    return this.root;
  }
}

/**
 * That given an array arr, you have to return the amount
 * of numbers that are smaller than arr[i] to the right.
 *
 * O(N^2)
 * @param {number[]} nums To process.
 */
function smaller(nums) {
  const bst = new BinarySearchTree();

  // Add to binary search tree
  nums.forEach(val => bst.push(val));
  console.log('nums:', nums);
  // return nums.map((val, i) => nums.slice(i).filter(curr => curr < val).length);
}


/**
 * That given an array arr, you have to return the amount
 * of numbers that are smaller than arr[i] to the right.
 *
 * O(N^2)
 * @param {number[]} nums To process.
 */
function smallerSlow(nums) {
  return nums.map((val, i) => nums.slice(i).filter(curr => curr < val).length);
}

/**
 * That given an array arr, you have to return the amount
 * of numbers that are smaller than arr[i] to the right.
 *
 * O(N^2)
 * @param {number[]} nums To process.
 */
function smallerON2(nums) {
  for (let n = 0; n < nums.length; n++) {
    let biggerThanN = 0;
    for (let n2 = n; n2 < nums.length; n2++) {
      if (nums[n2] < nums[n]) {
        biggerThanN++;
      }
    }
    nums[n] = biggerThanN;
  }

  return nums;
}

function testSmaller() {
  console.log(smaller([5, 4, 3, 2, 1]), [4, 3, 2, 1, 0]);
  console.log(smaller([1, 2, 3]), [0, 0, 0]);
  console.log(smaller([1, 2, 0]), [1, 1, 0]);
  console.log(smaller([1, 2, 1]), [0, 1, 0]);
  console.log(smaller([1, 1, -1, 0, 0]), [3, 3, 0, 0, 0]);
  console.log(smaller([5, 4, 7, 9, 2, 4, 4, 5, 6]), [4, 1, 5, 5, 0, 0, 0, 0, 0]);
}



/**
 * Finds all first pass permutations of the given input
 * @param {number} n to find first pass permutations on.
 * @deprecated only works when n.split('').length == 3
 */
function intPermsFirstPass(n) {
  const nArr = String(n).split('');

  const perms = [];
  for (let nInt = 0; nInt < nArr.length; nInt++) {
    for (let nInnerInt = 0; nInnerInt < nArr.length; nInnerInt++) {
      if (nInt === nInnerInt) { continue; }
      // Swap nArr[nInt] with nArr[nInnerInt]
      const first = nArr[nInt];
      const second = nArr[nInnerInt];
      const perm = nArr.slice(); // clone array
      perm[nInt] = second;
      perm[nInnerInt] = first;
      for (let nSwappedInt = 0; nSwappedInt < perm.length; nSwappedInt++) {
        // Swap nArr[nInt] with nArr[nInnerInt]
        const first2 = perm[nInt];
        const second2 = perm[nSwappedInt];
        const perm2 = perm.slice(); // clone array
        perm2[nInt] = second2;
        perm2[nSwappedInt] = first2;
        const newNumber = Number(perm2.join(''));
        if (!perms.includes(newNumber)) {
          perms.push(newNumber);
        }
      }
    }
  }
  return perms;
}

/**
 * 
 * @param {number} n
 * @deprecated didnt manage to pass all tests 
 */
function nextBiggerOld(n) {
  let lhs = String(n).split('').map(x => Number(x));
  let lhsreverse = Number(lhs.reverse().join(''));
  if (lhs.length === 2) {
    if (lhsreverse > n) { return lhsreverse; } else { return -1; }
  }

  if (lhsreverse === n) { return -1; }

  // split digits into two parts
  const rhs = [];
  for (let ni = lhs.length - 1; ni > 0; ni--) {
    if (rhs.length > 0 && lhs[ni] < rhs[rhs.length - 1]) { break; }
    rhs.unshift(lhs[ni]);
    lhs.pop();
  }
  console.log('rhs', rhs);

  if (lhs.length === 1) {

    let ps = intPermsFirstPass(n);
    let smallest = Number.MAX_SAFE_INTEGER;
    for (let psI = 0; psI < ps.length; psI++) {
      if (ps[psI] < smallest && ps[psI] > n) {
        smallest = ps[psI];
      }
    }
    return smallest;
  }

  if (lhs.length === 0) { return -1; }

  // select last digit of lhs
  const lastdigit = lhs.pop();

  let smallest = Number.MAX_SAFE_INTEGER;
  let smallestIndex = 0;
  for (let rhsI = 0; rhsI < rhs.length; rhsI++) {
    if (rhs[rhsI] < smallest && rhs[rhsI] > lastdigit) {
      smallest = rhs[rhsI];
      smallestIndex = rhsI;
    }
  }

  if (smallest === Number.MAX_SAFE_INTEGER) { return -1; }

  // insert lastdigit into lhs[smallestIndex]
  rhs[smallestIndex] = lastdigit;

  // insert smallest into the end of lhs
  lhs.push(smallest);
  return Number(lhs.concat(rhs).join(''));
}

function isPermutation(newN, base) {
  return String(newN).split('').sort().join('') == String(base).split('').sort().join('');
}

function nextBigger(n) {
  let newN = n;
  let bigN = n * 10;
  while(!isPermutation(++newN, n)) {
    if (newN > bigN) { return -1; }
  };
  return newN;
}

function testNextbigger() {
  // console.log(nextBigger(19999999999), 91999999999);
  // console.log(nextBigger(513), 531);
  console.log(nextBigger(582), 825);
  console.log(nextBigger(2017), 2071);
  // console.log(nextBigger(414), 441);
  // console.log(nextBigger(144), 414);
  // console.log(nextBigger(611567908211), 611567910128);
}

/**
 * 
 * @param {*} input 
 * @param {*} source 
 * @param {*} target 
 */
function convert(input, source, target) {
  let decimal = 0;
  let res = '';

  for (let j = 0; j < input.length; j++) {
    decimal += source.indexOf(input[j]) * Math.pow(source.length, input.length - 1 - j);
  }
  if (decimal === 0) { return target[0]; }

  while (decimal > 0) {
    res += target[decimal % target.length];
    decimal = Math.floor(decimal / target.length);
  }

  return res.split('').reverse().join('');
}


function permutationsTest() {
  console.log(permutations('a'), ['a'], '|');
  console.log(permutations('ab').sort(), ['ab', 'ba'].sort(), "|");
  console.log(permutations('aabb').sort(), ['aabb', 'abab', 'abba', 'baab', 'baba', 'bbaa'].sort(), "|");
}

function* permute(a, n = a.length) {
  if (n <= 1) yield a.slice();
  else for (let i = 0; i < n; i++) {
    yield *permute(a, n - 1);
    const j = n % 2 ? 0 : i;
    [a[n-1], a[j]] = [a[j], a[n-1]];
  }
}

function permutations(string) {
  return (string.length == 1) ? [string] : string.split('').map(
     (e, i) => permutations(string.slice(0,i) + string.slice(i+1)).map((e2) => e+e2)
  ).reduce((r,e) => r.concat(e)).sort().filter((e,i,a) => (i==0) || a[i-1] != e);
}

function permutationsOld(string) {
  return Array.from(new Set(Array.from(permute(string.split(''))).map(perm => perm.join(''))));
}

/**
 * Strips out comments in lines.
 * @param {string} input 
 * @param {string[]} markers 
 */
function stripComments(input, markers) {
  return input.split('\n').map((val) => {
    let firstOccurance = val.length;
    for (let m = 0; m < markers.length; m++) {
      const index = val.indexOf(markers[m]);
      if (index !== -1 && index < firstOccurance) {
        firstOccurance = index;
      }
    }
    return val.substring(0, firstOccurance).replace(/\s+$/g, '');
  }).join('\n');
}

function stripCommentsTest() {
  console.log(stripComments("apples, pears # and bananas\ngrapes\nbananas !apples", ["#", "!"]), "|", "apples, pears\ngrapes\nbananas");
}

/**
 * 
 * @param {string} str 
 */
function isValidIP(str) {
  const octets = str.split('.');
  if (octets.length !== 4 || str.indexOf(' ') >= 0) { return false; }
  for (let o = 0; o < octets.length; o++) {
    if (octets[o].length > 1 && octets[o].search(/^0/) !== -1) {
      return false;
    }
    
    if (octets[o].length > 4 || isNaN(octets[o]) || Number(octets[o]) > 255) {
      return false;
    }
  }
  return true;
}




function testIsValidIP() {
    console.log(isValidIP('1.2.3.4'), true);
    console.log(isValidIP('123.45.67.89'), true);

    console.log(isValidIP('1.2.3'), false);
    console.log(isValidIP('1.2.3.4.5'), false);
    console.log(isValidIP('123.456.78.90'), false);
    console.log(isValidIP('123.045.067.089'), false);
}



function timeFormat(sec, type) {
  return `${sec} ${type}${(sec > 1) ? 's' : ''}`;
}

/**
 * Gets formatted time.
 * @param {number} seconds Current seconds to format.
 * @param {string} hourText Hour text to format, e.g. hour
 * @param {number} hourAmount Current hour time
 * @param {number} hourAmountBefore Previous hour time
 */
function getTime(seconds, hourText, hourAmount, hourAmountBefore) {
  let amount = '';
  if (seconds % hourAmount > 0) {
    amount = `${timeFormat(Math.floor((seconds % hourAmount) / hourAmountBefore), hourText)}`;
  }
  return amount;
}

/**
 * Format array with a, b and c.
 * @param {string[]} arr Array of strings to display.
 */
function formatResult(arr) {
  const res = arr.filter(curr => curr !== '');
  const last = res.pop();
  return `${res.join(', ')} and ${last}`;
}


function formatDuration(seconds) {
  if (seconds === 0) { return 'now'; }

  // Seconds
  if (seconds < 60) { return timeFormat(seconds % 60, 'second'); }

  // Minutes and Seconds
  if (seconds >= 60 && seconds < 3600) {
    let result = `${timeFormat(Math.floor(seconds / 60), 'minute')}`;
    if (seconds % 60 > 0) {
      result += ` and ${timeFormat(seconds % 60, 'second')}`;
    }
    return result;
  }

  // Hours, Minutes and Seconds
  if (seconds >= 3600 && seconds < 86400) {
    const hour = `${timeFormat(Math.floor(seconds / 3600), 'hour')}`;

    let min = getTime(seconds, 'minute', 3600, 60);

    let sec = '';
    if (seconds % 60 > 0) {
      sec = `${timeFormat(seconds % 60, 'second')}`;
    }

    return formatResult([hour, min, sec]);
  }

  // Days, Hours, Minutes and Seconds
  if (seconds >= 86400 && seconds < 31536000) {
    const days = `${timeFormat(Math.floor(seconds / 86400), 'day')}`;

    let hour = getTime(seconds, 'hour', 86400, 3600);
    let min = getTime(seconds, 'minute', 3600, 60);
    let sec = '';
    if (seconds % 60 > 0) {
      sec = `${timeFormat(seconds % 60, 'second')}`;
    }

    return formatResult([days, hour, min, sec]);
  }

  // Years, Days, Hours, Minutes and Seconds
  if (seconds >= 31536000 && seconds < Number.MAX_SAFE_INTEGER) {
    const years = `${timeFormat(Math.floor(seconds / 31536000), 'year')}`;

    let days = getTime(seconds, 'day', 31536000, 86400);
    let hour = getTime(seconds, 'hour', 86400, 3600);
    let min = getTime(seconds, 'minute', 3600, 60);

    let sec = '';
    if (seconds % 60 > 0) {
      sec = `${timeFormat(seconds % 60, 'second')}`;
    }

    return formatResult([years, days, hour, min, sec]);
  }
}


function formatDurationWorksButOld(seconds) {
  if (seconds === 0) { return 'now'; }

  // Seconds
  if (seconds < 60) { return timeFormat(seconds % 60, 'second'); }

  // Minutes and Seconds
  if (seconds >= 60 && seconds < 3600) {
    let result = `${timeFormat(Math.floor(seconds / 60), 'minute')}`;
    if (seconds % 60 > 0) {
      result += ` and ${timeFormat(seconds % 60, 'second')}`;
    }
    return result;
  }

  // Hours, Minutes and Seconds
  if (seconds >= 3600 && seconds < 86400) {
    const hour = `${timeFormat(Math.floor(seconds / 3600), 'hour')}`;

    let min = getTime(seconds, 'minute', 3600, 60);

    let sec = '';
    if (seconds % 60 > 0) {
      sec = `${timeFormat(seconds % 60, 'second')}`;
    }

    return formatResult([hour, min, sec]);
  }

  // Days, Hours, Minutes and Seconds
  if (seconds >= 86400 && seconds < 31536000) {
    const days = `${timeFormat(Math.floor(seconds / 86400), 'day')}`;

    let hour = getTime(seconds, 'hour', 86400, 3600);
    let min = getTime(seconds, 'minute', 3600, 60);
    let sec = '';
    if (seconds % 60 > 0) {
      sec = `${timeFormat(seconds % 60, 'second')}`;
    }

    return formatResult([days, hour, min, sec]);
  }

  // Years, Days, Hours, Minutes and Seconds
  if (seconds >= 31536000 && seconds < Number.MAX_SAFE_INTEGER) {
    const years = `${timeFormat(Math.floor(seconds / 31536000), 'year')}`;

    let days = getTime(seconds, 'day', 31536000, 86400);
    let hour = getTime(seconds, 'hour', 86400, 3600);
    let min = getTime(seconds, 'minute', 3600, 60);

    let sec = '';
    if (seconds % 60 > 0) {
      sec = `${timeFormat(seconds % 60, 'second')}`;
    }

    return formatResult([years, days, hour, min, sec]);
  }
}

function formatDurationoldish(seconds) {
  if (seconds === 0) { return 'now'; }

  const timeAmounts = [
    { amount: 60,                      type: 'second' },
    { amount: 3600,                    type: 'minute' },
    { amount: 86400,                   type: 'hour'   },
    { amount: 31536000,                type: 'day'    },
    { amount: Number.MAX_SAFE_INTEGER, type: 'year'   }
  ];
  for (let iT = 0; iT < timeAmounts.length; iT += 1) {
    if (seconds < timeAmounts[iT].amount) {
      if (seconds < 60 || seconds % timeAmounts[iT].amount === 0) {
        return timeFormat(seconds, timeAmounts[iT].type);
      }
      let result = '';
      for (let iTback = iT; iTback >= 0; iTback -= 1) {
        let calculation;
        if (iTback === 0) {
          calculation = seconds % timeAmounts[iTback].amount;
        } else if (iTback === iT) {
          calculation = seconds / timeAmounts[iTback - 1].amount;

          if (seconds % timeAmounts[iTback - 1].amount === 0) {
            result += `${timeFormat(Math.floor(calculation), timeAmounts[iTback].type)}`;
            return result;
          }
          seconds -= Math.floor(calculation) * timeAmounts[iTback].amount;
        } else {
          calculation = seconds / timeAmounts[iTback].amount;
          seconds -= Math.floor(calculation) * timeAmounts[iTback].amount;
          let testNew = seconds % timeAmounts[iTback].amount;
          let testNewModulo = seconds % timeAmounts[iTback - 1].amount;
          let testNewDivide = seconds / timeAmounts[iTback - 1].amount;
          let testNewTestDivide = seconds / timeAmounts[iT].amount;
          console.log(testNew, testNewDivide, testNewTestDivide, testNewModulo, calculation);
        }

        result += `${timeFormat(Math.floor(calculation), timeAmounts[iTback].type)}`;

        if (iTback === 1) {
          result += ' and ';
        } else if (iTback === 0) {
          result += '';
        } else {
          result += ', ';
        }
      }
      return result;
    }
  }
}


function formatDurationOld(seconds) {
  const timeAmounts = [60, 3600, 86400];

  if (seconds < timeAmounts[0])
  {
    return timeFormat(seconds, 'second');
  }
  else if (seconds < timeAmounts[1])
  {
    if (seconds % timeAmounts[0] === 0)
    {
      return timeFormat(seconds, 'minute');
    }
    const mins = Math.floor(seconds / timeAmounts[0]);
    return `${timeFormat(mins, 'minute')} and ${timeFormat(seconds % timeAmounts[0], 'second')}`;

  }
  else if (seconds < timeAmounts[2])
  {
    if (seconds % timeAmounts[1] === 0)
    {
      return timeFormat(seconds, 'hour');
    }
    const minutes = Math.floor(seconds / timeAmounts[0]);
    const hours = Math.floor(seconds / timeAmounts[1]);
    return `${timeFormat(hours, 'hour')}, ${timeFormat(minutes, 'minute')} and ${timeFormat(seconds % timeAmounts[0], 'second')}`;
  }

  return 'Not yet completed';
}

function testFormatDuration() {
  // console.log(formatDuration(1), '|', '1 second');
  // console.log(formatDuration(60), '|', '1 minute');
  // console.log(formatDuration(3600), '|', '1 hour');
  // console.log(formatDuration(86400), '|', '1 day');
  // console.log(formatDuration(31536000), '|', '1 year');
  // console.log(formatDuration(62), '|', '1 minute and 2 seconds');
  // console.log(formatDuration(120), '|', '2 minutes');
  // console.log(formatDuration(3600), '|', '1 hour');
  console.log(formatDuration(3782), '|', '1 hour, 3 minute and 2 seconds');
  console.log(formatDuration(15731080), '|', '182 days, 1 hour, 44 minutes and 40 seconds');
  // console.log(formatDuration(15731080), '|', '182 days, 1 hour, 44 minutes and 40 seconds');
  // console.log(formatDuration(132113944), '|', '4 years, 68 days, 3 hours and 4 minutes');
}


function testBigSumStrings() {
  console.log(sumStrings('1','2'),'3');
  // console.log(sumStrings('10','2'),'12');
  // console.log(sumStrings('12345','2'),'12347');
  // console.log(sumStrings('2','12345'),'12347');
  // console.log(sumStrings('99','111'),'210');
  console.log(sumStrings('00103','08567'),'8670');
  // console.log(sumStrings('712569312664357328695151392','8100824045303269669937'),'712577413488402631964821329');
}

/**
 * Sums very large numbers as strings.
 * 
 * @param {string[]} a Array of numbers as strings.
 * @param {string[]} b Array of numbers as strings.
 * @param {number} carry amount to carry, e.g. 1 or 0.
 */
function sumLargeNumberJSToString(a, b, carry) {
  let aInt = 0,
      bInt = 0,
      result = carry;

  // Base case
  if(a.length == 0 && b.length == 0) {
    return (carry > 0) ? String(carry) : "";
  }

  // Get the number from the string array
  aInt = (a.length > 0) ? Number(a.pop()) : 0;
  bInt = (b.length > 0) ? Number(b.pop()) : 0;

  result += aInt + bInt;
  // Perform the carry calculation
  carry = (result >= 10) ? 1 : 0;
  return sumLargeNumberJSToString(a, b, carry) + String(result % 10);
}


/**
 * 
 * @param {string[]} a 
 * @param {string[]} b 
 */
function sumLargeNumberJSToStringOld(a, b, carry) {
  let aInt,
      bInt,
      result = carry;

  if(a.length == 0 && b.length == 0) {
    if(carry > 0) {
      return String(carry);
    } else {
      return "";
    }
  }

  if(a.length == 0 && b.length != 0) {
    aInt = 0;
    bInt = Number(b.pop());
  }

  if(a.length != 0 && b.length == 0) {
    aInt = Number(a.pop());
    bInt = 0;
  }

  if(a.length > 0 && b.length > 0) {
    aInt = Number(a.pop());
    bInt = Number(b.pop());
  }

  result += aInt + bInt;
  if(result >= 10) {
    result = result % 10;
    carry = 1;
  } else {
    carry = 0;
  }
  return sumLargeNumberJSToString(a, b, carry) + String(result);
}

function sumStrings(a, b) { 
  if(a == '0' && 'b' == '0') { return 0; }
  let result = sumLargeNumberJSToString(a.split(''), b.split(''), 0);
  return result.replace(/^0*/, '');
}

function testDecodeRomanNumerals() {
  console.log(decodeRomanNumerals('XXI'), 21);
  console.log(decodeRomanNumerals('IV'), 4);
}

function decodeRomanNumerals(roman) {
  return roman.split('').map(numeral => {
    switch(numeral) {
      case 'I':
        return 1;
      case 'V':
        return 5;
      case 'X':
        return 10;
      case 'L':
        return 50;
      case 'C':
        return 100;
      case 'D':
        return 500;
      case 'M':
        return 1000;
    }
  }).reduce((prev, curr) => {
    if(prev < curr) {
      return curr - prev;
    } else {
      return curr + prev;
    }
  });
}

function testValidBraces() {
  console.log(validBraces( "()" ), true);
  console.log(validBraces( "[(])" ), false);
  console.log(validBraces( ")}]" ), false);
}

function validBraces(braces) {
  let bracketStack = [];
  let opening = 0;
  let arrBraces = braces.split('');
  for(let i = 0; i < arrBraces.length; i++) {
    let el = arrBraces[i];
    if(el == ")" || el == "]" || el == "}") {
      if(opening < 1) { return false; }
      let peek = bracketStack.pop();
      if(peek == "(" && el != ")") { return false; }
      if(peek == "[" && el != "]") { return false; }
      if(peek == "{" && el != "}") { return false; }
    } else {
      opening++;
    }
    bracketStack.push(el);
  };
  return true;
}

function add(a) {
  let fn = function(n) {
    return add(n + a);
  };

  fn.valueOf = () => a;

  return fn;
}


function testAddCurrying() {
  var addTwo = add(2);

  console.log(addTwo, 2);
  console.log(addTwo(3), 5);

  console.log(add(1), add(1) == 1, true);
  console.log(add(1)(2), add(1)(2) == 3, true);
  console.log(add(1)(2)(3), add(1)(2)(3) == 6, true);
}

function testProductFib() {
  // console.log(productFib(4895), "\n", [55, 89, true]);
  // console.log(productFib(5895), "\n", [89, 144, false])
  // console.log(productFib(74049690), "\n", [6765, 10946, true])
  // console.log(productFib(84049690), "\n", [10946, 17711, false])
  // console.log(productFib(193864606), "\n", [10946, 17711, true])
  console.log(productFib(447577), "\n", [610, 987, false])
  // console.log(productFib(602070), "\n", [610, 987, true])
}

function productFib(n) {
  let fibs = [0, 1];
  let prev,
      prevprev;
  for(let i = 2; i < n; i++) {
    prev = fibs[fibs.length - 1],
    prevprev = fibs[fibs.length - 2];

    if((prev * prevprev) == n) {
      // console.log('found', prev, prevprev, n);
      return [prevprev, prev, true];
    }

    if((prev * prevprev) > n) {
      // console.log('not found', prev, prevprev, n);
      return [prevprev, prev, false];
    }
    fibs.push(prev + prevprev);
  }
  // console.log('not found after', prev, prevprev, n);
  return fibs;
}

function testOrderWeight() {
  // console.log(orderWeight("103 123 4444 99 2000"), "\n" ,"2000 103 123 4444 99");
  console.log(orderWeight("2000 10003 1234000 44444444 9999 11 11 22 123"), "wanted:\n11 11 2000 10003 22 123 1234000 44444444 9999");

  // console.log(orderWeight("190561 315808 106997 276073"), "\n" , "190561 276073 315808 106997");
  // console.log(orderWeight("460152 190561 3367 389745 315808 130361 62344 106997 42317 276073"), "\n" , "130361 42317 460152 3367 62344 190561 276073 315808 106997 389745");
   
}

/**
 * 
 * @param {String} str 
 */
function orderWeight(str) {
  let arr = str.split(' ');
  let result = [];
  for(let weight = 0; weight < arr.length; weight++) {
    if(arr[weight] <= 0) { continue; }
    result.push(
      {
        weight: arr[weight].split('').reduce((prev, curr, i) => {
          return Number(curr) + Number(prev);
        }),
        value: arr[weight]
      }
    );
  }
  // Sort
  result = result.sort(
    (a,b) => {
      if(a.weight == b.weight) {
        console.log(a, b);
        console.log(Number(a.value), Number(b.value));
        return ;
      } else {
        return a.weight - b.weight;
      }
    }
  ).map(function(val) {
    return val.value;
  });

  return result.join(' ');
}

/**
 * 
 * @param {number[]} A 
 */
function findOdd(A) {
  let map = [];
  A.forEach(function(val, i) {
    if(map.indexOf(val) >= 0) {
      map.splice(map.indexOf(val), 1);
    } else {
      map.push(val);
    }
  });

  return map.pop();
}

function testFindOdd() {
  console.log(findOdd([20,1,-1,2,-2,3,3,5,5,1,2,4,20,4,-1,-2,5]), 5);
  console.log(findOdd([1,1,2,-2,5,2,4,4,-1,-2,5]), -1);
  console.log(findOdd([20,1,1,2,2,3,3,5,5,4,20,4,5]), 5);
  console.log(findOdd([10]), 10);
  console.log(findOdd([1,1,1,1,1,1,10,1,1,1,1]), 10);
  console.log(findOdd([5,4,3,2,1,5,4,3,2,10,10]), 1);
}

function testAnagrams() {
  console.log(anagrams('abba', ['aabb', 'abcd', 'bbaa', 'dada']), ['aabb', 'bbaa']);
  console.log(anagrams('racer', ['crazer', 'carer', 'racar', 'caers', 'racer']), ['carer', 'racer']);
  console.log(anagrams('laser', ['lazing', 'lazy',  'lacer']), []);
}

/**
 * 
 * @param {string[]} word 
 * @param {string[]} words 
 */
function anagrams(word, words) {
  word = word.split('').sort().join('');
  return words.filter(function(curr) {
    return curr.split('').sort().join('') == word;
  })
}

function testInArray() {
  var stack = ["lively", "alive", "harp", "sharp", "armstrong"];

  var b1 = ["live", "zzzz"];
  console.log(inArray(b1, stack), ["lively"]);

  var a1 = ["xyz", "live", "strong"];
  console.log(inArray(a1, stack), ["live", "strong"]);

  console.log(inArray(["live", "strong", "arp"], stack), ["arp", "live", "strong"]);
  console.log(inArray(["tarp", "mice", "bull"], stack), []);
}

/**
 * 
 * @param {String[]} needle 
 * @param {String[]} haystack 
 */
function inArray(needles, haystack) {
  let result = [];
  haystack.forEach(element => {
    needles.some(needle => {
      if(element.indexOf(needle) >= 0 && result.indexOf(needle) < 0) {
        result.push(needle);
        return true;
      }
    })
  });
  return result.sort();
}

function testValidParentheses() {
  console.log(validParentheses( "()" ), true);
  console.log(validParentheses( ")(()())(" ), false);
}

function validParentheses(parens) {
  let openCount = 0;
  for(let i = 0; i < parens.length; i++) {
    if(parens[i] == "(") {
      openCount++;
    } else {
      openCount--;
    }
    if(openCount < 0) { return false; }
  }
  return openCount == 0;
}

function testCalc() {
  var tests = [
    ['1+1', 2],
    ['1 - 1', 0],
    ['1* 1', 1],
    ['1 /1', 1],
    ['-123', -123],
    ['123', 123],
    ['2 /2+3 * 4.75- -6', 21.25],
    ['12* 123', 1476],
    ['2 / (2 + 3) * 4.33 - -6', 7.732],
  ];
  tests.forEach(function (m) {
    console.log(calc(m[0]), m[1]);
  });
}

/**
 * Performs an eval calculation.
 * 
 * @param {String} expression 
 * @returns {number} Output calculation.
 */
var calc = function (expression) {
  return expression.split(/-|\+/);
};


function testAccum() {
  console.log(accum("abc"),"A-Bb-Ccc");
  console.log(accum("Zz"),"Z-Zz");
}

function accum(s) {
  let strArray = s.split('');
  let format = function(val, i) {
    return val.toUpperCase() + val.toLowerCase().repeat(i);
  }
  return strArray.map(format).join('-');
}

function accumOld(s) {
  let result = "";
  for(let char = 0; char < s.length; char++) {
    result += s[char].toUpperCase();
    for(let next = 0; next < char; next++) {
      result += s[char].toLowerCase();
    }
    if((char + 1) != s.length)
      result += "-";
  }
  return result;
}



function testIsSquare() {
  console.log(isSquare(16), true);
  console.log(isSquareBetter(5), false);
  console.log(isSquareBetter(5), false);
  console.log(isSquareBetter(25), true);
}

var isSquare = function(n) {
  if(n == 1) { return true; }
  for(let i = 0; i <= (n / 2); i++) {
    if(i*i == n) { return true; }
  }
  return false;
}

var isSquareBetter = function(n) {
  return Math.sqrt(n) % 1 == 0;
}

function sumTwoSmallestNumbersTest() {
  console.log(sumTwoSmallestNumbers([5, 8, 12, 19, 22]), 13);
  console.log(sumTwoSmallestNumbers([15, 28, 4, 2, 43]), 6);
  console.log(sumTwoSmallestNumbers([3, 87, 45, 12, 7]), 10);
}

function sumTwoSmallestNumbers(numbers) {
  let orderedNumbers = numbers.sort(function(a, b) { return a - b; });
  return orderedNumbers[0] + orderedNumbers[1];
};

function testThreeSpeicialNaNvalues() {
  let isInfinity = Math.pow(10, 10000);
  console.log();
}

function testBasicArithmetic() {
  console.log("Adding", 0.1, 0.2, 0.1 + 0.2);
  console.log("Adding safe", plus(0.1, 0.2, 10));
}

function plus(a, b, base) {
  let aScaled = a * base,
      bScaled = b * base,
      result = aScaled + bScaled;
  return result / base;
}

function testScope() {
  console.log('testScope');

  testScope = function() {
    console.log('new testScope');
  }

  testScope();
}


function queueTimeTest() {
  console.log(queueTime([], 1), 0);
  console.log(queueTime([1,2,3,4], 1), 10);
  console.log(queueTime([2,2,3,3,4,4], 2), 9);
  console.log(queueTime([1,2,3,4,5], 100), 5);
  console.log(queueTime([6,4,34,48,40,1,47,11,22,49,38,3,17,11,22,26,29,15,20,36,35,12,48,41,14], 6), 122); // 25 elements
  console.log(queueTime([10,5,9,3], 2), 14);
}

function queueTime(customers, n) {
  // Base cases
  if(customers.length == 0) { return 0; }
  if(n == 1) { return customers.reduce(function(a, b) {return a + b;}); }

  let tills = new Array(n).fill(0);

  // Loop around the customers
  let tillN = 0;
  for(let c = 0; c < customers.length; c++) {
    tills[tillN] += customers[c]; // Assign customer to till
    tills.sort(function(a, b) { return a - b; }); // sort tills
  }

  return Math.max(...tills);
}

function descendingOrderTest() {
  console.log(descendingOrder(0), 0)
  console.log(descendingOrder(1), 1)
  console.log(descendingOrder(123456789), 987654321)
  console.log(descendingOrder(1102), 2110);
}

function descendingOrder(n) {
  return Number(String(n).split('').map(function(str) {return Number(str); }).sort(function(a, b) { return a < b; }).join(''));
}

function multiplesOfNumbers(number) {
  let result = 0;
  while(number > 1) {
    number--;

    if(number % 3 == 0 || number % 5 == 0) {
      result += number;
    }   
  }
  return result;
}

/**
 * Returns the sum of all the multiples of 3 or 5 below the number passed in.
 * @param {Number} number 
 */
function multiplesOfNumbers2(number) {
  let set = [];
  while(number > 1) {
    number--;

    if(number % 3 == 0 || number % 5 == 0) {
      set.push(number);
    }   
  }
  return set.reduce(function(a, b) { return a + b; }, 0);
}

function multiplesOfNumbersTest() {
  console.log(multiplesOfNumbers(10), 23);
}

function xoTest() {
  console.log(codewarsXO('xo'), true);
  console.log(codewarsXO('xxOo'), true);
  console.log(codewarsXO('xxxm'), false);
  console.log(codewarsXO('Oo'), false);
  console.log(codewarsXO('ooom'), false); 
}


function codewarsXO(str) {
  str = str.toLowerCase();
  return str.split('x').length == str.split('o').length;
}

/**
 * Check to see if a string has the same amount of 'x's and 'o's
 * @param {string} str To count X's and O's in.
 */
function codewarsXO2(str) {
  let xs = 0, 
      os = 0;
  str = str.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    if(str[i] == 'o') {
      xs++;
    } else if(str[i] == 'x') {
      os++;
    }
  }

  return xs == os;
}


// queueTimeTest();
// descendingOrderTest();
// multiplesOfNumbersTest();
// xoTest();
// testBasicArithmetic();
// testScope();
// sumTwoSmallestNumbersTest();
// testIsSquare();
// testAccum();
// testCalc(); // TODO not done
// testValidParentheses();
// testInArray();
// testAnagrams();
// testFindOdd();
// testOrderWeight();
// testProductFib();
// testAddCurrying();
// testValidBraces();
// testDecodeRomanNumerals();
// testBigSumStrings();
// testFormatDuration();
// testIsValidIP();
// stripCommentsTest();
// permutationsTest();
// testSaveMark();
// testToCsvText();
// testDMStoLatLng();
// testSmaller();
// testStringMix();
// findLCOccurancesTest();
// testStringMix();
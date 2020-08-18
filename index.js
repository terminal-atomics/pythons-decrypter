const fs = require("fs")

let text = fs.readFileSync("sample.txt", { encoding: "utf-8" });
let dict = fs.readFileSync("dict.txt", { encoding: "utf-8" }).split("\n");

let characters = text.split("-")

function findUnique(list) {
	let unique = {};
	for (let e of list) {
		if (e == '||' || '') continue;
		if (Object.keys(unique).indexOf(e) == -1) {
			unique[e] = 1;
		} else {
			unique[e]++;
		}
	}
	return unique
}

function normalize(list) {
	let normed = {};
	let total = Object.values(counted).reduce((a, b) => a + b);

	for (let e in list) {
		normed[e] = list[e] / total;
	}
	return normed;
}

let probabilities = {
	"a": 8.497,
	"b": 1.492,
	"c": 2.202,
	"d": 4.253,
	"e": 11.162,
	"f": 2.228,
	"g": 2.015,
	"h": 6.094,
	"i": 7.546,
	"j": 0.153,
	"k": 1.292,
	"l": 4.025,
	"m": 2.406,
	"n": 6.749,
	"o": 7.507,
	"p": 1.929,
	"q": 0.095,
	"r": 7.587,
	"s": 6.327,
	"t": 9.356,
	"u": 2.758,
	"v": 0.978,
	"w": 2.560,
	"x": 0.150,
	"y": 1.994,
	"z": 0.077,
};

for (let p in probabilities) {
	probabilities[p] = probabilities[p] / 100;
}

function sortByDelta(obj) {
	let deltaSorted = {};
	for (let e in obj) {
		deltaSorted[e] = Object.keys(probabilities).sort((a, b) =>
			Math.abs(obj[e] - probabilities[a]) > Math.abs(obj[e] - probabilities[b]) ? 1 : -1);
	}
	return deltaSorted
}

let counted = findUnique(characters);
let total = Object.values(counted).reduce((a, b) => a + b);
let normalized = normalize(counted);

console.log(counted);
console.log(normalized);

let sorted = sortByDelta(normalized);
console.log(sorted)

let vowels = "aeiouy".split("");

function toVowelConfidence(list) {
	// could store the actual deltas for each letter but meh
	let confidences = {};
	for (let sym in list) {
		let confidence = 0;
		let addable = 0.5;
		for (let letter of sym) {
			if (vowels.indexOf(letter) != -1) confidence += addable;
			addable /= 2;
		}
		confidences[sym] = confidence;
	}
	return confidences;
}

// Reducing every possible letter to being either a vowel or not.
let condfidences = toVowelConfidence(sorted);
delete condfidences[""];

console.log(condfidences)

let areVowels = {};
for (let sym in condfidences) {
	areVowels[sym] = condfidences[sym] >= 0.5;
}
console.log(areVowels)

function buildWords(list) {
	let words = [];
	let vowelWord = [];
	let charWord = [];
	for (let char of characters) {
		if (char.length < 1) continue;
		if (char == "||") {
			words.push({
				chars: charWord,
				vowels: vowelWord,
				length: vowelWord.length
			});
			vowelWord = [];
			charWord = [];
		} else {
			vowelWord.push(list[char]);
			charWord.push(char);
		}
	}
	words.push({
		chars: charWord,
		vowels: vowelWord,
		length: vowelWord.length
	});
	return words;
}

function vowelifyText(word) {
	let vowel = [];
	let letters = word.split("");
	for (let letter of letters) {
		vowel.push(vowels.indexOf(letter) != -1);
	}
	return vowel;
}

let words = buildWords(areVowels);
console.log(words)

function equalArrays(a, b) {
	for (let i = 0; i < a.length; i++) {
		if (a[i] != b[i]) return false;
	}
	return true
}

for (let word of words) {
	let matching = [];
	let candidates = dict.filter(e => e.length == word.length);
	for (let cand of candidates) {
		let vowelized = vowelifyText(cand);
		if (equalArrays(vowelized, word.vowels)) matching.push(cand);
	}
	word.matches = matching.slice(0, 4);
}

console.log(words)
// bruh
// not enough words

let sentence = "";
for (let word of words) {
	sentence += word.matches[0]
	sentence += " "
}
console.log(sentence);


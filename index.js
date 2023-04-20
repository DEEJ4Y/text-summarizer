const stopwords = require("./stopwords.json");
const fs = require("fs/promises");

async function main() {
  const input = (await fs.readFile("input.txt"))
    .toString()
    .replace(/(\r\n|\n|\r)/gm, "");

  const sentences = input
    .split(".")
    .filter((sentence) => {
      return sentence !== " ";
    })
    .map((sentence) => `${sentence.trim()}.`);

  const wordsFrequency = {};

  sentences.forEach((sentence) => {
    const words = sentence.split(" ").map((word) => {
      const specialSymbols = ["‘", "’", ",", ";", "'", '"', "."];

      specialSymbols.forEach((symbol) => {
        word = word.replace(symbol, "");
      });

      return word.toLowerCase();
    });

    words.forEach((word) => {
      if (!stopwords.includes(word)) {
        if (wordsFrequency[word]) {
          wordsFrequency[word] += 1;
        } else {
          wordsFrequency[word] = 1;
        }
      }
    });
  });

  const mostUsedWords = Object.keys(wordsFrequency).filter((key) => {
    return wordsFrequency[key] >= 3;
  });

  let summary = [];

  sentences.forEach((sentence) => {
    let hits = 0;

    mostUsedWords.forEach((word) => {
      if (sentence.includes(word)) hits += 1;
    });

    if (hits >= 4) summary.push(sentence);

    return hits;
  });

  await fs.writeFile("summary.txt", summary.join("\n"), "utf-8");
}

main();

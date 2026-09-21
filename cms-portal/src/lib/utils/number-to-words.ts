/**
 * Utility to convert numeric Naira values into formal Nigerian grammatical currency words.
 * Example: 8500 -> "eight thousand, five hundred Naira Only"
 * Example: 10000 -> "ten thousand Naira Only"
 */

const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function convertThreeDigitChunk(num: number): string {
  let result = "";
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds > 0) {
    result += ONES[hundreds] + " hundred";
    if (remainder > 0) {
      result += ", ";
    }
  }

  if (remainder > 0) {
    if (remainder < 20) {
      result += ONES[remainder];
    } else {
      const tens = Math.floor(remainder / 10);
      const units = remainder % 10;
      result += TENS[tens];
      if (units > 0) {
        result += "-" + ONES[units];
      }
    }
  }

  return result;
}

export function numberToWordsNaira(amountInNaira: number): string {
  if (amountInNaira === 0) return "Zero Naira Only";

  const rounded = Math.floor(amountInNaira);
  let remaining = rounded;

  const chunks: { value: number; unit: string }[] = [
    { value: 1_000_000_000, unit: "billion" },
    { value: 1_000_000, unit: "million" },
    { value: 1_000, unit: "thousand" },
    { value: 1, unit: "" },
  ];

  const parts: string[] = [];

  for (const { value, unit } of chunks) {
    if (remaining >= value) {
      const count = Math.floor(remaining / value);
      remaining = remaining % value;

      const words = convertThreeDigitChunk(count);
      if (words) {
        parts.push(unit ? `${words} ${unit}` : words);
      }
    }
  }

  const wordsString = parts.join(", ");
  return `${wordsString} Naira Only`;
}

/**
 * Format from Kobo minor units
 */
export function koboToWordsNaira(amountKobo: number): string {
  const naira = Math.floor(amountKobo / 100);
  return numberToWordsNaira(naira);
}

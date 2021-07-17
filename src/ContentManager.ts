export let menuRegular: string[] = [
  "Willkommen bei Questionare!",
  "Optionen:",
];

export let menuQuestionaryList: string[] = [
  "Momentane Umfragen",
  "Welcher Lol-Champion bist du?",
  "Bewertung - Hochschule Furtwangen",
  "Optionen:",
];

export function writeContent(content: string[]): void {
  console.clear();
  for (let i = 0; i < content.length; i++) {
    console.log(`${content[i]}`);
  }
}

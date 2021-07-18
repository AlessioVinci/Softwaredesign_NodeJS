export const menuMain: string[] = [
  "Willkommen bei Questionare!",
  "Optionen:",
];

export const menuQuestionaryList: string[] = [
  "Momentane Umfragen",
  "Welcher Lol-Champion bist du?",
  "Bewertung - Hochschule Furtwangen",
  "Optionen:",
];

export function writeContent(content: string[]): void {
  for (let i = 0; i < content.length; i++) {
    console.log(`${content[i]}`);
  }
}

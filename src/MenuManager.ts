export const menuRegular: string[] = [
  "Alle Umfragen anzeigen",
  "Umfrage Suchen",
  "Nutzerstatistiken anzeigen",
  "Anmelden",
  "Registrieren",
  "Programm beenden",
];

export const menuAdmin: string[] = [
  "Alle Umfragen anzeigen",
  "Umfrage Suchen",
  "Umfrage erstellen",
  "Nutzerstatistiken anzeigen",
  "Umfragestatistiken anzeigen",
  "Programm beenden",
];

export const menuQuestionaryList: string[] = [
  "Umfrage öffnen (ID)",
  "Vorherige Seite",
  "Nächste Seite",
  "Zurück zum Hauptmenü",
];

export const menuQuestionarySearch: string[] = [
  "Neue Umfrage suchen",
  "Umfrage öffnen",
  "Zurück zum Hauptmenü",
];

export const menuUserStats: string[] = [
  "Zurück zum Hauptmenü",
];

export const menuQuestionaryStats: string[] = [
  "Sehe Statistik zu Umfrage mit ID:",
  "Zurück zum Hauptmenü",
];

export function writeMenu(choices: string[]): number {
  let idx = -1;
  let input: string | null = "";
  let error = false;
  do {
    if (error) {
      console.log(`invalid input "${input}". Please try again. \n`);
    }
    for (let i = 0; i < choices.length; i++) {
      console.log(`${i}: ${choices[i]}`);
    }
    input = prompt("Input:");
    if (input === null) {
      input = "";
    } else {
      idx = parseInt(input);
    }
    error = true;
  } while (idx >= choices.length || idx < 0 || isNaN(idx));
  return idx;
}

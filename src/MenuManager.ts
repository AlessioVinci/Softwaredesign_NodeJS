export let menuRegular: string[] = [
  "Alle Umfragen anzeigen",
  "Nutzerstatistiken anzeigen",
  "Anmelden",
  "Registrieren",
  "Programm beenden",
];

export let menuAdmin: string[] = [
  "Alle Umfragen anzeigen",
  "Umfrage erstellen",
  "Nutzerstatistiken anzeigen",
  "Umfragestatistiken anzeigen",
  "Programm beenden",
];

export let menuQuestionaryList: string[] = [
  "Umfrage suchen",
  "Vorherige Seite",
  "Nächste Seite",
  "Zurück zum Hauptmenü",
  "Programm beenden",
];

export function writeMenu(choices: string[]): number {
  let idx: number = -1;
  let input: string | null = "";
  let error: boolean = false;
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

/* //@ts-ignore
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts"; */
import * as Validation from "./classes/ValidationResult.ts";
import * as Menu from "./MenuManager.ts";
import { States } from "./States.ts";
import { UserSession } from "./classes/UserSession.ts";
import { UserTypes } from "./classes/UserTypes.ts";
import { Questionary } from "./classes/Questionary.ts";
import { QuestionBuilder } from "./classes/QuestionBuilder.ts";
import { QuestionTypes } from "./classes/QuestionTypes.ts";

let currentState = States.MAIN_MENU_REGULAR;
UserSession.Instance;
let currentPage = 0;
let currentQuestionaryKey: number;
let currentStatisticQuestionaryKey: number;

function getJsonAsObject(filepath: string): any {
  return JSON.parse(Deno.readTextFileSync(filepath));
}

function setMainMenu(): void {
  if (UserSession.Instance.getUserType() === UserTypes.ADMIN) {
    currentState = States.MAIN_MENU_ADMIN;
  } else {
    currentState = States.MAIN_MENU_REGULAR;
  }
}

do {
  switch (+currentState) {
    case States.MAIN_MENU_REGULAR: {
      console.clear();
      console.log("Willkommen bei Questionare!\nOptionen:");
      const choice = Menu.writeMenu(Menu.menuRegular);
      switch (choice) {
        case 0: {
          currentState = States.LIST_QUESTIONARIES_MENU;
          break;
        }
        case 1: {
          currentState = States.SEARCH_QUESTIONARY_MENU;
          break;
        }
        case 2: {
          currentState = States.USER_STATS_MENU;
          break;
        }
        case 3: {
          currentState = States.LOGIN_MENU;
          break;
        }
        case 4: {
          currentState = States.REGISTER_MENU;
          break;
        }
        case 5: {
          currentState = States.QUIT_APPLICATION;
          break;
        }
        default: {
          currentState = States.QUIT_APPLICATION;
          break;
        }
      }
      break;
    }
    case States.MAIN_MENU_ADMIN: {
      console.clear();
      console.log("Willkommen bei Questionare!\nOptionen:");
      const choice = Menu.writeMenu(Menu.menuAdmin);
      switch (choice) {
        case 0: {
          currentState = States.LIST_QUESTIONARIES_MENU;
          break;
        }
        case 1: {
          currentState = States.SEARCH_QUESTIONARY_MENU;
          break;
        }
        case 2: {
          currentState = States.CREATE_QUESTIONARY_MENU;
          break;
        }
        case 3: {
          currentState = States.USER_STATS_MENU;
          break;
        }
        case 4: {
          currentState = States.QUESTIONARY_STATS_MENU;
          break;
        }
        case 5: {
          currentState = States.QUIT_APPLICATION;
          break;
        }
        default: {
          currentState = States.QUIT_APPLICATION;
          break;
        }
      }
      break;
    }
    case States.LIST_QUESTIONARIES_MENU: {
      console.clear();
      const obj = getJsonAsObject("./jsons/questionary.json");
      const allActiveQuestionaries = obj.questionaries.filter(
        (questionary: Questionary) =>
          new Date(questionary.endDate).getTime() >= Date.now(),
      );
      console.log("Alle aktiven Umfragen:");
      const entriesPerPage = 10;
      for (
        let i = 0;
        i <
          Math.min(
            entriesPerPage,
            allActiveQuestionaries.length - (currentPage * entriesPerPage),
          );
        i++
      ) {
        console.log(
          allActiveQuestionaries[currentPage * entriesPerPage + i].title +
            " - ID:" +
            allActiveQuestionaries[currentPage * entriesPerPage + i].id,
        );
      }
      console.log("Optionen:");
      const choice = Menu.writeMenu(Menu.menuQuestionaryList);
      switch (choice) {
        case 0: {
          const obj = getJsonAsObject("./jsons/questionary.json");
          currentQuestionaryKey = parseInt(
            Validation.validatedPrompt(
              "ID der zu öffnenden Umfrage",
              Validation.isValidQuestionaryID,
              obj,
            ) as string,
          );
          currentState = States.FILLIN_QUESTIONARY_MENU;
          break;
        }
        case 1: {
          if (currentPage > 0) {
            currentPage--;
          }
          break;
        }
        case 2: {
          if (
            currentPage <
              Math.floor(allActiveQuestionaries.length / entriesPerPage) +
                (allActiveQuestionaries.length % entriesPerPage != 0 ? 0 : -1)
          ) {
            currentPage++;
          }
          break;
        }
        case 3: {
          setMainMenu();
          break;
        }
        default: {
          setMainMenu();
          break;
        }
      }
      break;
    }
    case States.SEARCH_QUESTIONARY_MENU: {
      console.clear();
      const obj = getJsonAsObject("./jsons/questionary.json");
      const input = Validation.validatedPrompt(
        "Titel der zu suchenden Umfrage:",
        Validation.isValidQuestionaryTitle,
        obj,
      );
      const foundQuestionary: Questionary = obj.questionaries.find((e: any) =>
        e.title === input
      );
      const choice = Menu.writeMenu(Menu.menuQuestionarySearch);
      switch (choice) {
        case 0: {
          break;
        }
        case 1: {
          currentQuestionaryKey = foundQuestionary.id;
          currentState = States.FILLIN_QUESTIONARY_MENU;
          break;
        }
        case 2: {
          setMainMenu();
          break;
        }
        default: {
          setMainMenu();
          break;
        }
      }
      break;
    }
    case States.FILLIN_QUESTIONARY_MENU: {
      console.clear();
      const obj = getJsonAsObject("./jsons/questionary.json");
      const currentQuestionary: Questionary = obj.questionaries.find((e: any) =>
        e.id === currentQuestionaryKey
      );
      if (
        UserSession.Instance.getFilledQuestionaries().some((e: any) =>
          e.title === currentQuestionary.title
        )
      ) {
        console.clear();
        console.log(
          "Umfrage wurde bereits ausgefüllt!\nWeiterleitung zum Hauptmenu... Bitte warten",
        );
        Deno.sleepSync(3000);
        setMainMenu();
        break;
      }
      UserSession.Instance.addQuestionary(currentQuestionary);
      console.log(currentQuestionary.title);
      for (let question of currentQuestionary.questions) {
        console.log("Frage: " + question.title);
        let index = 0;
        for (let answer of question.answers) {
          console.log(index + ": " + answer.title);
          index++;
        }
        const selection = Validation.validatedPrompt(
          "Select answer: ",
          Validation.isInRange,
          { min: 0, max: question.answers.length },
        );
        question.answers[parseInt(selection as string)].timesSelected++;
      }
      const jsonString = JSON.stringify(obj);
      Deno.writeTextFileSync("./jsons/questionary.json", jsonString);
      setMainMenu();
      break;
    }
    case States.CREATE_QUESTIONARY_MENU: {
      console.clear();
      const questionaryTitle: string | null = Validation.validatedPrompt(
        "Titel der Umfrage:",
        Validation.isNotEmpty,
      );
      const questionaryDuration: string | null = Validation.validatedPrompt(
        "Wie lange soll die Umfrage gültig sein (In Tagen)? ",
        Validation.isValidNumber,
      );

      const obj = getJsonAsObject("./jsons/questionary.json");
      let questionaryNew = new Questionary(
        obj.questionaries.length + 1,
        questionaryTitle as string,
        UserSession.Instance.getUsername() as string,
      );
      questionaryNew.endDate = new Date(
        questionaryNew.startDate.getTime() +
          parseInt(questionaryDuration as string),
      );
      const questionsAmount: number = parseInt(
        Validation.validatedPrompt(
          "Anzahl der gewünschten Fragen:",
          Validation.isInRange,
          { min: 5, max: Infinity },
        ) as string,
      );
      for (let i = 0; i < questionsAmount; i++) {
        const questionType: string | null = Validation.validatedPrompt(
          `Mögliche Fragetypen (0:YN, 1:TF, 2:RATING, 3:CUSTOM) \nGewünschter Fragetyp für Frage ${i +
            1}/${questionsAmount}: `,
          Validation.isValidQuestionType,
        );
        let questionTitle: string | null = Validation.validatedPrompt(
          `Titel der Frage ${i + 1}/${questionsAmount}: `,
          Validation.isNotEmpty,
        );

        const question = new QuestionBuilder(questionTitle as string);
        const type: QuestionTypes =
          QuestionTypes[questionType as keyof typeof QuestionTypes];
        switch (type) {
          case QuestionTypes.YN: {
            question.setYNAnswers();
            break;
          }
          case QuestionTypes.TF: {
            question.setTFAnswers();
            break;
          }
          case QuestionTypes.RATING: {
            question.setRatingAnswers();
            break;
          }
          case QuestionTypes.CUSTOM: {
            const answerAmount: string | null = Validation.validatedPrompt(
              "Anzahl an gewünschten Antworten:",
              Validation.isInRange,
              { min: 2, max: 10 },
            );
            const answerArray: string[] = [];
            for (let i = 0; i < parseInt(answerAmount as string); i++) {
              answerArray.push(Validation.validatedPrompt(
                `Antworttitel ${i + 1}/${parseInt(answerAmount as string)}: `,
                Validation.isNotEmpty,
              ) as string);
            }
            question.setCustomAnswers(answerArray);
            break;
          }
        }
        question.build();
        questionaryNew.questions.push(question);
      }
      obj.questionaries.push(questionaryNew);
      const jsonString = JSON.stringify(obj);
      Deno.writeTextFileSync("./jsons/questionary.json", jsonString);
      setMainMenu();
      break;
    }
    case States.USER_STATS_MENU: {
      console.clear();
      const filledQuestionaries = UserSession.Instance.getFilledQuestionaries();
      console.log(
        "Anzahl der ausgefüllten Umfragen: " + filledQuestionaries.length,
      );
      if (filledQuestionaries.length > 0) {
        console.log("Titel der ausgefüllten Umfragen:");
        for (let filledSingleQuestionary of filledQuestionaries) {
          console.log(filledSingleQuestionary.title);
        }
      }
      console.log("Optionen:");
      const choice = Menu.writeMenu(Menu.menuUserStats);
      switch (choice) {
        case 0: {
          setMainMenu();
          break;
        }
      }
      break;
    }
    case States.QUESTIONARY_STATS_MENU: {
      const obj = getJsonAsObject("./jsons/questionary.json");
      const QuestionariesByUser: Questionary[] = obj.questionaries.filter((
        e: any,
      ) => e.creator === UserSession.Instance.getUsername());
      for (const UserQuestionary of QuestionariesByUser) {
        console.log(
          `ID: ${UserQuestionary.id} - Title: ${UserQuestionary.title}`,
        );
      }
      const choice = Menu.writeMenu(Menu.menuQuestionaryStats);
      switch (choice) {
        case 0: {
          const input = Validation.validatedPrompt(
            "ID der Statistik",
            Validation.isInRange,
            { min: 0, max: QuestionariesByUser.length },
          );
          currentStatisticQuestionaryKey = parseInt(input as string);
          currentState = States.SPECIFIC_QUESTIONARY_STATS_MENU;
          break;
        }
        case 1: {
          setMainMenu();
          break;
        }
      }
      break;
    }
    case States.SPECIFIC_QUESTIONARY_STATS_MENU: {
      const obj = getJsonAsObject("./jsons/questionary.json");
      const currentStatisticQuestionary: Questionary = obj.questionaries
        .find((
          e: any,
        ) => e.id === currentStatisticQuestionaryKey);
      console.log(`Titel: ${currentStatisticQuestionary.title}`);
      let questionCount = 0;
      for (const question of currentStatisticQuestionary.questions) {
        console.log(` Frage Nr.${questionCount}: ${question.title}`);
        let answerCount = 0;
        for (const answer of question.answers) {
          console.log(
            ` Antwort Nr.${answerCount}: ${answer.title} - (${answer.timesSelected} ausgewählt)`,
          );
          answerCount++;
        }
        questionCount++;
      }
      console.log("Optionen:");
      const choice = Menu.writeMenu(Menu.menuUserStats);
      switch (choice) {
        case 0: {
          setMainMenu();
          break;
        }
      }
      break;
    }
    case States.LOGIN_MENU: {
      let maxTries = 3;
      do {
        console.clear();
        const username = prompt("Nutzername:");
        const password = prompt("Passwort:");
        const obj = getJsonAsObject("./jsons/logindata.json");
        const usernameEntry = obj.logins.find((e: any) =>
          e.username === username
        );
        if (usernameEntry != undefined) {
          if (usernameEntry.password === password) {
            UserSession.Instance.setUserType(UserTypes.ADMIN);
            UserSession.Instance.setUsername(usernameEntry.username);
            setMainMenu();
            break;
          } else {
            console.log("Falsches Passwort");
          }
        } else {
          console.log("Nutzer nicht gefunden");
        }
        maxTries--;
      } while (maxTries > 0);
      if (maxTries <= 0) {
        console.log(
          "Zu viele Versuche \nWeiterleitung zum Hauptmenu... Bitte warten",
        );
        Deno.sleepSync(3000);
        UserSession.Instance.setUserType(UserTypes.REGULAR);
        setMainMenu();
      }
      break;
    }
    case States.REGISTER_MENU: {
      console.clear();
      const obj = getJsonAsObject("./jsons/logindata.json");
      const username: string | null = Validation.validatedPrompt(
        "Nutzername:",
        Validation.isValidRegisterUsername,
        obj,
        3,
      );

      const password = Validation.validatedPrompt(
        "Passwort: ",
        Validation.isNotEmpty,
      );
      obj.logins.push({ username, password });
      const jsonString = JSON.stringify(obj);
      Deno.writeTextFileSync("./jsons/logindata.json", jsonString);
      UserSession.Instance.setUserType(UserTypes.REGULAR);
      setMainMenu();

      break;
    }
    default: {
      setMainMenu();
      break;
    }
  }
} while (+currentState != States.QUIT_APPLICATION);

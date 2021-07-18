/* //@ts-ignore
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts"; */
import { States } from "./States.ts";
import * as Menu from "./MenuManager.ts";
import * as Content from "./ContentManager.ts";
import { UserSession } from "./classes/UserSession.ts";
import { UserTypes } from "./classes/UserTypes.ts";
import { Questionary } from "./classes/Questionary.ts";
import * as Validation from "./classes/ValidationResult.ts";

let currentState = States.MAIN_MENU_REGULAR;
UserSession.Instance;
do {
  switch (+currentState) {
    case States.MAIN_MENU_REGULAR: {
      console.clear();
      Content.writeContent(Content.menuMain);
      const choice = Menu.writeMenu(Menu.menuRegular);
      switch (choice) {
        case 0: {
          currentState = States.LIST_QUESTIONARIES_MENU;
          break;
        }
        case 1: {
          currentState = States.USER_STATS_MENU;
          break;
        }
        case 2: {
          currentState = States.LOGIN_MENU;
          break;
        }
        case 3: {
          currentState = States.REGISTER_MENU;
          break;
        }
        case 4: {
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
      Content.writeContent(Content.menuMain);
      const choice = Menu.writeMenu(Menu.menuAdmin);
      switch (choice) {
        case 0: {
          currentState = States.LIST_QUESTIONARIES_MENU;
          break;
        }
        case 1: {
          currentState = States.CREATE_QUESTIONARY_MENU;
          break;
        }
        case 2: {
          currentState = States.USER_STATS_MENU;
          break;
        }
        case 3: {
          currentState = States.QUESTIONARY_STATS_MENU;
          break;
        }
        case 4: {
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
      Content.writeContent(Content.menuQuestionaryList);
      const choice = Menu.writeMenu(Menu.menuQuestionaryList);
      switch (choice) {
        case 0: {
          break;
        }
        case 1: {
          break;
        }
        case 2: {
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
    case States.CREATE_QUESTIONARY_MENU: {
      console.clear();
      const questionaryTitle: string | null = prompt("Titel der Umfrage:");
      if (questionaryTitle != null) {
      }
      break;
    }
    case States.LOGIN_MENU: {
      let maxTries = 3;
      do {
        console.clear();
        const username = prompt("Nutzername:");
        const password = prompt("Passwort:");
        const data = Deno.readTextFileSync("./jsons/logindata.json");
        const obj = JSON.parse(data);
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
          "Zu viele Versuche \n Weiterleitung zum Hauptmenu... Bitte warten",
        );
        Deno.sleepSync(3000);
        UserSession.Instance.setUserType(UserTypes.REGULAR);
        setMainMenu();
      }
      break;
    }
    case States.REGISTER_MENU: {
      console.clear();

      const data = Deno.readTextFileSync("./jsons/logindata.json");
      const obj = JSON.parse(data);
      const username: string | null = Validation.validatedPrompt(
        "Nutzername:",
        Validation.isValidRegisterUsername,
        obj,
        3,
      );

      const password = Validation.validatedPrompt("Passwort: ", Validation.isNotEmpty);
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

function setMainMenu(): void {
  if (UserSession.Instance.getUserType() === UserTypes.ADMIN) {
    currentState = States.MAIN_MENU_ADMIN;
  } else {
    currentState = States.MAIN_MENU_REGULAR;
  }
}

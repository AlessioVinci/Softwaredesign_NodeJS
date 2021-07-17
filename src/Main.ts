/* //@ts-ignore
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts"; */
import * as states from "./States.ts";
import * as menu from "./MenuManager.ts";
import * as content from "./ContentManager.ts";

let currentState = states.States.MAIN_MENU_REGULAR;
do {
  switch (+currentState) {
    case states.States.MAIN_MENU_REGULAR: {
      content.writeContent(content.menuRegular);
      let choice = menu.writeMenu(menu.menuRegular);
      switch (choice) {
        case 0: {
          currentState = states.States.LIST_QUESTIONARIES_MENU;
          break;
        }
        case 1: {
          console.log("ich zeig dir alle Umfragen an");
          break;
        }
        case 2: {
          currentState = states.States.LOGIN_MENU;
          break;
        }
        case 3: {
          currentState = states.States.REGISTER_MENU;
          break;
        }
      }
      break;
    }
    case states.States.MAIN_MENU_ADMIN: {
      let choice = menu.writeMenu(menu.menuRegular);
      switch (choice) {
        case 0: {
          currentState = states.States.LIST_QUESTIONARIES_MENU;
          break;
        }
        case 1: {
          currentState = states.States.CREATE_QUESTIONARY_MENU;
          break;
        }
        case 2: {
          currentState = states.States.LOGIN_MENU;
          break;
        }
        case 3: {
          currentState = states.States.REGISTER_MENU;
          break;
        }
      }
      break;
    }
    case states.States.LIST_QUESTIONARIES_MENU: {
      content.writeContent(content.menuQuestionaryList);
      let choice = menu.writeMenu(menu.menuQuestionaryList);
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
          currentState = states.States.MAIN_MENU_REGULAR;
          break;
        }
      }
      break;
    }
    case states.States.LOGIN_MENU: {
      let maxTries: number = 3;
      do {
        let username = prompt("Nutzername:");
        let password = prompt("Passwort:");
        let data = Deno.readTextFileSync("./jsons/logindata.json");
        let obj = JSON.parse(data);
        let usernameEntry = obj.logins.find((e: any) =>
          e.username === username
        );
        if (usernameEntry != undefined) {
          if (usernameEntry.password === password) {
            currentState = states.States.MAIN_MENU_ADMIN;
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
        currentState = states.States.MAIN_MENU_REGULAR;
      }
      break;
    }
    case states.States.REGISTER_MENU: {
      let validation: boolean = false;
      do {
        let username: string | null = prompt("Nutzername:");
        if (username === null) {
          username = "";
        }
        let usernameRegex: RegExp = new RegExp("^[a-zA-Z0-9]+$");
        let data = Deno.readTextFileSync("./jsons/logindata.json");
        let obj = JSON.parse(data);
        let usernameEntry = obj.logins.find((e: any) =>
          e.username === username
        );
        if (
          usernameEntry == undefined && usernameRegex.test(username) == true
        ) {
          validation = true;
          let password = prompt("Passwort:");
          obj.logins.push({ username, password });
          let jsonString = JSON.stringify(obj);
          Deno.writeTextFileSync("./jsons/logindata.json", jsonString);
          currentState = states.States.MAIN_MENU_REGULAR;
        } else {
          console.log(
            "Nutzername bereits vergeben oder ungültig (nur alphanumerisch)",
          );
        }
      } while (validation == false);
      break;
    }
  }
} while (+currentState != states.States.QUIT_APPLICATION);

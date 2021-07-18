import { QuestionTypes } from "./QuestionTypes.ts";
import { Questionary } from "./Questionary.ts";
import { UserSession } from "./UserSession.ts";

export class ValidationResult {
  isValid: boolean;
  message: string;
  constructor(valid: boolean = false, msg: string = "") {
    this.isValid = valid;
    this.message = msg;
  }
}

export function validatedPrompt(
  message: string,
  validator: (str: string | null, context: any) => ValidationResult,
  context: any = undefined,
  tries = Infinity,
): string | null {
  let input;
  let validationResult;
  do {
    //console.clear();
    if (validationResult && !validationResult.isValid) {
      console.log(validationResult.message);
    }
    input = prompt(message);
    validationResult = validator(input, context);
    tries--;
  } while (!validationResult.isValid && (tries > 0));
  return (tries > 0 ? input : null);
}

export const isValidRegisterUsername = (input: string | null, context: any) => {
  const usernameRegex = new RegExp("^[a-zA-Z0-9]+$");
  if (input === null) {
    return new ValidationResult(false, "Nutzername kann nicht leer sein!");
  }
  if (!usernameRegex.test(input)) {
    return new ValidationResult(
      false,
      "Invalide Zeichen! Nur alphanumerische Zeichen erlaubt!",
    );
  }
  //Context is logindata.json Object
  if (context.logins.some((e: any) => e.username === input)) {
    return new ValidationResult(false, "Nutzername bereits vergeben!");
  }
  return new ValidationResult(true);
};

export const isNotEmpty = (input: string | null) => {
  if (input === null) {
    return new ValidationResult(false, "Input kann nicht leer sein!");
  }
  return new ValidationResult(true);
};

export const isValidNumber = (input: string | null) => {
  const numberRegex = new RegExp("^[0-9]+$");
  if (input === null) {
    return new ValidationResult(false, "Input kann nicht leer sein!");
  }
  if (!numberRegex.test(input)) {
    return new ValidationResult(
      false,
      "Invalide Zeichen! Nur Zahlen erlaubt!",
    );
  }
  return new ValidationResult(true);
};

export const isInRange = (input: string | null, context: any) => {
  const isNumber: ValidationResult = isValidNumber(input);
  if (isNumber.isValid) {
    const intput = parseInt(input as string);
    if (intput >= context.min && intput <= context.max) {
      return new ValidationResult(true);
    }
    return new ValidationResult(
      false,
      `Zahl muss zwischen ${context.min} und ${context.max} liegen!`,
    );
  }
  return isNumber;
};

export const isValidQuestionType = (input: string | null) => {
  const result: ValidationResult = isNotEmpty(input);
  if (result.isValid) {
    if (QuestionTypes[input as keyof typeof QuestionTypes] === undefined) {
      return new ValidationResult(false, "Invalider Fragetyp");
    }
    return new ValidationResult(true);
  }
  return result;
};

export const isValidQuestionaryID = (input: string | null, context: any) => {
  const result: ValidationResult = isValidNumber(input);
  if (result.isValid) {
    //Context is questionary.json Object
    if (
      context.questionaries.some((e: any) => e.id === parseInt(input as string))
    ) {
      const foundQuestionary: Questionary = context.questionaries.find((
        e: any,
      ) => e.id === parseInt(input as string));
      if (foundQuestionary.creator === UserSession.Instance.getUsername()) {
        return new ValidationResult(
          false,
          "Du darfst keine von dir erstellte Umfrage ausfüllen!",
        );
      }
      return new ValidationResult(true);
    }
    return new ValidationResult(
      false,
      "Es existiert keine Umfrage mit dieser ID!",
    );
  }
  return result;
};

export const isValidQuestionaryTitle = (input: string | null, context: any) => {
  const result: ValidationResult = isNotEmpty(input);
  if (result.isValid) {
    if (
      //Context is questionary.json Object
      context.questionaries.some((e: any) => e.title === input)
    ) {
      /* if (
        UserSession.Instance.getFilledQuestionaries().some((e: any) =>
          e.title === input
        )
      ) {
        return new ValidationResult(false, "Umfrage wurde bereits ausgefüllt");
      } */
      return new ValidationResult(true);
    }
    return new ValidationResult(
      false,
      "Es existiert keine Umfrage mit diesem Titel!",
    );
  }
  return result;
};

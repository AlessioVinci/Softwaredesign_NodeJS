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
  context = undefined,
  tries = Infinity,
): string | null {
  let input;
  let validationResult;
  do {
    console.clear();
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
  if (input !== context.logins.find((e: any) => e.username === input)) {
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

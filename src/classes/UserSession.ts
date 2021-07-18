import { Questionary } from "./Questionary.ts";
import { UserTypes } from "./UserTypes.ts";

export class UserSession {
  private static _instance: UserSession;

  private _userType: UserTypes;
  private _filledQuestionariesByID: number[];
  private _username?: string;

  private constructor() {
    this._userType = UserTypes.REGULAR;
    this._filledQuestionariesByID = [];
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  setUserType(type: UserTypes) {
    this._userType = type;
  }

  getUserType() {
    return this._userType;
  }

  setUsername(username: string) {
    this._username = username;
  }

  getUsername() {
    return this._username;
  }

  addQuestionary(questionaryID: number) {
    this._filledQuestionariesByID.push(questionaryID);
  }

  getFilledQuestionaries() {
    return this._filledQuestionariesByID;
  }
}

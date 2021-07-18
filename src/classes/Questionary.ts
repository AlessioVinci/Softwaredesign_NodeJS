import { Question } from "./Question.ts";

export class Questionary {
  private _id: number;
  private _title: string;
  private _questions: Question[];
  private _startDate: Date;
  private _endDate: Date;
  private _creator: string;

  constructor(id: number, title: string, creator: string) {
    this._id = id;
    this._title = title;
    this._questions = [];
    this._startDate = new Date(Date.now());
    this._endDate = this._startDate;
    this._creator = creator;
  }

  addQuestion(question: Question) {
    this._questions.push(question);
  }

  setEndDate(days: number) {
    this._endDate = new Date(this._startDate.getDate() + (days * 24 * 60 * 60 * 1000));
  }
}
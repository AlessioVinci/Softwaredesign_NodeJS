import { Question } from "./Question.ts";

export class Questionary {
  id: number;
  title: string;
  questions: Question[];
  startDate: Date;
  endDate: Date;
  creator: string;

  constructor(id: number, title: string, creator: string) {
    this.id = id;
    this.title = title;
    this.questions = [];
    this.startDate = new Date(Date.now());
    this.endDate = this.startDate;
    this.creator = creator;
  }
}

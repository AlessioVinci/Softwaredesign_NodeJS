import { Question } from "./Question.ts";
import { Answer } from "./Answer.ts";

export class QuestionBuilder {
  private _title: string;
  private _answers: Answer[] = [];

  constructor(title: string) {
    this._title = title;
  }

  setYNAnswers() {
    this._answers = [new Answer("Yes"), new Answer("No")];
    return this;
  }

  setTFAnswers() {
    this._answers = [new Answer("True"), new Answer("False")];
    return this;
  }

  setRatingAnswers() {
    this._answers = [
      new Answer("5/5"),
      new Answer("4/5"),
      new Answer("3/5"),
      new Answer("2/5"),
      new Answer("1/5"),
    ];
    return this;
  }

  setCustomAnswers(answerTextArray: string[]) {
    const allAnswers: Answer[] = [];
    for (const answerText in answerTextArray) {
      allAnswers.push(new Answer(answerText));
    }
  }

  build() {
    return new Question(this);
  }

  get title() {
    return this._title;
  }

  get answers() {
   return this._answers;
  }
}

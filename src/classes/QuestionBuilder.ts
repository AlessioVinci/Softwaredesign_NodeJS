import { Question } from "./Question.ts";
import { Answer } from "./Answer.ts";

export class QuestionBuilder {
  private title: string;
  private answers: Answer[] = [];

  constructor(title: string) {
    this.title = title;
  }

  setYNAnswers() {
    this.answers = [new Answer("Yes"), new Answer("No")];
    return this;
  }

  setTFAnswers() {
    this.answers = [new Answer("True"), new Answer("False")];
    return this;
  }

  setRatingAnswers() {
    this.answers = [
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
    for (const answerText of answerTextArray) {
      allAnswers.push(new Answer(answerText));
    }
    this.answers = allAnswers;
  }

  build() {
    return new Question(this);
  }

  get getTitle() {
    return this.title;
  }

  get getAnswers() {
    return this.answers;
  }
}

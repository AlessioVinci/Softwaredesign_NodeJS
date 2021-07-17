import { QuestionBuilder } from "./QuestionBuilder.ts";
import { Answer } from "./Answer.ts";

export class Question {
  title: string;
  answers: Answer[];
  constructor(questionBuilder: QuestionBuilder) {
    this.title = questionBuilder.title;
    this.answers = questionBuilder.answers;
  }
}

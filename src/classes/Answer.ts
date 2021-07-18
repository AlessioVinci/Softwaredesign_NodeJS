export class Answer {
  title: string;
  timesSelected: number;

  constructor(title: string) {
    this.title = title;
    this.timesSelected = 0;
  }
}

export class Answer {
  private _title: string;
  private _timesSelected: number;

  constructor(title: string) {
    this._title = title;
    this._timesSelected = 0;
  }
}

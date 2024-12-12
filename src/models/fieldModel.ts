export default class Field {
  constructor(
    public display: string,
    public name: string,
    public type: string,
    public options: string[] = []
  ) {}
}

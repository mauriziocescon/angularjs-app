export class Enum {

  public static toEnum(val: string): Enum {
    return new Enum(val);
  }

  protected value: string;

  constructor(value: string) {
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}

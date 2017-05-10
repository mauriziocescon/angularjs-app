export class KeyValue {
    protected _key: any;
    protected _value: any;

    constructor(key: any, value: any) {
        this._key = key;
        this._value = value;
    }

    public get key(): any {
        return this._key;
    }

    public get value(): any {
        return this._value;
    }
}

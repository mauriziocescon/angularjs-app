export class KeyValue {
	private _key: any;
	private _value: any;

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
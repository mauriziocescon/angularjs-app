import {Enum} from "../../shared/shared.module";

export interface IUIUtilitiesConstants {
	CurrencyCode: CurrencyCode;
	CurrencyChar: CurrencyChar;
}

export class CurrencyCode {
	EUR = new Enum("EUR");
	USD = new Enum("USD");
	GBP = new Enum("GBP");
}

export class CurrencyChar {
	EUR = new Enum("€");
	USS = new Enum("$");
	GBP = new Enum("£");
}

class UIUtilitiesConstants implements IUIUtilitiesConstants {
	protected currencyCode: CurrencyCode;
	protected currencyChar: CurrencyChar;

	constructor() {
		this.currencyCode = new CurrencyCode();
		this.currencyChar = new CurrencyChar();
	}

	public get CurrencyCode(): CurrencyCode {
		return this.currencyCode;
	}

	public get CurrencyChar(): CurrencyChar {
		return this.currencyChar;
	}
}

export const uiUtilitiesConstants = new UIUtilitiesConstants();
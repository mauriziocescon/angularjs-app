// tslint:disable:max-classes-per-file
import { Enum } from "../../shared/shared.module";

export interface IUIUtilitiesConstants {
    CurrencyCode: CurrencyCode;
    CurrencyChar: CurrencyChar;
}

export class CurrencyCode {
    public EUR = new Enum("EUR");
    public USD = new Enum("USD");
    public GBP = new Enum("GBP");
}

export class CurrencyChar {
    public EUR = new Enum("€");
    public USS = new Enum("$");
    public GBP = new Enum("£");
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

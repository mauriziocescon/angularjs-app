import {Logger} from "./logger";

export class TypeDetect {

	public static isFunction(obj: any): boolean {
		try {
			return obj != undefined && Object.prototype.toString.call(obj) === "[object Function]";
		} catch (e) {
			Logger.exception(this, e);
			throw e;
		}
	}

	public static isArray(obj: any): boolean {
		try {
			return obj != undefined && Object.prototype.toString.call(obj) === "[object Array]";
		} catch (e) {
			Logger.exception(this, e);
			throw e;
		}
	}

	public static isNumber(obj: any): boolean {
		try {
			return obj != undefined && !isNaN(parseFloat(obj)) && isFinite(obj);
		} catch (e) {
			Logger.exception(this, e);
			throw e;
		}
	}

	public static isString(obj: any): boolean {
		try {
			return obj != undefined && Object.prototype.toString.call(obj) === "[object String]";
		} catch (e) {
			Logger.exception(this, e);
			throw e;
		}
	}

	public static isDate(obj: any): boolean {
		try {
			return obj != undefined && Object.prototype.toString.call(obj) === "[object Date]";
		} catch (e) {
			Logger.exception(this, e);
			throw e;
		}
	}

	public static isObject(obj: any): boolean {
		try {
			return obj != undefined && Object.prototype.toString.call(obj) === "[object Object]";
		} catch (e) {
			Logger.exception(this, e);
			throw e;
		}
	}
}
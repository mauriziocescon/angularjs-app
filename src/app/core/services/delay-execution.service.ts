import {Enum} from "../../shared/shared.module";

/**
 * Delay the execution of a function.
 *
 * Every new call to execute a func,
 * invalidates potential previous one
 * waiting to be executed
 */
export interface IDelayExecutionService {
	/**
	 * Save a reference to func using key and
	 * set a timeout to the execution of func
	 * after delay. Potential timeout associated
	 * to the same key is canceled
	 *
	 * @param func
	 * @param key
	 * @param delay
	 */
	execute(func: Function, key: Enum, delay?: number): void;
	/**
	 * Cancel the execution of
	 * func with key
	 *
	 * @param key
	 */
	cancel(key: Enum): void;
}

export class DelayExecutionService implements IDelayExecutionService {
	private timeout: ng.ITimeoutService;
	private functionList: {[key: string]: ng.IPromise<any>};

	static $inject = ["$timeout"];

	constructor($timeout: ng.ITimeoutService) {
		this.timeout = $timeout;
		this.functionList = {};
	}

	public execute(func: () => void, key: Enum, delay?: number): void {
		this.cancel(key);

		if (delay != undefined && delay > 0) {
			this.functionList[key.toString()] = this.timeout(func, delay);
		} else {
			func();
		}
	}

	public cancel(key: Enum): void {
		if (this.functionList[key.toString()]) {
			this.timeout.cancel(this.functionList[key.toString()]);
			this.functionList[key.toString()] = undefined;
		}
	}
}
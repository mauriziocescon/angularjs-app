export class ResponseWs<T> {
	private success: boolean;
	private message: string;
	private data: T;
	private lastPage: boolean;
	private abort: boolean;

	constructor(success: boolean, message: string, data: T, lastPage: boolean, abort: boolean) {
		this.success = success;
		this.message = message;
		this.data = data;
		this.lastPage = lastPage;
		this.abort = abort;
	}

	isSuccess(): boolean {
		return this.success;
	}

	getMessage(): string {
		return this.message;
	}

	getData(): T {
		return this.success ? this.data : undefined;
	}

	isLastPage(): boolean {
		return this.lastPage;
	}

	hasBeenCanceled(): boolean {
		return this.abort == true;
	}
}
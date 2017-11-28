import * as StackTrace from "stacktrace-js";

import { TypeDetect } from "./type-detect";

import { environment } from "../../../environments/environment";

export class Logger {

    public static exception(scope: any, exc: Error): void {
        try {
            const errback = (err: Error) => {
                // tslint:disable:no-console
                console.log(err.message);
                // tslint:enable:no-console
            };

            const callback = (stackframes: StackTrace.StackFrame[]) => {

                let location = "ERROR";
                try {
                    location += " in " + Logger.getPath(window.location.href.toString());
                } catch (e) {
                    Logger.log("Logger.exception get location: " + e.message);
                }

                // get className
                let className = "ANONYMOUS_CALLER";
                try {
                    if (["constructor"]) {
                        const funcNameRegex = /function (.{1,})\(/;
                        const constructor = "constructor";
                        const results = (funcNameRegex).exec(scope[constructor].toString());
                        if (results && results.length > 1) {
                            className = results[1];
                        }
                    }
                } catch (e) {
                    Logger.log("Logger.exception get className: " + e.message);
                }

                const stringifiedStack = stackframes.map((sf: StackTrace.StackFrame) => {
                    return sf.toString();
                }).join("\n");

                const exceptionMessage = exc.message && exc.message.length > 0 ? exc.message : "NO_MESSAGE";
                const exceptionName = exc.name && exc.name.length > 0 ? exc.name : "NO_NAME";

                const msg = "\n" + location + "\n" + className + " : " + exceptionName + " : " + decodeURI(exceptionMessage) + " at\n" + decodeURI(stringifiedStack) + "\n\n";
                Logger.log(msg);

                if (!environment.production) {
                    alert(msg);
                }
            };

            StackTrace.fromError(exc)
                .then(callback)
                .catch(errback);

        } catch (e) {
            Logger.log("Logger.exception: " + e.message);
        }
    }

    public static log(mex: string, ...args: any[]): void {
        // tslint:disable:no-console
        if (console !== undefined) {
            console.log(mex);
        }
        // tslint:enable:no-console
    }

    public static warn(mex: string, ...args: any[]) {
        // tslint:disable:no-console
        if (console !== undefined) {
            console.warn(mex);
        }
        // tslint:enable:no-console
    }

    protected static getPath(url: string): string {
        try {

            if (TypeDetect.isString(url) === false || !url || url.length === 0) {
                return "/";
            }

            let returnPath = url.indexOf("#") === -1 ? (url.startsWith("/") === true ? url : "/") : url.slice(url.indexOf("#") + 1);

            if (returnPath[returnPath.length - 1] !== "/") {
                returnPath = returnPath + "/";
            }

            return returnPath;
        } catch (e) {
            Logger.exception(this, e);
            return "/";
        }
    }
}

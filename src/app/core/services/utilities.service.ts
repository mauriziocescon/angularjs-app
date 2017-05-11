import * as angular from "angular";

import { AngularStats } from "angular-stats";

import { Logger, TypeDetect } from "../../shared/shared.module";

import { IAppConstantsService } from "./app-constants.service";

/**
 * Generic utilities
 */
export interface IUtilitiesService {
    /**
     * Defer the calling of func
     *
     * @param func
     * @param n
     * @param scope
     * @param args
     */
    defer(func: Function, n: number, scope: any, ...args: any[]): ng.IPromise<any>; // tslint:disable-line:ban-types
    /**
     * Cancel the defer func
     *
     * @param promise
     */
    clearDefer(promise: ng.IPromise<any>): void;
    /**
     * Call func on a particular scope
     *
     * @param func
     * @param scope
     * @param args
     */
    call(func: Function, scope: any, ...args: any[]): void; // tslint:disable-line:ban-types
    /**
     * Deeply copy the object
     *
     * @param original
     */
    clone<T>(original: T): T;
    /**
     * Compare the objects
     * using angular equal
     *
     * @param value1
     * @param value2
     */
    equals<T>(value1: T, value2: T): boolean;
    /**
     * Create a unique id
     */
    createUUID(): string;
    /**
     * Determine is a string is
     * not undefined and not empty
     *
     * @param text
     */
    isDefinedAndNotEmpty(text: string): boolean;
    /**
     * Java style format
     *
     * @param text accepts %[argument_index$][flags][width][.precision]conversion
     * @param param
     */
    formatString(text: string, ...params: Array<string | number>): string;
    /**
     * Get today
     */
    getToday(): Date;
    /**
     * Get now
     */
    getNow(): Date;
    /**
     * Get absolute time
     */
    getTimeFrom1970(): number;
    /**
     * Add a script to the DOM
     * and load it
     *
     * @param src
     */
    addScript(src: string): void;
    /**
     *
     * @param url
     */
    getPath(url: string): string;
    /**
     *
     */
    getCurrentPath(): string;
    /**
     * Return params of a url
     *
     * @param url
     */
    parseQueryString(url): any;
    /**
     * Count the number of scopes / watchers
     * for every component. Analyze the DOM
     */
    analyzeWebApp(): string;
    /**
     * Log an $http request
     *
     * @param url
     * @param requestData
     */
    logRequest(url: string, requestData?: any): void;
    /**
     * Log an $http response
     *
     * @param url
     * @param requestData
     */
    logResponse(response: ng.IHttpPromiseCallbackArg<any> | Array<ng.IHttpPromiseCallbackArg<any>>, startTime: number): void;
    /**
     * Create a random response
     * with common http code
     *
     * @param data
     * @param headers
     */
    randomHttpStatusCode(data?: any, headers?: any): any;
    /**
     * Parse link property
     * inside headers
     *
     * @param headers
     */
    parseLinkHeaders(headers: any): any;
}

export class UtilitiesService implements IUtilitiesService {
    public static $inject = ["$rootScope", "$document", "$window", "$timeout", "AngularStats", "AppConstantsService"];

    protected static WARNING_TIME_SCOPE = 1000;

    protected rootScope: ng.IRootScopeService;
    protected document: ng.IDocumentService;
    protected window: ng.IWindowService;
    protected timeout: ng.ITimeoutService;
    protected angularStats: AngularStats;
    protected appConstantsService: IAppConstantsService;

    constructor($rootScope: ng.IRootScopeService,
                $document: ng.IDocumentService,
                $window: ng.IWindowService,
                $timeout: ng.ITimeoutService,
                AngularStats: AngularStats,
                AppConstantsService: IAppConstantsService) {
        this.rootScope = $rootScope;
        this.document = $document;
        this.window = $window;
        this.timeout = $timeout;
        this.angularStats = AngularStats;
        this.appConstantsService = AppConstantsService;
    }

    // tslint:disable-next-line:ban-types
    public defer(func: Function, n: number, scope: any, ...args: any[]): ng.IPromise<any> {
        return this.timeout(() => {
            func.apply(scope, args);
        }, n);
    }

    public clearDefer(promise: ng.IPromise<any>): void {
        if (promise) {
            this.timeout.cancel(promise);
        }
    }

    // tslint:disable-next-line:ban-types
    public call(func: Function, scope: any, ...args: any[]): void {
        func.apply(scope, args);
    }

    public clone<T>(original: T): T {
        if (original !== undefined) {
            return angular.copy(original);
        } else {
            return original;
        }
    }

    public equals<T>(value1: T, value2: T): boolean {
        return angular.equals(value1, value2);
    }

    public createUUID(): string {
        // tslint:disable:no-bitwise
        let d = new Date().getTime();
        if (this.window.performance && typeof this.window.performance.now === "function") {
            d += performance.now(); // use high-precision timer if available
        }
        const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        // tslint:enable:no-bitwise
        return uuid;
    }

    public isDefinedAndNotEmpty(text: string): boolean {
        if (!TypeDetect.isString(text) || text === "") {
            return false;
        }

        return (text as string).replace(/^\s*/, "").replace(/\s*$/, "").length > 0;
    }

    public formatString(text: string, ...params: Array<string | number>): string {
        if (this.isDefinedAndNotEmpty(text) === false || params === undefined || params.length === 0) {
            return text;
        } else {
            // "arguments": https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
            // format method from format4js library
            const format = "format";
            return String[format].apply(this, arguments);
        }
    }

    public getToday(): Date {
        const now = this.getNow();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    public getNow(): Date {
        return new Date();
    }

    public getTimeFrom1970(): number {
        return this.getNow().getTime();
    }

    public addScript(src: string): void {
        if (this.document[0].readyState === "complete" || this.document[0].readyState === "interactive") {
            const script: HTMLScriptElement = this.document[0].createElement("script");
            script.setAttribute("src", src);
            script.setAttribute("type", "text/javascript");
            script.setAttribute("charset", "utf-8");
            const head: HTMLElement = this.document[0].getElementById("head");
            head.appendChild(script);
        }
        else {
            const line = "<script type='text/javascript' charset='utf-8' src='" + src + "'></script>";
            this.document[0].writeln(line);
        }
    }

    public getPath(url: string): string {
        if (TypeDetect.isString(url) === false || this.isDefinedAndNotEmpty(url) === false) {
            return "/";
        }

        return url.indexOf("!") === -1 ? (url.startsWith("/") === true ? url : "/") : url.slice(url.indexOf("!") + 1);
    }

    public getCurrentPath(): string {
        const path = this.getPath(window.location.href.toString());

        if (this.isDefinedAndNotEmpty(path) === true) {
            return path;
        } else {
            return "/";
        }
    }

    public parseQueryString(url: string): any {
        const urlParams = {};

        url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), (substring: string, ...args: any[]) => {
            return urlParams[args[0]] = args[2];
        });

        return urlParams;
    }

    public analyzeWebApp(): string {
        return this.angularStats.analyzeWebApp();
    }

    public logRequest(url: string, requestData?: any): void {
        if (this.appConstantsService.Application.LOG_WS_REQUEST === true) {
            let log = "\nREQUEST BODY (" + url;
            log += "): \n" + requestData ? JSON.stringify(requestData, null, 2) : "" + "\n\n";
            Logger.log(log);
        }
    }

    public logResponse(response: ng.IHttpPromiseCallbackArg<any> | Array<ng.IHttpPromiseCallbackArg<any>>, startTime: number): void {
        if (this.appConstantsService.Application.LOG_WS_RESPONSE === true) {

            const time = (this.getTimeFrom1970() - startTime).toString();

            if (TypeDetect.isArray(response)) {
                const rs = response as Array<ng.IHttpPromiseCallbackArg<any>>;
                rs.forEach((r: ng.IHttpPromiseCallbackArg<any>) => {
                    Logger.log("\nRESPONSE BODY: (" + r.config.method + " " + r.config.url +
                        ", Status: " + r.status.toString() +
                        ", StatusText: " + r.statusText +
                        ") in " + time + " ms \n" +
                        JSON.stringify(r.data, null, 2) + "\n\n\n\n");
                });
            }
            else {
                const r = response as ng.IHttpPromiseCallbackArg<any>;
                Logger.log("\nRESPONSE BODY: (" + r.config.method + " " + r.config.url +
                    ", Status: " + r.status.toString() +
                    ", StatusText: " + r.statusText +
                    ") in " + time + " ms \n" +
                    JSON.stringify(r.data, null, 2) + "\n\n\n\n");
            }
        }
    }

    public randomHttpStatusCode(data?: any, headers?: any): any {
        const choice = Math.random();

        if (choice < 0.005) {
            return [300, data, headers, "Multiple Choices"];
        }
        else if (choice < 0.01) {
            return [301, data, headers, "Moved Permanently"];
        }
        else if (choice < 0.015) {
            return [302, data, headers, "Found"];
        }
        else if (choice < 0.02) {
            return [304, data, headers, "Not Modified"];
        }
        else if (choice < 0.025) {
            return [307, data, headers, "Temporary Redirect"];
        }
        else if (choice < 0.03) {
            return [400, data, headers, "Bad Request"];
        }
        else if (choice < 0.035) {
            return [401, data, headers, "Unauthorized"];
        }
        else if (choice < 0.04) {
            return [403, data, headers, "Forbidden"];
        }
        else if (choice < 0.045) {
            return [404, data, headers, "Not Found"];
        }
        else if (choice < 0.05) {
            return [410, data, headers, "Gone"];
        }
        else if (choice < 0.055) {
            return [500, data, headers, "Internal Server Error"];
        }
        else if (choice < 0.06) {
            return [501, data, headers, "Not Implemented"];
        }
        else if (choice < 0.065) {
            return [503, data, headers, "Service Unavailable"];
        }
        else if (choice < 0.07) {
            return [550, data, headers, "Permission denied"];
        }

        return [200, data, headers, "OK"];
    }

    public parseLinkHeaders(headers: ng.IHttpHeadersGetter): any {
        if (headers && headers("link") && headers("link").length === 0) {
            throw new Error("input must not be of zero length");
        }

        // Split parts by comma
        const parts = headers("link").split(",");
        const links = {};

        if (parts.length > 1) {
            // Parse each part into a named link
            for (const part of parts) {
                const section = part.split(";");
                if (section.length !== 2) {
                    throw new Error("section could not be split on ';'");
                }
                const url = section[0].replace(/<(.*)>/, "$1").trim();
                const name = section[1].replace(/rel="(.*)"/, "$1").trim();
                links[name] = url;
            }
        }

        return links;
    }
}

declare namespace frisby {

    export function globalSetup(request: IFrisbyGlobalSetup): IFrisbyGlobalSetup;

    export function create(msg: string): IFrisby;

    interface IFrisbyGlobalSetup {
        request?: IGlobalSetupRequest;
    }

    interface IGlobalSetupRequest {
        headers?: any;
        inspectOnFailure?: boolean;
        json?: boolean;
        baseUri?: string;
    }

    interface IFrisby {

        constructor(msg: string): IFrisby;

        /**
         * Timeout getter and setter
         * @param int Timeout in seconds
         *
         * @return IFrisby
         */
        timeout: (int: number) => IFrisby;

        /**
         *  Reset Frisby global and setup options
         *
         *  @return IFrisby
         */
        reset: () => IFrisby;

        /**
         * Set negation test
         *
         * @return IFrisby
         */
        not: () => IFrisby;

        /**
         *  Add HTTP header by key and value
         *
         *  @param header header key
         *  @param content header value content
         *
         *  @return IFrisby
         */
        addHeader: (header: string, content: string) => IFrisby;

        /**
         * Add group of HTTP headers together
         *
         * @param headers header value content
         *
         * @return IFrisby
         */
        addHeaders: (headers: Array<{header: string, content: string}>) => IFrisby;

        /**
         * Set group of HTTP headers together
         *
         * @param headers header value content
         *
         * @return IFrisby
         */
        setHeaders: (headers: Array<{header: string, content: string}>) => IFrisby;

        /**
         * Remove HTTP header from outgoing request by key
         *
         * @param key header key
         *
         * @return IFrisby
         */
        removeHeader: (key: string) => IFrisby;

    }
}

export = frisby;

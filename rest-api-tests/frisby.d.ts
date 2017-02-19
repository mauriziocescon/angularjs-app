declare namespace frisby {

    export function globalSetup(request: IFrisbyGlobalSetup): IFrisbyGlobalSetup;

    export  function create(msg: string): Frisby;

    interface IFrisbyGlobalSetup {
        request?: IGlobalSetupRequest;
    }

    interface IGlobalSetupRequest {
        headers?: Object;
        inspectOnFailure?: boolean;
        json?: boolean;
        baseUri?: string;
    }

    interface Frisby {

        constructor(msg: string): Frisby;

        /**
         * Timeout getter and setter
         * @param int Timeout in seconds
         *
         * @return IFrisby
         */
        timeout: (int: number)=> Frisby;

        /**
         *  Reset Frisby global and setup options
         *
         *  @return IFrisby
         */
        reset: ()=> Frisby;

        /**
         * Set negation test
         *
         * @return IFrisby
         */
        not: ()=> Frisby;

        /**
         *  Add HTTP header by key and value
         *
         *  @param header header key
         *  @param content header value content
         *
         *  @return IFrisby
         */
        addHeader: (header: string, content: string)=> Frisby;

        /**
         * Add group of HTTP headers together
         *
         * @param headers header value content
         *
         * @return IFrisby
         */
        addHeaders: (headers: Array<{header: string, content: string}>)=> Frisby;

        /**
         * Set group of HTTP headers together
         *
         * @param headers header value content
         *
         * @return IFrisby
         */
        setHeaders: (headers: Array<{header: string, content: string}>)=> Frisby;

        /**
         * Remove HTTP header from outgoing request by key
         *
         *@param key header key
         *
         * @return IFrisby
         */
        removeHeader: (key: string)=> Frisby;

    }
}


export = frisby;
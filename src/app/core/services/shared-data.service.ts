import { Enum } from "../../shared/shared.module";

/**
 * Helper to share global variables
 */
export interface ISharedDataService {
    /**
     * Get a value for a
     * particular key
     *
     * @param key
     * @param defaultValue returned value if there is no cache with key
     */
    getValue<T>(key: Enum, defaultValue?: any): T;
    /**
     * Set value for key
     *
     * @param key
     * @param value
     */
    setValue(key: Enum, value: any): void;
    /**
     * Remove value for key
     * @param key
     */
    removeValue(key: Enum): void;
    /**
     * Remove all values
     */
    reset(): void;
}

export class SharedDataService implements ISharedDataService {
    private dictionary: any;

    constructor() {
        this.dictionary = {};
    }

    public getValue(key: Enum, defaultValue?: any): any {
        const value = this.dictionary[key.toString()];
        return value !== undefined ? value : defaultValue;
    }

    public setValue(key: Enum, value: any): void {
        this.dictionary[key.toString()] = value;
    }

    public removeValue(key: Enum): void {
        this.dictionary[key.toString()] = undefined;
    }

    public reset(): void {
        this.dictionary = {};
    }
}

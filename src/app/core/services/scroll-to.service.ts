import { TypeDetect } from "../../shared/shared.module";

/**
 * Window scrolling
 * in code
 */
export interface IScrollToService {
    /**
     * Scroll to a particular
     * position
     *
     * @param scrollPosition
     */
    scrollTo(scrollPosition: number): void;
    /**
     * Scroll to the bottom
     * of the page
     */
    scrollToBottom(): void;
    /**
     * Scroll to the top
     * of the page
     */
    scrollToTop(): void;
    /**
     * Scroll to a particular
     * position of the page
     */
    getScrollPosition(): number;
}

export class ScrollToService implements IScrollToService {
    public static $inject = ["$document", "$window", "$timeout"];

    constructor(protected document: ng.IDocumentService,
                protected window: ng.IWindowService,
                protected timeout: ng.ITimeoutService) {
    }

    public scrollTo(scrollPosition: number): void {
        if (TypeDetect.isNumber(scrollPosition)) {
            this.window.scrollTo(0, scrollPosition);
            this.timeout(() => {
                this.window.scrollTo(0, scrollPosition);
            }, 25);
        }
    }

    public scrollToBottom(): void {
        this.timeout(() => {
            this.window.scrollTo(0, this.window.pageYOffset);
        }, 10);
    }

    public scrollToTop(): void {
        this.timeout(() => {
            this.window.scrollTo(0, 0);
        }, 10);
    }

    public getScrollPosition(): number {
        return this.window.pageYOffset;
    }
}

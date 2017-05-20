import { browser } from "protractor";

describe("Protractor Demo App", () => {
    it("should have a title", () => {
        browser.get("index.html");

        browser.getTitle().then((title: string) => {
            expect(title).toEqual("Demo");
        });
    });
});

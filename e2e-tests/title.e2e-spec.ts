import {browser, element, by, By, $, $$, ExpectedConditions} from "protractor";

describe("Protractor Demo App", ()=> {
    it("should have a title", ()=> {
        browser.get("index.html");

        expect(browser.getTitle()).toEqual("Demo");
    });
});
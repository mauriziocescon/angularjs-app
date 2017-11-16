exports.config = {
    framework: "jasmine",
    baseUrl: "http://localhost:8000/",
    rootElement: "#protractor-root",
    specs: [
        "./e2e-tests/tmp/**/*.e2e-spec.js",
    ],
    multiCapabilities: [
        // {browserName: "safari"},
        // { browserName: "firefox" },
        {browserName: "chrome"},
    ],
    jasmineNodeOpts: {
        showColors: true,
        isVerbose: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 30000,
    },
};

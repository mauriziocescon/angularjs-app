// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `--env.name=prod` then `environment.prod.ts` will be used instead.

export const environment = {
    // json-server mock server
    apiUrl: "http://localhost:5000/api/",
    production: false,

    CAN_MOCK_WS_FAIL: true,
    LOG_WS_REQUEST: true,
    LOG_WS_RESPONSE: true,
    MOCK_BACKEND: true,
    SHOW_ANALYSIS: true,
};

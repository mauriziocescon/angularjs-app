import {Enum} from "../../shared/shared.module";

export class Application {
	APP_NAME = "demo";
	WS_URL = "http://jsonplaceholder.typicode.com";

	// @if MOCK_BACKEND = "false"
	MOCK_BACKEND = false;
	CAN_MOCK_WS_FAIL = false;
	SHOW_ANALYSIS = true;
	LOG_WS_REQUEST = false;
	LOG_WS_RESPONSE = false;
	// @endif

	// @if MOCK_BACKEND = "true"
	MOCK_BACKEND = true;
	CAN_MOCK_WS_FAIL = true;
	SHOW_ANALYSIS = true;
	LOG_WS_REQUEST = true;
	LOG_WS_RESPONSE = true;
	// @endif
}

export class Languages {
	SUPPORTED_LANG = ["en", "it", "de"];
	SUPPORTED_LANG_DESC = ["English", "Italiano", "Deutsch"];
}

export class LocalStorageKey {
	LANGUAGE_ID = new Enum("LANGUAGE_ID");
}

export class Validator {
	NUMBER = /^[0-9]+([\.|\,]{0,1}[0-9]+)?$/;
	NUMBER_WITH_NO_DECIMAL = /^[0-9]+$/;
	NUMBER_WITH_ONE_DECIMAL = /^[0-9]+[\.|\,]{0,1}[0-9]{0,1}$/;
	NUMBER_WITH_TWO_DECIMALS = /^[0-9]+[\.|\,]{0,1}[0-9]{0,2}$/;
	NUMBER_WITH_THREE_DECIMALS = /^[0-9]+[\.|\,]{0,1}[0-9]{0,3}$/;
}
// tslint:disable:max-classes-per-file
import { Enum } from "../../shared/shared.module";

import { environment } from "../../../environments/environment";

export class Api {
    public albums = environment.apiUrl + "albums";
    public comments = environment.apiUrl + "comments";
    public photos = environment.apiUrl + "photos";
    public posts = environment.apiUrl + "posts";
    public todos = environment.apiUrl + "todos";
    public users = environment.apiUrl + "users";
}

export class Application {
    public APP_NAME = "demo";
    public SHOW_ANALYSIS = true;
}

export class Languages {
    public SUPPORTED_LANG = ["en", "it", "de"];
    public SUPPORTED_LANG_DESC = ["English", "Italiano", "Deutsch"];
    public DEFAULT_LANGUAGE = "en";
}

export class LocalStorageKey {
    public LANGUAGE_ID = new Enum("LANGUAGE_ID");
}

export class Validator {
    public NUMBER = /^[0-9]+([\.|\,]{0,1}[0-9]+)?$/;
    public NUMBER_WITH_NO_DECIMAL = /^[0-9]+$/;
    public NUMBER_WITH_ONE_DECIMAL = /^[0-9]+[\.|\,]{0,1}[0-9]{0,1}$/;
    public NUMBER_WITH_TWO_DECIMALS = /^[0-9]+[\.|\,]{0,1}[0-9]{0,2}$/;
    public NUMBER_WITH_THREE_DECIMALS = /^[0-9]+[\.|\,]{0,1}[0-9]{0,3}$/;
}

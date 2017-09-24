import { IAppConstantsService, IUtilitiesService } from "../../app.module";

import { Todo } from "./user-todos.model";

export let userTodosRunFuncMocks = ($httpBackend: ng.IHttpBackendService,
                                    AppConstantsService: IAppConstantsService,
                                    UtilitiesService: IUtilitiesService) => {

    // returns the current list of todos per user
    $httpBackend.whenGET((url: string) => {
        return AppConstantsService.Application.MOCK_BACKEND === true &&
            url.startsWith(AppConstantsService.Api.todos);
    }).respond((method: string, url: string, data: string, headers: Object, params?: any) => { // tslint:disable-line:ban-types

        const response = [];
        const fakeText = "Lorem ipsum dolor sit amet, vidit clita vitae no vix. " +
            "Melius utamur definiebas mei ad. No maluisset prodesset theophrastus eum. " +
            "Nam sadipscing adversarium ut. Est rebum aperiam ex, ex vel regione " +
            "forensibus contentiones, eos in numquam persecuti omittantur. Cu sumo " +
            "illum has, meis assum eligendi ex sit.\n Option sapientem dissentias ad eam, " +
            "cum virtute numquam ex, cum salutatus vituperata ne. Te omnes volumus pro. " +
            "Eu errem albucius invenire qui, unum dolorem ne nec. Torquatos concludaturque ius " +
            "et, cu viderer minimum voluptua duo, ex eligendi abhorreant vis. Sea posse legimus " +
            "vituperata no, per at etiam deserunt inimicus.";

        for (let i = 0; Math.round(Math.random() * 25); i++) {
            const todo = new Todo();

            todo.userId = parseInt(params.userId, undefined);
            todo.id = i;
            todo.title = fakeText.substring(0, (Math.random() * 10000) % 100);
            todo.completed = Math.random() < 0.5;

            response.push(todo);
        }

        return AppConstantsService.Application.CAN_MOCK_WS_FAIL ? UtilitiesService.randomHttpStatusCode(response, {}) : [200, response, {}, "ok"];
    });
};

userTodosRunFuncMocks.$inject = ["$httpBackend", "AppConstantsService", "UtilitiesService"];

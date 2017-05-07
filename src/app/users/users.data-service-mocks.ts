import { IAppConstantsService, IUtilitiesService } from "../app.module";
import { Address, Company, Coordinates, User } from "./users.model";

export let usersRunFuncMocks = ($httpBackend: ng.IHttpBackendService,
                                AppConstantsService: IAppConstantsService,
                                UtilitiesService: IUtilitiesService) => {

    // returns the current list of users
    $httpBackend.whenGET((url: string) => {
        return AppConstantsService.Application.MOCK_BACKEND === true &&
            url.startsWith(AppConstantsService.Application.WS_URL + "/users");
    }).respond((method: string, url: string, data: string, headers: Object, params?: any) => {

        const response = [];

        for (let i = 0; Math.round(Math.random() * 25); i++) {
            const user = new User();

            user.id = i;
            user.name = "name " + i.toString() + " fds fsf f fs fsfdf ds f f gjkfd gf gkflk gfk gkfdlg fd";
            user.username = "username " + i.toString() + " gf gkf l";
            user.email = user.name + "@email.com";
            user.address = new Address();
            user.address.street = "street";
            user.address.suite = "suite";
            user.address.city = "city";
            user.address.zipcode = "32332";
            user.address.geo = new Coordinates();
            user.address.geo.lat = "0";
            user.address.geo.lng = "0";
            user.phone = "+39 20151025";
            user.website = "www." + user.name + ".com";
            user.company = new Company();
            user.company.name = "name";
            user.company.catchPhrase = "catchPhrase";
            user.company.bs = "bs";

            response.push(user);
        }

        return AppConstantsService.Application.CAN_MOCK_WS_FAIL ? UtilitiesService.randomHttpStatusCode(response, {}) : [200, response, {}, "ok"];
    });
};

usersRunFuncMocks.$inject = ["$httpBackend", "AppConstantsService", "UtilitiesService"];

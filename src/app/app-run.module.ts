import { IUtilitiesService } from './app.module';

export const runFunc = (UtilitiesService: IUtilitiesService) => {
  // setup services
  // Logger.log('ANGULAR APP OK  ' + UtilitiesService.getNow().toISOString());
};

runFunc.$inject = ['UtilitiesService'];

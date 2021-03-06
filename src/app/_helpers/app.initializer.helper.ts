import { IAppSettings } from '../_models/index';
import { ConfigurationService } from '../_services/index';


export let APP_SETTINGS: IAppSettings = {
  currentYear: 0,
  groupYears: []
};

export function readConfigurationSettings(configService: ConfigurationService) {
  return () => configService.readConfigurationSettings();
}

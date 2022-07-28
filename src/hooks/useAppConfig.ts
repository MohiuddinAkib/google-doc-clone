import {container} from "@src/appEngine";
import {ConfigService} from "@config/ConfigService";

const configService = container.get(ConfigService)

const useAppConfig = () => configService;

export default useAppConfig;
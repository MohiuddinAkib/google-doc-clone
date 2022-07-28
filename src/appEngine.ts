import "reflect-metadata";

import {Container} from "inversify";
import registerHttpClient from "@utils/http";
import registerApplicationConfiguration from "@config/index";
import {registerDotnetServices} from "@data/laravel/dependencyRegisterer";

/**
 * Initialize container
 */
export const container = new Container();

/**
 * Register dependencies
 */
registerApplicationConfiguration(container);
registerHttpClient(container);
registerDotnetServices(container);

import { Container } from "inversify";
import { ConfigService } from "./ConfigService";

export default function registerApplicationConfiguration(container: Container) {
  container.bind(ConfigService).toSelf();
}

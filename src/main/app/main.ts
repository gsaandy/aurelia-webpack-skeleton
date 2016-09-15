import {Aurelia, LogManager} from "aurelia-framework";
import {ConsoleAppender} from "aurelia-logging-console";
import {appConfig} from "app/config/config";

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(appConfig.log_level === 'debug' ? LogManager.logLevel.debug : 0);
const logger = LogManager.getLogger('main');

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration();
    aurelia.start().then(() => aurelia.setRoot('app/todo/component/todo'));
    logger.info('App started!');
}

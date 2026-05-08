import 'reflect-metadata';
import { container } from 'tsyringe';
import type { LoggerPort } from './shared/logger/logger_port.js';
import { WinstonLogger } from './shared/logger/logger.js';
import type ElasticPort from './shared/elastic/elastic_port.js';
import { ElasticAdapter } from './shared/elastic/elastic_adapter.js';
import { registerBibleModule } from './modules/bible/container.js';
import { requestValidator } from './shared/request_validator/request_validator.js';
import type { Kysely } from 'kysely';
import type { Database } from './shared/postgres/schema.js';
import { registerAuthModule } from './modules/auth/container.js';
import { authenticated } from './shared/auth/auth.middleware.js';
import { registerUserModule } from './modules/user/container.js';
import { registerPsalterModule } from './modules/psalter/container.js';
import { registerGroupModule } from './modules/group/container.js';
import { errorHandlerFactory } from './shared/error_handler/error_handler.js';
import { PostgresAdapter } from './shared/postgres/postgres_adapter.js';
container.registerSingleton<LoggerPort>('Logger', WinstonLogger);
container.register<ElasticPort>('ElasticAdapter', {
  useFactory: () =>
    new ElasticAdapter(
      process.env.ELASTIC_URL ?? 'http://elastic-search:9200',
      'elastic',
      process.env.ELASTIC_PASSWORD,
    ),
});
container.registerSingleton<Kysely<Database>>(
  'PostgresAdapter',
  PostgresAdapter,
);

container.registerInstance('requestValidator', requestValidator);
container.registerInstance(
  'errorHandler',
  errorHandlerFactory(container.resolve('Logger')),
);
container.registerInstance('authMiddleware', authenticated);
const authContainer = container.createChildContainer();
registerAuthModule(authContainer, container);

const bibleContainer = container.createChildContainer();
registerBibleModule(bibleContainer);
const userContainer = container.createChildContainer();
registerUserModule(userContainer);
const psalterContainer = container.createChildContainer();
registerPsalterModule(psalterContainer);
const groupContainer = container.createChildContainer();
registerGroupModule(groupContainer);

export {
  container as rootContainer,
  bibleContainer,
  authContainer,
  userContainer,
  psalterContainer,
  groupContainer,
};

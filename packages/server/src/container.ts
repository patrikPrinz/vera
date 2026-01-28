import 'reflect-metadata';
import { container } from 'tsyringe';
import type { LoggerPort } from './shared/logger/logger_port.js';
import { WinstonLogger } from './shared/logger/logger.js';
import type ElasticPort from './shared/elastic/elastic_port.js';
import { ElasticAdapter } from './shared/elastic/elastic_adapter.js';
import { registerBibleModule } from './modules/bible/container.js';
import { requestValidator } from './shared/request_validator/request_validator.js';

container.registerSingleton<LoggerPort>('Logger', WinstonLogger);
container.register<ElasticPort>('ElasticAdapter', {
  useFactory: () =>
    new ElasticAdapter(
      process.env.ELASTIC_URL ?? 'http://elastic-search:9200',
      'elastic',
      process.env.ELASTIC_PASSWORD,
    ),
});

container.registerInstance('requestValidator', requestValidator);
const bibleContainer = container.createChildContainer();
registerBibleModule(bibleContainer);

export { container as rootContainer, bibleContainer };

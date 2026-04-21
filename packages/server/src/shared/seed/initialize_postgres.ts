import type { UsersService } from '../../modules/auth/services/users.service.js';
import type { WinstonLogger } from '../logger/logger.js';

export async function initializePostgres(
  service: UsersService,
  logger: WinstonLogger,
) {
  const login = process.env.APP_ADMIN_USERNAME ?? 'user';
  const password = process.env.APP_ADMIN_PASSWORD ?? 'password';
  logger.info('Performing database seed...');
  const insertion = await service.seedAdminUser(login, password);
  if (insertion) {
    logger.info(`Inserted user ${login}`);
  } else {
    logger.info('Skipping user seed.');
  }
}

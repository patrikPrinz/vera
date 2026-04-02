import type { DependencyContainer } from 'tsyringe';
import { PsalterRepository } from './psalter.repository.js';
import { PsalterService } from './psalter.service.js';
import { PsalterController } from './psalter.controller.js';
export function registerPsalterModule(container: DependencyContainer) {
  container.register('PsalterRepository', PsalterRepository);
  container.register('PsalterService', PsalterService);
  container.register('PsalterController', PsalterController);
}

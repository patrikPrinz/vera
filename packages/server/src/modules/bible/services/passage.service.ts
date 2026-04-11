import { inject, injectable } from 'tsyringe';
import { PassageRepository } from '../repositories/passage.repository.js';
import type { BiblePassage } from '../../../shared/types/bible/passage.types.js';
import {
  AppError,
  AuthError,
  NotFoundError,
  PermissionError,
} from '../../../shared/error_handler/errors.js';
import type { User } from '../../auth/auth.types.js';
import type { RolesService } from '../../auth/services/roles.service.js';

@injectable()
export class PassageService {
  protected passageRepository: PassageRepository;
  protected rolesService: RolesService;

  constructor(
    @inject('PassageRepository') passageRepository: PassageRepository,
    @inject('RolesService') rolesService: RolesService,
  ) {
    this.passageRepository = passageRepository;
    this.rolesService = rolesService;
  }

  // TODO: datum jen pro admina a calendar_admina
  public async createPassage(
    author: User,
    passage: BiblePassage,
  ): Promise<BiblePassage> {
    // only admin and calendar_admin can edit calenar and its passages
    if (
      author.id == passage.authorId &&
      (passage.calendarDate === null ||
        (await this.rolesService.hasRole(author, ['admin', 'calendar_admin'])))
    ) {
      const query = await this.passageRepository.insertPassage(passage);
      if (query) {
        passage.id = query;
        return passage;
      }
      throw new AppError();
    }
    throw new AuthError('User not permitted to createw this passage.');
  }

  public async findPassageById(
    author: User,
    id: string,
  ): Promise<BiblePassage> {
    const passage = await this.passageRepository.findPassageById(id);
    if (!passage) {
      throw new NotFoundError('Passage not found.');
    }
    if (
      passage.authorId == author.id ||
      (await this.rolesService.hasRole(author))
    ) {
      return passage;
    }
    throw new PermissionError('User not permitted to view this passage.');
  }

  public async findPassagesByAuthor(
    user: User,
    authorId: string,
  ): Promise<BiblePassage[]> {
    if (
      user.id == authorId ||
      (await this.rolesService.hasRole(user, ['admin', 'calendar_admin']))
    ) {
      const passages =
        await this.passageRepository.findPassagesByAuthor(authorId);
      return passages;
    }
    throw new PermissionError('User cannot');
  }

  public async findPassagesByDate(date: string): Promise<BiblePassage[]> {
    const passages = await this.passageRepository.findPassagesByDate(date);
    return passages;
  }

  public async updatePassage(
    author: User,
    passage: BiblePassage,
  ): Promise<boolean> {
    const oldPassage = await this.passageRepository.findPassageById(passage.id);
    if (
      oldPassage.authorId == passage.authorId &&
      (author.id == passage.authorId ||
        (await this.rolesService.hasRole(author, ['admin'])))
    ) {
      const update = await this.passageRepository.updatePassage(passage);
      return update;
    }
  }

  public async deletePassage(
    author: User,
    passageId: string,
  ): Promise<boolean> {
    const passage = await this.passageRepository.findPassageById(passageId);
    if (
      passage.authorId == passage.authorId ||
      (await this.rolesService.hasRole(author, ['admin']))
    ) {
      const deletion = await this.passageRepository.deletePassage(passageId);
      return deletion;
    }
  }
}

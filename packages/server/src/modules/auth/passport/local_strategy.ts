import passport from 'passport';
import { Strategy as LocalStrategy, type VerifyFunction } from 'passport-local';
import { container } from 'tsyringe';
import { CredentialsRepository } from './credentials.repository.js';
import { Kysely } from 'kysely';
import type { Database } from '../../../shared/postgres/schema.js';

class CredentialsService {
  protected repository: CredentialsRepository;

  constructor(repository: CredentialsRepository) {
    this.repository = repository;
  }

  public authenticateUserFactory(): VerifyFunction {
    const repository = this.repository;
    return (login, password, done) => {
      repository
        .verifyUser(login, password)
        .then((user) => {
          if (!user) {
            done(null, false, { message: 'Invalid credentials.' });
          } else {
            done(null, { id: user.id });
          }
        })
        .catch((err) => {
          done(err);
        });
    };
  }
}

export function registerPassportLocalStrategy() {
  const repository = new CredentialsRepository(
    container.resolve<Kysely<Database>>('PostgresAdapter'),
  );
  const service = new CredentialsService(repository);
  passport.use(
    new LocalStrategy(
      { usernameField: 'login' },
      service.authenticateUserFactory(),
    ),
  );

  passport.serializeUser((user: unknown, done) => {
    const id = Number((user as { id: string }).id);
    done(null, id);
  });

  passport.deserializeUser((id: string, done) => {
    repository
      .getUserById(Number(id))
      .then((user) => (user ? done(null, { id: user.id }) : done(null, false)))
      .catch((err) => done(err as Error));
  });
}

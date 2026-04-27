import 'reflect-metadata';
import app from './bootstrap.js';
import { container } from 'tsyringe';
import { initializePostgres } from './shared/seed/initialize_postgres.js';

// initialize PostgreSQL database
await initializePostgres(
  container.resolve('UsersService'),
  container.resolve('Logger'),
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

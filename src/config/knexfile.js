import path from 'path';

export default {
  client: 'mysql2',
  connection: {
    user: 'root',
    password: 'mysql123',
    database: 'pokemon',
    host: 'localhost',
    port: '3306',
  },
  migrations: {
    directory: path.dirname('src', 'migrations')
  }
}
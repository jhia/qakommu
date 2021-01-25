module.exports = {
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  test: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    dialect: 'postgres',
    logging: false
  },
  development: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    dialect: 'postgres'
  },
}
module.exports = {
  production: {
    host: process.env.DB_HOST,
    posrt: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    dialect: 'postgres'
  },
  development: {
    host: process.env.DB_HOST,
    posrt: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    dialect: 'postgres'
  },
}
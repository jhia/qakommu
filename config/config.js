const fs = require('fs')

module.exports = {
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres',
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false // This line will fix new error
      }
    },
  },
  test: {
    use_env_variable: "DATABASE_TEST_URL",
    dialect: 'postgres',
    ssl: {
      rejectUnauthorized: false
    },
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

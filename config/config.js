const fs = require('fs')

let cKey, cCert, cCa;

try {
  cKey = fs.readFileSync(process.env.SSL_KEY_PATH || 'server-key.pem')
} catch(err) {}

try {
  cCert = fs.readFileSync(process.env.SSL_CERT_PATH || 'server-cert.pem')
} catch(err) {}

try {
  cCa = fs.readFileSync(process.env.SSL_CA_PATH || 'server-ca.pem')
} catch(err) {}

module.exports = {
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres',
    logging: false,
    ssl: {
      rejectUnauthorized: false,
      key: cKey,
      cert: cCert,
      ca: cCa
    }
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

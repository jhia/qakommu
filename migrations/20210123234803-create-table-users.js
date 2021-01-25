'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'last_name'
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      profilePhoto: {
        type: Sequelize.STRING,
        field: 'profile_photo'
      },
      organization: Sequelize.STRING, // only if needed, cooler if this is a datalist
      jobTitle: {
        type: Sequelize.STRING, // cooler if this is a datalist
        field: 'job_title'
      },
      countryId: {
        field: 'id_country',
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'countries'
          },
          key: 'id'
        },
        allowNull: false
      },
      city: {
        type: Sequelize.STRING
      },
      zipCode: {
        field: 'zip_code',
        type: Sequelize.STRING, // maybe
      },
      phoneCode: {
        field: 'phone_code',
        type: Sequelize.STRING, // should be auto for country
      },
      phoneNumber: {
        field: 'phone_number',
        type: Sequelize.STRING,
      },
      languageId: {
        field: 'id_language',
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'languages'
          },
          key: 'id'
        },
        allowNull: false
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('M', 'F', 'O'), // M: male, F: female, O: Other; non-binary
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      emailVerified: { // user clicked the link to verify email
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'email_verified'
      },
      lastLogin: {
        type: Sequelize.DATE,
        field: 'last_login'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
        field: 'updated_at'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  }
};

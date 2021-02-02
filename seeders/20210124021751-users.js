'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {
      const results = await queryInterface.sequelize.query(
        `SELECT id, id_language FROM countries WHERE alpha_code_3='USA' LIMIT 1`,
        { transaction }
      )
      let country = results[0][0]
      let language;
      if(country) {
        language = country.id_language;
        country = country.id;
      } else {
        country = 240;
        language = 1;
      }

      await queryInterface.bulkInsert('users', [
        {
          "id": 1,
          "first_name": "Kommu",
          "last_name": "Community",
          "username": "kommu",
          "email": "hello@kommu.com",
          "phone_number": "3146498261",
          "phone_code": "1",
          "birthdate": "1983-12-12T00:00:00+00:00",
          "gender": "O",
          "id_country": country,
          "id_language": language,
          "organization": "Kommu",
          "occupation": "Owner",
          "email_verified": true,
          "profile_photo": "profile_photo_MOCI9U.png",
          "password": "$2b$10$X/ehV/7OFbwpQTeWoJ7Iz.N/J.MCRyNZjYxm622RpMo9ewPtin29W"
        },
        {
          "id": 2,
          "first_name": "Shelly Eileen",
          "last_name": "Wimbley Bateman",
          "username": "s_wimbley84",
          "email": "s_wimbley84@kommu.com",
          "phone_number": "8502453248",
          "phone_code": "1",
          "birthdate": "1984-05-22T00:00:00+00:00",
          "gender": "F",
          "id_country": country,
          "id_language": language,
          "city": "Florida",
          "zip_code": "32301",
          "organization": "personal",
          "occupation": "owner",
          "email_verified": true,
          "profile_photo": "profile_photo_MOK123.png",
          "password": "$2b$10$NHvW.5.urfgH7VNxXeqMU.moDYWCNDcYbdRamzpSmde4r0PmOgwbO"
        },
        {
          "id": 3,
          "first_name": "Patricia Chae",
          "last_name": "Ellett Meneses",
          "username": "p_ellett87",
          "email": "p_ellett87@kommu.com",
          "phone_number": "8512652106",
          "phone_code": "1",
          "birthdate": "1986-02-22T00:00:00+00:00",
          "gender": "F",
          "id_country": country,
          "id_language": language,
          "city": "Connecticut",
          "zip_code": "06320",
          "organization": "personal",
          "occupation": "other",
          "email_verified": true,
          "profile_photo": "profile_photo_MG9KDD.png",
          "password": "$2b$10$X/ehV/7OFbwpQTeWoJ7Iz.N/J.MCRyNZjYxm622RpMo9ewPtin29W"
        },
        {
          "id": 4,
          "first_name": "Kenneth Harold",
          "last_name": "Varney Moore",
          "username": "k_varney88",
          "email": "k_varney88@kommu.com",
          "phone_number": "2037563475",
          "phone_code": "1",
          "birthdate": "1988-05-11T00:00:00+00:00",
          "gender": "M",
          "id_country": country,
          "id_language": language,
          "city": "Connecticut",
          "zip_code": "06702",
          "organization": "personal",
          "occupation": "other",
          "email_verified": true,
          "profile_photo": "profile_photo_FTF2N2.png",
          "password": "$2b$10$0/bE0s7kQEoLQDjlf2znWettz/JIcYP7o7VIgo4n1PBCF33LanGIK"
        },
        {
          "id": 5,
          "first_name": "Alexander Bryant",
          "last_name": "Simmons Anderson",
          "username": "a_simmons85",
          "email": "a_simmons85@kommu.com",
          "phone_number": "8088710725",
          "phone_code": "1",
          "birthdate": "1985-01-20T00:00:00+00:00",
          "gender": "M",
          "id_country": country,
          "id_language": language,
          "city": "Hawái",
          "zip_code": "96732",
          "organization": "personal",
          "occupation": "other",
          "profile_photo": "profile_photo_X7C02N.png",
          "email_verified": true,
          "password": "$2b$10$emgYeeQ5/JTpYYw3qDcwR.PBW04INCP1rtejWF/xf9tRtUHPpiyuy"
        },
        {
          "id": 6,
          "first_name": "Jeanette Susan",
          "last_name": "Jenkins Steiner",
          "username": "j_jenkins988",
          "email": "j_jenkins988@kommu.com",
          "phone_number": "8657404446",
          "phone_code": "1",
          "birthdate": "1986-02-22T00:00:00+00:00",
          "gender": "F",
          "id_country": country,
          "id_language": language,
          "city": "Arizona",
          "zip_code": "85716",
          "organization": "personal",
          "occupation": "other",
          "profile_photo": "profile_photo_S9PPF1.png",
          "email_verified": true,
          "password": "$2b$10$u/trrHc/mX9LzKnNgrdKhOb4yXrMfqK5nhEXywQAPLWcD9/6T.VmS"
        },
        {
          "id": 7,
          "first_name": "Alexander Levi",
          "last_name": "Smith Brown",
          "username": "a_Smith225",
          "email": "a_Smith225@kommu.com",
          "phone_number": "3159050626",
          "phone_code": "1",
          "birthdate": "1986-08-17T00:00:00+00:00",
          "gender": "M",
          "id_country": country,
          "id_language": language,
          "city": "New York",
          "zip_code": "13202",
          "organization": "personal",
          "occupation": "other",
          "email_verified": true,
          "profile_photo": "profile_photo_P3PO45.png",
          "password": "$2b$10$2bHJH316ymyNqPQgxOyBK.i6fLfxuSdkLw2wUQ72fNNYGfGffb.iu"
        },
        {
          "id": 8,
          "first_name": "Christine Isabela",
          "last_name": "Peterson Miller",
          "username": "c_pert83",
          "email": "c_pert83@kommu.com",
          "phone_number": "8507468889",
          "phone_code": "1",
          "birthdate": "1983-05-22T00:00:00+00:00",
          "gender": "F",
          "id_country": country,
          "id_language": language,
          "city": "Florida",
          "zip_code": "32501",
          "organization": "personal",
          "occupation": "other",
          "email_verified": true,
          "profile_photo": "profile_photo_RTR44U.png",
          "password": "$2b$10$Yd9d7B/S1reanRcQMSclzuRgU4H8rUkUAMHqDpYkVq6bfpt0Po6Vi"
        },
        {
          "id": 9,
          "first_name": "Camila Victoria",
          "last_name": "Rojas Brown",
          "username": "c_rojas85",
          "email": "c_victori83@kommu.com",
          "phone_number": "8512652106",
          "phone_code": "1",
          "birthdate": "1986-02-22T00:00:00+00:00",
          "gender": "F",
          "id_country": country,
          "id_language": language,
          "city": "Ohio",
          "zip_code": "45402",
          "organization": "personal",
          "occupation": "other",
          "email_verified": true,
          "profile_photo": "profile_photo_B23J1J.png",
          "password": "$2b$10$vpiAwaRK/h/J5qIfyIFwa.Sok9l7EPTsPS8EAXRLW4FCYd3D78Hwe"
        },
        {
          "id": 10,
          "first_name": "Robert Lucas",
          "last_name": "Taylor McIntyre ",
          "username": "r_taylor85",
          "email": "r_taylor85@kommu.com",
          "phone_number": "4526638753",
          "phone_code": "1",
          "birthdate": "1985-06-26T00:00:00+00:00",
          "gender": "M",
          "id_country": country,
          "id_language": language,
          "city": "Utah",
          "zip_code": "84104",
          "organization": "personal",
          "occupation": "other",
          "email_verified": true,
          "profile_photo": "profile_photo_Z543MM.png",
          "password": "$2b$10$lJxXj0MfE/NxtiHvvSITquyzHEWFId34/b11A4HzapRkzA/YtNQgu"
        },
        {
          "id": 11,
          "first_name": "Pedro alexander",
          "last_name": "Maxwell Ransdell",
          "username": "p_max87",
          "email": "p_max87@kommu.com",
          "phone_number": "6522364789",
          "phone_code": "1",
          "birthdate": "1987-10-14T00:00:00+00:00",
          "gender": "M",
          "id_country": country,
          "id_language": language,
          "city": "Misisipi",
          "zip_code": "39208",
          "organization": "personal",
          "occupation": "other",
          "email_verified": true,
          "profile_photo": "profile_photo_OOG2PP.png",
          "password": "$2b$10$82tnjVGfGBHlGHmYQnAfquUmIX2N8EGmuMK8rrbMydzozmOycIDci"
        },
        {
          "id": 12,
          "first_name": "Bennie Jane",
          "last_name": "Bond Stryker",
          "username": "b_bond88",
          "email": "b_bond88@kommu.com",
          "phone_number": "8657404446",
          "phone_code": "1",
          "birthdate": "1986-02-22T00:00:00+00:00",
          "gender": "F",
          "id_country": country,
          "id_language": language,
          "city": "Ohio",
          "zip_code": "45402",
          "organization": "personal",
          "occupation": "other",
          "email_verified": true,
          "profile_photo": "profile_photo_F7F7II.png",
          "password": "$2b$10$AcE.6lc58qhIfPTZhwUUouyvIMq3Ajz.XDEPQBc08c26yCXszGhTm"
        }
      ], { transaction, ignoreDuplicates: true })

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM users", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('users_id_seq', ${maxid})`, {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('users', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM users", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('users_id_seq', ${maxid})`, {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

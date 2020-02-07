'use strict'
const db = require('./models')
const { resource,role,permission,community,user,user_type } = db

let resources = [
  { "name": "community", "url_resource": "/api/community" }
];

let roles = [
  { "name": "admin", "description": "admin all modules" }
];

let permissions = [
  { "id_role": 1, "id_resource": 1, "_create": true, "_read": true, "_update": true, "_delete": true }
];

let communities = [
  { "name": "node", "description": "description to node", "id_type_of_account": 1, "user_acount": 3, "web": "www.node.org", "prefix": "node", "member_verification": true, "id_repository": 4, "code": "8OTUHR" }
];


let users = [
  { "name": "user01", "last_name": "user01", "username": "user01", "address": "micasa", "email": "user01@email.com", "password": "user01", "gender": "M", "id_repository": 0 }
]

let user_types = [
  { "id_user": 1, "id_role": 1, "id_community": 1 }
]


let loadtables = async  () => {
  await resource.bulkCreate(resources, {returning: true});
  await role.bulkCreate(roles, {returning: true});
  await permission.bulkCreate(permissions, {returning: true});
  await community.bulkCreate(communities, {returning: true});
  await user.bulkCreate(users, {returning: true});
  await user_type.bulkCreate(user_types, {returning: true});
}

module.exports = loadtables;
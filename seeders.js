'use strict';
const db = require('./models')
const { resource, role, permission, community, user, user_type, state, track, event, ticket, coupon } = db

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



//seeders carlos
let states = [
  {
    "name": "available",
    "description": "represents an availability status",
    "active": true,
    "module_name": "coupon",
    "blocker": false
  }
]

let tracks = [
  {
    "name": "back-end",
    "description": "is the logic that is processed on the server side",
    "active": true,
    "module_name": "community"
  }
]

let events = [
  {
    "name": "python for everyone",
    "description": "This is one of the most important conferences for python language lovers",
    "id_community": 1, 
    "type": "w",
    "online": false,
    "no_cfp": true,
    "url_code": "www.test.python.com/event/12",
    "id_webside": 1,
    "is_private": false,
    "start": "2020-02-10",
    "end": "2020-02-11",
    "active": true,
    //"id_call_for_paper": 1, 
    "prom_rate": 89.8,
    "id_repository": 1,
    "id_state": 1
  }
]

let tickets = [
  {
    "name": "Early Bird",
    "description": "With Early Bird you have the opportunity to get the tickets with the lowest price",
    "id_state": 1,
    "id_event": 1,
    "base_price": 56.66,
    "quantity_total": 100,
    "quantity_current": 100,
    "reserved": 0,
    "max_ticket_sell": 0,
    "min_ticket_sell": 0,
    "id_coupon": 2,
    "start":"2020-05-05",
    "end": "2020-05-15"
  }
]

let coupons = [
  {
    "name": "early bird",
    "description": "coupon available for morning purchases",
    "free": false,
    "percentage": 40,
    "id_state": 1,
    "applicable_amount": 1,
    "applicable_total_amount": false,
    "id_user_creator": 1,
    "active": true,
  }
]

let loadtables = async () => {
  await resource.bulkCreate(resources, { returning: true });
  await role.bulkCreate(roles, { returning: true });
  await permission.bulkCreate(permissions, { returning: true });
  await community.bulkCreate(communities, { returning: true });
  await user.bulkCreate(users, { returning: true });
  await user_type.bulkCreate(user_types, { returning: true });
  await state.bulkCreate(states, { returning: true });
  await track.bulkCreate(tracks, { returning: true });
  await event.bulkCreate(events, { returning: true });
  await ticket.bulkCreate(tickets, { returning: true });
  await coupon.bulkCreate(coupons, { returning: true });

}

module.exports = loadtables;
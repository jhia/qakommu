'use strict';
const db = require('./models')
const {
  resource,
  role,
  permission,
  community,
  user,
  user_type,
  channel,
  //generics  
  state,
  track,
  //event module
  event,
  coupon,
  ticket,
  ticket_sale,
  ticket_sale_detail,
  attendee,
  speaker,
  //repository module
  object_type,
  repository_object,
  repository,
  //partnership module
  partnership,
  partnership_position,
  //sponsor module
  type_sponsor,
  sponsor,
  //exhibitor modulee
  type_booth,
  exhibitor,
  //session module
  session,
  track_session,
  session_attendee
} = db

let resources = [
  { "name": "community", "url_resource": "/api/community" },
  { "name": "role", "url_resource": "/api/role" },
  { "name": "resource", "url_resource": "/api/resource" },
  { "name": "permission", "url_resource": "/api/permission" },
  { "name": "post", "url_resource": "/api/post" },
  { "name": "comment", "url_resource": "/api/comment" },
  { "name": "message", "url_resource": "/api/message" },
  { "name": "channel", "url_resource": "/api/channel" },
  { "name": "event", "url_resource": "/api/event" },
  { "name": "user", "url_resource": "/api/user" },
  { "name": "partnership", "url_resource": "/api/partnership" },
  { "name": "ticket", "url_resource": "/api/ticket" },  
  { "name": "speaker", "url_resource": "/api/speaker" }  
];

let roles = [
  { "name": "admin", "special": "all-access" },
  { "name": "community user", "special": "community-user" },
  { "name": "no access", "special": "no-access" }
];

let permissions = [
  // admin
  { "id_role": 1, "id_resource": 1, "_create": true, "_read": true, "_update": true, "_delete": true }, // community
  { "id_role": 1, "id_resource": 2, "_create": true, "_read": true, "_update": true, "_delete": true }, // role
  { "id_role": 1, "id_resource": 3, "_create": true, "_read": true, "_update": true, "_delete": true }, // resource
  { "id_role": 1, "id_resource": 4, "_create": true, "_read": true, "_update": true, "_delete": true }, // permission
  { "id_role": 1, "id_resource": 5, "_create": true, "_read": true, "_update": true, "_delete": true }, // post
  { "id_role": 1, "id_resource": 6, "_create": true, "_read": true, "_update": true, "_delete": true }, // comment
  { "id_role": 1, "id_resource": 7, "_create": true, "_read": true, "_update": true, "_delete": true }, // message
  { "id_role": 1, "id_resource": 8, "_create": true, "_read": true, "_update": true, "_delete": true }, // channel
  { "id_role": 1, "id_resource": 9, "_create": true, "_read": true, "_update": true, "_delete": true }, // event
  { "id_role": 1, "id_resource": 10, "_create": true, "_read": true, "_update": true, "_delete": true }, // user
  { "id_role": 1, "id_resource": 11, "_create": true, "_read": true, "_update": true, "_delete": true }, // partnership  
  { "id_role": 1, "id_resource": 12, "_create": true, "_read": true, "_update": true, "_delete": true }, // ticket  
  { "id_role": 1, "id_resource": 13, "_create": true, "_read": true, "_update": true, "_delete": true }, // speaker  
];

let communities = [
  { "name": "python", "description": "description to python", "id_type_of_account": 1, "users_count": 3, "id_website": 2, "prefix": "python", "member_verification": true, "id_repository": 4, "code": "0JWCT2" },
  { "name": "node", "description": "description to node", "id_type_of_account": 1, "users_count": 3, "id_website": 1, "prefix": "node", "member_verification": true, "id_repository": 4, "code": "8OTUHR" }
];


let users = [
  { "name": "user01", "last_name": "user01", "username": "user01", "profile_photo":"profile_photo_J472UU.png", "address": "micasa", "email": "user01@email.com", "password": "$2b$10$FjtY9xK0No9ko22Ijqvm7.iovnaVCpKimZydaQ5gG.v9Uy4zAAMli", "gender": "M", "id_repository": 0 },
  { "name": "user02", "last_name": "user02", "username": "user02", "profile_photo":"profile_photo_KK7O36.png",  "address": "micasa", "email": "user02@email.com", "password": "$2b$10$JsAWE3LlyR/vtYEkS/.OMeYt60JiQQmUAJoAqMzrcU69vALqQzOvG", "gender": "M", "id_repository": 0 }
]

let user_types = [
  { "id_user": 1, "id_role": 1, "id_community": 1 },
  { "id_user": 2, "id_role": 1, "id_community": 2 }
]

let channels = [
  { "name": "python", "description": "descrition python", "id_community": 1 },  
  { "name": "node", "description": "descrition node", "id_community": 2 }  
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
  },
  {
    "name": "node for everyone",
    "description": "This is one of the most important conferences for node language lovers",
    "id_community": 2,
    "type": "w",
    "online": false,
    "no_cfp": true,
    "url_code": "www.test.node.com/event/12",
    "id_webside": 1,
    "is_private": false,
    "start": "2020-02-10",
    "end": "2020-02-11",
    "active": true,
    //"id_call_for_paper": 1, 
    "prom_rate": 89.8,
    "id_repository": 1,
    "id_state": 1
  },
  
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
    "id_coupon": 1,
    "start": "2020-05-05",
    "end": "2020-05-15"
  }
]

let ticket_sales = [
  {
    "id_ticket": 1,
    "id_user": 1,
    "id_coupon": null,
    "count": 1,
    "total_amount": 150,
    "amount_paid": 75,
    "paying_name": "john smith",
    "paying_address": "Cartagena street, number 25, 66534",
    "dni_payer": "E25331234"
  }
]

let ticket_sale_details = [
  {
    "code_ticket": "54ce99fa85c92b1d87678436e956a2e8",
    "id_ticket_sale": 1,
    "deactivated": false
  }
]

let attendees = [
  {
    "id_user": null,
    "name": "carlos",
    "dni": "x127665254",
    "present": true,
    "id_ticket_sale_detail": 1,
    "rate": null,
    "id_state": 1
  }
]

let speakers = [
  {
    "id_user": 1,
    "id_event": 1,
    "id_state": 1,
    "id_session": 1,
  }
]

//repository 
let object_types = [
  {
    "name": "file",
    "active": true
  }
]

let repositories = [
  {
    "name": "repository test",
    "location": "test/www/122322/",
    "active": true
  }
]

let repository_objects = [
  {
    "name": "document",
    "location": "www/kommu/ejemplo/",
    "id_repository": 1,
    "id_object_type": 1
  }
]

//  partnership model
let partnerships = [
  {
    "name": "google company",
    "description": "test descrioption facebook",
    "registry_number": "c26174178",
    "logo": "/uploads/partnership_BSGCMX.png",
    "host": "35.122.343.2:871",
    "web": "google.com",
    "active": true
  }
]

let partnership_positions = [
  {
    "job_title": "empleado",
    "description": "something",
    "name_contact": "carlos",
    "email": "pnfi.carlos@gmail.com",
    "phone": "04146825919",
    "active": true,
    "id_partnership": 1
  }
]

// sponsor module
let type_sponsors = [
  {
    "name": "general",
    "description": "standard fee for sponsors",
    "contribution_value": 0.00005685,
    "active": true
  }
]

let sponsors = [
  {
    "id_partnership": 1,
    "id_type_sponsor": 1,
    "id_event": 1
  }
]

//exibitor
let type_booths = [
  {
    "name": "booth standard",
    "description": "generic size",
    "cost": 887.12,
    "size_width": 5,
    "size_height": 5,
    "active": true,
  }
]

let exhibitors = [
  {
    "id_partnership": 1,
    "id_type_booth": 1,
    "id_event": 1
  }
]

// session
let sessions = [
  {
    "name": "dev game",
    "description": "this conference is aimed at all video game developers",
    "id_room": 1,
    
    "order":1,
    "start": "2020-10-11",
    "end": "2020-10-11",
    "is_break": false
  }
]

let track_sessions = [
  {
    "id_session": 1,
    "id_track":1
  }
]

let session_attendees = [
  {
    "id_session":1, 
    "id_attendee":1, 
    "rate":76.2, 
    "is_present": true
  }
]


let loadtables = async () => {
  await resource.bulkCreate(resources, { returning: true });
  await role.bulkCreate(roles, { returning: true });
  await permission.bulkCreate(permissions, { returning: true });
  await community.bulkCreate(communities, { returning: true });
  await user.bulkCreate(users, { returning: true });
  await user_type.bulkCreate(user_types, { returning: true });
  await channel.bulkCreate(channels, { returning: true });

  await state.bulkCreate(states, { returning: true });
  await track.bulkCreate(tracks, { returning: true });

  await object_type.bulkCreate(object_types, { returning: true });
  await repository.bulkCreate(repositories, { returning: true });
  await repository_object.bulkCreate(repository_objects, { returning: true });

  await event.bulkCreate(events, { returning: true });
  await coupon.bulkCreate(coupons, { returning: true });
  await ticket.bulkCreate(tickets, { returning: true });
  await ticket_sale.bulkCreate(ticket_sales, { returning: true });
  await ticket_sale_detail.bulkCreate(ticket_sale_details, { returning: true });
  await attendee.bulkCreate(attendees, { returning: true });
  await session.bulkCreate(sessions, {returning: true});
  await speaker.bulkCreate(speakers, { returning: true });

  await partnership.bulkCreate(partnerships, { returning: true });
  await partnership_position.bulkCreate(partnership_positions, { returning: true });

  await type_sponsor.bulkCreate(type_sponsors, { returning: true });
  await sponsor.bulkCreate(sponsors, { returning: true });

  await type_booth.bulkCreate(type_booths, { returning: true });
  await exhibitor.bulkCreate(exhibitors, { returning: true });
  
  
  await track_session.bulkCreate(track_sessions, {returning:true});
  await session_attendee.bulkCreate(session_attendees, {returning:true});
}

module.exports = loadtables;

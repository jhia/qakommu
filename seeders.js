'use strict';
const db = require('./models')
const {
    resource,
    role,
    permission,
    community,
    user,
    user_type,
    post,
    comment,
    like,
    channel,
    //generics  
    module_name,
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
    session_attendee,
    //survey
    survey,
    question,
    answer,
    data
} = db

let resources = [
    { "name": "community", "url_resource": "/api/community" },
    { "name": "role", "url_resource": "/api/role" },
    { "name": "resource", "url_resource": "/api/resource" },
    { "name": "permission", "url_resource": "/api/permission" },
    { "name": "post", "url_resource": "/api/post" },
    { "name": "comment", "url_resource": "/api/comment/" },
    { "name": "like", "url_resource": "/api/like/" },
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
    { "id_role": 1, "id_resource": 7, "_create": true, "_read": true, "_update": true, "_delete": true }, // like
    { "id_role": 1, "id_resource": 8, "_create": true, "_read": true, "_update": true, "_delete": true }, // message
    { "id_role": 1, "id_resource": 9, "_create": true, "_read": true, "_update": true, "_delete": true }, // channel
    { "id_role": 1, "id_resource": 10, "_create": true, "_read": true, "_update": true, "_delete": true }, // event
    { "id_role": 1, "id_resource": 11, "_create": true, "_read": true, "_update": true, "_delete": true }, // user
    { "id_role": 1, "id_resource": 12, "_create": true, "_read": true, "_update": true, "_delete": true }, // partnership  
    { "id_role": 1, "id_resource": 13, "_create": true, "_read": true, "_update": true, "_delete": true }, // ticket  
    { "id_role": 1, "id_resource": 14, "_create": true, "_read": true, "_update": true, "_delete": true }, // speaker  
];

let communities = [
    { "name": "python", "description": "description to python", "id_type_of_account": 1, "users_count": 3, "id_website": 2, "prefix": "python", "member_verification": true, "id_repository": 4, "code": "0JWCT2" },
    { "name": "node", "description": "description to node", "id_type_of_account": 1, "users_count": 3, "id_website": 1, "prefix": "node", "member_verification": true, "id_repository": 4, "code": "8OTUHR" }
];


let users = [
    { "name": "Juan", "last_name": "Perez", "username": "juanperez", "profile_photo":"", "address": "micasa", "email": "user01@email.com", "password": "$2b$10$FjtY9xK0No9ko22Ijqvm7.iovnaVCpKimZydaQ5gG.v9Uy4zAAMli", "gender": "M", "id_repository": 0 },
    { "name": "Romulo", "last_name": "Gomez", "username": "romulogomez", "profile_photo":"",  "address": "micasa", "email": "user02@email.com", "password": "$2b$10$JsAWE3LlyR/vtYEkS/.OMeYt60JiQQmUAJoAqMzrcU69vALqQzOvG", "gender": "M", "id_repository": 0 }
]

let user_types = [
    { "id_user": 1, "id_role": 1, "id_community": 1 },
    { "id_user": 2, "id_role": 1, "id_community": 1 }
]
let posts = [
    {
	"id_community": 1,
	"id_user": 1,
	"title": "Aprende a Leer",
	"content": "Todos menos usted escriben un código terrible. Es por eso que una gran habilidad que tiene múltiples beneficios es poder seguir el código de otras personas. No importa cuán desordenado o mal pensado sea el código de un ingeniero anterior, aún debe ser capaz de leerlo. Después de todo, es tu trabajo. Incluso cuando ese ingeniero era usted un año antes.",
	"active": true,
	"value": 3,
	"fixed": true,
	"track": [1]
    }
]

let comments = [
    {
	"id_user": 2,        
	"id_post": 1,        
	"active": true,
	"content": "Todos menos usted escriben un código terrible",
	"image": "",
	"video": "",
	"file": "",
	"fixed": true,
	"reference": null,
    },  
    {
	"id_user": 1,        
	"id_post": 1,        
	"active": true,
	"content": "Es por eso que una gran habilidad que tiene múltiples beneficios",
	"image": "",
	"video": "",
	"file": "",
	"fixed": true,
	"reference": 2,
    },  
    {
	"id_user": 1,        
	"id_post": 1,        
	"active": true,
	"content": "Después de todo, es tu trabajo",
	"image": "",
	"video": "",
	"file": "",
	"fixed": false,
	"reference": 2,
    }  
]

let likes = [
    {
	"id_post": 1,
	"id_user": 1,
	"reference_message": null
    },
    {
	"id_post": 1,
	"id_user": 2,
	"reference_message": 1
    },
    {
	"id_post": 1,
	"id_user": 2,
	"reference_message": 1
    }
]


let channels = [
    { "name": "python", "description": "descrition python", "id_community": 1 },  
    { "name": "node", "description": "descrition node", "id_community": 2 }  
]


//seeders carlos

let module_names = [
    //1
    {
	"name": "community",
	"active": true
    },
    //2
    {
	"name": "event",
	"active":true
    },
    //3
    {
	"name": "ticket",
	"active":true
    },
    //4
    {
	"name": "speaker",
	"active": true
    },
    //5
    {
	"name": "attendee",
	"active":true
    },
    //6
    {
	"name": "coupon",
	"active": true
    }
]

let states = [
    //ticket seeders
    {
	"name": "Avaliable",
	"description": "Ready for immediate use",
	"active": true,
	"id_module_name": 3,
	"blocker": false
    },
    {
	"name": "Sold Out",
	"description": "Is having all available tickets or accommodations sold completely and especially in advance",
	"active": true,
	"id_module_name": 3,
	"blocker": true
    },
    {
	"name": "Reserved",
	"description": "Is when it is no longer available to you",
	"active": true,
	"id_module_name": 3,
	"blocker": false
    },
    //Event
    {
	"name": "Progress",
	"description": "Revent that unfolds at that precise moment before reaching its final phase",
	"active": true,
	"id_module_name": 2,
	"blocker": false
    },
    {
	"name": "Draft",
	"description": "Sketch of ideas embodied in an organized way, which the author will modify over time before reaching the final or publication form.",
	"active": true,
	"id_module_name": 2,
	"blocker": true
    },
    {
	"name": "Previews",
	"description": "event that has already ended or concluded.",
	"active": true,
	"id_module_name": 2,
	"blocker": false
    },
    //Attendes
    {
	"name": "Confirmed",
	"description": "give definitive proof of a claim",
	"active": true,
	"id_module_name": 5,
	"blocker": false
    },
    {
	"name": "Unconfirmed",
	"description": "Waiting for the veracity of something that is in doubt",
	"active": true,
	"id_module_name": 5,
	"blocker": true
    },
]

let tracks = [
    {
	"name": "back-end",
	"description": "is the logic that is processed on the server side",
	"active": true,
	"id_module_name": 1,
	"color": "#333333"
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
	"id_state": 4
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
	"percentage": 50,
	"id_state": 1,
	"applicable_amount": 1,
	"applicable_total_amount": false,
	"id_user_creator": 1,
	"active": true,
	"since": "2021-10-05", 
	"until": "2021-10-25"
    }
]


let tickets = [
    {
	"name": "Early Bird",
	"description": "With Early Bird you have the opportunity to get the tickets with the lowest price",
	"id_state": 1,
	"id_event": 1,
	"base_price": 120,
	"quantity_total": 100,
	"quantity_current": 100,
	"reserved": 0,
	"max_ticket_sell": 5,
	"min_ticket_sell": 1,
	"start": "2020-05-05",
	"end": "2020-05-15"
    }
]

let ticket_sales = [
    {
	"id_ticket": 1,
	"id_user": 1,
	"count": 1,
	"unit_amount": 150,
	"total_amount": 150,
	"total_amount_paid": 150,
	"paying_name": "john smith",
	"paying_address": "Cartagena street, number 25, 66534",
	"dni_payer": "E25331234",
	"name_ticket": "any name ticket",
	"name_event": "any name event",
	"id_coupon": null
    }
]

let ticket_sale_details = [
    {
	"id_ticket_sale": 1,
	"deactivated": false,
    }
]

let attendees = [
    {
	"id_user": 1,
	"name": "carlos",
	"dni": "x127665254",
	"is_present": true,
	"id_ticket_sale_detail": 1,
	"rate": null,
	"id_state": 1,
	"id_event": 1
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
	"location": "one",
	"id_community": 1,
	"active": true
    },
    {
	"name": "repository two",
	"location": "two",
	"id_community": 2,
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
	"logo": "",
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
	"id_event": 1,
	"active": true
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
	"id_event": 1,
	"active": true
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

//survey
let surveys = [
    {
	"name": "satisfaction",
	"description": "Collect customer feedback and increase customer satisfaction",
	"active": true,
	"id_event": 1,
	"id_community": null
    }
]

let questions = [
    {
	"text": "what is your name",
	"id_survey": 1,
	"type_question": "t",
	"rate": null
    }
]

let answers = [
    {
	"id_question": 1,
	"text": "john smith",
	"description": "test is a test"
    }
]

let datas= [
    {
	"id_user": 1,
	"id_question": 1,
	"id_answer":1,
	"text": "data test"
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
    await post.bulkCreate(posts, { returning: true });
    await comment.bulkCreate(comments, { returning: true });
    await like.bulkCreate(likes, { returning: true });

    await module_name.bulkCreate(module_names, { returning: true});
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

    await survey.bulkCreate(surveys, {returning: true });
    await question.bulkCreate(questions, {returning: true});
    await answer.bulkCreate(answers, {returning: true});
    await data.bulkCreate(datas, {returning: true})
}

module.exports = loadtables;

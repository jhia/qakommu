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
	webside,
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
	folder,
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
	room,
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

	{
		"name": "John Maximilian",
		"last_name": "Vail Brown",
		"username": "j_vail983",
		"email": "j_vail983@kommu.com",
		"phone": "0013146498261",
		"birthdate": "1983-12-12T00:00:00+00:00",
		"gender": "hombre",
		"country": "Unites States",
		"city": "Misuri",
		"zip_code": "63146",
		"address": "323 Blane Street  Saint Louis",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_MOCI9U.png",
		"host": "localhost:8000",
		"password": "$2b$10$GSRqgYv73A/lg.X8O3k/wujYWV1GQaWFp.E6I.wSAvEwbEX1j/qdK"
	},
	{
		"name": "Shelly Eileen",
		"last_name": "Wimbley Bateman",
		"username": "s_wimbley84",
		"email": "s_wimbley84@kommu.com",
		"phone": "0018502453248",
		"birthdate": "1984-05-22T00:00:00+00:00",
		"gender": "mujer",
		"country": "Unites States",
		"city": "Florida",
		"zip_code": "32301",
		"address": "3587 Virgil Street Tallahassee",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_MOK123.png",
		"host": "localhost:8000",
		"password": "$2b$10$NHvW.5.urfgH7VNxXeqMU.moDYWCNDcYbdRamzpSmde4r0PmOgwbO"
	},
	{
		"name": "Patricia Chae",
		"last_name": "Ellett Meneses",
		"username": "p_ellett87",
		"email": "p_ellett87@kommu.com",
		"phone": "0018512652106",
		"birthdate": "1986-02-22T00:00:00+00:00",
		"gender": "mujer",
		"country": "Unites States",
		"city": "Connecticut",
		"zip_code": "06320",
		"address": "503 Lochmere Lane New London",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_MG9KDD.png",
		"host": "localhost:8000",
		"password": "$2b$10$X/ehV/7OFbwpQTeWoJ7Iz.N/J.MCRyNZjYxm622RpMo9ewPtin29W"
	},
	{
		"name": "Kenneth Harold.",
		"last_name": "Varney Moore",
		"username": "k_varney88",
		"email": "k_varney88@kommu.com",
		"phone": "0012037563475",
		"birthdate": "1988-05-11T00:00:00+00:00",
		"gender": "hombre",
		"country": "Unites States",
		"city": "Connecticut",
		"zip_code": "06702",
		"address": "2591 Asylum Avenue Waterbury",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_FTF2N2.png",
		"host": "localhost:8000",
		"password": "$2b$10$0/bE0s7kQEoLQDjlf2znWettz/JIcYP7o7VIgo4n1PBCF33LanGIK"
	},
	{
		"name": "Alexander Bryant.",
		"last_name": "Simmons Anderson",
		"username": "a_simmons85",
		"email": "a_simmons85@kommu.com",
		"phone": "0018088710725",
		"birthdate": "1985-01-20T00:00:00+00:00",
		"gender": "hombre",
		"country": "Unites States",
		"city": "Hawái",
		"zip_code": "96732",
		"address": "4006 Randall Drive Kahului",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_X7C02N.png",
		"host": "localhost:8000",
		"password": "$2b$10$emgYeeQ5/JTpYYw3qDcwR.PBW04INCP1rtejWF/xf9tRtUHPpiyuy"
	},
	{
		"name": "Jeanette Susan",
		"last_name": "Jenkins Steiner",
		"username": "j_jenkins988",
		"email": "j_jenkins988@kommu.com",
		"phone": "0018657404446",
		"birthdate": "1986-02-22T00:00:00+00:00",
		"gender": "mujer",
		"country": "Unites States",
		"city": "Arizona",
		"zip_code": "85716",
		"address": "4369 Polk Street Tucson",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_S9PPF1.png",
		"host": "localhost:8000",
		"password": "$2b$10$u/trrHc/mX9LzKnNgrdKhOb4yXrMfqK5nhEXywQAPLWcD9/6T.VmS"
	},
	{
		"name": "Alexander Levi",
		"last_name": "Smith Brown",
		"username": "a_Smith225",
		"email": "a_Smith225@kommu.com",
		"phone": "0013159050626",
		"birthdate": "1986-08-17T00:00:00+00:00",
		"gender": "hombre",
		"country": "Unites States",
		"city": "New York",
		"zip_code": "13202",
		"address": "72 James Avenue",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_P3PO45.png",
		"host": "localhost:8000",
		"password": "$2b$10$2bHJH316ymyNqPQgxOyBK.i6fLfxuSdkLw2wUQ72fNNYGfGffb.iu"
	},
	{
		"name": "Christine Isabela",
		"last_name": "Peterson Miller",
		"username": "c_pert83",
		"email": "c_pert83@kommu.com",
		"phone": "0018507468889",
		"birthdate": "1983-05-22T00:00:00+00:00",
		"gender": "mujer",
		"country": "Unites States",
		"city": "Florida",
		"zip_code": "32501",
		"address": "3163 Woodside Circle Pensacola",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_RTR44U.png",
		"host": "localhost:8000",
		"password": "$2b$10$Yd9d7B/S1reanRcQMSclzuRgU4H8rUkUAMHqDpYkVq6bfpt0Po6Vi"
	},
	{
		"name": "Camila Victoria",
		"last_name": "Rojas Brown",
		"username": "c_rojas85",
		"email": "c_victori83@kommu.com",
		"phone": "0018512652106",
		"birthdate": "1986-02-22T00:00:00+00:00",
		"gender": "mujer",
		"country": "Unites States",
		"city": "Ohio",
		"zip_code": "45402",
		"address": "2726 Norma Avenue Dayton",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_B23J1J.png",
		"host": "localhost:8000",
		"password": "$2b$10$vpiAwaRK/h/J5qIfyIFwa.Sok9l7EPTsPS8EAXRLW4FCYd3D78Hwe"
	},
	{
		"name": "Robert Lucas. ",
		"last_name": "Taylor McIntyre ",
		"username": "r_taylor85",
		"email": "r_taylor85@kommu.com",
		"phone": "0014526638753",
		"birthdate": "1985-06-26T00:00:00+00:00",
		"gender": "hombre",
		"country": "Unites States",
		"city": "Utah",
		"zip_code": "84104",
		"address": "4522 Kemper Lane, Salt Lake City",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_Z543MM.png",
		"host": "localhost:8000",
		"password": "$2b$10$lJxXj0MfE/NxtiHvvSITquyzHEWFId34/b11A4HzapRkzA/YtNQgu"
	},
	{
		"name": "Pedro alexander. ",
		"last_name": "Maxwell Ransdell",
		"username": "p_max87",
		"email": "p_max87@kommu.com",
		"phone": "0016522364789",
		"birthdate": "1987-10-14T00:00:00+00:00",
		"gender": "hombre",
		"country": "Unites States",
		"city": "Misisipi",
		"zip_code": "39208",
		"address": "3188 Eastland Avenue Jackson",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_OOG2PP.png",
		"host": "localhost:8000",
		"password": "$2b$10$82tnjVGfGBHlGHmYQnAfquUmIX2N8EGmuMK8rrbMydzozmOycIDci"
	},
	{
		"name": "Bennie Jane",
		"last_name": "Bond Stryker",
		"username": "b_bond88",
		"email": "b_bond88@kommu.com",
		"phone": "0018657404446",
		"birthdate": "1986-02-22T00:00:00+00:00",
		"gender": "mujer",
		"country": "Unites States",
		"city": "Ohio",
		"zip_code": "45402",
		"address": "2726 Norma Avenue Dayton",
		"organization": "personal",
		"type": "other",
		"profile_photo": "profile_photo_F7F7II.png",
		"host": "localhost:8000",
		"password": "$2b$10$AcE.6lc58qhIfPTZhwUUouyvIMq3Ajz.XDEPQBc08c26yCXszGhTm"
	}

]

let user_types = [
	{ "id_user": 1, "id_role": 1, "id_community": 1 },
	{ "id_user": 2, "id_role": 1, "id_community": 1 },
	{ "id_user": 3, "id_role": 1, "id_community": 1 },
	{ "id_user": 4, "id_role": 1, "id_community": 1 },
	{ "id_user": 5, "id_role": 1, "id_community": 1 },
	{ "id_user": 6, "id_role": 1, "id_community": 1 },
	{ "id_user": 7, "id_role": 1, "id_community": 1 },
	{ "id_user": 8, "id_role": 1, "id_community": 1 },
	{ "id_user": 9, "id_role": 1, "id_community": 1 },
	{ "id_user": 10, "id_role": 1, "id_community": 1 },
	{ "id_user": 11, "id_role": 1, "id_community": 1 },
	{ "id_user": 12, "id_role": 1, "id_community": 1 },
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
let websides = [
	{
		"title": 'oracle university', 
		"head": 'asd', 
		"body":'asd', 
		"script":'asd', 
		"footer":'asd', 
		"main_page":true, 
		"url":'asd'
	}
]


let module_names = [
	//1
	{
		"name": "community",
		"active": true
	},
	//2
	{
		"name": "event",
		"active": true
	},
	//3
	{
		"name": "ticket",
		"active": true
	},
	//4
	{
		"name": "speaker",
		"active": true
	},
	//5
	{
		"name": "attendee",
		"active": true
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


//  partnership model
let partnerships = [
	{
		"name": "google company",
		"description": "test descrioption facebook",
		"registry_number": "c26174178",
		"logo": "",
		"host": "35.122.343.2:871",
		"web": "google.com",
		"active": true,
		"id_community": 1
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
		"active": true,
		"currency_symbol":"$",
		"id_community":1,
		"display_number":2
	}
]

let sponsors = [
	{
		"id_partnership": 1,
		"description":"text test",
		"id_type_sponsor": 1,
		"id_event": 1,
		"active": true,
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
		"currency_symbol":"$",
		"id_community":1
	}
]

let exhibitors = [
	{
		"id_partnership": 1,
		"description":"text test",
		"id_type_booth": 1,
		"id_event": 1,
		"active": true
	}
]


let events = [
	{
		"name": "CES 2020",
		"description": "CES® is the most influential tech event in the world — the proving ground for breakthrough technologies and global innovators. This is where the world's biggest brands do business and meet new partners, and the sharpest innovators hit the stage. Owned and produced by the Consumer Technology Association (CTA)®, CES features every aspect of the tech sector.",
		"id_community": 1,
		"type": "w",
		"online": false,
		"no_cfp": true,
		"url_code": "https://www.ces.tech",
		"id_webside": 1,
		"is_private": false,
		"start": "2020-01-11",
		"end": "2020-01-14",
		"active": true,
		//"id_call_for_paper": 1, 
		"prom_rate": 89.8,
		"id_repository": 1,
		"id_state": 4,
		"image": "event_DY72EI.png",
		"host": "localhost:8000"
	},
	{
		"name": "Oracle Code 2020",
		"description": "Oracle Code is a free event for developers to explore the latest and greatest technologies, practices, and trends. Please check back often for updates on upcoming Oracle Code events.",
		"id_community": 1,
		"type": "w",
		"online": false,
		"no_cfp": true,
		"url_code": "https://developer.oracle.com/code/",
		"id_webside": 1,
		"is_private": false,
		"start": "2020-09-22",
		"end": "2020-09-24",
		"active": true,
		//"id_call_for_paper": 1, 
		"prom_rate": 89.8,
		"id_repository": 1,
		"id_state": 1,
		"image": "event_3H0945.png",
		"host": "localhost:8000"
	},
	{
		"name": "microsoft ignite",
		"description": "Microsoft Ignite | Microsoft's annual gathering of technology leaders and practitioners delivered as a digital event experience this September.",
		"id_community": 1,
		"type": "w",
		"online": false,
		"no_cfp": true,
		"url_code": "https://myignite.microsoft.com",
		"id_webside": 1,
		"is_private": false,
		"start": "2020-09-21",
		"end": "2020-09-24",
		"active": true,
		//"id_call_for_paper": 1, 
		"prom_rate": 89.8,
		"id_repository": 1,
		"id_state": 1,
		"image": "event_IOZC8S.png",
		"host": "localhost:8000"
	},
	{
		"name": "Deep Learning Summit",
		"description": "Access the current trends and developments in deep learning and machine intelligence to strengthen your skills and advance your business.",
		"id_community": 1,
		"type": "w",
		"online": false,
		"no_cfp": true,
		"url_code": "https://www.re-work.co/events/deep-learning-summit-san-francisco-2020",
		"id_webside": 1,
		"is_private": false,
		"start": "2020-09-24",
		"end": "2020-09-25",
		"active": true,
		//"id_call_for_paper": 1, 
		"prom_rate": 89.8,
		"id_repository": 1,
		"id_state": 1,
		"image": "event_H1RN6X.png",
		"host": "localhost:8000"
	},

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
		"reserved": 5,
		"reserved_current": 5,
		"limit_sale": true,
		"max_ticket_sell": 5,
		"start": "2020-05-05",
		"end": "2020-05-15",
		"use_multiple_price": false
	},
	{
		"name": "test ticket",
		"description": "test description of pruebe",
		"id_state": 1,
		"id_event": 1,
		"base_price": 100,
		"quantity_total": 100,
		"quantity_current": 100,
		"reserved": 0,
		"limit_sale": true,
		"max_ticket_sell": 50,
		"start": "2020-05-01",
		"end": "2020-12-20",


		"use_multiple_price1": true,
		'title1': "super early early bird",
		"since1": "2020-05-10",
		"until1": "2020-05-15",
		"percentage1": 30,
		"is_discount1": true,

		"use_multiple_price2": true,
		'title2': "early early bird",
		"since2": "2020-08-2",
		"until2": "2020-09-20",
		"percentage2": 20,
		"is_discount2": true,

		"use_multiple_price3": true,
		'title3': "early bird",
		"since3": "2020-09-21",
		"until3": "2020-11-20",
		"percentage3": 10,
		"is_discount3": true,

		"use_multiple_price4": true,
		'title4': "today is more",
		"since4": "2020-11-21",
		"until4": "2020-12-1",
		"percentage4": 5,
		"is_discount4": false
	}
]


let coupons = [
	{
		"name": "early bird",
		"description": "coupon available for morning purchases",
		"percentage": 50,
		"id_state": 1,
		"limit": 5,
		"original_limit": 5,
		"unlimited": false,
		"id_user_creator": 1,
		"active": true,
		"since": "2020-10-01",
		"until": "2021-10-09",
		"id_user": 1,
		"id_ticket": 1,
		"id_sponsor":1,
		"id_exhibitor":1,
		"id_event":null
	},
	{
		"name": "early early bird",
		"description": "coupon available for morning purchases",
		"percentage": 70,
		"id_state": 1,
		"limit": 5,
		"original_limit": 5,
		"unlimited": false,
		"id_user_creator": 1,
		"active": true,
		"since": "2020-10-01",
		"until": "2020-10-25",
		"id_user": 1
	},
	{
		"name": "early early bird",
		"description": "coupon available for morning purchases",
		"percentage": 100,
		"id_state": 1,
		"limit": 2,
		"original_limit": 2,
		"unlimited": false,
		"id_user_creator": 1,
		"active": true,
		"since": "2020-10-01",
		"until": "2020-11-25",
		"is_reserved": true,
		"id_user": 1
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
		"price_type": "PB",
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
		"email": "carlos@gmail.com",
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
	},
	{
		"id_user": 2,
		"id_event": 1,
		"id_state": 1,
		"id_session": 1,
	},
	{
		"id_user": 3,
		"id_event": 1,
		"id_state": 1,
		"id_session": 1,
	},
	{
		"id_user": 4,
		"id_event": 1,
		"id_state": 1,
		"id_session": 1,
	},
	{
		"id_user": 5,
		"id_event": 1,
		"id_state": 1,
		"id_session": 1,
	},
	{
		"id_user": 6,
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


let folders = [
	{
		"id_repository": 2,
		"name": "three"
	}
]



let repository_objects = [
	{
		"name": "document",
		"location": "www/kommu/ejemplo/",
		"id_folder": 1,
		"id_object_type": 1
	}
]


// session
let rooms = [
	{
		"name": "auditory pedro laguna",
		"description": "esta ubicada en coro",
		"max_capacity": 550,
		"active": true
	}

]
let sessions = [
	{
		"name": "dev game",
		"description": "this conference is aimed at all video game developers",
		"id_room": 1,

		"order": 1,
		"start": "2020-10-11",
		"end": "2020-10-11",
		"is_break": false
	}
]

let track_sessions = [
	{
		"id_session": 1,
		"id_track": 1
	}
]

let session_attendees = [
	{
		"id_session": 1,
		"id_attendee": 1,
		"rate": 76.2,
		"is_present": true,
		"comment": "this is a comment"
	}
]

//survey
let surveys = [
	{
		"name": "who you are",
		"description": "with this survey we want to know you better",
		"active": true,
		"id_event": 1,
		"id_community": 1
	}
]

let questions = [
	{
		"text": "what is your name",
		"id_survey": 1,
		"type_question": "t",
		"rate": null
	},
	{
		"text": "what is your gender",
		"id_survey": 1,
		"type_question": "m",
		"rate": null
	}
]

let answers = [
	{
		"id_question": 1,
		"text": null,
		"free": true
	},
	{
		"id_question": 2,
		"text": "MALE",
		"free": false
	},
	{
		"id_question": 2,
		"text": "FEMALE",
		"free": false
	},
	{
		"id_question": 2,
		"text": "LGBT",
		"free": false
	},
	{
		"id_question": 2,
		"text": "I do not identify with any",
		"free": false
	},
]

let datas = [
	{
		"id_user": 1,
		"id_question": 1,
		"id_answer": 1,
		"text": "john"
	},
	{
		"id_user": 1,
		"id_question": 2,
		"id_answer": 2,
		"text": null
	},
	{
		"id_user": 2,
		"id_question": 1,
		"id_answer": 1,
		"text": "Shelly"
	},
	{
		"id_user": 2,
		"id_question": 2,
		"id_answer": 3,
		"text": null
	},
	{
		"id_user": 3,
		"id_question": 1,
		"id_answer": 1,
		"text": "Patricia"
	},
	{
		"id_user": 3,
		"id_question": 2,
		"id_answer": 3,
		"text": null
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

	await webside.bulkCreate(websides, {returning: true});

	await module_name.bulkCreate(module_names, { returning: true });
	await state.bulkCreate(states, { returning: true });
	await track.bulkCreate(tracks, { returning: true });

	await object_type.bulkCreate(object_types, { returning: true });
	await repository.bulkCreate(repositories, { returning: true });
	await folder.bulkCreate(folders, { returning: true });
	await repository_object.bulkCreate(repository_objects, { returning: true });

	await event.bulkCreate(events, { returning: true });

	await partnership.bulkCreate(partnerships, { returning: true });
	await partnership_position.bulkCreate(partnership_positions, { returning: true });

	await type_sponsor.bulkCreate(type_sponsors, { returning: true });
	await sponsor.bulkCreate(sponsors, { returning: true });

	await type_booth.bulkCreate(type_booths, { returning: true });
	await exhibitor.bulkCreate(exhibitors, { returning: true });

	
	await ticket.bulkCreate(tickets, { returning: true });
	await coupon.bulkCreate(coupons, { returning: true });
	await ticket_sale.bulkCreate(ticket_sales, { returning: true });
	await ticket_sale_detail.bulkCreate(ticket_sale_details, { returning: true });
	await attendee.bulkCreate(attendees, { returning: true });
	await room.bulkCreate(rooms, { returning: true });
	await session.bulkCreate(sessions, { returning: true });
	await speaker.bulkCreate(speakers, { returning: true });

	await track_session.bulkCreate(track_sessions, { returning: true });
	await session_attendee.bulkCreate(session_attendees, { returning: true });

	await survey.bulkCreate(surveys, { returning: true });
	await question.bulkCreate(questions, { returning: true });
	await answer.bulkCreate(answers, { returning: true });
	await data.bulkCreate(datas, { returning: true })
}

module.exports = loadtables;

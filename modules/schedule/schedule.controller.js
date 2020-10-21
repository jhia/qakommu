const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('schedule');
const moment = require('moment');

controller.getFunc = async function (req, res) {

    /*
     * Validar si el rango es el correcto
     * */
    const start = moment('14/11/2018 19:59:00', 'DD/MM/YYYY HH:mm:ss');
    const end = moment('14/11/2018 20:00:00', 'DD/MM/YYYY HH:mm:ss');

    const a = end.diff(start,'minutes');
    const b = start.diff(end,'minutes');

    if ( a > 0 ) { console.log('rango correcto: ',a) };
    if ( b < 0 ) { console.log('rango incorrecto: ',b) };


    // Consulta si es posterior
    const post1 = moment({ year: 2020, month: 10, day: 20, hour:19, minute: 59 }).isBefore({ year: 2020, month: 10, day: 20, hour: 19, minute: 58 })
    const post2 = moment({ year: 2020, month: 10, day: 20, hour:19, minute: 59 }).isBefore({ year: 2020, month: 10, day: 20, hour: 19, minute: 59 })
    const post3 = moment({ year: 2020, month: 10, day: 20, hour:19, minute: 59 }).isBefore({ year: 2020, month: 10, day: 20, hour: 20, minute: 20 })
    console.log('------------------',post1,post2,post3)

    // Calcula rango
    const breakfast = moment('8:32','HH:mm');
    const lunch = moment('7:52','HH:mm');
    console.log( moment.duration(lunch - breakfast).humanize() + ' para el almuerzo' )

    // ---------------------------------------------------------------------------











    const { id } = req.params;
    const { limit, offset, order, attributes } = req.body;

    try {
	const data = await this.getData({
	    id,
	    limit,
	    offset,
	    attributes,
	    order
	});

	this.response({
	    res,
	    payload: { data }

	});
    } catch (error) {
	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: 'something went wrong',
	});
    }

}

controller.postFunc = async function (req, res) {

    const { time_zone } = req.body;
    try {
	let newdata = await this.insert({
	    time_zone 
	});
	if (newdata) {
	    return this.response({
		res,
		statusCode: 201,
		payload: [newdata]
	    });
	}
    } catch (error) {

	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: error.message,
	});
    }
}


controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { time_zome } = req.body;

    const find_repository = await this.db.repository.findOne({
	where: {id},
	attributes: ["location"]
    });

    try {
	if ( location ) fs.renameSync(dir+find_repository.location, dir+location);


	let result = await this.update(
	    {
		id,
		data: {
		    name,
		    location,
		    id_community,
		    active
		},
		return_data
	    });
	if (result) {
	    return this.response({
		res,
		statusCode: 200,
		payload: return_data ? result : []
	    });
	} else {
	    this.response({
		res,
		success: false,
		statusCode: 202,
		message: 'Could not update this element, possibly does not exist'
	    });
	}
    } catch (error) {
	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: 'something went wrong'
	});
    }

}


controller.deleteFunc = async function (req, res) {
    const { id } = req.params;
    try {
	const find_repository = await this.db.repository.findOne({
	    where: {id},
	    attributes: ['location'],
	});
	fs.rmdirSync(dir+find_repository.location,{ recursive: true })
	let deleterows = await this.delete({ id });
	if (deleterows > 0) {
	    return this.response({
		res,
		success: true,
		statusCode: 200
	    });
	} else {
	    this.response({
		res,
		success: false,
		statusCode: 202,
		message: 'it was not possible to delete the item because it does not exist'
	    });
	}
    } catch (error) {
	console.log('--------------',error.original.code)
	if (error.original.code == 23503) error.message = "this folder is not empty"
	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: error.message
	});
    }

}







































module.exports = controller;

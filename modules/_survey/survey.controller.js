'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('survey');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

controller.getFunc = async function (req, res) {

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
            payload: [data]
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

    const { name, description, active, id_event, id_community } = req.body;
    try {
        let newdate = await this.insert({
            name,
            description,
            active,
            id_event,
            id_community
        });
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: [newdate]
            });
        }
    } catch (error) {
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, description, active, id_event, id_community, return_data } = req.body;
    try {
        if (id_event > 0 && id_community > 0) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, misuse of identifiers',
            });
        }
        let result = await this.update(
            {
                id,
                data: {
                    name,
                    description,
                    active,
                    id_event,
                    id_community
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
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong'
        });
    }
}


controller.getDataBySurvey = async function (req, res) {
    const { id_survey } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.survey.findAll({
            limit,
            offset,
            attributes: ['name'],
            order,
            where: {
                id: id_survey
            },
            include: [
                {
                    
                    attributes: ['id', 'text', 'type_question', 'rate'],
                    model: this.db.question,
                    as: 'survey_question',
                    include: [
                        {
                            attributes: ['id', 'text', 'free'],
                            model: this.db.answer,
                            as: 'question_answer',
                            include: [
                                {
                                    attributes: ['text'],
                                    model: this.db.data,
                                    as: 'answer_data',
                                    include: [
                                        {
                                            attributes: ['name', 'last_name', 'username', 'profile_photo', 'email'],
                                            model: this.db.user,
                                            as: 'user'
                                        }
                                    ]
                                }
                            ]
                        }

                    ]
                }
            ]
        });

        this.response({
            res,
            payload: [data]
        });

    } catch (error) {
        console.log(error)
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });

    }
}



controller.getDataSurveyByUser = async function (req, res) {
    const { id_survey, id_user } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.survey.findAll({
            limit,
            offset,
            attributes: ['name'],
            order,
            where: {
                id: id_survey
            },
            include: [
                {
                    
                    attributes: ['id', 'text', 'type_question', 'rate'],
                    model: this.db.question,
                    as: 'survey_question',
                    include: [
                        {
                            attributes: ['id', 'text', 'free'],
                            model: this.db.answer,
                            as: 'question_answer',
                            include: [
                                {
                                    attributes: ['text'],
                                    model: this.db.data,
                                    as: 'answer_data',
                                    where:{
                                        id_user
                                    },
                                    /*include: [
                                        {
                                            attributes: [],
                                            model: this.db.user,
                                            as: 'user',
                                            where:{
                                                id: id_user
                                            }
                                        }
                                    ]*/
                                }
                            ]
                        }

                    ]
                }
            ]
        });

        this.response({
            res,
            payload: [data]
        });

    } catch (error) {
        console.log(error)
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });

    }
}


/*
controller.getDataSurveyByUser = async function (req, res) {
    const { id_user, id_survey } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.data.findAll({
            limit,
            offset,
            attributes: ['text'],
            order,
            where: {
                id_user
            },
            include: [
                {
                    attributes: ['id','text','type_question','rate'],
                    model: this.db.question,
                    as: 'question',
                    include: [
                        {
                            attributes: [],
                            model: this.db.survey,
                            as: 'survey',
                            where:{
                                id: id_survey
                            }
                        }
                    ]
                },
                {
                    attributes: ['id_question', 'text', 'free'],
                    model: this.db.answer,
                    as: 'answer'
                },
                {
                    attributes: ['name', 'last_name', 'username', 'profile_photo', 'email'],
                    model: this.db.user,
                    as: 'user'
                }
            ]
        });

        this.response({
            res,
            payload: [data]
        });

    } catch (error) {
        console.log(error)
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });

    }
}
*/
module.exports = controller;
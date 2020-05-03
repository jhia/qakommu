'use strict'

const { makeid } = require('../../helpers/utilities')


const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('community');

const db = require('../../models')

const jwt = require('jsonwebtoken');

function llama(invitation_code,time) {
    let t = time+"d";
    if (time){ 
        let t = time+"d";
        console.log(t) 
    }else{ 
        let t = "30d";
        console.log(t)
    };
    let tk = jwt.sign({
        data: invitation_code
    }, 'secret', { expiresIn: 60 });    
    return tk;
}


controller.getFunc = async function (req, res) {
    
    const { id, time } = req.params;
    const { limit, offset, order, attributes } = req.body;
    let invitation_code = makeid(6)
    try {
        const data = await this.getData({
            id,
            limit,
            offset,
            attributes,
            order
        });
        return this.response({
            res,
            payload: {
                id: data.id,
                name: data.name,
                descripcion: data.description,
                id_type_of_account: data.id_type_of_account,
                id_website: data.id_website,
                prefix: data.prefix,
                member_verification: data.member_verification,
                id_repository: data.id_repository,
                code: data.code,
                invitation: invitation_code,
                url_invitation: "http://kommu.io/signup/"+data.code+"/"+llama(invitation_code, time),
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }
        });
    } catch (error) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });
    }
}

controller.postFunc = async function (req, res) {

    const { name, description, id_type_of_account, users_count, id_website, prefix, member_verification, id_repository, code } = req.body;
    try {
        let newdate = await this.insert({
            name,
            description,
            id_type_of_account,
            users_count,
            id_website,
            prefix,
            member_verification,
            id_repository,
            code: makeid(6)
        });
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: newdate
            });
        }
    } catch (err) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: err.message,
        });
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, description, id_type_of_account, users_count, id_website, prefix, member_verification, id_repository, code, return_data } = req.body;
    
    await this.update(
        {
            id,
            data: {
                name,
                description,
                id_type_of_account,
                users_count,
                id_website,
                prefix,
                member_verification,
                id_repository,
                code                
            },
            return_data
        }            
        )
        .then(( result )=>{
        this.response({
            res,
            statusCode: 200,
            payload: return_data ? result : []
        })
        }).catch((err)=>{
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: err.message
        })
        });
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
            return this.response({
                res,
                success: false,
                statusCode: 202,
                message: 'it was not possible to delete the item because it does not exist'
            });
        }

    } catch (error) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong'
        });
    }
}

module.exports = controller;
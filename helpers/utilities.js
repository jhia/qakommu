const _ = require('lodash');
const db = require('../models');

function findRelation(relations, relation_model) {
    if (typeof relations[Symbol.iterator] === 'function') {
        for (const object of relations) {
            if (_.isObject(object) && object.model === relation_model) {
                return object;
            } else if (_.isObject(object) && object.include){
                return findRelation(object.include, relation_model);
            }
        }
    }
    return false;
}

async function setGlobalSQLMode() {
    return await db.sequelize.query("SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))", {
        plain: false,
        raw: true,
    });
}

function cleanAttributes(relations) {
    return relations.filter((object) => {
        object.attributes = [];
        if (object.include) {
            object.include = cleanAttributes(object.include);
        }
        return object;
    });
}

function response(obj){

    const httpStatusCode = {
        "200": "Everything is OK",
        "201": "Created Successfully",
        "202": "Accepted",
        "204": "No Content",
        "301": "Moved Permanently",
        "400": "Bad Request",
        "401": "Unauthorized",
        "404": "Not Found",
        "500": "Internal Server Error",
    };

    const {
        res,
        statusCode,
        success,
        message,
        payload
    } = obj;

    res.
        status(statusCode ? statusCode : typeof obj == 'string' ? obj : 200).
        json({
            success: success || true,
            message: message ? 
                        message : typeof obj == 'string' ?
                        httpStatusCode[obj] : "Successfull request",
            payload: payload || []
        })

}

module.exports = {
    findRelation,
    cleanAttributes,
    setGlobalSQLMode,
    response
};
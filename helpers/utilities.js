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

    const {
        res,
        statusCode,
        success,
        message,
        payload
    } = obj;

    res.
        status(statusCode || 200).
        json({
            success: success || true,
            message: message || "Successfull request",
            payload: payload || []
        })

}

module.exports = {
    findRelation,
    cleanAttributes,
    setGlobalSQLMode,
    response
};
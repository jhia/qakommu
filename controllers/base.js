const _ = require('lodash');
const sequelize = require('sequelize');
const { Op } = sequelize;
const { findRelation, cleanAttributes } = require('../helpers/utilities');

/**
 * this class help to build endpoints very fast.
 * @author Shamaru Primera <shamaru001@gmail.com>
 * @copyright Kommu 2019.
 */
class base {

    /**
     * Initialize the class.
     * @constructor
     * @param {object} req request given by express
     * @param {object} res response given by express
     * @param {boolean} customEndpoint if is a generic endpoint or a custom endpoint
     * @return {object<base>}
     */
    constructor(req, res, customEndpoint=false){
        this.req = req;
        this.res = res;

        this._initPropertyDefault();
        //use the next function in the inherit classes to change the default properties
        this.initProperties();

        //if this is true your have to manipulate your response
        // else this run of methods according to http verbs of the request.
        if (!customEndpoint) {
            switch (this.req.method.toLowerCase()) {
                case 'get':
                    if (this.validate_permissions) {
                        this.req.verificatePermisssion(this.module_name, 'read').then(verification => {
                            if (verification){
                                this._initGet();
                            }
                        });
                    } else {
                        this._initGet();
                    }
                    break;
                case 'post':
                    if (this.validate_permissions) {
                        this.req.verificatePermisssion(this.module_name, 'create').then(verification => {
                            if (verification) {
                                this.post();
                            }
                        });
                    } else {
                        this.post();
                    }
                    break;
                case 'put':
                    if (this.validate_permissions) {
                        this.req.verificatePermisssion(this.module_name, 'update').then(verification => {
                            if (verification) {
                                this._initPut();
                            }
                        });
                    } else {
                        this._initPut();
                    }
                    break;
                case 'delete':
                    if (this.validate_permissions) {
                        this.req.verificatePermisssion(this.module_name, 'delete').then(verification => {
                            if (verification) {
                                this._initDelete();
                            }
                        });
                    } else {
                        this._initDelete();
                    }
                    break;
                default:
                    this.responseBadRequest();
            }
        }
    }

    /**
     * initialize the default properties
     * @private
     */
    _initPropertyDefault(){
        /**
         * Model belong to this class
         * @type {object<model>}
         */
        this.model = null;

        /**
         * all fields will use to response to user
         * @type {array}
         */
        this.response_fields = [];

        /**
         * relations will use to response to user (these relations are attach to this.model).
         * @type {array}
         */
        this.relations = [];

        /**
         * all fields fillables to default model (this.model).
         * @type {array}
         */
        this.fillables = [];

        /**
         * primary key used to find records.
         * @type {string}
         */
        this.pk = null;

        /**
         * quantity of records into response
         * @type {number}
         */
        this.limit = 10;

        /**
         * initial record to took from total.
         * @type {number}
         */
        this.offset = 0;

        /**
         * validate fields sent from query parameters
         * @type {boolean}
         */
        this.validate_search_fields = false;

        /**
         * fields used to match custom searches
         * @type {object}
         */
        this.search_fields = [];

        /**
         * template string
         * Example: 'Not Found <%= record %>!'
         * @type {string}
         */
        this.not_found_message = 'Not Found <%= record %>!';


        this.bad_request_message = 'Bad Request';

        /**
         * module name used to validate permissions
         * @type {string}
         */
        this.module_name = null;


        /**
         * active o deactivate permissions validations
         * @type {boolean}
         */
        this.validate_permissions = false;
    }

    /**
     * if is not a custom endpoint this run the method that allow to get one or many records
     * @private
     */
    _initGet() {
        if (_.isEmpty(this.req.params) || _.isEmpty(this.req.params[this.pk])) {
            this.getMany();
        } else {
            this.getOne();
        }
    }

    /**
     * if is not a custom endpoint this run the method that allow to update one or many records
     * @private
     */
    _initPut() {
        if (!_.isEmpty(this.req.params[this.pk])) {
            this.put();
        } else {
            this.responseBadRequest();
        }
    }

    /**
     * if is not a custom endpoint this run the method that allow to delete one or many records
     * @private
     */
    _initDelete() {
        if (!_.isEmpty(this.req.params[this.pk])) {
            this.delete();
        } else {
            this.responseBadRequest();
        }
    }

    /**
     * this method is used to initialize default properties and automatically run when this class is instanced.
     * @public
     * @return {boolean}
     */
    initProperties(){
        return false;
    }

    /**
     * default response to http code 400
     * @public
     */
    responseBadRequest(){
        this.res.status(400).json({
            message: this.bad_request_message
        });
    }

    /**
     * default response to http code 404
     * @public
     */
    responseNotFound(id){
        const compiled = _.template(this.not_found_message);
        const message = compiled({ 'record': id });
        this.res.status(404).json({
            message
        });
    }

    /**
     * default method that response with a http code 400
     * if is not overwrite method.
     * it is used to response with one record.
     * @public
     */
    getOne(){
        this.responseBadRequest();
    }

    /**
     * default method that response with a http code 400
     * if is not overwrite method.
     * it is used to response with many record.
     * @public
     */
    getMany(){
        this.responseBadRequest();
    }

    /**
     * default method that response with a http code 400
     * if is not overwrite method.
     * it is used to create a record.
     * @public
     */
    post(){
        this.responseBadRequest();
    }

    /**
     * default method that response with a http code 400
     * if is not overwrite method.
     * it is used to update a record.
     * @public
     */
    put(){
        this.responseBadRequest();
    }

    /**
     * default method that response with a http code 400
     * if is not overwrite method.
     * it is used to delete a record.
     * @public
     */
    delete(){
        this.responseBadRequest();
    }

    /**
     * Generic method to allow response with a record according to
     * parameters sent in request and established in the class
     * @public
     */
    async listOne(returnData = false){
        try {
            const pk = this.pk;
            const id = this.req.params[this.pk];
            const where_conditions = _.merge(this.getSearch(), { [pk]: id });

            const result = await this.model.findOne({
                include: this.relations,
                where: where_conditions,
                attributes: this.response_fields
            });
            if (_.isEmpty(result)) {
                return this.responseNotFound(id);
            }

            if (returnData) {
                return result;
            }

            this.res.status(200).json({
                response: result
            });

        } catch (e) {
            this.res.status(500).json({
                message: e.message
            });
        }
    }

    /**
     * Generic method to allow create a record according to
     * parameters sent in request and established in the class.
     * @public
     */
    async create(returnData = false, validate_fields = [], messages = []){
        let validated = true;
        if (_.isArray(validate_fields) && !_.isEmpty(validate_fields)) {
            validated = await this._validate_fields(validate_fields, messages);
        }

        if (validated) {
            let created = null;
            try {
                created = await this.model.create(this.req.body, {
                    retuning:true,
                    fields: this.fillables
                });

                if (returnData) {
                    return created;
                }

                this.res.status(201).json({
                    pk: created[this.pk]
                });
            } catch (e) {
                if (created) {
                    created.destroy();
                }
                this.res.status(500).json({
                    message: e.message
                })
            }
        }
    }

    /**
     * Generic method to allow update a record according to
     * parameters sent in request and established in the class.
     * @public
     */
    async update(returnData = false, validate_fields = [], messages = []){
        try {
            const pk = this.pk;
            const id = this.req.params[this.pk];
            const record = await this.model.findByPk(id);
            const fields = this._selectedFields();
            if (_.isEmpty(record)) {
                return this.responseNotFound(id);
            } else {
                let validated = true;
                if (_.isArray(validate_fields) && !_.isEmpty(validate_fields)) {
                    validated = await this._validate_fields(validate_fields, messages, true);
                }

                if (validated) {
                    const updated = await record.update(this.req.body, {
                        fields,
                    });

                    if (returnData) {
                        return updated;
                    }

                    this.res.status(200).json({
                        pk: id
                    });
                }
            }
        } catch (e) {
            this.res.status(500).json({
                message: e.message
            })
        }

    }

    /**
     * validate all fields from this.validate_search_fields.
     * search if the field exists and match into the validate_search_fields array
     * @param {array} fields fields will validate.
     * @param {array<string>} messages it is used when fail validations
     * @param {boolean} update if it is called from update, the value should true
     * @return {Promise<boolean>}
     * @private
     */
    async _validate_fields(fields, messages, update) {
        for (const index in fields) {
            const field = fields[index];
            const where =  {
                [field]: this.req.body[field]
            };
            if (update) {
                where[this.pk] = {
                    [Op.ne]: this.req.params[this.pk]
                }
            }
            const attributes = [field];
            const record = await this.model.findOne({
                where,
                attributes
            });
            if (record) {
                this.res.status(409).json({
                    message: messages[index]
                });
                return false;
            }
        }
        return true;
    }

    /**
     * the fields used to update, this fields make a intersection between the sents and the fillables fields.
     * @return {array} list of the fields that can be updated.
     * @private
     */
    _selectedFields(){
        const { body } = this.req;
        if (!_.isEmpty(body)) {
            const fields = _.keys(body);
            return _.intersection(this.fillables, fields);
        }
        return [];
    }

    /**
     * Generic method to allow response with a list of record according to
     * parameters sent in request and established in the class.
     * @public
     */
    async listMany(where_conditions = {}, returnData = false) {
        try {
            const search_where = this.getSearch();
            if (!_.isEmpty(this._where_master)) {
                where_conditions = _.merge(search_where, where_conditions);
            }
            const offset = this.getOffset();
            const limit = this.getLimit();
            const order = this.getOrderBy();
            const total = await this.getTotal(where_conditions);

            const results = await this.model.findAll({
                include: this.relations,
                attributes: this.response_fields,
                limit,
                offset,
                order,
                where: where_conditions,
            });

            this.total = total;
            this.first = (offset < this.total) ? offset + 1 : null;
            const last_tmp = (offset + limit);
            this.last = ( last_tmp <= this.total) ? last_tmp : (last_tmp > this.total && !_.isNull(this.first)) ? this.total: null;

            if (returnData) {
                return results;
            }
            this.sendStandardResponseForMany(this.total, results.length, this.first, this.last, results);
        } catch (e) {
            this.res.status(500).json({
                message: e.message
            });
        }
	}

    /**
     * Standard response for many record.
     * @param {int} total of record.
     * @param {int} filters record.
     * @param {int} first record.
     * @param {int} last record.
     * @param {array} response data
     * @public
     */
	sendStandardResponseForMany(total, filters, first, last, response) {
        this.res.status(200).json({
            total,
            filters,
            first,
            last,
            response,
        });
    }

    /**
     * Generic method to allow delete a record according to
     * parameters sent in request and established in the class.
     * @public
     */
	async destroy(){
        const pk = this.pk;
        const id = this.req.params[this.pk];
        try {
            const destroyed = await this.model.findByPk(id);
            if (_.isEmpty(destroyed)) {
                return this.responseNotFound(id);
            }

            await this.model.destroy({
                where: {
                    [pk]: id
                },
            });

            this.res.status(204).json({});
        } catch (e) {
            this.res.status(404).json({
                message: e.message
            })
        }
    }

    /**
     * get record total.
     * @param {object} where conditions/clause
     * @public
     */
    async getTotal(where){
        const clean_attributes_of_relations = cleanAttributes(_.cloneDeep(this.relations));
        const private_field = `${this.model.tableName}.${this.pk}`;
        const total = await this.model.findAll({
            attributes:[this.pk],
            include: clean_attributes_of_relations,
            where,
            // group: [private_field],
        });

        return total.length || 0;
    }

    /**
     * get limit parameter from request query parameters.
     * it is used to dynamic limit
     * @public
     */
    getLimit(){
        return parseInt(this.req.query.limit) || this.limit;
    }

    /**
     * get offset parameter from request query parameters.
     * it is used to dynamic offset
     * @public
     */
    getOffset(){
        return parseInt(this.req.query.offset) || this.offset;
    }

    /**
     * make a dynamically where condition according to request parameters.
     * @public
     * @return {object}
     */
    getSearch(){
        this._where_master = {};
        if (!_.isEmpty(this.req.query.searchfield)){
            if (_.isArray(this.req.query.searchfield) && _.isArray(this.req.query.search)){
                for (let index in this.req.query.searchfield) {
                    const field = this.req.query.searchfield[index];
                    const search = this.req.query.search[index];
                    let type = undefined;
                    try {
                        type = (index in this.req.query.searchtype)? this.req.query.searchtype[index]:this.req.query.searchtype;
                    } catch (e) {
                        type = this.req.query.searchtype;
                    }

                    if (field in this.search_fields) {
                        this.makeSearch(field, search, type, this.search_fields[field]);
                    }
                }
            }

            if (this.req.query.searchfield in this.search_fields) {
                this.makeSearch(this.req.query.searchfield, this.req.query.search, this.req.query.searchtype, this.search_fields[this.req.query.searchfield]);
            }
        }
        return this._where_master;
    }

    /**
     * set dynamically where condition according to request parameters.
     * @param {string} field search field
     * @param {string} search
     * @param {string} search_type search type to search field
     * @param {object} search_data setup data
     * @public
     * @return {object}
     */
    makeSearch(field, search, search_type, search_data) {
        const type = this.getFormatedSearchType(search_type, search);
        switch (search_data.whereTo || '') {
            case 'relation':
                const relation = findRelation(this.relations, search_data.relation);
                relation.where = relation.where || {};
                relation.where[search_data.real_name || field] = {
                    [type]: this.getFormatedSearch(search, type)
                };
                break;
            case 'master':
                this._where_master[field] = {
                    [type]: this.getFormatedSearch(search, type)
                };
                break;
        }
    }

    /**
     * make format to searches according to searchType.
     * @param {object} searchType search type to find record.
     * @param {string} search
     * @public
     * @return {object}
     */
    getFormatedSearchType(searchType, search){
        if (search == null) {
            return this._getSearchType('eq');
        } else {
            return this._getSearchType(searchType);
        }
    }

    /**
     * make format to search field.
     * @param {string} search
     * @param {object} searchType search type to find record.
     * @public
     * @return {object}
     */
    getFormatedSearch(search, searchType){
        switch (searchType) {
            case Op.like:
                return `%${search}%`;
            case Op.eq:
                return search;
            default:
                return `%${search}%`;
        }
    }

    /**
     * permit order record according to stabilised parameters in request or class.
     * @return {array}
     * @private
     */
    getOrderBy() {
        let direction = 'DESC';
        let order_by = this.pk;
        if (!_.isEmpty(this.req.query.orderby) && this.validate_search_fields){
            order_by = (this.search_fields.indexOf(this.req.query.orderby) < 0)? this.req.query.orderby : this.pk;
        } else {
            order_by = this.req.query.orderby;
        }

        if (!_.isEmpty(this.req.query.orderdirection) && _.isString(this.req.query.orderdirection)) {
            direction = (this.req.query.orderdirection.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
        }

        if (!_.isEmpty(order_by)) {
            return [
                [order_by, direction]
            ];
        }
        return [];
    }

    /**
     * this method allow to know the search method., i.e, equal or like '%%'.
     * @param search_type search if exist the search type.
     * @return {string} typeof like|typeof eq
     * @private
     */
    _getSearchType(search_type = null) {
        search_type = search_type || '';
        switch (search_type.toLowerCase()) {
            case 'like':
                return Op.like;
            case 'eq':
                return Op.eq;
            default:
                return Op.like;
        }
    }
}

module.exports = base;
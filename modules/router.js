const router = require('express').Router();

/* 
//repository_object
const repository_object = require('./repository_object/repository_object.router');
router.use('/repository_object', repository_object);
*/

//repository
const repository = require('./repository/repository.router');
router.use('/repository', repository);

/*
//object_type
const object_type = require('./object_type/object_type.router');
router.use('/object_type', object_type);

//event
const event = require('./event/event.router');
router.use('/event', event);

//speaker
const speaker = require('./speaker/speaker.router');
router.use('/speaker', speaker);

//attendee_speaker
const attendee_speaker = require('./attendee_speaker/attendee_speaker.router');
router.use('/attendee_speaker', attendee_speaker);

//attendee
const attendee = require('./attendee/attendee.router');
router.use('/attendee', attendee);

//ticket
const ticket = require('./ticket/ticket.router');
router.use('/ticket', ticket);

//user
const user = require('./user/user.router');
router.use('/user', user);

//users_type
const users_type = require('./users_type/users_type.router');
router.use('/users_type', users_type);

//community
const community = require('./community/community.router');
router.use('/community', community);

//tag
const tag = require('./tag/tag.router');
router.use('/tag', tag);

//community_tag
const community_tag = require('./community_tag/community_tag.router');
router.use('/community_tag', community_tag);

//form
const form = require('./form/form.router');
router.use('/form', form);

//input
const input = require('./input/input.router');
router.use('/input', input);

//input_data
const input_data = require('./input_data/input_data.router');
router.use('/input_data', input_data);

//coupon
const coupon = require('./coupon/coupon.router');
router.use('/coupon', coupon);

//company
const company = require('./company/company.router');
router.use('/company', company);

//contact_position
const contact_position = require('./contact_position/contact_position.router');
router.use('/contact_position', contact_position);

//call_for_paper
const call_for_paper = require('./call_for_paper/call_for_paper.router');
router.use('/call_for_paper', call_for_paper);

//call_for_paper_detail
const call_for_paper_detail = require('./call_for_paper_detail/call_for_paper_detail.router');
router.use('/call_for_paper_detail', call_for_paper_detail);

//contact
const contact = require('./contact/contact.router');
router.use('/contact', contact);

//contact_detail
const contact_detail = require('./contact_detail/contact_detail.router');
router.use('/contact_detail', contact_detail);

//sponsor
const sponsor = require('./sponsor/sponsor.router');
router.use('/sponsor', sponsor);

//type_sponsor
const type_sponsor = require('./type_sponsor/type_sponsor.router');
router.use('/type_sponsor', type_sponsor);

//exhibitor
const exhibitor = require('./exhibitor/exhibitor.router');
router.use('/exhibitor', exhibitor);
 */
module.exports = router;

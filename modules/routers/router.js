const router = require('express').Router();


//repository_object
const repository_object = require('./repository_object.router');
router.use('/repository_object', repository_object);

//repository
const repository = require('./repository.router');
router.use('/repository', repository);

//object_type
const object_type = require('./object_type.router');
router.use('/object_type', object_type);

//event
const event = require('./event.router');
router.use('/event', event);

//speaker
const speaker = require('./speaker.router');
router.use('/speaker', speaker);

//attendee
const attendee = require('./attendee.router');
router.use('/attendee', attendee);

//ticket
const ticket = require('./ticket.router');
router.use('/ticket', ticket);

//user
const user = require('./user.router');
router.use('/user', user);

//users_type
const users_type = require('./users_type.router');
router.use('/users_type', users_type);

//community
const community = require('./community.router');
router.use('/community', community);

//tag
const tag = require('./tag.router');
router.use('/tag', tag);

//community_tag
const community_tag = require('./community_tag.router');
router.use('/community_tag', community_tag);

//form
const form = require('./form.router');
router.use('/form', form);

//input
const input = require('./input.router');
router.use('/input', input);

//input_data
const input_data = require('./input_data.router');
router.use('/input_data', input_data);

//coupon
const coupon = require('./coupon.router');
router.use('/coupon', coupon);

//company
const company = require('./company.router');
router.use('/company', company);

//contact_position
const contact_position = require('./contact_position.router');
router.use('/contact_position', contact_position);

//call_for_paper
const call_for_paper = require('./call_for_paper.router');
router.use('/call_for_paper', call_for_paper);

//call_for_paper_detail
const call_for_paper_detail = require('./call_for_paper_detail.router');
router.use('/call_for_paper_detail', call_for_paper_detail);

//contact
const contact = require('./contact.router');
router.use('/contact', contact);

//contact_detail
const contact_detail = require('./contact_detail.router');
router.use('/contact_detail', contact_detail);

//sponsor
const sponsor = require('./sponsor.router');
router.use('/sponsor', sponsor);

//type_sponsor
const type_sponsor = require('./type_sponsor.router');
router.use('/type_sponsor', type_sponsor);

//exhibitor
const exhibitor = require('./exhibitor.router');
router.use('/exhibitor', exhibitor);

//session
const session = require('./session.router');
router.use('/session', session);

//session_attendee
const session_attendee = require('./session_attendee.router');
router.use('/session_attendee', session_attendee);

//track
const track = require('./track.router');
router.use('/track', track);

//track_session
const track_session = require('./track_session.router');
router.use('/track_session', track_session);

//room
const room = require('./room.router');
router.use('/room', room);

//type_booth
const type_booth = require('./type_booth.router');
router.use('/type_booth', type_booth);

//ticket_sell
const ticket_sell = require('./ticket_sell.router');
router.use('/ticket_sell', ticket_sell);

module.exports = router;

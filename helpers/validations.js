/**
 * Email validation
 * @param {string} email E-mail
 * @returns {boolean} Is valid email
 */
exports.validateEmail = (email) => {
	if(!email) {
		throw new Error('Text is required');
	}
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	return re.test(email);
}

/**
 * Some testing users has 3 character passwords 
 * @param {string} password 
 * @returns {boolean} Is valid password
 */
exports.validateLoginPassword = (password) => {
  return typeof password === typeof '' && password.length > 0;
}

exports.validateDate = (value) => {
	let regex = /^\d{4,4}-\d{2,2}-\d{2,2}$/;
	return regex.test(value);
}

exports.validateUUID = (v) => {
	const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
	if(!v) {
		throw new Error("UUID is required");
	}
	return typeof v === typeof '' && regex.test(v);
}

exports.validateWEB = (value) =>
{
	let regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
	return regex.test(value);
}

/**
 * Person name validation
 * @param {string} value Name
 * @returns {boolean} Is a valid name
 */
exports.validateName = (value) => {
	if (!value) {
		throw new Error('Text is required')
	}
	return typeof value === typeof '' && !/[.0-9!_@#\d½º<>↓;?:¡¿|/[¨{}\$%\^\&*\])\(+=._-]/g.test(value);
}

exports.validateNotEmptyString = (value) => {
	if(!value) {
		throw new Error('Text is required');
	}
	return typeof value === typeof '' && value.length >= 3;
}

exports.validateText = (value) => {
	if(!value) {
		throw new Error('Text is required');
	}
	return typeof value === typeof '';
}

exports.validateNotNegative =  (value) => {
	if(!value && value !== 0) {
		throw new Error('Number is required');
	}
	return !isNaN(value) && value >= 0;
}

exports.validateNotNegativeInteger = (value) => {
	if(!value && value !== 0 || isNaN(value)) {
		throw new Error('Number is required');
	}

	if(value === 0) { // avoid validate zero, causes division by 0 error
		return true;
	}

	if((value % parseInt(value)) > 0) {
		throw new Error('Decimal is not permitted')
	}

	return value >= 0;
}

exports.validatePositive = value => {
	if(!value || isNaN(value) || value === 0) {
		throw new Error('Number is required');
	}

	return value > 0;
}

exports.validatePositiveInteger = value => {
	if(!value || isNaN(value) || value === 0) {
		throw new Error('Number is required');
	}

	if((value % parseInt(value)) > 0) {
		throw new Error('Decimal is not permitted')
	}

	return value >= 1;
}

/**
 * Email validation
 * @param {string} email E-mail
 * @returns {boolean} Is valid email
 */
exports.validateEmail = (email) => {
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

exports.validateName = (value) => {
	if(!value) {
		throw new Error('Name is required');
	}
	return typeof value === typeof '' && value.length >= 3;
}

exports.validateDescription = (value) => {
	if(!value) {
		throw new Error('Description is required');
	}
	return typeof value === typeof '';
}
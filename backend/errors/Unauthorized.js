class Unauthorized extends Error {
	constructor(message = 'Unauthorized') {
		super();
		this.status = 401;
		this.message = message;
	}
}

module.exports = Unauthorized;

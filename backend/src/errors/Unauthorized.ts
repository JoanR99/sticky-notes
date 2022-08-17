class Unauthorized extends Error {
	status: number;
	constructor(message: string = 'Unauthorized') {
		super();
		this.status = 401;
		this.message = message;
	}
}

export default Unauthorized;

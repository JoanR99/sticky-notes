class BadRequest extends Error {
	status: number;
	messages: string[];
	constructor(messages: string[]) {
		super();
		this.status = 400;
		this.messages = messages;
	}
}

export default BadRequest;



class URL {
	constructor(link, type) {
		this._link = link;
		this._type = type;
	}

	get link() {
		return this._link;
	}

	set link(value) {
		this._link = value;
	}
}

export default URL;

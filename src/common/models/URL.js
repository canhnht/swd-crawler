

class URL {
	constructor(domain, link, type) {
    this._domain = domain;
		this._link = link;
		this._type = type;
	}

  get domain() {
    return this._domain;
  }

  get link() {
    return this._link;
  }

  get type() {
    return this._type;
  }
}

export default URL;

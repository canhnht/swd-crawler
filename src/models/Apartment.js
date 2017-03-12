

class Apartment {
	constructor() {
		this._roomNumber = '';
		this._area = '';
		this._address = '';
	}

	get roomNumber() {
		return this._roomNumber;
	}

	set roomNumber(value) {
		this._roomNumber = value;
	}
}

export default Apartment

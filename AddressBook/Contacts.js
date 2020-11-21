class Contacts {
    constructor() {}
    //getter and setter
    get id() { return this._id }
    set id(id) {
        this._id = id;
    }
    get fullName() { return this._fullName }
    set fullName(fullName) {
        this._fullName = fullName;
    }
    get address() { return this._address }
    set address(address) {
        let addressRegex = RegExp('^[a-zA-z]{3,}(\\s[a-zA-z]{3,})*$');
        if (addressRegex.test(address))
            this._address = address;
        else {
            throw 'Address is Incorrect';
        }
    }
    get city() { return this._city }
    set city(city) {
        this._city = city;

    }
    get state() { return this._state }
    set state(state) {
        this._state = state;
    }

    get phoneNumber() { return this._phoneNumber }
    set phoneNumber(phoneNumber) {
        let phoneNumberRegex = RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')
        if (phoneNumberRegex.test(phoneNumber))
            this._phoneNumber = phoneNumber
        else {
            throw 'phoneNumber is Incorrect';
        }
    }

    get pinCode() { return this._pinCode }
    set pinCode(pinCode) {
        let pinCodeRegex = RegExp('^[1-9]{1}[0-9]{2}\\s?[0-9]{3}$')
        if (pinCodeRegex.test(pinCode))
            this._pinCode = pinCode
        else throw 'Pincode is Incorrect';
    }

    toString() {
        return "Id: " + this.id + ", FullName: " + this.fullName + ", Address: "
            + this.address + ", City: " + this.city + ", State: " + this.state + " Pincode: " + this.pinCode + " Phone Number: " + this.phoneNumber;
    }
}
class EmployeePayrollData {

    constructor() { }

    get id() { return this._id }
    set id(id) {
        this._id = id
    }
    get name() { return this._name }
    set name(name) {
        this._name = name;
    }

    get gender() { return this._gender }
    set gender(gender) {
        this._gender = gender
    }

    get salary() { return this._salary }
    set salary(salary) {
        this._salary = salary;
    }

    get profilePic() { return this._profilePic }
    set profilePic(profilePic) {
        this._profilePic = profilePic;
    }

    get department() { return this._department }
    set department(departments) {
        this._department = departments;
    }

    get note() { return this._note }
    set note(note) {
        this._note = note;
    }

    get startDate() { return this._startDate }
    set startDate(startDate) {
        let todayDate = new Date()
        console.log("StartDate::" + startDate)
        if (startDate <= todayDate && startDate >= todayDate.setDate(todayDate.getDate() - 30)) {
            this._startDate = startDate;
            console.log(this._startDate)
        }
        else {
            alert("DATE RANGE INVALID")
            throw 'Date Range Invalid!'
        }

    }
}
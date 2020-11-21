let isUpdate = false;
let employeePayrollObj = {};


let id = 0
const addData = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    try {
        setEmployeePayrollObject();
        if(site_properties.use_local_storage.match("true")){
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        }else{
            createOrUpdateEmployeePayroll();
        }
    }
    catch (err) {
        return;
    }
}

const setEmployeePayrollObject = () => {
    if (!isUpdate && site_properties.use_local_storage.match("true")) employeePayrollObj.id = createNewEmployeeId();
    employeePayrollObj._name = document.getElementById('name').value;
    employeePayrollObj._profilePic = getRadioValue(document.getElementsByName('profile'));
    employeePayrollObj._gender = getRadioValue(document.getElementsByName('gender'));
    employeePayrollObj._department = getCheckBoxValue(document.getElementsByClassName('checkbox'));
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._startDate = new Date(document.getElementById('month').value + " " + document.getElementById('day').value + "," + document.getElementById('year').value)
    employeePayrollObj._note = document.getElementById('notes').value;
}

const createAndUpdateStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeeList"));
    if (employeePayrollList) {
        console.log("Inside Create UPdate: Id Is " + employeePayrollObj.id);
        let empPayrollData = employeePayrollList.find(empData => empData.id == employeePayrollObj.id);
        console.log("EmployeePayrollData: " + empPayrollData)
        if (!empPayrollData) employeePayrollList.push(employeePayrollObj);
        else {
            const index = employeePayrollList.map(empData => empData.id).indexOf(empPayrollData.id);
            console.log("Index is  " + index)
            employeePayrollList.splice(index, 1, employeePayrollObj);
        }
    }
    else {
        employeePayrollList = [employeePayrollObj];
    }
    localStorage.setItem("EmployeeList", JSON.stringify(employeePayrollList));
}

const createOrUpdateEmployeePayroll = ()=>{
    let postUrl = site_properties.server_url;
    let methodCall = "POST";
    if(isUpdate){
        methodCall = "PUT";
        postUrl = postUrl + employeePayrollObj.id.toString();
    }
    makeServiceCall(methodCall, postUrl, true, employeePayrollObj)
    .then(responseText => {
        console.log(responseText)
        resetForm();
        window.location.replace(site_properties.home_page);
    })
    .catch(error => {
        throw error;
    });
}

const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    else {
        employeePayrollData.id = id;
    }
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData) => {
    try {
        employeePayrollData.name = employeePayrollObj._name;
    } catch (error) {
        setTextValue('.text-error', e);
        throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    employeePayrollData.startDate = new Date(Date.parse(employeePayrollObj._startDate));

    alert(employeePayrollData);
}

const createNewEmployeeId = () => {
    let empId = localStorage.getItem("EmployeeId");
    empId = !empId ? 1 : (parseInt(empId) + 1).toString();
    localStorage.setItem("EmployeeId", empId);
    return empId;
}

const resetForm = () => {
    document.forms[0].reset();
    const output = document.querySelector('.salary-output')
    output.textContent = ""
}

function getRadioValue(radios) {
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}
function getCheckBoxValue(boxes) {
    let boxlist = []
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            boxlist.push(boxes[i].value)
        }
    }
    return boxlist;
}

window.addEventListener('DOMContentLoaded', (event) => {
    
    const name = document.querySelector('#name');
    name.addEventListener('input', function () {
        if (name.value.length == 0) {
            setTextValue('.text-error', "");
            return;
        }
        try {
            checkName(name.value);
            setTextValue('.text-error', "");
        } catch (error) {
            setTextValue('.text-error', error);
        }
    });

    const date = document.querySelector('#startDate');
    name.addEventListener('input', function () {
        let startDate = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
        try {
            checkStartDate(new Date(Date.parse(startDate)));
            setTextValue('.date-error', "");
        } catch (error) {
            setTextValue('.date-error', error);
        }
    });

    const salary = document.querySelector('#salary')
    setTextValue('.salary-output', salary.value);
    salary.addEventListener('input', function () {
        setTextValue('.salary-output', salary.value);
    });

    document.querySelector('#cancelButton').href = site_properties.home_page;
    checkForUpdate();
});



const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    console.log("Obj ID " + employeePayrollObj.id)
    console.log("EmployeeObj is: " + employeePayrollObj._department)
    let name = document.querySelector('#name').value = employeePayrollObj._name;
    console.log("Name is " + name)
    setSelectedValue('[name = profile]', employeePayrollObj._profilePic);
    setSelectedValue('[name = gender]', employeePayrollObj._gender);
    setCheckBox('[class=checkbox]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ")
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

console.log("departments: " + employeePayrollObj._department)
const setSelectedValue = (property, value) => {
    let allitems = document.querySelectorAll(property);
    console.log("All items:" + allitems)
    allitems.forEach(item => {

        if (Array.isArray(value)) {

            if (value.includes(item.value)) item.checked = true;

        } else if (item.value === value) item.checked = true;
        console.log("Item is :" + item.value)
    });
}

const setCheckBox = (property, values) => {
    let items = document.querySelectorAll(property);
    console.log(items)
    items.forEach(item => {
        if (values.includes(item.value)) {
            console.log("True")
            item.checked = true;
        }
    });
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

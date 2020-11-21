let validationFlag = true;
let isUpdate = false;
let contactDataObj = {};

const addData = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    try {
        setContactDataObj();
        if(site_properties.use_local_storage.match("true")){
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        }else{
            createOrUpdateContactAddress();
        }
        
    }
    catch (err) {
        return;
    }
}

const setContactDataObj = () => {
    contactDataObj._fullName = document.getElementById('fullname').value;
    contactDataObj._address = document.getElementById('address').value;
    contactDataObj._city = document.getElementById('city').value;
    contactDataObj._state = document.getElementById('state').value;
    contactDataObj._phoneNumber = document.getElementById('phone_number').value;
    contactDataObj._pinCode = document.getElementById('zip').value;
}

const createOrUpdateContactAddress = ()=>{
    let postUrl = site_properties.server_url;
    let methodCall = "POST";
    if(isUpdate){
        methodCall = "PUT";
        postUrl = postUrl + contactDataObj.id.toString();
    }
    makeServiceCall(methodCall, postUrl, true, contactDataObj)
    .then(responseText => {
        console.log(responseText)
        resetForm();
        window.location.replace(site_properties.home_page);
    })
    .catch(error => {
        throw error;
    });
}

const createAndUpdateStorage = () => {
    let contactList = JSON.parse(localStorage.getItem("ContactList"));
    console.log(contactList)
    if (contactList) {
        console.log("Inside Create UPdate: Id Is " + contactDataObj._fullName);
        let contactData = contactList.find(contactdata => contactdata.id == contactDataObj.id);
        console.log("Contacts: " + contactData)
        if (!contactData) contactList.push(createContactData());
        else {
            const index = contactList.map(contactdata => contactdata.id).indexOf(contactData.id);
            console.log("Index is  " + index)
            contactList.splice(index, 1, createContactData(contactData.id));
        }
    }
    else {
        console.log("Inside Else:");
        contactList = [contactDataObj];
    }
    localStorage.setItem("ContactList", JSON.stringify(contactList));
}

const createContactData = (id) => {
    let contactData = new Contacts();
    if (!id) contactData.id = createNewContactId();
    else {
        contactData.id = id;
    }
    setContactData(contactData);
    return contactData;
}

const setContactData = (contactData) => {

    try {
        contactData.fullName = contactDataObj._fullName;
    } catch (error) {
        setTextValue('.text-error', error);
        throw error;
    }
    contactData.address = contactDataObj._address;
    contactData.city = contactDataObj._city;
    contactData.state = contactDataObj._state;
    contactData.phoneNumber = contactDataObj._phoneNumber;
    contactData.pinCode = contactDataObj._pinCode;
    alert(contactData.toString());
}
const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}
const createNewContactId = () => {
    let contactId = localStorage.getItem("ContactId");
    contactId = !contactId ? 1 : (parseInt(contactId) + 1).toString();
    localStorage.setItem("ContactId", contactId);
    return contactId;
}

const resetForm = () => {
    document.forms[0].reset();
}

window.addEventListener('DOMContentLoaded', (event) => {

    const fullName = document.querySelector('#fullname');
    fullName.addEventListener('input', function () {
        if (fullName.value.length == 0) {
            textError.textContent = "";
            return;
        }
        try {
            checkName(fullName.value);
            setTextValue('.text-error',"");
        } catch (error) {
            setTextValue('.text-error',error);
        }
    });

    const phone = document.querySelector('#phone_number');
    phone.addEventListener('input', function () {
        if (phone.value.length == 0) {
            phoneError.textContent = ""
            return;
        }
        try {
            checkPhone(phone.value);
            setTextValue('.phone-error',"");
        } catch (error) {
            setTextValue('.phone-error',error);
        }
    });

    const address = document.querySelector('#address');
    address.addEventListener('input', function () {
        if (address.value.length == 0) {
            addressError.textContent = "";
            return;
        }
        try {
            checkAddress(phone.value);
            setTextValue('.address-error',"");
        } catch (error) {
            setTextValue('.address-error',"");
        }
    });

    checkForUpdate();
});


const checkForUpdate = () => {
    const contactDataJson = localStorage.getItem('editContact');
    isUpdate = contactDataJson ? true : false;
    if (!isUpdate) return;
    contactDataObj = JSON.parse(contactDataJson);
    setForm();
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const setForm = () => {
    setValue('#fullname', contactDataObj._fullName);
    console.log("Obj ID " + contactDataObj.id)
    let name = document.querySelector('#fullname').value = contactDataObj._fullName;
    console.log("Name is " + name)
    setValue('#phone_number', contactDataObj._phoneNumber);
    setValue('#address', contactDataObj._address);
    setValue('#city', contactDataObj._city);
    setValue('#state', contactDataObj._state);
    setValue('#zip', contactDataObj._pinCode);
}
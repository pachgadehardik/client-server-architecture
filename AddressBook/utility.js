const checkName = (fullName)=>{
    let nameRegex = RegExp('^[a-zA-Z\\s]+$');
    if (!nameRegex.test(fullName))
     throw 'Name is Incorrect';
}

const checkPhone = (phone) =>{
    let phoneNumberRegex = RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')
    if (!phoneNumberRegex.test(phone))
    throw 'Phone is Not Valid';
}

const checkAddress =(address) =>{
    let addressRegex = RegExp('^[a-zA-z]{3,}(\\s[a-zA-z]{3,})*$');
        if (!addressRegex.test(address))
        throw 'Address Is Not Valid!'
    }
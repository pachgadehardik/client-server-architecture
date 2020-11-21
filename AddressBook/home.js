let contactdataList;

window.addEventListener('DOMContentLoaded', (event) => {
    if (site_properties.use_local_storage.match("true")) {
        getContactDataFromStorage();
    }else{
        getContactFromServer();
    }
});

const getContactDataFromStorage = () =>{
    contactdataList = localStorage.getItem('ContactList') ? JSON.parse(localStorage.getItem('ContactList')) : [];
    processContactDataResponse();
}

const processContactDataResponse =  ()=>{
    document.querySelector('.address-count').textContent = contactdataList.length;
    createInnerHtml();
    localStorage.removeItem('editContact')
}

const getContactFromServer = ()=>{
    makeServiceCall("GET", site_properties.server_url, true)
    .then(responseText => {
        contactdataList = JSON.parse(responseText);
        processContactDataResponse();
    })
    .catch(error => {
        console.log("Get Error Status: " + JSON.stringify(error));
        contactdataList = [];
        processEmployeePayrollDataResponse();
    });
}

const createInnerHtml = () => {
    const headerHtml = "<th>Full Name</th><th>Address</th><th>City</th><th>State</th><th>ZipCode</th><th>PhoneNo</th><th>Actions</th>";
    if (contactdataList.length == 0) {
        console.log("ContactData List Empty")
    }
    let innerHtml = `${headerHtml}`;
    for (const contactData of contactdataList) {
        innerHtml = ` ${innerHtml}
  <tr>
      <td>${contactData._fullName}</td>
      <td>${contactData._address}</td>
      <td>${contactData._city}</td>
      <td>${contactData._state}</td>
      <td>${contactData._pinCode}</td>
      <td>${contactData._phoneNumber}</td>
      <td>
        <img id="${contactData.id}" onclick="remove(this)" alt="delete" src="assets\\delete-black-18dp.svg">
            &nbsp;
        <img id="${contactData.id}" onclick="update(this)" alt="update" src="assets\\create-black-18dp.svg">
    </td>
</tr>`;
    }
    document.querySelector('#addressbook-table').innerHTML = innerHtml;
}

// const getContactDataFromStorage = () => {
//     return localStorage.getItem('ContactList') ? JSON.parse(localStorage.getItem('ContactList')) : [];
// }

const remove = (node) => {
    console.log("Node ID Value:" + node.id)
    let contactData = contactdataList.find(contactD => contactD.id == node.id)
    if (!contactData) return;
    const index = contactdataList.map(contactD => contactD.id).indexOf(contactData.id);
    contactdataList.splice(index,1);
    if(site_properties.use_local_storage.match("true")){
        localStorage.setItem("ContactList", JSON.stringify(contactdataList));
        document.querySelector(".address-count").textContent = contactdataList.length;
        createInnerHtml();
    }else{
        const deleteUrl = site_properties.server_url + contactData.id.toString();
        makeServiceCall("DELETE", deleteUrl, false)
            .then(responseText => {
                createInnerHtml();
            })
            .catch(error => {
                console.log("Delete Error Status: " + JSON.stringify(error));
                alert("Error in Deleting!")
            });
    }
}
  
  const update = (node) => {  
    console.log("Node ID Value:" + node.id)
    let contactData = contactdataList.find(contactD => contactD.id == node.id)
    if (!contactData) return;
    localStorage.setItem('editContact', JSON.stringify(contactData,'\t', 2));
    window.location.replace(site_properties.add_contact_page);
  }
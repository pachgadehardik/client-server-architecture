let empPayrollList;
window.addEventListener('DOMContentLoaded', (event)=>{
    if(site_properties.use_local_storage.match("true")){
        getEmployeePayrollDataFromStorage();
    } else getEmployeePayrollDataFromServer();
});
const getEmployeePayrollDataFromStorage = () =>{
  empPayrollList =  localStorage.getItem('EmployeeList') ? JSON.parse(localStorage.getItem('EmployeeList')) : [];
  processEmployeePayrollDataResponse();
}

const processEmployeePayrollDataResponse = () =>{
  document.querySelector('.employee-count').textContent = empPayrollList.length;
  createInnerHtml();
  localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromServer = () =>{
  makeServiceCall("GET", site_properties.server_url, true)
  .then(responseText => {
    empPayrollList = JSON.parse(responseText);
    processEmployeePayrollDataResponse();
  })
  .catch(error =>{
    console.log("Get Error Status: "+JSON.stringify(error));
    empPayrollList = [];
    processEmployeePayrollDataResponse();
  });
}


const createInnerHtml = () => {
  const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>StartDate</th><th>Actions</th>";
  if(empPayrollList.length == 0) {
    console.log("Emploee List MEptt")
    // return;
  }
  let innerHtml = `${headerHtml}`;
  console.log("EmployeeList"+ empPayrollList)
  for(const employeePayroll of empPayrollList){
    innerHtml = ` ${innerHtml}
  <tr>
    <td><img class="profile" src="${employeePayroll._profilePic}"></td>
      <td>${employeePayroll._name}</td>
      <td>${employeePayroll._gender}</td>
      <td>${getDeptHtml(employeePayroll._department)}</td>
      <td>${employeePayroll._salary}</td>
      <td>${stringifyDate(employeePayroll._startDate)}</td>
      <td>
        <img id="${employeePayroll.id}" onclick="remove(this)" alt="delete" src="assets\\icons\\delete-black-18dp.svg">
            &nbsp;
        <img id="${employeePayroll.id}" onclick="update(this)" alt="update" src="assets\\icons\\create-black-18dp.svg">
    </td>
</tr>`;
  }
    document.querySelector('#display').innerHTML = innerHtml;
}

const getDeptHtml = (deptList)=>{
  let deptHtml = '';
  for(const dept of deptList){
    deptHtml = `${deptHtml} <div class = 'dept-label'>${dept}</div>`
  }
  return deptHtml
}


const remove = (node) => {
  console.log("Node ID Value:" + node.id)
  let employeePayrollData = empPayrollList.find(empData => empData.id == node.id)
  if (!employeePayrollData) return;
  const index = empPayrollList.map(empData => empData.id).indexOf(employeePayrollData.id);
  empPayrollList.splice(index,1);
  if(site_properties.use_local_storage.match("true")){
    localStorage.setItem("EmployeeList", JSON.stringify(empPayrollList));
    document.querySelector(".employee-count").textContent = empPayrollList.length;
    createInnerHtml();
  }else{
    const deleteUrl = site_properties.server_url+employeePayrollData.id.toString();
    makeServiceCall("DELETE", deleteUrl, false)
      .then(responseText =>{
        createInnerHtml();
      })
      .catch(error =>{
        console.log("Delete Error Status: "+ JSON.stringify(error));
        alert("Error in Deleting!")
      });
  }
 
}


const update = (node) => {  
  console.log("Node ID Value:" + node.id)
  let empPayrollData = empPayrollList.find(empData => empData.id == node.id)
  if (!empPayrollData) return;
  localStorage.setItem('editEmp', JSON.stringify(empPayrollData,'\t', 2));
  window.location.replace(site_properties.add_emp_payroll_page);
}

// const stringifyDate = (date)=>{
//   const options = { day: 'numeric', month:'short', year:'numeric'};
//   const newDate = !date? "undefined" :new Date(Date.parse(date)).toLocaleDateString('en-GB',options);
//   return newDate;
// }
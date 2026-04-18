import React, { useEffect, useState } from 'react'
import '../dashboard/Dashboard.css'
import axios, { all } from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { Edit } from '../edit/Edit';
export const Dashboard = () => {

  var [particularData, setParticularData] = useState({});


  var allErrors = {
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    mobileError: "",
    shiftError: "",
    genderError: "",
    roleError: "",
    termsError: ""
  };

  var [error, setError] = useState({
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    mobileError: "",
    shiftError: "",
    genderError: "",
    roleError: "",
    termsError: ""

  });

  var [allData, setAllData] = useState([]);

  var [token, setToken] = useState("");

  var [selectedId, setSelectedId] = useState("");

  var [selectedEditId, setSelectedEditId] = useState("");

  var [selectedEditId, setSelectedEditId] = useState("");

  var [noData, setNoData] = useState("");

  var navigate = useNavigate();

  // getAllData function
  async function getAllData() {
    var token = localStorage.getItem("loginUser");
    if (!token) {
      alert("Please login first");
      navigate('/')
      return;
    }
    try {
      var getData = await axios.get("http://localhost:8080/getAllUsers", {
        headers: {
          Authorization: token
        }
      })
      console.log(getData.data.message);
      setAllData(getData.data.message)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Invalid token or token expired");
          logOut()
        }
        else {
          alert("Something went wrong");
        }
      }
      else {
        alert("Server problem")
      }

    }
  }

  // goToAddUserPage function
  function goToAddUserPage() {
    navigate('/addUser')
  }

  // logOut function
  function logOut() {
    localStorage.removeItem('loginUser')
    navigate('/')
  }

  // view user modal functions
  function modalClose() {
    document.getElementById("userModal").style.display = "none";
  }

  function modalOpen() {
    document.getElementById("userModal").style.display = "flex";
  }

  // delete modal confirmation
  function closeModal() {
    document.getElementById("mainModal").style.display = "none";
  }

  // edit function data
  async function getUser(id) {
    console.log(id);
    var token = localStorage.getItem("loginUser");
    if (!token) {
      alert("Please login first");
      navigate('/')
      return;
    }
    try {
      var getParticularData = await axios.get(`http://localhost:8080/getParticularuser/${id}`, {
        headers: {
          Authorization: token
        }
      })
      var userData = getParticularData.data.message
      // console.log(userData);

      var finalNumber = userData.mobile
      var replacedNumber = finalNumber.replace("+91", "")
      setParticularData({ ...userData, mobile: replacedNumber })
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Invalid token or token expired");
          logOut()
        }
        else {
          alert("Something went wrong");
        }
      }
      else {
        alert("Server problem")
      }
    }

  }

  // edit modal 
  function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
  }

  function openEditModal(id) {
    document.getElementById("editModal").style.display = "flex";
    setSelectedEditId(id)
    getUser(id)

  }

  // viewData function
  async function viewData(id) {
    console.log(id);
    var token = localStorage.getItem("loginUser");
    if (!token) {
      alert("Please login first");
      navigate('/')
      return;
    }
    try {
      var getParticularData = await axios.get(`http://localhost:8080/getParticularuser/${id}`, {
        headers: {
          Authorization: token
        }
      })
      console.log(getParticularData.data.message);
      setParticularData(getParticularData.data.message)

      // call modalOpen function
      modalOpen();

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Invalid token or token expired");
          logOut()
        }
        else {
          alert("Something went wrong");
        }
      }
      else {
        alert("Server problem")
      }
    }

  }


  // deleteUserOpen function
  async function deleteUserOpen(id) {
    console.log(id);
    document.getElementById("mainModal").style.display = "flex";
    setSelectedId(id)
  }

  // deleteUser function
  async function deleteUser() {
    console.log(selectedId);
    var token = localStorage.getItem("loginUser");
    if (!token) {
      alert("Please login first");
      navigate('/')
      return;
    }
    try {
      var deleteParticularuser = await axios.get(`http://localhost:8080/deleteParticularuser/${selectedId}`, {
        headers: {
          Authorization: token
        }
      })
      alert(deleteParticularuser.data.message);
      // call closeModal function
      closeModal()
      // call getAllData function
      getAllData();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Invalid token or token expired");
          logOut()
        }
        else {
          alert("Something went wrong");
        }
      }
      else {
        alert("Server problem")
      }
    }
  }

  // validateFirstName function
  function validateFirstName(value) {

    var allErrors = { ...error }
    var inputValue = value;

    setParticularData({ ...particularData, firstName: inputValue })

    if (!inputValue) {
      allErrors.firstNameError = 'Enter First Name';
    }
    else {
      allErrors.firstNameError = "";
    }
    setError(allErrors)
  }


  // validateLastName function
  function validateLastName(value) {

    var allErrors = { ...error }
    var inputValue = value;

    setParticularData({ ...particularData, lastName: inputValue })

    if (!inputValue) {
      allErrors.lastNameError = 'Enter Last Name';
    }
    else {
      allErrors.lastNameError = "";
    }
    setError(allErrors)
  }


  // validateEmail function
  function validateEmail(value) {
    let allErrors = { ...error };
    let inputValue = value;

    setParticularData({ ...particularData, email: inputValue })

    if (!inputValue) {
      allErrors.emailError = 'Enter Email';
    }
    else if (inputValue && !inputValue.includes('@')) {
      allErrors.emailError = 'Email must contain @';
    }
    else if (inputValue && inputValue.includes(" ")) {
      allErrors.emailError = "Email should not contain space";
    }
    else if (inputValue.indexOf('@') !== inputValue.lastIndexOf('@')) {
      allErrors.emailError = "Email must contain only one '@'";
    }
    else {
      let split_email = inputValue.split("@");

      if (!split_email[0]) {
        allErrors.emailError = "Email should not start with '@'";
      }
      else if (!split_email[1]) {
        allErrors.emailError = "Enter domain name after '@'";
      }
      else if (!split_email[1].includes(".")) {
        allErrors.emailError = "Domain must contain '.'";
      }
      else if (split_email[0].startsWith(".")) {
        allErrors.emailError = "Email should not start with '.'";
      }
      else if (split_email[1].startsWith(".") || split_email[1].endsWith(".")) {
        allErrors.emailError = "Invalid domain format";
      }
      else {
        let domainparts = split_email[1].split(".");
        let extension = domainparts[domainparts.length - 1];

        if (!extension) {
          allErrors.emailError = "Extension cannot be empty";
        }
        else {
          allErrors.emailError = "";
        }
      }
    }

    setError(allErrors);
  }

  // validateMobileNumber function
  function validateMobileNumber(inputvalue, event) {

    let allErrors = { ...error };


    var finalnumber = "";
    var formattednumber = "";

    if (!inputvalue) {
      allErrors.mobileError = "Enter Mobile Number";
      setError(allErrors)
      setParticularData({ ...particularData, mobile: formattednumber })
      return;
    }

    let numbers = inputvalue.split("").filter(item => (item >= '0') && (item <= '9')).join("");

    finalnumber = numbers.slice(0, 10);

    if (finalnumber.length > 6) {
      formattednumber = "(" + finalnumber.slice(0, 3) + ") " + finalnumber.slice(3, 6) + "-" + finalnumber.slice(6);
    }
    else if (finalnumber.length > 3) {
      formattednumber = "(" + finalnumber.slice(0, 3) + ") " + finalnumber.slice(3);
    }
    else {
      formattednumber = finalnumber;
    }

    if (inputvalue && finalnumber.length < 10) {
      allErrors.mobileError = "Mobile Number must be 10 digits";
    } else {
      allErrors.mobileError = "";
    }

    setParticularData({ ...particularData, mobile: formattednumber })

    setError(allErrors)
  }


  // validateShift function
  function validateShift(inputvalue) {
    let allErrors = { ...error };

    if (!inputvalue) {
      allErrors.shiftError = "Select Shift";
    }
    else {
      allErrors.shiftError = "";
    }
    setParticularData({ ...particularData, shift: inputvalue })
    setError(allErrors);
  }


  // validateRole function
  function validateRole(inputvalue) {
    let allErrors = { ...error };

    if (!inputvalue) {
      allErrors.roleError = "Enter Job / Role";
    }
    else {
      allErrors.roleError = "";
    }

    setParticularData({ ...particularData, role: inputvalue })

    setError(allErrors)
  }

  // validateGender function
  function validateGender(inputvalue) {
    let allErrors = { ...error };

    if (!inputvalue) {
      allErrors.genderError = "Select Gender";
    }
    else {
      allErrors.genderError = "";
    }

    setParticularData({ ...particularData, gender: inputvalue })

    setError(allErrors)
  }

  // validateTerms
  function validateTerms(inputvalue) {
    let allErrors = { ...error };

    if (!inputvalue) {
      allErrors.termsError = "Accept terms and condition";
    }
    else {
      allErrors.termsError = "";
    }

    setParticularData({ ...particularData, terms: inputvalue })

    setError(allErrors)
  }

  async function submitForm(event) {
    event.preventDefault();

    let allErrors = { ...error };

    if (!particularData.firstName) {
      allErrors.firstNameError = "Enter First Name";
    }

    if (!particularData.lastName) {
      allErrors.lastNameError = "Enter Last Name";
    }

    const email = particularData.email;

    if (!email) {
      allErrors.emailError = "Enter Email";
    } else if (!email.includes("@")) {
      allErrors.emailError = "Email must contain @";
    } else if (email.includes(" ")) {
      allErrors.emailError = "Email should not contain space";
    } else if (email.indexOf("@") !== email.lastIndexOf("@")) {
      allErrors.emailError = "Only one @ allowed";
    } else {
      const parts = email.split("@");

      if (!parts[0]) {
        allErrors.emailError = "Invalid email format";
      } else if (!parts[1] || !parts[1].includes(".")) {
        allErrors.emailError = "Invalid domain";
      } else {
        allErrors.emailError = "";
      }
    }

    if (!particularData.mobile) {
      allErrors.mobileError = "Enter Mobile Number";
    } else {
      const digits = particularData.mobile.replace(/\D/g, "");
      if (digits.length < 10) {
        allErrors.mobileError = "Mobile must be 10 digits";
      } else {
        allErrors.mobileError = "";
      }
    }

    if (!particularData.shift) {
      allErrors.shiftError = "Select Shift";
    }

    if (!particularData.gender) {
      allErrors.genderError = "Select Gender";
    }

    if (!particularData.role) {
      allErrors.roleError = "Enter Job / Role";
    }

    if (!particularData.terms) {
      allErrors.termsError = "Accept terms and condition";
    }

    setError(allErrors);

    const checking = Object.values(allErrors).some(err => err !== "");


    if (!checking) {
      var token = localStorage.getItem("loginUser");
      if (!token) {
        alert("Please login first");
        navigate('/')
        return;
      }
      try {
        console.log(particularData, "======>");
        const result = await axios.post("http://localhost:8080/updateUser", { data: particularData }, {
          headers: {
            Authorization: token
          }
        });

        alert(result.data.message);

        if (result.data.message === "User Updated Successfully") {
          getAllData();
          closeEditModal();
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            alert("Invalid token or token expired");
            logOut()
          }
          else {
            alert("Something went wrong");
          }
        }
        else {
          alert("Server problem")
        }
      }
    }
  }

  

  useEffect(() => {
    // initial call when page loads
    getAllData();
  }, [])
  return (
    <div>
      <div className="container">
        {/* headerRow */}
        <header className="headerRow">
          <h2 id="welcomeMessage">User Dashboard</h2>

          <button id="logoutButton" onClick={() => {
            logOut();
          }}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </header>

        {/* topBar */}
        <div className="topBar">
          <div className="left">
            <button id="addUserButton" onClick={() => {
              goToAddUserPage()
            }}>
              <i className="fa-solid fa-plus"></i> Add New User
            </button>
          </div>
        </div>

        <h2 style={{ textAlign: "center", color: 'red' }}>{noData}</h2>
        <div id="userList" className="cardContainer">
          {allData.map((data, index) => {
            return (
              <div className="userCard" key={index}>
                <div className="cardHeader">
                  <div className="cardHeaderText">
                    <h3>{data.firstName} {data.lastName}</h3>
                    <hr />
                    <p><span>Role :</span>   <span className='details'> {data.role}</span></p>
                    <hr />
                  </div>
                </div>

                <div className="cardBody">
                  <p><span>Email :</span>   <span className='details'> {data.email}</span></p>
                  <p><span>Phone : </span>   <span className='details'> {data.mobile}</span></p>
                  <p><span>Shift : </span>   <span className='details'> {data.shift}</span></p>
                  <p><span>Gender : </span>  <span className='details'> {data.gender}</span></p>
                  <p><span>Terms : </span>  <span className='details'> {data.terms ? "true" : "false"}</span></p>
                </div>

                <div className="actions">
                  {/* <a className="editButton" href={`/editUser/${data._id}`}>
                    Edit
                  </a> */}
                  <button className="editButton" onClick={() => {
                    openEditModal(data._id)
                  }}>
                    <i className="fa-solid fa-eye"></i> Edit
                  </button>
                  <button className="viewButton" onClick={() => {
                    viewData(data._id)
                  }}>
                    <i className="fa-solid fa-eye"></i> View
                  </button>
                  <button className="deleteButton" onClick={() => {
                    deleteUserOpen(data._id)
                  }}>
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </button>
                </div>
              </div>

            )
          })}
        </div>
      </div>

      {/* delete modal */}
      <div id="mainModal" className="mainModal">
        <div className="modalContent">
          <div className="modalBody">
            <h4>Are You Sure Want to Delete ?</h4>
          </div>

          <div className="modalFooter">
            <button id="okModalButton" onClick={(event) => {
              deleteUser()
            }}>Ok</button>
            <button id="closeModalButton" onClick={() => {
              closeModal()
            }}>Close</button>
          </div>
        </div>
      </div>

      {/* view modal */}
      <div id="userModal" className="userModal">
        <div className="contentModal">
          <div className="headerModal">
            <h2 id='userDetails'>User Details</h2>
            <hr />
          </div>

          <div className="userModalBody" id="userModalBody">

            <div class="userDetail"><span>Name:</span> {particularData.firstName} {particularData.lastName}</div>
            <div class="userDetail"><span>Email:</span> {particularData.email}</div>
            <div class="userDetail"><span>Phone:</span> {particularData.mobile}</div>
            <div class="userDetail"><span>Gender:</span> {particularData.gender}</div>
            <div class="userDetail"><span>Role:</span> {particularData.role}</div>
            <div class="userDetail"><span>Shift:</span> {particularData.shift}</div>
          </div>

          <div className="footerModal">
            <button id="modalClose" onClick={() => {
              modalClose()
            }}>Close</button>
          </div>
        </div>
      </div>

      {/* editModal */}
      <div className="editModal" id='editModal'>
        {/* edit component */}
        <div className="main">

          <h2>Edit User</h2>

          {/* signup form */}
          <form id="editForm" onSubmit={(event) => {
            submitForm(event)
          }}>

            {/* first name */}
            <input type="text" placeholder="First Name" id="firstName" value={particularData.firstName} onInput={(event) => { validateFirstName(event.target.value) }} />
            <p id="firstNameError">{error.firstNameError}</p>

            {/* last name */}

            <input type="text" placeholder="Last Name" id="lastName" value={particularData.lastName} onInput={(event) => { validateLastName(event.target.value) }} />
            <p id="lastNameError">{error.lastNameError}</p>

            {/* email */}

            <input type="email" placeholder="Email" id="email" value={particularData.email} onInput={(event) => { validateEmail(event.target.value) }} />
            <p id="emailError">{error.emailError}</p>

            {/* mobile */}
            <div className="inputGroup">
              <label for="mobile">+1</label>
              <input type="tel" placeholder="Mobile" id="mobile" value={particularData.mobile} onInput={(event) => { validateMobileNumber(event.target.value, event) }} />
            </div>
            <p id="mobileError">{error.mobileError}</p>

            {/* shift */}
            <select id="shift" value={particularData.shift} onInput={(event) => { validateShift(event.target.value) }}>
              <option value="">Select Shift</option>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <p id="shiftError">{error.shiftError}</p>

            {/* gender */}

            <select id="gender" value={particularData.gender} onInput={(event) => { validateGender(event.target.value) }}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <p id="genderError">{error.genderError}</p>

            {/* role */}

            <input type="text" placeholder="Job Title / Role" id="role" value={particularData.role} onInput={(event) => { validateRole(event.target.value) }} />
            <p id="roleError">{error.roleError}</p>

            {/* terms */}
            <div className="termsRow">
              <input type="checkbox" id="terms" checked={particularData.terms} onChange={(event) => { validateTerms(event.target.checked) }} />
              <label for="terms">Terms & Conditions</label>
            </div>
            <p id="termsError">{error.termsError}</p>

            {/* submit button */}
            <button type="submit">
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              Update
            </button>

          </form>

          {/* link */}
          <div className="link">
            <button className='editModalClose' onClick={() => {
              closeEditModal()
            }}>Close</button>
          </div>

        </div>
      </div>
    </div>
  )
}
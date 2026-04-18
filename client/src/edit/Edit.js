import React, { useEffect, useState } from 'react'
import '../edit/Edit.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

export const Edit = ({ id }) => {

    // const { id } = useParams();

    var [particularData, setParticularData] = useState({});

    var [confirmPassword, setConfirmPassword] = useState("");

    var allErrors = {
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        mobileError: "",
        shiftError: "",
        genderError: "",
        roleError: "",
        passwordError: "",
        confirmPasswordError: "",
        termsError: ""
    };

    const navigate = useNavigate();

    var [error, setError] = useState({
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        mobileError: "",
        shiftError: "",
        genderError: "",
        roleError: "",
        passwordError: "",
        confirmPasswordError: "",
        termsError: ""

    });

    // logOut function
    function logOut() {
        localStorage.removeItem('loginUser')
        navigate('/')
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


    // validatePassword function
    function validatePassword(inputvalue) {
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.passwordError = 'Enter Password';
        }
        else if (inputvalue && inputvalue.length < 8) {
            allErrors.passwordError = 'Password must be at least 8 characters';
        }
        else if (!/\d/.test(inputvalue)) {
            allErrors.passwordError = "Password must contain at least one number";
        }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(inputvalue)) {
            allErrors.passwordError = "Password must contain at least one special character";
        }
        else {
            allErrors.passwordError = "";
        }
        setParticularData({ ...particularData, password: inputvalue })

        setError(allErrors)
    }

    // validateConfirmPassword
    function validateConfirmPassword(inputvalue) {
        setConfirmPassword(inputvalue)
        let allErrors = { ...error };

        if (!inputvalue) {
            allErrors.confirmPasswordError = 'Enter Confirm-Password';
        }
        else if (particularData.password !== inputvalue) {
            allErrors.confirmPasswordError = "Passwords do not match";
        }
        else {
            allErrors.confirmPasswordError = "";
        }

        setParticularData({ ...particularData, confirmPassword: inputvalue })

        setError(allErrors)
    }

    async function submitForm(event) {
        let allErrors = { ...error };

        event.preventDefault();
        if (!particularData.firstName) {
            allErrors.firstNameError = "Enter First Name";
        }

        if (!particularData.lastName) {
            allErrors.lastNameError = "Enter Last Name";
        }

        if (!particularData.email) {
            allErrors.emailError = "Enter Email";
        }

        if (!particularData.mobile) {
            allErrors.mobileError = "Enter Mobile Number";
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

        if (!particularData.password) {
            allErrors.passwordError = "Enter Password";
        }

        if (particularData.password !== confirmPassword) {
            allErrors.confirmPasswordError = "Passwords do not match";
        }

        if (!particularData.terms) {
            allErrors.termsError = "Accept terms and condition";
        }


        if (
            particularData.firstName &&
            particularData.lastName &&
            particularData.email &&
            particularData.mobile &&
            particularData.shift &&
            particularData.gender &&
            particularData.role &&
            particularData.terms &&
            particularData.password
        ) {
            if (particularData.password === confirmPassword) {
                console.log(particularData);
                try {
                    var result = await axios.post("http://localhost:8080/updateUser", { data: particularData });
                    console.log(result.data.message);
                    alert(result.data.message);
                    if (result.data.message === "User Updated Successfully") {
                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 1000);
                    }
                } catch (error) {
                    alert(error);
                }
            }

        }

        setError(allErrors);
    }

    async function getUser(id) {
        console.log(id);
        try {
            var token = localStorage.getItem("loginUser");
            var getParticularData = await axios.get(`http://localhost:8080/getParticularuser/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            console.log(getParticularData.data.message);
            setParticularData(getParticularData.data.message)
            setConfirmPassword(getParticularData.data.message.password)
        } catch (error) {
            alert(error)
        }

    }

    useEffect(() => {
        getUser(id)
    }, [])

    return (
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

                {/* password */}

                <input type="password" placeholder="Password" id="password" value={particularData.password} onInput={(event) => { validatePassword(event.target.value) }} />
                <p id="passwordError">{error.passwordError}</p>

                {/* confirm-password */}

                <input type="password" placeholder="Confirm Password" id="confirmPassword" value={particularData.password} onInput={(event) => { validateConfirmPassword(event.target.value) }} />
                <p id="confirmPasswordError">{error.confirmPasswordError}</p>

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
                <Link to='/dashboard'>Go To Dashboard</Link>
            </div>

        </div>
    )
}

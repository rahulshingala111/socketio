import React, { useState } from "react";
import axios from "axios";
import {
  CButton,
  CForm,
  CCol,
  CFormInput,
  CRow,
  CFormLabel,
  CCard,
  CCardBody,
  CContainer,
  CCardHeader,
  CCardTitle,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

function Register() {
  const [firstname, SetFirstName] = useState();
  const [lastname, SetLastName] = useState();
  const [email, Setemail] = useState();
  const [password, SetPassword] = useState();
  const [flag, setFlag] = useState(false);

  const handlefirstname = (e) => {
    e.preventDefault();
    SetFirstName(e.target.value);
    console.log(e.target.value);
  };
  const handlelastname = (e) => {
    e.preventDefault();
    SetLastName(e.target.value);
    console.log(e.target.value);
  };
  const handleemail = (e) => {
    e.preventDefault();
    Setemail(e.target.value);
    console.log(e.target.value);
  };
  const handlepassword = (e) => {
    e.preventDefault();
    SetPassword(e.target.value);
    console.log(e.target.value);
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log("handlesubmit");
    const userdata = {
      firstname,
      lastname,
      email,
      password,
    };
    axios
      .post("http://localhost:5000/register", userdata)
      .then((response) => {
        console.log(response);
        setFlag(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setFlag(true);
        } else if (error.response.status === 200) {
          setFlag(false);
        } else {
          console.log("problem");
        }
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={7}>
            <CCard className="text-center">
              <CCardHeader>
                <CCardTitle>Register</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CForm onSubmit={handlesubmit}>
                  <CRow className="mb-4">
                    <CFormLabel
                      htmlFor="inputEmail3"
                      className="col-sm-2 col-form-label"
                    >
                      First name
                    </CFormLabel>
                    <CCol>
                      <CFormInput
                        type="text"
                        onChange={handlefirstname}
                        required
                      />
                    </CCol>
                    <CFormLabel
                      htmlFor="inputEmail3"
                      className="col-sm-2 col-form-label"
                    >
                      Last Name
                    </CFormLabel>
                    <CCol>
                      <CFormInput type="text" onChange={handlelastname} />
                    </CCol>
                  </CRow>

                  <CRow className="mb-4">
                    <CFormLabel
                      htmlFor="inputEmail3"
                      className="col-sm-2 col-form-label"
                    >
                      Email
                    </CFormLabel>
                    <CCol>
                      <CFormInput
                        type="email"
                        onChange={handleemail}
                        required
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-4">
                    <CFormLabel
                      htmlFor="inputPassword3"
                      className="col-sm-2 col-form-label"
                    >
                      Password
                    </CFormLabel>
                    <CCol>
                      <CFormInput
                        type="password"
                        onChange={handlepassword}
                        required
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-4">
                    <CCol>
                      {flag ? (
                        <label color="red">User already exist</label>
                      ) : null}
                    </CCol>
                  </CRow>
                  <CRow className="mb-4">
                    <CCol>
                      <CButton type="submit">Sign in</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}
export default Register;

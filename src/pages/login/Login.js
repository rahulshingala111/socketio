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
import * as jose from "jose";
import { useCookies } from "react-cookie";

function Login() {
  const [email, SetEmail] = useState();
  const [password, SetPassword] = useState();
  const [flag, setFlag] = useState(false);
  const [cookies, setCookie] = useCookies(["user"]);

  const handleemail = (e) => {
    e.preventDefault();
    SetEmail(e.target.value);
  };
  const handlepassword = (e) => {
    e.preventDefault();
    SetPassword(e.target.value);
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log(" submited ");
    const secret = new TextEncoder().encode("rahulSecret");
    const jwt = await new jose.SignJWT({ email, password })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret)
      .then((result) => {
        setCookie("token", result, { path: "/" });
      })
      .catch((error) => {
        console.log(error);
      });
    const data = {
      email,
      password,
    };
    axios
      .post("http://localhost:5000/login", data)
      .then((response) => {
        console.log(response);
        window.location = "/chat";
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
          <CCol md={6}>
            <CCard className="text-center">
              <CCardHeader>
                <CCardTitle>Login</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CForm onSubmit={handlesubmit}>
                  <CRow className="mb-4">
                    <CFormLabel
                      htmlFor="inputEmail3"
                      className="col-sm-2 col-form-label"
                    >
                      Email
                    </CFormLabel>
                    <CCol>
                      <CFormInput type="email" onChange={handleemail} />
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
                      <CFormInput type="password" onChange={handlepassword} />
                    </CCol>
                  </CRow>
                  <CRow className="mb-4">
                    <CCol>
                      {flag ? (
                        <label color="red">User or Password WRONG!!!</label>
                      ) : null}
                    </CCol>
                  </CRow>
                  <CButton type="submit">Sign in</CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}
export default Login;

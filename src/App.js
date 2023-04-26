/* eslint-disable*/
import React, { Component, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const Home = React.lazy(() => import('./pages/home/Home'))
const Login = React.lazy(() => import('./pages/login/Login'))
const Register = React.lazy(() => import('./pages/register/Register'))
const Page404 = React.lazy(() => import('./pages/error_page/Page404'))
const Page500 = React.lazy(() => import('./pages/error_page/Page500'))

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={loading}>
      <Routes>
        <Route path="/" name="Home" element={<Home />} />

        <Route exact path="/login" name="Login Page" element={<Login />} />
        <Route exact path="/register" name="Register Page" element={<Register />} />

        <Route path="/*" name="Page 404" element={<Page404 />} />
        <Route path="/500" name="Page 500" element={<Page500 />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
  );
}

export default App;

"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../../../utils/axios";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  const enableTooltip = () => {
    // const tooltipTriggerList = [].slice.call(
    //   document.querySelectorAll('[data-bs-toggle="tooltip"]')
    // );
    // const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl);
    // });
  };

  const getCode = async () => {
    let response = await axios.post("/otps/registration", {
      email: "congchinh2903@gmail.com",
    });

    console.log(response.data);
  };

  const fetchProvinces = async () => {
    const response = await fetch(
      "https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100"
    );
    const listCity = await response.json();
    setCities(listCity.results);
  };

  useEffect(() => {
    enableTooltip();
    fetchProvinces();
  }, []);

  const fetchProvince = async () => {
    const response = await fetch(
      `https://vnprovinces.pythonanywhere.com//api/provinces/${selectedCity}`
    );
    const listCity = await response.json();
    setProvinces(listCity.districts);
  };

  useEffect(() => {
    if (selectedCity === "") return;
    else {
      fetchProvince();
    }
  }, [selectedCity]);

  const SignIn = () => {
    toast(`${email} ${password}`);
  };
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="content-wrapper">
          <div className="content-full">
            <div className="logo-wrapper">
              <img src="/logo.png" alt="logo" />
            </div>
            <div className="form-wrapper f-form">
              <h2>Welcome to Proximity Service</h2>
              <div>Please Enter Information To Join With Us</div>
              <div className="container">
                <div className="row">
                  <div className="col-6">
                    <div className="form">
                      <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="form-control"
                          placeholder="name@example.com"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">OTP</label>

                        <div className="form-control">
                          <input placeholder="Input OTP code with 6 digits"></input>
                          <button>
                            <div onClick={() => getCode()}>Get Code</div>
                          </button>
                        </div>
                        {/* <button
                          onClick={() => alert("get code")}
                          className="otp-btn"
                        >
                          Get code
                        </button> */}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          className="form-control"
                          placeholder="********"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Re-Password</label>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          className="form-control"
                          placeholder="********"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form">
                      <div className="mb-3">
                        <label className="form-label">First name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Chinh"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Last name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Truong Nguyen Cong"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="0123456789"
                        />
                      </div>
                      <div className="mb-3 container">
                        <div className="row">
                          <div className="col-sm-12 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Province</label>
                              <select
                                value={selectedCity}
                                onChange={(e) =>
                                  setSelectedCity(e.target.value)
                                }
                                className="form-control"
                              >
                                <option value={""}>----</option>
                                {cities && cities.length > 0
                                  ? cities.map((city: any) => (
                                      <option key={city.id} value={city.id}>
                                        {city.name}
                                      </option>
                                    ))
                                  : ""}
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">District</label>
                              <select
                                value={selectedProvince}
                                onChange={(e) =>
                                  setSelectedProvince(e.target.value)
                                }
                                className="form-control"
                              >
                                <option value={""}>----</option>
                                {provinces && provinces.length > 0
                                  ? provinces.map((province: any) => (
                                      <option
                                        key={province.id}
                                        value={province.id}
                                      >
                                        {province.name}
                                      </option>
                                    ))
                                  : ""}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="d-flex  align-items-center justify-content-center"
              style={{ padding: "0 72x", flexDirection: "column" }}
            >
              <button
                style={{ width: "200px" }}
                onClick={SignIn}
                className="form-btn"
              >
                Sign Up
              </button>
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                {" "}
                Already have an account?{" "}
                <strong style={{ cursor: "pointer" }}>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "#ed1651",
                      fontWeight: "300",
                    }}
                    href="/signin"
                  >
                    Login here
                  </Link>
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

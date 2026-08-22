import { useEffect, useState } from "react";
import "./App.css";
import dayflowLogo from "./assets/dayflow-logo.png";

import EmployeeDashboard from "./EmployeeDashboard";
import { testBackend } from "./api";


const departments = [
  "Human Resources",
  "Finance",
  "Information Technology",
  "Sales & Marketing",
  "Operations",
];

function generateSerialNumber() {
  const randomNumber = Math.floor(
    10000000 + Math.random() * 90000000
  );

  return `EMP${randomNumber}`;
}

function generateLoginId(
  firstName,
  lastName,
  year,
  serialNumber
) {
  if (!firstName || !lastName || !year || !serialNumber) {
    return "";
  }

  const first = firstName
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();

  const last = lastName
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();

  return `${first}${last}${year}${serialNumber.slice(-4)}`;
}

function generateTemporaryPassword() {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";

  let password = "";

  for (let i = 0; i < 10; i++) {
    password +=
      characters[
        Math.floor(Math.random() * characters.length)
      ];
  }

  return password;
}

function App() {
  const [screen, setScreen] = useState("role");

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });

  const [sparkles, setSparkles] = useState([]);

  // Employee data
  const [employees, setEmployees] = useState([]);

  // HR data
  const [hrUsers, setHrUsers] = useState([]);

  const [createdEmployee, setCreatedEmployee] =
    useState(null);

  // Employee creation form
  const [employeeForm, setEmployeeForm] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    dob: "",
    yearOfJoining: "",
    serialNumber: generateSerialNumber(),
    department: "",
  });

  // Employee login
  const [employeeLogin, setEmployeeLogin] = useState({
    loginId: "",
    password: "",
  });

  // HR mode
  const [hrMode, setHrMode] = useState("signin");

  // HR login
  const [hrLogin, setHrLogin] = useState({
    loginId: "",
    password: "",
  });

  // HR signup
  const [hrSignup, setHrSignup] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    companyName: "",
    hrId: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================
  // BACKEND CONNECTION TEST
  // =====================================

  const handleBackendTest = async () => {
    try {
      const data = await testBackend();

      console.log("Backend response:", data);

      alert(data.message);
    } catch (error) {
      console.error(
        "Backend connection error:",
        error
      );

      alert("Backend connection failed!");
    }
  };

  // =====================================
  // CUSTOM MOUSE
  // =====================================

  useEffect(() => {
    const moveMouse = (event) => {
      setCursor({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener(
      "mousemove",
      moveMouse
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        moveMouse
      );
  }, []);

  // =====================================
  // CLICK SPARKLES
  // =====================================

  useEffect(() => {
    const createSparkles = (event) => {
      const newSparkles = Array.from(
        { length: 8 },
        (_, index) => ({
          id: `${Date.now()}-${index}`,
          x: event.clientX,
          y: event.clientY,
          angle:
            (Math.PI * 2 * index) / 8,
        })
      );

      setSparkles((old) => [
        ...old,
        ...newSparkles,
      ]);

      setTimeout(() => {
        setSparkles((old) =>
          old.filter(
            (sparkle) =>
              !newSparkles.some(
                (item) =>
                  item.id === sparkle.id
              )
          )
        );
      }, 700);
    };

    window.addEventListener(
      "click",
      createSparkles
    );

    return () =>
      window.removeEventListener(
        "click",
        createSparkles
      );
  }, []);

  // =====================================
  // EMPLOYEE FORM
  // =====================================

  const handleEmployeeChange = (event) => {
    const { name, value } = event.target;

    setEmployeeForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const loginId = generateLoginId(
    employeeForm.firstName,
    employeeForm.lastName,
    employeeForm.yearOfJoining,
    employeeForm.serialNumber
  );

  // =====================================
  // YOUR EXISTING CODE CONTINUES HERE
  // =====================================

  const handleCreateEmployee = async (event) => {
  event.preventDefault();

  if (
    !employeeForm.companyName ||
    !employeeForm.firstName ||
    !employeeForm.lastName ||
    !employeeForm.dob ||
    !employeeForm.yearOfJoining ||
    !employeeForm.department
  ) {
    alert("Please complete all employee details.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/employees",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: employeeForm.companyName,
          firstName: employeeForm.firstName,
          lastName: employeeForm.lastName,
          dob: employeeForm.dob,
          yearOfJoining: employeeForm.yearOfJoining,
          department: employeeForm.department,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.message ||
          "Failed to create employee."
      );
      return;
    }

    const employee = data.employee;

    setCreatedEmployee({
      ...employee,
      mustChangePassword: true,
    });

    setScreen("employee-created");

  } catch (error) {
    console.error(
      "Create employee error:",
      error
    );

    alert(
      "Could not connect to the Dayflow backend."
    );
  }
};

  // -----------------------------
  // EMPLOYEE SIGN IN
  // -----------------------------

  const handleEmployeeLogin = async (event) => {
  event.preventDefault();

  if (
    !employeeLogin.loginId ||
    !employeeLogin.password
  ) {
    alert("Please enter your Login ID and Password.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/employee-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: employeeLogin.loginId.trim(),
          password: employeeLogin.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.message ||
          "Invalid Login ID or Password."
      );
      return;
    }

    console.log("Employee login:", data);

    alert(
      `Welcome ${data.user.firstName}!`
    );

    setScreen("employee-dashboard");

  } catch (error) {
    console.error(
      "Employee login error:",
      error
    );

    alert("Unable to connect to Dayflow backend.");
  }
};

  // -----------------------------
  // HR SIGN IN
  // -----------------------------

  const handleHrLogin = (event) => {
    event.preventDefault();

    const hr = hrUsers.find(
      (item) =>
        item.hrId.toLowerCase() ===
          hrLogin.loginId
            .trim()
            .toLowerCase() &&
        item.password === hrLogin.password
    );

    if (!hr) {
      alert(
        "Invalid HR Login ID or Password."
      );

      return;
    }

    alert(
      `Welcome ${hr.firstName}!`
    );

    setScreen("add-employee");
  };

  // -----------------------------
  // HR SIGN UP
  // -----------------------------

  const handleHrSignupChange = (event) => {
    const { name, value } = event.target;

    setHrSignup((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleHrSignup = (event) => {
    event.preventDefault();

    if (
      !hrSignup.firstName ||
      !hrSignup.lastName ||
      !hrSignup.email ||
      !hrSignup.phone ||
      !hrSignup.dob ||
      !hrSignup.companyName ||
      !hrSignup.hrId ||
      !hrSignup.password ||
      !hrSignup.confirmPassword
    ) {
      alert(
        "Please complete all HR details."
      );

      return;
    }

    if (
      hrSignup.password !==
      hrSignup.confirmPassword
    ) {
      alert(
        "Passwords do not match."
      );

      return;
    }

    const alreadyExists = hrUsers.some(
      (item) =>
        item.hrId.toLowerCase() ===
        hrSignup.hrId.toLowerCase()
    );

    if (alreadyExists) {
      alert(
        "This HR Login ID already exists."
      );

      return;
    }

    const newHr = {
      ...hrSignup,
    };

    setHrUsers((previous) => [
      ...previous,
      newHr,
    ]);

    alert(
      "HR account created successfully!"
    );

    setHrMode("signin");

    setHrLogin({
      loginId: hrSignup.hrId,
      password: "",
    });

    setHrSignup({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      companyName: "",
      hrId: "",
      password: "",
      confirmPassword: "",
    });
  };

  // -----------------------------
  // RESET EMPLOYEE FORM
  // -----------------------------

  const resetEmployeeForm = () => {
    setEmployeeForm({
      companyName: "",
      firstName: "",
      lastName: "",
      dob: "",
      yearOfJoining: "",
      serialNumber: generateSerialNumber(),
      department: "",
    });

    setCreatedEmployee(null);
  };

  return (
    <div className="dayflow-app">

      {/* BACKGROUND */}
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>
      <div className="ambient ambient-three"></div>

      {/* CUSTOM CURSOR */}
      <div
        className="custom-cursor"
        style={{
          left: `${cursor.x}px`,
          top: `${cursor.y}px`,
        }}
      >
        <div className="cursor-dot"></div>
      </div>

      {/* SPARKLES */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            "--angle": sparkle.angle,
          }}
        >
          ✦
        </span>
      ))}

      <main className="landing-page">

        {/* LOGO */}
        <header className="brand">
          <div className="logo-container">
            <img
              src={dayflowLogo}
              alt="Dayflow"
              className="dayflow-logo"
            />
          </div>

          <p className="brand-caption">
            Human Resource Management System
          </p>

          <div className="brand-divider"></div>
        </header>

        {/* ======================================
            MAIN ROLE SCREEN
        ====================================== */}

        {screen === "role" && (
  <section className="page-content">

    <div className="intro">

      <span className="eyebrow">
        WELCOME TO DAYFLOW
      </span>

      <h1>
        Your workday,
        <br />
        <span>in flow.</span>
      </h1>

      <p>
        Choose how you would like to
        enter your Dayflow workspace.
      </p>

    </div>

            <div className="role-grid">

              {/* EMPLOYEE */}

              <button
                className="role-card"
                onClick={() =>
                  setScreen("employee-signin")
                }
              >
                <span className="card-number">
                  01
                </span>

                <div className="role-icon">
                  ✦
                </div>

                <div className="role-content">
                  <h2>
                    Employee
                  </h2>

                  <p>
                    Access your profile,
                    attendance, time off and
                    personal workspace.
                  </p>
                </div>

                <span className="card-arrow">
                  ↗
                </span>

                <div className="card-glow"></div>
              </button>

              {/* HR / ADMIN */}

              <button
                className="role-card"
                onClick={() =>
                  setScreen("admin")
                }
              >
                <span className="card-number">
                  02
                </span>

                <div className="role-icon">
                  ◆
                </div>

                <div className="role-content">
                  <h2>
                    HR / Admin
                  </h2>

                  <p>
                    Review employees, manage
                    people and administer the
                    organization.
                  </p>
                </div>

                <span className="card-arrow">
                  ↗
                </span>

                <div className="card-glow"></div>
              </button>

            </div>
          </section>
        )}

        {/* ======================================
            EMPLOYEE SIGN IN
        ====================================== */}

        {screen === "employee-signin" && (
          <section className="page-content auth-page">

            <button
              className="back-button"
              onClick={() =>
                setScreen("role")
              }
            >
              ← Back
            </button>

            <div className="auth-container">

              <span className="eyebrow">
                EMPLOYEE ACCESS
              </span>

              <h1>
                Welcome
                <br />
                <span>back.</span>
              </h1>

              <p className="auth-description">
                Sign in using the credentials
                provided by your HR or Admin.
              </p>

              <form
                className="auth-card"
                onSubmit={
                  handleEmployeeLogin
                }
              >

                <div className="form-group">
                  <label>
                    Login ID
                  </label>

                  <input
                    type="text"
                    value={
                      employeeLogin.loginId
                    }
                    onChange={(event) =>
                      setEmployeeLogin({
                        ...employeeLogin,
                        loginId:
                          event.target.value,
                      })
                    }
                    placeholder="Enter your Login ID"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Password
                  </label>

                  <input
                    type="password"
                    value={
                      employeeLogin.password
                    }
                    onChange={(event) =>
                      setEmployeeLogin({
                        ...employeeLogin,
                        password:
                          event.target.value,
                      })
                    }
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  className="create-button"
                >
                  Sign In
                  <span>→</span>
                </button>

              </form>

              <p className="auth-note">
                Don't have credentials?
                Please contact your HR or
                Admin.
              </p>

            </div>

          </section>
        )}

        {/* ======================================
            HR / ADMIN CHOICE
        ====================================== */}

        {screen === "admin" && (
          <section className="page-content">

            <button
              className="back-button"
              onClick={() =>
                setScreen("role")
              }
            >
              ← Back
            </button>

            <div className="intro">

              <span className="eyebrow">
                HR / ADMIN ACCESS
              </span>

              <h1>
                Choose your
                <br />
                <span>workspace.</span>
              </h1>

              <p>
                Select the type of access
                you need to continue.
              </p>

            </div>

            <div className="role-grid">

              {/* HR */}

              <button
                className="role-card"
                onClick={() =>
                  setScreen("hr-signin")
                }
              >

                <span className="card-number">
                  01
                </span>

                <div className="role-icon">
                  ⌁
                </div>

                <div className="role-content">

                  <span className="role-label">
                    REVIEWING AN EMPLOYEE
                  </span>

                  <h2>
                    HR
                  </h2>

                  <p>
                    Review employee
                    information, attendance
                    and HR records.
                  </p>

                </div>

                <span className="card-arrow">
                  ↗
                </span>

                <div className="card-glow"></div>

              </button>

              {/* ADMIN */}

              <button
                className="role-card"
                onClick={() =>
                  setScreen("hr-signin")
                }
              >

                <span className="card-number">
                  02
                </span>

                <div className="role-icon">
                  ＋
                </div>

                <div className="role-content">

                  <span className="role-label">
                    ADDING AN EMPLOYEE
                  </span>

                  <h2>
                    Admin
                  </h2>

                  <p>
                    Add employees and create
                    their system credentials.
                  </p>

                </div>

                <span className="card-arrow">
                  ↗
                </span>

                <div className="card-glow"></div>

              </button>

            </div>
          </section>
        )}

        {/* ======================================
            HR SIGN IN
        ====================================== */}

        {screen === "hr-signin" && (
          <section className="page-content auth-page">

            <button
              className="back-button"
              onClick={() =>
                setScreen("admin")
              }
            >
              ← Back
            </button>

            <div className="auth-container">

              <span className="eyebrow">
                HR PORTAL
              </span>

              <h1>
                HR
                <br />
                <span>Sign In.</span>
              </h1>

              <p className="auth-description">
                Access employee records,
                attendance and HR management.
              </p>

              {/* TABS */}

              <div className="auth-tabs">

                <button
                  className={
                    hrMode === "signin"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setHrMode("signin")
                  }
                >
                  Sign In
                </button>

                <button
                  className={
                    hrMode === "signup"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setHrMode("signup")
                  }
                >
                  Sign Up
                </button>

              </div>

              {/* HR SIGN IN FORM */}

              {hrMode === "signin" && (
                <form
                  className="auth-card"
                  onSubmit={handleHrLogin}
                >

                  <div className="form-group">
                    <label>
                      HR Login ID
                    </label>

                    <input
                      type="text"
                      value={
                        hrLogin.loginId
                      }
                      onChange={(event) =>
                        setHrLogin({
                          ...hrLogin,
                          loginId:
                            event.target.value,
                        })
                      }
                      placeholder="Enter HR Login ID"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      value={
                        hrLogin.password
                      }
                      onChange={(event) =>
                        setHrLogin({
                          ...hrLogin,
                          password:
                            event.target.value,
                        })
                      }
                      placeholder="Enter password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="create-button"
                  >
                    HR Sign In
                    <span>→</span>
                  </button>

                </form>
              )}

              {/* HR SIGN UP FORM */}

              {hrMode === "signup" && (
                <form
                  className="auth-card signup-card"
                  onSubmit={
                    handleHrSignup
                  }
                >

                  <div className="form-section">

                    <div className="section-title">
                      Personal Information
                    </div>

                    <div className="form-row">

                      <div className="form-group">
                        <label>
                          First Name
                        </label>

                        <input
                          type="text"
                          name="firstName"
                          value={
                            hrSignup.firstName
                          }
                          onChange={
                            handleHrSignupChange
                          }
                          placeholder="First name"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Last Name
                        </label>

                        <input
                          type="text"
                          name="lastName"
                          value={
                            hrSignup.lastName
                          }
                          onChange={
                            handleHrSignupChange
                          }
                          placeholder="Last name"
                        />
                      </div>

                    </div>

                    <div className="form-row">

                      <div className="form-group">
                        <label>
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={
                            hrSignup.email
                          }
                          onChange={
                            handleHrSignupChange
                          }
                          placeholder="name@company.com"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          value={
                            hrSignup.phone
                          }
                          onChange={
                            handleHrSignupChange
                          }
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>

                    </div>

                    <div className="form-group">
                      <label>
                        Date of Birth
                      </label>

                      <input
                        type="date"
                        name="dob"
                        value={
                          hrSignup.dob
                        }
                        onChange={
                          handleHrSignupChange
                        }
                      />
                    </div>

                  </div>

                  <div className="form-section">

                    <div className="section-title">
                      Organization
                    </div>

                    <div className="form-group">
                      <label>
                        Company Name
                      </label>

                      <input
                        type="text"
                        name="companyName"
                        value={
                          hrSignup.companyName
                        }
                        onChange={
                          handleHrSignupChange
                        }
                        placeholder="Company name"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        HR Login ID
                      </label>

                      <input
                        type="text"
                        name="hrId"
                        value={
                          hrSignup.hrId
                        }
                        onChange={
                          handleHrSignupChange
                        }
                        placeholder="Create your HR Login ID"
                      />
                    </div>

                  </div>

                  <div className="form-section">

                    <div className="section-title">
                      Security
                    </div>

                    <div className="form-group">
                      <label>
                        Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        value={
                          hrSignup.password
                        }
                        onChange={
                          handleHrSignupChange
                        }
                        placeholder="Create password"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        value={
                          hrSignup.confirmPassword
                        }
                        onChange={
                          handleHrSignupChange
                        }
                        placeholder="Confirm password"
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="create-button"
                  >
                    Create HR Account
                    <span>→</span>
                  </button>

                </form>
              )}

            </div>

          </section>
        )}

        {/* ======================================
            ADD EMPLOYEE
        ====================================== */}

        {screen === "add-employee" && (
          <section className="page-content">

            <button
              className="back-button"
              onClick={() =>
                setScreen("admin")
              }
            >
              ← Back
            </button>

            <div className="form-heading">

              <span className="eyebrow">
                ADMIN • EMPLOYEE MANAGEMENT
              </span>

              <h1>
                Add a new
                <br />
                <span>employee.</span>
              </h1>

              <p>
                Enter employee details below.
                Dayflow will automatically generate
                the serial number and Login ID.
              </p>

            </div>

            <form
              className="employee-form"
              onSubmit={
                handleCreateEmployee
              }
            >

              <div className="form-section">

                <div className="section-title">
                  Organization
                </div>

                <div className="form-group">
                  <label>
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    value={
                      employeeForm.companyName
                    }
                    onChange={
                      handleEmployeeChange
                    }
                    placeholder="Enter company name"
                  />
                </div>

              </div>

              <div className="form-section">

                <div className="section-title">
                  Personal Information
                </div>

                <div className="form-row">

                  <div className="form-group">
                    <label>
                      First Name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={
                        employeeForm.firstName
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="First name"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={
                        employeeForm.lastName
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="Last name"
                    />
                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group">
                    <label>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dob"
                      value={
                        employeeForm.dob
                      }
                      onChange={
                        handleEmployeeChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Year of Joining
                    </label>

                    <input
                      type="number"
                      name="yearOfJoining"
                      value={
                        employeeForm.yearOfJoining
                      }
                      onChange={
                        handleEmployeeChange
                      }
                      placeholder="2026"
                    />
                  </div>

                </div>

              </div>

              <div className="form-section">

                <div className="section-title">
                  Job Information
                </div>

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Serial Number
                    </label>

                    <div className="generated-field">
                      {
                        employeeForm.serialNumber
                      }

                      <span>
                        AUTO
                      </span>
                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Department
                    </label>

                    <select
                      name="department"
                      value={
                        employeeForm.department
                      }
                      onChange={
                        handleEmployeeChange
                      }
                    >
                      <option value="">
                        Select department
                      </option>

                      {departments.map(
                        (department) => (
                          <option
                            key={department}
                            value={department}
                          >
                            {department}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                </div>

              </div>

              <div className="credential-preview">

                <div>
                  <span>
                    GENERATED LOGIN ID
                  </span>

                  <strong>
                    {loginId ||
                      "Complete details above"}
                  </strong>
                </div>

                <div className="preview-icon">
                  ✦
                </div>

              </div>

              <button
                type="submit"
                className="create-button"
              >
                Create Employee
                <span>→</span>
              </button>

            </form>

          </section>
        )}

        {/* ======================================
            EMPLOYEE CREATED
        ====================================== */}

        {screen === "employee-created" &&
          createdEmployee && (
            <section className="page-content">

              <div className="success-container">

                <div className="success-icon">
                  ✓
                </div>

                <span className="eyebrow">
                  EMPLOYEE CREATED
                </span>

                <h1>
                  Employee
                  <br />
                  <span>created.</span>
                </h1>

                <p>
                  Give these credentials to
                  the employee.
                </p>

                <div className="credential-card">

                  <div className="credential-row">
                    <span>
                      Employee
                    </span>

                    <strong>
                      {
                        createdEmployee.firstName
                      }{" "}
                      {
                        createdEmployee.lastName
                      }
                    </strong>
                  </div>

                  <div className="credential-row">
                    <span>
                      Serial Number
                    </span>

                    <strong>
                      {
                        createdEmployee.serialNumber
                      }
                    </strong>
                  </div>

                  <div className="credential-row">
                    <span>
                      Department
                    </span>

                    <strong>
                      {
                        createdEmployee.department
                      }
                    </strong>
                  </div>

                  <div className="credential-row highlight">
                    <span>
                      Login ID
                    </span>

                    <strong>
                      {
                        createdEmployee.loginId
                      }
                    </strong>
                  </div>

                  <div className="credential-row highlight">
                    <span>
                      Temporary Password
                    </span>

                    <strong>
                      {
                        createdEmployee.temporaryPassword
                      }
                    </strong>
                  </div>

                </div>

                <p className="security-note">
                  The employee must change the
                  temporary password after their
                  first login.
                </p>

                <button
                  className="create-button"
                  onClick={() => {
                    resetEmployeeForm();
                    setScreen(
                      "add-employee"
                    );
                  }}
                >
                  Add Another Employee
                  <span>＋</span>
                </button>

                <button
                  className="back-button center-button"
                  onClick={() =>
                    setScreen("admin")
                  }
                >
                  ← Back to Admin
                </button>

              </div>

            </section>
          )}

        {/* ======================================
            EMPLOYEE DASHBOARD PLACEHOLDER
        ====================================== */}

        {screen === "employee-dashboard" && (
          <EmployeeDashboard onLogout={() => setScreen("role")} />
        )}

        {/* ======================================
            HR DASHBOARD PLACEHOLDER
        ====================================== */}

        {screen === "hr-dashboard" && (
          <section className="page-content">

            <div className="success-container">

              <div className="success-icon">
                ✓
              </div>

              <span className="eyebrow">
                HR DASHBOARD
              </span>

              <h1>
                HR
                <br />
                <span>Workspace.</span>
              </h1>

              <p>
                Employee review and HR
                management dashboard will
                be built next.
              </p>

              <button
                className="create-button"
                onClick={() =>
                  setScreen("role")
                }
              >
                Sign Out
                <span>→</span>
              </button>

            </div>

          </section>
        )}

        <footer>
          <span>
            DAYFLOW
          </span>

          <span>
            PEOPLE • ATTENDANCE • PAYROLL
          </span>
        </footer>

      </main>
    </div>
  );
}

export default App;
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});

// ============================================
// BASIC TEST
// ============================================

app.get("/", (req, res) => {
  res.json({
    message: "Dayflow Backend is running!",
  });
});

// ============================================
// DATABASE TEST
// ============================================

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT 1 AS connected"
    );

    res.json({
      message: "MySQL connected successfully!",
      database: process.env.DB_NAME,
      result: rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ============================================
// GET DEPARTMENTS
// ============================================

app.get("/api/departments", async (req, res) => {
  try {
    const [departments] = await db.query(`
      SELECT
        id,
        department_name
      FROM departments
      WHERE is_active = 1
      ORDER BY department_name
    `);

    res.json(departments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
});

// ============================================
// CREATE EMPLOYEE
// ============================================

app.post("/api/employees", async (req, res) => {
  const connection = await db.getConnection();
  console.log("CREATE EMPLOYEE ROUTE HIT");

  try {
    const {
      companyName,
      firstName,
      lastName,
      dob,
      yearOfJoining,
      department,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (
      !companyName ||
      !firstName ||
      !lastName ||
      !dob ||
      !yearOfJoining ||
      !department
    ) {
      return res.status(400).json({
        message:
          "All employee details are required.",
      });
    }

    await connection.beginTransaction();

    // -----------------------------
    // COMPANY
    // -----------------------------

    let [companies] = await connection.query(
      `
      SELECT id
      FROM companies
      WHERE company_name = ?
      LIMIT 1
      `,
      [companyName]
    );

    let companyId;

    if (companies.length > 0) {
      companyId = companies[0].id;
    } else {
      const [companyResult] =
        await connection.query(
          `
          INSERT INTO companies
          (company_name)
          VALUES (?)
          `,
          [companyName]
        );

      companyId = companyResult.insertId;
    }

    // -----------------------------
    // DEPARTMENT
    // -----------------------------

    const [departments] =
      await connection.query(
        `
        SELECT id
        FROM departments
        WHERE department_name = ?
        AND is_active = 1
        LIMIT 1
        `,
        [department]
      );

    if (departments.length === 0) {
      throw new Error(
        "Selected department does not exist."
      );
    }

    const departmentId =
      departments[0].id;

    // -----------------------------
    // SERIAL NUMBER
    // -----------------------------

    let serialNumber;

    let serialExists = true;

    while (serialExists) {
      const randomNumber =
        Math.floor(
          10000000 +
            Math.random() * 90000000
        );

      serialNumber = `EMP${randomNumber}`;

      const [existing] =
        await connection.query(
          `
          SELECT id
          FROM employees
          WHERE serial_number = ?
          `,
          [serialNumber]
        );

      serialExists =
        existing.length > 0;
    }

    // -----------------------------
    // LOGIN ID
    // -----------------------------

    const first =
      firstName
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();

    const last =
      lastName
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();

    const loginId =
      `${first}${last}${yearOfJoining}${serialNumber.slice(-4)}`;

    // -----------------------------
    // TEMPORARY PASSWORD
    // -----------------------------

    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";

    let temporaryPassword = "";

    for (let i = 0; i < 10; i++) {
      temporaryPassword +=
        characters[
          Math.floor(
            Math.random() *
              characters.length
          )
        ];
    }

    // -----------------------------
    // HASH PASSWORD
    // -----------------------------

    const passwordHash =
      await bcrypt.hash(
        temporaryPassword,
        10
      );

    // -----------------------------
    // CREATE USER
    // -----------------------------

    const [userResult] =
      await connection.query(
        `
        INSERT INTO users
        (
          login_id,
          password_hash,
          role,
          must_change_password
        )
        VALUES (?, ?, 'EMPLOYEE', 1)
        `,
        [
          loginId,
          passwordHash,
        ]
      );

    const userId =
      userResult.insertId;

    // -----------------------------
    // CREATE EMPLOYEE
    // -----------------------------

    await connection.query(
      `
      INSERT INTO employees
      (
        user_id,
        company_id,
        department_id,
        first_name,
        last_name,
        date_of_birth,
        year_of_joining,
        serial_number
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        companyId,
        departmentId,
        firstName,
        lastName,
        dob,
        yearOfJoining,
        serialNumber,
      ]
    );

    await connection.commit();

    // -----------------------------
    // RESPONSE
    // -----------------------------

    res.status(201).json({
      message:
        "Employee created successfully.",

      employee: {
        firstName,
        lastName,
        companyName,
        department,
        serialNumber,
        loginId,
        temporaryPassword,
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error(
      "Create employee error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create employee.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// ============================================
// EMPLOYEE LOGIN
// ============================================

app.post("/api/auth/employee-login", async (req, res) => {
  try {
    const {
      loginId,
      password,
    } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        message:
          "Login ID and password are required.",
      });
    }

    const [users] =
      await db.query(
        `
        SELECT
          u.id,
          u.login_id,
          u.password_hash,
          u.role,
          u.is_active,
          u.must_change_password,
          e.first_name,
          e.last_name
        FROM users u
        JOIN employees e
          ON e.user_id = u.id
        WHERE u.login_id = ?
        AND u.role = 'EMPLOYEE'
        LIMIT 1
        `,
        [loginId]
      );

    if (users.length === 0) {
      return res.status(401).json({
        message:
          "Invalid Login ID or Password.",
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        message:
          "This account is inactive.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid Login ID or Password.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET last_login = NOW()
      WHERE id = ?
      `,
      [user.id]
    );

    res.json({
      message: "Login successful.",

      user: {
        id: user.id,
        loginId: user.login_id,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        mustChangePassword:
          Boolean(
            user.must_change_password
          ),
      },
    });
  } catch (error) {
    console.error(
      "Employee login error:",
      error
    );

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});

// ============================================
// START SERVER
// ============================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Dayflow backend running on http://localhost:${PORT}`
  );
});
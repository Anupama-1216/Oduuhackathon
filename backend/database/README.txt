# Database Setup – Dayflow

This folder contains the MySQL database backup required to run the Dayflow application locally.

## 1. Requirements

Before starting, make sure you have:

* MySQL Server installed
* MySQL username and password
* MySQL command-line tools (`mysql` and `mysqldump`)
* Node.js installed for the backend

## 2. Database Backup

The database backup is:

```text
ODOO_NMIT_VIRTUAL_backup.sql
```

This SQL file contains the database structure and data required by the application.

## 3. Create the Database

Open **Command Prompt** or a terminal and log in to MySQL:

```bash
mysql -u root -p
```

Enter your MySQL password when prompted.

Then create the database:

```sql
CREATE DATABASE ODOO_NMIT_VIRTUAL;
```

Exit MySQL:

```sql
exit;
```

## 4. Import the Database

Open Command Prompt in the `database` folder.

For example:

```bash
cd path\to\your-project\database
```

Then run:

```bash
mysql -u root -p ODOO_NMIT_VIRTUAL < ODOO_NMIT_VIRTUAL_backup.sql
```

Enter your MySQL password when prompted.

If the import completes without an error, the database has been restored successfully.

## 5. Backend `.env` Configuration

The backend requires an `.env` file containing the database connection details.

Create a file named:

```text
backend/.env
```

Use the following format:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=ODOO_NMIT_VIRTUAL
DB_PORT=3306
```

Replace:

```text
YOUR_MYSQL_PASSWORD
```

with the password of the local MySQL `root` user.

### Important

Do **not** commit the actual `.env` file containing your password to GitHub.

Instead, the repository should contain a `.env.example` file such as:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=ODOO_NMIT_VIRTUAL
DB_PORT=3306
```

The evaluator should copy `.env.example` to `.env` and enter their own MySQL password.

## 6. Start the Backend

After configuring the database and `.env`, open a terminal in the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Then start the backend using the project's configured command, for example:

```bash
npm start
```

or:

```bash
npm run dev
```

Use whichever command is defined in `backend/package.json`.

## 7. Start the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Then start the frontend:

```bash
npm run dev
```

## 8. Troubleshooting

### `mysql is not recognized`

If Windows cannot find the `mysql` command, add the MySQL `bin` directory to your PATH.

A typical installation path is:

```text
C:\Program Files\MySQL\MySQL Server 9.5\bin
```

Alternatively, run the command using the full path:

```bash
"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root -p ODOO_NMIT_VIRTUAL < ODOO_NMIT_VIRTUAL_backup.sql
```

### Database connection error

Check that:

1. MySQL Server is running.
2. The database name is exactly `ODOO_NMIT_VIRTUAL`.
3. The username in `.env` is correct.
4. The password in `.env` is correct.
5. The port matches your MySQL installation, normally `3306`.
6. The database backup was imported successfully.

You can verify that the database exists by running:

```bash
mysql -u root -p
```

and then:

```sql
SHOW DATABASES;
```

You should see:

```text
ODOO_NMIT_VIRTUAL
```

To verify that tables were imported:

```sql
USE ODOO_NMIT_VIRTUAL;
SHOW TABLES;
```

## Quick Setup Summary

For a fresh setup:

```text
1. Install MySQL
2. Clone the project
3. Create ODOO_NMIT_VIRTUAL database
4. Import ODOO_NMIT_VIRTUAL_backup.sql
5. Create backend/.env
6. Add local MySQL credentials to .env
7. Run npm install in backend
8. Start backend
9. Run npm install in frontend
10. Start frontend
```

The database backup is included with the project so that evaluators can recreate the required database locally without needing access to the original development machine.
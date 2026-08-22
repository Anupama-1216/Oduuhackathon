import React, { useState } from "react";
import "./EmployeeDashboard.css";

const INITIAL_EMPLOYEES = [
  { id: 1, name: "Alex Morgan", dept: "Engineering", jobPosition: "Senior Developer", status: "present", avatar: "https://i.pravatar.cc/150?img=11", company: "Dayflow Inc.", empCode: "EMP1001", email: "alex@dayflow.com", mobile: "+1 234 567 890", manager: "Sarah Jenkins", location: "New York", dob: "1992-05-14", address: "123 Tech Lane, NY", nationality: "American", gender: "Male", maritalStatus: "Single", doj: "2022-01-15", bankAccount: "XXXX-XXXX-4321", bankName: "Chase Bank", ifsc: "CHAS0001234", pan: "ABCDE1234F", uan: "100203040506" },
  { id: 2, name: "Sophia Chen", dept: "Design", jobPosition: "UI/UX Designer", status: "leave", avatar: "https://i.pravatar.cc/150?img=5", company: "Dayflow Inc.", empCode: "EMP1002", email: "sophia@dayflow.com", mobile: "+1 234 567 891", manager: "Sarah Jenkins", location: "San Francisco", dob: "1994-08-22", address: "456 Design Ave, CA", nationality: "American", gender: "Female", maritalStatus: "Married", doj: "2023-03-10", bankAccount: "XXXX-XXXX-8765", bankName: "Wells Fargo", ifsc: "WFAR0005678", pan: "FGHIJ5678K", uan: "100908070605" },
  { id: 3, name: "Jordan Lee", dept: "Marketing", jobPosition: "Marketing Lead", status: "absent", avatar: "https://i.pravatar.cc/150?img=3", company: "Dayflow Inc.", empCode: "EMP1003", email: "jordan@dayflow.com", mobile: "+1 234 567 892", manager: "Mike Ross", location: "Chicago", dob: "1990-11-30", address: "789 Market St, IL", nationality: "American", gender: "Male", maritalStatus: "Single", doj: "2024-02-01", bankAccount: "XXXX-XXXX-1122", bankName: "Bank of America", ifsc: "BOFA0009012", pan: "KLMNO9012P", uan: "100112233445" }
];

export default function EmployeeDashboard({ onLogout }) {
  const [employees] = useState(INITIAL_EMPLOYEES);
  const [activeTab, setActiveTab] = useState("Employees");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Selected Profile state for viewing details
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileSubTab, setProfileSubTab] = useState("Resume");

  // Toggle for testing Admin vs Employee access permissions
  const [isAdmin, setIsAdmin] = useState(true);

  // Dynamic Salary Calculations based on Wage = 50,000 / month
  const monthlyWage = 50000;
  const yearlyWage = monthlyWage * 12;
  const basicSalary = monthlyWage * 0.50; // 50% of Wage
  const hra = basicSalary * 0.50; // 50% of Basic
  const standardAllowance = 4167.00;
  const performanceBonus = monthlyWage * 0.0833; // 8.33%
  const leaveTravelAllowance = monthlyWage * 0.0833; // 8.33%
  const fixedAllowance = monthlyWage - (basicSalary + hra + standardAllowance + performanceBonus + leaveTravelAllowance);
  const pfEmployee = 3000.00; // 12%
  const profTax = 200.00;

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* 1. TOP NAVBAR */}
      <header className="navbar">
        <div className="nav-left">
          <div className="logo-placeholder">Company Logo</div>
          <nav className="nav-links">
            {["Employees", "Attendance", "Time Off"].map((tab) => (
              <button
                key={tab}
                className={`nav-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => { setActiveTab(tab); setSelectedProfile(null); }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="nav-right">
          {/* Admin Role Toggle Switch for Testing */}
          <button className="role-toggle-btn" onClick={() => setIsAdmin(!isAdmin)}>
            Role: {isAdmin ? "Admin" : "Employee"}
          </button>

          {/* Attendance Status Dot */}
          <div className={`header-status-dot ${isCheckedIn ? "green" : "red"}`}></div>

          {/* User Profile Avatar Dropdown */}
          <div className="avatar-wrapper">
            <img
              src={employees[0].avatar}
              alt="User Profile"
              className="user-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => { setSelectedProfile(employees[0]); setDropdownOpen(false); }}>
                  My Profile
                </button>
                <button onClick={() => { if (onLogout) onLogout(); setDropdownOpen(false); }}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. PROFILE VIEW (FULL PAGE FORM VIEW FROM IMAGE 2 & 3) */}
      {selectedProfile ? (
        <div className="profile-view-container">
          <button className="back-btn" onClick={() => setSelectedProfile(null)}>← Back to List</button>

          <div className="profile-card-header">
            <div className="profile-avatar-large">
              <img src={selectedProfile.avatar} alt={selectedProfile.name} />
            </div>
            <div className="profile-meta">
              <h2>{selectedProfile.name}</h2>
              <div className="meta-grid">
                <p><strong>Job Position:</strong> {selectedProfile.jobPosition}</p>
                <p><strong>Company:</strong> {selectedProfile.company}</p>
                <p><strong>Email:</strong> {selectedProfile.email}</p>
                <p><strong>Department:</strong> {selectedProfile.dept}</p>
                <p><strong>Mobile:</strong> {selectedProfile.mobile}</p>
                <p><strong>Manager:</strong> {selectedProfile.manager}</p>
                <p><strong>Location:</strong> {selectedProfile.location}</p>
              </div>
            </div>
          </div>

          {/* SUB TABS NAVIGATION */}
          <div className="sub-tabs">
            {["Resume", "Private Info", "Salary Info", "Security"].map((subTab) => {
              // Hide "Salary Info" if logged in as normal employee
              if (subTab === "Salary Info" && !isAdmin) return null;
              return (
                <button
                  key={subTab}
                  className={`sub-tab-btn ${profileSubTab === subTab ? "active" : ""}`}
                  onClick={() => setProfileSubTab(subTab)}
                >
                  {subTab}
                </button>
              );
            })}
          </div>

          {/* SUB TAB 1: RESUME */}
          {profileSubTab === "Resume" && (
            <div className="sub-tab-content grid-2-col">
              <div>
                <h3>About</h3>
                <p>Experienced professional skilled in project delivery and system integrations.</p>
                <h3>What I love about my job</h3>
                <p>Collaborating across teams and building seamless UI workflows.</p>
                <h3>My interests and hobbies</h3>
                <p>Coding, UI design exploration, and travelling.</p>
              </div>
              <div>
                <h3>Skills</h3>
                <span className="skill-badge">React</span>
                <span className="skill-badge">JavaScript</span>
                <span className="skill-badge">CSS Glassmorphism</span>
                <button className="add-btn">+ Add Skills</button>

                <h3>Certifications</h3>
                <button className="add-btn">+ Add Certification</button>
              </div>
            </div>
          )}

          {/* SUB TAB 2: PRIVATE INFO */}
          {profileSubTab === "Private Info" && (
            <div className="sub-tab-content grid-2-col">
              <div>
                <p><strong>Date of Birth:</strong> {selectedProfile.dob}</p>
                <p><strong>Residing Address:</strong> {selectedProfile.address}</p>
                <p><strong>Nationality:</strong> {selectedProfile.nationality}</p>
                <p><strong>Personal Email:</strong> {selectedProfile.email}</p>
                <p><strong>Gender:</strong> {selectedProfile.gender}</p>
                <p><strong>Marital Status:</strong> {selectedProfile.maritalStatus}</p>
                <p><strong>Date of Joining:</strong> {selectedProfile.doj}</p>
              </div>
              <div>
                <h3>Bank Details</h3>
                <p><strong>Account Number:</strong> {selectedProfile.bankAccount}</p>
                <p><strong>Bank Name:</strong> {selectedProfile.bankName}</p>
                <p><strong>IFSC Code:</strong> {selectedProfile.ifsc}</p>
                <p><strong>PAN No:</strong> {selectedProfile.pan}</p>
                <p><strong>UAN No:</strong> {selectedProfile.uan}</p>
                <p><strong>Emp Code:</strong> {selectedProfile.empCode}</p>
              </div>
            </div>
          )}

          {/* SUB TAB 3: SALARY INFO (ADMIN ONLY VIEW FROM IMAGE 2) */}
          {profileSubTab === "Salary Info" && isAdmin && (
            <div className="sub-tab-content">
              <div className="salary-summary-box">
                <div className="salary-metric">
                  <span>Month Wage:</span> <strong>₹{monthlyWage.toLocaleString()} / Month</strong>
                </div>
                <div className="salary-metric">
                  <span>Yearly Wage:</span> <strong>₹{yearlyWage.toLocaleString()} / Yearly</strong>
                </div>
              </div>

              <h3>Salary Components</h3>
              <table className="salary-table">
                <thead>
                  <tr><th>Component</th><th>Amount (Monthly)</th><th>% of Wage</th></tr>
                </thead>
                <tbody>
                  <tr><td>Basic Salary</td><td>₹{basicSalary.toFixed(2)}</td><td>50.00%</td></tr>
                  <tr><td>House Rent Allowance (HRA)</td><td>₹{hra.toFixed(2)}</td><td>50.00% of Basic</td></tr>
                  <tr><td>Standard Allowance</td><td>₹{standardAllowance.toFixed(2)}</td><td>Fixed</td></tr>
                  <tr><td>Performance Bonus</td><td>₹{performanceBonus.toFixed(2)}</td><td>8.33%</td></tr>
                  <tr><td>Leave Travel Allowance</td><td>₹{leaveTravelAllowance.toFixed(2)}</td><td>8.33%</td></tr>
                  <tr><td>Fixed Allowance</td><td>₹{fixedAllowance.toFixed(2)}</td><td>Remaining</td></tr>
                </tbody>
              </table>

              <h3>Deductions & Contributions</h3>
              <div className="deductions-grid">
                <div>
                  <p><strong>Provident Fund (PF):</strong> ₹{pfEmployee.toFixed(2)} / month (12%)</p>
                </div>
                <div>
                  <p><strong>Professional Tax:</strong> ₹{profTax.toFixed(2)} / month</p>
                </div>
              </div>
            </div>
          )}

          {/* SUB TAB 4: SECURITY */}
          {profileSubTab === "Security" && (
            <div className="sub-tab-content">
              <h3>Security & Credentials</h3>
              <p><strong>Login ID:</strong> {selectedProfile.empCode}</p>
              <button className="btn-secondary">Change Password</button>
            </div>
          )}
        </div>
      ) : (
        /* 3. MAIN EMPLOYEES GRID VIEW (IMAGE 1) */
        <>
          <div className="toolbar">
            <button className="badge-new">NEW</button>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {activeTab === "Employees" && (
            <div className="cards-grid">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="employee-card" onClick={() => setSelectedProfile(emp)}>
                  <div className="card-status-indicator">
                    {emp.status === "present" && <span className="status-dot green"></span>}
                    {emp.status === "leave" && <span className="status-icon airplane">✈</span>}
                    {emp.status === "absent" && <span className="status-dot yellow"></span>}
                  </div>
                  <img src={emp.avatar} alt={emp.name} className="card-avatar" />
                  <p className="card-name">{emp.name}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Attendance" && (
  <div className="attendance-view">
    {isAdmin ? (
      /* ADMIN / HR OFFICER VIEW */
      <>
        <h3>Attendances List View (Admin/HR Officer)</h3>
        <div className="attendance-controls">
          <input
            type="text"
            placeholder="Searchbar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="date-nav">
            <button className="nav-arrow">{"<-"}</button>
            <button className="nav-arrow">{"->"}</button>
            <input type="date" defaultValue="2025-10-22" className="date-picker-btn" />
            <span className="day-badge">Day</span>
          </div>
        </div>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>Emp</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Work Hours</th>
              <th>Extra Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>[Employee] Alex Morgan</td>
              <td>10:00</td>
              <td>19:00</td>
              <td>09:00</td>
              <td>01:00</td>
            </tr>
            <tr>
              <td>[Employee] Sophia Chen</td>
              <td>10:00</td>
              <td>19:00</td>
              <td>09:00</td>
              <td>01:00</td>
            </tr>
          </tbody>
        </table>
      </>
    ) : (
      /* EMPLOYEE VIEW */
      <>
        <h3>Attendance (Employee View)</h3>
        <div className="employee-stats-bar">
          <div className="nav-arrows">
            <button className="nav-arrow">{"<-"}</button>
            <button className="nav-arrow">{"->"}</button>
          </div>
          <div className="stat-card">
            <span className="stat-label">Month</span>
            <span className="stat-value">Oct</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Count of days present</span>
            <span className="stat-value">22</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Leaves count</span>
            <span className="stat-value">2</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total working days</span>
            <span className="stat-value">24</span>
          </div>
        </div>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Work Hours</th>
              <th>Extra Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>21/10/2025</td>
              <td>10:00</td>
              <td>19:00</td>
              <td>09:00</td>
              <td>01:00</td>
            </tr>
            <tr>
              <td>22/10/2025</td>
              <td>10:05</td>
              <td>19:00</td>
              <td>08:55</td>
              <td>00:00</td>
            </tr>
          </tbody>
        </table>
      </>
    )}
  </div>
)}

          {activeTab === "Time Off" && (
            <div className="tab-panel">
              <h2>Time Off Management</h2>
              <p>Apply for leaves or view leave history.</p>
            </div>
          )}
        </>
      )}

      <footer className="dashboard-footer">
        <button className="settings-link">Settings</button>
      </footer>
    </div>
  );
}
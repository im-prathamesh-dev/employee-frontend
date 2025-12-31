import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", salary: "", city: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const res = await axios.get("http://localhost:8080/api/employees");
    setEmployees(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:8080/api/employees/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:8080/api/employees", form);
    }
    setForm({ name: "", salary: "", city: "" });
    loadEmployees();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/employees/${id}`);
    loadEmployees();
  };

  const handleEdit = (emp) => {
    setForm({ name: emp.name, salary: emp.salary, city: emp.city });
    setEditingId(emp.id);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
        padding: "40px 0",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "32px",
        }}
      >
        <h2 style={{ color: "#2d3748", marginBottom: "24px", textAlign: "center" }}>
          Employee Management
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "32px",
            alignItems: "flex-end",
            flexWrap: "wrap",
            background: "#f1f5f9",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ flex: "1 1 180px" }}>
            <label style={{ fontWeight: 500, color: "#475569" }}>Name</label>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                marginTop: "4px",
                padding: "10px",
                width: "100%",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "1rem",
                background: "#fff",
              }}
              required
            />
          </div>
          <div style={{ flex: "1 1 120px" }}>
            <label style={{ fontWeight: 500, color: "#475569" }}>Salary</label>
            <input
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              style={{
                marginTop: "4px",
                padding: "10px",
                width: "100%",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "1rem",
                background: "#fff",
              }}
              required
              type="number"
              min="0"
            />
          </div>
          <div style={{ flex: "1 1 140px" }}>
            <label style={{ fontWeight: 500, color: "#475569" }}>City</label>
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={{
                marginTop: "4px",
                padding: "10px",
                width: "100%",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "1rem",
                background: "#fff",
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              backgroundColor: editingId ? "#f59e42" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.2s",
              marginTop: "24px",
            }}
            onMouseOver={e =>
              (e.target.style.backgroundColor = editingId ? "#e67e22" : "#1d4ed8")
            }
            onMouseOut={e =>
              (e.target.style.backgroundColor = editingId ? "#f59e42" : "#2563eb")
            }
          >
            {editingId ? "Update Employee" : "Add Employee"}
          </button>
        </form>

        {/* Employee List */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Salary</th>
                <th style={thStyle}>City</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp, idx) => (
                  <tr
                    key={emp.id}
                    style={{
                      background: idx % 2 === 0 ? "#f8fafc" : "#fff",
                      transition: "background 0.2s",
                    }}
                  >
                    <td style={tdStyle}>{emp.id}</td>
                    <td style={tdStyle}>{emp.name}</td>
                    <td style={tdStyle}>{emp.salary}</td>
                    <td style={tdStyle}>{emp.city}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleEdit(emp)}
                        style={{
                          ...actionBtnStyle,
                          backgroundColor: "#38bdf8",
                        }}
                        onMouseOver={e => (e.target.style.backgroundColor = "#0ea5e9")}
                        onMouseOut={e => (e.target.style.backgroundColor = "#38bdf8")}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        style={{
                          ...actionBtnStyle,
                          backgroundColor: "#f87171",
                          marginLeft: "8px",
                        }}
                        onMouseOver={e => (e.target.style.backgroundColor = "#ef4444")}
                        onMouseOut={e => (e.target.style.backgroundColor = "#f87171")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Styles for table headers and cells
const thStyle = {
  border: "none",
  padding: "14px 12px",
  color: "#334155",
  fontWeight: 700,
  fontSize: "1rem",
  textAlign: "left",
  background: "#f1f5f9",
};

const tdStyle = {
  border: "none",
  padding: "12px",
  color: "#475569",
  fontSize: "1rem",
  verticalAlign: "middle",
};

const actionBtnStyle = {
  padding: "7px 16px",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontWeight: 500,
  cursor: "pointer",
  fontSize: "0.95rem",
  transition: "background 0.2s",
};

export default App;
 
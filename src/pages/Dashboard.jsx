import { useEffect, useState } from "react";

import API from "../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
  });

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch {
      toast.error("Failed to load expenses");
    }
  };

  useEffect(() => {
    const checkPayment = async () => {
      const orderId = new URLSearchParams(window.location.search).get(
        "order_id"
      );
      if (orderId) {
        try {
          const { data } = await API.get(`/api/payment-status/${orderId}`);
          if (data.paymentStatus === "SUCCESSFUL") {
            toast.success("🎉 Premium activated!");
            window.history.replaceState({}, document.title, "/dashboard");
          }
        } catch {
          toast.error("Payment check failed");
        }
      }
    };
    checkPayment();
    fetchExpenses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses", form);
      setForm({ amount: "", category: "", description: "" });
      fetchExpenses();
      toast.success("Expense added");
    } catch {
      toast.error("Error adding expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">💼 Expense Dashboard</h3>

      <form
        onSubmit={handleAdd}
        className="row gy-2 gx-3 align-items-center mb-4"
      >
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Amount (₹)</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id}>
                <td>{e.amount}</td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(e._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-muted">
                  No expenses added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

// import { useEffect, useState } from "react";
// import API from "../services/api";
// import { toast } from "react-toastify";

// const RECORDS_PER_PAGE = [5, 8, 10, 12];

// const Dashboard = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [form, setForm] = useState({
//     amount: "",
//     category: "",
//     description: "",
//   });
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(RECORDS_PER_PAGE[1]);
//   const [totalCount, setTotalCount] = useState(0);

//   const totalPages = Math.max(1, Math.ceil(totalCount / limit));

//   // Fetch expenses
//   const fetchExpenses = async (pg = page, lim = limit) => {
//     try {
//       const res = await API.get(`/expenses?page=${pg}&limit=${lim}`);
//       setExpenses(res.data.expenses);
//       setTotalCount(res.data.totalCount);
//     } catch {
//       toast.error("Failed to load expenses");
//     }
//   };

//   // On mount: payment status
//   useEffect(() => {
//     const orderId = new URLSearchParams(window.location.search).get("order_id");
//     if (orderId) {
//       API.get(`/api/payment-status/${orderId}`)
//         .then(({ data }) => {
//           if (data.paymentStatus === "SUCCESSFUL") {
//             toast.success("🎉 Premium activated!");
//             window.history.replaceState({}, document.title, "/dashboard");
//           }
//         })
//         .catch(() => toast.error("Payment check failed"));
//     }
//   }, []);

//   // On page/limit change
//   useEffect(() => {
//     fetchExpenses();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, limit]); // not including fetchExpenses avoids unnecessary dependencies

//   // Form change
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Add expense
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/expenses", form);
//       toast.success("Expense added");
//       setForm({ amount: "", category: "", description: "" });

//       // Always show new expense, reload first page if on a later page
//       setPage(1);
//       fetchExpenses(1);
//     } catch {
//       toast.error("Error adding expense");
//     }
//   };

//   // Delete expense
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this expense?"))
//       return;
//     try {
//       await API.delete(`/expenses/${id}`);
//       toast.success("Deleted");

//       // Calculate new counts/pages
//       const newTotal = totalCount - 1;
//       const lastPage = Math.max(1, Math.ceil(newTotal / limit));
//       if (page > lastPage) {
//         setPage(lastPage); // triggers useEffect to fetch the right page
//       } else {
//         fetchExpenses(page);
//       }
//       setTotalCount(newTotal);
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3 className="text-center mb-4">💼 Expense Dashboard</h3>

//       <form
//         onSubmit={handleAdd}
//         className="row gy-2 gx-3 align-items-center mb-4"
//       >
//         <div className="col-md-3">
//           <input
//             type="number"
//             className="form-control"
//             name="amount"
//             min={1}
//             value={form.amount}
//             onChange={handleFormChange}
//             placeholder="Amount (₹)"
//             required
//           />
//         </div>
//         <div className="col-md-3">
//           <input
//             type="text"
//             className="form-control"
//             name="category"
//             value={form.category}
//             onChange={handleFormChange}
//             placeholder="Category"
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <input
//             type="text"
//             className="form-control"
//             name="description"
//             value={form.description}
//             onChange={handleFormChange}
//             placeholder="Description"
//             required
//           />
//         </div>
//         <div className="col-md-2">
//           <button className="btn btn-primary w-100">Add</button>
//         </div>
//       </form>

//       <div className="table-responsive mb-2">
//         <table className="table table-hover text-center">
//           <thead className="table-dark">
//             <tr>
//               <th>Amount (₹)</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {expenses.length > 0 ? (
//               expenses.map((e) => (
//                 <tr key={e._id}>
//                   <td>{e.amount}</td>
//                   <td>{e.category}</td>
//                   <td>{e.description}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-danger"
//                       onClick={() => handleDelete(e._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-muted">
//                   No expenses found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer: Pagination + Total count */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
//         <div>
//           <label className="me-2">Records per page:</label>
//           <select
//             value={limit}
//             onChange={(e) => {
//               setLimit(Number(e.target.value));
//               setPage(1);
//             }}
//             className="form-select d-inline-block w-auto"
//           >
//             {RECORDS_PER_PAGE.map((num) => (
//               <option key={num} value={num}>
//                 {num}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="text-muted my-2 my-md-0">
//           Total Expenses: <strong>{totalCount}</strong>
//         </div>

//         <div>
//           <button
//             className="btn btn-outline-secondary me-2"
//             disabled={page === 1}
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//           >
//             ⬅ Prev
//           </button>
//           <span>
//             Page <strong>{page}</strong> of <strong>{totalPages}</strong>
//           </span>
//           <button
//             className="btn btn-outline-secondary ms-2"
//             disabled={page >= totalPages}
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           >
//             Next ➡
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const RECORDS_PER_PAGE = [5, 8, 10, 12];

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(RECORDS_PER_PAGE[1]);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const fetchExpenses = async (pg = page, lim = limit) => {
    try {
      const res = await API.get(`/expenses?page=${pg}&limit=${lim}`);
      setExpenses(res.data.expenses);
      setTotalCount(res.data.totalCount);
    } catch {
      toast.error("Failed to load expenses");
    }
  };

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    if (orderId) {
      API.get(`/api/payment-status/${orderId}`)
        .then(({ data }) => {
          if (data.paymentStatus === "SUCCESSFUL") {
            toast.success("🎉 Premium activated!");
            window.history.replaceState({}, document.title, "/dashboard");
          }
        })
        .catch(() => toast.error("Payment check failed"));
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses", form);
      toast.success("Expense added");
      setForm({ amount: "", category: "", description: "" });
      setPage(1);
      fetchExpenses(1);
    } catch {
      toast.error("Error adding expense");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      await API.delete(`/expenses/${id}`);
      toast.success("Deleted");

      const newTotal = totalCount - 1;
      const lastPage = Math.max(1, Math.ceil(newTotal / limit));
      if (page > lastPage) {
        setPage(lastPage);
      } else {
        fetchExpenses(page);
      }
      setTotalCount(newTotal);
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
            name="amount"
            min={1}
            value={form.amount}
            onChange={handleFormChange}
            placeholder="Amount (₹)"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="category"
            value={form.category}
            onChange={handleFormChange}
            placeholder="Category"
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            placeholder="Description"
            required
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <div className="expense-table-wrapper position-relative">
        <div className="table-responsive mb-5">
          <table className="table text-center table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Amount (₹)</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((e) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-muted">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sticky-pagination p-3 bg-white border-top d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div>
            <label className="me-2">Records per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="form-select d-inline-block w-auto"
            >
              {RECORDS_PER_PAGE.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="text-muted my-2 my-md-0">
            Total Expenses: <strong>{totalCount}</strong>
          </div>

          <div>
            <button
              className="btn btn-outline-secondary me-2"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ⬅ Prev
            </button>
            <span>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              className="btn btn-outline-secondary ms-2"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next ➡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

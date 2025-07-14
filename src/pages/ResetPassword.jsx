import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { requestId } = useParams();
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      try {
        await API.get(`/password/validate/${requestId}`);
        setValid(true);
      } catch {
        toast.error("Invalid or expired link");
      }
    };
    validate();
  }, [requestId]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await API.post("/password/update", { requestId, newPassword: password });
      toast.success("Password updated successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to reset password");
    }
  };

  if (!valid) return null;

  return (
    <div className="container mt-5" style={{ maxWidth: 480 }}>
      <h3>Reset Password</h3>
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="form-control my-3"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-success w-100">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;

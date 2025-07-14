import { useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

const ForgotPasswordRequest = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/password/forgot", { email });
      toast.success("Reset email sent. Check your inbox.");
    } catch (err) {
      toast.error("Could not send reset email");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 480 }}>
      <h3>Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control my-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPasswordRequest;

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState("VERIFYING");
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid payment reference");
      return navigate("/dashboard");
    }

    const verifyPayment = async (attempt = 1) => {
      try {
        toast.info(`Verifying payment (Attempt ${attempt})...`);
        const { data } = await API.get(`/orders/status/${orderId}`); // Note: Added /api prefix

        setStatus(data.status);

        if (data.status === "SUCCESSFUL") {
          toast.success("Payment successful! Premium activated.");
          setTimeout(() => navigate("/dashboard"), 3000);
        } else if (data.status === "FAILED") {
          toast.error("Payment failed. Please try again.");
          setTimeout(() => navigate("/pricing"), 3000);
        } else if (attempt < 3) {
          // Retry up to 3 times
          setTimeout(() => verifyPayment(attempt + 1), 2000);
        } else {
          toast.info("Payment still processing. Check back later.");
          setTimeout(() => navigate("/dashboard"), 3000);
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Payment verification failed");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    };

    verifyPayment();
  }, [orderId, navigate]);

  return (
    <div className="container mt-5 text-center">
      <div className="card p-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h4 className="mb-3">Payment Status</h4>

        {status === "VERIFYING" && (
          <>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Verifying payment...</p>
          </>
        )}

        {status === "SUCCESSFUL" && (
          <div className="text-success">
            <i className="bi bi-check-circle-fill fs-1"></i>
            <p className="mt-2">Payment successful!</p>
          </div>
        )}

        {status === "FAILED" && (
          <div className="text-danger">
            <i className="bi bi-x-circle-fill fs-1"></i>
            <p className="mt-2">Payment failed</p>
          </div>
        )}

        <p className="mt-3">Order ID: {orderId}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;

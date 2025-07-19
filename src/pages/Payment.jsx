import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

const Payment = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      toast.info("Preparing payment...", { autoClose: 2000 });

      const { data } = await API.post("/orders/pay", {
        amount: 100,
        customerId: `user_${Date.now()}`,
        customerPhone: "9876543210",
      });

      if (!data.paymentSessionId) {
        throw new Error("Payment session not returned from server.");
      }

      const cashfree = window.Cashfree({ mode: "sandbox" });

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initiatePayment();
  }, []);

  return (
    <div className="container mt-4 text-center">
      <div className="card p-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h3 className="mb-4">Upgrade to Premium</h3>
        {loading ? (
          <>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Redirecting to secure payment...</p>
          </>
        ) : (
          <button
            className="btn btn-primary w-100"
            onClick={initiatePayment}
            disabled={loading}
          >
            Proceed to Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const initiatePayment = async () => {
  //   try {
  //     setLoading(true);
  //     toast.info("Preparing payment gateway...", { autoClose: 2000 });

  //     // 1. Create payment order in backend
  //     const { data } = await API.post("/orders/pay", {
  //       orderAmount: 10000, // ₹100 in paise
  //       customerID: `user_${Date.now()}`,
  //       customerPhone: "9876543210",
  //     });

  //     // 2. Dynamically import Cashfree
  //     const { load } = await import("@cashfreepayments/cashfree-js");

  //     // 3. Initialize Cashfree
  //     const cashfree = await load({
  //       mode:
  //         process.env.REACT_APP_CF_ENV === "production"
  //           ? "production"
  //           : "sandbox",
  //     });

  //     // 4. Open checkout
  //     cashfree.checkout({
  //       paymentSessionId: data.paymentSessionId,
  //       redirectTarget: "_self",
  //     });
  //   } catch (error) {
  //     console.error("Payment error:", error);
  //     toast.error(
  //       error.response?.data?.error ||
  //         "Payment initiation failed. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Auto-initiate payment when component mounts
  const initiatePayment = async () => {
    try {
      setLoading(true);
      toast.info("Preparing payment gateway...", { autoClose: 2000 });

      // 1. Create payment order in backend - Match backend expectations
      const { data } = await API.post("/orders/pay", {
        amount: 100, // ₹1.00 in rupees (not paise)
        customerId: `user_${Date.now()}`,
        customerPhone: "9876543210", // Must be string
      });

      // 2. Load Cashfree SDK
      const { load } = await import("@cashfreepayments/cashfree-js");

      // 3. Initialize with proper mode
      const cashfree = await load({
        mode:
          process.env.REACT_APP_CF_ENV === "production"
            ? "production"
            : "sandbox",
      });

      // 4. Verify session ID before proceeding
      if (!data.paymentSessionId) {
        throw new Error("No payment session ID received");
      }

      // 5. Open checkout
      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      console.error("Payment Error Details:", {
        message: error.message,
        response: error.response?.data,
        request: error.config,
      });

      toast.error(
        error.response?.data?.message ||
          "Payment failed. Please check details and try again."
      );
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
          <>
            <p className="mb-4">
              You'll be redirected to Cashfree's secure payment page
            </p>
            <button
              className="btn btn-primary w-100"
              onClick={initiatePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;

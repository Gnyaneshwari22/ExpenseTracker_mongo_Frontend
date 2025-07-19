import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  const fetchLeaderboard = useCallback(async () => {
    try {
      const premiumRes = await API.get("/premium/user/premiumStatus");
      if (!premiumRes.data.isPremium) {
        toast.info("You must buy premium to access leaderboard");
        return navigate("/dashboard");
      }
      setIsPremium(true);

      const res = await API.get("/premium/showleaderboard");
      setLeaderboard(res.data);
    } catch (err) {
      toast.error("Failed to load leaderboard");
    }
  }, [navigate]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]); // Now it's safe

  if (!isPremium) return null;

  return (
    <div className="container mt-5">
      <h3>🏆 Leaderboard</h3>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Total Expense</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry) => (
            <tr key={entry.rank}>
              <td>{entry.rank}</td>
              <td>{entry.username}</td>
              <td>₹{entry.totalExpense}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

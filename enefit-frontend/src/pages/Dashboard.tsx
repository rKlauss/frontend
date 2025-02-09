import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MonthlyConsumption from "../components/MonthlyConsumption";
import Logout from "../components/Logout";

interface MeteringPoint {
  meteringId: number;
  address: string;
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customerData = location.state?.customerData;

  const meteringPoints: MeteringPoint[] = customerData?.meteringPoints || [];
  const [selectedMeteringPoint, setSelectedMeteringPoint] =
    useState<MeteringPoint | null>(meteringPoints[0] || null);

  useEffect(() => {
    if (!customerData) {
      navigate("/");
    }
  }, [customerData, navigate]);

  if (!customerData || !selectedMeteringPoint) {
    return null;
  }

  const handleMeteringPointChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const meteringId = parseInt(e.target.value);
    const selectedPoint = meteringPoints.find(
      (point: MeteringPoint) => point.meteringId === meteringId
    );
    if (selectedPoint) {
      setSelectedMeteringPoint(selectedPoint);
    }
  };

  const username = sessionStorage.getItem("username") || customerData.username;

  return (
    <div className="p-8 bg-gradient-to-r from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-green-700">
            Welcome, {username}!
          </h1>
          <Logout />
        </div>

        {meteringPoints.length > 1 && (
          <div className="mb-6 flex items-center gap-4">
            <label
              htmlFor="meteringPoint"
              className="text-xl font-semibold text-green-700"
            >
              Select Address:
            </label>
            <select
              id="meteringPoint"
              value={selectedMeteringPoint.meteringId}
              onChange={handleMeteringPointChange}
              className="p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-green-700 w-64"
            >
              {meteringPoints.map((point: MeteringPoint) => (
                <option key={point.meteringId} value={point.meteringId}>
                  {point.address}
                </option>
              ))}
            </select>
          </div>
        )}

        {meteringPoints.length === 1 && (
          <div className="bg-green-50 p-4 rounded-lg shadow-inner mb-6">
            <p className="text-4xl font-semibold text-green-700">
              Your Address: {selectedMeteringPoint.address}
            </p>
          </div>
        )}

        <MonthlyConsumption
          meteringId={selectedMeteringPoint.meteringId}
          username={username}
        />
      </div>
    </div>
  );
};

export default Dashboard;
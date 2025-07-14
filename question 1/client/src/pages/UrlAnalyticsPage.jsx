import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { AiOutlineMessage, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const UrlAnalyticsPage = () => {
    const navigate=useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/shorturl/all`
        );
        setUrls(response.data.urls || response.data);
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load analytics";
        setError(message);
      }
    };

    fetchAnalytics();
  }, []);



  // Chart Data Preparation
  const chartData = {
    labels: urls.map((url) => url.shortcode),
    datasets: [
      {
        label: "Total Clicks",
        data: urls.map((url) => url.clicks?.length || 0),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          URL Analytics
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {urls.length === 0 && !error ? (
          <p className="text-center text-gray-500">
            No analytics data available.
          </p>
        ) : (
          <>
            {/*  Chart */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-center">
                Clicks per Shortcode
              </h2>
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* URL Details */}
            {urls.map((url, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 mb-4"
              >
                <p>
                  <strong>Original URL:</strong>{" "}
                  <span className="text-gray-700 break-words">
                    {url.originalURL}
                  </span>
                </p>
                <p>
                  <strong>Short URL:</strong>{" "}
                  <a
                    href={`http://localhost:3000/api/v1/shorturl/${url.shortcode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 underline break-words"
                  >
                    http://localhost:3000/api/v1/shorturl/{url.shortcode}
                  </a>
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(url.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Expires At:</strong>{" "}
                  {new Date(url.expiresAt).toLocaleString()}
                </p>
                <p>
                  <strong>Total Clicks:</strong> {url.clicks?.length || 0}
                </p>

                {url.clicks && url.clicks.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold mb-1">Click Details:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {url.clicks.map((click, i) => (
                        <li
                          key={i}
                          className="border border-gray-100 p-2 rounded bg-gray-50"
                        >
                          <p>
                            <strong>Time:</strong>{" "}
                            {new Date(click.timestamp).toLocaleString()}
                          </p>
                          <p>
                            <strong>Referrer:</strong>{" "}
                            {click.referrer || "Direct"}
                          </p>
                          <p>
                            <strong>Location:</strong>{" "}
                            {click.geoLocation || "Unknown"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      <button
            onClick={() => navigate("/")}
            className="mb-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
          >
            Back to Home
          </button>
    </div>
  );
};

export default UrlAnalyticsPage;

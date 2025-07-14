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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const UrlAnalyticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Need help with your shortened URLs?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/shorturl/all"
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

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: inputMessage },
      { sender: "bot", text: "I'll get back to you soon!" },
    ]);
    setInputMessage("");
  };

  // 📊 Chart Data Preparation
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
            {/* 📊 Chart */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-center">
                Clicks per Shortcode
              </h2>
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* 🔍 URL Details */}
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

      {/* 💬 Chat Button */}
      <button
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition"
        onClick={() => setShowChat(!showChat)}
      >
        {showChat ? (
          <AiOutlineClose size={20} />
        ) : (
          <AiOutlineMessage size={24} />
        )}
      </button>

      {/* 🗨️ Chat Box */}
      {showChat && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-indigo-600 text-white p-3 font-bold">
            Support Chat
          </div>
          <div className="flex-1 p-3 overflow-y-auto max-h-60 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-indigo-100 self-end ml-auto"
                    : "bg-gray-100 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex border-t">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 p-2 text-sm focus:outline-none"
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="px-4 text-indigo-600 font-semibold text-sm hover:text-indigo-800"
            >
              Send
            </button>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mb-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlAnalyticsPage;

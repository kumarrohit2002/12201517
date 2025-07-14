import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UrlShortenerPage = () => {
  const [formData, setFormData] = useState({
    url: '',
    shortcode: '',
    validity: 30,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/shorturl', formData);
      setResult(response.data);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Something went wrong';
      setError(message);
    }
  };

  const handleAnalytics = () => {
    navigate('/analytics'); 
  };

  return (
    <div className="min-h-screen  bg-gray-100 flex flex-col items-center justify-center p-4">
         <button
              onClick={handleAnalytics}
              className="mt-4 p-2 mb-4  bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
            >
              View Analytics
            </button>
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          URL Shortener
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            placeholder="Enter long URL..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          />

          <div className="flex gap-4">
            <input
              type="text"
              name="shortcode"
              value={formData.shortcode}
              onChange={handleChange}
              placeholder="Custom shortcode (optional)"
              className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            />
            <input
              type="number"
              name="validity"
              value={formData.validity}
              onChange={handleChange}
              placeholder="Validity (mins)"
              min="1"
              className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-200"
          >
            Generate Short Link
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}

        {result && (
          <div className="mt-6 text-sm text-gray-800">
            <p className="font-medium">✅ Shortened URL:</p>
            <a
              href={result.shortLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline break-all"
            >
              {result.shortLink}
            </a>
            <p className="mt-2 text-gray-500">⏰ Expires At: {result.expiry}</p>

           
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortenerPage;

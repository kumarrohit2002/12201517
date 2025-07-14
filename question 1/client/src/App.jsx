import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlShortenerPage from './pages/UrlShortenerPage';
import UrlAnalyticsPage from './pages/UrlAnalyticsPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortenerPage />} />
        <Route path="/analytics" element={<UrlAnalyticsPage />} />
      </Routes>
    </Router>
  );
};

export default App;

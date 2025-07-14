const Url = require('../models/urlModel');
const { nanoid } = require('nanoid');
const geoip = require('geoip-lite'); 

// Create Short URL
const generateUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'A valid original URL is required' });
    }

    const finalCode = shortcode || nanoid(6);

    const existing = await Url.findOne({ shortcode: finalCode });

    if (existing) {
      return res.status(409).json({ error: 'Shortcode already exists' });
    }

    const expiresAt = new Date(Date.now() + validity * 60 * 1000);

    const newUrl = await Url.create({
      originalURL: url,
      shortcode: finalCode,
      expiresAt,
    });

    res.status(201).json({
        message: 'Short URL generated successfully',
        shortLink: `${req.protocol}://${req.get('host')}/api/v1/shorturl/${finalCode}`,
        expiry: newUrl.expiresAt.toISOString(),
        success: true,
    });


  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message, success: false });
    }
    console.error('Error generating short URL:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

// Redirect to original URL
const redirectUrl = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlEntry = await Url.findOne({ shortcode });

    if (!urlEntry) {
      return res.status(404).json({ error: 'Short URL not found', success: false });
    }

    if (new Date() > urlEntry.expiresAt) {
      return res.status(410).json({ error: 'Link has expired', success: false });
    }

    const referrer = req.get('Referrer') || 'Direct';

    let ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      '127.0.0.1';

    // 🔍 Local dev fallback
    if (ip === '::1' || ip.startsWith('127.') || ip === '::ffff:127.0.0.1') {
      ip = '8.8.8.8'; // Google public IP for testing
    }

    const geo = geoip.lookup(ip);
    const location = geo
      ? [geo.city, geo.country].filter(Boolean).join(', ')
      : 'Unknown';

    urlEntry.clicks.push({
      timestamp: new Date(),
      referrer,
      geoLocation: location,
    });

    await urlEntry.save();

    res.redirect(urlEntry.originalURL);
  } catch (error) {
    console.error('Error retrieving original URL:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};



// Get all shortened URLs with analytics
const getAllUrls = async (req, res) => {
  try {
    const allUrls = await Url.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Fetched all shortened URLs successfully',
      urls: allUrls,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching all shortened URLs:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};


module.exports = {
  generateUrl,
  redirectUrl,
  getAllUrls
};

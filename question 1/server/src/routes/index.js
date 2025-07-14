const express=require('express');


const router = express.Router();
const { generateUrl, redirectUrl,getAllUrls } = require('../controllers');

router.get('/v1', (req, res) => {
    res.send('Welcome to the API version 1 root!');
});



router.post('/v1/shorturl',generateUrl);
router.get('/v1/shorturl/all',getAllUrls);
router.get('/v1/shorturl/:shortcode',redirectUrl);

module.exports = router;
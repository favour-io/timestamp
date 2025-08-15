const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));


// GET /api → return current time
app.get('/api', (req, res) => {
  const now = new Date();
  res.json({ unix: now.getTime(), utc: now.toUTCString() });
});

// GET /api/:date → parse date string or unix timestamp
app.get('/api/:date', (req, res) => {
  const { date: dateParam } = req.params;

  let date;

  // If it's all digits, treat it as a Unix timestamp (ms by default, seconds if length <= 10)
  if (/^\d+$/.test(dateParam)) {
    const num = parseInt(dateParam, 10);
    const ms = dateParam.length <= 10 ? num * 1000 : num; // support seconds and milliseconds
    date = new Date(ms);
  } else {
    // Otherwise, let Date parse the string (ISO-8601 etc.)
    date = new Date(dateParam);
  }

  if (isNaN(date.getTime())) {
    return res.json({ error: 'Invalid Date' });
  }

  return res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

app.listen(PORT, () => {
  console.log(`Timestamp Microservice listening on http://localhost:${PORT}`);
});

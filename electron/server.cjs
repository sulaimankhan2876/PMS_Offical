const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function startServer(userDataPath, isDev) {
  dotenv.config();
  
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  const distPath = path.join(__dirname, '..', 'dist');

  const dbPath = isDev 
    ? path.join(__dirname, '..', 'database.json') 
    : path.join(userDataPath, 'database.json');

  if (!isDev && !fs.existsSync(dbPath)) {
    const defaultDbPath = path.join(__dirname, '..', 'database.json');
    if (fs.existsSync(defaultDbPath)) {
      fs.copyFileSync(defaultDbPath, dbPath);
    } else {
      fs.writeFileSync(dbPath, JSON.stringify({}));
    }
  }

  // API Routes
  app.get('/api/load', (req, res) => {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: "not_found" });
    }
  });

  app.post('/api/save', (req, res) => {
    fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true });
  });

  app.post('/api/notify', async (req, res) => {
    try {
      const { to, message, channel } = req.body;
      
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const phone = process.env.TWILIO_PHONE_NUMBER;
      
      if (!sid || !token || !phone) {
        console.log(`[MOCK TWILIO] Sending ${channel} to ${to}: ${message}`);
        await new Promise(r => setTimeout(r, 1000));
        res.json({ success: true, mock: true });
        return;
      }

      const twilio = require('twilio');
      const client = twilio(sid, token);
      
      const isWhatsApp = channel === 'WhatsApp';
      const fromStr = isWhatsApp ? `whatsapp:${phone}` : phone;
      const toStr = isWhatsApp ? `whatsapp:+923000000000` : `+923000000000`; 

      console.log(`[TWILIO] Sending ${channel} to ${toStr}...`);
      await client.messages.create({
        body: message,
        from: fromStr,
        to: toStr
      });
      
      res.json({ success: true, mock: false });
    } catch (error) {
      console.error('[TWILIO ERROR]', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Serve static files in production
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      console.log(`Internal Express server running on port ${port}`);
      resolve(`http://127.0.0.1:${port}`);
    });
  });
}

module.exports = { startServer };

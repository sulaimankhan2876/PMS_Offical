import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function localDbPlugin() {
  const dbPath = path.resolve(__dirname, 'database.json');
  return {
    name: 'local-db',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/load' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            res.end(data);
          } else {
            res.end(JSON.stringify({ error: "not_found" }));
          }
          return;
        }

        if (req.url === '/api/save' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            fs.writeFileSync(dbPath, body, 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          });
          return;
        }

        if (req.url === '/api/notify' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const { to, message, channel } = JSON.parse(body);
              
              // Load .env variables dynamically or at top of file
              const sid = process.env.TWILIO_ACCOUNT_SID;
              const token = process.env.TWILIO_AUTH_TOKEN;
              const phone = process.env.TWILIO_PHONE_NUMBER;
              
              if (!sid || !token || !phone) {
                console.log(`[MOCK TWILIO] Sending ${channel} to ${to}: ${message}`);
                // Mock network delay
                await new Promise(r => setTimeout(r, 1000));
                res.end(JSON.stringify({ success: true, mock: true }));
                return;
              }

              const twilio = (await import('twilio')).default;
              const client = twilio(sid, token);
              
              const isWhatsApp = channel === 'WhatsApp';
              const fromStr = isWhatsApp ? `whatsapp:${phone}` : phone;
              // Replace 'to' string with a valid E.164 number format if testing
              const toStr = isWhatsApp ? `whatsapp:+923000000000` : `+923000000000`; 

              console.log(`[TWILIO] Sending ${channel} to ${toStr}...`);
              await client.messages.create({
                body: message,
                from: fromStr,
                to: toStr
              });
              
              res.end(JSON.stringify({ success: true, mock: false }));
            } catch (error) {
              console.error('[TWILIO ERROR]', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
          return;
        }

        next();
      });
    }
  }
}

export default defineConfig({
  plugins: [react(), localDbPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    exclude: ['**/node_modules/**', '**/e2e/**'],
  }
})

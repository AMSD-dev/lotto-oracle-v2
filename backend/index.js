import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- Google Auth ----
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});

const androidPublisher = google.androidpublisher({
  version: 'v3',
  auth,
});

// ---- Verify subscription ----
app.post('/verify-subscription', async (req, res) => {
  try {
    const { packageName, productId, purchaseToken } = req.body;

    if (!packageName || !productId || !purchaseToken) {
      return res.status(400).json({ active: false });
    }

    const response = await androidPublisher.purchases.subscriptions.get({
      packageName,
      subscriptionId: productId,
      token: purchaseToken,
    });

    const expiryTime = Number(response.data.expiryTimeMillis);
    const active = expiryTime > Date.now();

    res.json({
      active,
      expiryDate: new Date(expiryTime).toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ active: false });
  }
});

app.get('/health', (_, res) => {
  res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

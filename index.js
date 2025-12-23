const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Simple credentials check
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.error("ERROR: FIREBASE_PRIVATE_KEY missing in Environment Variables!");
}

const serviceAccount = {
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : "",
  "client_email": process.env.FIREBASE_CLIENT_EMAIL
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin Initialized ✅");
} catch (e) {
  console.error("Initialization Error:", e.message);
}

app.get('/', (req, res) => res.send('Server is Up!'));

app.post('/send-push', async (req, res) => {
  const { toToken, title, body } = req.body;
  const message = {
    notification: { title, body },
    token: toToken
  };
  try {
    await admin.messaging().send(message);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server live on port ${PORT}`));


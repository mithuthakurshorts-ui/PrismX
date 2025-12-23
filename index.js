const admin = require("firebase-admin");
const express = require("express");
const app = express();
app.use(express.json());

// --- YE LOGIC KEY KE HAR ERROR KO KHATAM KAR DEGA ---
const getFormattedKey = (key) => {
  if (!key) return undefined;
  // 1. Double quotes hatayega
  let k = key.replace(/^"|"$/g, '');
  // 2. Escaped newlines (\\n) ko asli lines me badlega
  k = k.replace(/\\n/g, '\n');
  // 3. Agar koi extra space ya galat character hai toh use clean karega
  if (!k.includes("-----BEGIN PRIVATE KEY-----")) {
    k = `-----BEGIN PRIVATE KEY-----\n${k}\n-----END PRIVATE KEY-----`;
  }
  return k;
};

const privateKey = getFormattedKey(process.env.FIREBASE_PRIVATE_KEY);

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
  console.log("✅ SYSTEM READY: Firebase Connected!");
} catch (error) {
  console.log("❌ PEM ERROR FIX NEEDED:", error.message);
}

app.post("/send-push", async (req, res) => {
  const { toToken, title, body } = req.body;
  try {
    await admin.messaging().send({ notification: { title, body }, token: toToken });
    res.status(200).send({ success: true });
  } catch (e) { res.status(500).send({ error: e.message }); }
});

app.get("/", (req, res) => res.send("Server is Active"));
app.listen(process.env.PORT || 10000);


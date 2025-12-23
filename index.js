const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Aapki JSON details maine yahan set kar di hain
const serviceAccount = {
  "project_id": "prismdb-477309",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDL82sdkdTGlaBk\ntUbIgbbBYFJ88xyNoxrqt0aXRjAzr7Y4bkSRpvcxBFtf7tRtE7NO0YmUXSO21g+E\neMTtwS05FFUSNkUg1bY0VDm3StfJup1ax1mDr0ej5HsqZvQkCMgrh5n4SwVyx3yh\nYYJs82DYs1WgAVrp3tFBEln5sS2SfaFjwy24/KxYqz/v6PyoJf+sBwebNyXufsn9\nH09bjoS1ZPnEkpIEmWm9ifYJwonK94eZExtLSyzy8d/JL7aFFqFsaWFGrNseZrUQ\nERB5iWC6LopnhmSvAFE1jm9KcMkW6iIjmrM/Y3pZT2H4yWs5wyQRSNvwrLFAa9Jq\n0WtCae9VAgMBAAECggEAAjI22Rbetnm3fmkIfSkDJNmcMzxhNlrHP3HrjmzF5rGr\n406ge1lN5UEo0wCP2ONLlBvm1RAK33pB7r7/LGn2RGgmQYthSWkF5t2rZ+NkLZlO\nW1SX+zCNHFKd6HRGlMhMbSNjayrtRtenNgYdkmaKa10hujPgFBVN2k+Yhx4Ju9bG\nyXqnNuxwHdqsSTUYCrb+7J65alPsuhkwTP6sUCU2Opebtsi3suAxI+lWSb1NPZvr\nxKW1lw61zJ401WffZpTu5Pbu/EzXRUPpY63g0uiFUN7WthcprF+varMDklwbcb9d\nEPiICPxJSeyBqFkCdClCIQmHxYVNdyVoYhsN7ZkiQQKBgQDngcCw8lGyik/PlzIe\nlTK9PaXknofrmLIU9ghjnUF5CDyo+j8XNYymZmQYbvIEVhEimoQ3msPKVx/yAvZX\n6Jhl2Ta794Yo+GsT3RyEUrClb/ityOAJEk5c9qtr/A56WaaD2S7OVjJhS1o+E0z/\n8IHFKaPgxC50wFPGx1CJVaL5FQKBgQDhh1NNz+/ku/2VAxKjJVBF4GeaoPswd2Kn\nSq/72EMZUWOp8bfpiBRiJlLukaOJzQZHgPYbXeiykYdiEmC/42HBsUD1tQzZNI0B\rzfe9nduXe7QYsZEbok4Q3JFHk2aPMkbS9QtPfXo+HbYnG/Rvpzz2ZiAm+g5c7cp\ndETCdUAtQQKBgGoCVnQwYgy5nRZYC9FJTLSvWBm6Jk9R2qoSh4Dl76c2iGBwRxef\no8pGtKsjkps9thb8XnL/4Yv0HWK6zIcwsShiMNgd3kdAiffMllRZcR4widU6WKyO\nv2d+ZLzL7O1FxCQ3/WDqw6Md2DL4r5e7UBEyoiI4c3Vu5G3vswdQOZKJAoGBANZt\nWxgFl1oMH0tZk5PIe20ksnzDiHCJYiQbD/3Mnedpie/f4fPJLVAwjfNER5BSfiDo\nDZbxj7iQQ39MZ+6qG50UkeXL0T6HB3ZNiTqVbfJinxhEgaw4yIDVJ8VtzWzTVIZ+\nb2rgmXl7G0xSWMK8j/ANuEC3e3F8gu6IHIQjBPTBAoGAICZpT3gFfBUIzoAtQL2h\nbkn2v/yFbdtM/e5qJPLFxBevKLsqVHvru22F/X7zjp80bS1pkzF/wKJyecskP9ua\nDMQukFEn4bbdYjSwYf56h9MCr4ZmRkBBT3iXTzveNzojlzaMctBDsRf3oeL9W4Vu\nL7A/CzeqTdQkS5vNryEAH6E=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@prismdb-477309.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.get('/', (req, res) => res.send('PrismX Notification Server is Running!'));

app.post('/send-push', async (req, res) => {
  const { toToken, title, body, senderId } = req.body;
  
  if(!toToken) return res.status(400).send({ error: 'No Token' });

  const message = {
    notification: { title, body },
    data: { senderId: String(senderId) },
    token: toToken
  };

  try {
    await admin.messaging().send(message);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));

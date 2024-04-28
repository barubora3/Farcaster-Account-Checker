const { cert } = require("firebase-admin/app");
const admin = require("firebase-admin");
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // cert()の中に直接JSON形式で代入
      projectId: process.env.FSA_PROJECT_ID,
      privateKey: process.env.FSA_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      clientEmail: process.env.FSA_CLIENT_EMAIL,
    }),
    databaseURL:
      "https://farcaster-account-checker-default-rtdb.firebaseio.com",
  });
}

const { getDatabase } = require("firebase-admin/database");
export const db = getDatabase();

export const firebase = admin;

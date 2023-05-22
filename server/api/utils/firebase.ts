var serviceAccount = require("../../serviceAccountKey.json");
var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendMessage = async (token, message) => {
    var output = {};
  await admin
    .messaging()
    .sendToDevice(token, {
      notification: { ...message },
      data: { type: "reminder" },
    })
    .then(function (response) {
      
      output = response;
      return response;
      // output.success = "Successfully sent messages";
      // fcmSuccess += response.successCount;
      // fcmError += response.failureCount;
    })
    .catch(function (error) {
      
      return error
      // output.error = "firebase send error";
    });
};

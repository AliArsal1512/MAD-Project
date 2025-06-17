export async function sendPushNotification(
    expoPushToken: string,
    title: string,
    message: string
  ) {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: "default",
        title: title,
        body: message,
      }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to send push notification:", error);
    } else {
      console.log("Push notification sent successfully.");
    }
  }
  
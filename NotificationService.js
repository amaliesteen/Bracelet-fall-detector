import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },
});

// Funktion til at vise push notifikationer
export const showLocalNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: "alarm-channel",
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
    importance: 'high',
    vibrate: true,
    priority: "high",
    visibility: "public",
    fullScreenIntent: true,
  });
};
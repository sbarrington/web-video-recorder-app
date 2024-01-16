// Function to generate a UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Function to set a unique identifier cookie
function setUniqueIdentifierCookie() {
  const cookieName = "userId";
  let userId = getCookie(cookieName);

  if (!userId) {
    userId = generateUUID();
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (60 * 24 * 60 * 60 * 1000));
    document.cookie = `${cookieName}=${userId}; expires=${expirationDate.toUTCString()}; path=/`;
  }
}

// Function to get a cookie by name
function getCookie(cookieName) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === cookieName) {
      return cookie[1];
    }
  }
  return null;
}

function getMicrophoneDetails() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const microphone = devices.find(device => device.kind === 'audioinput' && device.label);
        if (microphone) {
          resolve(microphone.label);
        } else {
          resolve("Microphone not found or not accessible");
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

export { generateUUID, setUniqueIdentifierCookie, getCookie, getMicrophoneDetails };

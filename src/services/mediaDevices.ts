export const requestPermissions = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    mediaStream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    console.warn('Devices permissions denied', error);
  }
};

const isAuthorized = (device: MediaDeviceInfo) =>
  device.deviceId && device.label;

const getAuthorizedCameras = (devices: MediaDeviceInfo[]) => {
  return devices.filter(
    (device) => device.kind === 'videoinput' && isAuthorized(device),
  );
};

const getAuthorizedMicrophones = (devices: MediaDeviceInfo[]) => {
  return devices.filter(
    (device) => device.kind === 'audioinput' && isAuthorized(device),
  );
};

export const getAuthorizedDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    cameras: getAuthorizedCameras(devices),
    microphones: getAuthorizedMicrophones(devices),
  };
};

export const getDeviceId = (
  devices: MediaDeviceInfo[],
  preferredDeviceId: string,
) => {
  if (devices.some((device) => device.deviceId === preferredDeviceId)) {
    return preferredDeviceId;
  } else if (devices.some((device) => device.deviceId === 'default')) {
    return 'default';
  } else if (devices.length) {
    return devices[0].deviceId;
  } else {
    return '';
  }
};

const resolutions = [
  { width: 1280, height: 720 }, // 720p
  { width: 1024, height: 576 }, // Standard HD
  { width: 640, height: 480 },  // 480p
  { width: 320, height: 240 }   // Lowest fallback
];

export const getCameraStream = (deviceId: string): Promise<MediaStream> => {
  // Try to get the stream for each resolution, in order
  const tryGetStream = (index = 0): Promise<MediaStream> => {
    if (index >= resolutions.length) {
      // If all resolutions fail, throw or handle it as needed
      return Promise.reject(new Error('Could not obtain video stream with the available resolutions.'));
    }

    const resolution = resolutions[index];
    return navigator.mediaDevices.getUserMedia({
      video: {
        deviceId,
        width: { min: resolution.width },
        height: { min: resolution.height }
      },
      audio: false
    }).then(stream => {
      console.log(`Successfully obtained video stream at resolution: ${resolution.width}x${resolution.height}`);
      return stream; // Success: return the stream
    }).catch(error => {
      console.error(`Failed at resolution: ${resolution.width}x${resolution.height}`, error);
      return tryGetStream(index + 1); // Try next lower resolution
    });
  };

  return tryGetStream(); // Start with the highest resolution
};

export const getMicrophoneStream = (deviceId: string): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({
    audio: { deviceId },
    video: false,
  });
};

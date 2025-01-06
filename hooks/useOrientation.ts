import * as ScreenOrientation from "expo-screen-orientation";
import { useWindowDimensions } from "react-native";
import { useEffect } from "react";

export const useDynamicOrientation = () => {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const lockOrientation = async () => {
      if (width > 600) {
        await ScreenOrientation.unlockAsync(); // Allow both portrait and landscape
      } else {
        // Otherwise, it's (phone)
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Lock to portrait
      }
    };
    lockOrientation();
  }, [width, height]); // Add width and height as dependencies so it updates on dimension change
};

export const useLockPortraitOrientation = () => {
  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }; 
  useEffect(() => {
    lockOrientation();
  }, []);
};
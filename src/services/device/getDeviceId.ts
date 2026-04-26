import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'hug-device-id';

export async function getDeviceId(): Promise<string> {
    try {
        // Step 1: Check if stored
        const storedId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
        if (storedId) {
            return storedId;
        }

        // Step 2: Try get real device id (if available)
        let newId: string | null = null;

        // expo-device has a deviceId, but it's not always available on Web
        if (Device.osInternalBuildId) {
            // Combine two device-specific fields to produce stable hash
            newId = `${Device.osBuildId}-${Device.osInternalBuildId}`;
        }

        // Step 3: Fallback to UUID
        if (!newId) {
            newId = uuidv4();
        }

        // Step 4: Persist
        await SecureStore.setItemAsync(DEVICE_ID_KEY, newId);

        return newId;
    } catch (err) {
        console.warn('Error generating device ID:', err);
        // Emergency fallback
        return uuidv4();
    }
}

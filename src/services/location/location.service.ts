/**
 * GeoLocation Service - Handles device location permissions and retrieval
 * Similar to Angular Injectable service but manually instantiated
 */
import * as Location from 'expo-location';

// Interface for location data (similar to Angular interface/type)
export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

export class GeoLocationService {

    /**
     * Check if location permission is already granted
     * @returns Promise<boolean> - true if granted, false otherwise
     */
    async checkPermission(): Promise<boolean> {
        const { status } = await Location.getForegroundPermissionsAsync();
        return status === 'granted';
    }

    /**
     * Request location permission from user
     * Shows native dialog to ask for permission
     * @returns Promise<boolean> - true if user granted, false if denied
     */
    async requestPermission(): Promise<boolean> {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            console.log('[GeoLocation] Permission denied by user');
            return false;
        }
        return true;
    }

    /**
     * Get user's current geographic location
     * Automatically checks and requests permissions if needed
     * @returns Promise<LocationData | null> - location data or null if failed
     */
    async getCurrentLocation(): Promise<LocationData | null> {
        try {
            // First check if we have permission
            const hasPermission = await this.checkPermission();

            if (!hasPermission) {
                const granted = await this.requestPermission();
                if (!granted) return null;
            }

            // Get current position with high accuracy
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy
            };
        } catch (error) {
            console.error('[GeoLocation] Error getting location:', error);
            return null;
        }
    }

    /**
     * Check if location services are enabled on device
     * @returns Promise<boolean> - true if location is ON, false if OFF
     */
    async isLocationEnabled(): Promise<boolean> {
        const providerStatus = await Location.getProviderStatusAsync();
        return providerStatus.locationServicesEnabled;
    }
}

// Create a singleton instance (similar to providedIn: 'root' in Angular)
export const geoLocationService = new GeoLocationService();
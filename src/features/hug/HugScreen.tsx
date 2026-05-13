/**
 * Hug Screen - Main feed screen that displays ads based on user location
 * Similar to Angular component but uses React hooks instead of RxJS
 */
import { geoLocationService, LocationData } from '@/src/services/location/location.service';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function HugScreen() {
    // State management (similar to signals or BehaviorSubject in Angular)
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [locationEnabled, setLocationEnabled] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect = combination of ngOnInit + ngOnChanges
    // Empty array [] means run only once when component mounts
    useEffect(() => {
        checkLocationStatusAndLoad();
    }, []);

    /**
     * Main function to check location status and load ads
     * Async/await similar to firstValueFrom() in Angular
     */
    const checkLocationStatusAndLoad = async () => {
        try {
            setLoading(true);

            // Check if location services are turned ON
            const isEnabled = await geoLocationService.isLocationEnabled();
            setLocationEnabled(isEnabled);

            if (!isEnabled) {
                // Show warning message (similar to MatDialog or Toast in Angular)
                Alert.alert(
                    'Location is Off',
                    'Please turn on location services to see ads near you',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('Location off acknowledged')
                        }
                    ]
                );
                setError('Location services are disabled');
                setLoading(false);
                return;
            }

            // Get current location
            const userLocation = await geoLocationService.getCurrentLocation();

            if (userLocation) {
                setLocation(userLocation);
                setError(null);
                console.log('[HugScreen] Location obtained:', userLocation);
                // TODO: Fetch ads with this location
            } else {
                setError('Could not get your location. Please try again.');
            }
        } catch (err) {
            console.error('[HugScreen] Error:', err);
            setError('An error occurred while getting your location');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Retry loading location if user enables it later
     * Similar to calling a service method again in Angular
     */
    const retryLoadLocation = () => {
        setLoading(true);
        setError(null);
        checkLocationStatusAndLoad();
    };

    // Loading state - similar to *ngIf loading
    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
        );
    }

    // Error state - similar to *ngIf error
    if (error) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Text
                    style={styles.retryText}
                    onPress={retryLoadLocation}
                >
                    Tap to retry
                </Text>
            </View>
        );
    }

    // Success state - show location info (will be replaced with ads list)
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hug Feed</Text>

            {location && (
                <View style={styles.locationCard}>
                    <Text style={styles.label}>Your Location:</Text>
                    <Text style={styles.coordinate}>Latitude: {location.latitude}</Text>
                    <Text style={styles.coordinate}>Longitude: {location.longitude}</Text>
                    {location.accuracy && (
                        <Text style={styles.accuracy}>Accuracy: ±{location.accuracy}m</Text>
                    )}
                </View>
            )}

            <Text style={styles.infoText}>
                {locationEnabled
                    ? '📍 Location enabled - showing nearby ads'
                    : '📍 Location disabled - showing general ads'}
            </Text>
        </View>
    );
}

// Styles (similar to component styles in Angular but using StyleSheet)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    locationCard: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10
    },
    coordinate: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333'
    },
    accuracy: {
        fontSize: 12,
        marginTop: 5,
        color: '#666'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666'
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginBottom: 15
    },
    retryText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
        fontWeight: '600'
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 20
    }
});
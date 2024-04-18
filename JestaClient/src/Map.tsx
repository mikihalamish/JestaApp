import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, LatLng } from 'react-native-maps';

const Map: React.FC = () => {

    const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
    const [markers, setMarkers] = useState<User[]>([]);

    interface User {
        firstName: string,
        lastName: string,
        email: string,
        profilePicture: string,
        coordinates: LatLng
    }

    const petahTikvaCoordinates: LatLng = {
        latitude: 32.0875,
        longitude: 34.8878,
    };

    const users_coordinates: Array<User> = [
        {
            firstName: 'Dan',
            lastName: 'Feithlicher',
            email: 'd.feithlicher@gmail.com',
            profilePicture: '../../assets/ProfilePictures/dan_feithlicher.jpg',
            coordinates: {
                latitude: 32.0875,
                longitude: 34.8878,
            }
        },
        {
            firstName: 'Miki',
            lastName: 'Halamish',
            email: 'miki.halamish@gmail.com',
            profilePicture: '../../assets/ProfilePictures/dan_feithlicher.jpg',
            coordinates: {
                latitude: 32.0178,
                longitude: 34.8691,
            }
        }
    ]

    useEffect(() => {
        setMarkers(users_coordinates)
        setCurrentLocation(petahTikvaCoordinates)
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Update coordinates for each user
            setMarkers(prevUsersCoordinates =>
                prevUsersCoordinates.map(user => ({
                    ...user,
                    coordinates: {
                        latitude: user.coordinates.latitude + getRandomNumber(),
                        longitude: user.coordinates.longitude + getRandomNumber()
                    },
                }))
            );
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const getRandomNumber = () => (Math.random() - 0.5) * 0.02;
    
    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    ...petahTikvaCoordinates,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }}
            >
                {markers.map((marker, index) => (
                    <Marker key={index} coordinate={marker.coordinates} title={marker.firstName + " " + marker.lastName}>
                        <Image
                            source={require('../assets/ProfilePictures/dan_feithlicher.jpg')}
                            style={{ width: 40, height: 40, borderRadius: 50 }}
                        />
                    </Marker>
                ))}
            </MapView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Map;
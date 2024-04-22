import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, LatLng } from 'react-native-maps';
import Radar from './Radar';
import { userInteface } from '../constants/Interfaces';
import Database from './Database';
import { UserStatusDictionary } from '../constants/userStatusDictionary';

interface ChildProps {
    isSearching: boolean,
    activeUsers: userInteface[]
}

const Map: React.FC<ChildProps> = ({ isSearching, activeUsers }) => {

    const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
    const [markers, setMarkers] = useState<UserLocation[]>([]);

    interface UserLocation {
        user: userInteface,
        coordinates: LatLng
    }

    const petahTikvaCoordinates: LatLng = {
        latitude: 32.0875,
        longitude: 34.8878,
    };

    const users_coordinates: Array<UserLocation> = [
        {
            user: {
                firstName: 'Dan',
                lastName: 'Feithlicher',
                email: 'd.feithlicher@gmail.com',
                password: '',
                phoneNumber: '',
                status: UserStatusDictionary.ACTIVE,
                lastSeen: 0
            },
            coordinates: {
                latitude: 32.0875,
                longitude: 34.8878,
            }
        },
        {
            user:
            {
                firstName: 'Miki',
                lastName: 'Halamish',
                email: 'miki.halamish@gmail.com',
                password: '',
                phoneNumber: '',
                status: UserStatusDictionary.ACTIVE,
                lastSeen: 0
            },
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
            {isSearching ? <Radar></Radar> : false}
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
                    <Marker key={index} coordinate={marker.coordinates} title={marker.user.firstName + " " + marker.user.lastName}>
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
    radar: {
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    }
});

export default Map;
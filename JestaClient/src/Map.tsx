import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, LatLng } from 'react-native-maps';
import Radar from './Radar';
import { userInteface } from '../constants/Interfaces';
import Database from './Database';
import { UserStatusDictionary } from '../constants/userStatusDictionary';
import { useAuth } from './AuthContext';

interface ChildProps {
    isSearching: boolean,
    activeUsers: userInteface[]
}

const Map: React.FC<ChildProps> = ({ isSearching, activeUsers }) => {

    const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
    const [markers, setMarkers] = useState<UserLocation[] | null>([]);

    const { isAuthenticated, loggedUser } = useAuth();

    interface UserLocation {
        user: userInteface,
        coordinates: LatLng
    }

    const petahTikvaCoordinates: LatLng = {
        latitude: 32.0875,
        longitude: 34.8878,
    };

    const generateCoordinates = () => {
        const tempCoord: UserLocation[] = []
        if (activeUsers && activeUsers.length) {
            activeUsers.map((user) => {
                tempCoord.push({
                    user: user,
                    coordinates: {
                        latitude: 32.0875 + getRandomNumber(),
                        longitude: 34.8878 + getRandomNumber()
                    }
                })
            })
            setMarkers([...tempCoord])
            console.log(markers)
        } else {
            console.info("No Active Users")
            setMarkers(null)
        }
    }

    useEffect(() => {
        setCurrentLocation(petahTikvaCoordinates)
    }, [])

    useEffect(() => {
        generateCoordinates()
    }, [activeUsers])

    const getRandomNumber = () => (Math.random() - 0.05) * 0.02;

    return (
        <View style={styles.container}>
            {isSearching && isAuthenticated ? <Radar></Radar> : false}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    ...petahTikvaCoordinates,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }}
            >
                <Marker key={-1} coordinate={currentLocation!} title={"Me"}>
                    <Image
                        source={require('../assets/self-marker.png')}
                        style={{ width: 50, height: 50, borderRadius: 50, resizeMode: 'contain' }}
                    />
                </Marker>
                {markers?.filter((marker) => marker.user.email != loggedUser?.email).map((marker, index) => (
                    <Marker key={index} coordinate={marker.coordinates} title={marker.user.firstName + " " + marker.user.lastName}>
                        <Image
                            source={require('../assets/marker.png')}
                            style={{ width: 100, height: 100, borderRadius: 50, resizeMode: 'contain' }}
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
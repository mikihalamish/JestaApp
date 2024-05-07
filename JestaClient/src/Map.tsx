import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, LatLng } from 'react-native-maps';
import Radar from './Radar';
import { userInteface } from '../constants/Interfaces';
import { useAuth } from './AuthContext';
import { colors } from '../constants/colors';

interface ChildProps {
    isSearching: boolean,
    activeUsers: userInteface[],
    providerEmail: string
}

const Map: React.FC<ChildProps> = ({ isSearching, activeUsers, providerEmail }) => {

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

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                {
                    iterations: -1
                }
            ).start();
        };
        startAnimation();
    }, [fadeAnim]);

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
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                            resizeMode: 'contain'
                        }}
                    />
                </Marker>
                {markers?.filter((marker) => marker.user.email != loggedUser?.email).map((marker, index) => (
                    <Marker key={index} coordinate={marker.coordinates} title={marker.user.firstName + " " + marker.user.lastName}>
                        <Animated.View style={marker.user.email == providerEmail ? [
                            styles.shadowBox, {
                                shadowOpacity: fadeAnim,
                            }] : false}>
                            <Image
                                source={marker.user.email == providerEmail ? require('../assets/active-marker-icon.png') : require('../assets/marker.png')}
                                style={{ width: 100, height: 100, borderRadius: 50, resizeMode: 'contain' }}
                            />
                        </Animated.View>
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
    },
    shadowBox: {
        shadowRadius: 8,
        shadowOpacity: 0.1,
        shadowColor: colors.third,
        shadowOffset: { width: 6, height: 6},
        backgroundColor: 'transparent'
    }
});

export default Map;
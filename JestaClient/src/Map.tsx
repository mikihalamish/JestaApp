import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated, Platform } from 'react-native';
import { colors } from '../constants/colors';
import { UserLocationInterface, UserInterface } from '../constants/Interfaces';
import { useAuth } from './AuthContext';
import Radar from './Radar';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Marker, LatLng } from 'react-native-maps';

interface ChildProps {
    isSearching: boolean,
    activeUsers: UserInterface[],
    providerEmail: string
}

const PETAH_TIKVA_COORDINATES: LatLng = {
    latitude: 32.0875,
    longitude: 34.8878,
}

const Map: React.FC<ChildProps> = ({ isSearching, activeUsers, providerEmail }) => {

    const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null)
    const [markers, setMarkers] = useState<UserLocationInterface[] | null>([])

    const { isAuthenticated, loggedUser } = useAuth()

    const fadeAnimation = useRef(new Animated.Value(0)).current

    useEffect(() => {
        setCurrentLocation(PETAH_TIKVA_COORDINATES)
    }, [])

    useEffect(() => {
        generateCoordinates()
    }, [activeUsers])

    const getRandomNumber = () => (Math.random() - 0.05) * 0.02

    const generateCoordinates = () => {
        const tempCoord: UserLocationInterface[] = []
        if (activeUsers && activeUsers.length) {
            activeUsers.map((user) => {
                tempCoord.push({
                    user: user,
                    coordinates: {
                        latitude: PETAH_TIKVA_COORDINATES.latitude + getRandomNumber(),
                        longitude: PETAH_TIKVA_COORDINATES.longitude + getRandomNumber()
                    }
                })
            })
            setMarkers([...tempCoord])
        } else {
            setMarkers(null)
        }
    }

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnimation, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                {
                    iterations: -1
                }
            ).start()
        }
        startAnimation()
    }, [fadeAnimation])

    return (
        <View style={styles.container}>
            {isSearching && isAuthenticated ? <Radar></Radar> : false}
            <MapView
                provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                style={styles.map}
                initialRegion={{
                    ...PETAH_TIKVA_COORDINATES,
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
                                shadowOpacity: fadeAnimation,
                            }] : false}>
                            <Image
                                source={marker.user.email == providerEmail ?
                                    require('../assets/active-marker-icon.png') :
                                    require('../assets/marker.png')}
                                style={{ width: 100, height: 100, borderRadius: 50, resizeMode: 'contain' }}
                            />
                        </Animated.View>
                    </Marker>
                ))}
            </MapView>
        </View>
    )
}

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
        shadowOffset: { width: 6, height: 6 },
        backgroundColor: 'transparent'
    }
})

export default Map
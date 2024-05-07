import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const Radar: React.FC = () => {

    const spinValue = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const spin = () => {
            spinValue.setValue(0)
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            ).start(() => spin())
        };

        spin()
    }, [spinValue])

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.radar}>
            <Animated.Image
                style={{
                    width: 300,
                    height: 300,
                    transform: [{ rotate: spin }]
                }}
                source={require('../assets/radar.png')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    radar: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute', 
        zIndex: 1, 
        width: '100%' 
    }
})

export default Radar;
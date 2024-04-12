import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';

interface ChildProps {
    isOn: Boolean,
    setIsOn: (isOn: Boolean) => void
}

const Toggle: React.FC<ChildProps> = ({ isOn, setIsOn }) => {

    return (
        <TouchableOpacity style={isOn ? styles.toggleOn : styles.toggleOff} onPress={() => setIsOn(!isOn)}>
            <View style={isOn ? styles.activeStateOn : styles.activeStateOff}></View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    toggleOn: {
        width: 90,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 50,
        justifyContent: 'center',
    },
    toggleOff: {
        width: 90,
        height: 50,
        backgroundColor: colors.font,
        borderRadius: 50,
        justifyContent: 'center',
    },
    activeStateOn: {
        width: 40,
        height: 40,
        right: 5,
        alignSelf: 'flex-end',
        borderRadius: 50,
        backgroundColor: colors.background
    },
    activeStateOff: {
        width: 40,
        height: 40,
        left: 5,
        borderRadius: 50,
        backgroundColor: colors.primary,
        opacity: 0.4
    }
})

export default Toggle;
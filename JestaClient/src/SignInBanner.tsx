import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen:string, toOpen:Boolean) => void,
}

const SignInBanner: React.FC<ChildProps> = ({openPage}) => {

    return (
        <TouchableOpacity style={styles.banner} onPress={() => openPage(PagesDictionary.SignInPage, true)}>
            <View style={styles.bannerContent}>
                <Image style={styles.bannerIcon} source={require('../assets/sign-in.png')}></Image>
                <Text style={styles.bannerText}>Sign In</Text>
                <Image style={styles.bannerIcon} source={require('../assets/arrow.png')}></Image>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        width: windowWidth * 0.9,
        height: 70,
        borderRadius: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    bannerContent: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bannerText: {
        color: 'white',
        fontSize: 24,
        width: '60%',
    },
    bannerIcon: {
      resizeMode: 'contain'
    }
})

export default SignInBanner;
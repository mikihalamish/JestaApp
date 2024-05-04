import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: boolean) => void,
}

interface service {
    name: string,
    icon: any,
    page: PagesDictionary
}

const serviceTypes: service[] = [
    {
        name: "Fix",
        icon: require("../assets/fixing-icon.png"),
        page: PagesDictionary.FixingJesta
    },
    {
        name: "Household",
        icon: require("../assets/householding-icon.png"),
        page: PagesDictionary.FixingJesta
    },
    {
        name: "Delivery",
        icon: require("../assets/delivery-icon.png"),
        page: PagesDictionary.FixingJesta
    },
    {
        name: "Transfer",
        icon: require("../assets/transferring-icon.png"),
        page: PagesDictionary.FixingJesta
    },
    {
        name: "Other",
        icon: require("../assets/fixing-icon.png"),
        page: PagesDictionary.FixingJesta
    }
]

const JestaSelector: React.FC<ChildProps> = ({ openPage }) => {

    return (
        <ScrollView horizontal style={styles.horizontalScrollContainer}>
            {serviceTypes.map((service, index) => {
                return <TouchableOpacity onPress={() => openPage(service.page, true)}>
                    <LinearGradient start={{ x: -0.5, y: 0 }} end={{ x: 1, y: 1 }} colors={[colors.primary, colors.primary_variant]} style={styles.serviceButton} key={index} >
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Image style={styles.serviceIcon} source={service.icon}></Image>
                    </LinearGradient>
                </TouchableOpacity>
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    horizontalScrollContainer: {
        height: windowWidth * 0.2,
        position: 'absolute',
        bottom: 40,
        width: '100%',
        flex: 1,
    },
    serviceButton: {
        height: windowWidth * 0.2,
        width: windowWidth * 0.2,
        backgroundColor: colors.primary,
        marginLeft: 25,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    serviceIcon: {
        position: 'absolute',
        bottom: 8,
        right: 8
    },
    serviceName: {
        position: 'absolute',
        top: 6,
        left: 6,
        fontWeight: 'bold',
        color: colors.background,
        fontSize: 12
    }


})

export default JestaSelector
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
        name: "Fixing",
        icon: require("../assets/fixing-icon.png"),
        page: PagesDictionary.FixingJesta
    },
    {
        name: "Householding",
        icon: require("../assets/householding-icon.png"),
        page: PagesDictionary.FixingJesta
    },
    {
        name: "Delivery",
        icon: require("../assets/delivery-icon.png"),
        page: PagesDictionary.FixingJesta
    },
    {
        name: "Transferring",
        icon: require("../assets/transferring-icon.png"),
        page: PagesDictionary.FixingJesta
    },
    {
        name: "Delivery",
        icon: require("../assets/fixing-icon.png"),
        page: PagesDictionary.FixingJesta
    }
]

const JestaSelector: React.FC<ChildProps> = ({ openPage }) => {

    return (
        <ScrollView horizontal style={styles.horizontalScrollContainer}>
            {serviceTypes.map((service, index) => {
                return <TouchableOpacity style={styles.serviceButton} key={index} onPress={() => openPage(service.page, true)}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Image style={styles.serviceIcon} source={service.icon}></Image>
                </TouchableOpacity>
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    horizontalScrollContainer: {
        height: windowWidth * 0.25,
        position: 'absolute',
        bottom: 40,
        width: '100%',
        flex: 1,
    },
    serviceButton: {
        height: windowWidth * 0.25,
        width: windowWidth * 0.25,
        backgroundColor: colors.primary,
        marginLeft: 20,
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
        color: 'white',
        fontSize: 12
    }


})

export default JestaSelector
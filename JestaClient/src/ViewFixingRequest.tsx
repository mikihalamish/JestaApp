import React, { useState, useEffect } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PagesDictionary } from '../constants/PagesDictionary';
import { colors } from '../constants/colors';
import { StatusEnum } from '../constants/StatusEnum';
import { requestInteface, userInteface } from '../constants/Interfaces';
import Database from './Database';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    close: () => void,
    request: requestInteface
}

const ViewFixingRequest: React.FC<ChildProps> = ({ close, request }) => {

    const [publisherDetails, setPublisherDetails] = useState<userInteface | null>()

    const getPublisher = async () => {
        const publisher = await Database.getUser(request.email!)
        setPublisherDetails(publisher)
    }

    useEffect(() => {
        getPublisher()
    }, [])

    return (
        <View style={styles.outerContainer}>
            <TouchableOpacity style={styles.slider} onPress={close}><View style={styles.sliderButton}></View></TouchableOpacity>
            <View style={styles.pageContainer}>
                <View style={styles.backContainer} onTouchStart={close}>
                    <TouchableOpacity style={styles.backButton} >
                        <Image style={styles.backIcon} source={require('../assets/back.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.topContainer}>
                    <View style={styles.avatarContainer}>
                        <Image style={styles.avatar} source={require('../assets/avatar.png')}></Image>
                        <Text style={styles.publisherName}>{publisherDetails?.firstName + ' ' + publisherDetails?.lastName}</Text>
                    </View>
                </View>
                <View style={styles.timeContainer}>
                    <Image style={styles.avatar} source={require('../assets/schedule.png')}></Image>
                    <Text style={styles.scheduleText}>ASAP</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Image style={styles.avatar} source={require('../assets/budget.png')}></Image>
                    <Text style={styles.scheduleText}>{request.details?.budget}$</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{request.details?.description}</Text>
                </View>
                <ScrollView horizontal style={styles.horizontalScrollContainer}>
                    {request.details?.uploadedPhotos ? request.details?.uploadedPhotos.map((photo, index) => {
                        return <TouchableOpacity style={styles.photoContainer} key={index}>
                            <Image style={styles.photo} source={{ uri: photo.src }}></Image>
                        </TouchableOpacity>
                    }) : false}
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: windowHeight * 0.7,
        width: windowWidth,
        bottom: 0,
        zIndex: 1,
    },
    pageContainer: {
        backgroundColor: colors.background,
        height: '96%',
        width: '100%',
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        flex: 1,
    },
    slider: {
        height: '7%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderButton: {
        height: 4,
        width: 60,
        backgroundColor: '#989898',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
    },
    backContainer: {
        width: '100%',
        height: '10%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    backButton: {
        backgroundColor: colors.secondary_variant,
        borderRadius: 50,
        width: '40%',
        height: '50%',
        marginLeft: '5%',
        justifyContent: 'center',
    },
    backIcon: {
        left: 10
    },
    topContainer: {
        height: '12%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    avatarContainer: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        resizeMode: 'contain',
        height: '90%'
    },
    publisherName: {
        fontSize: 24,
        color: colors.font
    },
    timeContainer: {
        height: '12%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
    },
    scheduleText: {
        fontSize: 24,
        color: colors.font,
        marginLeft: '3%'
    },
    descriptionContainer: {
        height: '12%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
    },
    description: {
        fontSize: 22,
        color: colors.primary,
        width: '100%'
    },
    horizontalScrollContainer: {
        width: '100%',
        height: '5%',
    },
    photoContainer: {
        height: 100,
        width: 100,
        marginLeft: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    photo: {
        resizeMode: 'cover',
        borderRadius: 8,
        borderColor: colors.font,
        borderWidth: 1,
        height: 100,
        width: 100,
    },
})

export default ViewFixingRequest;
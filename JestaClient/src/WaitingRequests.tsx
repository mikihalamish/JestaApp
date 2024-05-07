import React, { useState, useEffect } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PagesDictionary } from '../constants/PagesDictionary';
import { colors } from '../constants/colors';
import { StatusEnum } from '../constants/StatusEnum';
import ViewFixingRequest from './ViewFixingRequest';
import { requestInteface } from '../constants/Interfaces';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
    watingRequests: requestInteface[],
}

const WaitingRequests: React.FC<ChildProps> = ({ openPage, watingRequests }) => {

    const [requestToView, setRequestToView] = useState<requestInteface>()

    const close = () => {
        setRequestToView(undefined)
        openPage(PagesDictionary.WaitingRequests, false)
    }

    return (
        <View style={styles.outerContainer}>
            <TouchableOpacity style={styles.slider} onPress={() => openPage(PagesDictionary.WaitingRequests, false)}><View style={styles.sliderButton}></View></TouchableOpacity>
            <ScrollView style={styles.pageContainer}>
                {watingRequests && watingRequests.length > 0 ?
                    watingRequests.map((request, index) => {
                        return (
                            <TouchableOpacity key={index} style={styles.banner} onPress={() => setRequestToView(request)}>
                                <View key={index} style={styles.bannerContent}>
                                    <Image style={styles.bannerIcon} source={require('../assets/fixing-icon.png')}></Image>
                                    <Text style={styles.bannerTypeText}>{request.details?.type ? request.details.type : request.type}</Text>
                                    <View style={styles.bannerTime}>
                                        <Text style={styles.bannerTimeText}>ASAP</Text>
                                    </View>
                                    <Image style={styles.bannerIcon} source={require('../assets/arrow.png')}></Image>
                                </View>
                            </TouchableOpacity>)
                    })
                    : false}
            </ScrollView>
            {requestToView ?
                <ViewFixingRequest
                    request={requestToView}
                    close={close}>
                </ViewFixingRequest>
                : false}
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: windowHeight * 0.4,
        width: windowWidth,
        bottom: 0,

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
    banner: {
        alignSelf: 'center',
        width: windowWidth * 0.9,
        marginTop: '5%',
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
    bannerType: {
        color: 'white',
        fontSize: 24,
        width: '60%',
    },
    bannerTypeText: {
        color: 'white',
        fontSize: 24,
        width: '40%',
    },
    bannerIcon: {
        resizeMode: 'contain'
    },
    bannerTime: {
        width: '25%',
        height: '80%',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 50
    },
    bannerTimeText: {
        fontSize: 26,
        color: colors.primary,
        justifyContent: 'center',
        alignSelf: 'center'
    }
})

export default WaitingRequests
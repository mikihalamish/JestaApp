import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import { requestInteface } from '../constants/Interfaces';
import { StatusEnum } from '../constants/StatusEnum';
import Database from './Database';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: boolean) => void,
    request: requestInteface
}


const ActiveJestaConsumerBanner: React.FC<ChildProps> = ({ openPage, request }) => {

    const approveJesta = () => {
        Database.updateRequestStatus(request.email!, request.publishTime, StatusEnum.ACTIVE_JESTA)
    }

    const cancelJesta = () => {
        Database.updateRequestStatus(request.email!, request.publishTime, StatusEnum.CANCELED_JESTA)
    }

    const requestStatus = (status: StatusEnum) => {
        if (status == StatusEnum.ACTIVE_JESTA)
            return 'on the way'
        else if (status == StatusEnum.PUBLISHED_BEFORE_APPROVAL) {
            return 'searching'
        }
        else if (status == StatusEnum.PUBLISHED_WITH_PROVIDER_SEGGESTION) {
            return 'found'
        }
        else if (status == StatusEnum.CANCELED_JESTA) {
            return 'canceled'
        }
    }
    return (
        <TouchableOpacity style={styles.banner} onPress={approveJesta}>
            <View style={styles.bannerContent}>
                <Image style={styles.bannerIcon} source={require('../assets/fixing-icon.png')}></Image>
                <View style={styles.bannerStatus}>
                    <Text style={styles.bannerStatusText}>{requestStatus(request.status)}</Text>
                </View>
                <View style={styles.bannerTime}>
                    <Text style={styles.bannerTimeText}>ASAP</Text>
                </View>
                <Image style={styles.bannerIcon} source={require('../assets/arrow.png')}></Image>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        top: '15%',
        alignSelf: 'center',
        width: windowWidth * 0.9,
        height: 70,
        borderRadius: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.third,
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
        resizeMode: 'contain',
    },
    bannerType: {
        color: 'white',
        fontSize: 24,
        width: '60%',
    },
    bannerTypeText: {
        color: 'white',
        fontSize: 16,
        width: '40%',
    },
    bannerStatus: {
        width: '40%',
        height: '80%',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 50,
    },
    bannerStatusText: {
        fontSize: 18,
        color: colors.primary,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    bannerTime: {
        width: '20%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerTimeText: {
        fontSize: 20,
        width: '100%',
        color: colors.background,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    }
})

export default ActiveJestaConsumerBanner;
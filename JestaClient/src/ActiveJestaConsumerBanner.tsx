import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants/colors';
import { requestInteface } from '../constants/Interfaces';
import { StatusEnum } from '../constants/StatusEnum';

const windowWidth = Dimensions.get('window').width;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: boolean) => void,
    request: requestInteface,
    ViewProvider: (request: requestInteface) => void
}

const ActiveJestaConsumerBanner: React.FC<ChildProps> = ({ openPage, request, ViewProvider }) => {

    const requestStatus = (status: StatusEnum) => {
        if (status == StatusEnum.ACTIVE_JESTA)
            return 'on the way'
        else if (status == StatusEnum.PUBLISHED_BEFORE_APPROVAL) {
            return 'Searching...'
        }
        else if (status == StatusEnum.PUBLISHED_WITH_PROVIDER_SEGGESTION) {
            return 'Provider Found!'
        }
        else if (status == StatusEnum.CANCELED_JESTA) {
            return 'Canceled'
        }
    }

    return (
        <TouchableOpacity
            style={[styles.banner,
            { backgroundColor: request.status == StatusEnum.PUBLISHED_WITH_PROVIDER_SEGGESTION || request.status == StatusEnum.ACTIVE_JESTA ? colors.third : colors.secondary_variant }]}
            onPress={() => request.status == StatusEnum.ACTIVE_JESTA || request.status == StatusEnum.PUBLISHED_WITH_PROVIDER_SEGGESTION ? ViewProvider(request) : false}>
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
    bannerIcon: {
        resizeMode: 'contain',
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

export default ActiveJestaConsumerBanner
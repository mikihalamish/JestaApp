import React, { useState, useEffect } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Alert } from 'react-native';
import { PagesDictionary } from '../constants/PagesDictionary';
import { colors } from '../constants/colors';
import { StatusEnum } from '../constants/StatusEnum';
import { requestInteface, userInteface } from '../constants/Interfaces';
import Database from './Database';
import { useAuth } from './AuthContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    close: () => void,
    request: requestInteface,
}

const ViewProviderFound: React.FC<ChildProps> = ({ close, request }) => {

    const [providerDetails, setProviderDetails] = useState<userInteface | null>()
    const { isAuthenticated, loggedUser, login, logout } = useAuth();

    const getProvider = async () => {
        const provider = await Database.getUser(request.provider!)
        setProviderDetails(provider)
    }

    useEffect(() => {
        getProvider()
    }, [])

    const approveJesta = async () => {
        await Database.updateRequestStatus(request.email!, request.publishTime, StatusEnum.ACTIVE_JESTA)
        close()
    }

    const cancelJesta = async () => {
        await Database.updateRequestStatus(request.email!, request.publishTime, StatusEnum.CANCELED_JESTA)
        close()
    }

    const finishJesta = async () => {
        await Database.updateRequestStatus(request.email!, request.publishTime, StatusEnum.JESTA_FINISHED)
        close()
    }

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
                        <Text style={styles.publisherName}>{providerDetails?.firstName + ' ' + providerDetails?.lastName}</Text>
                    </View>
                </View>
                <View style={styles.timeContainer}>
                    <Image style={styles.avatar} source={require('../assets/budget.png')}></Image>
                    <Text style={styles.scheduleText}>{request.details?.budget}$</Text>
                </View>
                {request.status == StatusEnum.PUBLISHED_WITH_PROVIDER_SEGGESTION ? 
                <View style={styles.controlButtonsContainerSuggestion}>
                    <TouchableOpacity style={styles.callButton} onPress={() => { Linking.openURL('tel:' + providerDetails?.phoneNumber) }}>
                        <Image source={require('../assets/call-icon.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.approveButton} onPress={approveJesta}>
                        <Text style={styles.buttonText}>Approve Jesta Provider</Text>
                    </TouchableOpacity>
                </View> : false}
                {request.status == StatusEnum.ACTIVE_JESTA ? <View style={styles.controlButtonsContainerActive}>
                    <TouchableOpacity style={styles.callButton} onPress={() => { Linking.openURL('tel:' + providerDetails?.phoneNumber) }}>
                        <Image source={require('../assets/call-icon.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={cancelJesta}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.finishButton} onPress={finishJesta}>
                        <Text style={styles.buttonText}>Finish Jesta</Text>
                    </TouchableOpacity>
                </View> : false}
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
        height: windowHeight * 0.4,
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
        height: '20%',
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
        height: '25%',
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
        height: '20%',
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
    controlButtonsContainerSuggestion: {
        width: '90%',
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        bottom: 20
    },
    controlButtonsContainerActive: {
        width: '90%',
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        bottom: 20
    },
    approveButton: {
        height: 60,
        width: '70%',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    finishButton: {
        height: 60,
        width: '40%',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    cancelButton: {
        height: 60,
        width: '30%',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.error,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    buttonText: {
        fontSize: 22,
        color: 'white',
        fontWeight: '400'
    },
    callButton: {
        height: 60,
        width: '20%',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.primary_variant,
        borderColor: colors.primary,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    saveText: {
        color: 'green',
        fontSize: 20
    },
})

export default ViewProviderFound;
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import * as ImagePicker from 'expo-image-picker';
import Toggle from './Toggle';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import Database from './Database';
import { useAuth } from './AuthContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface photo {
    date: Date,
    src: any
}

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
    prevStage: () => void,
    nextStage: () => void,
    isLongDistance: Boolean,
    setIsLongDistance: (isOn: Boolean) => void,
    description: string,
    setDescription: (desc: string) => void,
    uploadedPhotos: photo[],
    setUploadedPhotos: (photos: photo[]) => void,
}

const FixingJestaDetails: React.FC<ChildProps> = ({ openPage, prevStage, nextStage, isLongDistance, setIsLongDistance, description, setDescription, uploadedPhotos, setUploadedPhotos }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { loggedUser } = useAuth();

    useEffect(() => {
        setDescription(description),
            setUploadedPhotos(uploadedPhotos)
    }, [])

    const handleChoosePhoto = async () => {
        setIsLoading(true)
        try {
            const result = await ImagePicker.launchCameraAsync()
            if (!result.canceled && result.assets && result.assets[0]) {
                let uploadedPhotosTemp: photo[] = uploadedPhotos
                const imageUrl = await Database.uploadFileToFirebaseStorage(loggedUser!.email, result.assets[0].uri)
                uploadedPhotosTemp.push({
                    date: new Date(Date.now()),
                    src: imageUrl
                })
                setUploadedPhotos([...uploadedPhotosTemp])
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const requestPermission = async () => {
        const res = await ImagePicker.requestCameraPermissionsAsync()
        if (!res.granted) {
            Alert.alert("Please acccept permissions")
        }
    }

    useEffect(() => {
        requestPermission()
    }, [])

    useEffect(() => {
        setIsLoading(false)
    }, [uploadedPhotos])

    return (
        <View style={styles.outerContainer}>
            <TouchableOpacity style={styles.slider} onPress={() => openPage(PagesDictionary.FixingJesta, false)}>
                <View style={styles.sliderButton} />
            </TouchableOpacity>
            <View style={styles.pageContainer}>
                <View style={styles.backContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={prevStage}>
                        <Image style={styles.backIcon} source={require('../assets/back.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>write the details about your need</Text>
                </View>
                <ScrollView style={styles.descriptionContainer} keyboardShouldPersistTaps='handled'>
                    <TextInput
                        style={styles.descriptionInput}
                        editable
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                        autoCapitalize="none"
                        placeholder="describe your need"
                        autoCorrect
                    />
                </ScrollView>
                <ScrollView horizontal style={styles.horizontalScrollContainer}>
                    {uploadedPhotos.map((photo, index) => {
                        return <TouchableOpacity style={styles.photoContainer} key={index}>
                            <Image style={styles.photo} source={{ uri: photo.src }}></Image>
                        </TouchableOpacity>
                    })}
                    {isLoading ?
                        <TouchableOpacity style={styles.loadingContainer} key={-2}>
                            <Image style={styles.loadGif} source={require('../assets/load-photo-gif.gif')}></Image>
                        </TouchableOpacity>
                        : false}
                    <TouchableOpacity style={styles.uploadButton} key={-1} onPress={handleChoosePhoto}>
                        <Image style={styles.uploadIcon} source={require('../assets/upload.png')}></Image>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.longDistance}>
                    <View style={styles.toggleTitle}>
                        <Text style={styles.toggleText}>long distance serivce?</Text>
                        <Image style={styles.toggleIcon} source={require('../assets/long-distance.png')}></Image>
                    </View>
                    <Toggle isOn={isLongDistance} setIsOn={setIsLongDistance}></Toggle>
                </View>
                <View style={styles.controlButtonsContainer}>
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.saveText}>save for later</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={nextStage}>
                        <Text style={styles.buttonText}>next</Text>
                    </TouchableOpacity>
                </View>
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
        height: windowHeight * 0.75,
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
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    slider: {
        height: '4%',
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
        width: '90%',
        height: '10%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    backButton: {
        backgroundColor: colors.secondary_variant,
        borderRadius: 50,
        width: '40%',
        height: '50%',
        justifyContent: 'center',
    },
    backIcon: {
        left: 10
    },
    titleContainer: {
        height: '10%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '90%'
    },
    title: {
        fontSize: 22,
        color: colors.secondary
    },
    descriptionContainer: {
        width: '90%',
        height: '4%',
    },
    descriptionInput: {
        height: 'auto',
        minHeight: '80%',
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 20,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        color: colors.font
    },
    textWrap: {
        width: '100%',
        height: '1%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20
    },
    controlButtonsContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        bottom: 10
    },
    nextButton: {
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
    buttonText: {
        fontSize: 22,
        color: 'white',
        fontWeight: '400'
    },
    saveButton: {
        height: 60,
        width: '50%',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.background,
        borderColor: colors.primary,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    saveText: {
        color: colors.primary,
        fontSize: 20
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
    uploadButton: {
        height: 100,
        width: 100,
        marginLeft: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        borderColor: colors.font,
        borderWidth: 1,
        marginRight: 20,
        backgroundColor: colors.secondary_background,
        borderStyle: 'dashed',
        justifyContent: 'center'
    },
    loadingContainer: {
        height: 100,
        width: 100,
        marginLeft: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        borderColor: colors.font,
        borderWidth: 1,
        backgroundColor: colors.secondary_background,
        borderStyle: 'dashed',
        justifyContent: 'center'
    },
    uploadIcon: {
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    loadGif: {
        alignSelf: 'center',
        resizeMode: 'contain',
        width: '70%'
    },
    longDistance: {
        height: '5%',
        width: '90%',
        marginBottom: '10%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    toggleTitle: {
        height: '100%',
        width: '70%',
        justifyContent: 'flex-end',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    toggleIcon: {
        resizeMode: 'contain',
    },
    toggleText: {
        fontSize: 20,
        marginLeft: '5%',
        color: colors.font
    }
});

export default FixingJestaDetails
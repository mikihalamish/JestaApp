import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, Alert, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Database from './Database';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
    setIsSignedIn: () => void
}

const ERROR_MESSAGES = {
    NO_ERROR: '',
    EMPTY_FIELD: '*please fill in',
    EMAIL_NOT_SIGNED_UP: 'this email is not signed up',
    NOT_MATCH: 'wrong password'
}

const SignInPage: React.FC<ChildProps> = ({ openPage, setIsSignedIn }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(ERROR_MESSAGES.NO_ERROR)
    const [passwordError, setPasswordError] = useState(ERROR_MESSAGES.NO_ERROR)

    const verifyFields = () => {
        let verifyFlag = true
        if (!email.length) {
            setEmailError(ERROR_MESSAGES.EMPTY_FIELD)
            verifyFlag = false
        }
        if (!password.length) {
            setPasswordError(ERROR_MESSAGES.EMPTY_FIELD)
            verifyFlag = false
        }
        return verifyFlag
    }

    useEffect(() => {
        setEmailError(ERROR_MESSAGES.NO_ERROR)
        setPasswordError(ERROR_MESSAGES.NO_ERROR)
    }, [email, password])

    const login = async () => {
        if (verifyFields()) {
            let result = await Database.signIn(email, password)
            if (result == 2) {
                setIsSignedIn()
                openPage(PagesDictionary.SignInPage, false)
                Alert.alert('Signed In');
                try {
                    AsyncStorage.setItem('user_email', email);
                } catch (e) {
                    console.log(e)
                }
            }
            else if (result == 0) {
                setEmailError(ERROR_MESSAGES.EMAIL_NOT_SIGNED_UP)
            } else if (result == 1) {
                setPasswordError(ERROR_MESSAGES.NOT_MATCH)
            }
        }
    };

    return (
        <View style={styles.outerContainer}>
            <TouchableOpacity style={styles.slider} onPress={() => openPage(PagesDictionary.SignInPage, false)}><View style={styles.sliderButton}></View></TouchableOpacity>
            <View style={styles.pageContainer}>
                <Image style={styles.logo} source={require('../assets/logo-with-text (1).png')}></Image>
                <View style={styles.ManualLoginContainer}>
                    <View style={styles.inputsContainer}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            placeholder="Email"
                            autoCorrect
                        />
                        <Text style={styles.inputError}>{emailError}</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Password"
                        />
                        <Text style={styles.inputError}>{passwordError}</Text>
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={login}>
                        <Text style={styles.bannerText}>Sign In</Text>
                        <Image style={styles.bannerIcon} source={require('../assets/arrow.png')}></Image>
                    </TouchableOpacity>
                    <View style={styles.textWrap}>
                        <TextInput style={styles.text}>or</TextInput>
                    </View>
                    <TouchableOpacity style={styles.googleButton}>
                        <Image style={styles.googleIcon} source={require('../assets/google.png')}></Image>
                        <Text style={styles.googleBannerText}>Sign In With Google</Text>
                    </TouchableOpacity>

                    <View style={styles.signUp}>
                        <TextInput style={styles.text}>new to Jesta?</TextInput>
                        <TouchableOpacity style={{ ...styles.loginButton, backgroundColor: colors.secondary_variant }} onPress={() => openPage(PagesDictionary.SignUpPage, true)}>
                            <Text style={styles.bannerText}>Create Your Account</Text>
                            <Image style={styles.bannerIcon} source={require('../assets/arrow.png')}></Image>
                        </TouchableOpacity>
                    </View>
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
        height: windowHeight * 0.95,
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
    logo: {
        width: '50%',
        resizeMode: 'contain'
    },
    ManualLoginContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
    },
    label: {
        marginBottom: 5,
    },
    input: {
        height: 60,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: '3%',
        paddingHorizontal: 10,
        borderRadius: 8,
        fontSize: 24
    },
    loginButton: {
        height: 60,
        width: '100%',
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
        marginTop: '5%'
    },
    googleButton: {
        height: 60,
        width: '100%',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.background,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        borderColor: colors.font,
        borderWidth: 1

    },
    bannerText: {
        color: 'white',
        fontSize: 24,
        width: '70%',
    },
    googleBannerText: {
        color: colors.font,
        fontSize: 24,
        width: '75%',
    },
    bannerIcon: {
        resizeMode: 'contain',
    },
    googleIcon: {
        resizeMode: 'contain',
        width: 45
    },
    inputsContainer: {
        width: '100%',
        height: '30%'
    },
    textWrap: {
        width: '100%',
        height: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24
    },
    bannerContent: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    signUp: {
        marginTop: '15%',
        width: '100%',
        height: '18%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputError: {
        color: colors.error,
        marginBottom: '3%',
        fontSize: 16,
        alignSelf: 'flex-end'
    },
});

export default SignInPage
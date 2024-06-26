import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import { UserInterface, UserLoginInterface } from '../constants/Interfaces';
import { LoginStatusDictionary } from '../constants/LoginStatusDictionary';
import Database from './Database';
import { useAuth } from './AuthContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
}

const ERROR_MESSAGES = {
    NO_ERROR: '',
    EMPTY_FIELD: '*please fill in',
    EMAIL_NOT_SIGNED_UP: 'this email is not signed up',
    NOT_MATCH: 'wrong password'
}

export const SignInPage: React.FC<ChildProps> = ({ openPage }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(ERROR_MESSAGES.NO_ERROR)
    const [passwordError, setPasswordError] = useState(ERROR_MESSAGES.NO_ERROR)

    const { login } = useAuth();

    useEffect(() => {
        setEmailError(ERROR_MESSAGES.NO_ERROR)
        setPasswordError(ERROR_MESSAGES.NO_ERROR)
    }, [email, password])

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

    const loginUser = async () => {
        if (verifyFields()) {
            let result: UserLoginInterface = await Database.signIn(email, password)
            if (result.status == LoginStatusDictionary.SUCCESS) {
                login(result.user!)
                openPage(PagesDictionary.SignInPage, false)
            }
            else if (result.status == LoginStatusDictionary.EMAIL_NOT_EXIST) {
                setEmailError(ERROR_MESSAGES.EMAIL_NOT_SIGNED_UP)
            } else if (result.status == LoginStatusDictionary.WRONG_PASSWORD) {
                setPasswordError(ERROR_MESSAGES.NOT_MATCH)
            }
        }
    };

    return (
        <View style={styles.outerContainer}>
            <TouchableOpacity style={styles.slider} onPress={() => openPage(PagesDictionary.SignInPage, false)}><View style={styles.sliderButton}></View></TouchableOpacity>
            <View style={styles.pageContainer}>
                <Image style={styles.logo} source={require('../assets/logo-with-text.png')}></Image>
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
                    <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
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
        resizeMode: 'contain',
        height: '25%'
    },
    ManualLoginContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
        height: '55%',
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
        height: '45%'
    },
    textWrap: {
        width: '100%',
        height: '10%',
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
        width: '100%',
        height: '44%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputError: {
        color: colors.error,
        marginBottom: '3%',
        fontSize: 16,
        alignSelf: 'flex-end'
    },
});

export default SignInPage
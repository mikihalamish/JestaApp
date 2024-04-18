import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, Alert, Button, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import { userInteface, userLoginInterface } from '../constants/Interfaces';
import Database from './Database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { LoginStatusDictionary } from '../constants/LoginStatusDictionary';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
}

const ERROR_MESSAGES = {
    NO_ERROR: '',
    EMPTY_FIELD: 'field can not be empty',
    PASSORD_FORMAT: 'you must use at least 8 digits letters & numbers',
    PASSWORD_NOT_MATCH: 'passwords not match',
    EMAIL_USED: 'this email is already signed up'
}

const SignUpPage: React.FC<ChildProps> = ({ openPage }) => {

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordValidation, setPasswordValidation] = useState<string>('')
    const [firstNameError, setFirstNameError] = useState<string>(ERROR_MESSAGES.NO_ERROR)
    const [lastNameError, setlastNameError] = useState<string>(ERROR_MESSAGES.NO_ERROR)
    const [emailError, setEmailError] = useState<string>(ERROR_MESSAGES.NO_ERROR)
    const [phoneError, setPhoneError] = useState<string>(ERROR_MESSAGES.NO_ERROR)
    const [passwordError, setPasswordError] = useState<string>(ERROR_MESSAGES.NO_ERROR)
    const [verifyPasswordError, setVerifyPasswordError] = useState<string>(ERROR_MESSAGES.NO_ERROR)

    const { isAuthenticated, loggedUser, login, logout } = useAuth();

    const verifyFields = () => {
        let verifyFlag = true
        if (!firstName.length) {
            setFirstNameError(ERROR_MESSAGES.EMPTY_FIELD)
            verifyFlag = false
        }
        if (!lastName.length) {
            setlastNameError(ERROR_MESSAGES.EMPTY_FIELD)
            verifyFlag = false
        }
        if (!email.length) {
            setEmailError(ERROR_MESSAGES.EMPTY_FIELD)
            verifyFlag = false
        }
        if (password.length < 8) {
            setPasswordError(ERROR_MESSAGES.PASSORD_FORMAT)
            verifyFlag = false
        }
        if (passwordValidation != password) {
            setVerifyPasswordError(ERROR_MESSAGES.PASSWORD_NOT_MATCH)
            verifyFlag = false
        }
        return verifyFlag
    }

    const signUp = async () => {
        if (verifyFields()) {
            const newUser: userInteface = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                phoneNumber: phone
            }
            if (await Database.signUp(newUser)) {
                console.log("signedUp")
                let result: userLoginInterface = await Database.signIn(email, password)
                if (result.status == LoginStatusDictionary.SUCCESS) {
                    login(result.user!)
                    openPage(PagesDictionary.SignInPage, false)
                }
                openPage(PagesDictionary.SignInPage, false)
                openPage(PagesDictionary.SignUpPage, false)
            } else {
                setEmailError(ERROR_MESSAGES.EMAIL_USED)
            }
        }
    }

    useEffect(() => {
        setFirstNameError(ERROR_MESSAGES.NO_ERROR)
        setlastNameError(ERROR_MESSAGES.NO_ERROR)
        setEmailError(ERROR_MESSAGES.NO_ERROR)
        setPasswordError(ERROR_MESSAGES.NO_ERROR)
        setVerifyPasswordError(ERROR_MESSAGES.NO_ERROR)
    }, [firstName, lastName, email, password, passwordValidation, phone])

    return (
        <View style={styles.outerContainer}>
            <View style={styles.slider} onTouchStart={() => openPage(PagesDictionary.SignUpPage, false)}><View style={styles.sliderButton}></View></View>
            <View style={styles.pageContainer}>
                <View style={styles.backContainer} onTouchStart={() => openPage(PagesDictionary.SignUpPage, false)}>
                    <TouchableOpacity style={styles.backButton} >
                        <Image style={styles.backIcon} source={require('../assets/back.png')}></Image>
                    </TouchableOpacity>
                </View>
                <Image style={styles.logo} source={require('../assets/logo-with-text (1).png')}></Image>
                <View style={styles.ManualLoginContainer}>
                    <View style={styles.googleButton}>
                        <Image style={styles.googleIcon} source={require('../assets/google.png')}></Image>
                        <Text style={styles.googleBannerText}>Sign In With Google</Text>
                    </View>
                    <View style={styles.textWrap}>
                        <TextInput style={styles.text}>or</TextInput>
                    </View>
                    <ScrollView style={styles.inputsContainer}>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            keyboardType="default"
                            autoCapitalize="none"
                            autoComplete="name"
                            placeholder="First Name"
                            autoCorrect
                        />
                        <Text style={styles.inputError}>{firstNameError}</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            keyboardType="default"
                            autoCapitalize="none"
                            autoComplete="name-family"
                            placeholder="Last Name"
                            autoCorrect
                        />
                        <Text style={styles.inputError}>{lastNameError}</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="numbers-and-punctuation"
                            autoCapitalize="none"
                            autoComplete="tel"
                            placeholder="Phone Number"
                            autoCorrect
                        />
                        <Text style={styles.inputError}>{phoneError}</Text>
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
                        <TextInput
                            style={styles.input}
                            value={passwordValidation}
                            onChangeText={setPasswordValidation}
                            secureTextEntry
                            placeholder="Password Validation"
                        />
                        <Text style={styles.inputError}>{verifyPasswordError}</Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.loginButton} onPress={signUp}>
                        <Text style={styles.bannerText}>Sign Up</Text>
                        <Image style={styles.bannerIcon} source={require('../assets/arrow.png')}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    outerContainer: {
        /*  flex: 1, */
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: windowHeight * 0.95,
        width: windowWidth,
        bottom: 0
    },
    pageContainer: {
        backgroundColor: colors.background,
        width: '100%',
        height: '100%',
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        /* flex: 1, */
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        height: '13%',
        resizeMode: 'contain',
        marginBottom: '5%'
    },
    ManualLoginContainer: {
        width: '90%',
        height: '68%'
    },
    input: {
        height: 60,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 8,
        fontSize: 24
    },
    loginButton: {
        height: 60,
        width: '100%',
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
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
        shadowOpacity: 0.10,
        shadowRadius: 8,
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '5%'
    },
    inputError: {
        color: colors.error,
        fontSize: 16,
        marginBottom: '7%',
        alignSelf: 'flex-end'
    },
    backContainer: {
        width: '90%',
        height: '10%',
        alignItems: 'flex-start',
        justifyContent: 'center',
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
});

export default SignUpPage
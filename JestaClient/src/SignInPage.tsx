import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, Alert, Button } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen:string, toOpen:Boolean) => void,
    handleLogin: () => void
}

const SignInPage: React.FC<ChildProps> = ({ openPage, handleLogin }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={styles.outerContainer}>
            <View style={styles.slider} onTouchStart={() => openPage(PagesDictionary.SignInPage,false)}><View style={styles.sliderButton}></View></View>
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
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Password"
                        />
                    </View>
                    <View style={styles.loginButton} onTouchStart={handleLogin}>
                        <Text style={styles.bannerText}>Sign In</Text>
                        <Image style={styles.bannerIcon} source={require('../assets/arrow.png')}></Image>
                    </View>
                    <View style={styles.textWrap}>
                        <TextInput style={styles.text}>or</TextInput>
                    </View>
                    <View style={styles.googleButton} onTouchStart={handleLogin}>
                        <Image style={styles.googleIcon} source={require('../assets/google.png')}></Image>
                        <Text style={styles.googleBannerText}>Sign In With Google</Text>
                    </View>

                    <View style={styles.signUp}>
                        <TextInput style={styles.text}>new to Jesta?</TextInput>
                        <View style={{...styles.loginButton, backgroundColor: colors.secondary_variant}} onTouchStart={() => openPage(PagesDictionary.SignUpPage, true)}>
                            <Text style={styles.bannerText}>Create Your Account</Text>
                            <Image style={styles.bannerIcon} source={require('../assets/arrow.png')}></Image>
                        </View>
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
        marginBottom: 20,
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
    }
});

export default SignInPage
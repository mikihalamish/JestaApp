import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import { FixTypeInterface } from '../constants/Interfaces';

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
    nextStage: () => void,
    selectedType: string,
    setSelectedType: (value: string) => void,
    otherType: string,
    setOtherType: (value: string) => void
}

const fixTypes: FixTypeInterface[] = [
    {
        name: "electricity",
        icon: require("../assets/electricity.png"),
    },
    {
        name: "wood",
        icon: require("../assets/wood.png"),
    },
    {
        name: "renovation",
        icon: require("../assets/rennovation.png"),
    },
    {
        name: "plumbing",
        icon: require("../assets/plumb.png"),
    },
    {
        name: "gardening",
        icon: require("../assets/gardening.png"),
    },
    {
        name: "computering",
        icon: require("../assets/computering.png"),
    }
]

const FixingJestaTypeSelect: React.FC<ChildProps> = ({ openPage, nextStage, selectedType, setSelectedType, otherType, setOtherType }) => {

    useEffect(() => {
        setSelectedType(selectedType)
        setOtherType(otherType)
    }, [])

    useEffect(() => {
        setSelectedType('')
    }, [otherType])

    return (
        <View style={styles.outerContainer}>
            <TouchableOpacity style={styles.slider} onPress={() => openPage(PagesDictionary.FixingJesta, false)}>
                <View style={styles.sliderButton} />
            </TouchableOpacity>
            <View style={styles.pageContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>what type of fix do you need?</Text>
                </View>
                <View style={styles.typeSelector}>
                    {
                        fixTypes.map((type, index) => {
                            return (
                                <TouchableOpacity style={type.name == selectedType ? styles.selectedTypeButton : styles.unselectedTypeButton}
                                    key={index}
                                    onPress={() => type.name != selectedType ? setSelectedType(type.name) : setSelectedType('')}>
                                    <Image style={type.name == selectedType ? styles.selectesTypeIcon : styles.typeIcon} source={type.icon}></Image>
                                    <Text style={type.name == selectedType ? styles.selectedTypeName : styles.typeName}>{type.name}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={styles.textWrap}>
                    <TextInput style={styles.text}>other</TextInput>
                </View>
                <View style={styles.otherTypeContainer}>
                    <TextInput
                        style={styles.input}
                        value={otherType}
                        onChangeText={setOtherType}
                        autoCapitalize="none"
                        placeholder="describe your need"
                        autoCorrect
                    />
                </View>
                {selectedType || otherType ? <View style={styles.controlButtonsContainer}>
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.saveText}>save for later</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={nextStage}>
                        <Text style={styles.buttonText}>next</Text>
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
    titleContainer: {
        height: '15%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '90%'
    },
    title: {
        fontSize: 22,
        color: colors.secondary
    },
    typeSelector: {
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '90%',
        marginTop: '5%'
    },
    selectedTypeButton: {
        height: windowWidth * 0.25,
        width: windowWidth * 0.25,
        backgroundColor: colors.primary,
        margin: '2%',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
    },
    typeIcon: {
        position: 'absolute',
        top: '20%',
        alignSelf: 'center',
        opacity: 0.7
    },
    typeName: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        color: 'black'
    },
    selectesTypeIcon: {
        position: 'absolute',
        top: '20%',
        alignSelf: 'center',
        opacity: 1
    },
    selectedTypeName: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        color: 'white'
    },
    unselectedTypeButton: {
        height: windowWidth * 0.25,
        width: windowWidth * 0.25,
        backgroundColor: colors.background,
        margin: '2%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.font,
    },
    otherTypeContainer: {
        width: '90%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 60,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 50,
        fontSize: 20
    },
    textWrap: {
        width: '100%',
        height: '10%',
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
        bottom: 0
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
    }
})

export default FixingJestaTypeSelect
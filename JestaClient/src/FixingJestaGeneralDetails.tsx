import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity, Button, Platform } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import Toggle from './Toggle';
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface PickerItem {
    label: string;
    value: string;
}

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
    prevStage: () => void,
    note: string,
    isFlexible: Boolean,
    budget: string,
    location: string,
    setNote: (note: string) => void,
    setIsFlexible: (is: Boolean) => void,
    setBudget: (budget: string) => void,
    setLocation: (location: string) => void,
    publish: () => void
}

const BLANK = " "

const FixingJestaGeneralDetails: React.FC<ChildProps> = ({
    openPage,
    prevStage,
    note,
    isFlexible,
    budget,
    setNote,
    setIsFlexible,
    setBudget,
    setLocation,
    publish
}) => {

    const [selectedValue, setSelectedValue] = useState<string>('');
    const [citiesList, setCitiesList] = useState<PickerItem[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        getCitiesFromURL();
    }, []);

    const getCitiesFromURL = async () => {
        try {
            const response = await fetch(
                `https://data.gov.il/api/3/action/datastore_search?resource_id=8f714b6f-c35c-4b40-a0e7-547b675eee0e&`
            );
            const json = await response.json();
            let tempCities: PickerItem[] = []
            json.result.records.map((city: any) => {
                const cityname: string = city["city_name_en"].toLowerCase()
                if (cityname != BLANK) {
                    tempCities.push({ label: cityname, value: cityname })
                }
            })
            setCitiesList([...tempCities])
        } catch (error) {
            console.log(`Error fetching data: + ${error}`);
        }
    };

    const pickerStyle: PickerStyle = {
        inputIOS: {
            width: windowWidth * 0.78,
            height: '90%',
            borderColor: colors.font,
            borderWidth: 1,
            borderRadius: 90,
            fontSize: 20,
            alignSelf: 'center',
            justifyContent: 'flex-start',
            color: colors.font,
            padding: 10,
            alignItems: 'center',
            alignContent: 'center',
        },
        inputAndroid: {
            width: '85%',
            height: '70%',
            borderColor: colors.font,
            borderWidth: 1,
            borderRadius: 8,
            fontSize: 20,
            alignSelf: 'center',
            justifyContent: 'flex-start',
            color: colors.font,
            padding: 10
        },
    }

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
                <View style={styles.locationContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedValue(value)}
                        style={pickerStyle}
                        items={citiesList}
                        value={selectedValue}
                        placeholder={{
                            label: 'Choose location...',
                            value: null,
                        }}
                    />
                    <Image style={styles.locationIcon} source={require('../assets/location.png')}></Image>
                </View>
                <View style={styles.scheduleContainer}>
                    <View style={styles.rightContainer}>
                        <Image style={styles.scheduleIcon} source={require('../assets/date-icon.png')}></Image>
                        <Text style={styles.dateText}>or select time</Text>
                    </View>
                    <View style={styles.leftContainer}>
                        <Text style={styles.scheduleText}>ASAP</Text>
                        <Image style={styles.scheduleIcon} source={require('../assets/schedule.png')}></Image>
                    </View>
                </View>
                <TextInput
                    style={styles.noteInput}
                    editable
                    value={note}
                    onChangeText={setNote}
                    autoCapitalize="none"
                    placeholder="add notes"
                    autoCorrect
                />
                <View style={styles.budget}>
                    <View style={styles.budgetInputContainer}>
                        <TextInput
                            style={styles.budgetInput}
                            value={budget}
                            editable
                            onChangeText={setBudget}
                            placeholder="budget"
                            keyboardType='numbers-and-punctuation'
                        ></TextInput>
                        <Image style={styles.toggleIcon} source={require('../assets/budget.png')}></Image>
                    </View>
                    {budget && parseFloat(budget) ? <View style={styles.toggleTitle}>
                        <Text style={styles.toggleText}>flexible?</Text>
                        <Toggle isOn={isFlexible} setIsOn={setIsFlexible}></Toggle>
                    </View> : false}
                </View>
                <View style={styles.controlButtonsContainer}>
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.saveText}>save for later</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={publish}>
                        <Text style={styles.buttonText}>Publish</Text>
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
    noteContainer: {
        width: '90%',
        height: '4%',
    },
    noteInput: {
        width: '90%',
        height: '7%',
        borderColor: colors.font,
        borderWidth: 1,
        borderRadius: 50,
        fontSize: 20,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        color: colors.font,
        padding: 10,
        marginTop: '5%',
    },
    locationContainer: {
        width: '90%',
        height: '8%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row-reverse',
    },
    locationInput: {
        width: '85%',
        height: '70%',
        borderColor: colors.font,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 20,
        alignSelf: 'center',
        justifyContent: 'flex-start',
        color: colors.font,
        padding: 10
    },
    scheduleContainer: {
        marginTop: '5%',
        width: '90%',
        height: '10%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row-reverse'
    },
    leftContainer: {
        height: '100%',
        width: '40%',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
    },
    rightContainer: {
        height: '100%',
        width: '60%',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
    },
    scheduleIcon: {
        resizeMode: 'contain',
    },
    locationIcon: {
        width: '10%',
        resizeMode: 'contain',
    },
    budgetInput: {
        height: '70%',
        width: '70%',
        borderColor: colors.font,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 20,
        justifyContent: 'flex-start',
        color: colors.font,
        marginLeft: '15%',
        paddingLeft: 8,
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
    budgetSliderContainer: {
        width: '90%',
        height: '20%'
    },
    controlButtonsContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        bottom: '5%',
        position: 'absolute'
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
    uploadIcon: {
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    budget: {
        height: '10%',
        width: '90%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10%',
    },
    budgetInputContainer: {
        height: '100%',
        width: '50%',
        justifyContent: 'flex-end',
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    toggleTitle: {
        height: '100%',
        width: '50%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleIcon: {
        resizeMode: 'contain',
    },
    toggleText: {
        fontSize: 16,
        marginRight: '5%',
        color: colors.font,
        opacity: 0.5
    },
    scheduleText: {
        fontSize: 24,
        marginLeft: '15%',
        color: colors.font,
    },
    dateText: {
        fontSize: 16,
        marginRight: '5%',
        color: colors.font,
        opacity: 0.5
    }
});

export default FixingJestaGeneralDetails
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import FixingJestaDetails from './FixingJestaDetails';
import FixingJestaTypeSelect from './FixingJestaTypeSelect';
import FixingJestaGeneralDetails from './FixingJestaGeneralDetails';
import Database from './Database';
import { StatusEnum } from '../constants/StatusEnum';
import { Timestamp } from 'firebase/firestore/lite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
}

interface Photo {
    date: Date,
    src: any
}

interface FixingJesta {
    type: string,
    longDistance: Boolean,
    description: string,
    uploadedPhotos: Photo[],
    note: string,
    budget: string,
    location: string
}

interface request {
    email: string | undefined | null,
    type: string,
    details: any,
    status: StatusEnum,
    publishTime: number
}

const FixingJesta: React.FC<ChildProps> = ({ openPage }) => {

    const [stage, setStage] = useState<number>(0)
    const [selectedType, setSelectedType] = useState<string>('')
    const [otherType, setOtherType] = useState<string>('')
    const [isLongDistance, setIsLongDistance] = useState<Boolean>(false)
    const [description, setDescription] = useState<string>('')
    const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([])
    const [note, setNote] = useState<string>('')
    const [isFlexible, setIsFlexible] = useState<Boolean>(false)
    const [budget, setBudget] = useState<string>('')
    const [location, setLocation] = useState<string>('')

    const publishFixingRequest = async () => {
        const requestDetails: FixingJesta = {
            type: otherType ? otherType : selectedType,
            longDistance: isLongDistance,
            description: description,
            uploadedPhotos: uploadedPhotos,
            note: note,
            budget: budget,
            location: location
        }
        const email = await AsyncStorage.getItem('user_email')
        console.log(requestDetails)
        const newRequest: request = {
            email: email,
            type: 'Fixing',
            details: requestDetails,
            status: StatusEnum.PUBLISHED_BEFORE_APPROVAL,
            publishTime: Date.now(),
        }
        Database.addRequest(newRequest)
        openPage(PagesDictionary.FixingJesta, false)
    }

    const stages = [
        <FixingJestaTypeSelect
            openPage={openPage}
            nextStage={() => setStage(stage + 1)}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            otherType={otherType}
            setOtherType={setOtherType}
        ></FixingJestaTypeSelect>,
        <FixingJestaDetails
            openPage={openPage}
            prevStage={() => setStage(stage - 1)}
            nextStage={() => setStage(stage + 1)}
            isLongDistance={isLongDistance}
            setIsLongDistance={setIsLongDistance}
            description={description}
            setDescription={setDescription}
            uploadedPhotos={uploadedPhotos}
            setUploadedPhotos={setUploadedPhotos}
        ></FixingJestaDetails>,
        <FixingJestaGeneralDetails
            openPage={openPage}
            prevStage={() => setStage(stage - 1)}
            note={note}
            isFlexible={isFlexible}
            budget={budget}
            location={location}
            setNote={setNote}
            setLocation={setLocation}
            setBudget={setBudget}
            setIsFlexible={setIsFlexible}
            publish={publishFixingRequest}
        ></FixingJestaGeneralDetails>
    ]

    return (
        stages[stage]
    )
}

const styles = StyleSheet.create({

})

export default FixingJesta;
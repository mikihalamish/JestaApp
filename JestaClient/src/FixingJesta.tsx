import React, { useState } from 'react';
import { PagesDictionary } from '../constants/PagesDictionary';
import { StatusEnum } from '../constants/StatusEnum';
import { PhotoInterface, requestInteface, FixingJestaInterface } from '../constants/Interfaces';
import FixingJestaDetails from './FixingJestaDetails';
import FixingJestaTypeSelect from './FixingJestaTypeSelect';
import FixingJestaGeneralDetails from './FixingJestaGeneralDetails';
import Database from './Database';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
}

const FixingJesta: React.FC<ChildProps> = ({ openPage }) => {

    const [stage, setStage] = useState<number>(0)
    const [selectedType, setSelectedType] = useState<string>('')
    const [otherType, setOtherType] = useState<string>('')
    const [isLongDistance, setIsLongDistance] = useState<Boolean>(false)
    const [description, setDescription] = useState<string>('')
    const [uploadedPhotos, setUploadedPhotos] = useState<PhotoInterface[]>([])
    const [note, setNote] = useState<string>('')
    const [isFlexible, setIsFlexible] = useState<Boolean>(false)
    const [budget, setBudget] = useState<string>('')
    const [location, setLocation] = useState<string>('')

    const publishFixingRequest = async () => {
        const requestDetails: FixingJestaInterface = {
            type: otherType ? otherType : selectedType,
            longDistance: isLongDistance,
            description: description,
            uploadedPhotos: uploadedPhotos,
            note: note,
            budget: budget,
            location: location
        }
        const email = await AsyncStorage.getItem('user_email')
        const newRequest: requestInteface = {
            email: email,
            type: 'Fixing',
            details: requestDetails,
            status: StatusEnum.PUBLISHED_BEFORE_APPROVAL,
            publishTime: Date.now(),
            provider: null
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

export default FixingJesta
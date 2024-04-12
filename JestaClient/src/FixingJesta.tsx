import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../constants/colors';
import { PagesDictionary } from '../constants/PagesDictionary';
import FixingJestaDetails from './FixingJestaDetails';
import FixingJestaTypeSelect from './FixingJestaTypeSelect';
import FixingJestaGeneralDetails from './FixingJestaGeneralDetails';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ChildProps {
    openPage: (pageToOpen: string, toOpen: Boolean) => void,
}

interface photo {
    date: Date,
    src: any
}

const FixingJesta: React.FC<ChildProps> = ({ openPage }) => {

    const [stage, setStage] = useState<number>(0)
    const [selectedType, setSelectedType] = useState<string>('')
    const [otherType, setOtherType] = useState<string>('')
    const [isLongDistance, setIsLongDistance] = useState<Boolean>(false)
    const [description, setDescription] = useState<string>('')
    const [uploadedPhotos, setUploadedPhotos] = useState<photo[]>([])

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
        ></FixingJestaGeneralDetails>
    ]

    return (
        stages[stage]
    )
}

const styles = StyleSheet.create({

})

export default FixingJesta;
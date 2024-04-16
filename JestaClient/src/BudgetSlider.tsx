import React, { useEffect, useState } from 'react';
import { Slider } from '@miblanchard/react-native-slider';
import { AppRegistry, StyleSheet, View, Text } from 'react-native';

interface ChildProps {
    budget: number
}

const BudgetSlider: React.FC<ChildProps> = ({ budget }) => {

    const [value, setValue] = useState<Number | undefined | Number[] | any>([budget,budget+10])

    useEffect(() => {
        console.log(budget)
    }, [budget])

    return (
        <View style={styles.container}>
            <Slider
                value={value}
                onValueChange={setValue}
                minimumValue={budget-3}
                maximumValue={budget+3}
            />
            <Text>Value: {value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});

export default BudgetSlider
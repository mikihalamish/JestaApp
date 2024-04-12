import React, { useState } from 'react';
import { Slider } from '@miblanchard/react-native-slider';
import { AppRegistry, StyleSheet, View, Text } from 'react-native';

interface ChildProps {
    budget: string
}

const BudgetSlider: React.FC<ChildProps> = ({ budget }) => {

    const [value, setValue] = useState<Number | undefined | Number[] | any>([50, budget, 70])

    return (
        <View style={styles.container}>
            <Slider
                value={value}
                onValueChange={setValue}
                maximumValue={100}
                minimumValue={0}
                step={1}
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
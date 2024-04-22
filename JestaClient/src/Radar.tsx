import { Component } from "react";
import { Animated, Easing, View } from "react-native";

interface InfiniteRotationProps { }

interface InfiniteRotationState { }

class Radar extends Component<InfiniteRotationProps, InfiniteRotationState> {
    spinValue: Animated.Value;

    constructor(props: InfiniteRotationProps) {
        super(props);
        this.spinValue = new Animated.Value(0);
    }

    componentDidMount() {
        this.spin();
    }

    spin() {
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 10000, // Duration of rotation in milliseconds
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => this.spin());
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 1, width: '100%' }}>
                <Animated.Image
                    style={{
                        width: 300,
                        height: 300,
                        transform: [{ rotate: spin }]
                    }}
                    source={require('../assets/radar.png')}
                />
            </View>
        );
    }
}

export default Radar;

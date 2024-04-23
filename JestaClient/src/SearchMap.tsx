import React, { useState, useEffect } from 'react';
import { TextInput, FlatList, View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { colors } from '../constants/colors';

interface Record {
    _id: string,
    סמל_ישוב: Number,
    שם_ישוב: string,
    סמל_רחוב: Number,
    שם_רחוב: string,
    rank: Number
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchMap: React.FC = () => {
    const [data, setData] = useState<Record[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('מ');
    const [filteredData, setFilteredData] = useState<Record[]>([]);

    useEffect(() => {
        fetchData(searchQuery);
    }, [searchQuery]);

    const fetchData = async (filter: string) => {
        try {
            const response = await fetch(
                `https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&q=${filter}`
            );
            const json = await response.json();
            setData(json.result.records);
            setFilteredData(json.result.records);
        } catch (error) {
            Alert.alert(`Error fetching data: + ${error}`);
        }
    };
    /* 
        const handleSearch = (text: string) => {
            setSearchQuery(text);
            const filtered = data.filter((item) => {
                Alert.alert(item.fieldName)
                item.fieldName.toLowerCase().includes(text.toLowerCase())
            }
            );
            setFilteredData(filtered);
        }; */

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setSearchQuery}
                value={searchQuery}
                placeholder="Search..."
            />
            <FlatList
                data={filteredData}
                renderItem={({ item, index }) => (
                    <Text style={styles.item} key={item._id}>{item.שם_רחוב}</Text>
                )}
                keyExtractor={(item) => item._id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: windowHeight * 0.1,
        paddingHorizontal: 10,
        width: windowWidth * 0.9
        /*  position: 'absolute',
         width: '100%' */
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        width: '100%',
        backgroundColor: colors.error,
        
    },
});

export default SearchMap;
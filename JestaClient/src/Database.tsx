import React from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';
import { ref, set, getDatabase, get, push } from '@firebase/database';
import { StatusEnum } from '../constants/StatusEnum';
import { requestInteface, userInteface } from '../constants/Interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDPFkE-BeD7QlNTte_ffmWaPhmKsOWxzCo",
    authDomain: "jesta-5de10.firebaseapp.com",
    databaseURL: "https://jesta-5de10-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "jesta-5de10",
    storageBucket: "jesta-5de10.appspot.com",
    messagingSenderId: "265470993246",
    appId: "1:265470993246:web:b064c11757eefd73f4a5cf",
    measurementId: "G-D9NZG7HNHP"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const requestsRef = ref(database, 'requests');
const usersRef = ref(database, 'users');

const addRequest = async (requestToAdd: requestInteface) => {
    try {
        await push(requestsRef, requestToAdd);
        console.log('Request inserted successfully');
        return true
    } catch (error) {
        console.error('Error inserting data: ', error);
        return false
    }
}

const getRequestsWaitingForApproval = async () => {
    try {
        const result = await get(requestsRef);
        const requests: requestInteface[] | null = result.val()
        console.log('Got Requests');

        const requestsArray = Object.values(requests!);
        return requestsArray;
    } catch (error) {
        console.error('Error getting requests: ', error);
        return null
    }
}

const signUp = async (newUser: userInteface) => {
    try {
        const result = await get(usersRef);
        const users: userInteface | any = Object.values(result.val())

        if (users.filter((user: userInteface) => user.email == newUser.email).length > 0) {
            console.log('email already in use')
            return false
        } else {
            push(usersRef, newUser)
            return true
        }
    } catch (error) {
        console.error('Error getting requests: ', error);
        return null
    }
}

const signIn = async (email: string, password: string) => {
    try {
        const result = await get(usersRef);
        const users: userInteface | any = Object.values(result.val())

        const user = users.filter((user: userInteface) => user.email == email)[0]
        if (!user) {
            console.log('email not signed up')
            return 0
        } else if(user.password != password) {
            console.log('wrong password')
            return 1
        }
        else {
            try {
                AsyncStorage.setItem('user_email', email);
            } catch (e) {
                console.log(e)
            }
            return 2
        }
    } catch (error) {
        console.error('Error getting requests: ', error);
        return null
    }
}

export default {
    addRequest,
    getRequestsWaitingForApproval,
    signUp,
    signIn
}
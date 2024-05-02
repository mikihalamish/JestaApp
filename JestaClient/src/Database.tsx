import React, { Children } from 'react';
import { initializeApp } from 'firebase/app';
import { ref, set, getDatabase, get, push, update } from '@firebase/database';
import { StatusEnum } from '../constants/StatusEnum';
import { requestInteface, userInteface, userLoginInterface } from '../constants/Interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginStatusDictionary } from '../constants/LoginStatusDictionary';
import { UserStatusDictionary } from '../constants/userStatusDictionary';
import { getStorage, uploadBytes, ref as sRef, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage(app)

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

const getRequests = async () => {
    try {
        const result = await get(requestsRef);
        const requests: requestInteface[] | null = result.val()
        if (requests != null) {
            const requestsArray = Object.values(requests!);
            return requestsArray
        } else {
            return []
        }
    } catch (error) {
        console.error('Error getting requests: ', error);
        return []
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
            newUser.status = UserStatusDictionary.NOT_ACTIVE
            newUser.lastSeen = Date.now()
            push(usersRef, newUser)
            return true
        }
    } catch (error) {
        console.error('Error getting requests: ', error);
        return null
    }
}

const signIn = async (email: string, password: string) => {
    let userLoginResult: userLoginInterface = {
        user: null,
        status: LoginStatusDictionary.UNKNOWN
    }
    try {
        const result = await get(usersRef);
        const users: userInteface | any = Object.values(result.val())

        const user = users.filter((user: userInteface) => user.email == email)[0]
        if (!user) {
            userLoginResult.status = LoginStatusDictionary.EMAIL_NOT_EXIST
        } else if (user.password != password) {
            userLoginResult.status = LoginStatusDictionary.WRONG_PASSWORD
        }
        else {
            userLoginResult.status = LoginStatusDictionary.SUCCESS
            userLoginResult.user = user

            result.forEach((child) => {
                const doc: userInteface = child.val();
                if (email == doc.email) {
                    const updatedDoc: userInteface = doc
                    updatedDoc.status = UserStatusDictionary.ACTIVE
                    updatedDoc.lastSeen = Date.now()
                    update(child.ref, updatedDoc);
                }
            })
        }
        return userLoginResult

    } catch (error) {
        return userLoginResult
    }
}

const signOut = async (email: string) => {
    try {
        const result = await get(usersRef);
        const users: userInteface | any = Object.values(result.val())

        const user = users.filter((user: userInteface) => user.email == email)[0]
        if (!user) {
            return false
        }

        result.forEach((child) => {
            const doc: userInteface = child.val();
            if (email == doc.email) {
                const updatedDoc: userInteface = doc
                updatedDoc.status = UserStatusDictionary.NOT_ACTIVE
                updatedDoc.lastSeen = Date.now()
                update(child.ref, updatedDoc);
            }
        })
        return true

    } catch (error) {
        return false
    }
}

const getUser = async (email: string) => {
    try {
        const result = await get(usersRef);
        const users: userInteface | any = Object.values(result.val())
        const user: userInteface = users.filter((user: userInteface) => user.email == email)[0]
        user.password = '********'
        return user

    } catch (error) {
        return null
    }
}

const getUsers = async () => {
    try {
        const result = await get(usersRef);
        return Object.values(result.val())
    } catch (error) {
        return null
    }
}

const updateRequestStatus = async (email: string, publishTime: number, status: StatusEnum, providerEmail?: string) => {
    try {
        let provider = null
        if (status == StatusEnum.PUBLISHED_WITH_PROVIDER_SEGGESTION && providerEmail != null) {
            console.log("provider")
            provider = providerEmail
        }
        const snapshot = await get(requestsRef);
        snapshot.forEach((childSnapshot) => {
            const doc: requestInteface = childSnapshot.val();
            if (doc.email === email) {
                const updateDoc: requestInteface = {
                    email: doc.email,
                    type: doc.type,
                    details: doc.details,
                    status: status,
                    publishTime: doc.publishTime,
                    provider: provider
                };
                update(childSnapshot.ref, updateDoc);
                console.log('Document updated successfully!');
            }
        });
    } catch (error) {
        return false
    }
}

const uploadFileToFirebaseStorage = async (email: string, localUri: string) => {
    try {
        const imagesRef = sRef(storage, `/${email}/image:${Date.now()}`)
        const response = await fetch(localUri);
        const blob = await response.blob();
        const snapshot = await uploadBytes(imagesRef, blob)
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

export default {
    addRequest,
    getRequests,
    signUp,
    signIn,
    signOut,
    getUser,
    updateRequestStatus,
    getUsers,
    uploadFileToFirebaseStorage
}
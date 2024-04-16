import React, { useState, useEffect } from 'react';
import Map from './src/Map';
import SignInBanner from "./src/SignInBanner";
import { StyleSheet, Alert, View, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from './constants/colors';
import SignInPage from './src/SignInPage';
import SignUpPage from './src/SignUpPage';
import { PagesDictionary } from './constants/PagesDictionary';
import JestaSelector from './src/JestaSelector'
import FixingJesta from './src/FixingJesta'
import SearchMap from './src/SearchMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Database from './src/Database';
import { StatusEnum } from './constants/StatusEnum';
import WaitingRequests from './src/WaitingRequests';
import { requestInteface } from './constants/Interfaces';

const App: React.FC = () => {

  const [pages, setPages] = useState<Pages[]>([])
  const [isSignedIn, setIsSignedIn] = useState<Boolean>(false)
  const [requestWaitingForApproval, setRequestWaitingForApproval] = useState<requestInteface[] | null>([])

  interface Pages {
    name: string,
    component: React.ComponentType<any>,
    isOpen: Boolean
  }

  const app_pages: Pages[] = [
    {
      name: PagesDictionary.SignInPage,
      component: SignInPage,
      isOpen: false
    },
    {
      name: PagesDictionary.SignUpPage,
      component: SignUpPage,
      isOpen: false
    },
    {
      name: PagesDictionary.FixingJesta,
      component: FixingJesta,
      isOpen: false
    },
    {
      name: PagesDictionary.WaitingRequests,
      component: WaitingRequests,
      isOpen: false
    }
  ]

  useEffect(() => {
    setPages(app_pages)
  }, [])

  const getRquestsWaiting = async () => {
    let requests: requestInteface[] | null = null
    Database.getRequestsWaitingForApproval().then((res) => {
      setRequestWaitingForApproval(res)
    })
  }

  useEffect(() => {
    if (isSignedIn) {
      getRquestsWaiting()
      setInterval(() => {
        getRquestsWaiting()
      }, 2000)
    }
  }, [isSignedIn])

  const openPage = (pageToOpen: string, toOpen: Boolean) => {
    let tempPages: Pages[] = pages
    tempPages.map((page) => {
      page.name == pageToOpen ? page.isOpen = toOpen : true
    })
    setPages([...tempPages])
  }

  const signOut = () => {
    
  }

  return (
    <View style={styles.container}>
      <Map></Map>
      {isSignedIn && requestWaitingForApproval != null ? <TouchableOpacity style={styles.waitingRequests} onPress={() => openPage(PagesDictionary.WaitingRequests, true)}>
        <View style={styles.requestsCount}><Text style={styles.requestsCountText}>{requestWaitingForApproval.length}</Text></View>
        <Image style={styles.requestsAvatar} source={require('./assets/jesta-avatar.png')}></Image>
      </TouchableOpacity> : false}
      {!isSignedIn ? <SignInBanner openPage={openPage}></SignInBanner> : false}
      {isSignedIn ? <JestaSelector openPage={openPage}></JestaSelector> : false}
      {pages.map((page, index) =>
        page.isOpen ? <page.component key={index} openPage={openPage} requests={requestWaitingForApproval} setIsSignedIn={() => setIsSignedIn(true)}/> : false
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingRequests: {
    position: 'absolute',
    bottom: '20%',
    left: '5%',
    width: 100,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  requestsAvatar: {
    resizeMode: 'contain',
    width: '80%',
    height: '80%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  requestsCount: {
    backgroundColor: colors.third,
    position: 'absolute',
    width: '35%',
    height: '35%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    left: 50,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  requestsCountText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600'
  }
});

export default App;
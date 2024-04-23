import React, { useState, useEffect, useContext } from 'react';
import Map from './src/Map';
import SignInBanner from "./src/SignInBanner";
import { StyleSheet, Alert, View, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from './constants/colors';
import SignInPage from './src/SignInPage';
import SignUpPage from './src/SignUpPage';
import { PagesDictionary } from './constants/PagesDictionary';
import JestaSelector from './src/JestaSelector'
import FixingJesta from './src/FixingJesta'
import Database from './src/Database';
import WaitingRequests from './src/WaitingRequests';
import { requestInteface, userInteface, userLoginInterface } from './constants/Interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './src/AuthContext';
import { LoginStatusDictionary } from './constants/LoginStatusDictionary';
import ViewFixingRequest from './src/ViewFixingRequest';
import { StatusEnum } from './constants/StatusEnum';
import ActiveJestaConsumerBanner from './src/ActiveJestaConsumerBanner';
import { UserStatusDictionary } from './constants/userStatusDictionary';

const Main: React.FC = () => {

  const [pages, setPages] = useState<Pages[]>([])
  const [requests, setRequests] = useState<requestInteface[] | null>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const { isAuthenticated, loggedUser, login, logout } = useAuth();
  const [activeUserRequest, setActiveUserRequest] = useState<requestInteface>()
  const [activeUsers, setActiveUsers] = useState<userInteface[]>()

  interface Pages {
    name: string,
    component: React.ComponentType<any>,
    isOpen: boolean
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

  const activeUsersInterval = () => {
    Database.getUsers().then((result) => {
      let users: userInteface[] | any = result
      users = users.filter((user: userInteface) => user.status == UserStatusDictionary.ACTIVE)
      setActiveUsers(users)
    })
  }

  useEffect(() => {
    setInterval(() => {
      activeUsersInterval()
    }, 3000)
  }, [])

  useEffect(() => {
    setPages(app_pages)
    checkRememberedUser()
  }, [])

  const getRquestsWaiting = async () => {
    Database.getRequestsWaitingForApproval().then((res) => {
      setRequests([...res])
      let loggedUserRequest = res!.filter((request) => request.email == loggedUser?.email &&
        request.status != StatusEnum.CANCELED_JESTA &&
        request.status != StatusEnum.JESTA_FINISHED)
      if (loggedUserRequest.length) {
        setActiveUserRequest(loggedUserRequest[0])
      }
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      getRquestsWaiting()
      setInterval(() => {
        getRquestsWaiting()
      }, 2000)
    }
  }, [isAuthenticated])

  const openPage = (pageToOpen: string, toOpen: boolean) => {
    let tempPages: Pages[] = pages
    tempPages.map((page) => {
      page.name == pageToOpen ? page.isOpen = toOpen : true
    })
    setPages([...tempPages])
  }

  const checkRememberedUser = async () => {
    const loggedEmail = await AsyncStorage.getItem('user_email')
    const loggedPassword = await AsyncStorage.getItem('user_password')
    if (loggedEmail?.length && loggedPassword?.length) {
      let result: userLoginInterface = await Database.signIn(loggedEmail, loggedPassword)
      if (result.status == LoginStatusDictionary.SUCCESS) {
        login(result.user!)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Map isSearching={isSearching} activeUsers={activeUsers!}></Map>
      {isAuthenticated && requests && requests!.filter((request) => request.status == StatusEnum.PUBLISHED_BEFORE_APPROVAL).length ? <TouchableOpacity style={styles.waitingRequests} onPress={() => openPage(PagesDictionary.WaitingRequests, true)}>
        <View style={styles.requestsCount}>
          <Text style={styles.requestsCountText}>{requests ? requests!.filter((request) => request.status == StatusEnum.PUBLISHED_BEFORE_APPROVAL).length : 0}</Text>
        </View>
        <Image style={styles.requestsAvatar} source={require('./assets/jesta-avatar.png')}></Image>
      </TouchableOpacity> : false}
      {!isAuthenticated ? <SignInBanner openPage={openPage}></SignInBanner> : false}
      {isAuthenticated ? <JestaSelector openPage={openPage}></JestaSelector> : false}
      {isAuthenticated && activeUserRequest ?
        <ActiveJestaConsumerBanner request={activeUserRequest}
          openPage={openPage}></ActiveJestaConsumerBanner> : false}
      {isAuthenticated ? <TouchableOpacity style={styles.menuButton} onPress={logout}>
        <Text style={styles.username}>{loggedUser?.firstName}</Text>
        <Image style={styles.logoutIcon} source={require('./assets/logout-icon.png')}></Image>
      </TouchableOpacity> : false}
      {pages.map((page, index) =>
        page.isOpen ? <page.component
          key={index}
          openPage={openPage}
          watingRequests={requests ? requests!.filter((request) => request.status == StatusEnum.PUBLISHED_BEFORE_APPROVAL) : []}
          startSearch={() => setIsSearching(true)}
          stopSearch={() => setIsSearching(false)} /> : false
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
  },
  menuButton: {
    position: 'absolute',
    top: '5%',
    left: 20,
    backgroundColor: colors.primary,
    height: 60,
    width: '30%',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    borderRadius: 8
  },
  logoutIcon: {
    resizeMode: 'contain',
    height: '60%',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '50%'
  },
  username: {
    color: 'white',
    fontSize: 26,
    alignSelf: 'center',
    width: '50%'
  }
});

export default Main;
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { requestInteface, UserInterface, UserLoginInterface, PageInterface } from './constants/Interfaces';
import { colors } from './constants/colors';
import { UserStatusDictionary } from './constants/userStatusDictionary';
import { PagesDictionary } from './constants/PagesDictionary';
import { LoginStatusDictionary } from './constants/LoginStatusDictionary';
import { StatusEnum } from './constants/StatusEnum';
import Map from './src/Map';
import SignInBanner from "./src/SignInBanner";
import SignInPage from './src/SignInPage';
import SignUpPage from './src/SignUpPage';
import JestaSelector from './src/JestaSelector'
import FixingJesta from './src/FixingJesta'
import Database from './src/Database';
import WaitingRequests from './src/WaitingRequests';
import ActiveJestaConsumerBanner from './src/ActiveJestaConsumerBanner';
import ViewProviderFound from './src/ViewProviderFound';
import { useAuth } from './src/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_PAGES: PageInterface[] = [
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

const Main: React.FC = () => {

  const [pages, setPages] = useState<PageInterface[]>([])
  const [requests, setRequests] = useState<requestInteface[] | null>([])
  const [activeUserRequest, setActiveUserRequest] = useState<requestInteface | null>()
  const [activeUsers, setActiveUsers] = useState<UserInterface[]>()
  const [providerSuggestionToView, setProviderSuggestionToView] = useState<requestInteface>()

  const { isAuthenticated, loggedUser, login, logout } = useAuth()

  const requestsIntervalRef = useRef<number | null>(null)
  const userIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    setPages(APP_PAGES)
    checkRememberedUser()
  }, [])

  useEffect(() => {
    if (requestsIntervalRef.current !== null) {
      clearInterval(requestsIntervalRef.current)
      requestsIntervalRef.current = null
    }

    if (isAuthenticated) {
      getRequestsWaiting()
      requestsIntervalRef.current = setInterval(() => {
        getRequestsWaiting()
      }, 2000) as any
    }

    return () => {
      if (requestsIntervalRef.current !== null) {
        clearInterval(requestsIntervalRef.current)
        requestsIntervalRef.current = null
      }
    }
  }, [isAuthenticated])


  useEffect(() => {
    if (userIntervalRef.current !== null) {
      clearInterval(userIntervalRef.current)
      userIntervalRef.current = null
    }

    getActiveUsers()
    userIntervalRef.current = setInterval(() => {
      getActiveUsers()
    }, 2000) as any

    return () => {
      if (userIntervalRef.current !== null) {
        clearInterval(userIntervalRef.current)
        userIntervalRef.current = null
      }
    }
  }, [isAuthenticated])

  const getActiveUsers = () => {
    Database.getUsers().then((result) => {
      let users: UserInterface[] | any = result
      users = users.filter((user: UserInterface) => user.status == UserStatusDictionary.ACTIVE)
      setActiveUsers(users)
    })
  }

  const getRequestsWaiting = async () => {
    Database.getRequests().then((res) => {
      setRequests([...res])
      const loggedUserRequest = res!.find((request) => request.email == loggedUser?.email &&
        request.status != StatusEnum.CANCELED_JESTA &&
        request.status != StatusEnum.JESTA_FINISHED)
      if (loggedUserRequest) {
        setActiveUserRequest(loggedUserRequest)
      } else {
        setActiveUserRequest(null)
      }
    })
  }

  const openPage = (pageToOpen: string, toOpen: boolean) => {
    let tempPages: PageInterface[] = pages
    tempPages.map((page) => {
      page.name == pageToOpen ? page.isOpen = toOpen : true
    })
    setPages([...tempPages])
  }

  const checkRememberedUser = async () => {
    const loggedEmail = await AsyncStorage.getItem('user_email')
    const loggedPassword = await AsyncStorage.getItem('user_password')
    if (loggedEmail?.length && loggedPassword?.length) {
      let result: UserLoginInterface = await Database.signIn(loggedEmail, loggedPassword)
      if (result.status == LoginStatusDictionary.SUCCESS) {
        login(result.user!)
      }
    }
  }

  const waitingRequests = () => {
    if (requests && requests.length) {
      return requests!.filter((request) =>
        request.status == StatusEnum.PUBLISHED_BEFORE_APPROVAL &&
        request.email != loggedUser?.email)
    } else {
      return []
    }
  }

  return (
    <View style={styles.container} id='main'>
      <Map
        isSearching={activeUserRequest?.status === StatusEnum.PUBLISHED_BEFORE_APPROVAL}
        activeUsers={activeUsers!}
        providerEmail={activeUserRequest?.status == StatusEnum.ACTIVE_JESTA ? activeUserRequest?.provider! : ''} />
      {isAuthenticated ?
        <TouchableOpacity id='logout-button' style={styles.menuButton}>
          <Text style={styles.username}>{loggedUser?.firstName}</Text>
          <Image style={styles.profilePicture} source={require('./assets/avatar.png')}></Image>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Image style={styles.logoutIcon} source={require('./assets/logout-icon.png')} ></Image>
          </TouchableOpacity>
        </TouchableOpacity>
        : false}
      {isAuthenticated && waitingRequests().length ?
        <TouchableOpacity id='waiting-requests-button' style={styles.waitingRequests} onPress={() => openPage(PagesDictionary.WaitingRequests, true)}>
          <View style={styles.requestsCount}>
            <Text style={styles.requestsCountText}>{waitingRequests().length}</Text>
          </View>
          <Image style={styles.requestsAvatar} source={require('./assets/jesta-avatar.png')}></Image>
        </TouchableOpacity>
        : false}
      {!isAuthenticated ?
        <SignInBanner openPage={openPage} />
        : false}
      {isAuthenticated ?
        <JestaSelector openPage={openPage} />
        : false}
      {isAuthenticated && activeUserRequest ?
        <ActiveJestaConsumerBanner
          request={activeUserRequest}
          openPage={openPage}
          ViewProvider={setProviderSuggestionToView} />
        : false}
      {providerSuggestionToView ?
        <ViewProviderFound
          request={providerSuggestionToView}
          close={() => setProviderSuggestionToView(undefined)}
        />
        : false}
      {pages.map((page, index) =>
        page.isOpen ?
          <page.component
            key={index}
            openPage={openPage}
            watingRequests={requests ? requests!.filter((request) => request.status == StatusEnum.PUBLISHED_BEFORE_APPROVAL && request.email != loggedUser?.email) : []} />
          : false
      )}
    </View>
  )
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
    backgroundColor: colors.background,
    height: '6%',
    width: '50%',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    borderRadius: 50,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  logoutButton: {
    resizeMode: 'contain',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '25%',
  },
  logoutIcon: {
    resizeMode: 'contain',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
    transform: [{ rotate: '180deg' }],
  },
  profilePicture: {
    resizeMode: 'contain',
    height: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '25%',

  },
  username: {
    color: colors.secondary,
    fontSize: 26,
    alignSelf: 'center',
    width: '50%',
    padding: 2
  }
})

export default Main
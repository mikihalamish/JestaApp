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
import { requestInteface, userInteface, userLoginInterface, PageInterface } from './constants/Interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './src/AuthContext';
import { LoginStatusDictionary } from './constants/LoginStatusDictionary';
import ViewFixingRequest from './src/ViewFixingRequest';
import { StatusEnum } from './constants/StatusEnum';
import ActiveJestaConsumerBanner from './src/ActiveJestaConsumerBanner';
import { UserStatusDictionary } from './constants/userStatusDictionary';
import ViewProviderFound from './src/ViewProviderFound';

const Main: React.FC = () => {

  const [pages, setPages] = useState<PageInterface[]>([])
  const [requests, setRequests] = useState<requestInteface[] | null>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const { isAuthenticated, loggedUser, login, logout } = useAuth();
  const [activeUserRequest, setActiveUserRequest] = useState<requestInteface | null>()
  const [activeUsers, setActiveUsers] = useState<userInteface[]>()
  const [providerSuggestionToView, setProviderSuggestionToView] = useState<requestInteface>()

  const app_pages: PageInterface[] = [
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
    Database.getRequests().then((res) => {
      setRequests([...res])
      const loggedUserRequest = res!.find((request) => request.email == loggedUser?.email &&
        request.status != StatusEnum.CANCELED_JESTA &&
        request.status != StatusEnum.JESTA_FINISHED)
      if (loggedUserRequest) {
        /* if (loggedUserRequest.status == StatusEnum.PUBLISHED_WITH_PROVIDER_SEGGESTION && activeUserRequest?.status == StatusEnum.PUBLISHED_BEFORE_APPROVAL) {
          Alert.alert("You Have An Update", "someone approved your Jesta!")
        }
        if (activeUserRequest?.status == StatusEnum.PUBLISHED_WITH_PROVIDER_SEGGESTION && loggedUserRequest.status == StatusEnum.ACTIVE_JESTA) {
          Alert.alert("You Have An Update", "Your Jesta is on the way!")
        } */
        setActiveUserRequest(loggedUserRequest)
      } else {
        setActiveUserRequest(null)
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
      let result: userLoginInterface = await Database.signIn(loggedEmail, loggedPassword)
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
    <View style={styles.container}>
      <Map
        isSearching={(activeUserRequest != null && activeUserRequest.status == StatusEnum.PUBLISHED_BEFORE_APPROVAL)}
        activeUsers={activeUsers!} 
        providerEmail={activeUserRequest?.status == StatusEnum.ACTIVE_JESTA ? activeUserRequest?.provider! : ''}/>
      {isAuthenticated && waitingRequests().length ?
        <TouchableOpacity style={styles.waitingRequests} onPress={() => openPage(PagesDictionary.WaitingRequests, true)}>
          <View style={styles.requestsCount}>
            <Text style={styles.requestsCountText}>{requests ? waitingRequests().length : 0}</Text>
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
      {isAuthenticated ?
        <TouchableOpacity style={styles.menuButton} onPress={logout}>
          <Text style={styles.username}>{loggedUser?.firstName}</Text>
          <Image style={styles.profilePicture} source={require('./assets/avatar.png')}></Image>
          <Image style={styles.logoutIcon} source={require('./assets/logout-icon.png')}></Image>
        </TouchableOpacity>
        : false}
      {pages.map((page, index) =>
        page.isOpen ?
          <page.component
            key={index}
            openPage={openPage}
            watingRequests={requests ? requests!.filter((request) => request.status == StatusEnum.PUBLISHED_BEFORE_APPROVAL) : []}
            startSearch={() => setIsSearching(true)}
            stopSearch={() => setIsSearching(false)} />
          : false
      )}
      {providerSuggestionToView ?
        <ViewProviderFound
          request={providerSuggestionToView}
          close={() => setProviderSuggestionToView(undefined)}
        />
        : false}
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
  logoutIcon: {
    resizeMode: 'contain',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '25%',
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
});

export default Main;
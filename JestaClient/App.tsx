import React, { useState, useEffect } from 'react';
import Map from './src/Map';
import SignInBanner from "./src/SignInBanner";
import { StyleSheet, Alert, View } from 'react-native';
import { colors } from './constants/colors';
import SignInPage from './src/SignInPage';
import SignUpPage from './src/SignUpPage';
import { PagesDictionary } from './constants/PagesDictionary';
import JestaSelector from './src/JestaSelector'
import FixingJesta from './src/FixingJesta'
import SearchMap from './src/SearchMap';

const App: React.FC = () => {

  const [pages, setPages] = useState<Pages[]>([])
  const [isSignedIn, setIsSignedIn] = useState<Boolean>(false)

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
      name: PagesDictionary.FixingJestaPage,
      component: FixingJesta,
      isOpen: false
    }
  ]

  useEffect(() => {
    setPages(app_pages)
  }, [])

  const openPage = (pageToOpen: string, toOpen: Boolean) => {
    let tempPages: Pages[] = pages
    tempPages.map((page) => {
      page.name == pageToOpen ? page.isOpen = toOpen : true
    })
    setPages([...tempPages])
  }

  const handleLogin = () => {
    // TODO: verify user
    Alert.alert('Signed In');
    setIsSignedIn(true)
    openPage(PagesDictionary.SignInPage, false)
  };

  return (
    <View style={styles.container}>
      <Map></Map>
      {/* <SearchMap></SearchMap> */}
      {!isSignedIn ? <SignInBanner openPage={openPage}></SignInBanner> : false}
      {isSignedIn ? <JestaSelector openPage={openPage}></JestaSelector> : false}
      {pages.map((page, index) =>
        page.isOpen ? <page.component key={index} openPage={openPage} handleLogin={handleLogin} /> : false
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
});

export default App;
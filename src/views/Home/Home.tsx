// ** React Imports
import { useState, Fragment, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { useAuth } from 'src/hooks/useAuth'

import Footer from './Footer'
import Setting from '../Setting/Setting'
import Index from '../Index/Index'
import Application from '../Application/Application'
import Login from '../Login/Login'
import MyCourses from '../AiChat/MyCourses'
import AllAiApp from '../AiChat/AllAiApp'

import { useTranslation } from 'react-i18next'
import { getConfig, defaultConfig } from 'src/configs/auth'

const Home = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const refresh = auth.refresh
  const user:any = auth.user

  const [currentTab, setCurrentTab] = useState<string>('Loading')
  const [loadingText, setLoadingText] = useState<string>('')
  const [menuArray, setMenuArray] = useState<any[]>([])

  const [authConfig, setAuthConfig] = useState<any>(null)

  useEffect(() => {
    const AppMarkId = window.localStorage.getItem('AppMarkId')
    if(AppMarkId)  {
      setAuthConfig(getConfig('@'+AppMarkId))
    }
  }, []);

  useEffect(() => {

    const refreshUserToken = async () => {
      try {
        if (user) {
          refresh(user)
        }
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    refreshUserToken();

    const loadingFirstTime = async () => {
      setLoadingText(t('Login Tip') as string)
      setTimeout(() => {
        if (user) {
          setCurrentTab("Application")
        }
        else {
          setCurrentTab("Login")
        }
      }, 2000);
    }
    loadingFirstTime();

    const intervalId = setInterval(refreshUserToken, 3600000); // 1 hour refresh the user token

    return () => {
      clearInterval(intervalId);
    }

  }, []);


  const handleLogout = () => {
    setLoadingText(t('Logout Tip') as string)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('GO_SYSTEM')
    window.localStorage.removeItem(defaultConfig.storageTokenKeyName)
    setCurrentTab("Login")
  }

  //console.log("currentTab - 60", currentTab)

  return (
    <Fragment>
      {currentTab == "Loading" && (
        <Grid item xs={12} sm={12} container justifyContent="space-around">
            <Box sx={{ mt: 60, mb: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CircularProgress
                  sx={{
                    width: '60px !important',
                    height: '60px !important',
                  }}
                />
                <Typography sx={{mt: 10}}>{loadingText}</Typography>
            </Box>
        </Grid>
      )}
      {currentTab == "Login" && (<Login setCurrentTab={setCurrentTab} authConfig={authConfig} setAuthConfig={setAuthConfig} />)}
      {currentTab == "MyCourse" && (<MyCourses setCurrentTab={setCurrentTab} authConfig={authConfig} setAuthConfig={setAuthConfig} />)}
      {currentTab == "AiChat" && (<AllAiApp setCurrentTab={setCurrentTab} authConfig={authConfig} setAuthConfig={setAuthConfig} />)}
      {currentTab == "Setting" && (<Setting handleLogout={handleLogout} menuArray={menuArray} authConfig={authConfig} />)}
      {currentTab == "Index" && (<Index menuArray={menuArray} setMenuArray={setMenuArray} authConfig={authConfig} />)}
      {currentTab == "Application" && (<Application menuArray={menuArray} setMenuArray={setMenuArray} authConfig={authConfig} />)}
      {currentTab != "Loading" && currentTab != "Login" && (<Footer Hidden={false} setCurrentTab={setCurrentTab} currentTab={currentTab} authConfig={authConfig} />)}
    </Fragment>
  )
}

export default Home

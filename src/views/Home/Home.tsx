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
import Login from '../Login/Login'
import { useTranslation } from 'react-i18next'
import authConfig from '../../configs/auth'

const Home = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const refresh = auth.refresh
  const user:any = auth.user

  const [currentTab, setCurrentTab] = useState<string>('Loading')
  const [loadingText, setLoadingText] = useState<string>('')
  const [menuArray, setMenuArray] = useState<any[]>([])

  useEffect(() => {

    const refreshUserToken = async () => {
      try {
        if (user) {
          refresh(user)
        }

        //console.log("当前用户状态: ", user)
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
          setCurrentTab("Index")
        }
        else {
          setCurrentTab("Login")
        }
      }, 2000);
    }
    loadingFirstTime();

    const intervalId = setInterval(refreshUserToken, 3000); // 1 hour refresh the user token

    return () => {
      clearInterval(intervalId);
    }

  }, []);

  const handleLogout = () => {
    setLoadingText(t('Logout Tip') as string)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('GO_SYSTEM')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
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
      {currentTab == "Login" && (<Login setCurrentTab={setCurrentTab} />)}
      {currentTab == "Setting" && (<Setting handleLogout={handleLogout} menuArray={menuArray} />)}
      {currentTab == "Index" && (<Index menuArray={menuArray} setMenuArray={setMenuArray} />)}
      {currentTab != "Loading" && currentTab != "Login" && (<Footer Hidden={false} setCurrentTab={setCurrentTab} currentTab={currentTab} />)}
    </Fragment>
  )
}

export default Home

// ** React Imports
import { useState, Fragment, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { useAuth } from 'src/hooks/useAuth'

import Footer from '../Layout/Footer'
import MyProfile from '../Setting/MyProfile'
import Index from '../Index/Index'
import Login from '../Login/Login'

const Home = () => {
  const auth = useAuth()
  const logout = auth.logout
  const refresh = auth.refresh
  const user:any = auth.user

  const [currentTab, setCurrentTab] = useState<string>('Loading')

  useEffect(() => {

    const refreshUserToken = async () => {
      try {
        if (user) {
          refresh(user)
        }
        console.log("当前用户状态: ", user)
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    refreshUserToken();

    const loadingFirstTime = async () => {
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

    const intervalId = setInterval(refreshUserToken, 6000);

    return () => {
      clearInterval(intervalId);
    }

  }, []);

  console.log("currentTab - 60", currentTab)

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
                <Typography sx={{mt: 10}}>{'用户身份校验中，请稍等'}</Typography>
            </Box>
        </Grid>
      )}
      {currentTab == "Login" && (<Login setCurrentTab={setCurrentTab} />)}
      {currentTab == "MyProfile" && (<MyProfile logout={logout} />)}
      {currentTab == "Index" && (<Index />)}
      {currentTab != "Loading" && currentTab != "Login" && (<Footer Hidden={false} setCurrentTab={setCurrentTab} currentTab={currentTab} />)}

    </Fragment>
  )
}

export default Home

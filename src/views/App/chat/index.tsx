// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import ChatIndex from 'src/views/App/chat/ChatIndex'

// ** Axios Imports
import axios from 'axios'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { defaultConfig } from 'src/configs/auth'

const Chat = ({authConfig}: any) => {
  // ** States
  const [app, setApp] = useState<any>(null)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const auth = useAuth()
  const router = useRouter()
  const { id } = router.query

  const [userType, setUserType] = useState<string>('')

  const getMyApp = async function (id: string) {
    if (auth && auth.user && id) {
      const authorization = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
      setUserType('User')
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getapp', {appId: id}, { headers: { Authorization: authorization, 'Content-Type': 'application/json'} }).then(res=>res.data)
      setApp(RS)
    }
  }

  useEffect(() => {
    if(id) {
      getMyApp(String(id))
    }
  }, [id])

  // ** Vars
  const { skin } = settings

  return (
    <Fragment>
      {auth.user && app ?
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >
        <ChatIndex app={app} userType={userType}/>

      </Box>
      :
      null
      }
    </Fragment>
  )
}

export default Chat


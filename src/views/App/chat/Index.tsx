// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import ChatIndex from 'src/views/App/chat/ChatIndex'

const Chat = ({authConfig, app}: any) => {

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings

  return (
    <Fragment>
      {app && authConfig && (<Box
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
                <ChatIndex authConfig={authConfig} app={app}/>
              </Box>
      )}
    </Fragment>
  )
}

export default Chat

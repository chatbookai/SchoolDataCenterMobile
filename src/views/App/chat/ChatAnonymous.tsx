// ** React Imports
import { useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import ChatIndex from 'src/views/App/chat/ChatIndex'

const ChatAnonymous = ({authConfig, app}: any) => {
    // ** States

    const theme = useTheme()
    const { settings } = useSettings()
    const { skin } = settings

    return (
        <Fragment>
          <Box
            className='app-chat'
            sx={{
              width: '100%',
              height: '100vh',
              display: 'flex',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: 'background.paper',
              boxShadow: skin === 'bordered' ? 0 : 6,
              ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
            }}
          >
            {app && app.id && <ChatIndex app={app} userType={'Anonymous'} authConfig={authConfig}/> }
          </Box>
        </Fragment>
    )
}

export default ChatAnonymous

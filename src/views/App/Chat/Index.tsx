// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import ChatIndex from 'src/views/App/Chat/ChatIndex'

const Chat = ({authConfig, app}: any) => {

  // ** Hooks
  const { settings } = useSettings()
  const { skin } = settings

  const [innerHeight, setInnerHeight] = useState<number | string>(window.innerHeight)
  console.log("innerHeight innerHeight",innerHeight)

  useEffect(() => {
    const handleResize = () => {
        setInnerHeight(window.innerHeight);
    };

    handleResize();

  }, []);

  return (
    <Fragment>
      {app && authConfig && (
        <div style={{ height: '776px', width: '100vw' }}>
          <Box
            className='app-chat'
            sx={{
              width: `calc(100% - 32px)`,
              height: `calc(100% - 10px)`,
              display: 'flex',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: 'background.paper',
              boxShadow: skin === 'bordered' ? 0 : 6,
            }}
          >
            <ChatIndex authConfig={authConfig} app={app}/>
          </Box>
          </div>
      )}
    </Fragment>
  )
}

export default Chat


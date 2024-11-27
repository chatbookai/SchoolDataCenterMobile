import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'

import Icon from '../../@core/components/icon'

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import { useTranslation } from 'react-i18next'

const Footer = (props: any) => {
  const { t } = useTranslation()
  const { footer, setCurrentTab, authConfig } = props

  const [value, setValue] = useState(2);

  if (footer === 'hidden') {
    return null
  }

  return (
      <Box
        component='footer'
        sx={{
          width: '100%',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 0,
          position: 'fixed',
          overflow: 'visible',
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            console.log("FooterContent event", newValue)
            switch(newValue) {
              case 0:
                setCurrentTab('Index')
                break;
              case 1:
                setCurrentTab('AiChat')
                break;
              case 2:
                setCurrentTab('Application')
                break;
              case 3:
                setCurrentTab('Message')
                break;
              case 4:
                setCurrentTab('Setting')
                break;
            }
          }}
          sx={{width: '100%'}}
        >
          <BottomNavigationAction label={t("Index") as string} icon={<Icon icon='material-symbols:home-work-outline' />} />
          <BottomNavigationAction label={t("AI辅助") as string} icon={<Icon icon='ph:open-ai-logo-light' />} />
          <BottomNavigationAction
            label={t("Apps") as string}
            icon={
              <img
                src={authConfig.AppLogo}
                alt={t('Apps') as string}
                style={{
                  width: '3.5rem', // 控制图片的宽度
                  height: '3.5rem', // 控制图片的高度
                  objectFit: 'cover', // 确保图片按比例缩放并覆盖整个区域
                }}
              />
            }
            sx={{
              position: 'relative',
              bottom: '1rem',
            }}
          />
          <BottomNavigationAction label={t("Message") as string} icon={<Icon icon='mdi:message-processing-outline' />} />
          <BottomNavigationAction label={t("Setting") as string} icon={<Icon icon='mdi:settings-outline' />} />
        </BottomNavigation>
      </Box>
  )
}


export default Footer

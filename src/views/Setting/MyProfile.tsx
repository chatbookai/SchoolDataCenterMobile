// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** MUI Imports
import Icon from '../../@core/components/icon'
import authConfig from '../../configs/auth'
import { useSettings } from '../../@core/hooks/useSettings'

import { styled } from '@mui/material/styles'
import Header from '../Layout/Header'
import TermsofUse from './TermsofUse'
import PrivacyPolicy from './PrivacyPolicy'
import Link from 'next/link'

import { useTranslation } from 'react-i18next'

import { getUserLanguage, setUserLanguage  } from 'src/configs/functions'


const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const MyProfile = ({  }: any) => {

  // ** Hook
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()

  const contentHeightFixed = {}
  const [counter, setCounter] = useState<number>(0)

  const [pageModel, setPageModel] = useState<string>('MyProfile')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('')
  const [Title, setTitle] = useState<string>('我的资料')
  const [RightButtonText, setRightButtonText] = useState<string>('')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('')

  const [languageValue, setLanguageValue] = useState<string>(getUserLanguage())
  const [themeValue, setThemeValue] = useState<string>(settings.mode)

  const LanguageArray = [
    {name:'English', value:'en'},
    {name:'Chinese', value:'zh-CN'},
    {name:'Korean', value:'Kr'},
    {name:'Russia', value:'Ru'}
  ]

  const themeArray = [
    {name:'Dark', value:'dark'},
    {name:'Light', value:'light'}
  ]

  const handleWalletGoHome = () => {
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('MyProfile')
    setLeftIcon('')
    setTitle('MyProfile')
    setRightButtonText('QR')
    setRightButtonIcon('')
  }

  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'MyProfile':
        handleWalletGoHome()
        break
      case 'General':
      case 'Support':
      case 'SecurityPrivacy':
        handleWalletGoHome()
        break
      case 'Language':
        handleClickGeneralButton()
        break
      case 'Theme':
        handleClickGeneralButton()
        break
      case 'PrivacyPolicy':
      case 'TermsOfUse':
        handleClickSecurityPrivacyButton()
        break
    }
  }

  const RightButtonOnClick = () => {
    switch(pageModel) {
        case 'Contacts':
          break
      }
  }

  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  useEffect(() => {
    i18n.changeLanguage(getUserLanguage())
    setHeaderHidden(false)
    setRightButtonIcon('')
  }, []);

  const handleClickSecurityPrivacyButton = () => {
    setCounter(counter + 1)
    setPageModel('SecurityPrivacy')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle('Security & Privacy')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickGeneralButton = () => {
    setCounter(counter + 1)
    setPageModel('General')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle('General Setting')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickLanguageButton = () => {
    setCounter(counter + 1)
    setPageModel('Language')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Language') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickThemeButton = () => {
    setCounter(counter + 1)
    setPageModel('Theme')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle('Theme')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleSelectLanguage = (Language: 'en' | 'zh-CN' | 'Ru' | 'Kr') => {
    setLanguageValue(Language)
    setTitle(Language)
    i18n.changeLanguage(Language)
    setUserLanguage(Language)
  }

  const handleSelectTheme = (Theme: string) => {
    console.log("Theme", Theme)
    setThemeValue(Theme)
    setTitle(Theme)

    //@ts-ignore
    saveSettings({ ...settings, ['mode']: Theme })
  }

  const handleClickTermsOfUseButton = () => {
    setPageModel('TermsOfUse')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle('Terms of Use')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickPrivacyPolicyButton = () => {
    setPageModel('PrivacyPolicy')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle('Privacy Policy')
    setRightButtonText('')
    setRightButtonIcon('')
  }


  return (
    <Fragment>
      <Header Hidden={HeaderHidden} LeftIcon={LeftIcon} LeftIconOnClick={LeftIconOnClick} Title={Title} RightButtonText={RightButtonText} RightButtonOnClick={RightButtonOnClick} RightButtonIcon={RightButtonIcon}/>

      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          marginTop: '35px', // Adjust according to the height of the AppBar
          marginBottom: '56px', // Adjust according to the height of the Footer
          paddingTop: 'env(safe-area-inset-top)'
        }}
      >
        <ContentWrapper
            className='layout-page-content'
            sx={{
                ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: `calc(100% - 104px)` }
                })
            }}
            >

            {pageModel == 'MyProfile' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickGeneralButton()}>
                                    <Icon icon='oui:integration-general' fontSize={38} />
                                </IconButton>
                                <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickGeneralButton()}
                                    >
                                    <Typography sx={{
                                      color: 'text.primary',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                    >
                                    {t('General')}
                                    </Typography>
                                    <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{
                                        color: `secondary.primary`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1
                                    }}>
                                        {t('Edit language, currency and theme')}
                                    </Typography>
                                    </Box>
                                </Box>
                                <Box textAlign="right">
                                    <IconButton sx={{ p: 0 }} onClick={()=>handleClickGeneralButton()}>
                                        <Icon icon='mdi:chevron-right' fontSize={30} />
                                    </IconButton>
                                </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickSecurityPrivacyButton()}>
                                <Icon icon='mdi:security-lock-outline' fontSize={34} />
                              </IconButton>
                              <Box sx={{ cursor: 'pointer', ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickSecurityPrivacyButton()}
                                >
                                <Typography sx={{
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Security & Privacy')}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{
                                    color: `secondary.primary`,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {t('Management applications, etc')}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickSecurityPrivacyButton()}>
                                    <Icon icon='mdi:chevron-right' fontSize={30} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>null}>
                                <Icon icon='material-symbols:help-outline' fontSize={34} />
                              </IconButton>
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>null}
                                >
                                <Typography sx={{
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Version')}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{
                                    color: `secondary.primary`,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {authConfig.AppVersion}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>null}>
                                <Icon icon='material-symbols:logout' fontSize={34} />
                              </IconButton>
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>null}
                                >
                                <Typography sx={{
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Logout')}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{
                                    color: `secondary.primary`,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {authConfig.AppVersion}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                    </Grid>
                </Grid>
              </Grid>
            )}

            {pageModel == 'General' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickLanguageButton()}>
                                    <Icon icon='clarity:language-line' fontSize={38} />
                                </IconButton>
                                <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickLanguageButton()}
                                    >
                                    <Typography sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    }}
                                    >
                                    {t('Language') as string}
                                    </Typography>
                                    <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{
                                        color: `secondary.primary`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1
                                    }}>
                                        {t('Language') as string}
                                    </Typography>
                                    </Box>
                                </Box>
                                <Box textAlign="right">
                                    <IconButton sx={{ p: 0 }} onClick={()=>handleClickLanguageButton()}>
                                        <Icon icon='mdi:chevron-right' fontSize={30} />
                                    </IconButton>
                                </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickThemeButton()}>
                                <Icon icon='line-md:light-dark' fontSize={34} />
                              </IconButton>
                              <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickThemeButton()}
                                >
                                <Typography sx={{
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Theme')}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{
                                    color: `secondary.primary`,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {t('Theme')}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickThemeButton()}>
                                    <Icon icon='mdi:chevron-right' fontSize={30} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                    </Grid>
                </Grid>
              </Grid>
            )}

            {pageModel == 'SecurityPrivacy' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickTermsOfUseButton()}>
                                    <Icon icon='mdi:text-box-outline' fontSize={38} />
                                </IconButton>
                                <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickTermsOfUseButton()}
                                    >
                                    <Typography sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    }}
                                    >
                                    {t('Terms of Use')}
                                    </Typography>
                                    <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{
                                        color: `secondary.primary`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1
                                    }}>
                                        {t('Terms of Use')}
                                    </Typography>
                                    </Box>
                                </Box>
                                <Box textAlign="right">
                                    <IconButton sx={{ p: 0 }} onClick={()=>handleClickTermsOfUseButton()}>
                                        <Icon icon='mdi:chevron-right' fontSize={30} />
                                    </IconButton>
                                </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickPrivacyPolicyButton()}>
                                    <Icon icon='iconoir:privacy-policy' fontSize={38} />
                                </IconButton>
                                <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickPrivacyPolicyButton()}
                                    >
                                    <Typography sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    }}
                                    >
                                    {t('Privacy Policy')}
                                    </Typography>
                                    <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{
                                        color: `secondary.primary`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1
                                    }}>
                                        {t('Privacy Policy')}
                                    </Typography>
                                    </Box>
                                </Box>
                                <Box textAlign="right">
                                    <IconButton sx={{ p: 0 }} onClick={()=>handleClickPrivacyPolicyButton()}>
                                        <Icon icon='mdi:chevron-right' fontSize={30} />
                                    </IconButton>
                                </Box>
                            </Box>
                          </Card>
                        </Grid>
                    </Grid>
                </Grid>
              </Grid>
            )}

            {pageModel == 'Language' && (
                <Grid container spacing={2}>

                    <RadioGroup row value={'value'}  sx={{width: '100%', mt: 1}} onClick={(e: any)=>e.target.value && handleSelectLanguage(e.target.value)}>
                        {LanguageArray.map((Language: any, index: number) => {

                            return (
                                <Grid item xs={12} sx={{ py: 1 }} key={index}>
                                    <Card sx={{ml: 2}}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                            <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%', ml: 2 }} onClick={()=>handleSelectLanguage(Language.value)}>
                                                <Typography sx={{ color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }} >
                                                    {Language.name}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right" sx={{m: 0, p: 0}}>
                                                <FormControlLabel value={Language.value} control={<Radio sx={{justifyContent: 'center', ml: 3, mr: 0}} checked={languageValue == Language.value}/>} label="" />
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )

                        })}
                    </RadioGroup>

                </Grid>
            )}

            {pageModel == 'Theme' && (
                <Grid container spacing={2}>

                    <RadioGroup row value={'value'}  sx={{width: '100%', mt: 1}} onClick={(e: any)=>e.target.value && handleSelectTheme(e.target.value)}>
                        {themeArray.map((Theme: any, index: number) => {

                            return (
                                <Grid item xs={12} sx={{ py: 1 }} key={index}>
                                    <Card sx={{ml: 2}}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                            <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%', ml: 2 }}  onClick={()=>handleSelectTheme(Theme.value)}>
                                                <Typography sx={{ color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }} >
                                                    {t(Theme.name)}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right" sx={{m: 0, p: 0}}>
                                                <FormControlLabel value={Theme.value} control={<Radio sx={{justifyContent: 'center', ml: 3, mr: 0}} checked={themeValue == Theme.value}/>} label="" />
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )

                        })}
                    </RadioGroup>

                </Grid>
            )}

            {pageModel == 'PrivacyPolicy' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <PrivacyPolicy />
                </Grid>
              </Grid>
            )}

            {pageModel == 'TermsOfUse' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TermsofUse />
                </Grid>
              </Grid>
            )}

        </ContentWrapper>
      </Box>
    </Fragment>
  )
}

export default MyProfile

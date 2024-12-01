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
import { useSettings } from '../../@core/hooks/useSettings'

import { styled } from '@mui/material/styles'
import Header from '../Home/Header'
import TermsofUse from './TermsofUse'
import PrivacyPolicy from './PrivacyPolicy'
import MyProfileDetail from './MyProfileDetail'

import { useTranslation } from 'react-i18next'

import { getUserLanguage, setUserLanguage  } from 'src/configs/functions'

import EngineeModelApp from "src/views/Enginee/index"

import { defaultConfig } from 'src/configs/auth'

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

const Setting = ({ handleLogout, menuArray, authConfig }: any) => {

  // ** Hook
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()

  const contentHeightFixed = {}
  const [counter, setCounter] = useState<number>(0)

  const [pageModel, setPageModel] = useState<string>('Setting')
  const [previousPageModel, setPreviousPageModel] = useState<string[]>([])
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('')
  const [Title, setTitle] = useState<string>(t('Setting') as string)
  const [TitleOriginal, setTitleOriginal] = useState<string>(t('Setting') as string)
  const [RightButtonText, setRightButtonText] = useState<string>('')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('')
  const [RightButtonIconOriginal, setRightButtonIconOriginal] = useState<string>('')

  const [languageValue, setLanguageValue] = useState<string>(getUserLanguage())
  const [themeValue, setThemeValue] = useState<string>(settings.mode)
  const [appItemId, setAppItemId] = useState<string>('')

  const [actionInMobileApp, setActionInMobileApp] = useState<string>('20241108')

  const myProfileMenus = menuArray && menuArray.length > 0 && menuArray.filter((Item: any) => Item && Item.title && Item.title == '我的事务')
  const basicDataMenus = menuArray && menuArray.length > 0 && menuArray.filter((Item: any) => Item && Item.title && Item.title == '基础数据')
  const systemSettingMenus = menuArray && menuArray.length > 0 && menuArray.filter((Item: any) => Item && Item.title && Item.title == '系统设置')

  const LanguageArray = [
    {name:'English', value:'en'},
    {name:'Chinese', value:'zh-CN'}
  ]

  const themeArray = [
    {name:'Dark', value:'dark'},
    {name:'Light', value:'light'}
  ]

  const handleSetRightButtonIconOriginal = (RightButtonIconOriginal: string) => {
    setRightButtonIconOriginal(RightButtonIconOriginal)
    setRightButtonIcon(RightButtonIconOriginal)
  }

  const handleGoAppItem = (item: any, previousModel: string) => {
    console.log("itemitem", item)
    if(item.path.startsWith('/apps/')) {
      setAppItemId(`apps/apps_${item.path.replace('/apps/', '').replace('/tab/apps_', '')}.php`)
    }
    else if(item.path.startsWith('/user/password')) {
      setAppItemId(`user_password.php`)
    }
    setCounter(counter + 1)
    setPageModel('EngineeModelApp')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(item.title)
    setTitleOriginal(item.title)
    setRightButtonText('')
    setRightButtonIcon('')
    setPreviousPageModel((preV: any)=>[...preV, previousModel])
  }

  const handleActionInMobileApp = (action: string, title: string, formAction = '') => {
    if(formAction == 'GoPageList')  { //当新建或编辑的表单提交以后, 会返回一个值, 表示已经提交, 这个时候需要返回到页面列表
      setPreviousPageModel((preV: any)=>[preV[0]])
    }
    else { //当在页面列表里面时, 点击查看, 编辑, 新建时的操作处理
      console.log("actionactionactionaction", action, "--actionInMobileApp", actionInMobileApp)
      if(action == 'add_default') {
        setRightButtonIcon('')
        setPreviousPageModel((preV: any)=>[...preV, action])
        setPageModel('EngineeModelApp')
        setLeftIcon('ic:twotone-keyboard-arrow-left')
        setTitle(title)
        setRightButtonText('')
      }
      if(action == 'edit_default') {
        setRightButtonIcon('')
        setPreviousPageModel((preV: any)=>[...preV, action])
        setPageModel('EngineeModelApp')
        setLeftIcon('ic:twotone-keyboard-arrow-left')
        setTitle(title)
        setRightButtonText('')
      }
      if(action == 'view_default') {
        setRightButtonIcon('')
        setPreviousPageModel((preV: any)=>[...preV, action])
        setPageModel('EngineeModelApp')
        setLeftIcon('ic:twotone-keyboard-arrow-left')
        setTitle(title)
        setRightButtonText('')
      }
    }
  }

  const handleWalletGoHome = () => {
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('Setting')
    setLeftIcon('')
    setTitle('Setting')
    setRightButtonText('QR')
    setRightButtonIcon(RightButtonIconOriginal)
  }

  console.log("pageModel", pageModel, previousPageModel)

  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'Setting':
        handleWalletGoHome()
        setRightButtonIcon('')
        break
      case 'Support':
      case 'SecurityPrivacy':
      case 'MyProfile':
      case 'BasicData':
      case 'SystemSetting':
      case 'LowCode':
        handleWalletGoHome()
        setRightButtonIcon('')
        break
      case 'Language':
        handleClickMyProfileButton()
        setRightButtonIcon('')
        break
      case 'Theme':
        handleClickMyProfileButton()
        setRightButtonIcon('')
        break
      case 'PrivacyPolicy':
      case 'TermsOfUse':
        handleClickSecurityPrivacyButton()
        setRightButtonIcon('')
        break
      case 'MyProfileDetail':
        handleClickMyProfileButton()
        break
      case 'EngineeModelApp':
        if(previousPageModel.at(-1) == 'add_default') { // sub module redirect
          setActionInMobileApp(String(Math.random()))
          setRightButtonIcon(RightButtonIconOriginal)
          setTitle(TitleOriginal)
          previousPageModel.pop()
        }
        else if(previousPageModel.at(-1) == 'edit_default') { // sub module redirect
          setActionInMobileApp(String(Math.random()))
          setRightButtonIcon(RightButtonIconOriginal)
          setTitle(TitleOriginal)
          previousPageModel.pop()
        }
        else if(previousPageModel.at(-1) == 'view_default') { // sub module redirect
          setActionInMobileApp(String(Math.random()))
          setRightButtonIcon(RightButtonIconOriginal)
          setTitle(TitleOriginal)
          previousPageModel.pop()
        }
        else if(previousPageModel.at(-1) == 'SystemSetting') {
          handleClickSystemSettingButton()
          previousPageModel.pop()
        }
        else if(previousPageModel.at(-1) == 'BasicData') {
          handleClickBasicDataButton()
          previousPageModel.pop()
        }
        else if(previousPageModel.at(-1) == 'MyProfile') {
          handleClickMyProfileButton()
          previousPageModel.pop()
        }
        break
    }
  }

  const RightButtonOnClick = () => {
    console.log("RightButtonOnClick: 162", pageModel)
    console.log("RightButtonOnClick: 162", actionInMobileApp)
    switch(pageModel) {
        case 'EngineeModelApp':
          setActionInMobileApp('add_default')
          setPreviousPageModel((preV: any)=>[...preV, 'add_default']) //行为栈,新增加一个新建页面
          setRightButtonIcon('') //当点击右上角的新建按钮,进行新建页面时,需要暂时不显示右上角的新建按钮. 当回到列表页面时,需要显示出来.
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
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle('Security & Privacy')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickMyProfileButton = () => {
    setCounter(counter + 1)
    setPageModel('MyProfile')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle('我的事务')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickMyProfileDetailButton = () => {
    setPageModel('MyProfileDetail')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle('我的资料')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickBasicDataButton = () => {
    setCounter(counter + 1)
    setPageModel('BasicData')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle('基础数据')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickSystemSettingButton = () => {
    setCounter(counter + 1)
    setPageModel('SystemSetting')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle('系统设置')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickLanguageButton = () => {
    setCounter(counter + 1)
    setPageModel('Language')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(t('Language') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickThemeButton = () => {
    setCounter(counter + 1)
    setPageModel('Theme')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
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
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle('Terms of Use')
    setRightButtonText('')
    setRightButtonIcon('')
  }

  const handleClickPrivacyPolicyButton = () => {
    setPageModel('PrivacyPolicy')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
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

            {pageModel == 'Setting' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        {myProfileMenus && myProfileMenus[0] && (
                          <Grid item xs={12} sx={{ py: 1 }}>
                            <Card>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickMyProfileButton()}>
                                  <Icon icon={myProfileMenus[0]['icon']} fontSize={34} />
                                </IconButton>
                                <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickMyProfileButton()}>
                                  <Typography sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                  >
                                    {myProfileMenus[0]['title']}
                                  </Typography>
                                  <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{
                                      color: `secondary.primary`,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1
                                    }}>
                                      {'个人资料,修改密码,访问日志等'}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box textAlign="right">
                                  <IconButton sx={{ p: 0 }} onClick={()=>handleClickMyProfileButton()}>
                                      <Icon icon='mdi:chevron-right' fontSize={30} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>
                        )}
                        {basicDataMenus && basicDataMenus[0] && (
                          <Grid item xs={12} sx={{ py: 1 }}>
                            <Card>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickBasicDataButton()}>
                                  <Icon icon={basicDataMenus[0]['icon']} fontSize={34} />
                                </IconButton>
                                <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickBasicDataButton()}>
                                  <Typography sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                  >
                                    {basicDataMenus[0]['title']}
                                  </Typography>
                                  <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{
                                      color: `secondary.primary`,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1
                                    }}>
                                      {'系部,专业,班级,学生,课程等'}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box textAlign="right">
                                  <IconButton sx={{ p: 0 }} onClick={()=>handleClickBasicDataButton()}>
                                      <Icon icon='mdi:chevron-right' fontSize={30} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>
                        )}
                        {systemSettingMenus && systemSettingMenus[0] && (
                          <Grid item xs={12} sx={{ py: 1 }}>
                            <Card>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickSystemSettingButton()}>
                                  <Icon icon={systemSettingMenus[0]['icon']} fontSize={34} />
                                </IconButton>
                                <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickSystemSettingButton()}
                                  >
                                  <Typography sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                  >
                                    {systemSettingMenus[0]['title']}
                                  </Typography>
                                  <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{
                                      color: `secondary.primary`,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1
                                    }}>
                                      {'单位,部门,用户,角色,日志等'}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box textAlign="right">
                                  <IconButton sx={{ p: 0 }} onClick={()=>handleClickSystemSettingButton()}>
                                      <Icon icon='mdi:chevron-right' fontSize={30} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>
                        )}
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
                                    {defaultConfig.AppVersion} {defaultConfig.AppVersionType}
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
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleLogout()}
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
                  <PrivacyPolicy authConfig={authConfig} />
                </Grid>
              </Grid>
            )}

            {pageModel == 'TermsOfUse' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TermsofUse authConfig={authConfig} />
                </Grid>
              </Grid>
            )}

            {pageModel == 'MyProfileDetail' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <MyProfileDetail authConfig={authConfig} />
                </Grid>
              </Grid>
            )}

            {pageModel == 'MyProfile' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickMyProfileDetailButton()}>
                                  <Icon icon={'ix:user-profile'} fontSize={38} />
                                </IconButton>
                                <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickMyProfileDetailButton()} >
                                    <Typography sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    }}
                                    >
                                    {'我的资料'}
                                    </Typography>
                                    <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{
                                        color: `secondary.primary`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1
                                    }}>
                                        {'我的资料'}
                                    </Typography>
                                    </Box>
                                </Box>
                                <Box textAlign="right">
                                    <IconButton sx={{ p: 0 }} onClick={()=>handleClickMyProfileDetailButton()}>
                                        <Icon icon='mdi:chevron-right' fontSize={30} />
                                    </IconButton>
                                </Box>
                            </Box>
                          </Card>
                        </Grid>
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
                        {myProfileMenus && myProfileMenus[0] && myProfileMenus[0]['children'] && myProfileMenus[0]['children'].length > 0 && myProfileMenus[0]['children'].map((Item: any, Index: number)=>(
                          <Grid item xs={12} sx={{ py: 1 }} key={Index}>
                            <Card>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                  <IconButton sx={{ p: 0 }} onClick={()=>handleGoAppItem(Item, pageModel)}>
                                    <Icon icon={'mdi:'+Item.Menu_Three_Icon} fontSize={38} />
                                  </IconButton>
                                  <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleGoAppItem(Item, pageModel)} >
                                      <Typography sx={{
                                      color: 'text.primary',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      }}
                                      >
                                      {Item.title}
                                      </Typography>
                                      <Box sx={{ display: 'flex'}}>
                                      <Typography variant='body2' sx={{
                                          color: `secondary.primary`,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          flex: 1
                                      }}>
                                          {Item.title}
                                      </Typography>
                                      </Box>
                                  </Box>
                                  <Box textAlign="right">
                                      <IconButton sx={{ p: 0 }} onClick={()=>handleGoAppItem(Item, pageModel)}>
                                          <Icon icon='mdi:chevron-right' fontSize={30} />
                                      </IconButton>
                                  </Box>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                    </Grid>
                </Grid>
              </Grid>
            )}

            {pageModel == 'BasicData' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        {basicDataMenus && basicDataMenus[0] && basicDataMenus[0]['children'] && basicDataMenus[0]['children'].length > 0 && basicDataMenus[0]['children'].map((Item: any, Index: number)=>(
                          <Grid item xs={12} sx={{ py: 1 }} key={Index}>
                            <Card>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                  <IconButton sx={{ p: 0 }} onClick={()=>handleGoAppItem(Item, pageModel)}>
                                    <Icon icon={'mdi:'+Item.Menu_Three_Icon} fontSize={38} />
                                  </IconButton>
                                  <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleGoAppItem(Item, pageModel)} >
                                      <Typography sx={{
                                      color: 'text.primary',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      }}
                                      >
                                      {Item.title}
                                      </Typography>
                                      <Box sx={{ display: 'flex'}}>
                                      <Typography variant='body2' sx={{
                                          color: `secondary.primary`,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          flex: 1
                                      }}>
                                          {Item.title}
                                      </Typography>
                                      </Box>
                                  </Box>
                                  <Box textAlign="right">
                                      <IconButton sx={{ p: 0 }} onClick={()=>handleGoAppItem(Item, pageModel)}>
                                          <Icon icon='mdi:chevron-right' fontSize={30} />
                                      </IconButton>
                                  </Box>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                    </Grid>
                </Grid>
              </Grid>
            )}

            {pageModel == 'SystemSetting' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        {systemSettingMenus && systemSettingMenus[0] && systemSettingMenus[0]['children'] && systemSettingMenus[0]['children'].length > 0 && systemSettingMenus[0]['children'].map((Item: any, Index: number)=>(
                          <Grid item xs={12} sx={{ py: 1 }} key={Index}>
                            <Card>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                  <IconButton sx={{ p: 0 }} onClick={()=>handleGoAppItem(Item, pageModel)}>
                                      <Icon icon={'mdi:'+Item.Menu_Three_Icon} fontSize={38} />
                                  </IconButton>
                                  <Box sx={{ cursor: 'pointer', ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleGoAppItem(Item, pageModel)}
                                      >
                                      <Typography sx={{
                                      color: 'text.primary',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      }}
                                      >
                                      {Item.title}
                                      </Typography>
                                      <Box sx={{ display: 'flex'}}>
                                      <Typography variant='body2' sx={{
                                          color: `secondary.primary`,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          flex: 1
                                      }}>
                                          {Item.title}
                                      </Typography>
                                      </Box>
                                  </Box>
                                  <Box textAlign="right">
                                      <IconButton sx={{ p: 0 }} onClick={()=>handleGoAppItem(Item, pageModel)}>
                                          <Icon icon='mdi:chevron-right' fontSize={30} />
                                      </IconButton>
                                  </Box>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                    </Grid>
                </Grid>
              </Grid>
            )}

            {pageModel == 'EngineeModelApp' && appItemId && (
              <>
                <EngineeModelApp authConfig={authConfig} backEndApi={appItemId} externalId='' handleActionInMobileApp={handleActionInMobileApp} actionInMobileApp={actionInMobileApp} handleSetRightButtonIconOriginal={handleSetRightButtonIconOriginal} />
              </>
            )}

        </ContentWrapper>
      </Box>
    </Fragment>
  )
}

export default Setting

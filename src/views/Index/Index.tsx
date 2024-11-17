// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

// ** MUI Imports
//import Icon from '../../@core/components/icon'
import authConfig from '../../configs/auth'

import { styled } from '@mui/material/styles'
import Header from '../Home/Header'

import axios from 'axios'
import { DecryptDataAES256GCM } from 'src/configs/functions'

import EngineeModelApp from "src/views/Enginee/index"

import { useTranslation } from 'react-i18next'

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

const Index = ({ menuArray, setMenuArray }: any) => {
  // ** Hook
  const { t } = useTranslation()
  const contentHeightFixed = {}
  const [counter, setCounter] = useState<number>(0)

  const [pageModel, setPageModel] = useState<string>('MainSetting')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('')
  const [Title, setTitle] = useState<string>(t('应用') as string)
  const [RightButtonText, setRightButtonText] = useState<string>('')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('')
  const [appItemId, setAppItemId] = useState<string>('')

  const [previousPageModel, setPreviousPageModel] = useState<string[]>([])
  const [TitleOriginal, setTitleOriginal] = useState<string>(t('应用') as string)
  const [RightButtonIconOriginal, setRightButtonIconOriginal] = useState<string>('')

  const [actionInMobileApp, setActionInMobileApp] = useState<string>('20241108')

  useEffect(() => {
    handleGetMainMenus()
  }, []);

  const handleGetMainMenus = () => {
    if(window)  {
      const storageMainMenus = window.localStorage.getItem(authConfig.storageMainMenus)
      if(storageMainMenus && storageMainMenus != undefined) {
        try{
          const storageMainMenusJson = JSON.parse(storageMainMenus)
          setMenuArray(storageMainMenusJson)
        }
        catch(Error: any) {
            console.log("handleGetMainMenus storageMainMenus Error", storageMainMenus)
        }
      }
    }
    const backEndApi = authConfig.indexMenuspath
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
    const AccessKey = window.localStorage.getItem(authConfig.storageAccessKeyName)!
    axios.get(authConfig.backEndApiHost + backEndApi, { headers: { Authorization: storedToken } }).then(res => {
      let dataJson: any = null
      const data = res.data
      if(data && data.isEncrypted == "1" && data.data)  {
          const i = data.data.slice(0, 32);
          const t = data.data.slice(-32);
          const e = data.data.slice(32, -32);
          const k = AccessKey;
          const DecryptDataAES256GCMData = DecryptDataAES256GCM(e, i, t, k)
          try{
              dataJson = JSON.parse(DecryptDataAES256GCMData)
          }
          catch(Error: any) {
              console.log("handleGetMainMenus DecryptDataAES256GCMData view_default Error", Error)
              dataJson = data
          }
      }
      else {
          dataJson = data
      }
      if(dataJson) {
        setMenuArray(dataJson)
      }
      if(window && dataJson) {
        window.localStorage.setItem(authConfig.storageMainMenus, JSON.stringify(dataJson))
      }

      //console.log("handleGetMainMenus menuArray dataJson", dataJson)
    })
    .catch(error => {
      if (error.response) {
        console.error('handleGetMainMenus Error response:', error.response.data);
        console.error('handleGetMainMenus Error status:', error.response.status);
        console.error('handleGetMainMenus Error headers:', error.response.headers);
      }
      else if (error.request) {
        console.error('handleGetMainMenus Error request:', error.request);
      }
      else {
        console.error('handleGetMainMenus Error message:', error.message);
      }
      console.error('handleGetMainMenus Error config:', error.config);
    });
  }

  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  useEffect(() => {
    setHeaderHidden(false)
    setRightButtonIcon('')
  }, []);

  const handleSetRightButtonIconOriginal = (RightButtonIconOriginal: string) => {
    setRightButtonIconOriginal(RightButtonIconOriginal)
    setRightButtonIcon(RightButtonIconOriginal)
  }

  const handleGoAppItem = (item: any, previousModel: string) => {
    console.log("itemitem", item)
    setAppItemId(item.path.replace('/apps/', '').replace('/tab/apps_', ''))
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
    setPageModel('MainSetting')
    setLeftIcon('')
    setTitle('应用')
    setRightButtonText('')
    setRightButtonIcon(RightButtonIconOriginal)
  }


  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'MainSetting':
        handleWalletGoHome()
        setRightButtonIcon('')
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
        break
    }
  }

  const RightButtonOnClick = () => {
    console.log("RightButtonOnClick: 163", pageModel)
    console.log("RightButtonOnClick: 163", actionInMobileApp)
    switch(pageModel) {
        case 'EngineeModelApp':
          setActionInMobileApp('add_default')
          setPreviousPageModel((preV: any)=>[...preV, 'add_default']) //行为栈,新增加一个新建页面
          setRightButtonIcon('') //当点击右上角的新建按钮,进行新建页面时,需要暂时不显示右上角的新建按钮. 当回到列表页面时,需要显示出来.
          break
      }
  }

  console.log("pageModel", pageModel, previousPageModel)

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

            {pageModel == 'MainSetting' && (
              <Container sx={{mt: 0}}>
                {menuArray && menuArray.length > 0 && menuArray.map((menuItem: any, menuIndex: number)=>{

                  return (
                    <Fragment key={menuIndex}>
                    {menuItem && menuItem.title && !['基础数据','系统设置','低代码平台'].includes(menuItem.title) && (
                      <Box my={2} key={menuIndex}>
                        <Typography variant="h6" sx={{ py: 0.5, pl: 2, borderRadius: '5px', mb: 2, fontSize: '16px' }}>
                          {menuItem.title}
                        </Typography>
                      <Grid container spacing={2}>
                        {menuItem.children && menuItem.children.map((item: any, index: number) => (
                          <Grid item xs={3} key={index}>
                            <Box textAlign="center" sx={{my: 0}}>
                              <img src={authConfig.AppLogo} alt={item.title} style={{ width: '45px', height: '45px' }} onClick={()=>handleGoAppItem(item, pageModel)}/>
                              <Typography variant="body2"
                                sx={{
                                  my: 0,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                onClick={()=>handleGoAppItem(item, pageModel)}
                              >{item.title}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    )}
                    </Fragment>
                  )

                })}
              </Container>
            )}

            {pageModel == 'EngineeModelApp' && appItemId && (
              <>
                <EngineeModelApp backEndApi={`apps/apps_${appItemId}.php`} externalId='' handleActionInMobileApp={handleActionInMobileApp} actionInMobileApp={actionInMobileApp} handleSetRightButtonIconOriginal={handleSetRightButtonIconOriginal} />
              </>
            )}

        </ContentWrapper>
      </Box>
    </Fragment>
  )
}


export default Index

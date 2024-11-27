// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import { styled } from '@mui/material/styles'
import Header from '../Home/Header'

import axios from 'axios'
import { DecryptDataAES256GCM } from 'src/configs/functions'

import EngineeModelApp from "src/views/Enginee/index"
import ShareDialog from "src/views/Chart/ShareDialog"

import { defaultConfig } from 'src/configs/auth'

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

const Application = ({ menuArray, setMenuArray, authConfig }: any) => {
  // ** Hook
  const { t } = useTranslation()
  const contentHeightFixed = {}
  const [counter, setCounter] = useState<number>(0)

  const [pageModel, setPageModel] = useState<string>('AnalyticsStudent')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('')
  const [Title, setTitle] = useState<string>(t('应用') as string)
  const [RightButtonText, setRightButtonText] = useState<string>('')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('')
  const [appItemId, setAppItemId] = useState<string>('')

  const [viewPageShareStatus, setViewPageShareStatus] = useState<boolean>(false)

  const [previousPageModel, setPreviousPageModel] = useState<string[]>([])
  const [TitleOriginal, setTitleOriginal] = useState<string>(t('应用') as string)
  const [RightButtonIconOriginal, setRightButtonIconOriginal] = useState<string>('')
  const [allpath, setAllpath] = useState<any[]>([])

  const [actionInMobileApp, setActionInMobileApp] = useState<string>('20241108')

  console.log("allpath", allpath)

  useEffect(() => {
    handleGetMainMenus()
  }, []);

  const handleGetMainMenus = () => {
    if(window)  {
      const storageMainMenus = window.localStorage.getItem(defaultConfig.storageMainMenus)
      if(storageMainMenus && storageMainMenus != undefined) {
        try {
          const storageMainMenusJson = JSON.parse(storageMainMenus)
          setMenuArray(storageMainMenusJson)
        }
        catch(Error: any) {
            console.log("handleGetMainMenus storageMainMenus Error", storageMainMenus)
        }
      }
    }
    const backEndApi = authConfig.indexMenuspath
    const storedToken = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
    const AccessKey = window.localStorage.getItem(defaultConfig.storageAccessKeyName)!
    axios.get(authConfig.backEndApiHost + backEndApi, { headers: { Authorization: storedToken } }).then(res => {
      let dataJson: any = null
      const data = res.data
      if(data && data.isEncrypted == "1" && data.data)  {
          const i = data.data.slice(0, 32);
          const t = data.data.slice(-32);
          const e = data.data.slice(32, -32);
          const k = AccessKey;
          const DecryptDataAES256GCMData = DecryptDataAES256GCM(e, i, t, k)
          try {
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
        window.localStorage.setItem(defaultConfig.storageMainMenus, JSON.stringify(dataJson))
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
    if(item.path.startsWith('/apps/')) {
      setAppItemId(`apps/apps_${item.path.replace('/apps/', '')}.php`)
      setPageModel('EngineeModelApp')
      setAllpath([])
      setRightButtonText('')
      setRightButtonIcon('')
      handleSetRightButtonIconOriginal('')
    }
    else if(item.path.startsWith('/tab/apps_')) {
      setAppItemId(`apps/apps_${item.path.replace('/tab/apps_', '')}.php`)
      setPageModel('EngineeModelApp')
      setAllpath(item.children)
      setRightButtonText('')
      setRightButtonIcon('')
      handleSetRightButtonIconOriginal('')
    }
    else if(item.path.startsWith('/dashboards/analyticsstudent')) {
      setAppItemId(`charts/dashboard_deyu_geren_banji.php`)
      setPageModel('AnalyticsStudent')
      setAllpath([])
      handleSetRightButtonIconOriginal('material-symbols:ios-share')
    }
    else if(item.path.startsWith('/dashboards/analyticsclass')) {
      setAppItemId(`charts/dashboard_deyu_banji_banji.php`)
      setPageModel('AnalyticsClass')
      setAllpath([])
      handleSetRightButtonIconOriginal('material-symbols:ios-share')
    }
    else if(item.path.startsWith('/dashboards/StatisticsStudentsbyClass')) {
      setAppItemId(`charts/StatisticsStudentsbyClass.php`)
      setPageModel('StatisticsStudentsbyClass')
      setAllpath([])
      handleSetRightButtonIconOriginal('material-symbols:ios-share')
    }
    else if(item.path.startsWith('/dashboards/StatisticsStudentsbyIndividual')) {
      setAppItemId(`charts/StatisticsStudentsbyIndividual.php`)
      setPageModel('StatisticsStudentsbyIndividual')
      setAllpath([])
      handleSetRightButtonIconOriginal('material-symbols:ios-share')
    }

    setCounter(counter + 1)
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(item.title)
    setTitleOriginal(item.title)
    setPreviousPageModel((preV: any)=>[...preV, previousModel])
  }

  const handleGoAppItemFromSubMenu = (item: any) => {
    console.log("handleGoAppItemFromSubMenu", item)
    setAppItemId(`apps/apps_${item.id}.php`)
    setCounter(counter + 1)
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(item.title)
    setTitleOriginal(item.title)
    setRightButtonText('')
    setRightButtonIcon('')
    setPreviousPageModel((preV: any)=>[preV[0]])
  }

  console.log("appItemId", appItemId, pageModel)

  const handleActionInMobileApp = (action: string, title: string, formAction = '') => {
    if(formAction == 'GoPageList')  { //当新建或编辑的表单提交以后, 会返回一个值, 表示已经提交, 这个时候需要返回到页面列表
      setPreviousPageModel((preV: any)=>[preV[0]])
      console.log("handleActionInMobileApp", action, "--actionInMobileApp", actionInMobileApp)
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
    setPageModel('MainApplication')
    setLeftIcon('')
    setTitle('应用')
    setRightButtonText('')
    setRightButtonIcon(RightButtonIconOriginal)
  }

  const LeftIconOnClick = () => {
    console.log("pageModel66666", pageModel, previousPageModel, "actionInMobileApp", actionInMobileApp)
    switch(pageModel) {
      case 'MainApplication':
        handleWalletGoHome()
        setRightButtonIcon('')
        setViewPageShareStatus(false)
        break
      case 'AnalyticsStudent':
      case 'AnalyticsClass':
      case 'StatisticsStudentsbyClass':
      case 'StatisticsStudentsbyIndividual':
      case 'EngineeModelApp':
        setViewPageShareStatus(false)
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
          handleSetRightButtonIconOriginal('') //这一行需要放到这个位置,不能上移
        }
        else if(previousPageModel.at(-1) == 'MainApplication') {
          handleWalletGoHome()
          setRightButtonIcon('')
          previousPageModel.pop()
        }
        break
    }
  }

  const RightButtonOnClick = () => {
    console.log("RightButtonOnClick: 163", pageModel)
    console.log("RightButtonOnClick: 163", actionInMobileApp)
    switch(pageModel) {
        case 'AnalyticsStudent':
        case 'AnalyticsClass':
        case 'StatisticsStudentsbyClass':
        case 'StatisticsStudentsbyIndividual':
        case 'EngineeModelApp':
          if(RightButtonIcon == 'ic:sharp-add-circle-outline')   {
            setActionInMobileApp('add_default')
            setPreviousPageModel((preV: any)=>[...preV, 'add_default']) //行为栈,新增加一个新建页面
            setRightButtonIcon('') //当点击右上角的新建按钮,进行新建页面时,需要暂时不显示右上角的新建按钮. 当回到列表页面时,需要显示出来.
          }
          else if(RightButtonIcon == 'material-symbols:ios-share')   {
            setViewPageShareStatus(true)

            //setActionInMobileApp('add_default')
            //setPreviousPageModel((preV: any)=>[...preV, 'add_default']) //行为栈,新增加一个新建页面
            //setRightButtonIcon('') //当点击右上角的新建按钮,进行新建页面时,需要暂时不显示右上角的新建按钮. 当回到列表页面时,需要显示出来.
          }
          break
      }
  }

  const handSetViewPageShareStatus = (NewStatus: boolean) => {
    setViewPageShareStatus(NewStatus)
  }

  console.log("pageModel-----", pageModel, previousPageModel)

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

            {pageModel == 'MainApplication' && (
              <Container sx={{mt: 0}}>
                {menuArray && menuArray.length > 0 && menuArray.map((menuItem: any, menuIndex: number)=>{

                  return (
                    <Fragment key={menuIndex}>
                    {menuItem && menuItem.title && !['基础数据','系统设置','低代码平台','我的事务'].includes(menuItem.title) && (
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

            {pageModel == 'EngineeModelApp' && appItemId && allpath.length > 0 && (
              <>
                <Grid container spacing={2} mb={2}>
                  {allpath && allpath.map((item: any, index: number) => (
                    <Grid item xs={3} key={index}>
                      <Box textAlign="center" sx={{my: 0}}>
                        <img src={authConfig.AppLogo} alt={item.title} style={{ width: '45px', height: '45px' }} onClick={()=>handleGoAppItemFromSubMenu(item)}/>
                        <Typography variant="body2"
                          sx={{
                            my: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          onClick={()=>handleGoAppItemFromSubMenu(item)}
                        >{item.title}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <EngineeModelApp authConfig={authConfig} backEndApi={appItemId} externalId='' handleActionInMobileApp={handleActionInMobileApp} actionInMobileApp={actionInMobileApp} handleSetRightButtonIconOriginal={handleSetRightButtonIconOriginal} viewPageShareStatus={viewPageShareStatus} handSetViewPageShareStatus={handSetViewPageShareStatus} />
              </>
            )}

            {pageModel == 'EngineeModelApp' && appItemId && allpath.length == 0 && (
              <>
                <EngineeModelApp authConfig={authConfig} backEndApi={appItemId} externalId='' handleActionInMobileApp={handleActionInMobileApp} actionInMobileApp={actionInMobileApp} handleSetRightButtonIconOriginal={handleSetRightButtonIconOriginal} viewPageShareStatus={viewPageShareStatus} handSetViewPageShareStatus={handSetViewPageShareStatus} />
              </>
            )}

            {pageModel == 'AnalyticsStudent' && (
              <>
                <ShareDialog authConfig={authConfig} pageModel={pageModel} viewPageShareStatus={viewPageShareStatus} handSetViewPageShareStatus={handSetViewPageShareStatus}  />
              </>
            )}

            {pageModel == 'AnalyticsClass' && appItemId && (
              <>
                <ShareDialog authConfig={authConfig} pageModel={pageModel} viewPageShareStatus={viewPageShareStatus} handSetViewPageShareStatus={handSetViewPageShareStatus}  />
              </>
            )}

            {pageModel == 'StatisticsStudentsbyClass' && appItemId && (
              <>
                <ShareDialog authConfig={authConfig} pageModel={pageModel} viewPageShareStatus={viewPageShareStatus} handSetViewPageShareStatus={handSetViewPageShareStatus}  />
              </>
            )}

            {pageModel == 'StatisticsStudentsbyIndividual' && appItemId && (
              <>
                <ShareDialog authConfig={authConfig} pageModel={pageModel} viewPageShareStatus={viewPageShareStatus} handSetViewPageShareStatus={handSetViewPageShareStatus}  />
              </>
            )}

        </ContentWrapper>
      </Box>
    </Fragment>
  )
}


export default Application

// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Components
import axios from 'axios'

import { defaultConfig } from 'src/configs/auth'

import Header from '../Home/Header'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import { DecryptDataAES256GCM } from 'src/configs/functions'
import ChatIndex from 'src/views/App/Chat/ChatIndex';


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

const MyCourses = ({authConfig}: any) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [myCoursesList, setMyCoursesList] = useState<any[]>([])
  const [pageModel, setPageModel] = useState<string>('Main')
  const [courseItem, setCourseItem] = useState<any>(null)

  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('')
  const [Title, setTitle] = useState<string>(t('AI教学') as string)
  const [RightButtonText, setRightButtonText] = useState<string>('')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('')

  const handleSetChatWithCourse = async (item: any) => {
    setPageModel("ChatWithCourse")
    setCourseItem({...item, id: 'ididididid', avatar: '1.png', SystemPrompt: '每次输出200字左右.', Model: {}, WelcomeText: '您好, 你是一个数学课程的老师,您有任何问题,都可以在此输入问题, 然后使用AI模型来得到答案.', QuestionGuideTemplate: '你是一个AI智能助手，可以回答和解决我的问题。请结合前面的对话记录，帮我生成 3 个问题，引导我继续提问。问题的长度应小于20个字符，要求使用UTF-8编码，按 JSON 格式返回: ["问题1", "问题2", "问题3"]' })
  }

  const handelGetMyCoursesList = async () => {
    const storedToken = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
    const AccessKey = window.localStorage.getItem(defaultConfig.storageAccessKeyName)!
    if(window && defaultConfig)  {
      const myCoursesListData = window.localStorage.getItem(defaultConfig.myCoursesList)
      if(myCoursesListData && myCoursesListData != undefined) {
        try {
          const myCoursesListJson = JSON.parse(myCoursesListData)
          setMyCoursesList(myCoursesListJson)
        }
        catch(Error: any) {
            console.log("handleGetMainMenus myCoursesList Error", myCoursesList)
        }
      }
    }
    if(window && authConfig && (myCoursesList.length == 0))   {
      try {
        await axios.get(authConfig.backEndApiHost + 'aichat/getMyCourses.php', {
          headers: {
            Authorization: storedToken
          },
          params: {}
        }).then(res => {
          const data = res.data
          if(data && data.data && data.isEncrypted == "1")  {
            const i = data.data.slice(0, 32);
            const t = data.data.slice(-32);
            const e = data.data.slice(32, -32);
            const k = AccessKey;
            console.log("kkkkkk1234", k)
            const DecryptDataAES256GCMData = DecryptDataAES256GCM(e, i, t, k)
            console.log("kkkkkk1234", DecryptDataAES256GCMData)
            try {
              const ResJson = JSON.parse(DecryptDataAES256GCMData)
              console.log("DecryptDataAES256GCMData ResJson", ResJson)
              setMyCoursesList(ResJson.data)
              setIsLoading(false)
              window.localStorage.setItem(defaultConfig.myCoursesList, JSON.stringify(ResJson))
            }
            catch(Error: any) {
              console.log("DecryptDataAES256GCMData Error", Error)
              setMyCoursesList([])
              setIsLoading(false)
            }
          }
          else {
            setMyCoursesList(data.data)
            setIsLoading(false)
            window.localStorage.setItem(defaultConfig.myCoursesList, JSON.stringify(data.data))
          }
        })
      }
      catch(Error: any) {
        console.log("handelGetMyCoursesList Error", Error)
        setIsLoading(false)

        return []
      }
    }
  }

  const handleWalletGoHome = () => {
    setLeftIcon('')
    setTitle('应用')
    setRightButtonText('')
  }

  const LeftIconOnClick = () => {
    handleWalletGoHome()
  }

  const RightButtonOnClick = () => {
    handleWalletGoHome()
  }

  useEffect(() => {
    setHeaderHidden(false)
    setRightButtonIcon('')
    handelGetMyCoursesList()
  }, []);

  return (
    <Fragment>
      <Header Hidden={HeaderHidden} LeftIcon={LeftIcon} LeftIconOnClick={LeftIconOnClick} Title={Title} RightButtonText={RightButtonText} RightButtonOnClick={RightButtonOnClick} RightButtonIcon={RightButtonIcon}/>

      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: 'hidden',
          overflowX: 'hidden',
          marginTop: '35px', // Adjust according to the height of the AppBar
          marginBottom: '56px', // Adjust according to the height of the Footer
          paddingTop: 'env(safe-area-inset-top)'
        }}
      >
        <ContentWrapper>
              {pageModel == "Main" && (
                <Fragment>
                  {isLoading && myCoursesList.length == 0 ? (
                        <Grid item xs={12} sm={12} container justifyContent="space-around">
                            <Box sx={{ mt: 6, mb: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <CircularProgress />
                                <Typography sx={{pt:5, pb:5}}>加载中...</Typography>
                            </Box>
                        </Grid>
                    ) : (
                    <Grid container spacing={0}>
                      {myCoursesList && myCoursesList.length > 0 && myCoursesList.map((item: any, index: number) => {

                        return (
                          <Grid item xs={12} sx={{ pb: 2, }} key={index}>
                            <Card>
                              <CardContent onClick={()=>handleSetChatWithCourse(item)}>
                                  <Grid item xs={12} >
                                    <Typography variant='body2' sx={{ fontWeight: 'bold', color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                                    {item['班级名称']}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} mt={1}>
                                    <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'left' }}>
                                      课程:{item['课程名称']}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} mt={1}>
                                    <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'left' }}>
                                      教师:{item['教师姓名']}
                                    </Typography>
                                  </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                      })}
                    </Grid>
                  )}
                </Fragment>
              )}
              {pageModel == "ChatWithCourse" && (
                <Fragment>
                  <ChatIndex authConfig={authConfig} app={courseItem}/>
                </Fragment>
              )}
        </ContentWrapper>
      </Box>
    </Fragment>

  );
};

export default MyCourses;

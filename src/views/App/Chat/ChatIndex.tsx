// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'

// ** Types
import { StatusObjType } from 'src/types/apps/chatTypes'

// ** Chat App Components Imports
import ChatContent from 'src/views/App/Chat/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { getNanoid, ChatChatList, ChatChatInit, ChatChatNameList, ChatChatInput, ChatAiOutputV1, DeleteChatChat, DeleteChatChatHistory, DeleteChatChatByChatlogId, DeleteChatChatHistoryByChatlogId  } from 'src/functions/ChatBook'

import { defaultConfig } from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'

const ChatIndex = (props: any) => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const { app, authConfig } = props

  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
  const [chatId, setChatId] = useState<number | string>(-1)
  const [chatName, setChatName] = useState<string>("")
  const [historyCounter, setHistoryCounter] = useState<number>(0)
  const [stopMsg, setStopMsg] = useState<boolean>(false)

  const userType = authConfig.type

  const getChatLogList = async function (appId: string, appTemplate: string) {
    const userId = auth?.user?.username
    const authorization = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
    console.log("getChatLogList",userType)
    try {
      if(userId && authorization) {
        const RS = await axios.post(authConfig.backEndApiHost + 'aichat/chatlog.php', {appId, pageId: 0}, {
          headers: {
            Authorization: authorization,
            'Content-Type': 'application/json'
          }
        }).then(res=>res.data)
        if(RS['data'])  {
          const ChatChatInitList = ChatChatInit(RS['data'].reverse(), appTemplate)
          setHistoryCounter(ChatChatInitList.length)
          const selectedChat = {
            "chat": {
                "id": 1,
                "userId": userId,
                "unseenMsgs": 0,
                "chat": ChatChatInitList
            }
          }
          const storeInit = {
            "chats": [],
            "userProfile": {
                "id": userId,
                "avatar": "/images/avatars/1.png",
                "fullName": "Current User",
            },
            "selectedChat": selectedChat
          }
          setStore(storeInit)
        }
      }
    }
    catch(Error: any) {
        console.log("getChatLogList Error", Error)
    }
  }

  const ClearButtonClick = async function () {
    const userId = auth?.user?.username
    const authorization = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
    if(userId) {
      DeleteChatChat()
      DeleteChatChatHistory(userId, chatId, app.id)
      const selectedChat = {
        "chat": {
            "id": userId,
            "userId": userId,
            "unseenMsgs": 0,
            "chat": []
        }
      }
      const storeInit = {
        "chats": [],
        "userProfile": {
            "id": userId,
            "avatar": "/images/avatars/1.png",
            "fullName": "Current User",
        },
        "selectedChat": selectedChat
      }
      setStore(storeInit)

      //Set system prompt
      ChatChatInit([], GetWelcomeTextFromAppValue)
      setHistoryCounter(0)
      setRefreshChatCounter(0)

      const data: any = {appId: app.id, userType: userType}
      const RS = await axios.post(authConfig.backEndApiHost + 'aichat/chatlog/clear/', data, {
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json'
        }
      }).then(res=>res.data)
      if(RS && RS.status == 'ok') {
        toast.success(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
      else {
        toast.error(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
    }
  }

  const handleDeleteOneChatLogById = async function (chatlogId: string) {
    if (auth && auth.user && app) {
      const userId = auth?.user?.username
      const authorization = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
      DeleteChatChatByChatlogId(chatlogId)
      DeleteChatChatHistoryByChatlogId(userId, chatId, app.id, chatlogId)

      const data: any = {chatlogId: chatlogId, appId: app.id, userType: userType, action: 'delete'}
      const RS = await axios.post(authConfig.backEndApiHost + 'aichat/chatlog.php', data, {
                          headers: {
                            Authorization: authorization,
                            'Content-Type': 'application/json'
                          }
                        }).then(res=>res.data)
      if(RS && RS.status == 'ok') {
        setRefreshChatCounter(refreshChatCounter + 1)
        toast.success(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
      else {
        toast.error(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
    }
  }

  // ** States
  const [store, setStore] = useState<any>(null)
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonLoading, setSendButtonLoading] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')
  const [processingMessage, setProcessingMessage] = useState("")
  const [finishedMessage, setFinishedMessage] = useState("")
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [GetSystemPromptFromAppValue, setGetSystemPromptFromAppValue] = useState<string>("");
  const [GetModelFromAppValue, setGetModelFromAppValue] = useState<any>();
  const [GetWelcomeTextFromAppValue, setGetWelcomeTextFromAppValue] = useState<string>("");
  const [GetQuestionGuideFromAppValue, setGetQuestionGuideFromAppValue] = useState<boolean>(false);
  const [questionGuide, setQuestionGuide] = useState<any>()
  const [GetTTSFromAppValue, setGetTTSFromAppValue] = useState<any>();

  const lastChat = {
    "message": processingMessage,
    "time": Date.now(),
    "senderId": 999999,
    "responseTime": responseTime,
    "history": [],
    "feedback": {
        "isSent": true,
        "isDelivered": false,
        "isSeen": false
    }
  }

  // ** Hooks
  const theme = useTheme()
  const hidden = false

  useEffect(() => {
    const userId = auth?.user?.username
    if(userId) {
      const ChatChatListValue = ChatChatList()
      if(processingMessage && processingMessage!="") {

        //流式输出的时候,进来显示
        ChatChatListValue.push(lastChat)
      }
      const selectedChat = {
        "chat": {
            "id": userId,
            "userId": userId,
            "unseenMsgs": 0,
            "chat": ChatChatListValue
        }
      }
      const storeInit = {
        "chats": [],
        "userProfile": {
            "id": userId,
            "avatar": "/images/avatars/1.png",
            "fullName": "Current User",
        },
        "selectedChat": selectedChat
      }
      setStore(storeInit)
      setHistoryCounter(ChatChatListValue.length)
    }
  }, [refreshChatCounter, processingMessage, auth])

  useEffect(() => {
    if(t && app)   {
      const ChatChatNameListData: string[] = ChatChatNameList()
      if(ChatChatNameListData.length == 0) {
        setRefreshChatCounter(refreshChatCounter + 1)
      }
      setSendButtonText(t("Send") as string)
      setSendInputText(t("Your input...") as string)

      const GetSystemPromptFromAppValueTemp = GetSystemPromptFromApp(app)
      setGetSystemPromptFromAppValue(GetSystemPromptFromAppValueTemp)

      setGetModelFromAppValue(GetModelFromApp(app))

      const GetWelcomeTextFromAppTemp = GetWelcomeTextFromApp(app)
      setGetWelcomeTextFromAppValue(GetWelcomeTextFromAppTemp)
      getChatLogList(app.id, GetWelcomeTextFromAppTemp)

      setGetQuestionGuideFromAppValue(GetQuestionGuideFromApp(app))
      setGetTTSFromAppValue(GetTTSFromApp())

      setChatId('ChatApp')
      if(app && app['课程名称']) {
        setChatName(app['课程名称'])
        setChatId(app['id'])
      }
      else {
        setChatName(app.name)
        setChatId(app.id)
      }

    }
  }, [t, app])

  const GetSystemPromptFromApp = (app: any) => {

    return app.SystemPrompt
  }

  const GetModelFromApp = (app: any) => {

    return app.Model
  }

  const GetWelcomeTextFromApp = (app: any) => {

    return app.WelcomeText
  }

  const GetQuestionGuideFromApp = (app: any) => {
    console.log("GetQuestionGuideFromApp", app)

    return true
  }

  const GetTTSFromApp = () => {

    return null
  }


  const sendMsg = async (Obj: any) => {
    const userId = auth?.user?.username
    const authorization = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
    if(userId && t) {
      setSendButtonDisable(true)
      setSendButtonLoading(true)
      setSendButtonText(t("Sending") as string)
      setSendInputText(t("Answering...") as string)
      const _id = getNanoid(32)
      ChatChatInput(_id, Obj.send, Obj.message, userId, 0, [])
      setRefreshChatCounter(refreshChatCounter + 1)
      const startTime = performance.now()
      const ChatAiOutputV1Status = await ChatAiOutputV1(authConfig, _id, Obj.message, authorization, userId, chatId, app.id, setProcessingMessage, GetSystemPromptFromAppValue, setFinishedMessage, true, setQuestionGuide, app.QuestionGuideTemplate, stopMsg, setStopMsg, GetModelFromAppValue)
      const endTime = performance.now();
      setResponseTime(endTime - startTime);
      if(ChatAiOutputV1Status)      {
        setSendButtonDisable(false)
        setSendButtonLoading(false)
        setRefreshChatCounter(refreshChatCounter + 2)
        setSendButtonText(t("Send") as string)
        setSendInputText(t("Your input...") as string)
      }
    }
  }

  // ** Vars
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const statusObj: StatusObjType = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  const [innerHeight, setInnerHeight] = useState<number | string>(window.innerHeight)
  console.log("innerHeight innerHeight",innerHeight)

  useEffect(() => {
    const handleResize = () => {
        setInnerHeight(window.innerHeight - 48 - 56 - 35);
    };
    handleResize();
  }, []);

  return (
    <Box sx={{ width: '100%', height: innerHeight, overflow: 'hidden', display: 'flex' }}>
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper'
        }}
      >
      <ChatContent
        authConfig={authConfig}
        store={store}
        hidden={hidden}
        sendMsg={sendMsg}
        mdAbove={mdAbove}
        statusObj={statusObj}
        sendButtonDisable={sendButtonDisable}
        sendButtonLoading={sendButtonLoading}
        sendButtonText={sendButtonText}
        sendInputText={sendInputText}
        chatId={chatId}
        chatName={chatName}
        email={auth?.user?.email}
        ClearButtonClick={ClearButtonClick}
        historyCounter={historyCounter}
        app={app}
        GetSystemPromptFromAppValue={GetSystemPromptFromAppValue}
        handleDeleteOneChatLogById={handleDeleteOneChatLogById}
        userType={userType}
        GetModelFromAppValue={GetModelFromAppValue}
        questionGuide={questionGuide}
        GetQuestionGuideFromAppValue={GetQuestionGuideFromAppValue}
        GetTTSFromAppValue={GetTTSFromAppValue}
        setStopMsg={setStopMsg}
        finishedMessage={finishedMessage}
      />
      </Box>
    </Box>
  )
}

export default ChatIndex

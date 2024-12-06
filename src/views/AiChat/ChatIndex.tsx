// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { getNanoid, ChatChatList, ChatChatInit, ChatChatNameList, ChatChatInput, ChatAiOutputV1, DeleteChatChat, DeleteChatChatHistory, DeleteChatChatByChatlogId, DeleteChatChatHistoryByChatlogId  } from 'src/functions/ChatBook'

import { defaultConfig } from 'src/configs/auth'

import ChatLog from 'src/views/AiChat/ChatLog'
import SendMsgForm from 'src/views/AiChat/SendMsgForm'

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
  const [temperature, setTemperature] = useState<number>(Number(app.Temperature) / 10)

  const getChatLogList = async function (appId: string, appTemplate: string) {
    const userId = auth?.user?.username
    const authorization = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
    try {
      if(userId && authorization) {
        const RS = await axios.post(authConfig.backEndApiHost + 'aichat/chatlog.php', {appId, pageId: 0, action: 'getChatList'}, {
          headers: {
            Authorization: authorization,
            'Content-Type': 'application/json'
          }
        }).then(res=>res.data)
        if(RS['data'])  {
          const ChatChatInitList = ChatChatInit(appId, RS['data'].reverse(), appTemplate)
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
      DeleteChatChat(app.id)
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
      ChatChatInit(app.id, [], app.WelcomeText)
      setHistoryCounter(0)
      setRefreshChatCounter(0)

      const data: any = {appId: app.id, action: 'deleteByChatApp'}
      const RS = await axios.post(authConfig.backEndApiHost + 'aichat/chatlog.php', data, {
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json'
        }
      }).then(res=>res.data)
      if(RS && RS.status == 'OK') {
        toast.success(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
      else {
        toast.error(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
      }
    }
  }
  console.log("ClearButtonClick", ClearButtonClick, historyCounter)

  const handleDeleteOneChatLogById = async function (chatlogId: string) {
    if (auth && auth.user && app) {
      const userId = auth?.user?.username
      const authorization = window.localStorage.getItem(defaultConfig.storageTokenKeyName)!
      DeleteChatChatByChatlogId(app.id, chatlogId)
      DeleteChatChatHistoryByChatlogId(userId, chatId, app.id, chatlogId)

      const data: any = {chatlogId: chatlogId, appId: app.id, action: 'deleteByChatId'}
      const RS = await axios.post(authConfig.backEndApiHost + 'aichat/chatlog.php', data, {
                          headers: {
                            Authorization: authorization,
                            'Content-Type': 'application/json'
                          }
                        }).then(res=>res.data)
      if(RS && RS.status == 'OK') {
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

  useEffect(() => {
    const userId = auth?.user?.username
    if(userId) {
      const ChatChatListValue = ChatChatList(app.id)
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
      console.log("temperature", setTemperature)
      console.log("finishedMessage", finishedMessage)
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

      getChatLogList(app.id, app.WelcomeText)

      setGetTTSFromAppValue(GetTTSFromApp())

      setChatName(app['AppName'])
      setChatId(app['id'])

    }
  }, [t, app])

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
      ChatChatInput(app.id, _id, Obj.send, Obj.message, userId, 0, [])
      setRefreshChatCounter(refreshChatCounter + 1)
      const startTime = performance.now()
      const ChatAiOutputV1Status = await ChatAiOutputV1(authConfig, app, _id, Obj.message, authorization, userId, chatId, setProcessingMessage, setFinishedMessage, setQuestionGuide, app.QuestionGuideTemplate, stopMsg, setStopMsg, temperature)
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

  const [innerHeight, setInnerHeight] = useState<number | string>(window.innerHeight - 48 - 56 - 75)
  console.log("innerHeight innerHeight",innerHeight)

  useEffect(() => {
    const handleResize = () => {
        setInnerHeight(window.innerHeight - 48 - 56 - 75);
    };
    handleResize();
  }, []);

  const [rowInMsg, setRowInMsg] = useState<number>(1)

  const maxRows = 8

  const handleSetRowInMsg = (row: number) => {
    setRowInMsg(row)
  }

  return (
    <Box sx={{ width: '100%', height: innerHeight, overflow: 'hidden', display: 'flex' }}>
      <ChatLog authConfig={authConfig} data={{ ...store?.selectedChat, userContact: store?.userProfile }} chatId={chatId} chatName={chatName} app={app} sendButtonDisable={sendButtonDisable} handleDeleteOneChatLogById={handleDeleteOneChatLogById} sendMsg={sendMsg} store={store} questionGuide={questionGuide} GetTTSFromAppValue={GetTTSFromAppValue}/>
      <SendMsgForm authConfig={authConfig} store={store} sendMsg={sendMsg} sendButtonDisable={sendButtonDisable} sendButtonLoading={sendButtonLoading} sendButtonText={sendButtonText} sendInputText={sendInputText} rowInMsg={rowInMsg} handleSetRowInMsg={handleSetRowInMsg} maxRows={maxRows} setStopMsg={setStopMsg}/>
    </Box>
  )
}

export default ChatIndex

// ** React Imports
import { useRef, useEffect, Ref, ReactNode, Fragment, useState, memo } from 'react'
import { saveAs } from 'file-saver';

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import CircularProgress from '@mui/material/CircularProgress'

import ChatContextPreview from 'src/views/AiChat/ChatContextPreview'

import { AppAvatar } from 'src/functions/ChatBook'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import ReactMarkdown from 'react-markdown'
import RemarkBreaks from "remark-breaks";

// ** Types Imports
import {
  MessageType,
  ChatLogChatType,
  MessageGroupType,
  FormattedChatsType
} from 'src/types/apps/chatTypes'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(3, 3, 3, 3)
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.success.main
}))

const SystemPromptTemplate = ({text, handleSendMsg}: any) => {

  const handleClick = (event: any, keyword: string) => {
    event.preventDefault();
    handleSendMsg(keyword)
  };

  const replaceKeywordsWithLinks = (text: string) => {
    const replacedText = text.split(/(\[.*?\])/).map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const keyword = part.slice(1, -1);

        return (
          <ListItem key={index} sx={{m: 0, p: 0, pt: 0}}>
            <Typography sx={{mr: 3, my: 0.5  }}>•</Typography>
            <LinkStyled href="#" onClick={(event: any) => handleClick(event, keyword)}>
              {keyword}
            </LinkStyled>
          </ListItem>
        );
      }

      return part;
    });

    return replacedText;
  };

  //const text = '你好，我是知识库助手，请不要忘记选择知识库噢~[你是谁]你好: [如何使用]';
  const processedText = replaceKeywordsWithLinks(text);

  return (
    <Box sx={{ pt: 2 }}>
      {processedText}
    </Box>
  );
};

const ChatLog = (props: any) => {
  // ** Props
  const { t } = useTranslation()
  const { authConfig, data, chatName, app, rowInMsg, maxRows, sendButtonDisable, handleDeleteOneChatLogById, sendMsg, store, questionGuide } = props

  const handleSendMsg = (msg: string) => {
    if (store && store.selectedChat && msg.trim().length) {
      sendMsg({ ...store.selectedChat, message: msg, template: '' })
    }
  }

  const [contextPreviewOpen, setContextPreviewOpen] = useState<boolean>(false)
  const [contextPreviewData, setContextPreviewData] = useState<any[]>([])

  // ** Ref
  const chatArea = useRef(null)

  // ** Scroll to chat bottom
  const scrollToBottom = () => {

    // @ts-ignore
    if (chatArea.current && chatArea.current._container && chatArea.current._container.scrollTop) {
      // @ts-ignore
      chatArea.current._container.scrollTop = Number.MAX_SAFE_INTEGER
    }

    // @ts-ignore
    if (chatArea.current && chatArea.current.scrollTop) {
      // @ts-ignore
      chatArea.current.scrollTop = Number.MAX_SAFE_INTEGER
    }

  }

  const handleDownload = (DownloadUrl: string, FileName: string) => {
    fetch(DownloadUrl)
      .then(response => response.blob())
      .then(blob => {
        saveAs(blob, FileName);
      })
      .catch(error => {
        console.log('Error downloading file:', error);
      });
  };

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog: MessageType[] | [] = []
    if (data.chat) {
      chatLog = data.chat.chat
    }

    const formattedChatLog: FormattedChatsType[] = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : 11
    let msgGroup: MessageGroupType = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg: any, index: number) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          time: msg.time,
          msg: msg.message,
          responseTime: msg.responseTime,
          chatlogId: msg.chatlogId,
          history: msg.history,
          feedback: msg.feedback,
          question: ''
        })
      } else {
        chatMessageSenderId = msg.senderId

        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              time: msg.time,
              msg: msg.message,
              responseTime: msg.responseTime,
              chatlogId: msg.chatlogId,
              history: msg.history,
              feedback: msg.feedback,
              question: msg.question
            }
          ]
        }
      }

      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })

    return formattedChatLog
  }

  useEffect(() => {
    if (data && data.chat && data.chat.chat.length) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])


  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item: FormattedChatsType, index: number, ChatItemMsgList: any[]) => {
      const isSender = item.senderId === data.userContact.id

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: index !== ChatItemMsgList.length - 1 ? 4 : undefined
          }}
        >
          {isSender ?
          <Box display="flex" alignItems="center" justifyContent="right" borderRadius="8px" p={0} mb={1} >
            <Tooltip title={t('Copy')}>
              <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                navigator.clipboard.writeText(item.messages[0].msg);
                toast.success(t('Copied success') as string, { duration: 1000 })
              }}>
                <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('ReGenerate')}>
              <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                handleSendMsg(item.messages[0].msg)
              }}>
                <Icon icon='mdi:refresh' fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Delete')}>
              <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                handleDeleteOneChatLogById(item.messages[0].chatlogId)
              }}>
                <Icon icon='mdi:trash-outline' fontSize='inherit' />
              </IconButton>
            </Tooltip>
            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{
                width: '2rem',
                height: '2rem',
                fontSize: '0.875rem',
              }}
              {...{
                src: data.userContact.avatar,
                alt: data.userContact.fullName
              }}
            >
              {app.name}
            </CustomAvatar>
          </Box>
          :
          <Box display="flex" alignItems="center" justifyContent="left" borderRadius="8px" p={0} mb={1} >
            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{
                width: '2rem',
                height: '2rem',
                fontSize: '0.875rem',
              }}
              {...{
                src: app.avatar? AppAvatar(authConfig.backEndApiHost, app.avatar) : '/images/avatars/1.png',
                alt: chatName
              }}
            >
            </CustomAvatar>
            <Typography
              sx={{
                width: 'fit-content',
                fontSize: '0.875rem',
                p: theme => theme.spacing(0.5, 2, 0.5, 2),
                ml: 1,
                color: 'text.primary',
              }}
              >
                {chatName}
            </Typography>
            {sendButtonDisable == true && index == ChatItemMsgList.length - 1  ?
            <Fragment>
              <Typography
                sx={{
                  boxShadow: 1,
                  borderRadius: 0.5,
                  width: 'fit-content',
                  fontSize: '0.875rem',
                  p: theme => theme.spacing(0.5, 2, 0.5, 2),
                  ml: 1,
                  color: 'text.primary',
                  backgroundColor: 'background.paper'
                }}
                >
                  <CircularProgress color='success' size={10} sx={{mr: 1}}/>
                  {t('AI Chat')}
              </Typography>
            </Fragment>
            :
            null
            }
            {(sendButtonDisable == true && index < ChatItemMsgList.length - 1) || (sendButtonDisable == false && index > 0) ?
            <Fragment>
              <Tooltip title={t('Copy')}>
                <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                  navigator.clipboard.writeText(item.messages[0].msg);
                  toast.success(t('Copied success') as string, { duration: 1000 })
                }}>
                  <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                </IconButton>
              </Tooltip>

            </Fragment>
            :
            null
            }

          </Box>
          }

          <Box className='chat-body' sx={{ width: '100%' }}>
            {item.messages.map((chat: ChatLogChatType, ChatIndex: number) => {
              let ChatMsgType = 'Chat'
              let ChatMsgContent: any
              if(chat.msg.includes('"type":"image"')) {
                ChatMsgType = 'Image'
                ChatMsgContent = JSON.parse(chat.msg)
              }
              if(chat.msg.includes('"type":"audio"')) {
                ChatMsgType = 'Audio'
                ChatMsgContent = JSON.parse(chat.msg)
              }

              return (
                <Box key={ChatIndex} sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
                    {ChatMsgType == "Chat" &&
                      <div>
                        <Typography sx={{
                                      boxShadow: 1,
                                      borderRadius: 1,
                                      width: isSender ? 'fit-content' : '100%',
                                      fontSize: '0.875rem',
                                      p: theme => theme.spacing(0.1, 2, 0.1, 2),
                                      ml: isSender ? 'auto' : undefined,
                                      borderTopLeftRadius: !isSender ? 0 : undefined,
                                      borderTopRightRadius: isSender ? 0 : undefined,
                                      color: isSender ? 'common.white' : 'text.primary',
                                      backgroundColor: isSender ? 'primary.main' : 'background.paper'
                                    }}
                        >
                          { index == 0 ?
                            <SystemPromptTemplate text={chat.msg} handleSendMsg={handleSendMsg}/>
                          :
                            <ReactMarkdown remarkPlugins={[RemarkBreaks]}>{chat.msg.replaceAll('\\n', '\n')}</ReactMarkdown>
                          }
                          {!isSender && index == ChatItemMsgList.length - 1 && index>0 && questionGuide ?
                            <Box>
                              <Box display="flex" alignItems="center">
                                <Avatar src={'/images/aichat/cq.png'} sx={{ mr: 2.5, width: 26, height: 26 }} />
                                {t('QuestionGuide')}
                              </Box>
                              {questionGuide && questionGuide.length > 0 && Array.isArray(questionGuide) && questionGuide.map((question: string, index: number)=>{

                                return (
                                  <ListItem key={index} sx={{m: 0, p: 0, pt: 0}}>
                                    <Typography sx={{mr: 3, my: 0.5, ml: 5  }}>•</Typography>
                                    {question != 'Generating, please wait...' ?
                                    <LinkStyled href="#" onClick={() => {
                                      handleSendMsg(question)
                                    }}>
                                      {question}
                                    </LinkStyled>
                                    :
                                    <Typography sx={{my: 0.5  }} variant='body2'>{t(question)}</Typography>
                                    }

                                  </ListItem>
                                )
                              })}
                            </Box>
                          :
                          null
                          }
                          <Box
                              sx={{
                                mt: 1,
                                ml: -2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isSender ? 'flex-end' : 'flex-start'
                              }}
                            >
                              {!isSender && Number(chat.responseTime) > 0 && ( (index + 1 == ChatItemMsgList.length && !sendButtonDisable) || (index + 1 < ChatItemMsgList.length))?
                              <Box display="flex" alignItems="center" justifyContent="left" borderRadius="8px" p={0} mb={1} >
                                  <Tooltip title={t('ViewDetail')}>
                                    <Button color='success' size="small" style={{ whiteSpace: 'nowrap' }} onClick={()=>{
                                      const historyAll: any[] = [...chat.history]
                                      historyAll.push([chat.question, chat.msg])
                                      setContextPreviewOpen(true)
                                      setContextPreviewData(historyAll)
                                    }}>
                                      {t('ContextCount')}({(chat.history.length+1)*2+1})
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title={t('RunningTime')}>
                                    <Button color='error' size="small" style={{ whiteSpace: 'nowrap' }} disableTouchRipple disableRipple>{chat.responseTime}S</Button>
                                  </Tooltip>
                                  <Button color='info' size="small" disabled style={{ whiteSpace: 'nowrap' }}>
                                  {chat.time ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : null}
                                  </Button>
                              </Box>
                              :
                              null
                              }
                          </Box>
                        </Typography>
                      </div>
                    }
                    {ChatMsgType == "Image" && ChatMsgContent && ChatMsgContent.ShortFileName ?
                      <div>
                        <LinkStyled target='_blank' href={authConfig.backEndApiHost + 'images/' + ChatMsgContent.ShortFileName}>
                          <CardMedia image={authConfig.backEndApiHost + 'images/' + ChatMsgContent.ShortFileName} sx={{ mt: 1, width: '500px', height: '500px', borderRadius: '5px' }}/>
                        </LinkStyled>
                        <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isSender ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <Typography variant='caption'>
                              {chat.time
                                ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                : null}
                              {ChatMsgContent.ShortFileName ?
                              <LinkStyled onClick={()=>handleDownload(authConfig.backEndApiHost + 'images/' + ChatMsgContent.ShortFileName, ChatMsgContent.ShortFileName + '.png')} href={'#'} sx={{ml: 1}}>
                                Download
                              </LinkStyled>
                              :
                              null
                              }
                            </Typography>
                          </Box>
                      </div>
                      :
                      null
                    }
                    {ChatMsgType == "Audio" && ChatMsgContent && ChatMsgContent.ShortFileName ?
                      <div>
                        <LinkStyled target='_blank' href={authConfig.backEndApiHost + 'api/audio/' + ChatMsgContent.ShortFileName}>
                          <CardMedia component="audio" controls src={authConfig.backEndApiHost + 'api/audio/' + ChatMsgContent.ShortFileName} sx={{ mt: 1, width: '360px', borderRadius: '5px' }}/>
                        </LinkStyled>
                        <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isSender ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <Typography variant='caption'>
                              {chat.time
                                ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                : null}
                              {ChatMsgContent.ShortFileName ?
                              <LinkStyled onClick={()=>handleDownload(authConfig.backEndApiHost + 'api/audio/' + ChatMsgContent.ShortFileName, ChatMsgContent.ShortFileName + '.mp3')} href={'#'} sx={{ml: 1}}>
                                Download
                              </LinkStyled>
                              :
                              null
                              }
                            </Typography>
                          </Box>
                      </div>
                      :
                      null
                    }
                </Box>
              )
            })}
          </Box>

        </Box>
      )
    })
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (false) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: `calc(100% - 30px)`, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false, suppressScrollX: true }}>
          {children}
        </PerfectScrollbar>
      )
    }
  }

  const inputMsgHeight = rowInMsg <= maxRows? rowInMsg * 1.25 : maxRows * 1.25
  console.log("inputMsgHeight", inputMsgHeight)

  return (
    <Fragment>
      <ScrollWrapper >{renderChats()}</ScrollWrapper>
      <ChatContextPreview contextPreviewOpen={contextPreviewOpen} setContextPreviewOpen={setContextPreviewOpen} contextPreviewData={contextPreviewData} app={app}/>
    </Fragment>
  )
}

export default memo(ChatLog)

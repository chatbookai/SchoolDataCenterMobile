
import Index from 'src/views/App/chat/Index';

const ChatApp = ({authConfig}: any) => {

  const app = {id: 'ididididid', avatar: '1.png', SystemPrompt: 'System Prompt', Model: {}, WelcomeText: 'Welcome Text', QuestionGuide: {} }

  return <Index authConfig={authConfig} app={app} />

}

export default ChatApp

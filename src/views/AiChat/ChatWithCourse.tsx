
import Index from 'src/views/App/chat/Index';

const ChatAnonymousApp = ({authConfig}: any) => {

  const app = {id: 'ididididid', avatar: 'avataravataravatar'}

  return <Index authConfig={authConfig} app={app} />

}

export default ChatAnonymousApp

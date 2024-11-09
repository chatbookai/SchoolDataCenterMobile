import os from 'os'

const hostname = os.hostname()

let APP_URL = '/api/'
let AppName = "单点职校数据中心"
let indexDashboardPath = "/dashboards/analytics"
let indexMenuspath = "auth/menus.php"
let AppMarkId = 'dandian'

if(hostname == 'localhost' || hostname == '127.0.0.1')   {
  APP_URL = "http://localhost:80/api/"
  AppName = "单点职校数据中心"
  indexDashboardPath = "/dashboards/analytics"
  indexMenuspath = "auth/menus.php"
  AppMarkId = 'dandian'
}

APP_URL = "https://fdzz.dandian.net/api/"
AppMarkId = 'fdzz'

const config = {
  AppName: AppName,
  AppLogo: '/icons/' + AppMarkId + '/icon256.png',
  AppMarkId: AppMarkId,
  Github: 'https://github.com/chatbookai/SchoolDataCenter',
  AppVersion: '20241030',
  defaultLanguage: 'zh-CN',
  indexMenuspath: indexMenuspath,
  meEndpoint: APP_URL+'jwt.php?action=refresh',
  loginEndpoint: APP_URL+'jwt.php?action=login',
  logoutEndpoint: APP_URL+'jwt.php?action=logout',
  refreshEndpoint: APP_URL+'jwt.php?action=refresh',
  registerEndpoint: APP_URL+'jwt/register',
  storageTokenKeyName: 'accessToken',
  storageAccessKeyName: 'accessKey',
  storageMainMenus: 'mainMenus',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  backEndApiHost: APP_URL,
  indexDashboardPath: indexDashboardPath,
  k: "fbae1da1c3f10b1ce0c75c8f5d3319d0"

}

export default config;

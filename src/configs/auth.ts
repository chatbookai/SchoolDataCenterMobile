
export const AppSchoolConfigMap: any    = {}
AppSchoolConfigMap['dandian']    = ["https://fdzz.dandian.net/api/", '单点数据中心', "auth/menusMobile.php", "http://110.90.174.66:8083/api/"]
AppSchoolConfigMap['fdzyzz.com'] = ["https://fdzz.dandian.net/api/", '福鼎职业中专', "auth/menusMobile.php", "http://110.90.174.66:8083/api/"]
AppSchoolConfigMap['fjsmnx.com'] = ["https://fdzz.dandian.net/api/", '三明林业学校', "auth/menusMobile.php", "http://110.90.174.66:8083/api/"]

export function getConfig(Username: string) {
  const UsernameArray = Username.split('@')
  const AppMarkId = UsernameArray[1] && AppSchoolConfigMap[UsernameArray[1]] ? UsernameArray[1] : 'dandian'
  const APP_URL = AppSchoolConfigMap[AppMarkId][0]
  const AppName = AppSchoolConfigMap[AppMarkId][1]
  const indexMenuspath = AppSchoolConfigMap[AppMarkId][2]
  const backEndApiAiBaseUrl = AppSchoolConfigMap[AppMarkId][3]

  return {
    AppName: AppName,
    AppLogo: '/icons/' + AppMarkId + '/icon256.png',
    AppMarkId: AppMarkId,
    AppSchoolConfigMap: AppSchoolConfigMap,
    indexMenuspath: indexMenuspath,
    meEndpoint: APP_URL + 'jwt.php?action=refresh',
    loginEndpoint: APP_URL + 'jwt.php?action=login',
    logoutEndpoint: APP_URL + 'jwt.php?action=logout',
    refreshEndpoint: APP_URL + 'jwt.php?action=refresh',
    registerEndpoint: APP_URL + 'jwt/register',
    backEndApiHost: APP_URL,
    backEndApiAiBaseUrl: backEndApiAiBaseUrl
  };

}

export const defaultConfig = {
  Github: 'https://github.com/chatbookai/SchoolDataCenterMobile',
  AppVersion: '20241125',
  defaultLanguage: 'zh-CN',
  storageTokenKeyName: 'accessToken',
  storageAccessKeyName: 'accessKey',
  storageMainMenus: 'storageMainMenus',
  myCoursesList: 'myCoursesList',
}

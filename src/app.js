import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import dva from './utils/dva'
import models from './model'
import {Provider} from '@tarojs/redux'

import './app.scss'
import 'taro-ui/dist/style/index.scss'
import {hasLogin} from "./utils/common"; // 全局引入一次即可

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
  require('nerv-devtools')
}


const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError(e, dispatch) {
    console.log(e)
  },
});
const store = dvaApp.getStore();

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/dynamic/index',
      'pages/mine/index',
      'pages/login/login',
      'pages/mine/about',
      'pages/mine/author'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#D64337',
      navigationBarTitleText: 'Giteer',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      list: [{
        pagePath: 'pages/index/index',
        text: '发现',
        iconPath: './asset/images/tab/discovery.png',
        selectedIconPath: './asset/images/tab/discovery_focus.png'
      }, {
        pagePath: 'pages/dynamic/index',
        text: '动态',
        iconPath: './asset/images/tab/dynamic.png',
        selectedIconPath: './asset/images/tab/dynamic_focus.png'
      }, {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: './asset/images/tab/mine.png',
        selectedIconPath: './asset/images/tab/mine_focus.png'
      }],
      color: '#8a8a8a',
      selectedColor: '#000000',
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    }
  };

  componentDidMount () {
    this.updateApp();
    if(!hasLogin()){
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    }
    wx.cloud.init({
      env: 'giteer-36a385',
      traceUser: true
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  /*更新小程序*/
  updateApp() {
    if (Taro.canIUse('getUpdateManager')) {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log('hasUpdate', res.hasUpdate)
      })
      updateManager.onUpdateReady(() => {
        Taro.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新版本下载失败
      })
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (<Provider store={store}>
      <Index/>
    </Provider>);
  }
}

Taro.render(<App />, document.getElementById('app'));
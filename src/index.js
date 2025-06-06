import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import { socket } from './utils/socket';
import { SAVE_LOAN, SAVE_MAP } from './store/types';
import Router from './router';
import configStore from './store';
import './global.scss';

const store = configStore();
socket.init({
  wsHost: '/',
  onConn: () => {
    socket.wsEmit({ name: 'msg' });
    socket.wsEmit({ name: 'loan' });
    socket.wsEmit({ name: 'userConver' });
    socket.wsEmit({ name: 'product' });
    socket.wsEmit({ name: 'cooperator' });
    socket.wsEmit({ name: 'equipment' });
  },
  onReceiveMsg: data => {
    const contentTypeMap = {
      msg: SAVE_MAP,
      loan: SAVE_LOAN,
      userConver: SAVE_LOAN,
      product: SAVE_LOAN,
      cooperator: SAVE_LOAN,
      equipment: SAVE_LOAN,
    };

    const action = contentTypeMap[data.contentType];

    if (action) {
      store.dispatch({ type: action, payload: { ...data.data } });
    } else {
      console.error(`ws resp ${data.contentType} not match...`);
    }
  },
  onDisconn() {},
});

socket.initWs();

moment.locale('zh-cn');

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConfigProvider locale={zhCN}>
          <BrowserRouter basename="/dashboard">
            <Component />
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
}

/* 初始化 */
render(Router);

/* 热更新 */
if (module.hot) {
  module.hot.accept('./router/index.js', () => {
    render(Router);
  });
}

// 判断该浏览器支不支持 serviceWorker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/service-worker.js')
//       .then(registration => console.log(`service-worker registed' ${registration}`))
//       .catch(error => console.log(`service-worker registed error' ${error}`));
//   });
// }

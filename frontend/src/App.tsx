import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'antd/locale/zh_CN'

import Router from './Router'

dayjs.locale('zh-cn')



const App = () => {
  return <ConfigProvider locale={zhCN}>
    <Router/>
  </ConfigProvider>
}

export default App
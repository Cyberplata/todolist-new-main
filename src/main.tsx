import {createRoot} from 'react-dom/client'
import './index.css'
import {Provider} from 'react-redux'
import {App} from './app/App'
import { store } from "./app/store.ts"

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App/>
  </Provider>
)

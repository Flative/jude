import 'react-progress-bar-plus/lib/progress-bar.css'
import 'rc-slider/assets/index.css'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

import Main from './containers/Main'

import './styles/index.scss'

const store = configureStore()

render((
  <Provider store={store}>
    <Main />
  </Provider>
), document.getElementById('jude'))

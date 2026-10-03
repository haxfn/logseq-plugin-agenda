import '@logseq/libs'
import 'antd/dist/reset.css'
import proxyLogseq from 'logseq-proxy'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { LOGSEQ_PROVIDE_COMMON_STYLE } from '@/constants/style'
import { listenEsc, log } from '@/util/util'

import { getLogseqApiConfig } from './Agenda3/helpers/logseq'
import { track } from './Agenda3/helpers/umami'
import { renderAgendaRoute } from './Agenda3/route'
import Agenda3App from './apps/Agenda3App'
import './style/index.less'

if (import.meta.env.VITE_MODE === 'web') {
  // run in browser
  const { apiServer, apiToken } = getLogseqApiConfig()
  console.log('[faiz:] === LOGSEQ_API_SERVER', apiServer)
  console.log(`%c[version]: v${__APP_VERSION__}`, 'background-color: #60A5FA; color: white; padding: 4px;')
  proxyLogseq({
    config: { apiServer, apiToken },
    settings: window.mockSettings,
  })
  // logseq.provideStyle(`.drawer[data-drawer-name="agenda"] {display: none;}`)
  renderApp()
} else {
  log('=== logseq-plugin-agenda loaded ===')
  logseq.ready(async () => {
    let isDbGraph: boolean
    try {
      isDbGraph = Boolean(await logseq.App.checkCurrentIsDbGraph())
    } catch (error) {
      console.error('Failed to detect Logseq graph type', error)
      await logseq.UI.showMsg('Unable to detect the Logseq graph type', 'error')
      return
    }
    if (!isDbGraph) {
      await logseq.UI.showMsg('Agenda currently requires a Logseq DB graph', 'warning')
      return
    }

    logseq.App.getUserConfigs().then((configs) => {
      window.logseqAppUserConfigs = configs
      console.log('[faiz:] === configs', configs)
    })
    // fix: https://github.com/haydenull/logseq-plugin-agenda/issues/87
    logseq.setMainUIInlineStyle({ zIndex: 1000 })
    logseq.provideStyle(LOGSEQ_PROVIDE_COMMON_STYLE)
    Notification.requestPermission()

    const showAgendaOverlay = () => {
      track('Show Agenda', { version: __APP_VERSION__ })
      if (window.isMounted !== true) {
        renderApp()
        window.isMounted = true
      }
      logseq.showMainUI()
    }

    let routeRendererAvailable = false
    try {
      const registerRouteRenderer = logseq.Experiments?.registerRouteRenderer
      if (typeof registerRouteRenderer === 'function') {
        const unregister = registerRouteRenderer.call(logseq.Experiments, 'agenda-main-route', {
          path: '/agenda',
          name: 'agenda-main-route',
          render: renderAgendaRoute,
        })
        routeRendererAvailable = typeof unregister === 'function'
      }
    } catch (error) {
      console.error('Failed to register the experimental Agenda route', error)
    }

    const showAgenda3 = () => {
      track('Show Agenda', { version: __APP_VERSION__ })
      if (routeRendererAvailable) {
        logseq.App.pushState('agenda-main-route')
      } else {
        void logseq.UI.showMsg(
          'The Agenda main-content route is unavailable in this Logseq version. Opening the plugin window instead.',
          'warning',
        )
        showAgendaOverlay()
      }
    }

    // ===== logseq plugin model start =====
    logseq.provideModel({
      showAgenda3,
      showAgendaOverlay,
      hide() {
        logseq.hideMainUI()
      },
    })
    // ===== logseq plugin model end =====
    // ========== show or hide app start =========
    logseq.App.registerUIItem('toolbar', {
      key: 'Agenda3',
      template: '<a data-on-click="showAgenda3" class="button"><i class="ti ti-comet"></i></a>',
    })
    listenEsc(() => logseq.hideMainUI())
    logseq.App.registerCommandPalette(
      {
        key: 'Agenda:show',
        label: 'Open Agenda',
        keybinding: {
          binding: 'ctrl+shift+s',
        },
      },
      showAgenda3,
    )
    logseq.App.registerCommandPalette(
      {
        key: 'Agenda:show-overlay',
        label: 'Open Agenda in plugin window',
      },
      showAgendaOverlay,
    )
    // ========== show or hide app end =========
  })
}

function renderApp() {
  window.currentApp = 'agenda3App'
  const html = document.querySelector('html')
  const body = document.querySelector('body')
  html?.classList.add('agenda3')
  body?.classList.add('agenda3')

  const root = createRoot(document.getElementById('root')!)
  root.render(
    <React.StrictMode>
      <Agenda3App />
    </React.StrictMode>,
  )
}

export function renderModalApp(_params: { type: string; data?: unknown }) {
  void logseq.UI.showMsg('This Agenda feature is not available in the DB-only MVP', 'warning')
}

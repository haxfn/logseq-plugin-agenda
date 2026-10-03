import antdStyles from 'antd/dist/reset.css?inline'
import katexStyles from 'katex/dist/katex.min.css?inline'
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'

import Agenda3App from '@/apps/Agenda3App'

import agendaStyles from '../style/index.less?inline'
import { setAgendaRouteActive } from './helpers/logseq'

let mountedContainer: HTMLDivElement | null = null
let mountedShadowRoot: ShadowRoot | null = null
let appRoot: Root | null = null

function unmountAgenda() {
  if (!mountedContainer) return
  appRoot?.unmount()
  mountedShadowRoot?.replaceChildren()
  mountedContainer = null
  mountedShadowRoot = null
  appRoot = null
  setAgendaRouteActive(false)
}

function mountAgenda(container: HTMLDivElement) {
  if (mountedContainer === container) return
  unmountAgenda()

  const shadowRoot = container.shadowRoot ?? container.attachShadow({ mode: 'open' })
  mountedShadowRoot = shadowRoot
  const style = container.ownerDocument.createElement('style')
  style.textContent = `${antdStyles}\n${agendaStyles}\n${katexStyles}`
  shadowRoot.appendChild(style)

  const mountNode = container.ownerDocument.createElement('div')
  mountNode.className = 'h-full w-full'
  shadowRoot.appendChild(mountNode)

  mountedContainer = container
  appRoot = createRoot(mountNode)
  setAgendaRouteActive(true)
  appRoot.render(
    <React.StrictMode>
      <Agenda3App embedded styleContainer={shadowRoot} />
    </React.StrictMode>,
  )
}

function routeContainerRef(container: HTMLDivElement | null) {
  if (container) {
    mountAgenda(container)
  } else {
    unmountAgenda()
  }
}

export function renderAgendaRoute() {
  const hostReact = logseq.Experiments.React as typeof React
  return hostReact.createElement('div', {
    className: 'agenda-route-container',
    ref: routeContainerRef,
    style: { width: '100%', height: '100%', minHeight: '600px' },
  })
}

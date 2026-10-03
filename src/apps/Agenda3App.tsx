import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'

import Dashboard from '@/Agenda3'
import { ThemeProvider, useTheme } from '@/Agenda3/components/ThemeProvider'
import { NEW_ANTD_THEME_CONFIG } from '@/util/constants'

const Agenda3 = ({ embedded = false, styleContainer }: { embedded?: boolean; styleContainer?: ShadowRoot }) => {
  return (
    <ThemeProvider defaultThemeSetting="system">
      <MainApp embedded={embedded} styleContainer={styleContainer} />
    </ThemeProvider>
  )
}

function MainApp({ embedded, styleContainer }: { embedded: boolean; styleContainer?: ShadowRoot }) {
  const { currentTheme: theme } = useTheme()
  return (
    <ConfigProvider theme={NEW_ANTD_THEME_CONFIG[theme]}>
      <StyleProvider hashPriority="high" container={styleContainer}>
        <main
          className={`${embedded ? 'flex h-full w-full flex-col' : 'flex h-screen w-screen flex-col'} ${
            theme === 'dark' ? 'dark' : ''
          }`}
        >
          <Dashboard embedded={embedded} />
        </main>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default Agenda3

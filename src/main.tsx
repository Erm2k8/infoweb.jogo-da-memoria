import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/pixelify-sans/700.css'
import './styles/tokens.css'
import './styles/global.css'
import { fonteTitulo } from './assets'
import { App } from './App'

if (fonteTitulo) {
  new FontFace('Titulo', `url(${fonteTitulo})`)
    .load()
    .then((fonte) => document.fonts.add(fonte))
    .catch(() => {})
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

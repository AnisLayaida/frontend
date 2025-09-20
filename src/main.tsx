import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Test from './Test.tsx'  // Import new file

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Test />
  </StrictMode>,
)
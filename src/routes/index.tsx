import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import { ThemeProvider } from "../components/Themeprovider"
import { ModeToggle } from '@/components/mode-toggle'
import SignIn from '@/components/sign-in'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <ModeToggle />
    </ThemeProvider>
  )
}

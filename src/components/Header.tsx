import { User } from 'drizzle/db'
import { ThemeProvider } from './Themeprovider'
import { Navbar05 } from './shadcn/ui/shadcn-io/navbar-05'

interface HeaderProps {
  currentUser?: User | null
  theme: 'light' | 'dark' | 'system'
}

export function Header({ currentUser, theme }: HeaderProps) {
  return (
    <ThemeProvider theme={theme}>
      <Navbar05 currentUser={currentUser} />
    </ThemeProvider>
  )
}
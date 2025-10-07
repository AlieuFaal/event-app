import { User } from 'drizzle/db'
import { ThemeProvider } from './Themeprovider'
import { Navbar05 } from './shadcn/ui/shadcn-io/navbar-05'

interface HeaderProps {
  currentUser?: User | null
}

export function Header({ currentUser }: HeaderProps) {
  return (
    <ThemeProvider>
      <Navbar05 currentUser={currentUser} />
    </ThemeProvider>
  )
}
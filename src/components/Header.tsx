import { ThemeProvider } from './Themeprovider'
import { Navbar05 } from './shadcn/ui/shadcn-io/navbar-05'


export default function Header() {
  return (
    <ThemeProvider>
      <Navbar05 />
    </ThemeProvider>
  )
}
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgotpassword')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/forgotpassword"!</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgotpassword')({
  component: ForgotPasswordComponent,
})

function ForgotPasswordComponent() {
  return <div>Hello "/forgotpassword"!</div>
}

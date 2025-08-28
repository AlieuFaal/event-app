//make sure you're using the react client
import { createAuthClient } from "better-auth/react"

const { useSession } = createAuthClient() 
 
export function User() {
    const {
        data: session,
        isPending, //loading state
        error, //error object 
    } = useSession()
    return (
        <div>
            {isPending && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {session ? (
                <div>
                    <p>Welcome, {session.user?.email}</p>
                </div>
            ) : (
                <p>No user is signed in.</p>
            )}
        </div>
    )
}
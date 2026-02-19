import { AuthPanel } from '../../components/AuthPanel/AuthPanel'

export const Homepage = ({ user, setUser }) => {
    return (
        <div>Homepage
            {!user ? (
                <AuthPanel onLogin={setUser} />
            ) : (
                <div>Welcome {user.firstName}</div>
            )}
        </div>
    )
}

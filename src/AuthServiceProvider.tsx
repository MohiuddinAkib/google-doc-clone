import React from 'react'
import { auth } from "@config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Backdrop, CircularProgress } from '@material-ui/core';

export const AuthContext = React.createContext({
    user: null as User | null,
    error: null as Error | null,
    isError: false as boolean,
    isLoading: true as boolean,
    isAuthenticated: false as boolean,
})


function AuthServiceProvider(props: React.PropsWithChildren<{}>) {
    const [user, setUser] = React.useState<User | null>(null);
    const [error, setError] = React.useState<Error | null>(null);
    const [isError, setIsError] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    React.useEffect(() => {
        return onAuthStateChanged(
            auth,
            (user) => {
                setError(null);
                setIsError(false);

                if (user) {
                    setUser(user);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
                setIsLoading(false);
            },
            (error) => {
                setIsError(true);
                setError(error);
                setIsLoading(false);
            },
            () => {
                console.log("finally");
                setIsLoading(false);
            }
        );
    }, []);

    if (isLoading) {
        return <Backdrop open>
            <CircularProgress />
        </Backdrop>
    }

    return (
        <AuthContext.Provider value={{
            user,
            error,
            isError,
            isLoading,
            isAuthenticated
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthServiceProvider
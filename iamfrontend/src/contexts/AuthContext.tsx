import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import { getCurrentUser } from '../features/auth/services/authSessionService';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuthentication() {
            try {
                await getCurrentUser();
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuthentication();
    }, []);

    function login() {
        setIsAuthenticated(true);
    }

    function logout() {
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
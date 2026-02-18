import { auth } from "@/firebase.config";
import {
    onAuthStateChanged,
    signInAnonymously,
    signOut,
    User,
} from "firebase/auth";
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type AuthContextValue = {
    isAuthenticated: boolean;
    userId: string | null;
    loading: boolean;
    error: Error | null;
    signInAnonymously: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
}

export default function AuthProvider({
    children,
}: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const SignIn = useCallback(async () => {
        try {
            await signInAnonymously(auth);
            setError(null);
        } catch (err) {
            const errorObject = err as Error;
            setError(errorObject);
            setLoading(false);
            throw errorObject;
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            },
            (authError) => {
                setError(authError as Error);
                setLoading(false);
            }
        );

        if (!auth.currentUser) {
            void SignIn();
        } else {
            setUser(auth.currentUser);
            setLoading(false);
        }

        return unsubscribe;
    }, [SignIn]);

    const handleSignOut = useCallback(async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: Boolean(user),
            userId: user?.uid ?? null,
            loading,
            error,
            signInAnonymously: SignIn,
            signOut: handleSignOut,
        }),
        [user, loading, error, SignIn, handleSignOut]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
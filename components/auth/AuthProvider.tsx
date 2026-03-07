import { auth, firebaseInitError } from "@/firebase.config";
import {
    onAuthStateChanged,
    signInAnonymously,
    signInWithEmailAndPassword,
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
    signInWithEmail: (email: string, password: string) => Promise<void>;
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

    const getAuthOrThrow = useCallback(() => {
        if (auth) {
            return auth;
        }

        const startupError = firebaseInitError ?? new Error("Firebase Auth unavailable.");
        setError(startupError);
        setLoading(false);
        throw startupError;
    }, []);

    const signInAnonymouslyLocal = useCallback(async () => {
        try {
            await signInAnonymously(getAuthOrThrow());
            setError(null);
        } catch (err) {
            const errorObject = err as Error;
            setError(errorObject);
            setLoading(false);
            throw errorObject;
        }
    }, [getAuthOrThrow]);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(getAuthOrThrow(), email, password);
            setError(null);
        }
        catch (err) {
            const errorObject = err as Error;
            setError(errorObject);
            setLoading(false);
            throw errorObject;
        }
    }, [getAuthOrThrow]);

    useEffect(() => {
        if (!auth) {
            setError(firebaseInitError ?? new Error("Firebase Auth unavailable."));
            setLoading(false);
            return;
        }

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

        // Just check the current user state, don't auto-sign-in
        if (auth.currentUser) {
            setUser(auth.currentUser);
            setLoading(false);
        }

        return unsubscribe;
    }, []);

    const handleSignOut = useCallback(async () => {
        setLoading(true);
        try {
            await signOut(getAuthOrThrow());
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getAuthOrThrow]);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: Boolean(user),
            userId: user?.uid ?? null,
            loading,
            error,
            signInAnonymously: signInAnonymouslyLocal,
            signInWithEmail: signInWithEmail,
            signOut: handleSignOut,
        }),
        [user, loading, error, signInAnonymouslyLocal, signInWithEmail, handleSignOut]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
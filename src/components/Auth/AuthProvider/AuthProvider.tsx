import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
    UserCredential
  } from "firebase/auth";
  import { createContext, ReactNode, useEffect, useState } from "react";
  import { auth } from "../../../firebase";
  
  

export type AuthContextType = {
    createUser: (email: string, password: string) => Promise<UserCredential>;
    user: User | null;
    loginUser: (email: string, password: string) => Promise<UserCredential>;
    logOut: () => Promise<void>;
    loading: boolean;
};


export const AuthContext = createContext<AuthContextType | null>(null);
type AuthProviderType = {
    children: ReactNode
}
export const AuthProvider: React.FC<AuthProviderType> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email: string, password: string) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = (email: string, password: string) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        });

        return () => {
        unsubscribe();
        };
    }, []);

    const authValue = {
        createUser,
        user,
        loginUser,
        logOut,
        loading,
    };

    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};


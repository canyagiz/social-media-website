// TSX file since it returns a PROVIDER
/* Component
    - Structure which shows something to user
*/ 

/* Context
    - A kind of pool which stores data, functionality for GENERAL/GLOBAL access
*/

import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface AuthContextType { 
    user: User | null;  // user is a supabase User or null (not logged in case)
    signInWithGitHub: () => void; // sign in & sign out does not returns anything
    signOut: () => void; 
}



/* <> : Context Type
    - Identifies what kind of information the Context going to enable.
*/
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PROVIDER Wrapper component
/* Children: the components which can be use the VALUE LIST
    - type of children is React.ReactNode e.x: <div> <Home> <Navbar> etc... The every node in the tree that retrived from DOM
*/

/* Props (Properties)
    - Parameters of the components
*/
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    /* useEffect
    - A hook which runs after a COMPONENT IS RENDERED!
    - Name makes sense a lot,
    - It is used for doing AFTER something
    
    HAS 3 PARTS:
    - Callback function: the codes runs after component is rendered
    - Dependency array(dependendices): Which variables going to be effected
    */
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setUser(session?.user ?? null);
        });
        const {data: listener} = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        })
        return () => {
            listener.subscription.unsubscribe();
        }
    },[]);

    const signInWithGitHub = () => {
        supabase.auth.signInWithOAuth({provider: "github"});
    };

    const signOut = () => {
        supabase.auth.signOut();
    };


    {/* the data and functions in VALUE list are going to be accesible to all wrapped components*/}
    return <AuthContext.Provider value={{user, signInWithGitHub, signOut}}> {children} </AuthContext.Provider>
};

// Undefined: A variable is declared but not a value assigned yet, thus undefined means the DEFAULT value of a variable
// Null: Means directyl empty, nothing. Thus, differs from undefined
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
        return context;
    
    
};

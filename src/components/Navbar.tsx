import { useState } from "react";
/* Why useState is needed?
    const [menuOpen, setMenuOpen] = useState(false); 
    menuOpen is the state which we manipulate 
    setMenuOpen is the setter function which helps to reach menuOpen state.
    Reason beyond is, virtual DOM must be updated after every change, 
    however, directly menuOpen = true does not updates the DOM, 
    BUT setMenuOpen UPDATES DOM!!!!
*/

/* DOM (Document Object Model)
    - Live version of HTML files on browser
    - Browser resolves the HTML and parse as TREE and upload as tree to MEMORY
        - Every <div>, <button>, <h1>.. are NODE in tree
    
    The change on DOM means updating the tree, thus updating MEMORY 
    FOR EVERY CHANGE

    Thus, the application may be slow.

*/

/* Virtual DOM
    The updates for every change were causing slowness
    After every changement, react constructs a copy of the DOM TREE over VIRTUAL DOM
    Diffing: Comparison between DOM & VIRTUAL DOM occurs 
    Only the differences between vdom & dom applied on DOM

    Sum: Instead completely change on DOM, only changed parts are updated!!!
*/


import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false); {/* Hook for initializing states */}
    const {signInWithGitHub, signOut, user} = useAuth();

    const displayName = user?.user_metadata.user_name || user?.email;

    return(  
        <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-5xl mx-auto px-4">

            <div className="flex justify-between items-center h-16">
                <Link to="/" className="font-mono text-xl font-bold text-white">
                forum<span className="text-purple-500">.app</span>
            </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to={'/'}> Home </Link>
                    <Link to={'/create'}> Create Post </Link>
                    <Link to={'/communities'}> Communities </Link>
                    <Link to={'/community/create'}> Create Community </Link>
                </div>

                {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                Sign in with GitHub
              </button>
            )}
          </div>
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen((prev) => !prev)}> Open 
                    <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? ( // if true, show X
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : ( // if false show Hamburger Menu
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>

                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link to={'/'} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"> Home </Link>
                    <Link to={'/create'} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"> Create Post </Link>
                    <Link to={'/communities'} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"> Communities </Link>
                    <Link to={'/community/create'} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"> Create Community </Link>
                    </div>
                </div>)

                }
                
            </div>
        </div>
    </nav>
    );
};
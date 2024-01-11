import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/app/firebase";

interface AuthContextValue {
  user: any;
  googleSignIn?: () => void;
  logOut?: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: "",
  googleSignIn: () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((res) => {

      if (res?.operationType === "signIn") {
        const data = {
          name: res?.user?.displayName,
          email: res?.user?.email,
          profileurl: res?.user?.photoURL,
          login:"true"
        };
        localStorage.setItem("userdata", JSON.stringify(data));
        window.open("http://localhost:3000/", "_self");
      }
    });
  },
  logOut: () => {
    signOut(auth);
  },
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
    
      return () => unsubscribe();
    }, []);
    signInWithPopup(auth, provider);
  };
  const logOut = () => {
    signOut(auth);
  };
  return (
    <AuthContext.Provider value={{ user, logOut, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

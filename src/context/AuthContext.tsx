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

import { getUsersDetails, addNewUserData } from "@/api/Api";
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
      const fetchData = async () => {
        const data: any = await getUsersDetails();
        const uidToCheck = res?.user?.uid;
        const isUidInData = data.find((item: { uid: string; }) => item.uid === uidToCheck);
        if (isUidInData) {
          if (res?.operationType === "signIn") {
            const data = {
              name: isUidInData?.name,
              email: isUidInData?.email,
              profileurl: res?.user?.photoURL,
              uid: isUidInData?.uid,
              role: isUidInData?.role,
              login: "true"
            };
            localStorage.setItem("userdata", JSON.stringify(data));
            window.open("http://localhost:3000/", "_self");
          }
        } else {
          const dob = "";
          const imgUrl: any = res?.user?.photoURL;
          const email: any = res?.user?.email;
          const name: any = res?.user?.displayName;
          const role = "user";
          const uid = res?.user?.uid;
          addNewUserData(dob, imgUrl, email, name, role, uid).then((added) => {
            if (added) {
              alert("Data added");
            }
            if (res?.operationType === "signIn") {
              const data = {
                name: res?.user?.displayName,
                email: res?.user?.email,
                profileurl: res?.user?.photoURL,
                uid: res?.user?.uid,
                login: "true",
                role: "user"
              };
              localStorage.setItem("userdata", JSON.stringify(data));
              window.open("http://localhost:3000/", "_self");
            }
          });
        }
      };
      fetchData();
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

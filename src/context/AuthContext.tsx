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

import { getUsersDetails, addNewUserData,getUserDetailsByUID } from "@/api/Api";
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
          const courses: any = [""];
          const imgUrl: any = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
          const email: any = res?.user?.email;
          const name: any = res?.user?.displayName;
          const role: any = null;
          const uid = res?.user?.uid;
          addNewUserData(courses, imgUrl, email, name, role, uid).then((added) => {
            if (added) {
              alert("Data added");
            }
            if (res?.operationType === "signIn") {
              getUserDetailsByUID(res?.user?.uid)
                .then((userDetails: any) => {
                  if (userDetails) {
                    console.log("User details:", userDetails);
                    const data = {
                      name: userDetails?.name,
                      email: userDetails?.email,
                      profileurl: userDetails?.imgUrl,
                      uid: userDetails?.uid,
                      login: "true",
                      role: userDetails?.role
                    };
                    localStorage.setItem("userdata", JSON.stringify(data));
                    window.open("http://localhost:3000/", "_self");
                  } else {
                    console.log("User not found");
                  }
                })
                .catch((error: any) => {
                  console.error("Error fetching user details:", error);
                });
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

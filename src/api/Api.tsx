import { db, } from "@/app/firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where } from "firebase/firestore";

export function addDataToFirestore(title: string, imgUrl: string, summary: string) {
  return addDoc(collection(db, "Course"), {
    title: title,
    imgUrl: imgUrl,
    summary: summary,
  })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export function getUserDatafromFirestore() {
  return getDocs(collection(db, "Course"))
    .then((querySnapshot) => {
      const data: any[] | PromiseLike<any[]> = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export function getUsersDetails() {
  return getDocs(collection(db, "users"))
    .then((querySnapshot) => {
      console.log("Document written with ID: ", querySnapshot);
      const data: any[] | PromiseLike<any[]> = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export function addNewUserData(dob: string, imgUrl: string, email: string, name: string, role: string, uid: string) {
  return addDoc(collection(db, "users"), {
    dob: dob,
    imgUrl: imgUrl,
    email: email,
    name: name,
    role: role,
    uid: uid
  })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export async function updateUserData(uid: string, updatedData: any) {
  console.log("khdkjh")
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return false
  const userDoc = querySnapshot.docs[0];
  const userRef = doc(db, "users", userDoc.id);
  return updateDoc(userRef, updatedData)
    .then(() => {
      console.log("Document updated successfully");
      return true;
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      return error;
    });
}

export function getUserDetailsByUID(uid: string) {
  const usersCollection = collection(db, "users");
  const userQuery = query(usersCollection, where("uid", "==", uid));

  return getDocs(userQuery)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // If a user with the specified UID is found, return the user details
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      } else {
        // If no user with the specified UID is found, return null or handle accordingly
        console.log("User not found");
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}
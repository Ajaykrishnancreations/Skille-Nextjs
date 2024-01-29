import { db, } from "@/app/firebase";
import { collection, addDoc, getDocs, doc, serverTimestamp, getDoc, updateDoc, query, where } from "firebase/firestore";

export function addDataToFirestore(title: string, imgUrl: string, summary: string, course_id: string | number, level: string, skills: string, newprice: string, oldprice: string) {
  const storedUserData = localStorage.getItem("userdata");
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
  return addDoc(collection(db, "course"), {
    title: title,
    imgUrl: imgUrl,
    summary: summary,
    course_id: course_id,
    level: level,
    published: false,
    author: {
      user_id: parsedUserData?.uid,
      user_name: parsedUserData?.name
    },
    skills: skills,
    price: { newprice: newprice, oldprice: oldprice },
    creation_time: serverTimestamp(),
    chapters: []
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

export function addCourseChapterData(chapterTitle: string, chapterSummary: string, course_id: string | number, course_title: string) {
  const storedUserData = localStorage.getItem("userdata");
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
  return addDoc(collection(db, "course_chapter"), {

    course_id: course_id,
    course_title: course_title,
    author: {
      user_id: parsedUserData?.uid,
      user_name: parsedUserData?.name
    },
    creation_time: serverTimestamp(),
    chapters: [
      {
        chapterTitle: chapterTitle,
        chapterSummary: chapterSummary,
      }
    ]
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

export function getCourseChapterData(course_id: any) {
  const usersCollection = collection(db, "course_chapter");
  const userQuery = query(usersCollection, where("course_id", "==", course_id));
  return getDocs(userQuery)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const course_chapter = querySnapshot.docs[0];
        return { id: course_chapter.id, ...course_chapter.data() };
      } else {
        console.log("course_chapter not found");
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export function getUserDatafromFirestore() {
  return getDocs(collection(db, "course"))
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

export function addNewUserData(courses: any, imgUrl: string, email: string, name: string, role: string, uid: string) {
  return addDoc(collection(db, "users"), {
    courses: courses,
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
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      } else {
        console.log("User not found");
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export async function updateCourseData(courseId: string, updatedData: any, uid: string) {
  const userQuery = query(collection(db, "users"), where("uid", "==", uid));
  const userQuerySnapshot = await getDocs(userQuery);
  if (userQuerySnapshot.empty) {
    console.error("User not found or doesn't have admin role");
    return false;
  }
  const userDoc = userQuerySnapshot.docs[0];
  console.log(userDoc.data()?.role, "userDoc");

  if (!userDoc.data()?.role) {
    console.error("User doesn't have admin role");
    return false;
  }
  const courseRef = doc(db, "Course", courseId);
  return updateDoc(courseRef, updatedData)
    .then(() => {
      console.log("Course document updated successfully");
      return true;
    })
    .catch((error) => {
      console.error("Error updating Course document: ", error);
      return false;
    });
}
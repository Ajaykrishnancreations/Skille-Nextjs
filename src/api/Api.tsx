import { db, } from "@/app/firebase";
import { collection, addDoc, getDocs, doc, serverTimestamp, getDoc, updateDoc, query, where, setDoc } from "firebase/firestore";

export function addCourseFirestore(title: string, imgUrl: string, summary: string, course_id: string | number, level: string, skills: string, newprice: string, oldprice: string) {
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

export function addCourseChapterData(chapter_id: any, description: string, image_url: string, title: string, content: string, tags: string, next_chapter: any, previous_chapter: any) {
  return addDoc(collection(db, "course_chapter"), {
    chapter_id: chapter_id,
    description: description,
    image_url: image_url,
    title: title,
    content: content,
    tags: tags,
    next_chapter: next_chapter,
    previous_chapter: previous_chapter,
    creation_time: serverTimestamp(),
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
  const userQuery = query(usersCollection, where("chapter_id", "==", course_id));
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
export async function updateCourseChapterData(chapter_id: any, updatedData: any) {
  const q = query(collection(db, "course_chapter"), where("chapter_id", "==", chapter_id));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("Chapter not found");
    return false;
  }

  const chapterDoc = querySnapshot.docs[0];
  const chapterRef = doc(db, "course_chapter", chapterDoc.id);

  return updateDoc(chapterRef, {
    ...updatedData,
    last_updated_time: serverTimestamp() // Add a field to track last updated time
  })
    .then(() => {
      console.log("Chapter updated successfully");
      return true;
    })
    .catch((error) => {
      console.error("Error updating chapter: ", error);
      return false;
    });
}

export async function updateCourseChapters(course_id: string | number, newChapterData: any) {
  const courseCollection = collection(db, "course");
  const courseQuery = query(courseCollection, where("course_id", "==", course_id));
  const querySnapshot = await getDocs(courseQuery);
  if (querySnapshot.empty) {
    console.log("Course not found");
    return false;
  }
  const courseDoc = querySnapshot.docs[0];
  const courseRef = doc(db, "course", courseDoc.id);
  const existingChapters = courseDoc.data().chapters || [];
  const updatedChapters = [...existingChapters, newChapterData];

  return updateDoc(courseRef, { chapters: updatedChapters, last_updated: serverTimestamp() })
    .then(() => {
      console.log("Chapters added successfully");
      return true;
    })
    .catch((error) => {
      console.error("Error updating chapters: ", error);
      return false;
    });
}

export function getcourseFirestore() {
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



export function getCourseWithCourseid(course_id: any) {
  const courseCollection = collection(db, "course");
  const courseQuery = query(courseCollection, where("course_id", "==", course_id));
  return getDocs(courseQuery)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const course = querySnapshot.docs[0];
        return { id: course.id, ...course.data() };
      } else {
        console.log("Course not found");
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}
export async function updateChapterData(courseId: any, chapterId: any, updatedChapterData: any) {
  try {
    const courseCollection = collection(db, "course");
    const courseQuery = query(courseCollection, where("course_id", "==", courseId));
    const querySnapshot = await getDocs(courseQuery);

    if (querySnapshot.empty) {
      console.error("Course not found");
      return false;
    }

    const courseDoc = querySnapshot.docs[0];
    const courseData = courseDoc.data();

    if (!courseData.chapters || !Array.isArray(courseData.chapters)) {
      console.error("Chapters data not found or not in correct format");
      return false;
    }

    const updatedChapters = courseData.chapters.map((chapter: any) => {
      if (chapter.chapter_id === chapterId) {
        return { ...chapter, ...updatedChapterData };
      }
      return chapter;
    });

    const courseRef = doc(db, "course", courseDoc.id);
    await updateDoc(courseRef, { ...courseData, chapters: updatedChapters });

    console.log("Course document updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating course chapter:", error);
    return false;
  }
}

 export async function updateCourseData(courseId: any, updatedData: any, uid: any) {
   const userQuery = query(collection(db, "users"), where("uid", "==", uid));
   const userQuerySnapshot = await getDocs(userQuery);
   if (userQuerySnapshot.empty) {
    console.error("User not found or doesn't have admin role");
    return false;
  }
  const userDoc = userQuerySnapshot.docs[0];
  if (!userDoc.data()?.role) {
    console.error("User doesn't have admin role");
    return false;
  }
  const courseRef = doc(db, "course", courseId);
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
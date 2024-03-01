import { db, } from "@/app/firebase";
import { collection, addDoc, getDocs, doc, serverTimestamp, updateDoc, query, where, arrayUnion, getDoc } from "firebase/firestore";

export function addCourseFirestore(title: string, imgUrl: string, summary: string, course_id: string | number, level: string, skills: any, newprice: string, oldprice: string, newText: any) {
  const storedUserData = localStorage.getItem("userdata");
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
  return addDoc(collection(db, "course"), {
    title: title,
    imgUrl: imgUrl,
    summary: summary,
    course_id: course_id,
    level: level,
    published: "Un-Published",
    author: {
      user_id: parsedUserData?.uid,
      user_name: parsedUserData?.name
    },
    skills: skills,
    price: { newprice: newprice, oldprice: oldprice },
    creation_time: serverTimestamp(),
    chapters: [],
    organisation: "1122334455",
    register_content: newText
  })
    .then((docRef) => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export async function getcourseFirestore(organizationId: any) {
  try {
    const querySnapshot = await getDocs(collection(db, "course"));
    const data: { id: any; }[] = [];

    querySnapshot.forEach((doc) => {
      const courseData = doc.data();

      // Check if the course is published
      if (courseData.published === "Published") {
        // Check if the organization ID matches
        if (courseData.organisation_id === organizationId) {
          // Set the new price to a specific value for organization members
          courseData.price.newprice = 0;
        }

        data.push({ id: doc.id, ...courseData });
      }
    });

    return data;
  } catch (error) {
    console.error("Error getting published courses:", error);
    return [];
  }
}

export function getcourseFirestore1() {
  const storedUserData = localStorage.getItem("userdata");
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
  if (!parsedUserData || !parsedUserData.uid) {
    console.error("User data not found.");
    return Promise.resolve(false);
  }
  return getDocs(collection(db, "course"))
    .then((querySnapshot) => {
      const data: any[] | PromiseLike<any[]> = [];
      querySnapshot.forEach((doc) => {
        const courseData = doc.data();
        if (courseData.author?.user_id === parsedUserData.uid) {
          data.push({ id: doc.id, ...courseData });
        }
      });
      return data;
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
    last_updated_time: serverTimestamp()
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


export function getUsersDetails() {
  return getDocs(collection(db, "users"))
    .then((querySnapshot) => {
      const data: any | PromiseLike<any> = [];
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
    uid: uid,
    organisation: "1234567890"
  })
    .then((docRef) => {
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

export async function addCourseToUser(uid: any, courseData: any) {
  try {
    const usersCollection = collection(db, "users");
    const courseQuery = query(usersCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(courseQuery);
    if (querySnapshot.empty) {
      console.log("User not found");
      return false;
    }
    const userDoc = querySnapshot.docs[0];
    const existingCourses = userDoc.data().courses || [];
    const hasPurchasedCourse = existingCourses.some((course: any) => course.course_id === courseData.course_id);
    if (hasPurchasedCourse) {
      console.log("User has already purchased this course");
      return false;
    }
    const courseRef = doc(db, "users", userDoc.id);
    const updatedCourses = [...existingCourses, courseData];
    await updateDoc(courseRef, { courses: updatedCourses });
    console.log("Course added to user successfully");
    return true;
  } catch (error) {
    console.error("Error adding course to user:", error);
    return false;
  }
}
export async function updateUserCompletedChapters(userUid: any, courseId: any, completedChapterIds: any[]) {
  try {
    const userCollection = collection(db, "users");
    const userQuery = query(userCollection, where("uid", "==", userUid));
    const querySnapshot = await getDocs(userQuery);
    if (querySnapshot.empty) {
      console.error("User not found");
      return false;
    }
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();
    const updatedCourses = userData.courses.map((course: any) => {
      if (course.course_id === courseId) {
        const existingCompletedChapters = course.completed_chapters || [];
        const newCompletedChapterIds = completedChapterIds.filter((chapterId: string) => !existingCompletedChapters.includes(chapterId));
        if (newCompletedChapterIds.length === 0) {
          console.log("User has already completed these chapters");
          return course;
        }
        const updatedCompletedChapters = [...existingCompletedChapters, ...newCompletedChapterIds];
        return { ...course, completed_chapters: updatedCompletedChapters };
      }
      return course;
    });
    await updateDoc(userRef, { ...userData, courses: updatedCourses });
    console.log("User document updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user completed chapters:", error);
    return false;
  }
}
export async function checkUserCompletedChapters(userUid: any, courseId: any, chapterIds: any[]) {
  try {
    const userCollection = collection(db, "users");
    const userQuery = query(userCollection, where("uid", "==", userUid));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.error("User not found");
      return false;
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const course = userData.courses.find((course: any) => course.course_id === courseId);
    if (!course) {
      console.error("Course not found");
      return false;
    }
    const completedChapters = course.completed_chapters || [];
    const chaptersCompleted = chapterIds.every(chapterId => completedChapters.includes(chapterId));
    return chaptersCompleted;
  } catch (error) {
    console.error("Error checking user completed chapters:", error);
    return false;
  }
}

export function getUserDetailsByUID(uid: any) {
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
export function getCoursesWithCourseIds(courseIds: any[]) {
  const courseCollection = collection(db, "course");
  const courseQuery = query(courseCollection, where("course_id", "in", courseIds));
  return getDocs(courseQuery)
    .then((querySnapshot) => {
      const courses: any[] | PromiseLike<any[]> = [];
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() });
      });
      return courses;
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

export async function updateProgressAndCompletionStatus(uid: any, courseId: any, targetLength: any) {
  try {
    const userCollection = collection(db, "users");
    const userQuery = query(userCollection, where("uid", "==", uid));
    const userQuerySnapshot = await getDocs(userQuery);
    if (userQuerySnapshot.empty) {
      console.error("User not found");
      return false;
    }
    const userDoc = userQuerySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();
    const updatedCourses = userData.courses.map((course: any) => {
      if (course.course_id === courseId) {
        const completedChapters = course.completed_chapters || [];
        const progress = (completedChapters.length / targetLength) * 100;
        const completionStatus = completedChapters.length === targetLength;
        return {
          ...course,
          progress: completionStatus ? 100 : progress,
          completion_status: completionStatus,
        };
      }
      return course;
    });
    await updateDoc(userRef, { ...userData, courses: updatedCourses });
    console.log("User progress and completion status updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user progress and completion status:", error);
    return false;
  }
}
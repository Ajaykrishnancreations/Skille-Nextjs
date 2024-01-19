import { db } from "@/app/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

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
        console.log("Document written with ID: ", querySnapshot);
        const data: any[] | PromiseLike<any[]> = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        console.log(data, "datadata");
        return data;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD5KphWR07ZBJfoWK-9XssQMVwv8yVCL5A",
    authDomain: "yttodo-5aa63.firebaseapp.com",
    databaseURL: "https://yttodo-5aa63.firebaseio.com",
    projectId: "yttodo-5aa63",
    storageBucket: "yttodo-5aa63.appspot.com",
    messagingSenderId: "48012364626",
    appId: "1:48012364626:web:d7f8a1d4b764123b02888b",
};

class Fire {
    constructor(callback) {
        this.init(callback);
    }
    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                callback(null, user);
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch((error) => {
                        callback(error);
                    });
            }
        });
    }
    getLists(callback) {
        let ref = this.ref.orderBy('name');

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = []
            snapshot.forEach(doc => {
                lists.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            callback(lists);
        })
    }
    addList(list) {
        let ref = this.ref;

        ref.add(list);
    }

    updateList(list) {
        let ref = this.ref

        ref.doc(list.id).update(list);
    }

    get userId() {
        return firebase.auth().currentUser.uid;
    }

    get ref() {
        return firebase.firestore().collection('users').doc(this.userId).collection('lists');
    }

    detach() {
        this.unsubscribe();
    }
}

export default Fire;
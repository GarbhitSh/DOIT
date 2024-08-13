// Your web app's Firebase configuration

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCdxv0HYGPG0HfMQCoIXfBYbb0E91UkH7o",
    authDomain: "doit-9b2db.firebaseapp.com",
    projectId: "doit-9b2db",
    storageBucket: "doit-9b2db.appspot.com",
    messagingSenderId: "857728202054",
    appId: "1:857728202054:web:20026068fe81b5e4562147"
  };

  

// Firebase configuration


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

new Vue({
  el: '#app',
  data() {
    return {
      user: null,
      todoList: [],
      new_todo: '',
      showComplete: false,
    };
  },
  mounted() {
    this.authListener();
  },
  watch: {
    todoList: {
      handler(updatedList) {
        if (this.user) {
          this.saveTodosToFirestore(updatedList);
        }
      },
      deep: true
    }
  },
  computed: {
    pending() {
      return this.todoList.filter(item => !item.done);
    },
    completed() {
      return this.todoList.filter(item => item.done);
    },
    completedPercentage() {
      return (Math.floor((this.completed.length / this.todoList.length) * 100)) + "%";
    },
    today() {
      const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date();
      const dd = today.getDate();
      const mm = today.getMonth() + 1;
      const yyyy = today.getFullYear();

      return {
        day: weekday[today.getDay()],
        date: (mm < 10 ? '0' : '') + mm + '-' + (dd < 10 ? '0' : '') + dd + '-' + yyyy
      };
    }
  },
  methods: {
    authListener() {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          this.getTodosFromFirestore();
        } else {
          this.user = null;
          this.todoList = [];
        }
      });
    },
    signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    },
    signOut() {
      auth.signOut();
    },
    getTodosFromFirestore() {
      db.collection('todos').doc(this.user.uid).get().then(doc => {
        if (doc.exists) {
          this.todoList = doc.data().tasks || [];
        }
      });
    },
    saveTodosToFirestore(updatedList) {
      db.collection('todos').doc(this.user.uid).set({
        tasks: updatedList
      });
    },
    addItem() {
      if (this.new_todo) {
        this.todoList.unshift({
          id: this.lastId() + 1,
          title: this.new_todo,
          done: false,
        });
      }
      this.new_todo = '';
    },
    lastId() {
      const idList = this.todoList.map(item => item.id);
      return idList.length ? Math.max(...idList) : 0;
    },
    deleteItem(item) {
      this.todoList.splice(this.todoList.indexOf(item), 1);
    },
    toggleShowComplete() {
      this.showComplete = !this.showComplete;
    },
    clearAll() {
      this.todoList = [];
    }
  },
});

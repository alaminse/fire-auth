import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
 import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    photo: ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then( res =>{
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then( res =>{
      const signedOutUser = {
        isSignedIn: false,
        name: ' ',
        email: '',
        photo: ' ',
        password: ' ',
        isValid: false,
        error: '',
        existingUser: false 
      }
      setUser(signedOutUser);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };

    // perform validation
    let isValid = true;
    if(e.target.name === "email"){
      isValid = is_valid_email(e.target.value);
    }
    if(e.target.name === "password"){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }    

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = {...user};
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = {...user};
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }
    else{
      console.log('form is not valid', {email: user.email, pass: user.password});
    }
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = event => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = {...user};
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = {...user};
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }
    event.preventDefault();
    event.target.reset();
  }

  const switchForm = event => {
    const createdUser = {...user};
    createdUser.existingUser = event.target.checked;
    setUser(createdUser);
  }

  return (
    <div className="App">
      {user.isSignedIn ? <button onClick = {handleSignOut} >Sign Out</button> : <button onClick = {handleSignIn} >Sign in</button>}
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      {/* own Authentication */}
      <h1>Our own Authentication</h1>
      <input onChange={switchForm} type="checkbox" name="switchForm" id="switchForm"/>
      <label htmlFor="switchForm">Returning User</label>
      <form style={{display: user.existingUser ? 'block': 'none'}} onSubmit={signInUser}>
        <input onBlur={handleChange} type="text" name="email" placeholder="Enter Email" required/> <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="Enter Password" required/> <br/>
        <input type="submit" value="Sign In"/>
      </form>
      <form style={{display: user.existingUser ? 'none': 'block'}} onSubmit={createAccount}>
        <input onBlur={handleChange} type="text" name="name" placeholder="Enter name" required/> <br/>
        <input onBlur={handleChange} type="text" name="email" placeholder="Enter Email" required/> <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="Enter Password" required/> <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;

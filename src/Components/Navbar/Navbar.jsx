import React from 'react'
import './Navbar.css';

export default function Navbar({ handleGoogleOAuthSignIn, handleGoogleOAuthSignOut , signInStatus }) {

  return (
    <div className='navbar'>
      <button className='navbar-option' onClick={() => signInStatus ? handleGoogleOAuthSignOut() : handleGoogleOAuthSignIn()}>
        {signInStatus ? 'Sign Out' : 'Sign In'}
      </button>
      <button className='navbar-option'>Settings</button>
    </div>
  )
}

import React from 'react';
import Dashboard from './Dashboard';
import { Link } from 'react-router-dom';



function SignIn() {
  return (
    <div className="container">
    <div className="left-panel">
      <div className="form-container">
        <h2>Sign in</h2>
        <form action="#">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" placeholder="code@aspire.io" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          <Link to="/dashboard" className="btn">
            Sign In
          </Link>
        </form>
      </div>
    </div>
  
    <div className="right-panel">
      <div className="right-panel-content">
        <h2>Welcome to Prism-Gate</h2>
        <p>A professional template that comes with ready-to-use MUI components.</p>
      </div>
    </div>
  </div>
  
  )
};

export default SignIn

import React from "react";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import Form from "./common/form";
import Auth from "../services/authService";

class LoginForm extends Form{
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };
  async doSubmit() {
    try {
      const { data } = this.state;
      await Auth.login(data.username,data.password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname: '/';
      
    } catch (ex) {
      console.log('second catch block');
      if(ex.response && ex.response.status === 400){
        const errors = { ...this.state.errors};
        errors.username = ex.response.data;
        this.setState( { errors}); 
      }
    }
  }

  render() {
    if( Auth.getCurrentUser()) return <Redirect to="/"/>
    return (
      <div>
        <h1>Log In</h1>
        <form>
          { this.renderInput('username','Username')}
          { this.renderInput('password','Password','password')}
          {this.renderButton('Login')}
        </form>
      </div>
    );
  }
}

export default LoginForm;

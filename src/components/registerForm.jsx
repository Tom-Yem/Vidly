import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from '../services/userService';
import Auth from "../services/authService";

class Register extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .email()
      .required()
      .label("Username"),
    password: Joi.string()
      .min(5)
      .required()
      .label("Password"),
    name: Joi.string()
      .required()
      .label("Name")
  };
  async doSubmit() {
    try{
      const { headers }= await userService.regsiter(this.state.data);
      Auth.loginWithJwt(headers['x-auth-token']);
      window.location = '/';

    }catch(ex){
      if(ex.response && ex.response.status === 400){
        const errors = {...this.state.errors};
        errors.username = ex.response.data;
        this.setState( { errors });
      }
    }
  }
  render() {
    return (
      <div>

        <h1>Register</h1>
        {this.renderInput("username", "Username")}
        {this.renderInput("password", "Password", "password")}
        {this.renderInput("name", "Name")}
        {this.renderButton("Register")}
      </div>
    );
  }
}

export default Register;

import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateUser: React.FC = () => {
  //user
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [departure, setDeparture] = useState("");

  return (
    <div>
      <h1>Create</h1>
      <div>
        <label>username</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter name"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></input>

        <label>password</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter name"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>

        <label>name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>

        <label>surname</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter name"
          onChange={(e) => {
            setSurname(e.target.value);
          }}
        ></input>

        <label>email</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter name"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>

        <label>telephone</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter name"
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        ></input>

        <label>role</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter name"
          onChange={(e) => {
            setRole(e.target.value);
          }}
        ></input>

        <label>departure</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter name"
          onChange={(e) => {
            setDeparture(e.target.value);
          }}
        ></input>
      </div>
    </div>
  );
};
export default CreateUser;

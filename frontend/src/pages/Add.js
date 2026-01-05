import axios from "axios";
import React from "react";
import { useState  } from "react";
import { Link, useNavigate } from "react-router-dom";
import ComboBox  from '../components/ComboBox';

const Add = () => {
  const [student, setStudent] = useState({
    fname: "",
    lname: "",
    email: "",
    major: "",
    address: "",
    profile: "",
  });

  const [selectedValue, setSelectedValue] = useState('');

  const handleDropdownChange = (value) => {
        setSelectedValue(value);
        student.major = selectedValue;
      };

  const [error,setError] = useState(false)
 
 const navigate = useNavigate();
 const [file ,setFile] = useState();
const handleFile = (e) => { 
       setFile(e.target.files[0]);
       console.log(e.target.files[0]);
  }

  const handleChange = (e) => {
    setStudent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

    const handleClick = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    
    formdata.append('fname', student.fname);
    formdata.append('lname', student.lname);
    formdata.append('email', student.email);
    formdata.append('major', selectedValue);
    formdata.append('address', student.address);
    formdata.append('image', file);

    try {
      console.log(student.major);
      console.log(selectedValue);
      console.log(file.name);
      await axios.post("http://localhost:5000/create", formdata);
      navigate("/students");
    } catch (err) {
      console.log(err);
      setError(true)
    }
  };

  return (
    <div className ='app'> 
    <div className="form">
      <h1>Add New Student</h1>

      <input
        type="text"
        placeholder="First name"
        name="fname"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Last name"
        name="lname"
        onChange={handleChange}
      />
       <input
        type="email"
        placeholder="Email name"
        name="email"
        onChange={handleChange}
      />
      <ComboBox  onSelectChange={handleDropdownChange}/>
  
       <input
        type="text"
        placeholder="Address "
        name="address"
        onChange={handleChange}
      />
      <input
        type="file"
        placeholder="Student Image"
        name="image"
         onChange={handleFile}
      />
      <button onClick={handleClick}>Add</button>
      {error && "Something went wrong!"}
      <Link to="/Students">See all Students</Link>
    </div>
    </div>
  );
};

export default Add;

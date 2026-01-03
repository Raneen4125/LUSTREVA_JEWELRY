import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ComboBox from '../components/ComboBox';

const Update = () => {

const [fname, setFname] = useState('');
const [lname, setLname] = useState('');
const [email, setEmail] = useState('');
const [address, setAddress] = useState('');
const [major, setMajor] = useState(''); 
const [image, setImage] = useState('');

const navigate = useNavigate();
const {id} = useParams();
 
  //Fetching one record from student table 
 useEffect(() =>
{
  axios.get('http://localhost:5000/search/' + id)
  .then(res => {
    setFname(res.data[0].Fname) ;
    setLname(res.data[0].Lname) ;
    setEmail(res.data[0].Email) ;
    setAddress(res.data[0].Address) ;
    setMajor(res.data[0].Major) ;
  })
  .catch (err => console.log(err));
} , [id])
           
//
  const [selectedValue, setSelectedValue] = useState('');
  const handleDropdownChange = (value) => {
        setSelectedValue(value);
        setMajor(selectedValue);     
      };
  const [error,setError] = useState(false)

  const [file ,setFile] = useState();
  const handleFile = (e) => { 
         setFile(e.target.files[0]);
         setImage(e.target.files[0]);
        // console.log(e.target.files[0]);
    }

  const handleClick = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    
      formdata.append('fname', fname);
      formdata.append('lname', lname);
      formdata.append('email', email);
      formdata.append('major', selectedValue);
      formdata.append('address', address);
      formdata.append('image', file);
      console.log(major);
      console.log(image);
    try {
     //await axios.post(`http://localhost:5000/modify/${id}`,{fname, lname,email,address});
     await axios.post(`http://localhost:5000/modify/${id}`,formdata);
      navigate("/students");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className ='app'> 
    <div className="form">
      <h1>Update the Student</h1>
     <input
        type="text"
        placeholder="First name"
        name="fname"
        value = {fname}
        onChange={e => setFname (e.target.value)}
      />
      <input
        type="text"
        placeholder="Last name"
        name="lname"
        value = {lname}
       onChange={e => setLname(e.target.value)}
      />
       <input
        type="email"
        placeholder="Email name"
        name="email"
        value = {email}
        onChange={e => setEmail(e.target.value)}
      />
       <ComboBox onSelectChange={handleDropdownChange} value = {major}  />
       <input
        type="text"
        placeholder="Address "
        name="address" 
        value = {address}
        onChange={e => setAddress(e.target.value)}
      />
      <input
        type="file"
        placeholder="Student Image"
        name="image"
        onChange={handleFile}
      />
      <button onClick={handleClick}>Update</button>
      {error && "Something went wrong!"}
      <Link to="/students">See all Students</Link>
    </div>
    </div>
  );
};

export default Update;

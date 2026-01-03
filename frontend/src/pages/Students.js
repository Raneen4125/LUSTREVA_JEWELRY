import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/Style.css';

const Students = () => {
  const [students, setStudents] = useState([]);
 
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/students");
        setStudents(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllStudents();
  }, []);

  //console.log(students);

  const handleDelete = async (id) => {
   console.log(id);
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      window.location.reload()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
 <h1 align = 'center'> Students </h1>
 <button className="addHome">
        <Link to="/add" style={{ color: "inherit", textDecoration: "none" }}>
          Add + 
        </Link>
      </button>
<div className="app" >        
      <div className="students">       
        <table border= '2' width = '80%'>
          <thead> 
          <tr>
            <th>First name </th>
            <th>Last name </th>
            <th>Email  </th>
            <th>Major  </th>
            <th>Address  </th>
            <th>Image  </th>
            <th>Action  </th>
          </tr></thead>
          <tbody>
            {
              students.map((student) => (
                            <tr key={student.StdID} > 
                                <td>{student.Fname}</td>
                                <td>{student.Lname}</td>
                                <td>{student.Email}</td>
                                <td>{student.Description}</td>
                                <td>{student.Address}</td>
                                <td><img src={`data:image/png;base64,${student.Profile}`} alt="" /></td>
                                <td><button className="delete" onClick={() => handleDelete(student.StdID) }>Delete</button>
                                <button className="update"><Link to={`/update/${student.StdID}`} style={{ color: "inherit", textDecoration: "none" }}>  Update </Link>  </button></td>
                            </tr>
                      ))}            
          </tbody>
        </table>      
      </div></div>
     
    </div>
    
  );
};

export default Students;

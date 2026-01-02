    import React, { useState, useEffect } from 'react';

    function ComboBox({ onSelectChange }) {
        const [majors, setMajors] = useState([]);
        

        useEffect(() => {
            fetch('http://localhost:5000/students/majors') 
                .then(response => response.json())
                .then(data => 
                    {   
                        setMajors(data);
                    })
                .catch(error => {
                    console.error('Error fetching data:', error);
                            });
        }, []);

       const handleChange = (event) => {
            onSelectChange(event.target.value);
        };

        return(
            <select onChange={handleChange}>
                <option value="">Select a Major</option>
                {majors.map(major => (
                    <option key={major.MajorCode} value={major.MajorCode}>
                        {major.Description}
                    </option>
                ))}
            </select>
        );
    }
    export default ComboBox;
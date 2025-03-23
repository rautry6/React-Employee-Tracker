import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TitleCard from './TitleCard';
import Table from './Table'
import axios from 'axios';

function App() {

  const columnNames = ["Id", "Name", "Role", "Email"];

  const [tableData, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentEmployee, setEmployee] = useState([])
  const [id, setId] = useState("")
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [updateEmployee, setUpdateEmployee] = useState({
    id: 0,
    name: '',
    email: '',
    role: ''
  });

  const [employeeID, setEmployeeID] = useState({
    id: 0,
  })

  const columns = React.useMemo(
    () =>
      columnNames.map((col) => ({
        Header: col.charAt(0).toUpperCase() + col.slice(1),
        accessor: col.toLowerCase(), // Ensure data matches keys in 'data' prop
      })),
    [columnNames]
  );



  const handleTableFetch = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/employees") // fetch data from db

      setData(data)

      console.log(data)
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const handleFetchEmployee = async () => {
    try {
      console.log(id)
      const { data } = await axios.get("http://localhost:3000/api/employees/" + id,
      ) // fetch data from db

      setEmployee({ ...data })

      console.log(data)
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const pushNewEmployee = async () => {
    try {
      console.log(id)
      const { data } = await axios.post("http://localhost:3000/api/employees", {
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role
      })

      setNewEmployee({
        name: '',
        email: '',
        role: ''
      })

      console.log(data)
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const updateEmployeInfo = async () => {
    try {

      const payload = Object.fromEntries(
        Object.entries(updateEmployee).filter(([_, val]) => !!val)
      );

      console.log(id)
      const { data } = await axios.patch("http://localhost:3000/api/employees/" + updateEmployee.id, {
        ...payload
      })

      setUpdateEmployee({
        id: 0,
        name: '',
        email: '',
        role: ''
      })

      console.log(data)
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const deleteEmployee = async () => {
    try {

      const payload = Object.fromEntries(
        Object.entries(employeeID).filter(([_, val]) => !!val)
      );

      console.log(payload)
      const { data } = await axios.delete("http://localhost:3000/api/employees/" + employeeID.id, {
        ...payload
      })

      setEmployeeID({
        id: 0,
      })

      console.log(data)
    } catch (error) {
      console.log(error.response.data);
    }
  }
  return (
    <>
      <div>
        <TitleCard></TitleCard>
        <Table columns={columns} data={tableData}></Table>
      </div>
      <div>

        <button style={{ marginBottom: "1vw" }} onClick={() => { handleTableFetch() }}>Fetch Table Data</button>

        <p style={{ fontSize: "1.5vw ", fontWeight: "bold", marginBottom: "-0.1vw" }}>Employee By ID</p>

        <div className="box-outline">
          <div className="employee-search">
            <p style={{ fontSize: "25px" }}>ID:</p>
            <input style={{ height: "2vw", display: "flex", justifyContent: "center", alignItems: "center" }} value={id} onChange={e => setId(e.target.value)}></input>
            <button style={{ maxHeight: "50px", justifyContent: "flex-start" }} onClick={() => { handleFetchEmployee() }}>Get Employee</button>
          </div>

          <p>Current Employee</p>
          {
            //display everything returned from the get request for a specfic employee
          }
          {Object.entries(currentEmployee).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
        <div>
          <div>
            <p style={{ fontSize: "1.5vw ", fontWeight: "bold", marginBottom: "-0.1vw" }}>Add Employee</p>
            <div className="box-outline">
              <div className='input-fields'> {// push new employee
              }
                <p>Push New Employee</p>
                <button onClick={() => pushNewEmployee()}>Push</button>
              </div>
              <div className='input-fields'>
                <p>Name:</p>
                <input name="name" value={newEmployee.name} onChange={e => {
                  const { name, value } = e.target;
                  setNewEmployee((prevEmployee) => ({
                    ...prevEmployee,   // Spread the previous state to keep other fields
                    [name]: value      // Update the specific field
                  }));
                }
                }></input>
              </div>
              <div className='input-fields'>
                <p>Email:</p>
                <input name="email" value={newEmployee.email} onChange={e => {
                  const { name, value } = e.target;
                  setNewEmployee((prevEmployee) => ({
                    ...prevEmployee,   // Spread the previous state to keep other fields
                    [name]: value      // Update the specific field
                  }));
                }}></input>
              </div>
              <div className='input-fields'>
                <p>Role:</p>
                <input name="role" value={newEmployee.role} onChange={e => {
                  const { name, value } = e.target;
                  setNewEmployee((prevEmployee) => ({
                    ...prevEmployee,   // Spread the previous state to keep other fields
                    [name]: value      // Update the specific field
                  }));
                }}></input>
              </div>

            </div>
            <div>
              <p style={{ fontSize: "1.5vw ", fontWeight: "bold", marginBottom: "-0.1vw" }}>Update Employee</p>
              <div className="box-outline">
                <div className='input-fields'> {// update employee
                }
                  <p>Update Employee Info</p>
                  <button onClick={() => updateEmployeInfo()}>Update</button>
                </div>
                <div className='input-fields'>
                  <p>ID*:</p>
                  <input name="id" value={updateEmployee.id} onChange={e => {
                    const { name, value } = e.target;
                    setUpdateEmployee((prevEmployee) => ({
                      ...prevEmployee,   // Spread the previous state to keep other fields
                      [name]: parseInt(value)      // Update the specific field
                    }));
                  }
                  }></input>
                </div>
                <div className='input-fields'>
                  <p>Name:</p>
                  <input name="name" value={updateEmployee.name} onChange={e => {
                    const { name, value } = e.target;
                    setUpdateEmployee((prevEmployee) => ({
                      ...prevEmployee,   // Spread the previous state to keep other fields
                      [name]: value      // Update the specific field
                    }));
                  }
                  }></input>
                </div>
                <div className='input-fields'>
                  <p>Email:</p>
                  <input name="email" value={updateEmployee.email} onChange={e => {
                    const { name, value } = e.target;
                    setUpdateEmployee((prevEmployee) => ({
                      ...prevEmployee,   // Spread the previous state to keep other fields
                      [name]: value      // Update the specific field
                    }));
                  }}></input>
                </div>
                <div className='input-fields'>
                  <p>Role:</p>
                  <input name="role" value={updateEmployee.role} onChange={e => {
                    const { name, value } = e.target;
                    setUpdateEmployee((prevEmployee) => ({
                      ...prevEmployee,   // Spread the previous state to keep other fields
                      [name]: value      // Update the specific field
                    }));
                  }}></input>
                </div>
              </div>
              <div>
              </div>
              <p style={{ fontSize: "1.5vw ", fontWeight: "bold", marginBottom: "-0.1vw" }}>Delete Employee</p>
              <div className="box-outline">
              <div className='input-fields'>
                <p>Delete User</p>
                <button onClick={() => deleteEmployee()}>DELETE</button>
              </div>
              <div className='input-fields'>
                <p>ID:</p>
                <input name="id" value={`${employeeID.id}`} onChange={e => {
                  const { name, value } = e.target;
                  setEmployeeID((prevEmployee) => ({
                    ...prevEmployee,   // Spread the previous state to keep other fields
                    [name]: parseInt(value)      // Update the specific field
                  }));
                }}></input>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

    </>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TitleCard from './TitleCard';
import Table from './Table'
import axios from 'axios';
import ReactModal from 'react-modal';

function App() {

  const columnNames = ["Id", "Name", "Role", "Email"];

  const [tableData, setData] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentEmployee, setEmployee] = useState([])
  const [currentEmployeeByName, setNameEmployee] = useState([])
  const [currentEmployeeByEmail, setEmailEmployee] = useState([])
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
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


  // email validation method
  const isEmail = (email : string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

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

      // check that id is number and greater than 0
      if(+id <= 0 || !Number.isFinite(+id)){
        setErrorMessage("ID must a number and larger than 0");
        setModalActive(true);
        return;
      }

    try {
      console.log(id)
      const { data } = await axios.get("http://localhost:3000/api/employees/" + id,
      ) // fetch data from db

      setEmployee({ ...data })

      console.log(data)
    } catch (error) {
      console.log(error.response.data);
      setErrorMessage("ID must a number and larger than 0");
      setModalActive(true);
    }
  }

  const handleFetchEmployeeByName = async () => {

        // name check
        if(Number.isFinite(+name)){
          setErrorMessage("Invalid name. The field cannot but empty or be a number.");
          setModalActive(true);
          return;
        }

    try{
      const {data} = await axios.get("http://localhost:3000/api/employees/names/" + name,)
      setNameEmployee({...data})
    }
    catch(error){
      console.log(error.response.data)
      setErrorMessage(error.response.data);
      setModalActive(true);
    }
  }

  const handleFetchEmployeeByEmail = async () => {

    // email check
    if(!isEmail(email)){
      setErrorMessage("Invalid email. Please enter a valid email.");
      setModalActive(true);
      return;
    }

    try{
      const {data} = await axios.get("http://localhost:3000/api/employees/emails/" + email,)
      setEmailEmployee({...data})
    }
    catch(error){
      console.log(error.response.data)
      setErrorMessage(error.response.data);
      setModalActive(true);
    }
  }

  const pushNewEmployee = async () => {

    // all fields not filled
    if(newEmployee.name === "" || newEmployee.email === "" || newEmployee.role === ""){
      setErrorMessage("All fields must be filled to add a new employee");
      setModalActive(true);
      return;
    }

    // role not an option
    if(newEmployee.role !== "INTERN" && newEmployee.role !== "ENGINEER" && newEmployee.role !== "ADMIN"){
      setErrorMessage("Role must be one of the follwing options: INTERN | ENGINEER| ADMIN");
      setModalActive(true);
      return;
    }

    // email check
    if(!isEmail(newEmployee.email)){
      setErrorMessage("Invalid email. Please enter a valid email.");
      setModalActive(true);
      return;
    }

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
      <ReactModal
      isOpen = {modalActive}
      onRequestClose={() => setModalActive(false)}
      className={"Error Modal"}>
        <h2 className="error-text">Error</h2>
            <p className="error-text">{errorMessage}</p>
            <button onClick={() => setModalActive(false)}>Close</button>
      </ReactModal>

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


        <p style={{ fontSize: "1.5vw ", fontWeight: "bold", marginBottom: "-0.1vw" }}>Employee By Name</p>

        <div className="box-outline">
          <div className="employee-search">
            <p style={{ fontSize: "25px" }}>Name:</p>
            <input style={{ height: "2vw", display: "flex", justifyContent: "center", alignItems: "center" }} value={name} onChange={e => setName(e.target.value)}></input>
            <button style={{ maxHeight: "50px", justifyContent: "flex-start" }} onClick={() => { handleFetchEmployeeByName() }}>Get Employee</button>
          </div>

          <p>Current Employee</p>
          {
            //display everything returned from the get request for a specfic employee
          }
          {Object.entries(currentEmployeeByName).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>


        <p style={{ fontSize: "1.5vw ", fontWeight: "bold", marginBottom: "-0.1vw" }}>Employee By Email</p>

        <div className="box-outline">
          <div className="employee-search">
            <p style={{ fontSize: "25px" }}>Email:</p>
            <input style={{ height: "2vw", display: "flex", justifyContent: "center", alignItems: "center" }} value={email} onChange={e => setEmail(e.target.value)}></input>
            <button style={{ maxHeight: "50px", justifyContent: "flex-start" }} onClick={() => { handleFetchEmployeeByEmail() }}>Get Employee</button>
          </div>

          <p>Current Employee</p>
          {
            //display everything returned from the get request for a specfic employee
          }
          {Object.entries(currentEmployeeByEmail).map(([key, value]) => (
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

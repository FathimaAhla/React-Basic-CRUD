 import { useEffect, useState } from 'react';
import './App.css';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';

// toaster is use to show notification
const AppToaster = Toaster.create({
  position: "top"
})

function App() {
  const[users, setUsers] = useState([]);
  const[name, setName] = useState([""])
  const[email, setEmail] = useState([""])
  const[website, setWebsite] = useState([""])

  useEffect(() => {
    fetch('http://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((json) => setUsers(json))
  },[]) 

  function addUser() {
    const newName = name.trim();
    const newEmail = email.trim();
    const newWebsite = website.trim();

    if(newName && newEmail && newWebsite) {
      fetch('http://jsonplaceholder.typicode.com/users',
        {
          method: "POST",
          body: JSON.stringify({
            name: newName,
            email: newEmail,
            website: newWebsite
          }),
          // header use to understand these data are json
          // UTF-8 is encoding formate
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        }
      ).then((response) => response.json())
        .then(json => {
          setUsers([...users, json]);
          AppToaster.show({
            message: "User added successfully",
            intent: 'success',
            timeout: '3000'
          })
          setName("");
          setEmail("");
          setWebsite("");
        })
    }
  }

  function onChangeHandler(id, key, value) {
    setUsers((users) => {
      return users.map(user => {
        return user.id === id ? {...user, [key]: value} : user;
      })
    })
  }

  function updateUser(id) {
    const user = users.find((user) => user.id === id);

    fetch(`http://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(user),
          // header use to understand these data are json
          // UTF-8 is encoding formate
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        }
      ).then((response) => response.json())
        .then(json => {
          AppToaster.show({
            message: "User updated successfully",
            intent: 'success',
            timeout: '3000'
          })
        })
  }

  function deleteUser(id) {
    fetch(`http://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE"
        }
      ).then((response) => response.json())
        .then(json => {
          setUsers((users) => {
            return users.filter(user =>user.id !== id)
          })

          AppToaster.show({
            message: "User Deleted successfully",
            intent: 'success',
            timeout: '3000'
          })
        })
  }

  return (
    <div className="App">
      <table className='bp4-html-table modifier'>
        <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
        </thead>
        <tbody>
          {users.map(user =>
              <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'email', value)} value={user.email} /></td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'website', value)} value={user.website} /></td>
              <td>
                <Button intent='primary' onClick={() => updateUser(user.id)}>Update</Button>
                &nbsp;
                <Button intent='danger' onClick={() => deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          )}
          
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
                <InputGroup 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter Name'
                />
            </td>
            <td>
                <InputGroup 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter Email'
                />
            </td>
            <td>
                <InputGroup 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder='Enter Website'
                />
            </td>
            <td>
              <Button intent='success' onClick={addUser}>Add User</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;

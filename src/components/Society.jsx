import React from 'react'
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
function Society() {
  return (
    <div className='bg-slate-800 w-full'>
      <div className='w-full bg-slate-700 pt-20 px-8'>
      <div className='flex justify-between items-center mb-6'>
        <div className='w-1/2'>  {/* Width set to 50% */}
          <h1 className='text-white ml-4'>Categories</h1>
        </div>
        <div className='w-1/2 flex justify-end'>  {/* Width set to 50% and button aligned right */}
          <button className='bg-blue-800 text-white px-6 py-2 rounded mr-4'>Add</button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan={2}>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
    </div>
    </div>
  )
}

export default Society

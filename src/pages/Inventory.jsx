import React from 'react'
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
function Inventory() {
  return (
    <div className='w-full bg-slate-700 pt-20 px-8 mx-auto'>  {/* Reduced width and centered */}
      <div className='flex justify-between items-center mb-6'>
        <div className='w-1/3'>  {/* Width decreased to 33% */}
          <h1 className='text-white ml-4 text-4xl'>Inventory</h1>
        </div>
        <div className='w-1/3 flex justify-end'>  {/* Width decreased to 33% and button aligned right */}
          <button className='bg-blue-800 text-white px-6 py-2 rounded mr-4 w-80'>Add</button>
        </div>
      </div>
      <Table striped bordered hover className='w-full'> {/* Table takes up full width of container */}
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>
              <button className='bg-red-700 text-white px-2 py-1'>delete</button> {/* Button padding adjusted */}
              <button className='bg-green-500 text-white px-2 py-1 ml-2'>edit</button> {/* Button padding adjusted */}
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>
              <button  className='bg-red-700 text-white px-2 py-1'>delete</button>
              <button className='bg-green-500 text-white px-2 py-1 ml-2'>edit</button>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan={2}>Larry the Bird</td>
            <td>@twitter</td>
            <td>
              <button className='bg-red-700 text-white px-2 py-1'>delete</button>
              <button className='bg-green-500 text-white px-2 py-1 ml-2'>edit</button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default Inventory

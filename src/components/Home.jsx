import React from 'react'
import './Style.css'
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
import ActivityStatus from './Table'
import TrafficSource from './Traffic'

function Home() {
  return (
   
    <main className='main-container'>
        <div className='grid sm:grid-cols-4 gap-3'>
            <div className='bg-blue-600 h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md'>
                <div className='card-inner'>
                    <h3 className='text-2xl'>Expense</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h1 className='mt-3 text-lg'>$24k</h1>
            </div>
            <div className='bg-orange-600 h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md'>
                <div className='card-inner'>
                    <h3 className='text-2xl'>Society</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1 className='mt-3 text-lg'>75.5%</h1>
            </div>
            <div className='bg-green-600 h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md'>
                <div className='card-inner'>
                    <h3 className='text-2xl'>Master</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1 className='mt-3 text-lg'>1.6k</h1>
            </div>
            <div className='bg-red-600 h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md'>
                <div className='card-inner'>
                    <h3 className='text-2xl'>Other</h3>
                    <BsFillBellFill className='card_icon'/>
                </div>
                <h1 className='mt-3 text-lg'>$15k</h1>
            </div>
        </div>
         <div className='status-section'>
        <ActivityStatus />
        <TrafficSource />
      </div>
    </main>
   
   
   
  )
}

export default Home;

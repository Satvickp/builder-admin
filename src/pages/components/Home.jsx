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
        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Expense</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h1>$24k</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Society</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1>75.5%</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Master</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>1.6k</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Other</h3>
                    <BsFillBellFill className='card_icon'/>
                </div>
                <h1>$15k</h1>
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

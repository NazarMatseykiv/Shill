import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import {NavLink} from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-opt">
      <NavLink to='/add' className="sidebar-option">
            <img src={assets.add} alt="" />
            <p>Add Item</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order} alt="" />
            <p>List Item</p>
        </NavLink>
        <NavLink to='/order' className="sidebar-option">
            <img src={assets.order} alt="" />
            <p>Order</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar

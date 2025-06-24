import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css'
const Header = () => {

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Замовляйте улюблену їжу тут</h2>
        <a href='#menu'><button>Переглянути меню</button></a>
      </div>
    </div>
  )
}

export default Header

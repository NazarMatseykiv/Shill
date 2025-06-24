import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Welcome to Shil.ua</p>
            <div className="footer-social-media">
                <img src={assets.facebook} alt="" />
                <img src={assets.twitter} alt="" />
                <img src={assets.instagram} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>Компанія</h2>
            <ul>
                <li>Головна</li>
                <li>Інформація про нас</li>
                <li>Замовлення</li>
                <li>Політика конфіденційності</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Контакти</h2>
            <ul>
                <li>+3802516521</li>
                <li>shil@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className='footer-copy'>Copyright 2025 © Shil.ua - All Right Reserved.</p>
    </div>
  )
}

export default Footer

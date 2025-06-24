import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({setShowLogin}) => {
    const[menu, setMenu] = useState("home");

    const{getTotalCart,token,setToken} =useContext(StoreContext)
    const navigate = useNavigate();

    const logout =() =>{
       localStorage.removeItem("token");
       setToken("");
       navigate("/");
    }

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo'/></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu=="home"?"active":""}>Головна</Link>
        <a href='#menu' onClick={() => setMenu("menu")} className={menu=="menu"?"active":""}>Меню</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu=="contact-us"?"active":""}>Контакти</a>
        <Link to='/recommendation' onClick={() => setMenu("recommendation")} className={menu=="recommendation"?"active":""}>Рекомендації</Link>
        <Link to='/support' onClick={() => setMenu("support")} className={menu=="support"?"active":""}>Підтримка</Link>
      </ul>
        <div className="navbar-right">
            <img src={assets.search} alt="" />
            <div className="navbar-search">
                <Link to='/cart'><img src={assets.basket} alt="" /></Link>
                <div className={getTotalCart()===0?"":"dot"}></div>
            </div>
            {
            !token?<button onClick={()=>setShowLogin(true)}>Sign in</button>
            :<div className='navbar-profile'>
              <img src={assets.profile} alt="" />
              <ul className='nav-profile-drop'>
                <li onClick={() => navigate('/myorder')}><img src={assets.bag} alt="" /><p>Мої замовлення</p></li>
                <li onClick={() => navigate('/favorites')}><span style={{fontSize:22, color:'#f4845f', marginRight:8}}>&#10084;</span><p>Улюблені</p></li>
                <hr />
                <li onClick={logout}><img src={assets.logout} alt="" /><p>Вийти</p></li>
              </ul>
            </div>
            }
        </div>
    </div>
  )
}

export default Navbar

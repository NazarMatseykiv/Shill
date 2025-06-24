
import React from 'react'
import './Menu.css'
import {menu_list} from '../../assets/assets'

const categoryTranslations = {
  "Salad": "Салати",
  "Rolls": "Роли",
  "Desert": "Десерти",
  "Sandwich": "Сендвічі",
  "Cake": "Торти",
  "Veg": "Вегетаріанські",
  "Pasta": "Паста",
  "Noodles": "Локшина"
};

const Menu = ({category, setCategory}) => {
  return (
    <div className='menu' id='menu'>
      <h1>Виберіть меню</h1>
      <div className="menu-list">
        {menu_list.map((item,index)=>{
            return(
                <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} className="menu_list_item" key={index}>
                    <img className={category===item.menu_name?"active":""} src={item.menu_img} alt="" />
                    <p>{categoryTranslations[item.menu_name] || item.menu_name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default Menu

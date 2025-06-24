import React, { useContext} from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
const FoodItem = ({id, name, price, description, image}) => {
    const {cartItems, addCart, removeCart, url, favorites, toggleFavorite, token} = useContext(StoreContext);
    let userId = null;
    if (token) {
      try {
        userId = JSON.parse(atob(token.split('.')[1])).id;
      } catch {}
    }
    const isFavorite = favorites && favorites.includes(id);
    return (
      <div className='food-item'>
        <div className='food-item-img-container'>
          <img src={url+"/images/"+image} alt="" className="food-item-image"/>
          {userId && (
            <button
              className={`favorite-btn${isFavorite ? ' active' : ''}`}
              title={isFavorite ? 'Видалити з улюблених' : 'Додати в улюблені'}
              onClick={() => toggleFavorite(userId, id)}
              style={{position:'absolute',top:10,right:10,background:'none',border:'none',cursor:'pointer',zIndex:2}}
            >
              <span style={{fontSize: 28, color: isFavorite ? '#f4845f' : '#bbb'}}>&#10084;</span>
            </button>
          )}
          {
            !cartItems[id] ? <img src={assets.addw} className='add' onClick={()=>addCart(id)} alt=""/>
            :<div className='food-item-counter'>
                <img onClick={()=>removeCart(id)} src={assets.remove} alt="" />
                <p>{cartItems[id]}</p>
                <img onClick={()=>addCart(id)} src={assets.addg} alt="" />
            </div>
          }
        </div>
        <div className="food-item-info">
          <div className="food-item-title-row">
            <div className="food-item-title">{name}</div>
            <div className="food-item-rating"><img src={assets.rating} alt="рейтинг" /></div>
          </div>
          <p className='food-item-desc'>{description}</p>
          <p className="food-item-price">₴{price}</p>
        </div>
      </div>
    )
}

export default FoodItem

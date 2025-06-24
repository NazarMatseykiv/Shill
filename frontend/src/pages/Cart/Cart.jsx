import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const{cartItems, food_list, removeCart, getTotalCart} = useContext(StoreContext);

  const nav = useNavigate();
  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Товар</p>
          <p>Назва</p>
          <p>Ціна</p>
          <p>Кількість</p>
          <p>Загалом</p>
          <p>Видалити</p>
        </div>
        <br />
        <hr />
        {Object.values(cartItems).every(v => v === 0) ? (
          <div className="cart-empty"></div>
        ) : (
          food_list.map((item,index)=>(
            cartItems[item._id]>0 && (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₴{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₴{item.price*cartItems[item._id]}</p>
                  <p onClick={()=>removeCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          ))
        )}
      </div>
      <div className='cart-bottom'>
        <div className="cart-total">
          <h2>Підсумки кошика</h2>
          <div>
            <div className='cart-details'>
              <p>Проміжний підсумок</p>
              <p>₴{getTotalCart()}</p>
            </div>
            <div className='cart-details'>
              <p>Замовлення</p>
              <p>₴{getTotalCart()===0?0:2}</p>
            </div>
            <div className='cart-details'>
              <b>Загалом</b>
              <b>₴{getTotalCart()===0?0:getTotalCart()+2}</b>
            </div>
          </div>
          <button onClick={()=>nav('/order')}>Перейти до оформлення</button>
        </div>
        <div className="cart-promo">
          <div>
            <p>Введіть промокод тут</p>
            <div className='cart-promo-input'>
              <input type="text" placeholder='промокод' />
              <button>Підтвердити</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

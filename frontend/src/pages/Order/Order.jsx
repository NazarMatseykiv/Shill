import React, { useContext, useState } from 'react'
import './Order.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Order = () => {
  const { getTotalCart, cartItems, food_list, url, token, setCartItems } = useContext(StoreContext)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    region: '',
    country: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const nav = useNavigate()

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    const items = Object.keys(cartItems).filter(id => cartItems[id] > 0).map(id => {
      const food = food_list.find(f => f._id === id)
      return { id, name: food.name, count: cartItems[id], price: food.price }
    })
    const address = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      street: form.street,
      city: form.city,
      region: form.region,
      country: form.country,
      phone: form.phone
    }
    try {
      const response = await axios.post(url + '/api/order/create', {
        userId: token ? JSON.parse(atob(token.split('.')[1])).id : '',
        items,
        amount: getTotalCart() + (getTotalCart() === 0 ? 0 : 2),
        address
      }, { headers: { token } })
      if (response.data.success) {
        setOrderId(response.data.orderId)
        await axios.post(url + '/api/cart/clear', {}, { headers: { token } })
        setCartItems({})
      }
    } catch (err) {}
    setLoading(false)
  }

  if (orderId) {
    return (
      <div className="order-success">
        <h2>Замовлення створено!</h2>
        <p>Ваш номер замовлення: <b>{orderId}</b></p>
        <button onClick={() => nav('/myorder')}>Відстежити замовлення</button>
      </div>
    )
  }

  return (
    <form className='order' onSubmit={handleOrder}>
      <div className="order-left">
        <p className='title'>Інформація про замовлення</p>
        <div className="multi">
          <input type="text" name="firstName" value={form.firstName} onChange={onChange} placeholder="Ім'я" required />
          <input type="text" name="lastName" value={form.lastName} onChange={onChange} placeholder='Прізвище' required />
        </div>
        <input type="email" name="email" value={form.email} onChange={onChange} placeholder='Електронна пошта' required />
        <input type="text" name="street" value={form.street} onChange={onChange} placeholder='Вулиця' required />
        <div className="multi">
          <input type="text" name="city" value={form.city} onChange={onChange} placeholder='Місто' required />
          <input type="text" name="region" value={form.region} onChange={onChange} placeholder='Область' required />
        </div>
        <div className="multi">
          <input type="text" name="country" value={form.country} onChange={onChange} placeholder='Країна' required />
        </div>
        <input type="text" name="phone" value={form.phone} onChange={onChange} placeholder='Телефон' required />
      </div>
      <div className="order-right">
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
          <button type="submit" disabled={loading}>{loading ? 'Оформлення...' : 'Оформити замовлення'}</button>
        </div>
      </div>
    </form>
  )
}
export default Order

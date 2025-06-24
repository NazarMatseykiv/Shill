import React from 'react'
import './Order.css'
import { useState } from 'react'
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import axios from 'axios'
import { assets } from '../../assets/assets';
const Order = ({url}) => {

        const[order,setOrder] = useState([]);
        const getAllOrder = async () =>{
        const response = await axios.get(url+"/api/order/list");
        if(response.data.success)
            {
                setOrder(response.data.data);
                console.log(response.data.data);
            }
            else{
                toast.error("Error")
            }
        }
        useEffect(()=>{
            getAllOrder();
        },[])
  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {order.map((order, index) => (
          <div key={order._id} className="order-item">
            <div>
              <div>Номер замовлення: <b>{order._id}</b></div>
              <div>Статус: 
                <select
                  value={order.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    const res = await axios.post(url+"/api/order/update-status", { orderId: order._id, status: newStatus });
                    if(res.data.success){
                      setOrder((prev) => prev.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
                      toast.success("Статус оновлено");
                    } else {
                      toast.error("Помилка оновлення");
                    }
                  }}
                >
                  <option value="Order Processing">Оформлення</option>
                  <option value="Confirmed">Підтверджено</option>
                  <option value="Delivering">Доставляється</option>
                  <option value="Completed">Завершено</option>
                  <option value="Canceled">Скасовано</option>
                </select>
              </div>
              <div>Сума: <b>{order.amount}₴</b></div>
              <div>Товари: {order.items.map((item, idx) => (
                <span key={item.id}>{item.name} x {item.count}{idx !== order.items.length-1 ? ', ' : ''}</span>
              ))}</div>
              <div>Дата: {new Date(order.date).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order

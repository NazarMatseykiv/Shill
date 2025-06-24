import React, { useContext, useState, useEffect } from 'react'
import './MyOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';

import { assets } from '../../assets/assets';
const MyOrder = () => {

    const {url, token} = useContext(StoreContext);
    const [data, setData] = useState([]);

    const getOrder = async () => {
        const response = await axios.post(url+"/api/order/userorder", {},{headers:{token}})
        setData(response.data.data);
    }

    useEffect(() => {
        getOrder();
    }, [])
  return (
    <div className='my-order'>
        <h2>Замовлення</h2>
        <div className='container'>
            {data.map((order, index)=>{
                if(order.status === 'Completed') {
                    return (
                        <div key={order._id} className='my-order-order delivered'>
                            <div>
                                <div>Номер замовлення: <b>{order._id}</b></div>
                                <div className="delivered-text">Замовлення доставлено</div>
                                <div>Сума: <b>{order.amount}₴</b></div>
                                <div>Товари: {order.items.map((item, idx) => (
                                    <span key={item.id}>{item.name} x {item.count}{idx !== order.items.length-1 ? ', ' : ''}</span>
                                ))}</div>
                                <div>Дата: {new Date(order.date).toLocaleString()}</div>
                            </div>
                        </div>
                    )
                }
                if(order.status === 'Canceled') {
                    return null;
                }
                return(
                    <div key={order._id} className='my-order-order'>
                        <div>
                            <div>Номер замовлення: <b>{order._id}</b></div>
                            <div>Статус: <b>{
                                order.status === 'Order Processing' ? 'Оформлення' :
                                order.status === 'Confirmed' ? 'Підтверджено' :
                                order.status === 'Delivering' ? 'Доставляється' :
                                order.status === 'Completed' ? 'Завершено' :
                                order.status === 'Canceled' ? 'Скасовано' :
                                order.status
                            }</b></div>
                            <div>Сума: <b>{order.amount}₴</b></div>
                            <div>Товари: {order.items.map((item, idx) => (
                                <span key={item.id}>{item.name} x {item.count}{idx !== order.items.length-1 ? ', ' : ''}</span>
                            ))}</div>
                            <div>Дата: {new Date(order.date).toLocaleString()}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrder

import React from 'react'
import './List.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
const List = ({url}) => {
    const [list, setList] = useState([]);

 
    const getList = async () =>{
        const response = await axios.get(`${url}/api/food/list`);
        console.log(response.data)
        if(response.data.success)
            {
                setList(response.data.data);
            }
            else{
                toast.error("Error")
            }
    }
   const remove = async(foodId) =>
        {
            const response = await axios.post(`${url}/api/food/remove`, {id:foodId});
            await getList();
            if(response.data.success)
                {
                    toast.success(response.data.message);
                }
                else{
                    toast.error("Error")
                }
        }
    useEffect(()=>{
        getList();  
    },[])
  return (
    <div className='list add flex-col'>
      <p>List</p>
      <div className="list-table">
        <div className="list-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
        </div>
        {list.map((item,index)=>{
            return(
                <div key={index} className="list-format">
                    <img src={`${url}/images/`+item.image} alt="" />
                    <p>{item.name}</p>
                    <p>{item.category}</p>
                    <p>₴{item.price}</p>
                    <p onClick={()=>remove(item._id)} className='cur'>X</p>
                </div>
            )
        })}
      </div>
    </div>
  )
}

export default List

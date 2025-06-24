import React from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
const Add = ({url}) => {
    
    const [image,setImage] = useState(false);
    const [data,setData] = useState({
        name:"",
        description:"",
        price:"",
        category:"Salad"
    })


    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }
    
    const onSubmitHand = async (event) =>{
        event.preventDefault();
        const formData = new FormData();
        formData.append("name",data.name)
        formData.append("description",data.description)
        formData.append("price",Number(data.price))
        formData.append("category",data.category)
        formData.append("image",image)
        const response = await axios.post(`${url}/api/food/add`, formData)
        if (response.data.success) {
            setData({
            name:"",
            description:"",
            price:"",
            category:"Salad"
            })
            setImage(false)
            toast.success(response.data.message)
        }
        else{
            toast.error(response.data.message)
        }
    }

  return (
    <div className='add'>
        <form action="" className="flex-col" onSubmit={onSubmitHand}>
            <div className="add-img-upload flex-col">
                <p>Завантажити зображення</p>
                <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" />
                </label>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" name="" id="image" hidden required />
            </div>
            <div className="add-product flex-col">
                <p>Назва продукту</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Введіть тут' />
            </div>
            <div className="add-desc flex-col">
                <p>Опис продукту</p>
                <textarea onChange={onChangeHandler} value={data.description}  rows="6" name="description" placeholder='Введіть опис' />
            </div>
            <div className="add-categ-price">
                <div className="add-categ flex-col">
                    <p>Категорія продукту</p>
                    <select onChange={onChangeHandler} name="category" id="">
                        <option value="Salad">Салат</option>
                        <option value="Rolls">Роли</option>
                        <option value="Desert">Десерт</option>
                        <option value="Sandwich">Сендвіч</option>
                        <option value="Cake">Торт</option>
                        <option value="Veg">Овочі</option>
                        <option value="Pasta">Паста</option>
                        <option value="Noodles">Локшина</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                <p>Ціна продукту</p>
                <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder='₴' />
            </div>
            </div>
            <button type='submit' className='add-but'>Додати</button>
        </form>
    </div>
  )
}

export default Add

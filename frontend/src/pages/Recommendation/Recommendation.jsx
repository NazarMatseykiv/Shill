import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import './Recommendation.css'

const Recommendation = () => {
  const { url, token, addCart } = useContext(StoreContext)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(url + '/api/recommendations', { headers: { token } })
        if (res.data.success) setFoods(res.data.data)
        else setError('Не вдалося отримати рекомендації')
      } catch {
        setError('Сталася помилка при завантаженні рекомендацій')
      }
      setLoading(false)
    }
    fetchData()
  }, [url, token])

  if (loading) return <div className='recommendation'>Завантаження...</div>
  if (error) return <div className='recommendation'>{error}</div>

  return (
    <div className='recommendation'>
      <h2>Рекомендовані страви для вас</h2>
      <div className='recommendation-list'>
        {foods.length === 0 && <div>Немає рекомендацій</div>}
        {foods.map(food => (
          <div key={food._id} className='recommendation-item'>
            <img src={`${url}/images/${food.image}`} alt={food.name} />
            <div className='recommendation-name'>{food.name}</div>
            <div className='recommendation-price'>{food.price}₴</div>
            <button className='recommendation-add-btn' onClick={() => addCart(food._id)}>
              Додати в кошик
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommendation

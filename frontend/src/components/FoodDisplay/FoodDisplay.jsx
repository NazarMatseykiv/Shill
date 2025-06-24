import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category, searchQuery }) => {
  const { food_list } = useContext(StoreContext);
  const filtered = food_list.filter(item => {
    const matchCategory = category === 'All' || category === item.category;
    const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchCategory && matchSearch;
  });
  const gridClass = filtered.length < 5 ? 'food-display-list few-items' : 'food-display-list';
  return (
    <div className='food-display' id='food-display'>
      <h2></h2>
      <div className={gridClass}>
        {filtered.length === 0 && <div style={{padding: 24, color: '#888'}}>Нічого не знайдено</div>}
        {filtered.map((item, index) => (
          <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  );
}

export default FoodDisplay

import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import './Favorites.css';

const Favorites = () => {
  const { favorites, food_list } = useContext(StoreContext);
  const favoriteFoods = food_list.filter(item => favorites.includes(item._id));

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Улюблені страви</h2>
      {favoriteFoods.length === 0 ? (
        <div className="favorites-empty">У вас ще немає улюблених страв.</div>
      ) : (
        <div className="favorites-list food-display-list few-items">
          {favoriteFoods.map(item => (
            <FoodItem key={item._id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

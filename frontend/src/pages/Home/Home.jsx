import React, { useState } from 'react';
import './Home.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import DishSearch from '../../components/DishSearch/DishSearch';

const Home = () => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <div className="home-gradient-banner">
        <div className="home-gradient-content">
          <h1>Не знаєте, що обрати?</h1>
          <p>Довіртеся рекомендаціям та відкрийте для себе нові смаки!</p>
          <Link to="/recommendation" className="home-banner-btn">Отримати рекомендацію</Link>
        </div>
      </div>
      <Menu category={category} setCategory={setCategory} title="Виберіть меню" />
      <div style={{ margin: '32px 0' }}>
        <DishSearch query={searchQuery} setQuery={setSearchQuery} />
      </div>
      <FoodDisplay category={category} searchQuery={searchQuery} title="Топ страви поруч із вами" />
    </div>
  );
};

export default Home;

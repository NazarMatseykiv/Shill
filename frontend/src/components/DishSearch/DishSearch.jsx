import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './DishSearch.css';

export default function DishSearch({ query, setQuery }) {
  return (
    <div className="dish-search-container">
      <h2 className="dish-search-title">Пошук страви</h2>
      <form onSubmit={e => e.preventDefault()} className="dish-search-form">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Введіть назву страви..."
          className="dish-search-input"
        />
      </form>
    </div>
  );
}


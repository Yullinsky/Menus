import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_FOODS, FOOD_GROUPS } from '../data/smae';

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  // Estado de Alimentos (Persistente)
  const [foods, setFoods] = useState(() => {
    const savedFoods = localStorage.getItem('smae_foods');
    return savedFoods ? JSON.parse(savedFoods) : INITIAL_FOODS;
  });

  // Guardar alimentos en LS cuando cambien
  useEffect(() => {
    localStorage.setItem('smae_foods', JSON.stringify(foods));
  }, [foods]);

  // Estado del Menú
  const [meals, setMeals] = useState([
    { id: uuidv4(), name: 'Desayuno', items: [] },
    { id: uuidv4(), name: 'Colación 1', items: [] },
    { id: uuidv4(), name: 'Comida', items: [] },
    { id: uuidv4(), name: 'Colación 2', items: [] },
    { id: uuidv4(), name: 'Cena', items: [] },
  ]);

  // Acciones de Alimentos (Admin)
  const addFood = (food) => {
    setFoods([...foods, { ...food, id: uuidv4() }]);
  };

  const updateFood = (id, updatedFood) => {
    setFoods(foods.map(f => f.id === id ? updatedFood : f));
  };

  const deleteFood = (id) => {
    setFoods(foods.filter(f => f.id !== id));
  };

  // Acciones del Menú
  const addMealTime = (name = 'Nuevo Tiempo') => {
    setMeals([...meals, { id: uuidv4(), name, items: [] }]);
  };

  const removeMealTime = (id) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const updateMealName = (id, name) => {
    setMeals(meals.map(m => m.id === id ? { ...m, name } : m));
  };

  const addFoodToMeal = (mealId, foodId, quantity) => {
    const food = foods.find(f => f.id === foodId);
    if (!food) return;

    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          items: [...meal.items, { id: uuidv4(), foodId, quantity }]
        };
      }
      return meal;
    }));
  };

  const removeFoodFromMeal = (mealId, itemId) => {
    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          items: meal.items.filter(item => item.id !== itemId)
        };
      }
      return meal;
    }));
  };

  const updateFoodInMeal = (mealId, itemId, quantity) => {
    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          items: meal.items.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          )
        };
      }
      return meal;
    }));
  };

  // Cálculos Auxiliares
  const calculateItemNutrition = (foodId, quantity) => {
    const food = foods.find(f => f.id === foodId);
    if (!food) return null;
    
    const group = FOOD_GROUPS[food.grupo];
    if (!group) return null;

    // Cálculo de equivalentes
    // Si la porción es 1 pieza y el usuario pone 2, son 2 equivalentes.
    // Si la porción es 100g y el usuario pone 200, son 2 equivalentes.
    // Equivalentes = Cantidad Usuario / Porción Base (que es 1 eq)
    const equivalents = parseFloat(quantity) / parseFloat(food.porcion);
    
    return {
      equivalents,
      proteina: equivalents * group.proteina,
      carbohidratos: equivalents * group.carbohidratos,
      lipidos: equivalents * group.lipidos,
      energia: equivalents * group.energia,
      groupName: food.grupo
    };
  };

  return (
    <MenuContext.Provider value={{
      foods,
      meals,
      addFood,
      updateFood,
      deleteFood,
      addMealTime,
      removeMealTime,
      updateMealName,
      addFoodToMeal,
      removeFoodFromMeal,
      updateFoodInMeal,
      calculateItemNutrition,
      FOOD_GROUPS
    }}>
      {children}
    </MenuContext.Provider>
  );
};

import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_FOODS, FOOD_GROUPS } from '../data/smae';
import { supabase } from '../supabaseClient';

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  // Estado de Alimentos (Supabase)
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar alimentos desde Supabase
  const fetchFoods = async () => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('nombre', { ascending: true });
      
      if (error) throw error;
      
      // Si la BD está vacía, podríamos ofrecer cargar los iniciales (opcional)
      // Por ahora, si está vacía, mostramos vacío.
      setFoods(data || []);
    } catch (error) {
      console.error('Error fetching foods:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Estado del Menú (Local - Persistencia en navegador para el usuario actual)
  const [meals, setMeals] = useState([
    { id: uuidv4(), name: 'Desayuno', items: [] },
    { id: uuidv4(), name: 'Colación 1', items: [] },
    { id: uuidv4(), name: 'Comida', items: [] },
    { id: uuidv4(), name: 'Colación 2', items: [] },
    { id: uuidv4(), name: 'Cena', items: [] },
  ]);

  // Acciones de Alimentos (Admin - Supabase)
  const addFood = async (food) => {
    try {
      // Eliminamos ID generado por uuidv4 ya que Supabase lo genera (o lo enviamos si es uuid)
      // La tabla tiene id uuid default gen_random_uuid()
      const { data, error } = await supabase
        .from('foods')
        .insert([{ ...food }]) // Supabase generará el ID si no se envía, o podemos enviarlo.
        .select();

      if (error) throw error;
      
      // Actualizar estado local
      setFoods([...foods, ...data]);
      return { success: true };
    } catch (error) {
      console.error('Error adding food:', error.message);
      return { success: false, error: error.message };
    }
  };

  const updateFood = async (id, updatedFood) => {
    try {
      const { error } = await supabase
        .from('foods')
        .update(updatedFood)
        .eq('id', id);

      if (error) throw error;

      setFoods(foods.map(f => f.id === id ? { ...f, ...updatedFood } : f));
      return { success: true };
    } catch (error) {
      console.error('Error updating food:', error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteFood = async (id) => {
    try {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFoods(foods.filter(f => f.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting food:', error.message);
      return { success: false, error: error.message };
    }
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
      loading,
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

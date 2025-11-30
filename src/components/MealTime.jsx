import React, { useState, useMemo } from 'react';
import { useMenu } from '../context/MenuContext';
import { Trash2, Plus, X } from 'lucide-react';

const MealTime = ({ meal }) => {
  const { 
    foods, 
    removeMealTime, 
    updateMealName, 
    addFoodToMeal, 
    removeFoodFromMeal, 
    calculateItemNutrition 
  } = useMenu();

  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [quantity, setQuantity] = useState('');

  // Calcular totales del tiempo de comida
  const mealTotals = useMemo(() => {
    return meal.items.reduce((acc, item) => {
      const nutrition = calculateItemNutrition(item.foodId, item.quantity);
      if (!nutrition) return acc;
      return {
        proteina: acc.proteina + nutrition.proteina,
        carbohidratos: acc.carbohidratos + nutrition.carbohidratos,
        lipidos: acc.lipidos + nutrition.lipidos,
        energia: acc.energia + nutrition.energia
      };
    }, { proteina: 0, carbohidratos: 0, lipidos: 0, energia: 0 });
  }, [meal.items, foods]);

  const handleAddFood = (e) => {
    e.preventDefault();
    if (selectedFoodId && quantity) {
      addFoodToMeal(meal.id, selectedFoodId, quantity);
      setQuantity('');
      setSelectedFoodId('');
    }
  };

  const selectedFood = foods.find(f => f.id === selectedFoodId);

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
        <input 
          className="text-xl font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 w-full mr-4"
          value={meal.name}
          onChange={(e) => updateMealName(meal.id, e.target.value)}
        />
        <button 
          onClick={() => removeMealTime(meal.id)}
          className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
          title="Eliminar tiempo de comida"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Lista de Alimentos */}
      <div className="space-y-3 mb-4">
        {meal.items.length === 0 && (
          <p className="text-sm text-gray-400 italic text-center py-2">No hay alimentos agregados</p>
        )}
        {meal.items.map(item => {
          const food = foods.find(f => f.id === item.foodId);
          const nutrition = calculateItemNutrition(item.foodId, item.quantity);
          if (!food || !nutrition) return null;

          return (
            <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg text-sm">
              <div className="flex-1">
                <div className="font-medium text-slate-700">{food.nombre}</div>
                <div className="text-xs text-slate-500">
                  {item.quantity} {food.unidad} • {nutrition.equivalents.toFixed(1)} Eq. {nutrition.groupName}
                </div>
              </div>
              <div className="flex flex-col text-xs text-slate-600 mr-4 text-right gap-0.5">
                <span>Proteína: {nutrition.proteina.toFixed(1)}g</span>
                <span>Carbohidratos: {nutrition.carbohidratos.toFixed(1)}g</span>
                <span>Lípidos: {nutrition.lipidos.toFixed(1)}g</span>
                <span className="font-bold text-indigo-600">{nutrition.energia.toFixed(0)} kcal</span>
              </div>
              <button 
                onClick={() => removeFoodFromMeal(meal.id, item.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Totales del Tiempo de Comida */}
      <div className="bg-indigo-50 p-4 rounded-lg mb-4 flex justify-between items-start text-sm font-medium text-indigo-900">
        <span className="text-base font-bold mt-1">Total {meal.name}:</span>
        <div className="flex flex-col items-end gap-1">
          <span>Proteína: {mealTotals.proteina.toFixed(1)}g</span>
          <span>Carbohidratos: {mealTotals.carbohidratos.toFixed(1)}g</span>
          <span>Lípidos: {mealTotals.lipidos.toFixed(1)}g</span>
          <span className="font-bold text-base mt-1">{mealTotals.energia.toFixed(0)} kcal</span>
        </div>
      </div>

      {/* Formulario para agregar */}
      <form onSubmit={handleAddFood} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="label text-xs">Alimento</label>
          <select 
            className="input text-sm py-1"
            value={selectedFoodId}
            onChange={(e) => setSelectedFoodId(e.target.value)}
            required
          >
            <option value="">Seleccionar...</option>
            {foods.map(f => (
              <option key={f.id} value={f.id}>{f.nombre} ({f.unidad})</option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <label className="label text-xs">Cantidad</label>
          <input 
            type="number" 
            step="0.1"
            className="input text-sm py-1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={selectedFood ? selectedFood.porcion : '0'}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary py-1 px-3 h-[34px]">
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
};

export default MealTime;

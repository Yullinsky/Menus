import React, { useMemo } from 'react';
import { useMenu } from '../context/MenuContext';
import MealTime from '../components/MealTime';
import { PlusCircle } from 'lucide-react';

const Home = () => {
  const { meals, addMealTime, calculateItemNutrition } = useMenu();

  // Calcular totales diarios
  const dailyTotals = useMemo(() => {
    return meals.reduce((acc, meal) => {
      const mealTotal = meal.items.reduce((mAcc, item) => {
        const nutrition = calculateItemNutrition(item.foodId, item.quantity);
        if (!nutrition) return mAcc;
        return {
          proteina: mAcc.proteina + nutrition.proteina,
          carbohidratos: mAcc.carbohidratos + nutrition.carbohidratos,
          lipidos: mAcc.lipidos + nutrition.lipidos,
          energia: mAcc.energia + nutrition.energia
        };
      }, { proteina: 0, carbohidratos: 0, lipidos: 0, energia: 0 });

      return {
        proteina: acc.proteina + mealTotal.proteina,
        carbohidratos: acc.carbohidratos + mealTotal.carbohidratos,
        lipidos: acc.lipidos + mealTotal.lipidos,
        energia: acc.energia + mealTotal.energia
      };
    }, { proteina: 0, carbohidratos: 0, lipidos: 0, energia: 0 });
  }, [meals, calculateItemNutrition]);

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Planificación de Menú</h1>
        <button 
          onClick={() => addMealTime()} 
          className="btn btn-secondary text-sm"
        >
          <PlusCircle size={16} />
          Agregar Tiempo
        </button>
      </div>

      <div className="grid gap-8">
        {meals.map(meal => (
          <MealTime key={meal.id} meal={meal} />
        ))}
      </div>

      {/* Resumen Total Flotante o Fijo al final */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-indigo-100 shadow-lg p-4 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
          <div className="flex flex-col">
            <div className="font-bold text-slate-700 text-lg">Total Diario</div>
            <div className="text-xs text-slate-400 mt-1">
              Diseñado por <span className="font-bold text-indigo-500">Yullinsky</span> • <a href="https://github.com/Yullinsky/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 underline decoration-dotted">GitHub</a>
            </div>
          </div>
          <div className="flex gap-8 text-sm font-medium text-right">
            <div className="flex flex-col items-end">
              <span className="text-slate-600">Proteína: <span className="text-indigo-700 font-bold">{dailyTotals.proteina.toFixed(1)}g</span></span>
              <span className="text-slate-600">Carbohidratos: <span className="text-indigo-700 font-bold">{dailyTotals.carbohidratos.toFixed(1)}g</span></span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-600">Lípidos: <span className="text-indigo-700 font-bold">{dailyTotals.lipidos.toFixed(1)}g</span></span>
              <span className="text-indigo-600 font-bold text-lg">{dailyTotals.energia.toFixed(0)} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

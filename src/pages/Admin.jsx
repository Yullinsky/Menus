import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const Admin = () => {
  const { foods, addFood, updateFood, deleteFood, FOOD_GROUPS } = useMenu();
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    unidad: 'pza',
    porcion: '',
    grupo: 'Frutas'
  });

  const units = ['pza', 'gramos', 'cda', 'cdita', 'rebanada', 'bolsa', 'barra', 'paquete', 'taza', 'ml'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateFood(isEditing, formData);
      setIsEditing(null);
    } else {
      addFood(formData);
    }
    setFormData({ nombre: '', unidad: 'pza', porcion: '', grupo: 'Frutas' });
  };

  const handleEdit = (food) => {
    setIsEditing(food.id);
    setFormData(food);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ nombre: '', unidad: 'pza', porcion: '', grupo: 'Frutas' });
  };

  return (
    <div className="admin-page">
      <div className="card mb-4">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
          {isEditing ? 'Editar Alimento' : 'Agregar Nuevo Alimento'}
        </h2>
        
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="label">Nombre del Alimento</label>
            <input
              type="text"
              className="input"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
              placeholder="Ej. Manzana"
            />
          </div>

          <div className="form-group">
            <label className="label">Unidad</label>
            <select
              className="input"
              value={formData.unidad}
              onChange={(e) => setFormData({...formData, unidad: e.target.value})}
            >
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Tamaño de Porción (1 Eq)</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.porcion}
              onChange={(e) => setFormData({...formData, porcion: e.target.value})}
              required
              placeholder="Ej. 1"
            />
          </div>

          <div className="form-group">
            <label className="label">Grupo</label>
            <select
              className="input"
              value={formData.grupo}
              onChange={(e) => setFormData({...formData, grupo: e.target.value})}
            >
              {Object.keys(FOOD_GROUPS).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Guardar Cambios' : 'Agregar Alimento'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Base de Datos de Alimentos ({foods.length})</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Porción</th>
                <th>Unidad</th>
                <th>Grupo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {foods.map(food => (
                <tr key={food.id}>
                  <td>{food.nombre}</td>
                  <td>{food.porcion}</td>
                  <td>{food.unidad}</td>
                  <td>{food.grupo}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(food)} className="btn-icon text-blue">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteFood(food.id)} className="btn-icon text-red">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .table-container {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th, .table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        .table th {
          font-weight: 600;
          color: var(--text-secondary);
        }
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background-color: var(--background);
        }
        .text-blue { color: var(--primary); }
        .text-red { color: #ef4444; }
      `}</style>
    </div>
  );
};

export default Admin;

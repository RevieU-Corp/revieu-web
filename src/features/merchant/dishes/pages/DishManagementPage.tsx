import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, ImageIcon } from 'lucide-react';
import ConfirmationDialog from '../../shared/components/ConfirmationDialog';
import { Dish, UpsertDishPayload, dishService } from '../services/dishService';

const emptyForm: UpsertDishPayload = { name: '', description: '', original_price: 0, category: '', image_url: '' };

const DishManagementPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<number | null>(null);
  const [form, setForm] = useState<UpsertDishPayload>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; dishId: number | null }>({ isOpen: false, dishId: null });

  const loadDishes = async () => {
    setIsLoading(true);
    try {
      setDishes(await dishService.list());
    } catch (error) {
      console.error('Failed to load dishes:', error);
      setStatusMessage('Failed to load dishes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDishes();
  }, []);

  const openCreateModal = () => {
    setEditingDishId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (dish: Dish) => {
    setEditingDishId(dish.id);
    setForm({ name: dish.name, description: dish.description, original_price: dish.original_price, category: dish.category, image_url: dish.image_url });
    setIsModalOpen(true);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await dishService.uploadImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (error) {
      console.error('Failed to upload dish image:', error);
      setStatusMessage('Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setStatusMessage('Dish name is required.');
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);
    try {
      if (editingDishId) {
        await dishService.update(editingDishId, form);
      } else {
        await dishService.create(form);
      }
      setIsModalOpen(false);
      await loadDishes();
    } catch (error) {
      console.error('Failed to save dish:', error);
      setStatusMessage('Failed to save dish.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEnabled = async (dish: Dish) => {
    try {
      await dishService.setEnabled(dish.id, dish.status !== 'active');
      await loadDishes();
    } catch (error) {
      console.error('Failed to toggle dish status:', error);
      setStatusMessage('Failed to update dish status.');
    }
  };

  const handleDelete = async () => {
    if (confirmDelete.dishId == null) return;
    try {
      await dishService.remove(confirmDelete.dishId);
      setConfirmDelete({ isOpen: false, dishId: null });
      await loadDishes();
    } catch (error) {
      console.error('Failed to delete dish:', error);
      setStatusMessage('Failed to delete dish.');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu / Dishes</h1>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={16} /> Add Dish
        </button>
      </div>
      {statusMessage && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{statusMessage}</div>}
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : dishes.length === 0 ? (
        <p className="text-gray-500">No dishes yet. Click "Add Dish" to create your first one.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dishes.map((dish) => (
            <div key={dish.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                {dish.image_url ? <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{dish.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dish.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {dish.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">${dish.original_price.toFixed(2)} · {dish.category || 'Uncategorized'}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEditModal(dish)} className="text-blue-600 text-sm flex items-center gap-1"><Edit3 size={14} /> Edit</button>
                  <button onClick={() => handleToggleEnabled(dish)} className="text-gray-600 text-sm">{dish.status === 'active' ? 'Disable' : 'Enable'}</button>
                  <button onClick={() => setConfirmDelete({ isOpen: true, dishId: dish.id })} className="text-red-600 text-sm flex items-center gap-1"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-3">
            <h2 className="text-lg font-semibold">{editingDishId ? 'Edit Dish' : 'Add Dish'}</h2>
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
            <input type="number" step="0.01" placeholder="Original price" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={isUploadingImage} />
            {form.image_url && <img src={form.image_url} alt="preview" className="w-20 h-20 object-cover rounded-lg" />}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg">Cancel</button>
              <button onClick={handleSubmit} disabled={isSaving} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={confirmDelete.isOpen}
        title="Delete Dish"
        message="Are you sure you want to delete this dish? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete({ isOpen: false, dishId: null })}
      />
    </div>
  );
};

export default DishManagementPage;

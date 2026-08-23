'use client';

import { useState } from 'react';
import { Plant, PlantVariety, StockStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Search, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Layers, RefreshCw, Sparkles } from 'lucide-react';
import PlantFormModal from './PlantFormModal';
import VarietyFormModal from './VarietyFormModal';

interface InventoryTableProps {
  plants: Plant[];
  onRefresh: () => void;
  onAddPlant: (plantData: Partial<Plant>) => Promise<void>;
  onUpdatePlant: (id: string, plantData: Partial<Plant>) => Promise<void>;
  onDeletePlant: (id: string) => Promise<void>;
  onAddVariety: (varietyData: Partial<PlantVariety>) => Promise<void>;
  onUpdateVariety: (id: string, varietyData: Partial<PlantVariety>) => Promise<void>;
  onToggleVarietyStock: (id: string, newStatus: StockStatus) => Promise<void>;
  onDeleteVariety: (id: string) => Promise<void>;
}

export default function InventoryTable({
  plants,
  onRefresh,
  onAddPlant,
  onUpdatePlant,
  onDeletePlant,
  onAddVariety,
  onUpdateVariety,
  onToggleVarietyStock,
  onDeleteVariety,
}: InventoryTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedCropIds, setExpandedCropIds] = useState<Record<string, boolean>>({});

  // Modals
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  
  const [addVarietyParent, setAddVarietyParent] = useState<{ id: string; name: string } | null>(null);
  const [editingVariety, setEditingVariety] = useState<{ parentId: string; parentName: string; variety: PlantVariety } | null>(null);
  
  const [deletingCropId, setDeletingCropId] = useState<string | null>(null);
  const [deletingVarietyId, setDeletingVarietyId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCropIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = plants.filter((plant) => {
    const matchesCat = categoryFilter === 'All' || plant.category === categoryFilter;
    const q = search.toLowerCase();
    const matchesQuery =
      !q ||
      plant.commonName.toLowerCase().includes(q) ||
      plant.scientificName.toLowerCase().includes(q) ||
      plant.varieties?.some(v => v.varietyName.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search crops & hybrid varieties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Vegetables & Commercial Saplings">Vegetables & Commercial Saplings</option>
            <option value="Horticulture & Fruits">Horticulture & Fruits</option>
            <option value="Floriculture">Floriculture</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAddPlantOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Parent Crop
          </button>
        </div>
      </div>

      {/* 2-Tier Crop & Variety List */}
      <div className="space-y-4">
        {filtered.map((crop) => {
          const isExpanded = expandedCropIds[crop.id] ?? true; // default expanded
          const varietyCount = crop.varieties ? crop.varieties.length : 0;

          return (
            <div
              key={crop.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden transition-all"
            >
              {/* Parent Crop Header Bar */}
              <div className="p-4 bg-sage-50/70 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => toggleExpand(crop.id)}>
                  <button className="p-1 text-forest-900 hover:bg-white rounded-lg transition-colors">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>

                  <img
                    src={crop.imageUrl}
                    alt={crop.commonName}
                    className="w-12 h-12 rounded-2xl object-cover border border-emerald-700/20 bg-white"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-forest-900 font-serif">
                        {crop.commonName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-forest-900 text-emerald-200 text-[10px] font-bold uppercase">
                        {crop.category}
                      </span>
                    </div>
                    <span className="text-xs italic text-emerald-700 font-medium">
                      {crop.scientificName} • <strong className="text-forest-900 font-bold">{varietyCount} Varieties</strong>
                    </span>
                  </div>
                </div>

                {/* Parent Crop Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setAddVarietyParent({ id: crop.id, name: crop.commonName })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Variety
                  </button>

                  <button
                    onClick={() => setEditingPlant(crop)}
                    className="p-2 rounded-xl text-emerald-700 hover:bg-white transition-colors"
                    title="Edit Crop Info"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingCropId(crop.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-white transition-colors"
                    title="Delete Crop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Nested Varieties Table */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-6">Hybrid / Seed Variety</th>
                        <th className="py-3 px-4">Rate (Price)</th>
                        <th className="py-3 px-4">Yield & Maturity</th>
                        <th className="py-3 px-4">Instant Stock Toggle</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {crop.varieties && crop.varieties.map((v) => (
                        <tr key={v.id} className="hover:bg-sage-50/30 transition-colors">
                          
                          {/* Variety Name & Badge */}
                          <td className="py-3.5 px-6 font-bold text-forest-900">
                            <div className="flex items-center gap-2">
                              <span>{v.varietyName}</span>
                              {v.isPopular && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold">
                                  Popular
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Rate */}
                          <td className="py-3.5 px-4 font-extrabold text-emerald-800">
                            {formatCurrency(v.price)} <span className="text-[10px] font-normal text-gray-500">{v.unit}</span>
                          </td>

                          {/* Traits */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="text-[11px] font-medium text-gray-800 line-clamp-1">{v.yieldTraits}</div>
                            <div className="text-[10px] text-gray-500 font-semibold">{v.daysToMaturity}</div>
                          </td>

                          {/* Stock Toggle */}
                          <td className="py-3.5 px-4">
                            <select
                              value={v.stockStatus}
                              onChange={(e) => onToggleVarietyStock(v.id, e.target.value as StockStatus)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                                v.stockStatus === 'In Stock'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : v.stockStatus === 'Out of Stock'
                                  ? 'bg-red-100 text-red-800 border-red-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="In Stock">In Stock</option>
                              <option value="Out of Stock">Out of Stock</option>
                              <option value="Pre-Booking">Pre-Booking</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditingVariety({ parentId: crop.id, parentName: crop.commonName, variety: v })}
                                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                                title="Edit Variety"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteVariety(v.id)}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                title="Delete Variety"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}

                      {(!crop.varieties || crop.varieties.length === 0) && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-xs text-gray-400 font-medium">
                            No varieties added under {crop.commonName} yet. Click "+ Add Variety" above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Add Crop Modal */}
      <PlantFormModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onSave={onAddPlant}
      />

      {/* Edit Crop Modal */}
      <PlantFormModal
        plant={editingPlant}
        isOpen={Boolean(editingPlant)}
        onClose={() => setEditingPlant(null)}
        onSave={async (data) => {
          if (editingPlant) await onUpdatePlant(editingPlant.id, data);
        }}
      />

      {/* Add Variety Modal */}
      {addVarietyParent && (
        <VarietyFormModal
          plantId={addVarietyParent.id}
          parentCropName={addVarietyParent.name}
          isOpen={Boolean(addVarietyParent)}
          onClose={() => setAddVarietyParent(null)}
          onSave={onAddVariety}
        />
      )}

      {/* Edit Variety Modal */}
      {editingVariety && (
        <VarietyFormModal
          plantId={editingVariety.parentId}
          parentCropName={editingVariety.parentName}
          variety={editingVariety.variety}
          isOpen={Boolean(editingVariety)}
          onClose={() => setEditingVariety(null)}
          onSave={async (data) => {
            if (editingVariety) await onUpdateVariety(editingVariety.variety.id, data);
          }}
        />
      )}

      {/* Delete Confirmation Prompt */}
      {deletingCropId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 font-serif">Delete Parent Crop</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to delete this main crop and all its varieties?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingCropId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deletingCropId) {
                    await onDeletePlant(deletingCropId);
                    setDeletingCropId(null);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Branch, OrderItemForm, Vehicle, Workshop } from "@/types/types";
import { NEXT_PUBLIC_LOCAL_URL } from "@/lib/constants";
import { fetchClientSide } from "@/lib/utils/fetchClientSide";

const serviceTypes = {
  PREVENTIVE: "Manutenção Preventiva",
  CORRECTIVE: "Manutenção Corretiva",
  PERIODIC: "Manutenção Periódica",
};

interface OrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    type: "PREVENTIVE",
    totalCost: 0,
    vehicleId: "",
    workshopId: "",
    branchId: "",
    status: "IN_PROGRESS",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [branchs, setBranchs] = useState<Branch[]>([]);

  const [formItems, setformItems] = useState<OrderItemForm[]>([
    { id: crypto.randomUUID(), description: "", cost: "", laborCost: "" },
  ]);

  useEffect(() => {
    (async () => {
      const data = await fetchClientSide<Branch[]>("GET", `/branchs`);

      setFormData((prev) => ({ ...prev, branchId: String(data[0].id) }));
      setBranchs(data);
    })();
  }, []);

  useEffect(() => {
    if (!formData.branchId) return;

    const fetchData = async () => {
      try {
        const [vehiclesData, workshopsData] = await Promise.all([
          fetchClientSide<Vehicle[]>(
            "GET",
            `/vehicles?branchId=${formData.branchId}`
          ),
          fetchClientSide<Workshop[]>(
            "GET",
            `/workshops?branchId=${formData.branchId}`
          ),
        ]);

        setFormData((prev) => ({
          ...prev,
          vehicleId: String(vehiclesData[0].id),
          workshopId: String(workshopsData[0].id),
        }));
        setVehicles(vehiclesData);
        setWorkshops(workshopsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [formData.branchId]);

  const handleItemChange = (
    id: string,
    field: keyof Omit<OrderItemForm, "id">,
    value: string
  ) => {
    setformItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    setformItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", cost: "", laborCost: "" },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setformItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const items = formItems.map((item) => {
      const cost = parseFloat(item.cost.replace(",", "."));
      const laborCost = parseFloat(item.laborCost.replace(",", "."));
      return {
        description: item.description,
        cost,
        laborCost,
        totalCost: cost + laborCost,
      };
    });

    const res = await fetch(`${NEXT_PUBLIC_LOCAL_URL}/orders`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        items,
        startDate: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error("Erro ao criar ordem de serviço");
    onSubmit(res);
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      totalCost: formItems.reduce(
        (acc, item) => acc + Number(item.cost) + Number(item.laborCost),
        0
      ),
    }));
  }, [formItems]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-900 rounded-lg w-full max-h-[90vh] overflow-y-auto p-6 mb-10"
    >
      <div className="h-full flex flex-col">
        <label htmlFor="description">Descrição do Serviço</label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o serviço a ser realizado"
          className="bg-gray-800 border-gray-700 min-h-[80px] h-full"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="space-y-2 flex flex-col">
          <label htmlFor="type" className="-mb-2">
            Tipo de Serviço
          </label>
          <select
            className="bg-gray-800 border-gray-700 p-2 rounded border"
            value={formData.type}
            name="type"
            onChange={handleChange}
          >
            {(
              Object.keys(serviceTypes) as Array<keyof typeof serviceTypes>
            ).map((type) => (
              <option key={type} value={type}>
                {serviceTypes[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="branch" className="-mb-2">
            Filial
          </label>
          <select
            className="bg-gray-800 border-gray-700 p-2 rounded border"
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
          >
            {branchs.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 flex flex-col">
          <label htmlFor="vehiclePlate" className="-mb-2">
            Veículo
          </label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 p-2 rounded border"
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle.plate} value={vehicle.plate}>
                {vehicle.plate} - {vehicle.brand} {vehicle.model}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="workshopId" className="-mb-2">
            Oficina
          </label>
          <select
            name="workshopId"
            value={formData.workshopId}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 p-2 rounded border"
          >
            {workshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="status" className="-mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 p-2 rounded border"
          >
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="COMPLETED">Concluido</option>
            <option value="CANCELED">Cancelado</option>
          </select>
        </div>
      </div>

      {formItems.map((item, index) => (
        <div
          key={item.id}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-5 space-y-2 flex flex-col">
            <label htmlFor={`desc-${item.id}`} className="-mb-2">
              Descrição do item
            </label>
            <Input
              id={`desc-${item.id}`}
              value={item.description}
              onChange={(e) =>
                handleItemChange(item.id, "description", e.target.value)
              }
              placeholder={`Item ${index + 1}`}
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>

          <div className="md:col-span-3 space-y-2 flex flex-col">
            <label htmlFor={`cost-${item.id}`} className="-mb-2">
              Custo Estimado (R$)
            </label>
            <Input
              id={`cost-${item.id}`}
              value={item.cost}
              onChange={(e) =>
                handleItemChange(item.id, "cost", e.target.value)
              }
              placeholder="0,00"
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>

          <div className="md:col-span-3 space-y-2 flex flex-col">
            <label htmlFor={`labor-${item.id}`} className="-mb-2">
              Mão de Obra (R$)
            </label>
            <Input
              id={`labor-${item.id}`}
              value={item.laborCost}
              onChange={(e) =>
                handleItemChange(item.id, "laborCost", e.target.value)
              }
              placeholder="0,00"
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>

          <div className="md:col-span-1 flex justify-center md:justify-end">
            <button
              type="button"
              onClick={() => handleRemoveItem(item.id)}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar item
        </button>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white p-2 rounded text-sm"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
          onSubmit={onSubmit}
        >
          Salvar Ordem
        </button>
      </div>
    </form>
  );
}

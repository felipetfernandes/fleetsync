import React from 'react'
import Input from './ui/input';

function NewCarForm() {
  return (
    <form className="grid grid-cols-2 gap-4 text">
    <span className="flex flex-col gap-2 text-gray-100">
      Placa
      <Input type="text" placeholder="ABC1234"/>
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Filial
      <Input type="text" placeholder="Porto Alegre" />
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Marca
      <Input type="text" placeholder="Fiat" />
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Modelo
      <Input type="text" placeholder="Palio" />
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Ano de Modelo
      <Input type="text" placeholder="2022" />
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Ano de Fabricação
      <Input type="text" placeholder="2022" />
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Cor
      <Input type="text" placeholder="Preto" />
    </span>
    <span className="flex flex-col gap-1 text-gray-100">
      status
      <select name="status" className="bg-gray-700 text-white p-2 rounded focus:ring-0 focus:outline-none">
        <option value="Ativo">Ativo</option>
        <option value="Manutenção">Manutenção</option>
        <option value="Inativo">Inativo</option>
      </select>
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Renavam
      <Input type="text" placeholder="12345678901" />
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Chassi
      <Input type="text" placeholder="12345678901234567" />
    </span>
    <span className="flex flex-col gap-2 text-gray-100">
      Motorista
      <Input type="text" placeholder="Fernanda Alves" />
    </span>
    </form>
  )
}

export default NewCarForm;
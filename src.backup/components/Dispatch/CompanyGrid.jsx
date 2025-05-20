import React from 'react'
export default function CompanyGrid({ onSelect }) {
  const companies = Array.from({length:9},(_,i)=>`기업 ${i+1}`)
  return (
    <div className="grid grid-cols-3 gap-2">
      {companies.map(name => (
        <div
          key={name}
          className="p-3 bg-gray-100 rounded text-center cursor-pointer hover:bg-gray-200"
          onClick={()=>onSelect(name)}
        >
          {name}
        </div>
      ))}
    </div>
  )
}
import React from 'react'
export default function TabNav({ tabs, active, onChange }) {
  return (
    <div className="flex space-x-4 border-b">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-2 ${
            active===tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
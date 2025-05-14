import React from 'react'
import DispatchHome from './DispatchHome'

export default function PhoneFrame() {
  console.log('📱 PhoneFrame 렌더됨')
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
      <div className="relative w-72 h-[600px] bg-black rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-xl" />
        <div className="absolute inset-3 bg-yellow-50 rounded-2xl overflow-auto">
          <DispatchHome />
        </div>
      </div>
    </div>
  )
}
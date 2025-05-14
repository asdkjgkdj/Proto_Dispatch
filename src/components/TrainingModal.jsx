// src/components/TrainingModal.jsx
import React from 'react'
import { Button } from './ui/button'

export default function TrainingModal({ building, onClose }) {
  // building: { key, label, img, stamina, ... }
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-60 p-4 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* 뒤로 가기 버튼 */}
        <button
          className="absolute top-2 left-2 text-lg"
          onClick={onClose}
        >←</button>

        {/* 타이틀 */}
        <h2 className="text-center font-bold text-lg mb-4">
          {building.label} 훈련
        </h2>

        {/* 일러스트 */}
        <div className="flex justify-center mb-4">
          <img
            src={building.img}
            alt={building.label}
            className="w-24 h-24 object-contain animate-pulse"
          />
        </div>

        {/* 리소스 표시(예시) */}
        <div className="flex justify-center space-x-2 mb-4">
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
            <img src="/images/gem_icon.png" alt="gem" className="w-4 h-4 mr-1" />
            <span>100</span>
          </div>
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
            <img src="/images/stamina_icon.png" alt="stamina" className="w-4 h-4 mr-1" />
            <span>10</span>
          </div>
        </div>

        {/* 훈련 컨트롤 */}
        <div className="mb-4">
          <label className="block mb-1">시간</label>
          <input
            type="range"
            min="10"
            max="120"
            defaultValue="30"
            className="w-full"
          />
        </div>

        {/* 액션 버튼 */}
        <div className="flex space-x-2">
          <Button className="flex-1">즉시 완료</Button>
          <Button className="flex-1 bg-blue-500 text-white">훈련 시작</Button>
        </div>
      </div>
    </div>
  )
}
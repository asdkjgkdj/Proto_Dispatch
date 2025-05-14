// src/components/TrainingView.jsx
import React from 'react'
import { Button } from './ui/button'

export default function TrainingView({ building, onBack }) {
  const TRAIN_TIME = 30

  return (
    <div className="relative w-full h-full flex flex-col bg-blue-500 text-white">
      {/* 1. 헤더: 뒤로가기 + 리소스 바 */}
      <header className="flex items-center justify-between px-3 py-2">
        <button onClick={onBack} className="w-6 h-6 bg-green-400 rounded-full">
          ←
        </button>
        <div className="flex space-x-2">
          <div className="flex items-center bg-white/25 px-2 py-1 rounded-full">
            <img src="/images/gem_icon.png" alt="gem" className="w-4 h-4 mr-1" />
            <span>100</span>
          </div>
          <div className="flex items-center bg-white/25 px-2 py-1 rounded-full">
            <img src="/images/stamina_icon.png" alt="stamina" className="w-4 h-4 mr-1" />
            <span>10</span>
          </div>
        </div>
      </header>

      {/* 2. 타이틀 */}
      <h2 className="mt-2 text-center text-lg font-bold">
        베테랑 {building.label}
      </h2>

      {/* 3. 고양이 이미지 */}
      <div className="flex-1 flex items-center justify-center px-2">
        <img
          src={`/images/cats/${building.key}.png`}
          alt={`${building.label} 고양이`}
          className="max-h-40 object-contain"
        />
      </div>

      {/* 4. 하단 컨트롤 */}
      <div className="bg-white flex flex-col px-3 py-2">
        {/* 4.1 아이템 리스트 */}
        <div className="flex space-x-1 overflow-x-auto pb-1">
          {Array.from({ length: 8 }).map((_, idx) => (
            <img
              key={idx}
              src={`/images/items/item${idx + 1}.png`}
              className="flex-none w-10 h-10 rounded-md bg-gray-200"
            />
          ))}
        </div>

        {/* 4.2 슬라이더 */}
        <div className="flex items-center space-x-1 my-2">
          <button className="w-6 h-6 bg-gray-300 rounded-full">−</button>
          <input
            type="range"
            min="10"
            max="120"
            defaultValue={TRAIN_TIME}
            className="flex-1"
          />
          <button className="w-6 h-6 bg-gray-300 rounded-full">＋</button>
          <span className="w-10 text-right text-sm">{TRAIN_TIME}분</span>
        </div>

        {/* 4.3 액션 버튼 */}
        <div className="flex space-x-2">
          <Button className="flex-1 bg-yellow-400 text-black text-xs">
            즉시 완료
          </Button>
          <Button className="flex-1 bg-blue-600 text-white text-xs">
            훈련 {building.stamina}
          </Button>
        </div>
      </div>
    </div>
  )
}
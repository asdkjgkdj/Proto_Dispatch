// src/components/TrainingView.jsx
import React, { useState } from 'react'
import { Button } from './ui/button'

export default function TrainingView({ building, onBack }) {
  // 선택된 레벨 (초기 1)
  const [selectedLevel, setSelectedLevel] = useState(1)
  // 훈련할 명수 (초기 1)
  const [count, setCount] = useState(1)

  // 1~5 로마 숫자 매핑
  const ROMAN = ['I','II','III','IV','V']
  // 최대 훈련 명수 = 레벨 × 10
  const maxCount = selectedLevel * 10

  return (
    <div className="relative w-full h-full flex flex-col bg-blue-500 text-white">
      {/* 1. 헤더 */}
      <header className="flex items-center justify-between px-3 py-2">
        <button
          onClick={onBack}
          className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white"
        >
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

      {/* 3. 선택된 레벨 고양이 메인 이미지 */}
      <div className="flex-1 flex items-center justify-center px-2">
        <img
          src={`/images/cats/${building.key}_lvl${selectedLevel}.png`}
          alt={`${building.label} 고양이 레벨 ${selectedLevel}`}
          className="max-h-40 object-contain"
        />
      </div>

      {/* 4. 레벨 선택 & 액션 */}
      <div className="bg-white flex flex-col px-3 py-2 text-black">
        {/* 4.1 레벨 선택 슬라이드 (1~5) */}
        <div className="flex space-x-2 overflow-x-auto mb-4 px-1">
          {ROMAN.map((roman, idx) => {
            const level = idx + 1
            const isActive = selectedLevel === level
            // 오직 레벨1만 클릭 가능
            const clickable = level === 1

            return (
              <div
                key={level}
                onClick={() => clickable && setSelectedLevel(level)}
                className={`
                  flex-none w-12 flex flex-col items-center
                  ${clickable
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50'}
                  ${isActive ? 'ring-2 ring-yellow-500 rounded-md' : ''}
                `}
              >
                <img
                  src={`/images/cats/${building.key}_lvl${level}.png`}
                  alt={`레벨 ${roman}`}
                  className="w-12 h-12 object-contain"
                />
                <span className="mt-1 text-xs font-bold text-gray-700">
                  {roman}
                </span>
              </div>
            )
          })}
        </div>

        {/* 4.1.1 선택 레벨 정보 */}
        <div className="bg-gray-100 rounded-md p-2 mb-4 text-center text-sm">
          <div>파견 능력: <span className="font-bold">{selectedLevel}</span></div>
          <div>1명당 훈련 시간: <span className="font-bold">{selectedLevel}</span>초</div>
        </div>

        {/* 4.2 훈련 명수 조절 슬라이더 */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setCount(c => Math.max(1, c - 1))}
            className="w-6 h-6 bg-gray-300 rounded-full"
          >
            −
          </button>
          <input
            type="range"
            min="1"
            max={maxCount}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="flex-1"
          />
          <button
            onClick={() => setCount(c => Math.min(maxCount, c + 1))}
            className="w-6 h-6 bg-gray-300 rounded-full"
          >
            ＋
          </button>
          <span className="w-10 text-right text-sm">{count}</span>
        </div>

        {/* 4.3 액션 버튼 */}
        <div className="flex space-x-2">
          <Button className="flex-1 bg-yellow-400 text-black text-xs">
            즉시 완료
          </Button>
          <Button className="flex-1 bg-blue-600 text-white text-xs">
            훈련 {count * selectedLevel}
          </Button>
        </div>
      </div>
    </div>
  )
}
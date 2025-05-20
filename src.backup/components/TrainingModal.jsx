
import { asset } from '../utils/asset'

<img src={asset('images/dispatch_center.png')} alt="dispatch" />
// src/components/TrainingModal.jsx
import React from 'react'
import { Button } from './ui/button'

// training 관련 상수
const TRAIN_TIME = 30  // 기본 30분

export default function TrainingModal({ building, onClose }) {
  // building.key, building.label, building.img 를 Props로 받습니다
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex flex-col"
      onClick={onClose}
    >
      {/* 1. 뒤로가기 + 리소스 바 */}
      <header
        className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="w-8 h-8 bg-green-400 rounded-full">
          ←
        </button>
        <div className="flex space-x-4">
          <div className="flex items-center bg-white/25 px-2 py-1 rounded-full">
            <img src="/images/gem_icon.png" alt="gem" className="w-5 h-5 mr-1" />
            <span>100</span>
          </div>
          <div className="flex items-center bg-white/25 px-2 py-1 rounded-full">
            <img src="/images/stamina_icon.png" alt="stamina" className="w-5 h-5 mr-1" />
            <span>10</span>
          </div>
        </div>
      </header>

      {/* 2. 타이틀 */}
      <h2 className="mt-4 text-center text-xl font-bold text-white">
        베테랑 {building.label}
      </h2>

      {/* 3. 중앙 고양이 이미지 */}
      <div className="flex-1 flex items-center justify-center mt-4 px-4">
        <img
          src={`/images/cats/${building.key}.png`}
          alt={`${building.label} 고양이`}
          className="max-h-48 object-contain"
        />
      </div>

      {/* 4. 하단 컨트롤: 아이템 리스트, 슬라이더, 버튼 */}
      <div
        className="bg-white rounded-t-3xl p-4 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* 4.1 아이템 리스트 (가로 스크롤) */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="flex-none w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              {/* 예시 아이콘 */}
              <img src={`/images/items/item${idx + 1}.png`} alt="" className="w-10 h-10" />
            </div>
          ))}
        </div>

        {/* 4.2 슬라이더 컨트롤 */}
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 bg-gray-300 rounded-full">−</button>
          <input
            type="range"
            min="10"
            max="120"
            defaultValue={TRAIN_TIME}
            className="flex-1"
          />
          <button className="w-8 h-8 bg-gray-300 rounded-full">＋</button>
          <span className="w-12 text-center">{TRAIN_TIME}분</span>
        </div>

        {/* 4.3 액션 버튼 */}
        <div className="flex space-x-2">
          <Button className="flex-1 bg-yellow-400 text-black">
            즉시 완료
          </Button>
          <Button className="flex-1 bg-blue-600 text-white">
            훈련 {building.stamina}
          </Button>
        </div>
      </div>
    </div>
  )
}


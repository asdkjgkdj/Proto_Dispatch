// src/components/DispatchMissionView.jsx
import React, { useState } from 'react'
import { Button } from './ui/button'

export default function DispatchMissionView({
  params,             // { key, name, stars, roles, power, stone, piece, staminaNeed }
  availableStamina,
  onBack,
}) {
  const MAX_CAPACITY = 100
  const [sendCount, setSendCount] = useState(1)

  const handleSlider = e => {
    setSendCount(Number(e.target.value))
  }

  const startDispatch = () => {
    if (availableStamina < params.staminaNeed) {
      alert('스태미너가 부족합니다.')
      return
    }
    alert(`"${params.name}"에 ${sendCount}명 파견 시작!`)
    onBack()
  }

  return (
    <div className="relative w-full h-full bg-yellow-50 flex flex-col p-3">
      {/* 1. 헤더 */}
      <header className="flex items-center justify-between mb-3">
        <Button onClick={onBack} className="px-3 py-1">← 뒤로</Button>
        <div className="flex items-center bg-white px-2 py-1 rounded-full">
          <img src="/images/stamina_icon.png" alt="stamina" className="w-4 h-4 mr-1"/>
          <span className="font-medium">{availableStamina}</span>
        </div>
      </header>

      {/* 2. 파견 능력 정보 */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-center">
        <div className="bg-blue-600 text-white p-2 rounded">
          <div className="text-sm">내 파견 능력</div>
          <div className="text-2xl font-bold">{availableStamina}</div>
          <div className="text-xs text-white/80">(0/{MAX_CAPACITY})</div>
        </div>
        <div className="bg-blue-600 text-white p-2 rounded">
          <div className="text-sm">필요 능력</div>
          <div className="text-2xl font-bold text-red-300">{params.power}</div>
        </div>
      </div>

      {/* 3. CEO 슬롯 3개 */}
      <div className="flex justify-around mb-4">
        {[1,2,3].map(i => (
          <button
            key={i}
            className="w-1/3 h-12 bg-blue-400 text-white text-2xl rounded"
          >
            +
          </button>
        ))}
      </div>

      {/* 4. 보유 인력 리스트 (예시) */}
      <div className="flex-1 overflow-auto space-y-2 mb-3">
        <div className="flex items-center bg-white p-2 rounded shadow">
          <img src="/images/cats/tech.png" alt="인력" className="w-8 h-8 mr-2"/>
          <div className="flex-1 text-sm">베테랑 기술지원</div>
          <div className="text-xs text-gray-600">{sendCount}/757</div>
        </div>
        <div className="flex items-center bg-white p-2 rounded shadow">
          <img src="/images/cats/guard.png" alt="인력" className="w-8 h-8 mr-2"/>
          <div className="flex-1 text-sm">일반 현장보호</div>
          <div className="text-xs text-gray-600">{sendCount}/1426</div>
        </div>
        {/* 필요하면 map 으로 실제 trained 리스트를 렌더링 */}
      </div>

      {/* 5. 파견 인원 슬라이더 */}
      <div className="mb-3">
        <input
          type="range"
          min="1"
          max={MAX_CAPACITY}
          value={sendCount}
          onChange={handleSlider}
          className="w-full"
        />
        <div className="text-right text-sm mt-1">
          선택 인원: {sendCount} / {MAX_CAPACITY}
        </div>
      </div>

      {/* 6. 파견 버튼 */}
      <Button
        className="w-full bg-green-500 text-white font-bold py-2"
        onClick={startDispatch}
      >
        파견 ({params.staminaNeed} 스태미너)
      </Button>
    </div>
  )
}
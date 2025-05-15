// src/components/DispatchMissionView.jsx
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'

export default function DispatchMissionView({
  params,              // { key, name, power, staminaNeed, roles, … }
  availableStamina,
  trainedWorkers = [], // [{ key, label, count }]
  onBack
}) {
  const { name, power: needPower, staminaNeed, roles } = params

  // 필터된 일꾼 목록: trainedWorkers 중 label에 roles 문자열 포함된 것만
  const candidates = trainedWorkers.filter(w =>
    roles.some(role => w.label.includes(role))
  )

  // 각 일꾼별 선택 수
  const [selections, setSelections] = useState(
    candidates.map(w => ({ key: w.key, count: 0 }))
  )

  // 선택 파워 합산
  const [selectedPower, setSelectedPower] = useState(0)
  useEffect(() => {
    let sum = 0
    candidates.forEach(w => {
      const sel = selections.find(s => s.key === w.key)?.count || 0
      // 여기서는 1명당 파견능력 = 1로 가정
      sum += sel
    })
    setSelectedPower(sum)
  }, [selections])

  const onSlide = (key, val) => {
    setSelections(sel =>
      sel.map(s =>
        s.key === key ? { ...s, count: Number(val) } : s
      )
    )
  }

  const canDispatch =
    selectedPower >= needPower && availableStamina >= staminaNeed

  return (
    <div className="relative w-full h-full bg-yellow-50 flex flex-col p-3">
      {/* 헤더 */}
      <header className="flex items-center justify-between mb-3">
        <Button onClick={onBack} className="px-3 py-1">
          ← 뒤로
        </Button>
        <div className="flex items-center bg-white px-2 py-1 rounded-full">
          <img
            src="/images/stamina_icon.png"
            alt="stamina"
            className="w-4 h-4 mr-1"
          />
          <span>{availableStamina}</span>
        </div>
      </header>

      {/* 파견 능력 비교 */}
      <div className="grid grid-cols-2 gap-2 text-center mb-2">
        <div>
          <div className="text-sm">현재 파견 능력</div>
          <div className="text-lg font-bold">{selectedPower}</div>
        </div>
        <div>
          <div className="text-sm">필요 능력</div>
          <div className="text-lg font-bold">{needPower}</div>
        </div>
      </div>
      <div className="text-center mb-3">
        {canDispatch
          ? <span className="text-blue-500">파견이 가능합니다.</span>
          : <span className="text-red-500">파견이 불가능합니다.</span>
        }
      </div>

      {/* 추천 직종 안내 */}
      <div className="mb-2 text-sm">
        <span className="font-medium">추천 직종: </span>
        {roles.join(', ')}
      </div>

      {/* 후보 일꾼 리스트 */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {candidates.map(worker => {
          const own = worker.count
          const sel = selections.find(s => s.key === worker.key)?.count || 0
          return (
            <div
              key={worker.key}
              className="bg-white p-2 rounded shadow flex flex-col"
            >
              <div className="flex items-center mb-1">
                <img
                  src={`/images/cats/${worker.key}_lvl1.png`}
                  alt={worker.label}
                  className="w-8 h-8 mr-2"
                />
                <span className="font-medium">{worker.label}</span>
                <span className="ml-auto text-sm text-gray-600">
                  {sel}/{own}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={own}
                value={sel}
                onChange={e => onSlide(worker.key, e.target.value)}
                className="w-full"
              />
            </div>
          )
        })}
        {candidates.length === 0 && (
          <div className="text-center text-gray-500">
            추천된 직종의 일꾼이 없습니다.
          </div>
        )}
      </div>

      {/* 파견 버튼 */}
      <Button
        className={`w-full py-2 font-bold ${
          canDispatch ? 'bg-green-500' : 'bg-gray-300'
        }`}
        disabled={!canDispatch}
        onClick={() => alert('파견을 시작합니다!')}
      >
        파견 ({staminaNeed}⚡)
      </Button>
    </div>
  )
}
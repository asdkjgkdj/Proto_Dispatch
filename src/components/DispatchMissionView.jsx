// src/components/DispatchMissionView.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'

export default function DispatchMissionView({
  params,              // DispatchListView 에서 넘겨준 { key, name, power, staminaNeed, … }
  availableStamina,    // 남은 스태미너
  trainedWorkers = [], // PhoneFrame 에서 누적된 [{ key, label, count }]
  onBack
}) {
  // mission 파라미터 예: params.power, params.staminaNeed
  const { name, power: needPower, staminaNeed } = params

  // 총 선택된 파견 능력
  const [selectedPower, setSelectedPower] = useState(0)

  // 각 일꾼별 “선택할 인원수” 상태
  const [selections, setSelections] = useState(
    trainedWorkers.map(w => ({ key: w.key, count: 0 }))
  )

  // 슬라이더 움직일 때마다 selectedPower 재계산
  useEffect(() => {
    let sum = 0
    trainedWorkers.forEach(w => {
      const sel = selections.find(s => s.key === w.key)?.count || 0
      // each worker 의 파견능력은 w.key 에 따라 1레벨 기준 == 1
      // (필요하면 trainedWorkers 에 실제 level 필드를 추가)
      sum += sel * params.powerPerUnit /* 예: 1마리당 파워 */ || sel
    })
    setSelectedPower(sum)
  }, [selections])

  const onSlide = (key, val) => {
    setSelections(sel =>
      sel.map(s =>
        s.key === key
          ? { ...s, count: Number(val) }
          : s
      )
    )
  }

  const canDispatch = selectedPower >= needPower && availableStamina >= staminaNeed

  return (
    <div className="relative w-full h-full bg-yellow-50 flex flex-col p-3">
      {/* 헤더 */}
      <header className="flex items-center justify-between mb-3">
        <Button onClick={onBack} className="px-3 py-1">← 뒤로</Button>
        <div className="flex space-x-2">
          <div className="flex items-center bg-white px-2 py-1 rounded-full">
            <img src="/images/stamina_icon.png" alt="stamina" className="w-4 h-4 mr-1" />
            <span>{availableStamina}</span>
          </div>
        </div>
      </header>

      {/* 능력 비교 */}
      <div className="grid grid-cols-2 gap-2 text-center mb-1">
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

      {/* 일꾼 리스트 */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {trainedWorkers.map(worker => {
          const own = worker.count
          const sel = selections.find(s => s.key === worker.key)?.count || 0
          return (
            <div key={worker.key} className="bg-white p-2 rounded shadow">
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
      </div>

      {/* 파견 버튼 */}
      <div className="flex space-x-2">
        <Button
          className={`flex-1 py-2 font-bold ${canDispatch ? 'bg-green-500' : 'bg-gray-300'}`}
          disabled={!canDispatch}
          onClick={() => alert('파견 시작!')}
        >
          파견 ({staminaNeed}⚡)
        </Button>
      </div>
    </div>
  )
}
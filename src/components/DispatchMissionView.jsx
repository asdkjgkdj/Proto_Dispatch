// src/components/DispatchMissionView.jsx
import React, { useState } from 'react'
import { Button } from './ui/button'
import Toast from './ui/Toast'

export default function DispatchMissionView({
  params,              // { key, name, power, staminaNeed, roles, … }
  availableStamina,
  trainedWorkers = [], // [{ key, label, count }]
  onBack
}) {
  const { name, power: needPower, staminaNeed, roles } = params

  // 파견소 레벨에 따른 최대 파견 수 (레벨1→10명)
  const dispatchCenterLevel = 1
  const maxDispatch = dispatchCenterLevel * 10

  // 추천된 직종에 해당하는 훈련된 일꾼만 필터
  const candidates = trainedWorkers.filter(w =>
    roles.some(role => w.label.includes(role))
  )

  // 각 일꾼별 선택 수 state 초기화
  const [selections, setSelections] = useState(
    candidates.map(w => ({ key: w.key, count: 0 }))
  )

  // 전체 선택 인원 합계
  const totalSelected = selections.reduce((sum, s) => sum + s.count, 0)
  // 1명당 능력치 1로 가정
  const selectedPower = totalSelected

  // 파견 가능 여부
  const canDispatch =
    selectedPower >= needPower &&
    availableStamina >= staminaNeed &&
    totalSelected > 0 &&
    totalSelected <= maxDispatch

  // toast 메시지
  const [toastMessage, setToastMessage] = useState('')

  // helper: key → 소유 인원 수
  const findWorkerCount = key =>
    candidates.find(w => w.key === key)?.count || 0

  // 슬라이더 이벤트 핸들러
  const onSlide = (workerKey, newVal) => {
    const val = Number(newVal)
    const own = findWorkerCount(workerKey)
    const current = selections.find(s => s.key === workerKey)?.count || 0
    const remainingCapacity = maxDispatch - (totalSelected - current)
    const maxForThis = Math.min(own, remainingCapacity)

    if (val > maxForThis) {
      setToastMessage('최대 인원입니다.')
      setTimeout(() => setToastMessage(''), 3000)
      return
    }

    setSelections(selections.map(s =>
      s.key === workerKey ? { ...s, count: val } : s
    ))
  }

  // 슬라이더 다운 시 터치/포인터 위치 체크
  const onPointerDown = (e, workerKey) => {
    const input = e.currentTarget
    const rect = input.getBoundingClientRect()
    const own = findWorkerCount(workerKey)
    const current = selections.find(s => s.key === workerKey)?.count || 0
    const remainingCapacity = maxDispatch - (totalSelected - current)
    const maxForThis = Math.min(own, remainingCapacity)
    const allowedPx = rect.left + (maxForThis / maxDispatch) * rect.width
    const clientX = e.clientX || (e.touches && e.touches[0].clientX)
    if (clientX > allowedPx) {
      e.preventDefault()
      setToastMessage('최대 인원입니다.')
      setTimeout(() => setToastMessage(''), 3000)
    }
  }

  return (
    <div className="relative w-full h-full bg-yellow-50 flex flex-col p-4">
      {/* 1. 헤더 */}
      <header className="flex items-center justify-between mb-4">
        <Button onClick={onBack} className="px-3 py-1">← 뒤로</Button>
        <div className="flex items-center bg-white px-2 py-1 rounded-full">
          <img src="/images/stamina_icon.png" alt="stamina" className="w-4 h-4 mr-1" />
          <span>{availableStamina}</span>
        </div>
      </header>

      {/* 2. 능력치 비교 + 카운터 */}
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
      <div className="text-center mb-2 text-sm text-gray-700">
        ({totalSelected} / {maxDispatch}명)
      </div>
      <div className="text-center mb-4">
        {canDispatch
          ? <span className="text-blue-500">파견이 가능합니다.</span>
          : <span className="text-red-500">파견이 불가능합니다.</span>
        }
      </div>

      {/* 3. 추천 직종 */}
      <div className="mb-4 text-sm">
        <span className="font-medium">추천 직종: </span>
        {roles.join(', ')}
      </div>

      {/* 4. 후보 일꾼 리스트 */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {candidates.length > 0
          ? candidates.map(w => {
              const sel = selections.find(s => s.key === w.key)?.count || 0
              return (
                <div
                  key={w.key}
                  className="bg-white p-2 rounded shadow flex flex-col"
                >
                  <div className="flex items-center mb-1">
                    <img
                      src={`/images/cats/${w.key}_lvl1.png`}
                      alt={w.label}
                      className="w-8 h-8 mr-2"
                    />
                    <span className="font-medium">{w.label}</span>
                    <span className="ml-auto text-sm text-gray-600">
                      {sel}/{w.count}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={w.count}             // full owns
                    value={sel}
                    onChange={e => onSlide(w.key, e.target.value)}
                    onPointerDown={e => onPointerDown(e, w.key)}
                    onTouchStart={e => onPointerDown(e, w.key)}
                  />
                </div>
              )
            })
          : (
            <div className="text-center text-gray-500">
              추천된 직종의 일꾼이 없습니다.
            </div>
          )
        }
      </div>

      {/* 5. 파견 버튼 */}
      <Button
        className={`w-full py-2 font-bold ${
          canDispatch ? 'bg-green-500' : 'bg-gray-300'
        }`}
        disabled={!canDispatch}
        onClick={() => alert('파견을 시작합니다!')}
      >
        파견 ({staminaNeed}⚡)
      </Button>

      {/* 6. 토스트 */}
      {toastMessage && <Toast>{toastMessage}</Toast>}
    </div>
  )
}
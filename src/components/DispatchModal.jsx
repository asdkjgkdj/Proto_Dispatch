// src/components/TrainingView.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Toast from './ui/Toast'

export default function TrainingView({
  building,
  availableStamina,
  onConsumeStamina,
  onBack,
  onRechargeOpen,
+ onTrain,                // ← 추가
}) {
  const ROMAN = ['I','II','III','IV','V']
  const MAX_LEVEL = 5

  const [level, setLevel]         = useState(1)
  const [count, setCount]         = useState(1)
  const [isTraining, setIsTraining] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [toastMessage, setToastMessage] = useState('')
  const timerRef = useRef(null)

  const staminaCost   = 10
  const gemCost       = level * count
  const totalSeconds  = level * count
  const maxCount      = level * 10

  const startTraining = () => {
    if (availableStamina < staminaCost) {
      setToastMessage('스태미너가 부족합니다.')
      setTimeout(() => setToastMessage(''), 1000)
      return
    }
    onConsumeStamina(staminaCost)
    setRemaining(totalSeconds)
    setIsTraining(true)
  }

  // ─── 카운트다운 ─────────────────────────────────────────────
  useEffect(() => {
    if (!isTraining) return
    timerRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(timerRef.current)
          setIsTraining(false)
          setToastMessage('훈련이 완료되었습니다.')
          setTimeout(() => setToastMessage(''), 1000)
+         // 훈련 완료 시 onTrain 호출
+         onTrain(level, count)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [isTraining, level, count, onTrain])

  return (
    <div className="relative w-full h-full flex flex-col bg-blue-500 text-white">
      {/* 1. 헤더 */}
      <header className="flex items-center justify-between px-3 py-2">
        <button
          onClick={onBack}
          className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white"
        >←</button>
        <div className="flex space-x-2">
          <div className="flex items-center bg-white/25 px-2 py-1 rounded-full">
            <img src="/images/gem_icon.png" alt="gem" className="w-4 h-4 mr-1" />
            <span>100</span>
          </div>
          <button
            onClick={onRechargeOpen}
            className="flex items-center bg-white/25 px-2 py-1 rounded-full"
          >
            <img src="/images/stamina_icon.png" alt="stamina" className="w-4 h-4 mr-1" />
            <span>{availableStamina}</span>
          </button>
        </div>
      </header>

      {/* 2. 타이틀 */}
      <h2 className="mt-2 text-center text-lg font-bold">
        베테랑 {building.label}
      </h2>

      {/* 3. 고양이 이미지 */}
      <div className="flex-1 flex items-center justify-center px-2">
        <img
          src={`/images/cats/${building.key}_lvl${level}.png`}
          alt={`${building.label} 고양이`}
          className="max-h-40 object-contain"
        />
      </div>

      {/* 4. 컨텐츠 */}
      {isTraining ? (
        // ─── 훈련 중 화면 ───────────────────────────────────────
        <div className="bg-white flex flex-col px-3 py-2 text-black">
          {/* 4.1 진행 게이지 */}
          <div className="mb-2">
            <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-green-400 transition-[width] duration-1000"
                style={{ width: `${(remaining / totalSeconds) * 100}%` }}
              />
            </div>
          </div>
          {/* 4.2 남은 시간 */}
          <div className="flex justify-end mb-1 font-mono">
            {String(remaining).padStart(2, '0')}s
          </div>
          {/* 4.3 “양성중” 설명 */}
          <div className="text-center text-sm mb-3">
            <img
              src={`/images/cats/${building.key}_lvl${level}.png`}
              alt=""
              className="inline w-6 h-6 mr-1 align-middle"
            />
            {`베테랑 ${building.label} ${count}마리 양성중입니다.`}
          </div>
          {/* 4.4 즉시완료 + 가속 */}
          <div className="flex space-x-2">
            <Button className="flex-1 bg-yellow-400 text-black text-xs">
              즉시 완료 <img src="/images/gem_icon.png" className="inline w-3 h-3 ml-1" />{gemCost}
            </Button>
            <Button className="flex-1 bg-blue-600 text-white text-xs">
              가속 <img src="/images/gem_icon.png" className="inline w-3 h-3 ml-1" />{gemCost}
            </Button>
          </div>
        </div>
      ) : (
        // ─── 훈련 전 화면 ───────────────────────────────────────
        <div className="bg-white flex flex-col px-3 py-2 text-black">
          {/* 레벨 선택 */}
          <div className="flex space-x-2 overflow-x-auto mb-4 px-1">
            {ROMAN.map((roman, idx) => {
              const lv = idx + 1
              const active = lv === level
              const clickable = lv === 1  // 현재는 레벨1만 가능
              return (
                <div
                  key={lv}
                  onClick={() => clickable && setLevel(lv)}
                  className={`
                    flex-none w-12 flex flex-col items-center
                    ${clickable ? 'cursor-pointer' : 'opacity-50'}
                    ${active ? 'ring-2 ring-yellow-500 rounded-md' : ''}
                  `}
                >
                  <img
                    src={`/images/cats/${building.key}_lvl${lv}.png`}
                    alt=""
                    className="w-12 h-12 object-contain"
                  />
                  <span className="mt-1 text-xs font-bold text-gray-700">
                    {roman}
                  </span>
                </div>
              )
            })}
          </div>

          {/* 레벨 정보 */}
          <div className="bg-gray-100 rounded-md p-2 mb-4 text-center text-sm">
            <div>파견 능력: <strong>{level}</strong></div>
            <div>1명당 훈련 시간: <strong>{level}</strong>초</div>
          </div>

          {/* 명수 조절 */}
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => setCount(c => Math.max(1, c - 1))}
              className="w-6 h-6 bg-gray-300 rounded-full"
            >−</button>
            <input
              type="range"
              min="1"
              max={maxCount}
              value={count}
              onChange={e => setCount(+e.target.value)}
              className="flex-1"
            />
            <button
              onClick={() => setCount(c => Math.min(maxCount, c + 1))}
              className="w-6 h-6 bg-gray-300 rounded-full"
            >＋</button>
            <span className="w-10 text-right text-sm">{count}</span>
          </div>

          {/* 총 시간 */}
          <div className="flex items-center justify-end mb-2 text-sm text-gray-700">
            <img src="/images/Time_Icon.png" alt="time" className="w-4 h-4 mr-1" />
            <span>{totalSeconds}초</span>
          </div>

          {/* 액션 버튼 */}
          <div className="flex space-x-2">
            <Button className="flex-1 bg-yellow-400 text-black text-xs">
              즉시 완료 <img src="/images/gem_icon.png" className="inline w-3 h-3 ml-1" />{gemCost}
            </Button>
            <Button
              className="flex-1 bg-blue-600 text-white text-xs"
              onClick={startTraining}
            >
              훈련 <img src="/images/stamina_icon.png" className="inline w-3 h-3 ml-1" />{staminaCost}
            </Button>
          </div>
        </div>
      )}

      {/* 토스트 */}
      {toastMessage && <Toast>{toastMessage}</Toast>}
    </div>
  )
}
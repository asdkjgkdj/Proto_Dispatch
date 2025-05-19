import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import Toast from './ui/Toast'

// 추천 직종
const ROLES = ['기술지원', '자원운영', '현장보호']

// 9개 회사 + stars 난이도
const COMPANIES = [
  { key: 1, name: '알파테크',     stars: 1 },
  { key: 2, name: '브라보엔터',   stars: 1 },
  { key: 3, name: '찰리파이',     stars: 2 },
  { key: 4, name: '델타시스템',   stars: 1 },
  { key: 5, name: '에코솔루션',   stars: 3 },
  { key: 6, name: '포스코리아',   stars: 1 },
  { key: 7, name: '골드라인',     stars: 2 },
  { key: 8, name: '호텔유니온',   stars: 1 },
  { key: 9, name: '인디고팩토리', stars: 3 },
]

// 난이도★별 파견능력 범위 & 보상 개수
const STAR_CONFIG = {
  1: { range: [1, 10],   stone: 1,  piece: 1 },
  2: { range: [11, 30],  stone: 5,  piece: 5 },
  3: { range: [31, 50],  stone: 10, piece: 10 },
}

export default function DispatchListView({
  onBack,
  availableStamina,
  gems,
  onRefresh,
  onDispatchStart,       // PhoneFrame → handleListSelect
  dispatchedCompanies,   // [{ key, remaining, stone, piece }]
  onCollectReward,       // PhoneFrame → handleCollectReward
}) {
  // 상세 팝업
  const [selected, setSelected] = useState(null)
  const [detail, setDetail]     = useState(null)

  // 내부 타이머 복사
  const [timers, setTimers] = useState(dispatchedCompanies)
  useEffect(() => setTimers(dispatchedCompanies), [dispatchedCompanies])

  // 1초마다 감소
  useEffect(() => {
    const id = setInterval(() => {
      setTimers(t =>
        t.map(x => ({ ...x, remaining: Math.max(0, x.remaining - 1) }))
      )
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // 보상 팝업 타겟
  const [rewardTarget, setRewardTarget] = useState(null)

  // 토스트
  const [toast, setToast] = useState('')
  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  function openDetail(comp) {
    const roles = ROLES
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random()*3) + 1)
    const cfg = STAR_CONFIG[comp.stars]
    const [min, max] = cfg.range
    const power = Math.floor(Math.random() * (max - min + 1)) + min

    setSelected(comp)
    setDetail({
      roles,
      power,
      stone: cfg.stone,
      piece: cfg.piece,
      staminaNeed: 10,
      stars: comp.stars,
    })
  }

  function dispatch() {
    onDispatchStart({ ...selected, ...detail })
    setSelected(null)
  }

  function openReward(key) {
    const t = timers.find(x => x.key === key)
    if (t?.remaining === 0) {
      setRewardTarget(t)
    }
  }

  function collectReward() {
    showToast('보상을 획득했습니다.')
    onCollectReward(rewardTarget.key)
    setRewardTarget(null)
  }

  return (
    <div className="relative w-full h-full bg-yellow-50 flex flex-col p-3">
      {/* 1. 헤더 */}
      <header className="flex items-center justify-between mb-3">
        <Button onClick={onBack} className="px-3 py-1">← 뒤로</Button>
        <div className="flex space-x-2">
          <div className="flex items-center bg-white px-2 py-1 rounded-full">
            <img src="/images/gem_icon.png" alt="gem" className="w-4 h-4 mr-1"/>
            <span className="font-medium">{gems}</span>
          </div>
          <div className="flex items-center bg-white px-2 py-1 rounded-full">
            <img src="/images/stamina_icon.png" alt="stamina" className="w-4 h-4 mr-1"/>
            <span className="font-medium">{availableStamina}</span>
          </div>
        </div>
      </header>

      {/* 2. 그리드 */}
      <div className="grid grid-cols-3 gap-3 flex-1 overflow-auto mb-3">
        {COMPANIES.map(c => {
          const t = timers.find(x => x.key === c.key)
          const rem = t?.remaining ?? 0
          const isDispatched = !!t      // true if ever dispatched
           const isInProgress = rem > 0  // true while remaining>0


          return (
            <div
              key={c.key}
              onClick={() => {
                if (!isDispatched) openDetail(c)
                else if (rem === 0) openReward(c.key)
              }}
              className={`
                       bg-white p-3 rounded shadow flex flex-col items-center
                       ${isInProgress
                         ? 'opacity-50 cursor-not-allowed'       // dispatch 중인 경우만
                         : 'cursor-pointer hover:shadow-lg'}     // 완료된 칸도 활성화된 스타일
                     `}
            >
              <div className="font-medium">{c.name}</div>
              <div className="mt-1">
                {Array.from({ length: c.stars }).map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xl">★</span>
                ))}
              </div>
              {isDispatched && (
                <>
                  <div className="mt-2 text-sm text-red-500">
                    {rem > 0 ? '파견중' : '파견 완료'}
                  </div>
                  {rem > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      남은 시간: {rem}s
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* 3. 새로고침 */}
      <div className="mb-2">
        <Button
          onClick={onRefresh}
          className="w-full bg-pink-500 text-white py-2"
        >새로고침 (10젬)</Button>
      </div>

      {/* 4. 상세 팝업 */}
      {selected && detail && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full rounded-lg p-4 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-600"
            >✕</button>
            <h3 className="text-center text-lg font-bold mb-2">
              {selected.name} 파견
            </h3>
            <p className="text-sm mb-2">
              {detail.roles.join(', ')} 직종 필요
            </p>
            <p className="text-sm mb-1">
              필요 파견능력: <span className="font-semibold">{detail.power}</span>
            </p>
            <div className="font-medium mb-1">보상</div>
            <div className="flex justify-around mb-3">
              <div className="flex flex-col items-center bg-gray-100 p-2 rounded">
                <img src="/images/reward/stone.png" className="w-8 h-8 mb-1"/>
                <span>강화석</span>
                <span className="font-semibold">{detail.stone}</span>
              </div>
              <div className="flex flex-col items-center bg-gray-100 p-2 rounded">
                <img src="/images/reward/piece.png" className="w-8 h-8 mb-1"/>
                <span>조각</span>
                <span className="font-semibold">{detail.piece}</span>
              </div>
            </div>
            <p className="text-sm mb-4">
              필요 스태미너: <img src="/images/stamina_icon.png" className="inline w-4 h-4 mr-1"/>
              <span className="font-semibold">{detail.staminaNeed}</span>
            </p>
            <Button
              className="w-full bg-green-400 text-white py-2 flex items-center justify-center"
              onClick={dispatch}
            >
              <img src="/images/stamina_icon.png" className="w-4 h-4 mr-1"/>
              파견 ({detail.staminaNeed})
            </Button>
          </div>
        </div>
      )}

      {/* 5. 보상 팝업 */}
      {rewardTarget && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full rounded-lg p-4 text-center relative">
            <button
              onClick={() => setRewardTarget(null)}
              className="absolute top-2 right-2 text-gray-600"
            >✕</button>
            <h3 className="text-xl font-bold mb-2">
              {COMPANIES.find(c => c.key === rewardTarget.key).name} 파견 완료!
            </h3>
            <p className="mb-4">보상을 획득하세요!</p>
            <div className="flex justify-around mb-4">
              <div className="flex flex-col items-center bg-gray-100 p-2 rounded">
                <img src="/images/reward/stone.png" className="w-8 h-8 mb-1"/>
                <span>강화석</span>
                <span className="font-semibold">{rewardTarget.stone}</span>
              </div>
              <div className="flex flex-col items-center bg-gray-100 p-2 rounded">
                <img src="/images/reward/piece.png" className="w-8 h-8 mb-1"/>
                <span>조각</span>
                <span className="font-semibold">{rewardTarget.piece}</span>
              </div>
            </div>
            <Button
              className="w-full bg-blue-600 text-white py-2"
              onClick={collectReward}
            >보상받기</Button>
          </div>
        </div>
      )}

      {/* 6. Toast */}
      {toast && <Toast>{toast}</Toast>}
    </div>
  )
}
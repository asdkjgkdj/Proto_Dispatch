
import { asset } from '../utils/asset'

<img src={asset('images/dispatch_center.png')} alt="dispatch" />
import React, { useState, useEffect } from 'react'
import DispatchHome        from './DispatchHome.jsx'
import DispatchListView    from './DispatchListView.jsx'
import TrainingView        from './TrainingView.jsx'
import RechargeView        from './RechargeView.jsx'
import DispatchMissionView from './DispatchMissionView.jsx'

// 난이도별 소요시간(초)
const DURATION_SECONDS = { 1: 10, 2: 30, 3: 60 }

export default function PhoneFrame() {
  // 화면 전환 상태
  const [view, setView] = useState({ type: 'home', company: null })

  // 리소스
  const [stamina, setStamina] = useState(10)
  const [gems, setGems]       = useState(100)

  // 훈련된 일꾼
  const [trainedWorkers, setTrainedWorkers] = useState([])

  // 파견 중인 회사 목록: { key, remaining, stone, piece, stars }
  const [dispatched, setDispatched] = useState([])

  // ── 홈 → train / list
  function handleHomeAction(building, action) {
    if (action === 'train') {
      setView({ type: 'train', company: building })
    } else {
      setView({ type: 'list', company: null })
    }
  }

  // ── 리스트 → 상세 파견 화면
  function handleListSelect(company) {
    setView({ type: 'mission', company })
  }

  // ── 미션에서 “파견” 클릭
  function handleDispatchConfirm(m) {
    // m = { key, staminaNeed, stone, piece, stars }
    // 1) 스태미너 차감
    setStamina(s => Math.max(0, s - m.staminaNeed))
    // 2) dispatched 배열 추가
    const sec = DURATION_SECONDS[m.stars] || 0
    setDispatched(arr => [
      ...arr,
      {
        key: m.key,
        remaining: sec,
        stone: m.stone,
        piece: m.piece,
        stars: m.stars
      }
    ])
    // 3) 리스트로 복귀
    setView({ type: 'list', company: null })
  }

  // ── 파견 완료 보상 수령
  function handleCollectReward(key) {
    setDispatched(arr => arr.filter(x => x.key !== key))
  }

  // ── 훈련 완료
  function handleTrain(level, count) {
    setStamina(s => s - 10)
    setTrainedWorkers(ws => {
      const idx = ws.findIndex(w => w.key === view.company.key)
      if (idx >= 0) {
        const up = { ...ws[idx], count: ws[idx].count + count }
        return [...ws.slice(0, idx), up, ...ws.slice(idx+1)]
      }
      return [...ws, { key: view.company.key, label: view.company.label, count }]
    })
  }

  // ── 뒤로가기 (홈)
  function goHome() {
    setView({ type: 'home', company: null })
  }

  // ── 새로고침 (젬 사용)
  function handleRefresh() {
    if (gems < 10) return alert('젬이 부족합니다.')
    setGems(g => g - 10)
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
      <div className="relative w-72 h-[600px] bg-black rounded-3xl overflow-hidden shadow-xl">
        {/* 내부 화면 */}
        <div className="absolute inset-3 bg-yellow-50 rounded-2xl overflow-hidden">
          {view.type === 'home' && (
            <DispatchHome
              onAction={handleHomeAction}
              availableStamina={stamina}
              onRechargeOpen={() => setView({ type: 'recharge' })}
            />
          )}
          {view.type === 'list' && (
            <DispatchListView
              onBack={goHome}
              availableStamina={stamina}
              gems={gems}
              onRefresh={handleRefresh}
              onDispatchStart={handleListSelect}
              dispatchedCompanies={dispatched}
              onCollectReward={handleCollectReward}
            />
          )}
          {view.type === 'train' && (
            <TrainingView
              building={view.company}
              availableStamina={stamina}
              onConsumeStamina={amt => setStamina(s => Math.max(0, s - amt))}
              onBack={goHome}
              onRechargeOpen={() => setView({ type: 'recharge' })}
              onTrain={handleTrain}
            />
          )}
          {view.type === 'recharge' && (
            <RechargeView
              onBack={goHome}
              onRecharge={() => {
                setStamina(100)
                goHome()
              }}
            />
          )}
          {view.type === 'mission' && (
            <DispatchMissionView
              params={view.company}
              availableStamina={stamina}
              trainedWorkers={trainedWorkers}
              onBack={() => setView({ type: 'list', company: null })}
              onDispatchConfirm={handleDispatchConfirm}
            />
          )}
        </div>
      </div>
    </div>
  )
}
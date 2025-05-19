import React, { useState } from 'react'
import DispatchHome        from './DispatchHome.jsx'
import DispatchListView    from './DispatchListView.jsx'
import TrainingView        from './TrainingView.jsx'
import RechargeView        from './RechargeView.jsx'
import DispatchMissionView from './DispatchMissionView.jsx'

// 난이도별 소요시간(초)
const DURATION_SECONDS = { 1: 10, 2: 30, 3: 60 }

export default function PhoneFrame() {
  // 전체 앱 상태
  const [view, setView] = useState({ type: 'home', building: null, company: null })

  // 리소스 상태
  const [stamina, setStamina] = useState(10)
  const [gems, setGems]       = useState(100)

  // 훈련한 일꾼
  const [trainedWorkers, setTrainedWorkers] = useState([])

  // 파견 중인 회사 목록
  // { key, remaining, stone, piece }
  const [dispatchedCompanies, setDispatchedCompanies] = useState([])

  // 홈 → train / list
  function handleHomeAction(building, action) {
    if (action === 'train') {
      setView({ type: 'train', building, company: null })
    } else if (action === 'dispatch') {
      setView({ type: 'list', building: null, company: null })
    }
  }

  // 리스트 → 미션 화면
  function handleListSelect(company) {
    setView({ type: 'mission', building: null, company })
  }

  // 미션 시작: 스태미너 차감하고 dispatchedCompanies 에 추가
  function handleDispatchStart(m) {
    const sec = DURATION_SECONDS[m.stars] || 0
    setStamina(s => Math.max(0, s - m.staminaNeed))
    setDispatchedCompanies(arr => [
      ...arr,
      { key: m.key, remaining: sec, stone: m.stone, piece: m.piece }
    ])
    setView({ type: 'list', building: null, company: null })
  }

  // 보상 수령: 해당 항목 제거
  function handleCollectReward(companyKey) {
    setDispatchedCompanies(arr =>
      arr.filter(x => x.key !== companyKey)
    )
  }

  // 훈련 완료
  function handleTrain(level, count) {
    setStamina(s => s - 10)
    setTrainedWorkers(ws => {
      const idx = ws.findIndex(w => w.key === view.building.key)
      if (idx >= 0) {
        const updated = { ...ws[idx], count: ws[idx].count + count }
        return [...ws.slice(0, idx), updated, ...ws.slice(idx + 1)]
      } else {
        return [...ws, { key: view.building.key, label: view.building.label, count }]
      }
    })
  }

  // 뒤로가기 홈
  function goHome() {
    setView({ type: 'home', building: null, company: null })
  }

  // 새로고침
  function handleRefresh() {
    if (gems < 10) {
      alert('젬이 부족합니다.')
      return
    }
    setGems(g => g - 10)
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
      <div className="relative w-72 h-[600px] bg-black rounded-3xl overflow-hidden shadow-xl">
        {/* 노치 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-xl" />

        {/* 내부 */}
        <div className="absolute inset-3 bg-yellow-50 rounded-2xl overflow-hidden">
          {view.type === 'home' ? (
            <DispatchHome
              onAction={handleHomeAction}
              availableStamina={stamina}
              onRechargeOpen={() => setView({ type: 'recharge' })}
            />
          ) : view.type === 'list' ? (
            <DispatchListView
              onBack={goHome}
              availableStamina={stamina}
              gems={gems}
              onRefresh={handleRefresh}
              onDispatchStart={handleListSelect}
              dispatchedCompanies={dispatchedCompanies}
              onCollectReward={handleCollectReward}
            />
          ) : view.type === 'train' ? (
            <TrainingView
              building={view.building}
              availableStamina={stamina}
              onConsumeStamina={amt => setStamina(s => Math.max(0, s - amt))}
              onBack={goHome}
              onRechargeOpen={() => setView({ type: 'recharge' })}
              onTrain={handleTrain}
            />
          ) : view.type === 'recharge' ? (
            <RechargeView
              onBack={goHome}
              onRecharge={() => {
                setStamina(100)
                goHome()
              }}
            />
          ) : view.type === 'mission' ? (
            <DispatchMissionView
              params={view.company}
              availableStamina={stamina}
              trainedWorkers={trainedWorkers}
              onBack={() => setView({ type: 'list', building: null, company: null })}
              onDispatchConfirm={handleDispatchStart}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
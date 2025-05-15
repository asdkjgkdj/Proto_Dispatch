// src/components/PhoneFrame.jsx
import React, { useState } from 'react'
import DispatchHome        from './DispatchHome.jsx'
import DispatchListView    from './DispatchListView.jsx'
import TrainingView        from './TrainingView.jsx'
import RechargeView        from './RechargeView.jsx'
import DispatchMissionView from './DispatchMissionView.jsx'

export default function PhoneFrame() {
  // 전체 앱 상태: 'home' | 'list' | 'train' | 'recharge' | 'mission'
  const [view, setView] = useState({ type: 'home', building: null, company: null })

  // 리소스 상태
  const [stamina, setStamina] = useState(10)
  const [gems, setGems]       = useState(100)

  // 훈련해서 획득한 일꾼 누적
  const [trainedWorkers, setTrainedWorkers] = useState([])

  // 홈 → train / list
  function handleHomeAction(building, action) {
    if (action === 'train') {
      setView({ type: 'train', building, company: null })
    } else if (action === 'dispatch') {
      setView({ type: 'list', building: null, company: null })
    }
  }

  // 리스트 → 선택된 기업
  function handleListSelect(company) {
    setView({ type: 'mission', building: null, company })
  }

  // 훈련 완료 → trainedWorkers 누적, 스태미너 차감, 홈
  function handleTrain(level, count) {
    // 스태미너 10 고정 차감
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

    // 화면 전환 없이 훈련 화면에 그대로 머무르도록
  }

  // 파견 완료 → 홈
  function handleMissionBack() {
    setView({ type: 'home', building: null, company: null })
  }

  // 뒤로가기(충전 등)
  function goHome() {
    setView({ type: 'home', building: null, company: null })
  }

  // 리스트 새로고침
  function handleRefresh() {
    if (gems < 10) {
      alert('젬이 부족합니다.')
      return
    }
    setGems(g => g - 10)
  }

  // 충전 팝업 열기
  function openRecharge() {
    setView({ type: 'recharge', building: null, company: null })
  }
  // 충전 실행
  function handleRecharge() {
    setStamina(100)
    goHome()
  }

  // TrainingView → 스태미너 소모
  function consumeStamina(amount) {
    setStamina(s => Math.max(0, s - amount))
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
      <div className="relative w-72 h-[600px] bg-black rounded-3xl overflow-hidden shadow-xl">
        {/* 노치 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-xl" />

        {/* 내부 화면 교체 */}
        <div className="absolute inset-3 bg-yellow-50 rounded-2xl overflow-hidden">
          {view.type === 'home' && (
            <DispatchHome
              onAction={handleHomeAction}
              availableStamina={stamina}
              onRechargeOpen={openRecharge}
            />
          )}

          {view.type === 'list' && (
            <DispatchListView
              onBack={goHome}
              availableStamina={stamina}
              gems={gems}
              onRefresh={handleRefresh}
              onDispatchStart={handleListSelect}
              trainedWorkers={trainedWorkers}
            />
          )}

          {view.type === 'train' && (
            <TrainingView
              building={view.building}
              availableStamina={stamina}
              onConsumeStamina={consumeStamina}
              onBack={goHome}
              onRechargeOpen={openRecharge}
              onTrain={handleTrain}
            />
          )}

          {view.type === 'recharge' && (
            <RechargeView
              onBack={goHome}
              onRecharge={handleRecharge}
            />
          )}

          {view.type === 'mission' && (
            <DispatchMissionView
              params={view.company}
              availableStamina={stamina}
              trainedWorkers={trainedWorkers}
              onBack={handleMissionBack}
            />
          )}
        </div>
      </div>
    </div>
  )
}
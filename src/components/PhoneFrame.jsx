// src/components/PhoneFrame.jsx
import React, { useState } from 'react'
import DispatchHome     from './DispatchHome.jsx'
import DispatchListView from './DispatchListView.jsx'
import TrainingView     from './TrainingView.jsx'
import RechargeView     from './RechargeView.jsx' // 스태미너 충전 팝업

export default function PhoneFrame() {
  // 화면 타입: 'home' | 'list' | 'train' | 'recharge'
  const [view, setView] = useState({ type: 'home', building: null })
  const [stamina, setStamina] = useState(10)  // 초기 스태미너
  const [gems, setGems]       = useState(100) // 초기 젬

  // DispatchHome → PhoneFrame
  const handleAction = (building, action) => {
    if (action === 'train') {
      setView({ type: 'train', building })
    } else if (action === 'dispatch') {
      setView({ type: 'list', building: null })
    }
  }

  // 기업 리스트 새로고침 (젬 10 소모)
  const handleRefresh = () => {
    if (gems < 10) {
      alert('젬이 부족합니다.') 
      return
    }
    setGems(g => g - 10)
    // TODO: 실제 리스트 새로고침 로직
  }

  // 기업 파견 시작
  const handleDispatchStart = company => {
    if (stamina < company.staminaNeed) {
      alert('스태미너가 부족합니다.')
      return
    }
    setStamina(s => s - company.staminaNeed)
    alert(`"${company.name}" 에 파견을 시작했습니다!`)
    setView({ type: 'home', building: null })
  }

  // 스태미너 충전 팝업 열기
  const openRecharge = () => setView({ type: 'recharge' })
  // 스태미너 100 충전
  const handleRecharge = () => {
    setStamina(100)
    setView({ type: 'home', building: null })
  }

  // 뒤로가기
  const goBack = () => setView({ type: 'home', building: null })

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
      <div className="relative w-72 h-[600px] bg-black rounded-3xl overflow-hidden shadow-xl">

        {/* 상단 노치 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-xl" />

        {/* 내부 화면 */}
        <div className="absolute inset-3 bg-yellow-50 rounded-2xl overflow-hidden">
          {view.type === 'home' && (
            <DispatchHome
              onAction={handleAction}
              availableStamina={stamina}
              onRechargeOpen={openRecharge}
            />
          )}

          {view.type === 'list' && (
            <DispatchListView
              availableStamina={stamina}
              gems={gems}
              onBack={goBack}
              onRefresh={handleRefresh}
              onDispatchStart={handleDispatchStart}
            />
          )}

          {view.type === 'train' && (
            <TrainingView
              building={view.building}
              onBack={goBack}
              availableStamina={stamina}
              onRechargeOpen={openRecharge}
            />
          )}

          {view.type === 'recharge' && (
            <RechargeView
              onBack={goBack}
              onRecharge={handleRecharge}
            />
          )}
        </div>
      </div>
    </div>
  )
}
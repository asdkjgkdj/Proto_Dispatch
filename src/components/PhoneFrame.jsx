// src/components/PhoneFrame.jsx
import React, { useState } from 'react'
import DispatchHome       from './DispatchHome.jsx'
import DispatchListView   from './DispatchListView.jsx'
import TrainingView       from './TrainingView.jsx'
import RechargeView       from './RechargeView.jsx'
import DispatchMissionView from './DispatchMissionView.jsx'

export default function PhoneFrame() {
  const [view, setView]       = useState({ type: 'home', building: null, company: null })
  const [stamina, setStamina] = useState(10)
  const [gems, setGems]       = useState(100)

  const goHome = () => setView({ type: 'home', building: null, company: null })

  const handleHomeAction = (building, action) => {
    if (action === 'train') {
      setView({ type: 'train', building })
    } else if (action === 'dispatch') {
      setView({ type: 'list', building: null })
    }
  }

  const handleListSelect = company => {
    setView({ type: 'mission', company })
  }

  const handleTrainBack = () => {
    goHome()
  }

  const handleMissionBack = () => {
    goHome()
  }

  const handleRefresh = () => {
    if (gems < 10) {
      alert('젬이 부족합니다.')
      return
    }
    setGems(g => g - 10)
  }

  const openRecharge = () => setView({ type: 'recharge' })
  const handleRecharge = () => {
    setStamina(100)
    goHome()
  }

  // 💡 onConsumeStamina 콜백: TrainingView → PhoneFrame
  const consumeStamina = amount => {
    setStamina(s => Math.max(0, s - amount))
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
      <div className="relative w-72 h-[600px] bg-black rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-xl" />
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
            />
          )}

          {view.type === 'train' && (
            <TrainingView
              building={view.building}
              availableStamina={stamina}
              onConsumeStamina={consumeStamina}  // ← 이 줄을 반드시 추가!
              onBack={handleTrainBack}
              onRechargeOpen={openRecharge}
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
              onBack={handleMissionBack}
            />
          )}

        </div>
      </div>
    </div>
  )
}
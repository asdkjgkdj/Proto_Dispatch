// src/components/PhoneFrame.jsx
import React, { useState } from 'react'
import DispatchHome from './DispatchHome'
import TrainingView from './TrainingView'

function RechargeModal({ onConfirm, onClose }) {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded p-4 text-center">
        <p className="mb-4">스태미너 100개 충전하기</p>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          충전하기
        </button>
      </div>
    </div>
  )
}

export default function PhoneFrame() {
  const [availableStamina, setAvailableStamina] = useState(10)
  const [view, setView] = useState({ type: 'home', building: null })
  const [showRecharge, setShowRecharge] = useState(false)

  const handleAction = (building, action) => {
    if (action === 'train') setView({ type: 'train', building })
  }
  const goBack = () => setView({ type: 'home', building: null })

  const consume = amt =>
    setAvailableStamina(s => Math.max(0, s - amt))

  const recharge = () =>
    setAvailableStamina(s => s + 100)

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
      <div className="relative w-72 h-[600px] bg-black rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-xl" />
        <div className="absolute inset-3 bg-yellow-50 rounded-2xl overflow-hidden">
          {view.type === 'home' ? (
            <DispatchHome
              availableStamina={availableStamina}
              onConsumeStamina={consume}
              onAction={handleAction}
              onRechargeOpen={() => setShowRecharge(true)}
            />
          ) : (
            <TrainingView
              building={view.building}
              availableStamina={availableStamina}
              onConsumeStamina={consume}
              onBack={goBack}
              onRechargeOpen={() => setShowRecharge(true)}
            />
          )}

          {showRecharge && (
            <RechargeModal
              onConfirm={recharge}
              onClose={() => setShowRecharge(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
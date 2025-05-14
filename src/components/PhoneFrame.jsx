// src/components/PhoneFrame.jsx
import React, { useState } from 'react'
import DispatchHome from './DispatchHome'
import TrainingView from './TrainingView'   // 새로 만들 UI 컴포넌트

export default function PhoneFrame() {
  const [view, setView] = useState({ type: 'home', building: null })

  // DispatchHome → PhoneFrame
  const handleAction = (building, action) => {
    if (action === 'train') {
      setView({ type: 'train', building })
    }
    // detail/upgrade 버튼도 처리할 수 있어요
  }

  // 뒤로가기
  const goBack = () => setView({ type: 'home', building: null })

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
      <div className="relative w-72 h-[600px] bg-black rounded-3xl overflow-hidden shadow-xl">
        {/* 상단 검은 노치 부분 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-xl" />

        {/* 내부 노란 영역: 여기서 view.type 에 따라 두 화면을 교체 */}
        <div className="absolute inset-3 bg-yellow-50 rounded-2xl overflow-hidden">
          {view.type === 'home' && (
            <DispatchHome onAction={handleAction} />
          )}
          {view.type === 'train' && (
            <TrainingView
              building={view.building}
              onBack={goBack}
            />
          )}
        </div>
      </div>
    </div>
  )
}
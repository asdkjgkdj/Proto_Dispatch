// src/components/ui/Toast.jsx
import React from 'react'

// 화면 중앙에 메시지를 띄우는 토스트 컴포넌트
export default function Toast({ children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-75 text-white px-6 py-3 rounded-md shadow-lg">
        {children}
      </div>
    </div>
  )
}
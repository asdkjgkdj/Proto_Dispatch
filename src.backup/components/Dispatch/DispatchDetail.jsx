import React from 'react'
export default function DispatchDetail({ company }) {
  return (
    <div className="bg-white shadow rounded p-4 space-y-2">
      <h3 className="text-lg font-semibold">{company}</h3>
      <p>필요 스태미너: <strong>10</strong></p>
      <p>보상: <strong>골드 100 / 젬 10</strong></p>
      <p className="text-sm text-gray-600">서버실이고장났어요! 수리+자료회수 필요해요</p>
      <p className="text-sm">필요 파견 능력: <strong>999</strong></p>
    </div>
  )
}
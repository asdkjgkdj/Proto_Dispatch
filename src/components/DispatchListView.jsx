// src/components/DispatchListView.jsx
import React from 'react'
import { Button } from './ui/button'

// 9개 임의의 회사 정보
const COMPANIES = [
  { key: 'leo',   name: '레오시스템',        req:  8 },
  { key: 'mia',   name: '미아솔루션',        req: 12 },
  { key: 'nova',  name: '노바테크',          req: 35 },
  { key: 'luna',  name: '루나이노베이션',    req: 10 },
  { key: 'zeus',  name: '제우스엔터프라이즈',req: 25 },
  { key: 'hera',  name: '헤라코퍼레이션',    req: 40 },
  { key: 'odin',  name: '오딘네트웍스',      req: 18 },
  { key: 'iris',  name: '아이리스미디어',    req:  5 },
  { key: 'zephyr',name: '제피르인더스트리',  req: 50 },
]

// 난이도별 ★ 개수 계산
function starsFor(req) {
  if (req <= 10)     return 1
  if (req <= 30)     return 2
  return 3
}

export default function DispatchListView({
  availableStamina,
  gems,
  onBack,
  onRefresh,       // 기업 새로고침 콜백
  onDispatchStart, // 실제 파견 시작 콜백(company)
}) {
  return (
    <div className="relative w-full h-full flex flex-col bg-yellow-50">
      {/* 헤더: 뒤로가기 + 리소스 */}
      <header className="flex items-center justify-between px-3 py-2">
        <button
          onClick={onBack}
          className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white"
        >←</button>
        <div className="flex space-x-2">
          <div className="flex items-center bg-white px-2 py-1 rounded-full">
            <img src="/images/gem_icon.png" alt="gem" className="w-4 h-4 mr-1" />
            <span>{gems}</span>
          </div>
          <div className="flex items-center bg-white px-2 py-1 rounded-full">
            <img src="/images/stamina_icon.png" alt="stamina" className="w-4 h-4 mr-1" />
            <span>{availableStamina}</span>
          </div>
        </div>
      </header>

      {/* 3×3 그리드 */}
      <div className="grid grid-cols-3 gap-4 px-3 py-2 flex-1 overflow-auto">
        {COMPANIES.map(cmp => (
          <div
            key={cmp.key}
            className="flex flex-col items-center justify-center bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
            onClick={() => onDispatchStart(cmp)}
          >
            <div className="text-base font-bold mb-1">{cmp.name}</div>
            {/* ★ 표시 */}
            <div className="flex">
              {Array.from({ length: starsFor(cmp.req) }).map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.92-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z"/>
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 기업 새로고침 버튼 */}
      <div className="px-3 pb-4">
        <Button
          className="w-full py-3 bg-green-400 text-white font-bold flex items-center justify-center"
          onClick={onRefresh}
        >
          기업 새로고침
          <img src="/images/gem_icon.png" alt="gem" className="w-5 h-5 ml-2" />
          <span className="ml-1">10</span>
        </Button>
      </div>
    </div>
  )
}
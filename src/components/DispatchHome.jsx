// src/components/DispatchHome.jsx
import React, { useState } from 'react'
import { Button } from './ui/button'

const BUILDINGS = [
  { key: 'tech',  img: '/images/tech_support.png',    label: '기술지원',  stamina: 1, col: 1, row: 2 },
  { key: 'ops',   img: '/images/resource_ops.png',     label: '자원운영',  stamina: 1, col: 2, row: 2 },
  { key: 'guard', img: '/images/field_protect.png',    label: '현장보호',  stamina: 1, col: 3, row: 2 },
  { key: 'edu',   img: '/images/education_center.png', label: '교육소',    stamina: 1, col: 2, row: 3 },
]

export default function DispatchHome({
  availableStamina,
  onConsumeStamina,
  onAction,
  onRechargeOpen,
}) {
  const [selected, setSelected] = useState(null)
  const requiredStamina = selected
    ? BUILDINGS.find(b => b.key === selected).stamina
    : 0

  return (
    <div className="relative w-full h-full bg-yellow-50 p-4">
      {/* 상단 스태미너 (클릭 시 충전 팝업) */}
      <button
        onClick={onRechargeOpen}
        className="absolute top-4 right-4 flex items-center bg-white px-2 py-1 rounded shadow"
      >
        <img
          src="/images/stamina_icon.png"
          alt="stamina"
          className="w-5 h-5 mr-1"
        />
        <span className="font-medium">
          {availableStamina >= 0 ? availableStamina : 0}
        </span>
      </button>

      {/* 3×3 그리드 */}
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
        {/* 파견소 */}
        <div className="col-start-2 row-start-1 flex flex-col items-center">
          <img
            src="/images/dispatch_center.png"
            alt="파견소"
            className="w-24 h-24 object-contain"
          />
          <div className="flex items-center mt-1 text-sm">
            <span className="inline-block bg-yellow-300 text-xs font-bold px-1 mr-1 rounded">
              2
            </span>
            파견소
          </div>
        </div>

        {/* 빌딩 */}
        {BUILDINGS.map(b => {
          const isActive = selected === b.key
          return (
            <div
              key={b.key}
              onClick={() => setSelected(b.key)}
              className={`
                col-start-${b.col} row-start-${b.row}
                flex flex-col items-center cursor-pointer
                ${isActive
                  ? 'ring-4 ring-green-400'
                  : 'ring-0 hover:ring-2 hover:ring-gray-400'}
              `}
            >
              <img
                src={b.img}
                alt={b.label}
                className="w-20 h-20 object-contain"
              />
              <div className="flex items-center mt-1 text-sm">
                <span className="inline-block bg-yellow-300 text-xs font-bold px-1 mr-1 rounded">
                  {b.stamina}
                </span>
                {b.label}
              </div>
              {isActive && onAction && (
                <div className="flex space-x-2 mt-2">
                  <Button
                    className="px-2 py-1 text-xs"
                    onClick={e => {
                      e.stopPropagation()
                      onAction(b, 'detail')
                    }}
                  >
                    상세
                  </Button>
                  <Button
                    className="px-2 py-1 text-xs"
                    onClick={e => {
                      e.stopPropagation()
                      onAction(b, 'upgrade')
                    }}
                  >
                    업그레이드
                  </Button>
                  <Button
                    className="px-2 py-1 text-xs"
                    onClick={e => {
                      e.stopPropagation()
                      onAction(b, 'train')
                    }}
                  >
                    훈련
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 파견하기 버튼 */}
      <div className="absolute bottom-6 left-4 right-4">
        <Button
          className="w-full py-3 bg-green-400 text-white font-bold"
          disabled={!selected || availableStamina < requiredStamina}
          onClick={() => {
            onConsumeStamina(requiredStamina)
            const { label } = BUILDINGS.find(b => b.key === selected)
            alert(`"${label}" 파견 시작!`)
          }}
        >
          파견하러가기
        </Button>
      </div>
    </div>
  )
}
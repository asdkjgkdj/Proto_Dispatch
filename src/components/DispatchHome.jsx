// src/components/DispatchHome.jsx
import React, { useState } from 'react'
import { Button } from './ui/button'

const BUILDINGS = [
  { key: 'tech',   img: '/images/tech_support.png',     label: '기술지원',  stamina: 1,  col: 1, row: 2 },
  { key: 'ops',    img: '/images/resource_ops.png',      label: '자원운영',  stamina: 1,  col: 2, row: 2 },
  { key: 'guard',  img: '/images/field_protect.png',     label: '현장보호',  stamina: 1,  col: 3, row: 2 },
  { key: 'edu',    img: '/images/education_center.png',  label: '교육소',    stamina: 1,  col: 2, row: 3 },
]

export default function DispatchHome() {
  const stamina = 10
  // 어떤 빌딩이 선택되었는지 저장하는 state
  const [selected, setSelected] = useState(null)

  return (
    <div className="relative w-full h-full bg-yellow-50 p-4">
      {/* 상단 스태미너 표시 */}
      <div className="absolute top-4 right-4 flex items-center bg-white px-2 py-1 rounded shadow">
        <img src="/images/stamina_icon.png" alt="stamina" className="w-5 h-5 mr-1" />
        <span className="font-medium">{stamina}</span>
      </div>

      {/* 3x3 그리드 레이아웃 */}
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
        {/* 맨 위 중앙: 파견소 */}
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

         {/* 나머지 네 개 빌딩 (선택 시 테두리 색 변경, onClick 처리) */}
        {BUILDINGS.map(({ key, img, label, stamina, col, row }) => {
          const isActive = selected === key
          return (
            <div
              key={key}
              onClick={() => setSelected(key)}
              className={`
                col-start-${col} row-start-${row} flex flex-col items-center cursor-pointer
                ${isActive
                  ? 'ring-4 ring-green-400'
                  : 'ring-0 hover:ring-2 hover:ring-gray-400'}
              `}
            >
              <img src={img} alt={label} className="w-20 h-20 object-contain" />
              <div className="flex items-center mt-1 text-sm">
                <span className="inline-block bg-yellow-300 text-xs font-bold px-1 mr-1 rounded">
                  {stamina}
                </span>
                {label}
              </div>
              {/* 클릭된 건물일 때만 액션 버튼들 노출 */}
             {isActive && (
               <div className="flex space-x-2 mt-2">
               <Button
                className="px-2 py-1 text-xs"
                onClick={(e) => { e.stopPropagation(); alert(`${label} 상세보기`); }}
                >
                   상세
                 </Button>
                 <Button
                  className="px-2 py-1 text-xs"
                  onClick={(e) => { e.stopPropagation(); alert(`${label} 업그레이드`); }}
                >
                   업그레이드
                 </Button>
                     <Button
                  className="px-2 py-1 text-xs"
                    onClick={(e) => { e.stopPropagation(); alert(`${label} 훈련`); }}
                  >
                   훈련
                 </Button>
               </div>
             )}
            </div>
          )
        })}
       </div>
       
       {/* 하단 고정 “파견하러가기” 버튼 */}
       <div className="absolute bottom-6 left-4 right-4">
        <Button
          className="w-full py-3 bg-green-400 text-white font-bold"
          disabled={!selected}
          onClick={() => {
            alert(`"${BUILDINGS.find(b=>b.key===selected).label}" 파견 시작!`)
          }}
        >
          파견하러가기
        </Button>
      </div>
     </div>
   )
 }
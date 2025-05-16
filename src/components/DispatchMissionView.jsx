// ★ 컴포넌트 최상단에 한 번만 선언
 const DURATION_TEXT = {
     1: '10초',
     2: '30초',
     3: '1분',
   };

// src/components/DispatchMissionView.jsx
import React, { useState } from 'react'
import { Button } from './ui/button'
import Toast from './ui/Toast'

// 미리 정의된 CEO 풀 (직종별 5명씩)
const CEO_POOL = [
  { key: 'tech1', name: '테크박사',   role: '기술지원', power: 10, level: 1 },
  { key: 'tech2', name: '코드마스터', role: '기술지원', power: 20, level: 2 },
  { key: 'tech3', name: '해커킹',     role: '기술지원', power: 30, level: 3 },
  { key: 'tech4', name: '알고리즘왕', role: '기술지원', power: 40, level: 4 },
  { key: 'tech5', name: 'AI교수',     role: '기술지원', power: 50, level: 5 },
  { key: 'ops1',  name: '물류대장',   role: '자원운영', power: 10, level: 1 },
  { key: 'ops2',  name: '공급체인왕', role: '자원운영', power: 20, level: 2 },
  { key: 'ops3',  name: '재고관리사', role: '자원운영', power: 30, level: 3 },
  { key: 'ops4',  name: '물류CEO',    role: '자원운영', power: 40, level: 4 },
  { key: 'ops5',  name: '운영대가',   role: '자원운영', power: 50, level: 5 },
  { key: 'fld1',  name: '경비대장',   role: '현장보호', power: 10, level: 1 },
  { key: 'fld2',  name: '보안전문가', role: '현장보호', power: 20, level: 2 },
  { key: 'fld3',  name: '안전관리사', role: '현장보호', power: 30, level: 3 },
  { key: 'fld4',  name: '현장사령관', role: '현장보호', power: 40, level: 4 },
  { key: 'fld5',  name: '보안CEO',    role: '현장보호', power: 50, level: 5 },
]


// 직종 → 아이콘 파일명 매핑
const OCC_ICON = {
  '기술지원': 'Technology',
  '자원운영': 'Resources',
  '현장보호': 'Field',
}

export default function DispatchMissionView({
     params,              // { key, name, power, staminaNeed, roles, difficulty }
      availableStamina,
      trainedWorkers = [],
      onBack
    }) {
    
 // ─── 파견 시간 계산 & params 분해 ─────────────────────────
  const { power: needPower, staminaNeed, roles, stars } = params
  const durationText = DURATION_TEXT[stars] || ''
  const maxDispatch = 1 * 10

  // 추천된 직종의 일꾼만
  const candidates = trainedWorkers.filter(w =>
    roles.some(r => w.label.includes(r))
  )
  const [selections, setSelections] = useState(
    candidates.map(w => ({ key: w.key, count: 0 }))
  )
  const totalSelected = selections.reduce((s, x) => s + x.count, 0)

  // CEO 슬롯 & 팝업 상태
  const [slots, setSlots]           = useState([null, null, null])
  const [slotIdx, setSlotIdx]       = useState(null)      // 편집 중인 슬롯
  const [pendingCEO, setPendingCEO] = useState(null)      // 팝업 내 선택 CEO

  // 장착된 CEO 파워 합산
  const ceoPower = slots
    .filter(k => k)
    .map(k => CEO_POOL.find(c => c.key === k).power)
    .reduce((a, b) => a + b, 0)

  // 현재 파견 능력 = 일꾼수 + CEO 파워
  const selectedPower = totalSelected + ceoPower

  // totalSelected: 일꾼 수, slots.filter(...) : 장착된 CEO 수
const totalPersons = totalSelected + slots.filter(k => k).length

const canDispatch = 
  selectedPower >= needPower &&
  availableStamina >= staminaNeed &&
  totalPersons > 0 &&
  totalPersons <= maxDispatch

  const [toastMessage, setToastMessage] = useState('')
  const showToast = msg => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 1500)
  }

  const findWorkerCount = key =>
    candidates.find(w => w.key === key)?.count || 0

  const onSlide = (key, v) => {
    const val = +v
    const own = findWorkerCount(key)
    const current = selections.find(s => s.key === key).count
    const cap = Math.min(own, maxDispatch - (totalSelected - current))
    if (val > cap) return showToast('최대 인원입니다.')
    setSelections(selections.map(s =>
      s.key === key ? { ...s, count: val } : s
    ))
  }

  const openSelector = idx => {
    setSlotIdx(idx)
    setPendingCEO(slots[idx])
  }
  const closeSelector = () => {
    setSlotIdx(null)
    setPendingCEO(null)
  }

  // 토글 장착/중지
  const handleEquip = () => {
    const next = [...slots]
    if (slots[slotIdx] === pendingCEO) {
      next[slotIdx] = null    // 이미 장착된 CEO면 해제
    } else if (pendingCEO) {
      next[slotIdx] = pendingCEO
    }
    setSlots(next)
    setPendingCEO(null)
  }

  // 해당 직종 CEO만
  const ceos = CEO_POOL.filter(c => roles.includes(c.role))

  return (
    <div className="relative w-full h-full bg-yellow-50 flex flex-col p-4">
      {/* 1. 헤더 */}
      <header className="flex items-center justify-between mb-4">
        <Button onClick={onBack} className="px-3 py-1">← 뒤로</Button>
        <div className="flex items-center bg-white px-2 py-1 rounded-full">
          <img src="/images/stamina_icon.png" className="w-4 h-4 mr-1" alt="stamina"/>
          <span>{availableStamina}</span>
        </div>
      </header>

      {/* 2. 능력치 */}
      <div className="grid grid-cols-2 gap-2 text-center mb-1">
        <div>
          <div className="text-sm">현재 파견 능력</div>
          <div className="text-lg font-bold">{selectedPower}</div>
        </div>
        <div>
          <div className="text-sm">필요 능력</div>
          <div className="text-lg font-bold">{needPower}</div>
        </div>
      </div>
      {/* 2-1. 파견 인원 카운터 (일꾼 + CEO) */}
<div className="text-center mb-2 text-sm text-gray-700">
  ({totalSelected + slots.filter(k => k).length} / {maxDispatch}명)
</div>
{/* 2-2. 파견 가능 여부 문구 (능력치 비교 포함) */}
<div className="text-center mb-4">
  {selectedPower >= needPower
    ? <span className="text-blue-500">
        파견이 가능합니다.
      </span>
    : <span className="text-red-500">
        파견이 불가능합니다.
      </span>}
</div>

      {/* 3. 추천 직종 */}
      <div className="mb-4 text-sm">
        <span className="font-medium">추천 직종: </span>{roles.join(', ')}
      </div>

      {/* 4. 메인 CEO 슬롯 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {slots.map((key, i) => {
          const ceo = CEO_POOL.find(c => c.key === key)
          return (
            <div
              key={i}
              onClick={() => openSelector(i)}
              className={`
                h-20 bg-white rounded shadow flex flex-col items-center justify-center cursor-pointer
                ${!ceo ? 'border-2 border-dashed border-gray-300' : ''}
              `}
            >
              {!ceo ? (
                <span className="text-2xl text-gray-400">＋</span>
              ) : (
                <>
                  {/* 직종 아이콘 */}
                  <img
                    src={`/images/occupation/${OCC_ICON[ceo.role]}.png`}
                    className="w-4 h-4 mb-1"
                    alt={ceo.role}
                  />
                  {/* Lv */}
                  <div className="text-xs mb-1">Lv.{ceo.level}</div>
                  {/* 이미지 */}
                  <img
                    src={`/images/ceo/${ceo.key}.png`}
                    className="w-12 h-12 mb-1"
                    alt={ceo.name}
                  />
                  {/* 파견능력 */}
                  <div className="flex items-center text-xs">
                    <img
                      src="/images/dispatch_ability.png"
                      className="w-4 h-4 mr-1"
                      alt="power"
                    />
                    <span>{ceo.power}</span>
                  </div>
                  <div className="text-red-500 text-xs mt-1">파견중</div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* 5. 일꾼 리스트 */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {candidates.length > 0 ? candidates.map(w => {
          const sel = selections.find(s => s.key === w.key).count
          return (
            <div key={w.key} className="bg-white p-2 rounded shadow">
              <div className="flex items-center mb-1">
                <img
                  src={`/images/cats/${w.key}_lvl1.png`}
                  className="w-8 h-8 mr-2"
                  alt={w.label}
                />
                <span className="font-medium">{w.label}</span>
                <span className="ml-auto text-sm text-gray-600">
                  {sel}/{w.count}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={w.count}
                value={sel}
                onChange={e => onSlide(w.key, e.target.value)}
                className="w-full"
              />
            </div>
          )
        }) : (
          <div className="text-center text-gray-500">
            추천된 직종의 일꾼이 없습니다.
          </div>
        )}
      </div>

        {/* ─── 파견 시간 ───────────────────────── */}
    {/* ─── 파견 시간 ───────────────────────── */}
     <div className="flex items-center justify-center mb-2 text-sm text-gray-700">
       <img
         src="/images/Time_Icon.png"
         alt="time"
         className="w-4 h-4 mr-1"
       />
       <span>소요 시간: {durationText}</span>
     </div>

      {/* 6. 파견 버튼 */}
      <Button
        className={`w-full py-2 font-bold ${canDispatch ? 'bg-green-500' : 'bg-gray-300'}`}
        disabled={!canDispatch}
        onClick={() => alert('파견을 시작합니다!')}
      >
        파견 ({staminaNeed}⚡)
      </Button>

      {/* 7. CEO 선택 팝업 */}
      {slotIdx !== null && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full rounded-lg p-4 max-h-[80%] overflow-y-auto relative">
            <button
              onClick={closeSelector}
              className="absolute top-2 right-2 text-gray-600"
            >✕</button>
            <h3 className="text-center font-bold mb-2">CEO 선택</h3>

            {/* 팝업 상단 슬롯 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {slots.map((key, i) => {
                const ceo = CEO_POOL.find(c => c.key === key)
                return (
                  <div
                    key={i}
                    onClick={() => openSelector(i)}
                    className={`h-16 bg-white rounded shadow flex items-center justify-center cursor-pointer
                      ${i === slotIdx ? 'ring-2 ring-blue-400' : ''}
                    `}
                  >
                    {!ceo
                      ? <span className="text-2xl text-gray-400">＋</span>
                      : <img
                          src={`/images/ceo/${ceo.key}.png`}
                          className="w-12 h-12"
                          alt={ceo.name}
                        />
                    }
                  </div>
                )
              })}
            </div>

            +            {/* ─── CEO 목록 3×3 (스크롤 가능) ─── */}
            <div className="max-h-40 overflow-y-auto mb-4">
              <div className="grid grid-cols-3 gap-3">
                {ceos
                  // 이미 다른 슬롯에 장착된 CEO는 제외
                  .filter(c => c.key === pendingCEO || !slots.includes(c.key))
                  .map(ceo => {
                     const isEquipped = slots.includes(ceo.key)
                     const isSelected = pendingCEO === ceo.key
                     return (
                       <div
                         key={ceo.key}
                         onClick={() => setPendingCEO(ceo.key)}
                         className={`
                           bg-gray-100 p-2 rounded shadow flex flex-col items-center cursor-pointer
                           ${isEquipped ? 'opacity-50 cursor-not-allowed' : ''}
                           ${isSelected ? 'ring-2 ring-blue-500' : ''}
                         `}
                       >
        
          {/* 직종 아이콘 */}
          <img
            src={`/images/occupation/${OCC_ICON[ceo.role]}.png`}
            className="w-3 h-3 mb-0"
            alt={ceo.role}
          />
          {/* Lv */}
          <div className="text-xs mb-1">Lv.{ceo.level}</div>
          {/* 이미지 */}
          <img
            src={`/images/ceo/${ceo.key}.png`}
            className="w-8 h-8 mb-1"
            alt={ceo.name}
          />
          {/* 파견능력 */}
          <div className="flex items-center text-xs">
            <img
              src="/images/dispatch_ability.png"
              className="w-4 h-4 mr-1"
              alt="power"
            />
            <span>{ceo.power}</span>
          </div>
          {isEquipped && (
            <div className="mt-1 text-red-500 text-xs">파견중</div>
          )}
        </div>
      )
    })}
  </div>
</div>

            {/* 보기 + 파견/중지 버튼 */}
            <div className="mt-4 flex space-x-2">
              <Button className="flex-1 bg-green-400 text-white">보기</Button>
              <Button
                className={`flex-1 text-white ${
                  slots[slotIdx] === pendingCEO ? 'bg-red-500' : 'bg-blue-600'
                }`}
                disabled={!pendingCEO}
                onClick={handleEquip}
              >
                {slots[slotIdx] === pendingCEO ? '파견 중지' : '파견'}
              </Button>
            </div>

            {/* 토스트 */}
            {toastMessage && <Toast>{toastMessage}</Toast>}
          </div>
        </div>
      )}

    </div>
  )
}
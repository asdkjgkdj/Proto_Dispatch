// src/components/DispatchCenter.jsx

import React, { useState } from 'react'
import TabNav         from './ui/TabNav'
import CompanyGrid    from './Dispatch/CompanyGrid'
import DispatchDetail from './Dispatch/DispatchDetail'
import RoleChips      from './Dispatch/RoleChips'
import { Button }     from './ui/button'

export default function DispatchCenter() {
  const tabs = ['파견소','자원운영','기술지원','교육소']
  const [activeTab, setActiveTab]     = useState('파견소')
  const [selectedCompany, setCompany] = useState(null)

  return (
    <div className="p-4">
      <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
      {activeTab === '파견소' && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <CompanyGrid onSelect={setCompany} />
          {selectedCompany && (
            <div className="col-span-3 md:col-span-2 space-y-4">
              <DispatchDetail company={selectedCompany} />
              <RoleChips roles={['기술지원','현장보호']} />
              <Button className="w-full">파견하러가기</Button>
            </div>
          )}
        </div>
      )}
      {/* 다른 탭은 필요 시 BuildingUI 등 재활용 */}
    </div>
  )
}
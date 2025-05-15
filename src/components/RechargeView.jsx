import React from 'react'
import { Button } from './ui/button'

export default function RechargeView({ onBack, onRecharge }) {
  return (
    <div className="relative w-full h-full flex flex-col bg-white items-center justify-center p-4">
      <h2 className="mb-4 text-lg font-bold">스태미너 충전하기</h2>
      <p className="mb-6">스태미너를 100으로 충전하시겠습니까?</p>
      <div className="flex space-x-4">
        <Button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2"
        >
          취소
        </Button>
        <Button
          onClick={onRecharge}
          className="bg-green-500 text-white px-4 py-2"
        >
          충전하기
        </Button>
      </div>
    </div>
  )
}
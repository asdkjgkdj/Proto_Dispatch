// src/components/PhoneFrame.jsx
import React, { useState } from 'react'
import DispatchHome from './DispatchHome'
import TrainingModal from './TrainingModal'

export default function PhoneFrame() {
 const [modal, setModal] = useState({ building: null, action: null })

 const handleAction = (building, action) => {
   if (action === 'train') {
     setModal({ building, action })
   }
 }

 const closeModal = () => setModal({ building: null, action: null })

 return (
   <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
     <div className="relative w-72 h-[600px] bg-black rounded-3xl overflow-hidden shadow-xl">
       <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-900 rounded-b-xl" />
       <div className="absolute inset-3 bg-yellow-50 rounded-2xl overflow-auto">
        <DispatchHome onAction={handleAction} />
       </div>
     </div>

     {modal.action === 'train' && (
       <TrainingModal
         building={modal.building}
         onClose={closeModal}
       />
     )}
   </div>
 )
}
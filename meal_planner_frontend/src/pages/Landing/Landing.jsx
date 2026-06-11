import React, { useState } from 'react'
import StoreMap from './StoreMap'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleZipSearch = async (zip) => {
    setLoading(true)
    setSelectedStore(null)
    try {
      const res = await fetch("http://localhost:8000/stores/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip_code: zip })
      })
      const data = await res.json()
      setStores(data.stores)
    } catch (err) {
      console.error("Failed to fetch stores:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    navigate("/preferences", { state: { store: selectedStore } })
  }

  return (
    <>
      <div className='w-full min-h-screen flex justify-center mt-24'>
        <div className='items-center flex flex-col'>
          <h1 className='text-green-900 font-bold text-4xl p-4'>Change your diet today with CartWise</h1>
          <h2 className='text-l font-semibold p-2'>Meal plans built around what's actually in stock at your local grocery store</h2>
          <StoreMap 
            stores={stores}
            onStoreSelect={setSelectedStore}
            selectedStore={selectedStore}
            onSearch={handleZipSearch}
          />

          {/* Loading state */}
          {loading && (
            <p className='text-sm text-gray-500'>Searching nearby stores...</p>
          )}


          {/* Continue */}
          {selectedStore && (
            <button
              onClick={handleContinue}
              className='bg-green-600 text-white py-3 px-3 my-3 rounded-xl font-medium hover:bg-green-700 transition'
            >
              Continue with {selectedStore.name}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Landing

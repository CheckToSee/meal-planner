import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

const StoreMap = ({ stores, onStoreSelect, selectedStore, onSearch }) => {

  const [zipInput, setZipInput] = useState("")
  const [locationStatus, setLocationStatus] = useState("idle")
  const [mapCenter, setMapCenter] = useState([39.5, -98.35])
  const [mapZoom, setMapZoom] = useState(4)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable")
      return
    }
    setLocationStatus("loading")
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus("granted"),
        setMapCenter([position.coords.latitude, position.coords.longitude])
        setMapZoom(11)
        const { latitude, longitude } = position.coords

        // Reverse geocode to get zip
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const zip = data.address?.postcode
          if (zip) {
            setZipInput(zip)
            onSearch(zip)
          }
        } catch (err) {
          console.error("Reverse geocode failed:", err)
        }
      },
      () => setLocationStatus("denied")
    )
  }, [])

  const handleSearch = async () => {
    if(!zipInput.trim()) return
    
    // Geocode again to recenter the map
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${zipInput}&countrycodes=us&format=json`
      )
      const data = await res.json()
      if (data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        setMapZoom(11)
      }
    } catch (err) {
      console.error("Geocode failed:", err)
    }

    onSearch(zipInput)
  }


  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Location status */}
      {locationStatus === "loading" && (
      <p className='text-sm text-gray-500'>Detecting your location...</p>
      )}
      {locationStatus === "denied" && (
      <p className='text-sm text-amber-600'>Location access denied - Enter your zip code below.</p>
      )}


      {/* Zip input form */}
      <div className='flex gap-2'>
        <input 
          type='text'
          placeholder='Enter zip code'
          value={zipInput}
          onChange={(e) => setZipInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className='border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500'
        />
        <button
          onClick={handleSearch}
          className='bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition'
        >
          Search
        </button>
      </div>

      
      {/* Map */}
      <div style={{ height: "300px" }} className='w-full rounded-xl overflow-hidden border border-gray-200'>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className='w-full h-full'
          key={mapCenter.toString()}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />
        </MapContainer>
      </div>

      {/* Store cards */}
      {stores.length > 0 && (
        <div className='flex flex-col gap-3'>
          <p className='font-medium text-gray-700'>Nearby Kroger and affiliate locations:</p>
          {stores.map(store => (
            <div
              key={store.id}
              onClick={() => onStoreSelect(store)}
              className={`border rounded-xl px-4 py-3 cursor-pointer transition
                ${selectedStore?.id === store.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
                }`}
            >
              <p className='font-semibold'>{store.name}</p>
              <p className='text-sm text-gray-500'>{store.address}, {store.city}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StoreMap

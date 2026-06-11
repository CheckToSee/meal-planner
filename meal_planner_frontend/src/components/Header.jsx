import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-center bg-white bg-opacity-70 z-50 -mb-16'>
      <nav className='h-16 w-full max-w-[1400px] flex items-center justify-between px-6'>
        <h1 className='font-bold text-3xl cursor-pointer p-2'>Cart<span className='font-extrabold text-green-500'>Wise</span>
        </h1>
        <div>
          <button className='cursor-pointer py-1 px-2 rounded-md font-medium bg-red500 hover:bg-red300 hover:bg-gray-200'>Log in</button>
          <button className='cursor-pointer py-1 px-2 ml-1 rounded-md font-medium bg-green-500 hover:bg-green-300 text-white font medium'>Get Started</button>
        </div>
      </nav>
    </div>
  )
}

export default Header

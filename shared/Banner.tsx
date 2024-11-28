import React from 'react'

interface BannerType {
    name: any
}
export const Banner = ({name}: BannerType) => {
  return (
    <div className='bg-[#e9f1ff] rounded-2xl p-4'>
        <h1 className='text-[#0D0F56] text-4xl'>Welcome {name}</h1>
        <p className='max-w-[500px] text-sm'>We're excited to have you on board and can't wait for you to experience creating  engaging email for your brand using Gridape.</p>
    </div>
  )
}

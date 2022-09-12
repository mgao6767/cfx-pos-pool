import React from 'react'

export function Stake() {
  return (
    <div className="w-full flex flex-col items-center justify-center px-2 py-2">
      <div className="text-md w-full py-6">
        <b className="text-4xl">Stake</b>&nbsp; to earn PoS rewards
      </div>
      <div className="grid grid-cols-3 gap-4 w-full ">
        <div className="col-span-3 border-b border-black space-x-4 flex items-center justify-start w-full py-3 px-3 ">
          <div className="border-r self-center border-black w-[25%]">
            {' '}
            Balance{' '}
          </div>
          <div className="font-bold text-2xl w-[25%]  flex pl-2">6,045</div>
        </div>
        <div className="col-span-3 border-b border-black space-x-4 flex items-center justify-between w-full py-3 px-3 ">
          <div className="border-r self-center border-black w-[25%]">
            {' '}
            Amount{' '}
          </div>
          <input
            className="w-[70%] input text-2xl font-bold "
            type="number"
            min={1000}
            step={1000}
          />
        </div>

        <div className="col-span-3 space-x-4 flex items-center justify-between w-full py-3 px-3 ">
          <div className="w-[40%] flex space-x-4 py-4"></div>

          <div className="w-[10%] smooth btn py-3 px-2 items-center justify-center flex bg-black smooth hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900 text-gray-100 rounded-md border border-transparent">
            <button>{'>'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Unstake() {
  return (
    <div className="w-full flex flex-col items-center justify-center px-2 py-2">
      <div className="text-md w-full py-6">
        <b className="text-4xl">Unstake</b>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full ">
        <div className="col-span-3 border-b border-black space-x-4 flex items-center justify-start w-full py-3 px-3 ">
          <div className="border-r self-center border-black w-[25%]">
            {' '}
            Unstakable{' '}
          </div>
          <div className="font-bold text-2xl w-[25%]  flex pl-2">6,045</div>
        </div>
        <div className="col-span-3 border-b border-black space-x-4 flex items-center justify-between w-full py-3 px-3 ">
          <div className="border-r self-center border-black w-[25%]">
            {' '}
            Amount{' '}
          </div>
          <input
            className="w-[70%] input text-2xl font-bold "
            type="number"
            min={1000}
            step={1000}
          />
        </div>

        <div className="col-span-3 space-x-4 flex items-center justify-between w-full py-3 px-3 ">
          <div className="w-[40%] flex space-x-4 py-4"></div>

          <div className="w-[10%] smooth btn py-3 px-2 items-center justify-center flex bg-black smooth hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900 text-gray-100 rounded-md border border-transparent">
            <button>{'>'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

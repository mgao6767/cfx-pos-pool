import React from 'react'
import {Stake, Unstake} from './Stake'

function Content() {
  return (
    <div className="container mx-auto w-full h-[90vh] space-x-4 items-center justify-center grid grid-cols-2 xl:grid-cols-3">
      {/* left section */}
      <div className=" items-center justify-center flex flex-col col-span-2 h-full   py-2 px-3 w-full space-y-4">
        {/* upper section */}
        <div className=" pb-1 pt-12 px-3 w-full h-full space-y-8">
          {/* title + icons */}
          <div className=" py-1 px-2 items-center justify-center w-full flex">
            <div className="flex items-start justify-start w-full text-2xl xl:text-4xl self-center font-bold text-black ">
              Arctic Pool Summary
            </div>
            <div className="flex items-end justify-end w-full space-x-4">
              <div className="icon-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <div className="icon-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 rotate-[-45deg]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* center part */}
          <div className="pb-2 pt-4 px-3 items-center justify-center grid grid-cols-2 xl:grid-cols-4 w-full">
            <div className="xl:col-span-1 col-span-2 px-3 py-2 bg-[#F8F8F8] rounded-lg flex items-center w-full justify-between">
              <div className="flex flex-col items-center justify-center w-full px-4 py-2">
                <div className="text-start items-start justify-start flex w-full font-bold text-black text-xl">
                  {' '}
                  Status{' '}
                </div>
                <div className="flex w-full items-center justify-between space-x-4">
                  {/* <p>Uptime: n days</p> */}
                  <p></p>
                  <p className="text-[#4ebb45] font-bold text-lg"> Good </p>
                </div>
              </div>
            </div>

            <div className=" py-3 px-3  w-full xl:col-span-3 col-span-2 xl:flex items-center justify-between  xl:space-y-0 space-y-4 xl:space-x-4">
              <div className="w-full items-start justify-start xl:items-center xl:justify-center flex flex-col">
                <div className="font-medium text-gray-500">
                  Total Locked CFX
                </div>
                <div className="text-2xl font-bold"> 60,000 </div>
              </div>
              <div className="w-full items-start justify-start xl:items-center xl:justify-center flex flex-col">
                <div className="font-medium text-gray-500"> Total Revenue </div>
                <div className="text-2xl font-bold"> 80,000 </div>
              </div>
              <div className="w-full items-start justify-start xl:items-center xl:justify-center flex flex-col">
                <div className="font-medium text-gray-500"> Est. APY </div>
                <div className="text-2xl font-bold"> 11% </div>
              </div>
            </div>
          </div>
          <div className="px-3 w-full items-center justify-center flex">
            <div className="py-4 px-6 w-full items-center justify-between xl:space-y-0 space-y-6 lg:flex bg-[#F8F8F8] rounded-lg">
              <div className="lg:flex justify-between items-center lg:space-x-12">
                <div className="space-y-3">
                  <div className="font-medium text-gray-500 text-lg">
                    Staked
                  </div>
                  <div className="font-bold text-2xl"> 100,000 </div>
                </div>
                <div className="space-y-3">
                  <div className="font-medium text-gray-500 text-lg">
                    Rewards
                  </div>
                  <div className="font-bold text-2xl"> 10,405 </div>
                </div>
                <div className="space-y-3">
                  <div className="font-medium text-gray-500 text-lg">
                    Withdrawable
                  </div>
                  <div className="font-bold text-2xl"> 10,405 </div>
                </div>
                <div className="space-y-3">
                  <div className="font-medium text-gray-500 text-lg">
                    Performance Fee
                  </div>
                  <div className="font-bold text-2xl"> 10%</div>
                </div>
              </div>

              <div className="lg:w-1/3 w-full items-start justify-start space-x-4 lg:items-end lg:justify-end flex lg:space-x-4">
                <button className="bg-black smooth hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900 text-gray-100 py-3 px-8 border border-transparent rounded-md">
                  Claim
                </button>
                <button className="bg-black smooth hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900 text-gray-100 py-3 px-8 border border-transparent rounded-md">
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* lower section */}
        <div className=" py-1 px-3 w-full h-full">{/* <Statistics /> */}</div>
      </div>
      {/* right section  */}
      <div className=" col-span-1 h-full xl:flex xl:flex-col hidden space-y-6 py-6 px-6 w-full">
        <Stake />
        <Unstake />
        {/* <UpcomingBills /> */}
      </div>
    </div>
  )
}

export default Content

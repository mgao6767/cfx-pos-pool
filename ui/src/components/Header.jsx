import React, {useState} from 'react'
import NavLink from './NavLink'
import i18n from '../../public/locales'
import {useTryActivate, useAccount} from '../hooks/useWallet'
import useCurrentSpace from '../hooks/useCurrentSpace'
import useCurrentNetwork from '../hooks/useCurrentNetwork'
import useIsNetworkMatch from '../hooks/useIsNetworkMatch'
import {useTranslation} from 'react-i18next'

const nav_icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
)

function Header() {
  const {t} = useTranslation()
  const [active, setActive] = useState('Core')
  const tryActivate = useTryActivate()
  const isNetworkMatch = useIsNetworkMatch()
  const networkError = !isNetworkMatch
  const address = useAccount()
  const currentSpace = useCurrentSpace()
  const currentNetwork = useCurrentNetwork()
  const [lang, setLang] = useState('en')

  return (
    <div className="items-center justify-between flex w-full space-x-4 pb-2 pt-4 px-3">
      {/* logo */}
      <div className="border-b border-gray-900 w-[25%] flex md:space-x-2 md:pb-6 pb-2 items-center justify-center md:justify-start">
        <img
          className="md:w-12 md:h-12 w-10 h-10 "
          src="/logo.svg"
          alt="logo"
        />
        <div className="self-center hidden lg:inline lg:font-bold lg:text-md text-md">
          Conflux PoS
        </div>
      </div>
      {/* navlinks */}
      <div className=" border-b pb-5  border-gray-900 w-[140%] items-center justify-center flex space-x-2">
        <div
          className="relative items-center justify-center flex "
          onClick={() => setActive('Core')}
        >
          <NavLink active={active} title={'Core'} key={'Core'} />
          <div
            className={`${
              active === 'Core'
                ? 'items-center justify-center flex absolute -bottom-3'
                : 'hidden'
            }`}
          >
            {nav_icon}
          </div>
        </div>

        <div
          className="relative items-center justify-center flex disabled"
          onClick={() => setActive('Core')}
        >
          <NavLink active={active} title={'eSpace (in dev)'} key={'eSpace'} />
        </div>
      </div>

      <div className="border-b  border-gray-900 pb-6 pt-4 hidden md:flex items-center justify-end px-3 space-x-6 w-[60%]">
        <button className='border border-transparent rounded-md hover:border-gray-900'
          onClick ={() => {
            if (lang == 'en') {
              i18n.changeLanguage('zh')
              setLang('zh')
            } else {
              i18n.changeLanguage('en')
              setLang('en')
            }
          }}
        >
          <img
            src="/translation.png"
            className="w-8 h-8 rounded-full object-center object-cover "
            alt="translation"
          />
        </button>
        {currentSpace && isNetworkMatch && address && (
          <div className="bg-gray-100 py-1 px-2 border border-black rounded-md h-8 text-xs">
            {address}
          </div>
        )}
        {currentSpace && isNetworkMatch && !address && (
          <button
            onClick={tryActivate}
            className="bg-black smooth hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900 text-gray-100 py-1 px-2 border border-transparent rounded-md h-8"
          >
            {t("Header.connect_wallet")}
          </button>
        )}
        {!isNetworkMatch && (
          <button
            onClick={tryActivate}
            className="bg-red-700  smooth hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900 text-gray-100 py-1 px-2 border border-transparent rounded-md h-8"
          >
            {t("Header.network_mismatch")}
          </button>
        )}
      </div>
    </div>
  )
}

export default Header

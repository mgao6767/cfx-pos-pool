import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {useTranslation} from 'react-i18next'

export default function ConfirmModal({type, visible, setVisible, onOk}) {

  const {t} = useTranslation()
  const cancelButtonRef = useRef(null)

  let content = <></>
  let okText = ''
  let okBtnColor = ''
  switch (type) {
    case 'stake':
      okText = t('ConfirmModal.stake')
      okBtnColor = 'hover:bg-green-700'
      content = (
        <div>
          <div className="text-center text-error text-base font-bold mt-2 mb-4">
            {t('ConfirmModal.stake_1')}
          </div>
          <div className="leading-6">{t('ConfirmModal.stake_2')}</div>
          <div className="leading-6">{t('ConfirmModal.stake_3')}</div>
          <div className="leading-6">{t('ConfirmModal.stake_4')}</div>
        </div>
      )
      break
    case 'unstake':
      okText = t('ConfirmModal.unstake')
      okBtnColor = 'hover:bg-red-700'
      content = (
        <div>
          <div>{t('ConfirmModal.unstake_1')}</div>
          <div>{t('ConfirmModal.unstake_2')}</div>
          <div>{t('ConfirmModal.unstake_3')}</div>
        </div>
      )
      break
    default:
      break
  }

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setVisible}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-10 sm:w-10">
                      <img src='/logo.svg'></img>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {okText}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className={`${okBtnColor}` + " inline-flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm"}
                    onClick={onOk}
                  >
                    {okText}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setVisible(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

  )
}
import React, {useState, useEffect, useCallback} from 'react'
import usePosPoolContract from '../hooks/usePoolContract'
import {format} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js'
import BigNumber from 'bignumber.js'
import {useTranslation} from 'react-i18next'
import {Drip, getPosAccountByPowAddress, conflux} from '../utils/cfx'
const confluxController = conflux

import {
  getCfxByVote,
  getFee,
  getDateByBlockInterval,
  getMax,
  getApy,
  getPrecisionAmount,
  calculateGasMargin,
} from '../utils'
import {
  useBalance,
  useAccount,
  useChainId,
  useSendTransaction,
  Unit,
} from '../hooks/useWallet'

import useCurrentSpace from '../hooks/useCurrentSpace'
import {CFX_BASE_PER_VOTE, StatusPosNode} from '../constants'

import useCurrentNetwork from '../hooks/useCurrentNetwork'
import useIsNetworkMatch from '../hooks/useIsNetworkMatch'
import {POOL_ADDRESS} from '../constants'

function Content() {
  const {t} = useTranslation()
  const poolAddress = POOL_ADDRESS
  const {contract: posPoolContract, interface: posPoolInterface} =
    usePosPoolContract()
  const [lockedCfx, setLockedCfx] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [apy, setApy] = useState(0)
  const [poolName, setName] = useState('loading...')

  const currentSpace = useCurrentSpace()
  const chainId = useChainId()
  const accountAddress = useAccount()
  const sendTransaction = useSendTransaction()
  const _balance = useBalance()
  const balance = _balance?.toDecimalStandardUnit(5)
  const cfxMaxCanStake = getMax(balance)
  const currentNetwork = useCurrentNetwork()

  const [status, setStatus] = useState(StatusPosNode.loading)
  const [stakedCfx, setStakedCfx] = useState(0)
  const [rewards, setRewards] = useState(0)
  const [fee, setFee] = useState(0)
  const [cfxCanUnstake, setCfxCanUnstate] = useState(0)
  const [cfxCanWithdraw, setCfxCanWithdraw] = useState(0)
  const [inputStakeCfx, setInputStakeCfx] = useState('')
  const [inputUnstakeCfx, setInputUnstakeCfx] = useState('')
  const [userSummary, setUserSummary] = useState([])
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0)
  const [lastDistributeTime, setLastDistributeTime] = useState('')
  const [unstakeList, setUnstakeList] = useState([])
  const [stakeModalShown, setStakeModalShown] = useState(false)
  const [unstakeModalShown, setUnStakeModalShown] = useState(false)
  const [txModalShown, setTxModalShown] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [stakeInputStatus, setStakeInputStatus] = useState('error')
  const [stakeErrorText, setStakeErrorText] = useState('')
  const [unstakeInputStatus, setUnstakeInputStatus] = useState('error')
  const [unstakeErrorText, setUnstakeErrorText] = useState('')
  const [stakeBtnDisabled, setStakeBtnDisabled] = useState(true)
  const [unstakeBtnDisabled, setUnstakeBtnDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [waitStakeRes, setWaitStakeRes] = useState(false)
  const isNetworkMatch = useIsNetworkMatch()

  useEffect(() => {
    async function fetchData() {
      try {
        const proArr = []
        proArr.push(posPoolContract.poolSummary())
        proArr.push(posPoolContract.poolAPY())
        proArr.push(posPoolContract.poolName())

        const data = await Promise.all(proArr)
        const poolSummary = data[0]
        setLockedCfx(getCfxByVote(poolSummary?.[0]?._hex || poolSummary?.[0]))
        setTotalRevenue(
          new Drip(
            new BigNumber(poolSummary?.[2]?._hex || poolSummary?.[2])
              .minus(poolSummary?.[1]?._hex || poolSummary?.[1])
              .toNumber(),
          ).toCFX(),
        )
        setApy(getApy(data?.[1]?._hex || data[1]))
        setName(data[2] || 'UnNamed')
      } catch (error) {}
    }
    fetchData()
  }, [poolAddress])

  useEffect(() => {
    async function fetchData() {
      const proArr = []
      proArr.push(
        currentSpace === 'core'
          ? confluxController.provider.call('cfx_getStatus')
          : fetch(currentNetwork.url, {
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 83,
              }),
              headers: {'content-type': 'application/json'},
              method: 'POST',
            })
              .then(response => response?.json())
              .then(res => res?.result),
      )
      proArr.push(confluxController.provider.call('cfx_getPoSEconomics'))
      const data = await Promise.all(proArr)

      let currentBlock
      if (currentSpace === 'core') {
        currentBlock = new BigNumber(data[0]?.blockNumber || 0).toNumber()
      } else {
        currentBlock = new BigNumber(data[0] || 0).toNumber()
      }
      const lastDistribute = new BigNumber(
        data[1]?.lastDistributeBlock || 0,
      ).toNumber()
      setCurrentBlockNumber(currentBlock)
      setLastDistributeTime(
        getDateByBlockInterval(
          lastDistribute,
          currentBlock,
          currentSpace,
        ).toLocaleString(),
      )
    }
    fetchData()
  }, [currentSpace, currentNetwork?.url])

  useEffect(() => {
    if (status) {
      if (stakeErrorText) {
        setStakeBtnDisabled(true)
      } else {
        setStakeBtnDisabled(false)
      }
    } else {
      setStakeBtnDisabled(true)
    }
  }, [stakeErrorText, status])

  useEffect(() => {
    if (status) {
      if (unstakeErrorText) {
        setUnstakeBtnDisabled(true)
      } else {
        setUnstakeBtnDisabled(false)
      }
    } else {
      setUnstakeBtnDisabled(true)
    }
  }, [unstakeErrorText, status])

  useEffect(() => {
    // if (currentSpace === 'eSpace' && !searchParams.get('coreAddress')) {
    //   setStatus(StatusPosNode.warning)
    //   return
    // }
    async function fetchData() {
      try {
        const posAccount = await getPosAccountByPowAddress(
          poolAddress,
          // currentSpace === 'core'
          //   ? poolAddress
          //   : searchParams.get('coreAddress'),
        )
        setStatus(
          posAccount.status?.forceRetired == null
            ? StatusPosNode.success
            : StatusPosNode.error,
        )
      } catch (error) {
        console.log(error)
        setStatus(StatusPosNode.warning)
      }
    }
    fetchData()
    // }, [currentSpace, searchParams, poolAddress])
  }, [currentSpace, poolAddress])

  useEffect(() => {
    try {
      const stakeCfxNum = Number(inputStakeCfx)
      if (
        stakeCfxNum >= CFX_BASE_PER_VOTE &&
        stakeCfxNum <= cfxMaxCanStake &&
        stakeCfxNum % CFX_BASE_PER_VOTE === 0
      ) {
        setStakeInputStatus('green')
        setStakeErrorText('')
      } else {
        setStakeInputStatus('error')
        setStakeErrorText(t('Pool.wrong_amount'))
      }
    } catch (error) {
      setStakeInputStatus('error')
      setStakeErrorText(t('Pool.wrong_amount'))
    }
  }, [cfxMaxCanStake, inputStakeCfx, t])

  useEffect(() => {
    try {
      const cfxNum = Number(inputUnstakeCfx)
      if (
        cfxNum >= CFX_BASE_PER_VOTE &&
        cfxNum <= cfxCanUnstake &&
        cfxNum % CFX_BASE_PER_VOTE === 0
      ) {
        setUnstakeInputStatus('green')
        setUnstakeErrorText('')
      } else {
        setUnstakeInputStatus('error')
        setUnstakeErrorText(t('Pool.wrong_amount'))
      }
    } catch (error) {
      setUnstakeInputStatus('error')
      setUnstakeErrorText(t('Pool.wrong_amount'))
    }
  }, [cfxCanUnstake, inputUnstakeCfx, t])

  function resetData() {
    setStakedCfx(0)
    setRewards(0)
    setCfxCanUnstate(0)
    setCfxCanWithdraw(0)
  }

  const fetchPoolData = useCallback(async () => {
    if (isLoading || currentBlockNumber === 0) return
    setIsLoading(true)
    try {
      const proArr = []
      proArr.push(posPoolContract.userSummary(accountAddress))
      proArr.push(posPoolContract.userInterest(accountAddress))
      proArr.push(
        (
          posPoolContract.userOutQueue ||
          posPoolContract['userOutQueue(address)']
        )(accountAddress),
      )

      const data = await Promise.all(proArr)
      const userSum = data[0]
      setUserSummary(userSum)
      setStakedCfx(
        new BigNumber(userSum?.[1]?._hex || userSum[1] || 0)
          .multipliedBy(CFX_BASE_PER_VOTE)
          .toString(10),
      )
      setCfxCanUnstate(getCfxByVote(userSum?.[2]?._hex || userSum[2]))
      setCfxCanWithdraw(getCfxByVote(userSum?.[3]?._hex || userSum[3]))
      setRewards(
        getPrecisionAmount(
          new Drip(
            new BigNumber(data[1]?._hex || data[1]).toString(10),
          ).toCFX(),
          5,
        ),
      )
      setUnstakeList(transferQueue(data[2]))

      // get user performance fee
      let fee
      try {
        fee = await posPoolContract
          .userShareRatio()
          .call({from: accountAddress})
      } catch (err) {
        fee = await posPoolContract.poolUserShareRatio()
      }
      // console.log("User performance fee: ", fee);
      setFee(getFee(fee?._hex || fee))

      setIsLoading(false)
    } catch (error) {
      console.log('fetchPoolData error: ', error)
      setIsLoading(false)
    }
  }, [accountAddress, currentBlockNumber, isLoading])

  useEffect(() => {
    if (!waitStakeRes) return
    if (accountAddress) {
      fetchPoolData()
      setWaitStakeRes(false)
    }
  }, [balance])

  useEffect(() => {
    if (accountAddress) {
      fetchPoolData()
    } else {
      resetData()
    }
  }, [accountAddress, currentBlockNumber])

  const transferQueue = queueList => {
    if (queueList?.length === 0) return []
    const arr = []
    queueList.forEach(item => {
      const blockNumber = new BigNumber(item[1]?._hex || item[1]).toNumber()
      if (blockNumber > currentBlockNumber) {
        arr.push({
          amount: getCfxByVote(item[0]?._hex || item[0]),
          timeStr: getDateByBlockInterval(
            blockNumber,
            currentBlockNumber,
            currentSpace,
          ).toLocaleString(),
        })
      }
    })
    return arr
  }

  const onStakeChange = e => {
    setInputStakeCfx(e.target.value)
  }

  const onUnstakeChange = e => {
    setInputUnstakeCfx(e.target.value)
  }

  const submit = async type => {
    if (!accountAddress) {
      message.error('Please connect Fluent')
      return
    }

    try {
      let data = ''
      let estimateData = {}
      let value = 0
      switch (type) {
        case 'stake':
          value = new BigNumber(inputStakeCfx)
            .multipliedBy(10 ** 18)
            .toString(10)
          const stakeVote = new BigNumber(inputStakeCfx)
            .dividedBy(CFX_BASE_PER_VOTE)
            .toString(10)
          if (currentSpace === 'core') {
            data = posPoolContract.increaseStake(stakeVote).data
            estimateData = await posPoolContract
              .increaseStake(stakeVote)
              .estimateGasAndCollateral({
                from: accountAddress,
                value,
              })
          } else {
            data = posPoolInterface.encodeFunctionData('increaseStake', [
              stakeVote,
            ])
          }
          setWaitStakeRes(true)
          break
        case 'unstake':
          value = 0
          const unstakeVote = new BigNumber(inputUnstakeCfx)
            .dividedBy(CFX_BASE_PER_VOTE)
            .toString(10)
          if (currentSpace === 'core') {
            data = posPoolContract.decreaseStake(unstakeVote).data
            estimateData = await posPoolContract
              .decreaseStake(unstakeVote)
              .estimateGasAndCollateral({
                from: accountAddress,
              })
          } else {
            data = posPoolInterface.encodeFunctionData('decreaseStake', [
              unstakeVote,
            ])
          }
          break
        case 'claim':
          value = 0
          if (currentSpace === 'core') {
            data = posPoolContract.claimAllInterest().data
            estimateData = await posPoolContract
              .claimAllInterest()
              .estimateGasAndCollateral({
                from: accountAddress,
              })
          } else {
            data = posPoolInterface.encodeFunctionData('claimAllInterest', [])
          }
          break
        case 'withdraw':
          value = 0
          if (currentSpace === 'core') {
            data = posPoolContract.withdrawStake(
              new BigNumber(userSummary?.[3]?._hex || userSummary[3]).toString(
                10,
              ),
            ).data
            estimateData = await posPoolContract
              .withdrawStake(new BigNumber(userSummary[3]).toString(10))
              .estimateGasAndCollateral({
                from: accountAddress,
              })
          } else {
            data = posPoolInterface.encodeFunctionData('withdrawStake', [
              new BigNumber(userSummary?.[3]?._hex || userSummary[3]).toString(
                10,
              ),
            ])
          }
          break
        default:
          break
      }
      const txParams = {
        to:
          currentSpace === 'core'
            ? format.address(poolAddress, Number(chainId))
            : poolAddress,
        data,
        value: Unit.fromMinUnit(value).toHexMinUnit(),
      }

      if (currentSpace === 'eSpace') {
        estimateData.gasLimit = await metaMaskProvider.request({
          method: 'eth_estimateGas',
          params: [
            {
              from: accountAddress,
              data,
              to: poolAddress,
              value: Unit.fromMinUnit(value).toHexMinUnit(),
            },
          ],
        })
      }
      if (estimateData?.gasLimit) {
        txParams.gas = Unit.fromMinUnit(
          calculateGasMargin(estimateData?.gasLimit || 0),
        ).toHexMinUnit()
      }
      if (estimateData?.storageCollateralized) {
        txParams.storageLimit = Unit.fromMinUnit(
          calculateGasMargin(String(estimateData?.storageCollateralized || 0)),
        ).toHexMinUnit()
      }

      if (stakeModalShown) {
        setStakeModalShown(false)
      }
      if (unstakeModalShown) {
        setUnStakeModalShown(false)
      }
      const txHash = await sendTransaction(txParams)
      setTxHash(txHash)
      setTxModalShown(true)
    } catch (error) {
      console.error('error', error)
    }
  }

  const checkNetwork = callback => {
    if (!isNetworkMatch) {
      return
    }

    if (typeof callback === 'function') callback()
  }

  return (
    <div className="container mx-auto w-full flex-grow space-x-4 items-center justify-center grid grid-cols-2 xl:grid-cols-3">
      {/* left section */}
      <div className=" items-center justify-center flex flex-col col-span-2 h-full   py-2 px-3 w-full space-y-4">
        {/* upper section */}
        <div className=" pb-1 pt-12 px-3 w-full h-full space-y-8">
          {/* title + icons */}
          <div className=" py-1 px-2 items-center justify-center w-full flex">
            <div className="flex items-start justify-start w-full text-2xl xl:text-4xl self-center font-bold text-black">
              {poolName} Pool
            </div>
            {/* <span className='font-normal text-sm flex'>{lastDistributeTime}</span> */}

            <div className="flex items-end justify-end w-full space-x-4 self-center">
              <div className="icon-container border border-transparent rounded-md hover:border-gray-900">
                <a href={'https://confluxscan.io/address/' + POOL_ADDRESS}>
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
                </a>
              </div>
            </div>
          </div>
          {/* center part */}
          <div className="pb-2 pt-4 px-3 items-center justify-center grid grid-cols-2 xl:grid-cols-4 w-full">
            <div className="xl:col-span-1 col-span-2 px-3 py-2 bg-[#F8F8F8] rounded-lg flex items-center w-full justify-between">
              <div className="flex flex-col items-center justify-center w-full px-4 py-2">
                <div className="text-start items-start justify-start flex w-full font-bold text-black text-xl">
                  {' '}{t('Home.status')}
                  {' '}
                </div>
                <div className="flex w-full items-center justify-between space-x-4">
                  {/* <p>Uptime: n days</p> */}
                  <p></p>
                  <p
                    className={`${
                      status == StatusPosNode.success
                        ? 'text-green-600 font-bold text-lg'
                        : 'text-red-700 font-bold text-lg'
                    }`}
                  >
                    {status}
                  </p>
                </div>
              </div>
            </div>

            <div className=" py-3 px-3  w-full xl:col-span-3 col-span-2 xl:flex items-center justify-between  xl:space-y-0 space-y-4 xl:space-x-4">
              <div className="w-full items-start justify-start xl:items-center xl:justify-center flex flex-col">
                <div className="font-medium text-gray-500">
                  {t('Home.total_locked')}
                </div>
                <div className="text-2xl font-bold"> {lockedCfx} </div>
              </div>
              <div className="w-full items-start justify-start xl:items-center xl:justify-center flex flex-col">
                <div className="font-medium text-gray-500">
                  {t('Home.total_revenue')}
                </div>
                <div className="text-2xl font-bold">
                  {' '}
                  {getPrecisionAmount(totalRevenue, 5)}{' '}
                </div>
              </div>
              <div className="w-full items-start justify-start xl:items-center xl:justify-center flex flex-col">
                <div className="font-medium text-gray-500"> 
                  {t('Home.apy')}
                </div>
                <div className="text-2xl font-bold"> {apy + '%'} </div>
              </div>
              <div className="w-full items-start justify-start xl:items-center xl:justify-center flex flex-col">
                <div className="font-medium text-gray-500"> 
                {t('Home.performance_fee')}
                </div>
                <div className="text-2xl font-bold"> {fee + '%'} </div>
              </div>
            </div>
          </div>
          <div className="px-3 w-full items-center justify-center flex">
            <div className="py-4 px-6 w-full items-center justify-between xl:space-y-0 space-y-6 lg:flex bg-[#F8F8F8] rounded-lg">
              <div className="lg:flex justify-between items-center lg:space-x-12">
                <div className="lg:space-y-3">
                  <div className="font-medium text-gray-500 text-lg">
                    {t(`Pool.my_staked`)}
                  </div>
                  <div className="font-bold text-2xl"> {stakedCfx} </div>
                </div>
                <div className="lg:space-y-3">
                  <div className="font-medium text-gray-500 text-lg">
                    {t(`Pool.my_rewards`)}
                  </div>
                  <div className="font-bold text-2xl"> {rewards} </div>
                </div>
                <div className="lg:space-y-3">
                  <div className="font-medium text-gray-500 text-lg">
                    {t(`Pool.withdrawable`)}
                  </div>
                  <div className="font-bold text-2xl"> {cfxCanWithdraw} </div>
                </div>
              </div>

              <div className="lg:w-1/3 w-full items-start justify-start space-x-4 lg:items-end lg:justify-end flex lg:space-x-4">
                <button
                  className={
                    `${
                      new BigNumber(rewards).isEqualTo(0)
                        ? 'bg-gray-100 border-black text-gray-900'
                        : 'bg-black text-gray-100'
                    }` +
                    ' smooth hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900  py-3 px-8 border border-transparent rounded-md'
                  }
                  onClick={() => checkNetwork(() => submit('claim'))}
                  disabled={isLoading || new BigNumber(rewards).isEqualTo(0)}
                >
                  {t(`Pool.claim`)}
                </button>
                <button
                  className={
                    `${
                      !cfxCanWithdraw
                        ? 'bg-gray-100 border-black text-gray-900'
                        : 'bg-black text-gray-100'
                    }` +
                    ' smooth hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900  py-3 px-8 border border-transparent rounded-md'
                  }
                  onClick={() => checkNetwork(() => submit('withdraw'))}
                  disabled={isLoading || !cfxCanWithdraw}
                >
                  {t(`Pool.withdraw`)}
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
        {/* <Stake /> */}
        <div className="w-full flex flex-col items-center justify-center px-2 py-2">
          <div className="text-md w-full py-6">
            <b className="text-4xl">{t(`Pool.stake`)}</b>&nbsp; {t('Pool.stake_suffix')}
          </div>
          <div className="grid grid-cols-3 gap-4 w-full ">
            <div className="col-span-3 border-b border-black space-x-4 flex items-center justify-start w-full py-3 px-3 ">
              <div className="border-r self-center border-black w-[25%]">
                {' '}
                {t('Pool.balance')}{' '}
              </div>
              <div className="font-bold text-2xl w-[25%]  flex pl-2">
                {balance}
              </div>
            </div>
            <div className="col-span-3 border-b border-black space-x-4 flex items-center justify-between w-full py-3 px-3 ">
              <div className="border-r self-center border-black w-[25%]">
                {' '}
                {t('Pool.enter_cfx_amount')}{' '}
              </div>
              <input
                className={
                  'w-[70%] input text-2xl font-bold ' +
                  `${stakeInputStatus == 'error' ? 'text-red-700' : ' '}`
                }
                type="number"
                min={1000}
                step={1000}
                onChange={onStakeChange}
              />
            </div>

            <div className="col-span-3 space-x-4 flex items-center justify-between w-full py-3 px-3 ">
              {/* <div className="w-[40%] flex space-x-4 py-4 ">{stakeErrorText}</div> */}
              <div className="w-[40%] flex space-x-4 py-4 "></div>

              <div
                className={
                  `${
                    stakeBtnDisabled
                      ? 'bg-gray-100 border-black text-gray-900'
                      : 'bg-black hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900 text-gray-100 btn'
                  }` +
                  ' w-[10%] smooth py-3 px-2 items-center justify-center flex smooth  rounded-md border border-transparent'
                }
              >
                <button
                  onClick={() => {
                    checkNetwork(() => submit('stake'))
                  }}
                  disabled={isLoading || stakeBtnDisabled}
                >
                  {'>'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <Unstake /> */}
        <div className="w-full flex flex-col items-center justify-center px-2 py-2">
          <div className="text-md w-full py-6">
            <b className="text-4xl">{t(`Pool.unstake`)}</b>&nbsp; {t('Pool.unstake_suffix')}
          </div>
          <div className="grid grid-cols-3 gap-4 w-full ">
            <div className="col-span-3 border-b border-black space-x-4 flex items-center justify-start w-full py-3 px-3 ">
              <div className="border-r self-center border-black w-[25%]">
                {' '}
                {t(`Pool.unstakeable`)}{' '}
              </div>
              <div className="font-bold text-2xl w-[25%]  flex pl-2">
                {cfxCanUnstake}
              </div>
            </div>
            <div className="col-span-3 border-b border-black space-x-4 flex items-center justify-between w-full py-3 px-3 ">
              <div className="border-r self-center border-black w-[25%]">
                {' '}
                {t(`Pool.enter_cfx_amount`)}{' '}
              </div>
              <input
                className={
                  'w-[70%] input text-2xl font-bold ' +
                  `${unstakeInputStatus == 'error' ? 'text-red-700' : ' '}`
                }
                type="number"
                min={0}
                step={1000}
                max={cfxCanUnstake}
                onChange={onUnstakeChange}
              />
            </div>

            <div className="col-span-3 space-x-4 flex items-center justify-between w-full py-3 px-3 ">
              <div className="w-[40%] flex space-x-4 py-4 "></div>

              <div
                className={
                  `${
                    unstakeBtnDisabled
                      ? 'bg-gray-100 border-black text-gray-900'
                      : 'bg-black hover:bg-gray-100 hover:text-gray-900 hover:border-gray-900 text-gray-100 btn'
                  }` +
                  ' w-[10%] smooth py-3 px-2 items-center justify-center flex smooth  rounded-md border border-transparent'
                }
              >
                <button
                  onClick={() => {
                    checkNetwork(() => submit('unstake'))
                  }}
                  disabled={isLoading || unstakeBtnDisabled}
                >
                  {'>'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Content

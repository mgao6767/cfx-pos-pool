import {useMemo} from 'react'
import useController from './useController'
import IPoSPool from './../../../contract/ABI/IPoSPool.json'
import {utils} from 'ethers'
import {POOL_ADDRESS} from '../constants'

const usePoolContract = () => {
  const poolAddress = POOL_ADDRESS
  const posPoolAbi = IPoSPool.abi
  const controller = useController()

  return useMemo(() => {
    return {
      contract: controller.Contract({
        abi: posPoolAbi,
        address: poolAddress,
      }),
      interface: new utils.Interface(posPoolAbi),
    }
  }, [poolAddress, controller])
}

export default usePoolContract

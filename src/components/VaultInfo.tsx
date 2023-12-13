'use client'

import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import wstEthIcon from '../../public/wsteth-icon.webp'
import rEthIcon from '../../public/reth-icon.webp'
import sfrxEthIcon from '../../public/sfrxeth-icon.webp'

import { NumericFormat } from 'react-number-format';

const POOL_ID = 'factory-tricrypto-14'

export default function VaultInfo() {
  const [estimatedAPY, setEstimatedAPY] = useState<number>(0)
  const [poolTVL, setPoolTVL] = useState<number>(0)

  // This function will retrieve the pool data from the curve API
  useEffect(() => {
    const endpoint = 'https://api.curve.fi/api/getPools/ethereum/factory-tricrypto'
    const getPoolData = async () => {
      try {
        // Calling API endpoint
        const { data } = await axios.get(endpoint)
        // checking that the response object is as expected
        if (!(data.success == true && data.data && data.data.poolData && data.data.poolData.length > 0)) {
          return console.error('Error fetching pool data')
        }
        // getting pool data from the array of all pools data
        const poolData = data.data.poolData.find((obj: any) => obj.id === POOL_ID);
        // if could not find pool data, log error
        if (!poolData) {
          return console.error('Error, got data but could not find pool')
        }
        // getting the average APY of all 3 coins and forma it to 2 decimals
        const averageLSDApy = poolData.coins.reduce((total: number, coin: any) => total + coin.ethLsdApy, 0)
          / poolData.coins.length
          * 100
        // gaugeCrvApy is an array of 2 numbers, the second one is boosted APY
        const gaugeCrvApy = poolData.gaugeCrvApy[1]
        // finally setting the estimated APY
        // note: the trading fees are not included in this calculation (extra ~0.5%)
        setEstimatedAPY(averageLSDApy + gaugeCrvApy)
        // setting the pool TVL
        setPoolTVL(poolData.usdTotal)
      } catch (error) {
        console.error('getPoolData Error', error)
      }
    }
    getPoolData()
  }, [])

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="grid text-center gap-px bg-white/5 grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-sm font-medium leading-6 text-gray-400">Pool Name</p>
            <p className="mt-2 items-baseline gap-x-2">
              <span className="text-4xl font-semibold text-white">TryLSD</span>
            </p>
          </div>
          <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-sm font-medium leading-6 text-gray-400">Underlying Assets</p>
            <p className="mt-2 flex justify-center items-baseline gap-x-2">
              <Image className="h-8 w-8" alt="Wrapped Staked Ether icon" src={wstEthIcon} />
              <Image className="h-8 w-8" alt="Rocket Pool Ether icon" src={rEthIcon} />
              <Image className="h-8 w-8" alt="Staked Frax Ether icon" src={sfrxEthIcon} />
            </p>
          </div>
          <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-sm font-medium leading-6 text-gray-400">Total Value Locked</p>
            <div className="px-auto mt-2 items-baseline gap-x-2">
              <NumericFormat
                className="text-4xl font-semibold tracking-tight text-white bg-gray-900 w-36"
                type="text"
                value={poolTVL/1000000}
                decimalScale={2}
                prefix={'$'}
                suffix={'M'}
              />
            </div>
          </div>
          <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-sm font-medium leading-6 text-gray-400">Estimated APY</p>
            <p className="mt-2 items-baseline gap-x-2">
              <span className="text-4xl font-semibold tracking-tight text-white">
                {estimatedAPY.toFixed(2)}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

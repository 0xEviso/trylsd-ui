
import DepositForm from '@/components/DepositForm'
import Image from 'next/image'
import StakingList from '@/components/StakingList'
import { Separator } from "@/components/ui/separator"

import TryLSDGatewayExplanation from '../../../public/trylsdgateway_explanation.png'

export default function Deposit() {
  return (
    <>
      <div className="relative pt-6 px-12">
        <div className="flex justify-start">
          <span className="pr-3 pb-6 text-xl font-semibold leading-6">Step 1: Swap and Deposit to TryLSD AMM Pool</span>
        </div>
        <div className="inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-500" />
        </div>
      </div>

      <div className="flex min-h-full flex-col lg:flex-row-reverse justify-center py-12 sm:px-6 lg:px-8 items-center">
        <div className="px-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="shadow sm:rounded-lg mx-auto">
            <DepositForm />
          </div>
        </div>

        <div className="px-6 sm:mx-auto sm:w-full sm:max-w-[480px] py-12 lg:py-0">
          <div className="flex justify-start">
            <span className="pr-3 pb-6 text-xl font-semibold leading-6">How it works</span>
          </div>
          <Image
            className=""
            alt="TryLSD Gateway technical explanation"
            src={TryLSDGatewayExplanation} />
        </div>
      </div>

      <div className="relative pt-6 px-12">
        <div className="flex justify-start">
          <span className="pr-3 pb-6 text-xl font-semibold leading-6">Step 2: Stake for $CRV rewards</span>
        </div>
        <div className="inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-500" />
        </div>
      </div>

      <StakingList />
    </>
  )
}

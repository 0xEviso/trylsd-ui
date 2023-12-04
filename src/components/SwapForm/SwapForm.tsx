import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import DepositForm from '@/components/SwapForm/DepositForm'
import WithdrawalForm from '@/components/SwapForm/WithdrawalForm'

export default function SwapForm() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">

          <Tabs defaultValue="deposit" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              <DepositForm />
            </TabsContent>
            <TabsContent value="withdrawal">
              <WithdrawalForm />
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  )
}

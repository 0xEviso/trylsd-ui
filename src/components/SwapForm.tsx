import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState, ChangeEvent, WheelEvent } from "react"

import { formatUnits, parseUnits } from 'viem'
import { useContractRead } from 'wagmi'

import { TryLSDGatewayABI } from '@/utils/abi/TryLSDGateway.abi'

const trylsdGateway = '0x837a41023cf81234f89f956c94d676918b4791c1'
const reth = '0xae78736Cd615f374D3085123A210448E74Fc6393'
const rethWhale = '0x5fEC2f34D80ED82370F733043B6A536d7e9D7f8d'

export default function SwapForm() {

  // Initialize the state variable
  const [ethAmount, setEthAmount] = useState('')
  const [trylsdAmount, setTrylsdAmount] = useState('')
  const [ethValue, setEthValue] = useState<bigint>(BigInt(0))
  const [isSlippageActive, setIsSlippageActive] = useState(false)

  const handleOnWheel = (event: WheelEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    target.blur();
  }

  const { data, isError, isLoading } = useContractRead({
    address: trylsdGateway,
    abi: TryLSDGatewayABI,
    functionName: 'calculatePoolShares',
    args: [ethValue],
    enabled: isSlippageActive, // prevents the first call when value is 0
    watch: true,
    onSuccess(data: any) {
      setTrylsdAmount(formatUnits(data, 18))
    },
    onError(error: any) {
      console.log('Error', error)
    },
  });

  // Function to update state based on input change
  const handleEthAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseUnits(event.target.value, 18)

    if (value == BigInt(0)) {
      // this is to prevent the trigger of the useContractRead hook when the value is 0
      setIsSlippageActive(false)
      setEthValue(BigInt(0))

      setEthAmount(event.target.value)
      setTrylsdAmount('')
      return
    }

    // this is to trigger the useContractRead hook when the value is not 0
    setIsSlippageActive(true)
    setEthValue(value)
    setEthAmount(formatUnits(value, 18))
  }

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
              <Card>
                <CardHeader>
                  <CardTitle>Deposit</CardTitle>
                  <CardDescription>
                    Deposit ETH to mint TryLSD Pool Tokens.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="ethAmount">ETH amount sent</Label>
                    <Input
                      id="ethAmount"
                      placeholder="0"
                      type="number"
                      value={ethAmount}
                      onChange={handleEthAmountChange}
                      onWheel={handleOnWheel} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="trylsdAmount">Estimated TryLSD amount received</Label>
                    <Input id="trylsdAmount" placeholder="0" disabled type="number" value={trylsdAmount} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Send</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="withdrawal">
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal</CardTitle>
                  <CardDescription>
                    Withdraw ETH by burning TryLSD Pool Tokens.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="ethAmount">TryLSD amount sent</Label>
                    <Input id="ethAmount" placeholder="0" type="number" value={ethAmount} onChange={handleEthAmountChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="trylsdAmount">Estimated ETH amount received</Label>
                    <Input id="trylsdAmount" placeholder="0" disabled type="number" value={trylsdAmount} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Send</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  )
}

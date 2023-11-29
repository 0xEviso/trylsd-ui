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

export default function SwapForm() {
  // Initialize the state variable
  const [ethAmountValue, setEthAmountValue] = useState('')
  const [trylsdAmountValue, setTrylsdAmountValue] = useState('')

  const handleOnWheel = (event: WheelEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    target.blur();
  }


  // Function to update state based on input change
  const handleEthAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value == '0') {
      setEthAmountValue('0')
      setTrylsdAmountValue('0')
      return
    }

    const value = parseUnits(event.target.value, 18)
    setEthAmountValue(formatUnits(value, 18))
    setTrylsdAmountValue(formatUnits(value / BigInt(3), 18))
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
                    <Input id="ethAmount" placeholder="0" type="number" value={ethAmountValue} onChange={handleEthAmountChange} onWheel={handleOnWheel}/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="trylsdAmount">Estimated TryLSD amount received</Label>
                    <Input id="trylsdAmount" placeholder="0" disabled type="number" value={trylsdAmountValue} />
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
                    <Input id="ethAmount" placeholder="0" type="number" value={ethAmountValue} onChange={handleEthAmountChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="trylsdAmount">Estimated ETH amount received</Label>
                    <Input id="trylsdAmount" placeholder="0" disabled type="number" value={trylsdAmountValue} />
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

'use client'

import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState, ChangeEvent, WheelEvent } from "react"
import { formatUnits, parseUnits, getAddress } from 'viem'
import { useAccount, useContractRead, useContractWrite, useBalance } from 'wagmi'

import { TryLSDGatewayABI } from '@/utils/abi/TryLSDGateway.abi'

const trylsdGateway = getAddress(process.env.NEXT_PUBLIC_TRYLSDGATEWAY_ADDRESS || '')

export default function SwapForm() {
  // Deposit eth number in wei + user friendly string in eth (1e18)
  const [depositEthValue, setDepositEthValue] = useState<bigint>(BigInt(0))
  const [depositEthAmount, setDepositEthAmount] = useState('')
  // Deposit trylsd number in wei + user friendly string in eth (1e18)
  const [depositTrylsdValue, setDepositTrylsdValue] = useState<bigint>(BigInt(0))
  const [depositTrylsdAmount, setDepositTrylsdAmount] = useState('')
  // Deposit trylsd number in wei + user friendly string in eth (1e18)
  const [withdrawalTrylsdValue, setWithdrawalTrylsdValue] = useState<bigint>(BigInt(0))
  const [withdrawalTrylsdAmount, setWithdrawalTrylsdAmount] = useState('')
  // Withdrawal box number in wei + user friendly string in eth (1e18)
  const [withdrawalEthValue, setWithdrawalEthValue] = useState<bigint>(BigInt(0))
  const [withdrawalEthAmount, setWithdrawalEthAmount] = useState('')
  // account connected
  const [accountIsConnected, setAccountIsConnected] = useState(false)
  // connected wallet ETH balances
  const [userBalanceEthValue, setUserBalanceEthValue] = useState<bigint>(BigInt(0))
  const [userBalanceEthAmount, setUserBalanceEthAmount] = useState('0')
  const [isSlippageCalculationEnabled, setIsSlippageCalculationEnabled] = useState(false)
  // Error handling
  const [isError, setIsError] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // todo: centralize error handling via isError + error states for all possible errors

  // checking if user is connected and fetch address
  const { address: accountAddress } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('useAccount Connected', { address, connector, isReconnected })
      setAccountIsConnected(true)
    },
    onDisconnect() {
      console.log('useAccount Disconnected')
      setUserBalanceEthValue(BigInt(0))
      setUserBalanceEthAmount('')
      setAccountIsConnected(false)
    },
  })

  // fetching connected user ETH balance
  const { data: balanceData, isLoading: balanceIsLoading } = useBalance({
    watch: true, // to refresh user balance automatically
    address: accountAddress,
    onSuccess(data) {
      console.log('useBalance Success', data)
      setUserBalanceEthValue(data.value)
      setUserBalanceEthAmount(data.formatted)
    },
    onError(error) {
      console.log('useBalance Error', error)
      setIsError(true)
      setErrorMessage(error.message)
    },
  })

  // disable input number increase/decrease on scroll
  const handleOnWheel = (event: WheelEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    target.blur();
  }

  // This is used to convert ETH amount to TryLSD amount
  const { data: calculateData, isLoading: calculateIsLoading } = useContractRead({
    address: trylsdGateway,
    abi: TryLSDGatewayABI,
    functionName: 'calculatePoolShares',
    args: [depositEthValue],
    enabled: isSlippageCalculationEnabled, // prevents the first call when value is 0
    watch: true,
    onSuccess(data) {
      console.log('calculatePoolShares Success', data)
      setDepositTrylsdValue(data)
      setDepositTrylsdAmount(formatUnits(data, 18))
    },
    onError(error) {
      console.log('calculatePoolShares Error', error)
      setIsError(true)
      setErrorMessage(error.message)
    },
  });

  // This is used to send ETH and receive TryLSD pool tokens
  const {
    data: depositData,
    isLoading: depositIsLoading,
    isError: depositIsError,
    error: depositError,
    isSuccess: depositIsSuccess,
    write: depositWrite
  } = useContractWrite({
    address: trylsdGateway,
    abi: TryLSDGatewayABI,
    functionName: 'swapAndDeposit',
    value: depositEthValue,
    account: accountAddress,
    onSuccess(data) {
      console.log('swapAndDeposit Success', data)
    },
    onError(error: any) {
      console.log('swapAndDeposit Error', error)
      setIsError(true)
      setErrorMessage(error.shortMessage)
    },
  })

  const updateDepositEth = (value: bigint, amount: string) => {
    if (value == BigInt(0)) {
      // this is to prevent the trigger of the useContractRead hook when the value is 0
      setIsSlippageCalculationEnabled(false)
      // value: number
      setDepositEthValue(BigInt(0))
      setDepositTrylsdValue(BigInt(0))
      // amount: string
      setDepositEthAmount(amount)
      setDepositTrylsdAmount('')
      return
    }
    // this is to trigger the useContractRead hook when the value is not 0
    setIsSlippageCalculationEnabled(true)
    // value: number
    setDepositEthValue(value)
    // amount: string
    setDepositEthAmount(amount)
    // setDepositEthAmount(formatUnits(value, 18))
  }

  // Function to update state based on input change
  const handleDepositEthAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    // hide error message if any
    setIsError(false)

    const value = parseUnits(event.target.value, 18)
    updateDepositEth(value, event.target.value)
  }

  const handleDepositMax = () => {
    // hide error message if any
    setIsError(false)

    updateDepositEth(userBalanceEthValue, userBalanceEthAmount)
  }

  const handleDeposit = () => {
    // hide error message if any
    setIsError(false)

    const minAmount:bigint = depositTrylsdValue / BigInt(1000) * BigInt(999)
    depositWrite({
      args: [getAddress(accountAddress || ''), minAmount],
    })
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
                    <Label htmlFor="ethAmount">Amount sent</Label>
                    <div className="flex items-center space-x-2 space-y-1">
                      <Input
                        id="ethAmount"
                        placeholder="0"
                        type="number"
                        value={depositEthAmount}
                        onChange={handleDepositEthAmountChange}
                        onWheel={handleOnWheel} />
                        <div>ETH</div>
                    </div>
                  </div>

                  {accountIsConnected ? (
                    <div className="flex items-center flex-row-reverse space-x-2 space-y-1">
                      <div className="ml-2">
                        <Button variant="outline" onClick={handleDepositMax}>Max</Button>
                      </div>
                      <div className="space-y-1">
                        {userBalanceEthAmount}
                      </div>
                      <div className="space-y-1">Balance:</div>
                    </div>
                  ) : null}

                  <Separator className="my-4" />

                  <div className="space-y-1">
                    <Label htmlFor="trylsdAmount">Pool tokens received</Label>
                    <div className="flex items-center space-x-2 space-y-1">
                      <Input id="trylsdAmount" placeholder="0" disabled type="number" value={depositTrylsdAmount} />
                      <div>TRYLSD</div>
                    </div>
                  </div>

                  {isError ? (
                    <div className="space-y-1">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {errorMessage}
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : null}
                </CardContent>
                <CardFooter>
                  {depositIsLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please confirm in your wallet
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDeposit}
                      // The button will only be enable if eth value is non 0 and wallet is connected
                      disabled={!(depositEthValue && accountIsConnected)}>
                        Send
                    </Button>
                  )}
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
                    <Input id="ethAmount" placeholder="0" type="number" value={withdrawalEthAmount} onChange={handleDepositEthAmountChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="trylsdAmount">Estimated ETH amount received</Label>
                    <Input id="trylsdAmount" placeholder="0" disabled type="number" value={withdrawalTrylsdAmount} />
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

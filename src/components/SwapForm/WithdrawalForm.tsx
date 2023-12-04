'use client'

import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { useState, ChangeEvent, WheelEvent } from "react"
import { formatUnits, parseUnits, getAddress } from 'viem'
import { useAccount, useContractRead, useContractWrite, useBalance } from 'wagmi'

import { TryLSDGatewayABI } from '@/utils/abi/TryLSDGateway.abi'

const trylsdGateway = getAddress(process.env.NEXT_PUBLIC_TRYLSDGATEWAY_ADDRESS || '')
const trylsd = getAddress(process.env.NEXT_PUBLIC_TRYLSD_ADDRESS || '')

export default function WithdrawalForm() {
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
  // connected wallet TryLSD balances
  const [userBalanceTryLSDValue, setUserBalanceTryLSDValue] = useState<bigint>(BigInt(0))
  const [userBalanceTryLSDAmount, setUserBalanceTryLSDAmount] = useState('0')
  const [isSlippageCalculationTryLSDToEthEnabled, setIsSlippageCalculationTryLSDToEthEnabled] = useState(false)
  // Error handling
  const [isError, setIsError] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // checking if user is connected and fetch address
  const { address: accountAddress } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('useAccount Connected', { address, connector, isReconnected })
      setAccountIsConnected(true)
    },
    onDisconnect() {
      console.log('useAccount Disconnected')
      setUserBalanceEthValue(BigInt(0))
      setUserBalanceEthAmount('0')
      setAccountIsConnected(false)
    },
  })

  // fetching connected user ETH balance
  useBalance({
    watch: true, // to refresh user balance automatically
    address: accountAddress,
    onSuccess(data) {
      console.log('useBalance ETH Success', data)
      setUserBalanceEthValue(data.value)
      setUserBalanceEthAmount(data.formatted)
    },
    onError(error) {
      console.log('useBalance Error', error)
      setIsError(true)
      setErrorMessage(error.message)
    },
  })

  // fetching connected user TryLSD balance
  useBalance({
    watch: true, // to refresh user balance automatically
    address: accountAddress,
    token: trylsd,
    onSuccess(data) {
      console.log('useBalance TryLSD Success', data)
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
  useContractRead({
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
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal</CardTitle>
        <CardDescription>
          Withdraw ETH by burning TryLSD Pool Tokens.
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
  )
}

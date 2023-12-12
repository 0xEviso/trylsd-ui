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

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
const trylsdGatewayAddress = getAddress(process.env.NEXT_PUBLIC_TRYLSDGATEWAY_ADDRESS || NULL_ADDRESS)
const trylsdAddress = getAddress(process.env.NEXT_PUBLIC_TRYLSD_ADDRESS || NULL_ADDRESS)
const MAX_SEND = parseUnits('1000', 18)

export default function DepositForm() {
  // Deposit eth number in wei + user friendly string in eth (1e18)
  const [ethValue, setEthValue] = useState<bigint>(BigInt(0))
  const [ethAmount, setEthAmount] = useState('')
  // Deposit trylsd number in wei + user friendly string in eth (1e18)
  const [trylsdValue, setTrylsdValue] = useState<bigint>(BigInt(0))
  const [trylsdAmount, setTrylsdAmount] = useState('')
  // account connected
  const [accountAddress, setAccountAddress] = useState<`0x${string}`>(NULL_ADDRESS)
  const [accountIsConnected, setAccountIsConnected] = useState(false)
  // connected wallet ETH balances
  const [accountBalanceEthValue, setAccountBalanceEthValue] = useState<bigint>(BigInt(0))
  const [accountBalanceEthAmount, setAccountBalanceEthAmount] = useState('0')
  // connected wallet TryLSD balances
  const [accountBalanceTryLSDValue, setAccountBalanceTryLSDValue] = useState<bigint>(BigInt(0))
  const [accountBalanceTrylsdAmount, setAccountBalanceTrylsdAmount] = useState('0')
  // eth to trylsd estimation
  const [isSlippageCalculationEnabled, setIsSlippageCalculationEnabled] = useState(false)
  // Error handling
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  // Success message
  const [isSuccesful, setIsSuccessful] = useState(false)

  // checking if user is connected and fetch address
  useAccount({
    // how to update address on account change in MM
    onConnect({ address, connector, isReconnected }) {
      setAccountIsConnected(true)
      if (address) {
        setAccountAddress(address)
      }
    },
    onDisconnect() {
      setAccountBalanceEthValue(BigInt(0))
      setAccountBalanceEthAmount('0')
      setAccountIsConnected(false)
      setAccountAddress(NULL_ADDRESS)
    },
  })

  // fetching connected user ETH balance
  useBalance({
    watch: true, // to refresh user balance automatically
    address: accountAddress,
    onSuccess(data) {
      setAccountBalanceEthValue(data.value)
      // FYI: total of the exponentials should be 18
      setAccountBalanceEthAmount(formatUnits(data.value / BigInt(10 ** 14), 4))
    },
    onError(error) {
      console.error('useBalance ETH Error', error)
      setIsError(true)
      setErrorMessage(error.message)
    },
  })

  // fetching connected user TryLSD balance
  useBalance({
    watch: true, // to refresh user balance automatically
    address: accountAddress,
    token: trylsdAddress,
    onSuccess(data) {
      setAccountBalanceTryLSDValue(data.value)
      // FYI: total of the exponentials should be 18
      setAccountBalanceTrylsdAmount(formatUnits(data.value / BigInt(10 ** 14), 4))
    },
    onError(error) {
      console.error('useBalance TryLSD Error', error)
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
    address: trylsdGatewayAddress,
    abi: TryLSDGatewayABI,
    functionName: 'calculatePoolShares',
    args: [ethValue],
    enabled: isSlippageCalculationEnabled, // prevents the first call when value is 0
    watch: true,
    onSuccess(data) {
      setTrylsdValue(data)
      setTrylsdAmount(formatUnits(data, 18))
    },
    onError(error) {
      console.error('calculatePoolShares Error', error)
      setIsError(true)
      setErrorMessage(error.message)
    },
  });

  // This is used to send ETH and receive TryLSD pool tokens
  const {
    isLoading: transactionIsLoading,
    write: transactionWrite
  } = useContractWrite({
    address: trylsdGatewayAddress,
    abi: TryLSDGatewayABI,
    functionName: 'swapAndDeposit',
    value: ethValue,
    account: accountAddress,
    onSuccess(data) {
      // success!
      setIsSuccessful(true)
    },
    onError(error: any) {
      console.error('swapAndDeposit Error', error)
      setIsError(true)
      setErrorMessage(error.shortMessage)
    },
  })

  const updateReceive = (value: bigint, amount: string) => {
    if (value == BigInt(0)) {
      // this is to prevent the trigger of the useContractRead hook when the value is 0
      setIsSlippageCalculationEnabled(false)
      // value: number
      setEthValue(BigInt(0))
      setTrylsdValue(BigInt(0))
      // amount: string
      setEthAmount(amount)
      setTrylsdAmount('')
      return
    }
    // this is to trigger the useContractRead hook when the value is not 0
    setIsSlippageCalculationEnabled(true)
    // we set a max amount to be sent to avoid errors from the calculation contract
    if (value > MAX_SEND) {
      // value: number
      setEthValue(MAX_SEND)
      // amount: string
      setEthAmount(formatUnits(MAX_SEND, 18))
      return
    }
    // value: number
    setEthValue(value)
    // amount: string
    setEthAmount(amount)
  }

  // Function to update state based on input change
  const handleSendAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    // hide error message if any
    setIsError(false)
    // hide success message if any
    setIsSuccessful(false)

    const value = parseUnits(event.target.value, 18)
    updateReceive(value, event.target.value)
  }

  const handleSendMax = () => {
    // hide error message if any
    setIsError(false)
    // hide success message if any
    setIsSuccessful(false)
    // will update the receive input box
    updateReceive(accountBalanceEthValue, formatUnits(accountBalanceEthValue, 18))
  }

  const handleSend = () => {
    // hide error message if any
    setIsError(false)
    // hide success message if any
    setIsSuccessful(false)

    const minAmount: bigint = trylsdValue / BigInt(1000) * BigInt(999)
    transactionWrite({
      args: [getAddress(accountAddress || NULL_ADDRESS), minAmount],
    })
  }

  return (
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
              max="1000"
              value={ethAmount}
              onChange={handleSendAmountChange}
              onWheel={handleOnWheel} />
            <div>ETH</div>
          </div>
        </div>

        {accountIsConnected ? (
          <div className="flex items-center flex-row-reverse space-x-2 space-y-1">
            <div className="ml-2">
              <Button variant="outline" onClick={handleSendMax}>Max</Button>
            </div>
            <div className="space-y-1">
              {accountBalanceEthAmount}
            </div>
            <div className="space-y-1">Balance:</div>
          </div>
        ) : null}

        <Separator className="my-4" />

        <div className="space-y-1">
          <Label htmlFor="trylsdAmount">Pool tokens received</Label>
          <div className="flex items-center space-x-2 space-y-1">
            <Input id="trylsdAmount" placeholder="0" disabled type="number" value={trylsdAmount} />
            <div>TryLSD</div>
          </div>
        </div>

        {accountIsConnected ? (
          <div className="flex items-center flex-row-reverse space-x-2 space-y-1">
            <div className="space-y-1 mt-1 ml-1">
              {accountBalanceTrylsdAmount}
            </div>
            <div className="space-y-1">Balance:</div>
          </div>
        ) : null}

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

        {isSuccesful ? (
          <div className="space-y-1">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                The deposit has been successful
              </AlertDescription>
            </Alert>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        {transactionIsLoading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please confirm in your wallet
          </Button>
        ) : (
          <Button
            onClick={handleSend}
            // The button will only be enable if eth value is non 0 and wallet is connected
            disabled={!(ethValue && accountIsConnected)}>
            Deposit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

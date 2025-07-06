"use client"

import { useState } from "react"
import { ethers, formatUnits } from "ethers"

// Redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setBalance } from "@/lib/features/tokens/tokens"
import { selectTokenAndBalances } from "@/lib/selectors"

// Cusomthooks
import { useProvider } from "@/app/hooks/useProvider"
import { useTokens } from "@/app/hooks/useTokens"
import { useExchange } from "@/app/hooks/useExchange"
import { add } from "lodash"


function Transfer({ type, tokens }) {
    //console.log(tokens)

    // Local state
    const [address, setAddress] = useState(null)

    // Redux state
    // Hooks must be called unconditionally! 
    // Therefore we should not do any validations such as if(!address) return {...}, here.
    const { token, balance } = useAppSelector(state => selectTokenAndBalances(state, address))
    const dispatch = useAppDispatch()


    const { provider } = useProvider()
    const { exchange } = useExchange()
    const { tokens: tokenContracts } = useTokens()

    // Handlers
    function tokenHandler(e) {
        setAddress(e.target.value)
    }

    async function transferHanler(form) {

        try {

            const address = form.get("token")
            const amount = form.get("amount")

            if (!address) throw new Error("Token not selected")
            if (!amount) throw new Error("Amount not set")

            // Signer
            const signer = await provider.getSigner()
            const amountWei = ethers.parseUnits(amount.toString(), 18)

            if(type === "deposit"){
                await approve(signer, address, amountWei)
                await deposit(signer, address, amountWei)
            }
            if(type === "withdraw"){
                await approve(signer, address, amountWei)
                await withdraw(signer, address, amountWei)
            }

            await getBalance(signer, address)

        } catch (error) {
            console.log(error)
            return

        }

    }

    async function approve(signer, address, amountWei) {
        const transaction = await tokenContracts[address].connect(signer).approve(
            await exchange.getAddress(),
            amountWei
        )

        await transaction.wait()
    }

    async function deposit(signer, address, amountWei) {
        const transaction = await exchange.connect(signer).depositToken(address, amountWei)
        await transaction.wait()

    }

    async function withdraw(signer, address, amountWei) {
        const transaction = await exchange.connect(signer).withdrawToken(address, amountWei)
        await transaction.wait()

    }

    async function getBalance(signer, address) {

        const walletBalance = await tokenContracts[address].balanceOf(signer.address)
        const exchangeBalance = await exchange.totalBalanceOf(address, signer.address)

        dispatch(setBalance({
            address,
            wallet: ethers.formatUnits(walletBalance, 18),
            exchange: ethers.formatUnits(exchangeBalance, 18)

        }))

    }

    return (
        <form action={transferHanler}>
            <div className="token">
                <label htmlFor={`${type}-token`}>
                    Select Token
                </label>
                <div className="select">
                    <select
                        name="token"
                        id={`${type}-token`}
                        defaultValue={0}
                        disabled={tokens.length === 0}
                        onChange={tokenHandler}
                    >
                        <option value={0} disabled>Select Token</option>
                        {tokens.map((token, index) => (
                            <option value={token.address} key={index}>{token.symbol}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="amount">
                <label htmlFor={`${type}-amount`}>
                    Amount
                </label>
                <input type="number" name="amount" id={`${type}-amount`} placeholder="0.000" />
            </div>

            <div className="info">
                <div>
                    <p>Token</p>
                    <p>{token ? token.symbol : "N\A"}</p>
                </div>
                <div>
                    <p>Wallet</p>
                    <p>{balance ? balance.wallet : "N\A"}</p>
                </div>
                <div>
                    <p>Exchange</p>
                    <p>{balance ? balance.exchange : "N\A"}</p>
                </div>
            </div>

            <input type="submit" value={type} />

        </form>
    );
}

export default Transfer;
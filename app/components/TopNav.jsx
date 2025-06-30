"use client"

const { useState, useEffect } = require("react");
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers"
import { useProvider } from "@/app/hooks/useProvider";

function TopNav() {


    const { sdk, provider: metamask, chainId } = useSDK()
    const { provider } = useProvider()
    const [account, setAccount] = useState("")
    const [balance, setBalance] = useState("")

    async function connectHandler(){

        try{
            await sdk.connectAndSign({msg: "Sign in to DAPP Exchange"})
            await setAccountInfo()
        }catch(error){[
            console.log(error)
        ]}

    }

    async function setAccountInfo() {

        const account = await provider.getSigner() // wallet
        const balance = await provider.getBalance(account)

        setAccount(account.address)
        setBalance(balance)
    }

    // React Hook to connect to an external system, e.g. the blockchain
    useEffect(() => {

        connectHandler()

    })


    return (
        <nav className="topnav">
            <p>My Account: {account}</p>
            <p>My Balance:{balance}</p>
        </nav>
    );
}



export default TopNav;
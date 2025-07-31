import { useState, useEffect } from "react";
import { ethers } from "ethers"

// Custom hooks
import { useProvider } from "@/app/hooks/useProvider"

// ABIs & config
import EXCHANGE_ABI from "@/app/abis/Exchange.json"
import {CHAIN_ID, EXCHANGE_ADDRESS} from "@/app/config.js"

export function useExchange() {

    const { provider, chainId } = useProvider()
    const [exchange, setExchange] = useState(null)

    // React Hook to connect to an external system
    useEffect(() => {

        if (provider && EXCHANGE_ADDRESS) {
            if (CHAIN_ID !== chainId)
                return
            const signer = provider.getSigner();
            const exchangeContract = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI, signer);
            setExchange(exchangeContract);
        }

    }, [provider])// execute function whenever the any element of the dependency list loads or changes

    return { exchange }
}
import { useState, useEffect } from "react";
import { ethers } from "ethers"

// Custom hooks
import { useProvider } from "@/app/hooks/useProvider"

// ABIs & config
import EXCHANGE from "@/app/abis/Exchange.json"
import config from "@/app/config.json"

export function useExchange() {

    const { provider, chainId } = useProvider()
    const [exchange, setExchange] = useState(null)

    // React Hook to connect to an external system
    useEffect(() => {

        if (provider) {
            if (!config[Number(chainId)])
                return

            const exchangeAddress = config[Number(chainId)].exchange
            const contract = new ethers.Contract(exchangeAddress, EXCHANGE, provider);                
            setExchange(contract)
        }

    }, [provider])// execute function whenever the any element of the dependency list loads or changes

    return { exchange }
}
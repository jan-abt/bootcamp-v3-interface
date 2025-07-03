const { useState, useEffect } = require("react");
import { ethers } from "ethers"

// Custom hooks
import { useProvider } from "@/app/hooks/useProvider"

// ABIs & config
import TOKEN from "@/app/abis/Token.json"
import config from "@/app/config.json"

export function useTokens() {

    const { provider, chainId } = useProvider()
    const [tokens, setTokens] = useState(null)

    // React Hook to connect to an external system
    useEffect(() => {

        if (provider) {
            if (!config[Number(chainId)])
                return
            
            let contracts = {}

            config[Number(chainId)].tokens.forEach((tokenConfig) => {
                const contract = new ethers.Contract(tokenConfig.address, TOKEN, provider);
                contracts[tokenConfig.address] = contract;
            })

            setTokens(contracts)
        }

    }, [provider])// execute function whenever the any element of the dependency list loads or changes

    return { tokens }
}
const { useState, useEffect } = require("react");
import { ethers } from "ethers"

// Custom hooks
import { useProvider } from "@/app/hooks/useProvider"

// ABIs & config
import TOKEN_ABI from "@/app/abis/Token.json"
import { TOKENS } from "@/app/globals.js";


export function useTokens() {

    const { provider, chainId } = useProvider()
    const [tokens, setTokens] = useState(null)

    // React Hook to connect to an external system
    useEffect(() => {

        if (provider && chainId) {
            
            let contracts = {}

            TOKENS.forEach((tokenConfig) => {
                const contract = new ethers.Contract(tokenConfig.address, TOKEN_ABI, provider);
                contracts[tokenConfig.address] = contract;
            })

            setTokens(contracts)
        }

    }, [provider, chainId])// execute function whenever the any element of the dependency list loads or changes

    return { tokens }
}
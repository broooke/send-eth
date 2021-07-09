import React, {useEffect, useState} from "react"
import Web3 from "web3"
import Abi from "../chains/abiEduToken.json"
import '../App.css';

export default function TokenDapp({accounts, chainId, isConnectedWeb3}) {

  const [web3] = useState(new Web3(Web3.givenProvider || "ws://localhost:8545"))

  const [addressContract, setAddressContract] = useState("")
  // const [erc20Contract]= useState(new web3.eth.Contract(
  //   Abi,
  //   addressContract
  // ))
  
  const [balanceOf, setBalanceOf] = useState(0)
  const [decimals, setDecimals] = useState(0)
  const [isMinedToken, setIsMinedToken] = useState(false)
  const [isLoadingToken, setIsLoadingToken] = useState(false)
  const [addressToSendToken, setAddressToSendToken] = useState("")
  const [tokenToSend, setTokenToSend] = useState(0)
  const [nameToken, setNameToken] = useState("")
  const [symbol, setSymbol] = useState("")


//EDUTOKEN

    useEffect(() => {
        const erc20Contract = new web3.eth.Contract(Abi, addressContract)

        const getBalanceOf = async () => setBalanceOf(await erc20Contract.methods.balanceOf(accounts[0]).call({from: accounts[0]}))
        const getDecimals = async () => setDecimals(await erc20Contract.methods.decimals().call({from: accounts[0]}))
        const getNameToken = async () => setNameToken(await erc20Contract.methods.name().call())
        const getSymbol = async () => setSymbol(await erc20Contract.methods.symbol().call())
        
        if (accounts.length > 0 && addressContract) {
            getBalanceOf()
            getDecimals()
            getNameToken()
            getSymbol()
            }

    }, [accounts, chainId, addressContract, web3, isConnectedWeb3])

 
    const sendToken = async () => {
      // const erc20Contract = new web3.eth.Contract(Abi, addressContract)
        if(web3.utils.isAddress) {
        const erc20Contract = new web3.eth.Contract(Abi, addressContract)
            try {
                    setIsLoadingToken(true)
                    await erc20Contract.methods.transfer(addressToSendToken, ((10 ** decimals) * tokenToSend).toString()).send({from: accounts[0]})
                    .on('receipt', () => {
                    setIsLoadingToken(false)
                    setIsMinedToken(true)
                    })
                }
                catch(error){
                    setIsLoadingToken(null)
                    alert("Wrong Address")
                }
        }
      }
       
 

  return (
            <div>
                    <p> Amount {nameToken} : {web3.utils.fromWei(balanceOf.toString())} {symbol} </p>
                    
                    <label> Address ERC20 </label> <input type="text" value={addressContract} onChange={(e)=> setAddressContract(e.target.value)}></input>
                    <button onClick={() => setAddressContract("0x8457aaEfFc7773E548AFAf2FBaE8673A16615e0A")}>EduToken Address</button>
                      <br/><br/>

                    <label>Address for send </label> <input type="text" value={addressToSendToken} onChange={(e) => setAddressToSendToken(e.target.value)}></input>
                    <br/><br/>
                    <label>Amount </label> <input type="number" value={tokenToSend} onChange={(e)=> setTokenToSend(e.target.value)}></input>
                      <br/><br/>
                    
                    {tokenToSend >0 && addressToSendToken ?
                      <button onClick={sendToken}>Envoyer</button> : <button disabled="disabled">Envoyer</button>
                    }
                    
                    {isLoadingToken ? 
                      <p>Loading...</p> : !isLoadingToken && isMinedToken ? <p>Transaction succes</p> : null
                    }
              </div>

  );
}
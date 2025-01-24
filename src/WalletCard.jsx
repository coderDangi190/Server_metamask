import React, {useState ,useEffect} from 'react'
import { ethers } from 'ethers';
const WalletCard = ()=>{
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const connectWalletHandler = async()=>{
        if(window.ethereum){
            try{
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                accountChangeHandler(accounts[0]);
                setConnButtonText('Wallet Connected');
                setErrorMessage(null);
            }catch(error){
                console.log(error);
            }
        }
        else{
            setErrorMessage('Install Metamask');
        }
    }

    const accountChangeHandler =(newAccount)=>{
        setDefaultAccount(newAccount);
        getUserBalance(newAccount);
    }
    const getUserBalance = async (address) => {
        try {
            const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest'],
        });
        setUserBalance(ethers.utils.formatEther(balance));
        } 
        catch (error) {
            setErrorMessage('Could not fetch balance: ' + error.message);
            setUserBalance(null);
        }    
    };
    const addAccountListener = ()=>{
        if(window.ethereum){
            window.ethereum.on('accountChange', (accounts)=>{
                if(accounts.length >0){
                    accountChangeHandler(accounts[0]);
                }
                else{
                    setDefaultAccount(null);
                    setUserBalance(null);
                    setConnButtonText('Connect Wallet');
                }
            })
        }
    }
    useEffect(() => {
        addAccountListener();
    }, []);
    return(
        <>
            <h4>{"Connection to MetaMask using window.ethereum method"}</h4>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <div>
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div>
                <h3>Balance: {userBalance}</h3>
            </div>
            {errorMessage}
        </>
    )
}
export default WalletCard
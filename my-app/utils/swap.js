import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  MY_BOYS_DEVS_TOKEN_ABI,
  MY_BOYS_DEVS_TOKEN_ADDRESS,
} from "../constants";

/*
    getAmountOfTokensReceivedFromSwap:  Returns the number of Eth/MyBoysDevs tokens that can be received
    when the user swaps `_swapAmountWei` amount of Eth/MyBoysDevs tokens.
*/
export const getAmountOfTokensReceivedFromSwap = async (
  _swapAmountWei,
  provider,
  ethSelected,
  ethBalance,
  reservedMBD
) => {
  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    provider
  );
  let amountOfTokens;
  // If `Eth` is selected this means our input value is `Eth` which means our input amount would be
  // `_swapAmountWei`, the input reserve would be the `ethBalance` of the contract and output reserve
  // would be the `MyBoysDevs` token reserve
  if (ethSelected) {
    amountOfTokens = await exchangeContract.calculateOutputAmount(
      _swapAmountWei,
      ethBalance,
      reservedMBD
    );
  } else {
    // If `Eth` is not selected this means our input value is `MyBoysDevs` tokens which means our input amount would be
    // `_swapAmountWei`, the input reserve would be the `MyBoysDevs` token reserve of the contract and output reserve
    // would be the `ethBalance`
    amountOfTokens = await exchangeContract.calculateOutputAmount(
      _swapAmountWei,
      reservedMBD,
      ethBalance
    );
  }

  return amountOfTokens;
};

/*
  swapTokens: Swaps `swapAmountWei` of Eth/MyBoysDevs tokens with `tokenToBeReceivedAfterSwap` amount of Eth/MyBoysDevs tokens.
*/
export const swapTokens = async (
  signer,
  swapAmountWei,
  tokenToBeReceivedAfterSwap,
  ethSelected
) => {
  // Create a new instance of the exchange contract
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
  );
  const tokenContract = new Contract(
    MY_BOYS_DEVS_TOKEN_ADDRESS,
    MY_BOYS_DEVS_TOKEN_ABI,
    signer
  );
  let tx;
  // If Eth is selected call the `ethToMyBoysDevsToken` function else
  // call the `myBoysDevsTokenToEth` function from the contract
  // As you can see you need to pass the `swapAmount` as a value to the function because
  // it is the ether we are paying to the contract, instead of a value we are passing to the function
  if (ethSelected) {
    tx = await exchangeContract.exchangeEthToToken(
      tokenToBeReceivedAfterSwap,
      MY_BOYS_DEVS_TOKEN_ADDRESS,
      {
        value: swapAmountWei,
      }
    );
  } else {
    // User has to approve `swapAmountWei` for the contract because `MyBoysDevs` token
    // is an ERC20
    tx = await tokenContract.approve(
      EXCHANGE_CONTRACT_ADDRESS,
      swapAmountWei.toString()
    );
    await tx.wait();
    // call myBoysDevsTokenToEth function which would take in `swapAmountWei` of `MyBoysDevs` tokens and would
    // send back `tokenToBeReceivedAfterSwap` amount of `Eth` to the user
    tx = await exchangeContract.exchangeTokenToEth(
      swapAmountWei,
      tokenToBeReceivedAfterSwap,
      MY_BOYS_DEVS_TOKEN_ADDRESS
    );
  }
  await tx.wait();
};
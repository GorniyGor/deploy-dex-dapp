import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  MY_BOYS_DEVS_TOKEN_ABI,
  MY_BOYS_DEVS_TOKEN_ADDRESS,
} from "../constants";

/**
 * getEtherBalance: Retrieves the ether balance of the user or the contract
 */
export const getEtherBalance = async (provider, address, contract = false) => {
  try {
    // If the caller has set the `contract` boolean to true, retrieve the balance of
    // ether in the `exchange contract`, if it is set to false, retrieve the balance
    // of the user's address
    if (contract) {
      const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
      return balance;
    } else {
      const balance = await provider.getBalance(address);
      return balance;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

/**
 * getMBDTokensBalance: Retrieves the MyBoysDevs tokens in the account
 * of the provided `address`
 */
export const getMBDTokensBalance = async (provider, address) => {
  try {
    const tokenContract = new Contract(
      MY_BOYS_DEVS_TOKEN_ADDRESS,
      MY_BOYS_DEVS_TOKEN_ABI,
      provider
    );
    const balanceOfMyBoysDevsTokens = await tokenContract.balanceOf(address);
    return balanceOfMyBoysDevsTokens;
  } catch (err) {
    console.error(err);
  }
};

/**
 * getLPTokensBalance: Retrieves the amount of LP tokens in the account
 * of the provided `address`
 */
export const getLPTokensBalance = async (provider, address) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
    const balanceOfLPTokens = await exchangeContract.balanceOf(address);
    return balanceOfLPTokens;
  } catch (err) {
    console.error(err);
  }
};

/**
 * getReserveOfMBDTokens: Retrieves the amount of MBD tokens in the
 * exchange contract address
 */
export const getReserveOfMBDTokens = async (provider) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
    const {0:token, 1:reserve} = await exchangeContract.getTokenAndReserve(MY_BOYS_DEVS_TOKEN_ADDRESS);
    return reserve;
  } catch (err) {
    console.error(err);
  }
};
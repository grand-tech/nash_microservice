// import { contractKit } from './contract.kit.utils';
// import { StableTokenWrapper } from '@celo/contractkit/lib/wrappers/StableTokenWrapper';
// import { StableToken } from '@celo/contractkit';
// import BigNumber from 'bignumber.js';
// import { WalletBalance, getBalance, isKey } from './account.balance.utils';

// /**
//  * The expected results of the gas estimation operation.
//  */
// export interface GasEstimate {
//   token: string;
//   gasFees: string;
// }

// /**
//  * Calculates the gas fees checks if the user balance is enough to pay.
//  * @returns the gas fees and a token who`s balance exceeds it.
//  */
// export async function estimateGasFees(myAddress: string): Promise<GasEstimate> {
//   const balances: WalletBalance = await getBalance(myAddress);
//   for (const key in balances) {
//     if (isKey(balances, key)) {
//       const tokenContract: StableTokenWrapper =
//         await contractKit.contracts.getStableToken(StableToken[key]);
//       const gasFees: BigNumber = await fetchGasPrice(tokenContract.address);
//       const gasFeesWei = gasFees.dividedBy(10 ** 18);
//       const balance: number = balances[key];
//       if (balance >= gasFeesWei.toNumber()) {
//         return {
//           token: tokenContract.address,
//           gasFees: gasFees.toString(),
//         };
//       }
//     }
//   }
//   // TODO: add celo token if need be.
//   return {
//     token: '',
//     gasFees: '0',
//   };
// }

// /**
//  * Fetch gas fees estimate.
//  * @param tokenAddress token used as gas fees (at this point still using CELO).
//  * @returns the gas price estimate.
//  */
// export async function fetchGasPrice(tokenAddress: string): Promise<BigNumber> {
//   // improve gas estimation algorithm to pick gas price token based on balance.
//   const gasPriceMinimum = await contractKit.contracts.getGasPriceMinimum();
//   const latestGasPrice = await gasPriceMinimum?.getGasPriceMinimum(
//     tokenAddress,
//   );
//   const inflatedGasPrice = latestGasPrice?.times(5) ?? new BigNumber(0);
//   return inflatedGasPrice;
// }

// // /**
// //  * Sends a certain amount of cREAL to a specified address.
// //  * @param senderAddress the senders address.
// //  * @param recipientAddress the address receiving the funds
// //  * @param amount the number of tokens to be sent in wei.
// //  * @returns the transaction receipt.
// //  */
// // export async function sendCREAL(
// //   senderAddress: string,
// //   recipientAddress: string,
// //   amount: string,
// // ): Promise<CeloTxReceipt> {
// //   let cREALToken = await contractKit.contracts.getStableToken(
// //     StableToken.cREAL,
// //   );
// //   let cUSDtx = await cREALToken
// //     ?.transfer(recipientAddress, amount)
// //     .sendAndWaitForReceipt({
// //       from: senderAddress,
// //       feeCurrency: cREALToken?.address,
// //     });
// // //   return cUSDtx;
// // // }

// // /**
// //  * Signs and sends the composed transaction object.
// //  * @param txObject the transaction object.
// //  * @returns receipt.
// //  */
// // export async function sendTransactionObject(
// //   txObject: CeloTxObject<any>,
// //   senderAccount: string,
// //   gasEstimate: GasEstimate,
// // ): Promise<CeloTxReceipt> {
// //   let txResult = await contractKit.sendTransactionObject(txObject, {
// //     from: senderAccount,
// //     feeCurrency: gasEstimate.token,
// //     gasPrice: gasEstimate.gasFees,
// //   });

// //   let receipt = await txResult.waitReceipt();
// //   return receipt;
// // }

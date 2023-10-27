import { ERROR_MSG } from '../constants/error';
import { unsalt } from './data';

// * Rest libraries
import { requestVerifyCNFT } from '../rest/client.rest';
import { requestPullTransactions } from '../rest/client.rest';
import { CLIENT_PATH } from '../rest/client.path';

/**
 *
 * @param {String} did - did of wrapped document
 * @return {Promise}
 */
export const pullTransactions = async (did) => {
  try {
    const transactions = await requestPullTransactions(CLIENT_PATH.PULL_TRANSACTIONS, { did });
    let formatTransactions = [];
    for (let i = 0; i < transactions?.data.length; i++) {
      let filteredTransaction = await filterTransaction(transactions.data[i]);
      formatTransactions = [...formatTransactions, filteredTransaction];
    }
    return formatTransactions;
  } catch (e) {
    throw ERROR_MSG.CANNOT_PULL_TRANSACTIONS;
  }
};

/**
 * @param {Object} data
 * @return {Promise}
 */
const filterTransaction = async (data) => {
  let status = 'Revoked';
  try {
    const verifyRes = await requestVerifyCNFT(
      CLIENT_PATH.VERIFY_CNFT,
      {
        hashOfDocument: data?.signature?.targetHash,
        policyId: data?.mintingNFTConfig?.policy?.id,
      },
    );
    if (verifyRes?.data?.asset) {
      status = 'Issued';
    }
    return {
      fileName: unsalt(data?.data?.fileName),
      documentHash: data?.signature?.targetHash,
      policyId: data?.mintingNFTConfig?.policy?.id,
      status: status,
    };
  } catch (e) {
    throw e;
  }
};

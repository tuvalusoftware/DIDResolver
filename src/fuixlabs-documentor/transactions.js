// * Constants libraries
import { GENERAL_ERROR } from './constants/error';
import { COMPANY_NAME } from 'constants/app';

// * Utilities libraries
import { pullTransactions } from './utils/transaction';
import { generateDid } from './utils/did';

// * Rest libraries
import { getDidDocumentByDid } from './rest/client.rest';
import { CLIENT_PATH } from './rest/client.path';

/**
 * Get all transactions of current user
 * @param {String}
 */
export const getTransactions = async (address) => {
  if (!address) throw GENERAL_ERROR.MISSING_ADDRESS;
  try {
    const { formatTransactions } = await pullTransactions(generateDid(COMPANY_NAME, address));
    return formatTransactions;
  } catch (e) {
    throw e;
  }
};

/**
 * Get wrapped document content by did of wrapped document
 * @param {Array} transactions - list of transaction which get from cardano service rely on user did
 * @return {Promise}
 */
export const getWrappedDocumentsContent = async (transactions) => {
  const getValue = 'doc';
  const wrappedDocumentsContent = [];
  for (let index = 0; index < transactions.length; index++) {
    try {
      let wrappedDocument = await getDidDocumentByDid(CLIENT_PATH.GET_DID_DOCUMENT_BY_DID, {
        did: `did:fuixlabs:${COMPANY_NAME}:${transactions[index]?.fileName}`,
        exclude: getValue,
      });
      wrappedDocumentsContent.push(wrappedDocument?.data?.wrappedDoc);
    } catch (e) {
      throw GENERAL_ERROR.CANNOT_GET_INFORMATION_OF_WRAPPED_DOCUMENT;
    }
  }
  return wrappedDocumentsContent;
};

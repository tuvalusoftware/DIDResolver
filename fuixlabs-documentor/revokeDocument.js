// * Constant libraries
import { GENERAL_ERROR } from './constants/error';

// * Rest libraries
import { CLIENT_PATH } from './rest/client.path';
import { requestRevokeDocument } from './rest/client.rest';

/**
 * Function used for revoke document with document object, current user's public key
 * @param {Object} config - Config object used for deleting or updating document
 * @return {Promise} - Promise object includes deleting document result
 */
export const revokeDocument = async (config) => {
  try {
    if (!config) {
      throw GENERAL_ERROR.MISSING_PARAMETERS;
    }
    const revokeResult = await requestRevokeDocument(CLIENT_PATH.REVOKE_DOCUMENT, {
      data: {
        config: config,
      },
    });
    if (revokeResult?.data?.code === 1) throw revokeResult?.data;
    return {
      result: true,
    };
  } catch (e) {
    throw e;
  }
};

exports.errorMissingParameters = {
  value: {
    errorCode: 400,
    errorMessage: "Bad request. Missing parameters.",
    detail: "Not found: did"
  }
}
exports.errorInvalidInput = {
  value: {
    errorCode: 400,
    errorMessage: "Bad request. Invalid input syntax.",
    detail: ""
  }
}
exports.errorUnauthorized = {
  value: {
    errorCode: 401,
    errorMessage: "Unauthorized. Access token is invalid."
  }
}
exports.errorPermissionDenied = {
  value: {
    errorCode: 403,
    errorMessage: "Forbidden. Permission denied."
  }
}
exports.errorUnverifiedSignature = {
  value: {
    error: 403,
    errorMessage: "Forbidden. Signature is not verified."
  }
}
exports.errorNotFound = {
  value: {
    errorCode: 404,
    errorMessage: "Not found. Resource is not found."
  }
}
exports.errorAlreadyExisted = {
  value: {
    errorCode: 409,
    errorMessage: "Conflict. Resource already exsited."
  }
}
exports.errorMintNFT = {
  value: {
    errorCode: 500,
    errorMessage: "Error. Cannot mint NFT."
  }
}
exports.errorFetchNFT = {
  value: {
    errorCode: 400,
    errorMessage: "Bad request. Cannot fetch NFT metadata. Check your assetId or policyId."
  }
}
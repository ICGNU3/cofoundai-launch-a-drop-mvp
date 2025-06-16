
export function identifyErrorType(rawMsg: string) {
  let code: string | undefined;
  let isUserRejection: boolean | undefined = false;

  if (
    /user (denied|rejected)/i.test(rawMsg) ||
    /rejected by user/i.test(rawMsg)
  ) {
    code = "USER_REJECTED";
    isUserRejection = true;
  } else if (/insufficient/i.test(rawMsg)) {
    code = "INSUFFICIENT_FUNDS";
  } else if (/gas/i.test(rawMsg)) {
    code = "GAS_ERROR";
  } else if (/network/i.test(rawMsg)) {
    code = "NETWORK";
  } else if (/contract|smart contract/i.test(rawMsg)) {
    code = "CONTRACT";
  } else {
    code = "SYSTEM";
  }

  return { code, isUserRejection };
}

export function logMintingError(error: any) {
  console.error('[MINTING_ERROR_LOG]', {
    message: error?.message || "An error occurred",
    code: error?.code,
    txHash: error?.txHash,
    date: new Date().toISOString(),
  });
}

function hashToBuffer(hash) {
  if (Buffer.isBuffer(hash) && hash.length === 32) {
    return hash;
  } else {
    return Buffer.from(hash, "hex");
  }
}

/**
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 */
function bufSortJoin(...args) {
  return Buffer.concat([...args].sort(Buffer.compare));
}


/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 */
function combineHashBuffers(first, second) {
  if (!second) {
    return first;
  }
  if (!first) {
    return second;
  }
  
  const sortedAndJoinedBuffer = bufSortJoin(first, second);
  const keccakHash = keccak256(sortedAndJoinedBuffer);
  return hashToBuffer(keccakHash);
}

export {
  hashToBuffer,
  bufSortJoin,
  combineHashBuffers
}
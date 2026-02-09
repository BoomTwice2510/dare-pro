import { Dare, DareStatus } from './types';
import { toHex, pad, slice, hexToString } from 'viem';

const STATUS_LABELS = {
  0: 'Open',
  1: 'Running',
  2: 'ProofSubmitted',
  3: 'Disputed',
  4: 'Resolved',
  5: 'Cancelled',
};

/**
 * Encodes the function call for dares(uint256 id)
 * Function signature: dares(uint256) -> returns tuple with dare data
 */
export function encodeGetDareCall(dareId: number): string {
  // keccak256("dares(uint256)") = 0xf23f35c0
  const functionSelector = '0xf23f35c0';
  const paddedId = pad(toHex(dareId), { size: 32 });
  return functionSelector + paddedId.slice(2);
}

/**
 * Maps the Status enum from contract to DareStatus
 */
function mapContractStatusToDareStatus(status: number): DareStatus {
  switch (status) {
    case 0:
      return DareStatus.Open;
    case 1:
      return DareStatus.Running;
    case 2:
      return DareStatus.ProofSubmitted;
    case 3:
      return DareStatus.Disputed;
    case 4:
      return DareStatus.Resolved;
    case 5:
      return DareStatus.Cancelled;
    default:
      return DareStatus.Open;
  }
}

/**
 * Decodes the raw contract response for a dare
 * The dares() function returns a tuple with these fields in order:
 * (address creator, address accepter, string description, address token, uint256 stake,
 *  uint256 createdAt, uint256 deadline, bool accepted, bool proofSubmitted,
 *  string proofURI, uint256 proofTime, bool resolved, uint8 status)
 */
export function decodeDareData(dareId: number, encodedData: string): Dare {
  try {
    console.log(`[v0] Decoding dare ${dareId}:`, encodedData.slice(0, 100) + '...');

    // Remove '0x' prefix if present
    const data = encodedData.startsWith('0x') ? encodedData.slice(2) : encodedData;

    // Parse the tuple response
    // Since this is complex tuple with strings, we need to parse the ABI-encoded data carefully
    let offset = 0;

    // Helper to extract 32-byte chunks
    const getBytes32 = () => {
      const chunk = data.slice(offset, offset + 64);
      offset += 64;
      return '0x' + chunk;
    };

    // Helper to extract address (20 bytes = 40 hex chars, padded to 64)
    const getAddress = () => {
      const hex = getBytes32();
      return '0x' + hex.slice(-40);
    };

    // Helper to extract uint256
    const getUint256 = () => {
      return BigInt(getBytes32());
    };

    // Helper to extract bool
    const getBool = () => {
      return BigInt(getBytes32()) !== 0n;
    };

    // Helper to extract dynamic string
    const getString = () => {
      const pointerOffset = Number(getUint256()) * 2;
      const lengthHex = data.slice(pointerOffset, pointerOffset + 64);
      const length = parseInt(lengthHex, 16);
      const stringHex = data.slice(pointerOffset + 64, pointerOffset + 64 + length * 2);
      return Buffer.from(stringHex, 'hex').toString('utf-8');
    };

    // Parse fields in order (accounting for dynamic types)
    const creator = getAddress();
    const accepter = getAddress();

    // For dynamic types, we need to jump to them based on pointer offsets
    // This is a simplified approach - in production, use ethers.js or viem AbiCoder
    const descriptionPointer = Number(getUint256());
    const token = getAddress();
    const stake = getUint256();
    const createdAt = getUint256();
    const deadline = getUint256();
    const accepted = getBool();
    const proofSubmitted = getBool();

    // Parse description from the offset
    const descriptionOffsetInData = descriptionPointer * 2;
    const descriptionLengthHex = data.slice(descriptionOffsetInData, descriptionOffsetInData + 64);
    const descriptionLength = parseInt(descriptionLengthHex, 16);
    const descriptionHex = data.slice(
      descriptionOffsetInData + 64,
      descriptionOffsetInData + 64 + descriptionLength * 2
    );
    const description = Buffer.from(descriptionHex, 'hex').toString('utf-8');

    // Get remaining fields from the end of the data
    const proofURIPointer = Number(getUint256());
    const proofTime = getUint256();
    const resolved = getBool();
    
    // Extract status as uint8 (last field)
    const statusByte = data.slice(offset, offset + 64);
    const statusValue = parseInt(statusByte, 16);
    const status = mapContractStatusToDareStatus(statusValue);

    // Parse proofURI from pointer
    let proofURI = '';
    if (proofURIPointer > 0) {
      const proofURIOffsetInData = proofURIPointer * 2;
      const proofURILengthHex = data.slice(proofURIOffsetInData, proofURIOffsetInData + 64);
      const proofURILength = parseInt(proofURILengthHex, 16);
      if (proofURILength > 0) {
        const proofURIHex = data.slice(
          proofURIOffsetInData + 64,
          proofURIOffsetInData + 64 + proofURILength * 2
        );
        proofURI = Buffer.from(proofURIHex, 'hex').toString('utf-8');
      }
    }

    console.log(`[v0] Decoded dare ${dareId}:`, {
      id: dareId,
      creator,
      accepter,
      description: description.slice(0, 50),
      token,
      stake: stake.toString(),
      status: statusValue,
      statusLabel: STATUS_LABELS[status],
      accepted,
      proofSubmitted,
    });

    return {
      id: dareId,
      creator,
      accepter,
      description,
      token,
      stake,
      createdAt: Number(createdAt) * 1000, // Convert to milliseconds
      deadline: Number(deadline) * 1000,
      accepted,
      proofSubmitted,
      proofURI,
      proofTime: Number(proofTime) * 1000,
      resolved,
      status,
    };
  } catch (error) {
    console.error(`[v0] Error decoding dare ${dareId}:`, error);
    // Return empty dare on decode error
    return {
      id: dareId,
      creator: '0x0000000000000000000000000000000000000000',
      accepter: '0x0000000000000000000000000000000000000000',
      description: 'Error loading dare',
      token: '0x0000000000000000000000000000000000000000',
      stake: 0n,
      createdAt: 0,
      deadline: 0,
      accepted: false,
      proofSubmitted: false,
      proofURI: '',
      proofTime: 0,
      resolved: false,
      status: DareStatus.Open,
    };
  }
}

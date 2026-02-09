# DARE Protocol Smart Contract Guide

## Overview

DARE Protocol is a non-custodial smart contract system for onchain commitments.

**Contract Address**: `0xA350dDf25f6851EDe98A59E92977Dd6Fe5Fd3C6D` (Base Sepolia)

## Core Concepts

### Dare

A dare is a public commitment with economic incentives.

```solidity
struct Dare {
    address creator;
    address accepter;
    string description;
    address token;
    uint256 stake;
    uint256 createdAt;
    uint256 deadline;
    bool accepted;
    bool proofSubmitted;
    string proofURI;
    uint256 proofTime;
    bool resolved;
    Status status;
}
```

### Status Enum

```
0 = Open       (Waiting for accepter)
1 = Running    (Accepted, in progress)
2 = ProofSubmitted (Accepter submitted proof)
3 = Disputed   (Creator disputed proof, judge needed)
4 = Resolved   (Winner determined, funds distributed)
5 = Cancelled  (Creator cancelled before acceptance)
```

### Badge Enum

```
0 = NONE   (No badge)
1 = BRONZE (100+ XP)
2 = SILVER (500+ XP)
3 = GOLD   (1000+ XP)
```

## Function Reference

### Write Functions (State-Changing)

#### createDare

Create a new dare.

```solidity
function createDare(
    string calldata _description,
    uint256 _duration,
    address _token,
    uint256 _stake
) external payable
```

**Parameters**:
- `_description`: Dare description (must not be empty)
- `_duration`: Duration in seconds (must be > 0)
- `_token`: Token address (address(0) for ETH)
- `_stake`: Stake amount

**Notes**:
- If `_token == address(0)`, must send ETH as `msg.value == _stake`
- If `_token != address(0)`, must approve and transfer ERC20
- Emits `DareCreated` event

**Example** (Creating a 7-day dare with 0.1 ETH):
```javascript
createDare(
  "Run 5km in under 30 minutes",
  604800,  // 7 days in seconds
  "0x0000000000000000000000000000000000000000",  // ETH
  parseEther("0.1")
)
// Send value: 0.1 ETH
```

---

#### acceptDare

Accept an open dare with matching stake.

```solidity
function acceptDare(uint256 _id) external payable
```

**Parameters**:
- `_id`: Dare ID to accept

**Requirements**:
- Dare status must be Open
- Sender cannot be creator
- Must send equal stake as creator

**Notes**:
- Changes dare status to Running
- Emits `DareAccepted` event

---

#### cancelDare

Cancel your own dare before it's accepted.

```solidity
function cancelDare(uint256 _id) external
```

**Requirements**:
- Sender must be creator
- Dare status must be Open

**Notes**:
- Refunds creator's stake
- Changes status to Cancelled

---

#### submitProof

Submit proof after deadline (accepter only).

```solidity
function submitProof(
    uint256 _id,
    string calldata _proofURI
) external
```

**Parameters**:
- `_id`: Dare ID
- `_proofURI`: URI pointing to proof (IPFS, HTTP, etc.)

**Requirements**:
- Sender must be accepter
- Dare status must be Running
- Current time must be >= deadline
- Proof URI must not be empty

**Notes**:
- Changes status to ProofSubmitted
- Emits `ProofSubmitted` event

---

#### approveProof

Creator approves proof and accepter wins.

```solidity
function approveProof(uint256 _id) external
```

**Requirements**:
- Sender must be creator
- Dare status must be ProofSubmitted

**Notes**:
- Resolves dare immediately
- Winner (accepter) gets full pool
- Emits `DareResolved` event

---

#### disputeProof

Creator disputes proof, requires judge.

```solidity
function disputeProof(uint256 _id) external
```

**Requirements**:
- Sender must be creator
- Dare status must be ProofSubmitted

**Notes**:
- Changes status to Disputed
- Only judge can resolve
- Emits `DareDisputed` event

---

#### autoResolve

Auto-resolve proof if confirmation window passes.

```solidity
function autoResolve(uint256 _id) external
```

**Requirements**:
- Dare status must be ProofSubmitted
- Current time > proofTime + CONFIRM_WINDOW (24 hours)

**Notes**:
- Anyone can call this
- Accepter wins
- Emits `DareResolved` event

---

#### judgeResolve

Judge resolves disputed dare.

```solidity
function judgeResolve(uint256 _id, address _winner) external
```

**Requirements**:
- Sender must be judge
- Dare status must be Disputed

**Parameters**:
- `_id`: Dare ID
- `_winner`: Address of winner (creator or accepter)

**Notes**:
- Only judge can call
- Emits `DareResolved` event

---

### Read Functions (View-Only)

#### dareCount

Get total number of dares.

```solidity
function dareCount() external view returns (uint256)
```

---

#### dares

Get dare details by ID.

```solidity
function dares(uint256) external view returns (Dare)
```

**Returns**: Complete Dare struct

---

#### xp

Get XP for an address.

```solidity
function xp(address) external view returns (int256)
```

---

#### badge

Get badge for an address.

```solidity
function badge(address) external view returns (Badge)
```

**Returns**: 0=NONE, 1=BRONZE, 2=SILVER, 3=GOLD

---

#### judge

Get judge address.

```solidity
function judge() external view returns (address)
```

---

#### treasury

Get treasury address.

```solidity
function treasury() external view returns (address)
```

---

#### protocolFeeBps

Get protocol fee in basis points (0-10000).

```solidity
function protocolFeeBps() external view returns (uint256)
```

**Example**: 100 bps = 1% fee

---

#### CONFIRM_WINDOW (Constant)

Get confirmation window duration.

```solidity
function CONFIRM_WINDOW() external view returns (uint256)
```

**Value**: 86400 (24 hours)

---

#### XP_WIN (Constant)

Get XP awarded per win.

```solidity
function XP_WIN() external view returns (uint256)
```

**Value**: 100

---

## Events

### DareCreated

```solidity
event DareCreated(uint256 indexed id, address creator);
```

---

### DareAccepted

```solidity
event DareAccepted(uint256 indexed id, address accepter);
```

---

### DareCancelled

```solidity
event DareCancelled(uint256 indexed id);
```

---

### ProofSubmitted

```solidity
event ProofSubmitted(uint256 indexed id, string proofURI);
```

---

### DareDisputed

```solidity
event DareDisputed(uint256 indexed id);
```

---

### DareResolved

```solidity
event DareResolved(uint256 indexed id, address winner);
```

---

### BadgeUpdated

```solidity
event BadgeUpdated(address indexed user, Badge badge);
```

---

## Common Workflows

### Creating and Winning a Dare

1. **Creator** calls `createDare()`
   - Dare becomes Open
   - Creator's stake locked
   - Emit DareCreated

2. **Accepter** calls `acceptDare()`
   - Dare becomes Running
   - Accepter's stake locked
   - Emit DareAccepted

3. **Accepter** waits until deadline
4. **Accepter** calls `submitProof(proofURI)`
   - Dare becomes ProofSubmitted
   - Emit ProofSubmitted

5. **Creator** either:
   - Calls `approveProof()` → Accepter wins immediately
   - Calls `disputeProof()` → Dare becomes Disputed

6. If approved:
   - Accepter receives full pool
   - Accepter XP += 100
   - Emit DareResolved

### Disputed Dare Flow

1. Creator disputes proof (DareDisputed)
2. Judge examines proof URI and dare context
3. Judge calls `judgeResolve(id, winnerAddress)`
4. Winner receives full pool
5. Winner XP += 100

### Auto-Resolve Flow

1. Accepter submits proof
2. Creator doesn't dispute for 24 hours
3. Anyone can call `autoResolve()`
4. Accepter wins automatically
5. Emit DareResolved

---

## Fee Calculation

When dare resolves:

```
totalStake = stake * 2  (creator + accepter)
fee = (totalStake * protocolFeeBps) / 10000
payout = totalStake - fee
```

**Current**: protocolFeeBps = 0 (no fees), so payout = totalStake

---

## Security Properties

1. **Non-Custodial**: Smart contract never holds funds longer than resolution
2. **Deterministic**: All outcomes follow explicit onchain rules
3. **Transparent**: All events logged and queryable
4. **Fair**: Only creator/accepter/judge can act on a dare
5. **Verifiable**: All state changes emit events

---

## Usage Tips

1. **Proof URI**: Can be IPFS hash, Twitter link, GitHub commit, etc.
2. **Description**: Be specific about success criteria
3. **Duration**: Allow reasonable time for completion
4. **Stake**: Higher stakes increase credibility
5. **Dispute Window**: 24 hours to review and dispute
6. **Judge Transparency**: Check judge address before disputing

---

## Gotchas & Considerations

1. ❌ Cannot cancel after acceptance
2. ❌ Cannot withdraw stake before resolution
3. ❌ Proof URIs are public forever
4. ❌ Disputes require judge evaluation (not automatic)
5. ✅ XP is non-transferable and permanent
6. ✅ All dares are public
7. ✅ ETH and ERC20 supported
8. ✅ Onchain timestamps used (chain-dependent)

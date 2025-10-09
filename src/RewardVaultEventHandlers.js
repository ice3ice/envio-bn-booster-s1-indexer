const { RewardVault } = require("../generated");

RewardVault.RewardsClaimed.handler(async ({ event, context }) => {
  const { claimId, projectId, token, amount, recipient, expireTime } = event.params;

  const id = event.transaction.hash.toString().toLowerCase();

  console.log(`RewardsClaimed for ${id} at blockTimestamp ${event.block.timestamp}`);

  const claimEntity = {
    id: id,
    claimId: [claimId],
    projectId: [projectId],
    token: [token],
    totalAmount: [amount],
    recipient,
    expireTime,
    blockTimestamp: event.block.timestamp,
  };

  context.Claim.set(claimEntity);
});

RewardVault.RewardsClaimedV2.handler(async ({ event, context }) => {
  const { claimId: claimIds, projectId: projectIds, token: tokens, totalAmount: totalAmounts, recipient, expireTime } = event.params;

  const id = event.transaction.hash.toString().toLowerCase();

  console.log(`RewardsClaimedV2 for ${id} at blockTimestamp ${event.block.timestamp}`);

  const claimEntity = {
    id,
    claimId: claimIds,
    projectId: projectIds,
    token: tokens,
    totalAmount: totalAmounts,
    recipient,
    expireTime,
    blockTimestamp: event.block.timestamp,
  };

  context.Claim.set(claimEntity);

  if (claimIds.length > 1 || projectIds.length > 1 || tokens.length > 1 || totalAmounts.length > 1) {
    const specificEntity = {
      id,
      claimId: id,
    };

    context.Specific.set(specificEntity);
  }
});


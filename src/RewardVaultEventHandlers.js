const { RewardVault } = require("../generated");

const { uidHash } = require("./utils");

RewardVault.RewardsClaimed.handler(async ({ event, context }) => {
  const { projectId, token, amount, recipient } = event.params;

  console.log(`RewardsClaimed for ${recipient} at blockTimestamp ${event.block.timestamp}`);

  const id = uidHash(recipient, token);

  let userClaimEntity = await context.UserClaim.get(id);
  if (!userClaimEntity) {
    userClaimEntity = {
      id: id,
      recipient: recipient,
      token: token,
      projectId: projectId,
      amount: amount,
      claimCount: 1,
      blockTimestamp: event.block.timestamp,
    };
  } else {
    userClaimEntity.amount = userClaimEntity.amount + amount;
    userClaimEntity.claimCount = userClaimEntity.claimCount + BigInt(1);
    userClaimEntity.blockTimestamp = event.block.timestamp;
  }

  context.UserClaim.set(userClaimEntity);
});

RewardVault.RewardsClaimedV2.handler(async ({ event, context }) => {
  const { projectId: projectIds, token: tokens, totalAmount: totalAmounts, recipient } = event.params;

  console.log(`RewardsClaimed for ${recipient} at blockTimestamp ${event.block.timestamp}`);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const totalAmount = totalAmounts[i];
    const projectId = projectIds[i];

    const id = uidHash(recipient, token);

    let userClaimEntity = await context.UserClaim.get(id);
    if (!userClaimEntity) {
      userClaimEntity = {
        id: id,
        recipient: recipient,
        token: token,
        projectId: projectId,
        amount: totalAmount,
        claimCount: 1,
        blockTimestamp: event.block.timestamp,
      };
    } else {
      userClaimEntity.amount = userClaimEntity.amount + totalAmount;
      userClaimEntity.claimCount = userClaimEntity.claimCount + BigInt(1);
      userClaimEntity.blockTimestamp = event.block.timestamp;
    }

    context.UserClaim.set(userClaimEntity);
  }
});

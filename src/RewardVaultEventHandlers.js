const { RewardVault } = require("../generated");

const { eligibleToken, eligibleProject, uidHash } = require("./utils");


RewardVault.RewardsClaimed.handler(async ({ event, context }) => {
  const { projectId, token, amount, recipient } = event.params;

  // console.log(`RewardsClaimed for ${recipient} at blockTimestamp ${event.block.timestamp}`);

  // if (!eligibleToken(token)) {
  //   return;
  // }

  if (!eligibleProject(projectId)) {
    return;
  }

  const id = uidHash(recipient, token);

  let userClaimEntity = await context.UserClaim.get(id);
  if (!userClaimEntity) {
    userClaimEntity = {
      id: id,
      recipient: recipient,
      token: token,
      projectId: projectId,
      amount: amount,
      claimCount: 1n,
      blockTimestamp: event.block.timestamp,
    };
  } else {
    userClaimEntity.amount = userClaimEntity.amount + amount;
    userClaimEntity.claimCount = userClaimEntity.claimCount + 1n;
    userClaimEntity.blockTimestamp = event.block.timestamp;
  }

  let userClaimStatsEntity = await context.UserClaimStats.get(recipient);
  if (!userClaimStatsEntity) {
    userClaimStatsEntity = {
      id: recipient,
      tokens: [token],
      claimCount: 1n,
      blockTimestamp: event.block.timestamp,
    };
  } else if (!userClaimStatsEntity.tokens.includes(token)) {
    userClaimStatsEntity.tokens.push(token);
    userClaimStatsEntity.claimCount = userClaimStatsEntity.claimCount + 1n;
    userClaimStatsEntity.blockTimestamp = event.block.timestamp;
  } else {
    userClaimStatsEntity.blockTimestamp = event.block.timestamp;
  }

  context.UserClaim.set(userClaimEntity);
  context.UserClaimStats.set(userClaimStatsEntity);

  // insert into TokenToProjectId
  const tpid = uidHash(token, projectId.toString());
  console.log(`Inserting into TokenToProjectId: ${tpid} for token ${token} and projectId ${projectId}`);
  let tokenToProjectIdEntity = await context.TokenToProjectId.get(tpid);
  if (!tokenToProjectIdEntity) {
    tokenToProjectIdEntity = { id: tpid, token: token, projectId: projectId };
  }
  context.TokenToProjectId.set(tokenToProjectIdEntity);
});

RewardVault.RewardsClaimedV2.handler(async ({ event, context }) => {
  const { projectId: projectIds, token: tokens, totalAmount: totalAmounts, recipient } = event.params;

  // console.log(`RewardsClaimed for ${recipient} at blockTimestamp ${event.block.timestamp}`);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const totalAmount = totalAmounts[i];
    const projectId = projectIds[i];

    // if (!eligibleToken(token)) {
    //   continue;
    // }

    if (!eligibleProject(projectId)) {
      continue;
    }

    const id = uidHash(recipient, token);

    let userClaimEntity = await context.UserClaim.get(id);
    if (!userClaimEntity) {
      userClaimEntity = {
        id: id,
        recipient: recipient,
        token: token,
        projectId: projectId,
        amount: totalAmount,
        claimCount: 1n,
        blockTimestamp: event.block.timestamp,
      };
    } else {
      userClaimEntity.amount = userClaimEntity.amount + totalAmount;
      userClaimEntity.claimCount = userClaimEntity.claimCount + 1n;
      userClaimEntity.blockTimestamp = event.block.timestamp;
    }

    let userClaimStatsEntity = await context.UserClaimStats.get(recipient);
    if (!userClaimStatsEntity) {
      userClaimStatsEntity = {
        id: recipient,
        tokens: [token],
        claimCount: 1n,
        blockTimestamp: event.block.timestamp,
      };
    } else if (!userClaimStatsEntity.tokens.includes(token)) {
      userClaimStatsEntity.tokens.push(token);
      userClaimStatsEntity.claimCount = userClaimStatsEntity.claimCount + 1n;
      userClaimStatsEntity.blockTimestamp = event.block.timestamp;
    } else {
      userClaimStatsEntity.blockTimestamp = event.block.timestamp;
    }

    context.UserClaim.set(userClaimEntity);
    context.UserClaimStats.set(userClaimStatsEntity);

    // insert into TokenToProjectId
    const tpid = uidHash(token, projectId.toString());
    console.log(`Inserting into TokenToProjectId: ${tpid} for token ${token} and projectId ${projectId}`);
    let tokenToProjectIdEntity = await context.TokenToProjectId.get(tpid);
    if (!tokenToProjectIdEntity) {
      tokenToProjectIdEntity = { id: tpid, token: token, projectId: projectId };
    }
    context.TokenToProjectId.set(tokenToProjectIdEntity);
  }
});

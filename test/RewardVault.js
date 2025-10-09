
const assert = require("assert");
const { MockDb, RewardVault } = require("../generated/src/TestHelpers.res.js");

describe("RewardVault contract event tests", () => {
  // Create mock db
  let mockDb = MockDb.createMockDb();

  it("RewardVault RewardsClaimed", async () => {
    const params = {
      claimId: 1,
      projectId: 1,
      token: "0x235B6fe22B4642aDa16D311855c49Ce7DE260841",
      amount: 10000,
      recipient: "0x73822216A80E4FF2dCB1477287c17e1c523F165a",
      expireTime: 1760019608,
    }

    const eventMock = RewardVault.RewardsClaimed.createMockEvent(params);

    mockDb = await RewardVault.RewardsClaimed.processEvent({
      event: eventMock,
      mockDb: mockDb,
    });

    const rewardVaultEntity = await mockDb.entities.Claim.get(
      eventMock.transaction.hash
    );

    assert.deepEqual(rewardVaultEntity, {
      id: eventMock.transaction.hash,
      claimId: [params.claimId],
      projectId: [params.projectId],
      token: [params.token],
      totalAmount: [params.amount],
      recipient: params.recipient,
      expireTime: params.expireTime,
      blockTimestamp: eventMock.block.timestamp
    });
  });


  it("RewardVault RewardsClaimedV2", async () => {
    const params = {
      claimId: [1, 2],
      projectId: [1],
      token: ["0x235B6fe22B4642aDa16D311855c49Ce7DE260841"],
      totalAmount: [10000],
      recipient: "0x73822216A80E4FF2dCB1477287c17e1c523F165a",
      expireTime: 1760019608,
    }

    const eventMock = RewardVault.RewardsClaimedV2.createMockEvent(params);

    mockDb = await RewardVault.RewardsClaimedV2.processEvent({
      event: eventMock,
      mockDb: mockDb,
    });

    const rewardVaultEntity = await mockDb.entities.Claim.get(
      eventMock.transaction.hash
    );

    assert.deepEqual(rewardVaultEntity, {
      id: eventMock.transaction.hash,
      claimId: params.claimId,
      projectId: params.projectId,
      token: params.token,
      totalAmount: params.totalAmount,
      recipient: params.recipient,
      expireTime: params.expireTime,
      blockTimestamp: eventMock.block.timestamp
    });

    const specificEntity = await mockDb.entities.Specific.get(
      eventMock.transaction.hash
    );

    assert.deepEqual(specificEntity, {
      id: eventMock.transaction.hash,
      claimId: eventMock.transaction.hash
    });
  });
});

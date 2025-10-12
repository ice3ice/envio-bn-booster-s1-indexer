
const assert = require("assert");
const { MockDb, RewardVault } = require("../generated/src/TestHelpers.res.js");

const { uidHash } = require("../src/utils");

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

    const id = uidHash(params.recipient, params.token);

    const rewardVaultEntity = await mockDb.entities.UserClaim.get(id);

    // console.log(rewardVaultEntity);

    assert.deepEqual(rewardVaultEntity, {
      id: id,
      recipient: params.recipient,
      token: params.token,
      projectId: params.projectId,
      amount: params.amount,
      claimCount: 1,
      blockTimestamp: eventMock.block.timestamp
    });
  });


  it("RewardVault RewardsClaimedV2", async () => {
    const params = {
      claimId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      projectId: [1, 2],
      token: ["0x235B6fe22B4642aDa16D311855c49Ce7DE260841", "0x235B6fe22B4642aDa16D311855c49Ce7DE260842"],
      totalAmount: [10000, 20000],
      recipient: "0x73822216A80E4FF2dCB1477287c17e1c523F165a",
      expireTime: 1760019608,
    }

    let id = uidHash(params.recipient, params.token[0]);
    let rewardVaultEntity = await mockDb.entities.UserClaim.get(id);
    const originalAmount = rewardVaultEntity ? rewardVaultEntity.amount : 0;

    const eventMock = RewardVault.RewardsClaimedV2.createMockEvent(params);

    mockDb = await RewardVault.RewardsClaimedV2.processEvent({
      event: eventMock,
      mockDb: mockDb,
    });

    id = uidHash(params.recipient, params.token[0]);
    rewardVaultEntity = await mockDb.entities.UserClaim.get(id);

    // console.log(rewardVaultEntity);

    assert.deepEqual(rewardVaultEntity, {
      id: id,
      recipient: params.recipient,
      token: params.token[0],
      projectId: params.projectId[0],
      amount: originalAmount + params.totalAmount[0],
      claimCount: 2,
      blockTimestamp: eventMock.block.timestamp
    });

    id = uidHash(params.recipient, params.token[1]);
    rewardVaultEntity = await mockDb.entities.UserClaim.get(id);

    // console.log(rewardVaultEntity);

    assert.deepEqual(rewardVaultEntity, {
      id: id,
      recipient: params.recipient,
      token: params.token[1],
      projectId: params.projectId[1],
      amount: params.totalAmount[1],
      claimCount: 1,
      blockTimestamp: eventMock.block.timestamp
    });
  });
});

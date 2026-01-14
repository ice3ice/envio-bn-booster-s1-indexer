/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
const { NodeStakingVault } = require("../generated");
const { getTaskCompleted } = require("./utils");

const INCREASED_AMOUNT = 1;
const DELEGATE_AMOUNT_1 = 1;
const DELEGATE_AMOUNT_2 = 2;
const DELEGATE_LOCKUP_PERIOD = 10 * 60;

NodeStakingVault.DelegateAmountIncreased.handler(async ({ event, context }) => {
  // console.log("event.transaction.hash", event.transaction);

  const amount = Number(BigInt(event.params.amount) / BigInt(10**18));

  if(amount !== INCREASED_AMOUNT) {
    return;
  }

  const newTotalAmount = Number(BigInt(event.params.newTotalAmount) / BigInt(10**18));

  const userHistory = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    operation: "Delegate More",
    amount: event.params.amount,
    period: 0,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash
  };

  // console.log("UserHistory from DelegateAmountIncreaseds", userHistory);

  context.UserHistory.set(userHistory);

  let userTaskCompleted = await context.UserTaskCompleted.get(event.params.user);
  if(!userTaskCompleted) {
    userTaskCompleted = {
      id: event.params.user,
      task1Completed: false,
      task2Completed: false,
    }
  }

  userTaskCompleted = getTaskCompleted(event.block.timestamp, newTotalAmount, userTaskCompleted);

  context.UserTaskCompleted.set(userTaskCompleted);
});

NodeStakingVault.DelegateUnstaked.handler(async ({ event, context }) => {
  const userHistory = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    operation: "Unstake Complete",
    amount: event.params.amount,
    period: 0,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash
  };

  // console.log("UserHistory from DelegateUnstakeds", userHistory);

  context.UserHistory.set(userHistory);
});

NodeStakingVault.DelegateUnstakingInitiated.handler(async ({ event, context }) => {
  const userHistory = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    operation: "Unstake Request",
    amount: event.params.cooldownAmount,
    period: 0,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash
  };

  // console.log("UserHistory from DelegateUnstakingInitiateds", userHistory);

  context.UserHistory.set(userHistory);
});

NodeStakingVault.Delegated.handler(async ({ event, context }) => {
  const amount = Number(BigInt(event.params.amount) / BigInt(10**18));
  const effectiveLockUpPeriod = Number(event.params.effectiveLockUpPeriod);

  if ((amount !== DELEGATE_AMOUNT_1 && amount !== DELEGATE_AMOUNT_2) || effectiveLockUpPeriod !== DELEGATE_LOCKUP_PERIOD) {
    return;
  }

  const userHistory = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    operation: "Delegate",
    amount: event.params.amount,
    period: event.params.effectiveLockUpPeriod,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash
  };

  // console.log("UserHistory from Delegateds", userHistory);

  context.UserHistory.set(userHistory);

  let userTaskCompleted = await context.UserTaskCompleted.get(event.params.user);
  if(!userTaskCompleted) {
    userTaskCompleted = {
      id: event.params.user,
      task1Completed: false,
      task2Completed: false,
    }
  }

  userTaskCompleted = getTaskCompleted(event.block.timestamp, amount, userTaskCompleted);

  context.UserTaskCompleted.set(userTaskCompleted);
});

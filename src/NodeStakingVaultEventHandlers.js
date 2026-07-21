/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { indexer } from "envio";
import { getTaskCompleted } from "./utils.js";

const INCREASED_AMOUNT = 230;
const DELEGATE_AMOUNT_1 = 220;
const DELEGATE_AMOUNT_2 = 450;
const DELEGATE_LOCKUP_PERIOD = 7 * 24 * 60 * 60;

indexer.onEvent(
  { contract: "NodeStakingVault", event: "DelegateAmountIncreased" },
  async ({ event, context }) => {
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
}
);

indexer.onEvent(
  { contract: "NodeStakingVault", event: "DelegateUnstaked" },
  async ({ event, context }) => {
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
}
);

indexer.onEvent(
  { contract: "NodeStakingVault", event: "DelegateUnstakingInitiated" },
  async ({ event, context }) => {
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
}
);

indexer.onEvent(
  { contract: "NodeStakingVault", event: "Delegated" },
  async ({ event, context }) => {
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
}
);

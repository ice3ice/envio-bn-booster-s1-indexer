const taskTimestamps = {
  task1StartTime: 1776652500,
  task1EndTime: 1776653100,
  task2StartTime: 1776653400,
  task2EndTime: 1776654000
}

const DELEGATE_AMOUNT_1 = 1;
const DELEGATE_AMOUNT_2 = 2;

const getTaskCompleted = (timestamp, amount, userTaskCompleted) => {
  // Task 1
  if(timestamp >= taskTimestamps.task1StartTime && timestamp <= taskTimestamps.task1EndTime && amount >= DELEGATE_AMOUNT_1) {
    userTaskCompleted.task1Completed = true;
    return userTaskCompleted;
  // Task 2
  } else if(timestamp >= taskTimestamps.task2StartTime && timestamp <= taskTimestamps.task2EndTime && amount >= DELEGATE_AMOUNT_2) {
    userTaskCompleted.task2Completed = true;
    return userTaskCompleted;
  }

  return userTaskCompleted;
}

module.exports = {
  getTaskCompleted,
};
const taskTimestamps = {
  task1StartTime: 1776758400,
  task1EndTime: 1776758700,
  task2StartTime: 1776758820,
  task2EndTime: 1776759120
}

const DELEGATE_AMOUNT_1 = 2;
const DELEGATE_AMOUNT_2 = 5;

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
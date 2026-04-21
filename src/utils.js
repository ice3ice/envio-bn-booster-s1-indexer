const taskTimestamps = {
  task1StartTime: 1776786300,
  task1EndTime: 1776787200,
  task2StartTime: 1776787201,
  task2EndTime: 1776788101
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
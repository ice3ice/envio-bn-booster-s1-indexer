const taskTimestamps = {
  task1StartTime: 1777359600,
  task1EndTime: 1777964400,
  task2StartTime: 1777964401,
  task2EndTime: 1778569201
}

const DELEGATE_AMOUNT_1 = 220;
const DELEGATE_AMOUNT_2 = 450;

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
const taskTimestamps = {
  task1StartTime: 1768874400,
  task1EndTime: 1768875600,
  task2StartTime: 1768876200,
  task2EndTime: 1768887000
}

const DELEGATE_AMOUNT_1 = 1;
const DELEGATE_AMOUNT_2 = 2;

const getTaskCompleted = (timestamp, amount, userTaskCompleted) => {
  if(timestamp >= taskTimestamps.task1StartTime && timestamp <= taskTimestamps.task1EndTime && amount >= DELEGATE_AMOUNT_1) {
    userTaskCompleted.task1Completed = true;
    return userTaskCompleted;
  } else if(timestamp >= taskTimestamps.task2StartTime && timestamp <= taskTimestamps.task2EndTime && amount >= DELEGATE_AMOUNT_2) {
    userTaskCompleted.task2Completed = true;
    return userTaskCompleted;
  }

  return userTaskCompleted;
}

module.exports = {
  getTaskCompleted,
};
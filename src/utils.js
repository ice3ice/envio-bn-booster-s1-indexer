const taskTimestamps = {
  task1StartTime: 1767020280,
  task1EndTime: 1767020580,
  task2EndTime: 1767020880,
  task3EndTime: 1767021180,
  task4EndTime: 1767021480,
}

const getTaskCompleted = (timestamp, userTaskCompleted) => {
  if(timestamp > taskTimestamps.task1StartTime && timestamp <= taskTimestamps.task1EndTime) {
    userTaskCompleted.task1Completed = true;
    return userTaskCompleted;
  } else if(timestamp > taskTimestamps.task1EndTime && timestamp <= taskTimestamps.task2EndTime) {
    userTaskCompleted.task2Completed = true;
    return userTaskCompleted;
  } else if(timestamp > taskTimestamps.task2EndTime && timestamp <= taskTimestamps.task3EndTime) {
    userTaskCompleted.task3Completed = true;
    return userTaskCompleted;
  } else if(timestamp > taskTimestamps.task3EndTime && timestamp <= taskTimestamps.task4EndTime) {
    userTaskCompleted.task4Completed = true;
    return userTaskCompleted;
  }

  return userTaskCompleted;
}

const test = () => {
  return 1;
}

module.exports = {
  getTaskCompleted,
};
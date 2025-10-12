const ethers = require("ethers");

const uidHash = (recipient, token) => {
  return ethers.keccak256(Buffer.from(recipient + token, "utf-8"));
}

module.exports = {
  uidHash,
};
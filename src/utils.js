const ethers = require("ethers");

const uidHash = (recipient, token) => {
  return ethers.keccak256(Buffer.from(recipient + token, "utf-8"));
}

const eligibleToken = token => {
  const eligibleTokens = new Map();
  eligibleTokens.set("0x5ffd0eadc186af9512542d0d5e5eafc65d5afc5b", true);
  eligibleTokens.set("0xa227cc36938f0c9e09ce0e64dfab226cad739447", true);
  eligibleTokens.set("0x80563fc2dd549bf36f82d3bf3b970bb5b08dbddb", true);
  eligibleTokens.set("0x1a5d7e4c3a7f940b240b7357a4bfed30d17f9497", true);

  return eligibleTokens.has(token.toLowerCase());
}

const eligibleProject = projectId => {
  const eligibleProjects = new Map();
  eligibleProjects.set(1127, true);
  eligibleProjects.set(1128, true);
  eligibleProjects.set(1131, true);
  eligibleProjects.set(1134, true);

  return eligibleProjects.has(projectId);
}

module.exports = {
  eligibleToken,
  eligibleProject,
  uidHash,
};
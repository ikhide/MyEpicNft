const { expect } = require("chai");

let nftContract;

describe("NFT", function () {
  beforeEach(async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("contract address ", nftContract.address);
  });

  it("Should return contract name", async () => {
    expect(await nftContract.name()).to.equal("SquareNFT");
  });

  it("Should mint NFT", async () => {
    let txn = await nftContract.makeAnEpicNFT();
    await txn.wait();
    console.log(txn);
  });

  it("Should return list of user NFTs", async () => {
    const [owner, user1] = await ethers.getSigners();
    await nftContract.connect(owner);
    let txn1 = await nftContract.makeAnEpicNFT();
    await txn1.wait();
    let txn2 = await nftContract.makeAnEpicNFT();
    await txn2.wait();
    const ownerIds = await nftContract.getUserTokenIds();
    expect(ownerIds.length).to.equal(2);

    nftContract = await nftContract.connect(user1);
    let txn3 = await nftContract.makeAnEpicNFT();
    await txn3.wait();

    const user1Ids = await nftContract.getUserTokenIds();
    expect(user1Ids.length).to.equal(1);
  });
});

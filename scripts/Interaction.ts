import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const wethAdress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);

  console.log(
    "-----------------------------------------------------------------"
  );

  const amountADesired = ethers.parseUnits("20", 6);
  const amountBDesired = ethers.parseUnits("200000000000000000000", 18);

  console.log(
    "-----------------------------------------------------------------"
  );

  const USDC = await ethers.getContractAt("IERC20", USDCAddress);
  const DAI = await ethers.getContractAt("IERC20", DAIAddress);
  const WETH = await ethers.getContractAt("IERC20", wethAdress);

  const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

  console.log(
    "----------------------------Approving the tokens -------------------------------------"
  );



  const approvesA = await USDC.connect(impersonatedSigner).approve(
    UNIRouter,
    amountADesired
  );

  await approvesA.wait();

  const approveB = await DAI.connect(impersonatedSigner).approve(
    UNIRouter,
    amountBDesired
  );

  await approveB.wait();

  console.log(
    "-----------------------------------------------------------------"
  );


  const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
  const daiBal = await DAI.balanceOf(impersonatedSigner.address);

  console.log(
    "-----------------------------Transaction Balance------------------------------------"
  );

  console.log("USDC Balance:", ethers.formatUnits(usdcBal, 6));
  console.log("DAI Balance:", ethers.formatUnits(daiBal, 18));

  console.log(
    "-------------------------------Deadline----------------------------------"
  );

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log(
    "-------------------------------UniswapV2 Function (ADD Liquidity) ----------------------------------"
  );

  const swapTx = await ROUTER.connect(impersonatedSigner).addLiquidity(
    USDCAddress,
    DAIAddress,
    amountADesired,
    amountBDesired,
    2,
    2,

    impersonatedSigner.address,
    deadline
  );

  await swapTx.wait();


  const usdcBalAddedLiquidity = await USDC.balanceOf(impersonatedSigner.address);
  const daiBalAddedLiquidity = await DAI.balanceOf(impersonatedSigner.address);

  console.log(
    "--------------------------After Add liquidity---------------------------------------"
  );


  console.log(
    "usdc balance after Adding Liquidity",
    ethers.formatUnits(usdcBalAddedLiquidity, 6)
  );
  console.log(
    "dai balance after Adding Liquidity",
    ethers.formatUnits(daiBalAddedLiquidity, 18)
  );

  
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

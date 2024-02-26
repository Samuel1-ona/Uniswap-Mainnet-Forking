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
    "---------------------------Declearing The addresses--------------------------------------"
  );

  const amountOut = ethers.parseUnits("20000000", 6);
  const amountInMax = ethers.parseEther("1");

  console.log(
    "-----------------------------Declearing The amountout and amountInMax------------------------------------"
  );

  console.log(
    "-----------------------------get contract at for each addresses------------------------------------"
  );

  const USDC = await ethers.getContractAt("IERC20", USDCAddress);
  const DAI = await ethers.getContractAt("IERC20", DAIAddress);
  const WETH = await ethers.getContractAt("IERC20", wethAdress);

  const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

  console.log(
    "------------------------------ Approve the unirouter to use amountout-----------------------------------"
  );

  const approveTx = await USDC.connect(impersonatedSigner).approve(UNIRouter, amountOut);

  await approveTx.wait();

  console.log(
    "-----------------------------------------------------------------"
  );


  const ethBal = await impersonatedSigner.provider.getBalance(USDCHolder);
  const wethBal = await WETH.balanceOf(impersonatedSigner.address);

  console.log(
    "-----------------------------------------------------------------"
  );

  const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
  const daiBal = await DAI.balanceOf(impersonatedSigner.address);

  console.log(
    "-------------------GET THE BALANCE----------------------------------------------"
  );


  console.log("USDC Balance:", ethers.formatUnits(usdcBal, 6));
  console.log("weth Balance:", ethers.formatUnits(wethBal, 18));
  console.log("eth Balance:", ethers.formatEther(ethBal));
  

  console.log(
    "------------------------DEADLINE -----------------------------------------"
  );

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log(
    "------------------------UNISWAP ROUTER FUNCTION -----------------------------------------"
  );

  const swapTx = await ROUTER.connect(impersonatedSigner).swapTokensForExactETH(
    amountOut,
    amountInMax,
    [USDCAddress, wethAdress],
    
    impersonatedSigner.address,
    deadline
  );

  await swapTx.wait();

  const usdcBalAddedLiquidity = await USDC.balanceOf(impersonatedSigner.address);
  const WETHBalAddedLiquidity = await WETH.balanceOf(impersonatedSigner.address);
  const ethBals = await impersonatedSigner.provider.getBalance(USDCHolder);

  
  

  console.log(
    "-----------------------------------------------------------------"
  );

  console.log(
    "usdc balance after swapping to eth",
    ethers.formatUnits(usdcBalAddedLiquidity, 6)
  );
  console.log(
    "Weth balance after swapping",
    ethers.formatUnits(WETHBalAddedLiquidity, 18)
  );

  console.log(
    "eth balance after swapping",
    ethers.formatEther(ethBals)
  );


};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

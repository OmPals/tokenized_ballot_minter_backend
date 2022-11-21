import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './artifacts/MyToken.json';
import * as dotenv from 'dotenv';
dotenv.config();

export class createPaymentOrderDto {
  value: number;
  secret: string;
}

export class requestPaymentOrderDto {
  id: number;
  secret: string;
  receiverAddress: string;
}

export class PaymentOrder {
  value: number;
  id: number;
  secret: string;
}

export interface PaymentOrderResponseDto {
  value: number;
  id: number;
}

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  erc20ContractFactory: ethers.ContractFactory;
  paymentOrders: PaymentOrder[];

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      process.env.POKT_RPC_URL,
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '');
    const signer = wallet.connect(this.provider);

    this.erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
      signer,
    );
    this.paymentOrders = [];
  }

  async getTotalSupply(address: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory
      .attach(address)
      .connect(this.provider);
    const totalSupply = await contractInstance.totalSupply();
    return parseFloat(ethers.utils.formatEther(totalSupply));
  }

  async getAllowance(
    contractAddress: string,
    from: string,
    to: string,
  ): Promise<number> {
    const contractInstance = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(this.provider);
    const allowance = await contractInstance.allowance(from, to);
    return parseFloat(ethers.utils.formatEther(allowance));
  }

  getPaymentOrder(id: number) {
    const paymentOrder = this.paymentOrders[id];
    return { value: paymentOrder.value, id: paymentOrder.id };
  }

  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrders.length;
    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  async requestPaymentOrder(
    id: number,
    secret: string,
    receiverAddress: string,
  ) {
    console.log(id);
    console.log(secret);
    console.log(receiverAddress);
    
    const paymentOrder = this.paymentOrders[id];
    if (paymentOrder.secret !== secret) throw new Error('wrong Secret');
    const contractInstance = this.erc20ContractFactory.attach(
      process.env.MTK_SC,
    );
    const tx = await contractInstance.mint(
      receiverAddress,
      ethers.utils.parseEther(paymentOrder.value.toString()),
    );

    await tx.wait();

    return {
      mintedValue: paymentOrder.value.toString(),
      address: receiverAddress,
    };
  }
}

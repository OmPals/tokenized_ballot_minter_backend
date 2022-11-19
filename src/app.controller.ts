import { Controller, Get, Param } from '@nestjs/common';
import { Body, Post, Query, Redirect, Res } from '@nestjs/common/decorators';
import { ethers } from 'ethers';
import {
  AppService,
  createPaymentOrderDto,
  PaymentOrderResponseDto,
  requestPaymentOrderDto,
} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(@Res() res): string {
    return res.redirect('/api');
  }

  @Get('total-supply/:address')
  getTotalSupply(@Param('address') address: string): Promise<number> {
    return this.appService.getTotalSupply(address);
  }

  @Get('allowance')
  getAllowance(
    @Query('address') address: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<number> {
    return this.appService.getAllowance(address, from, to);
  }

  @Get('payment-order/:id')
  getPaymentOrder(@Param('id') id: number): PaymentOrderResponseDto {
    return this.appService.getPaymentOrder(id);
  }

  @Post('payment-order')
  createPaymentOrder(@Body() body: createPaymentOrderDto): number {
    return this.appService.createPaymentOrder(body.value, body.secret);
  }

  @Post('request-payment')
  async requestPaymentOrder(
    @Body() body: requestPaymentOrderDto,
  ): Promise<any> {
    return await this.appService.requestPaymentOrder(
      body.id,
      body.secret,
      body.receiverAddress,
    );
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { Interval } from '@nestjs/schedule'
import { catchError, firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'
import { AxiosRequestConfig } from 'axios'
import { Decimal } from 'decimal.js'

type GetBitcoinPriceResponse = {
    symbol: string
    bidPrice: string
    bidQty: string
    askPrice: string
    askQty: string
}

function getInterval() {
    const interval = parseInt(process.env.INTERVAL || '', 10) || 10
    return interval * 1000
}

@Injectable()
export class AppService implements OnModuleInit {
    private readonly url = 'https://api.binance.com'
    
    private needCalc = false
    private isInit = false

    private askPrice = '0'
    private bidPrice = '0'
    private askCom = new Decimal('0')
    private bidCom = new Decimal('0')
    private midPrice = new Decimal('0')

    constructor(private readonly httpService: HttpService) {}

    async onModuleInit() {
        try {
            await this.getBitcoinPrice(true)
            this.isInit = true
        }
        catch (err) {
            console.error('Error during the initial request:', err)
        }
    }

    @Interval(getInterval())
    async getBitcoinPrice(onStart?: boolean) {
        if (!onStart && !this.isInit) {
            return
        }

        const config: AxiosRequestConfig = {
            params: { symbol: 'BTCUSDT' }
        }

        const res = await firstValueFrom(
            this.httpService.get<GetBitcoinPriceResponse>(`${this.url}/api/v3/ticker/bookTicker`, config).pipe(
                catchError((err: AxiosError) => {
                    console.error(err.response?.data)
                    throw err.response?.data
                })
            )
        )

        this.askPrice = res.data.askPrice
        this.bidPrice = res.data.bidPrice

        this.needCalc = true
    }

    calcCommission() {
        if (this.needCalc) {
            const precent = 0.01

            this.askCom = new Decimal(this.askPrice)
                .mul(precent)
                .div(100)
                .plus(this.askPrice)

            this.bidCom = new Decimal(this.bidPrice)
                .mul(precent)
                .div(100)
                .plus(this.bidPrice)

            this.midPrice = this.askCom
                .plus(this.bidCom)
                .div(2)

            this.needCalc = false
        }

        return {
            askCom: this.askCom,
            bidCom: this.bidCom,
            midPrice: this.midPrice
        }
    }
}

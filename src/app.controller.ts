import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getPrice() {
        const calcResult = this.appService.calcCommission()
        return calcResult
    }
}

import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { HttpModule } from '@nestjs/axios'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    imports: [
        HttpModule,
        ScheduleModule.forRoot()
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

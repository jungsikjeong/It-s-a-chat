import { DatabaseModule } from '@/libs/db/db.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { RoomGateway } from './gateways/room.geteway';

@Module({
  imports: [DatabaseModule],
  providers: [ChatGateway, RoomGateway],
})
export class ChatModule {}

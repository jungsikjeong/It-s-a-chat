import { schemas } from '@/libs/db/schemas';
import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { Server, Socket } from 'socket.io';
import { ChatGateway } from './chat.gateway';

@WebSocketGateway({
  namespace: 'room',
  cors: {
    origin: '*',
  },
})
export class RoomGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject('DRIZZLE_DB') private readonly db: NeonDatabase<typeof schemas>,
    private readonly chatGateway: ChatGateway,
  ) {}

  @SubscribeMessage('createRoom')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { nickname, room }: { nickname: string; room: string },
  ) {
    this.chatGateway.server.emit('message', {
      message: `${nickname}님이 ${room}방을 만들었습니다.`,
    });

    this.server.emit('rooms', room);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    {
      inviterNickname,
      inviteeNickname,
      room,
      toLeaveRoom,
    }: {
      inviterNickname: string;
      inviteeNickname: string;
      room: string;
      toLeaveRoom: string;
    },
  ) {
    socket.leave(toLeaveRoom);

    this.server.emit('message', {
      message: `${inviterNickname}님이 ${inviteeNickname}님을 초대했습니다.`,
    });

    socket.join(room);
  }
}

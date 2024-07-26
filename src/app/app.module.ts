import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_URI)
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements OnModuleInit {

  onModuleInit() {
    const mongooseConnection = mongoose.connection;

    mongooseConnection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    mongooseConnection.on('error', (err) => {
      console.error('Failed to connect to MongoDB', err);
    });

    mongooseConnection.on('disconnected', () => {
      console.log('Disconnected from MongoDB');
    });
  }
}
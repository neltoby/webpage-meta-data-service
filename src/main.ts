import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
<<<<<<< HEAD
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log('Serving running on port ' + port);
=======
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
>>>>>>> b27baca... chamges made
}
bootstrap();

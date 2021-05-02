import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@rest/app.controller';
import { AppService } from '@rest/app.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello Zenklub!"', () => {
            expect(appController.getHello()).toBe('Hello Zenklub!');
        });
    });
});

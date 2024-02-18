"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const videos_router_1 = require("../src/routes/videos-router");
const app_settings_1 = require("../app_settings");
const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;
describe('/videos', () => {
    let newVideo = {
        id: +new Date(),
        title: '',
        author: '',
        canBeDownloaded: false,
        minAgeRestriction: 16,
        createdAt: '',
        publicationDate: '',
        availableResolutions: ['']
    };
    //  const client = new MongoClient(mongoURI)
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //  await client.connect()
        yield (0, supertest_1.default)(app_settings_1.app).delete('/testing/all-data').expect(204);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // await client.close()
    }));
    it('GET videos = []', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_settings_1.app).get('/videos/');
        console.log(response);
    }));
    it('- POST does not create the video with incorrect data (no title, no author)', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_settings_1.app)
                .post('/videos/')
                .send({ title: '', author: '' })
                .expect(videos_router_1.CodeResponsesEnum.Incorrect_values_400, {
                errorsMessages: [
                    { message: 'Invalid value', field: 'title' },
                    { message: 'Invalid value', field: 'author' },
                    { message: 'Invalid value', field: 'availableResolutions' },
                    { message: 'Invalid value', field: 'availableResolutions' },
                    {
                        message: 'Invalid availableResolutions value',
                        field: 'availableResolutions'
                    }
                ]
            });
            const res = yield (0, supertest_1.default)(app_settings_1.app).get('/videos/');
            expect(res.body).toEqual([]);
        });
    });
    it('- POST will create the video with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const newVideo = {
            id: +(new Date()),
            title: 'New Video By Dima',
            author: 'Dima',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            availableResolutions: ["P146"],
        };
        yield (0, supertest_1.default)(app_settings_1.app)
            .post('/videos/')
            .send(newVideo)
            .expect(videos_router_1.CodeResponsesEnum.Incorrect_values_400, {
            errorsMessages: [
                { message: 'Invalid value', field: 'title' },
                { message: 'Invalid value', field: 'author' },
                { message: 'Invalid value', field: 'availableResolutions' },
                { message: 'Invalid value', field: 'availableResolutions' },
                {
                    message: 'Invalid availableResolutions value',
                    field: 'availableResolutions'
                }
            ]
        });
        const res = yield (0, supertest_1.default)(app_settings_1.app).get('/videos/');
        expect(res.body).toEqual([]);
    }));
    it('- GET video by ID with incorrect id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_settings_1.app).get('/videos/:id').expect(404);
    }));
    // it('+ GET video by ID with correct id', async () => {
    //     await request(app)
    //         .get('/videos/:' + newVideo?.id)
    //         .expect(200, newVideo)
    // })
    it('- PUT product by ID with incorrect data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_settings_1.app)
            .put('/videos/' + 1223)
            .send({ title: 'title', author: 'title' })
            .expect(videos_router_1.CodeResponsesEnum.Not_found_404);
        const res = yield (0, supertest_1.default)(app_settings_1.app).get('/videos/');
        expect(res.body[0]).toEqual(newVideo);
    }));
    it('+ PUT product by ID with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_settings_1.app)
            .put('/videos/' + newVideo.id)
            .send({
            title: 'hello title',
            author: 'hello author',
            publicationDate: '2023-01-12T08:12:39.261Z',
        })
            .expect(videos_router_1.CodeResponsesEnum.Not_content_204);
        const res = yield (0, supertest_1.default)(app_settings_1.app).get('/videos/');
        expect(res.body[0]).toEqual(Object.assign(Object.assign({}, newVideo), { title: 'hello title', author: 'hello author', publicationDate: '2023-01-12T08:12:39.261Z' }));
        newVideo = res.body[0];
    }));
    it('- DELETE product by incorrect ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_settings_1.app)
            .delete('/videos/876328')
            .expect(videos_router_1.CodeResponsesEnum.Not_found_404);
        const res = yield (0, supertest_1.default)(app_settings_1.app).get('/videos/');
        expect(res.body[0]).toEqual(newVideo);
    }));
    it('+ DELETE product by correct ID, auth', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_settings_1.app)
            .delete('/videos/' + newVideo.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(videos_router_1.CodeResponsesEnum.Not_content_204);
        const res = yield (0, supertest_1.default)(app_settings_1.app).get('/videos/');
        expect(res.body.length).toBe(0);
    }));
});

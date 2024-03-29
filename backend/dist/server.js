"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const admin_routes_1 = __importDefault(require("./routers/admin.routes"));
const workshop_routes_1 = __importDefault(require("./routers/workshop.routes"));
const participants_routes_1 = __importDefault(require("./routers/participants.routes"));
const actions_routes_1 = __importDefault(require("./routers/actions.routes"));
const chars_routes_1 = __importDefault(require("./routers/chars.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('src/uploads'));
mongoose_1.default.connect('mongodb://127.0.0.1:27017/ArtWorkshops');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('db connected');
});
const router = express_1.default.Router();
router.use('/users', user_routes_1.default);
router.use('/admin', admin_routes_1.default);
router.use('/workshops', workshop_routes_1.default);
router.use('/actions', actions_routes_1.default);
router.use('/participants', participants_routes_1.default);
router.use('/chats', chars_routes_1.default);
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map
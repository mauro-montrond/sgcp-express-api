const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');
const profileRouter = require('./routes/profile.route');
const menuRouter = require('./routes/menu.route');
const menu_profileRouter = require('./routes/menu_profile.route');
const geografiaRouter = require('./routes/geografia.route');
const individualRouter = require('./routes/individual.route');
const fingerprintRouter = require('./routes/fingerprint.route');
const photoRouter = require('./routes/photo.route');
const precedentRouter = require('./routes/precedent.route');

// Init express
const app = express();
// Init environment
dotenv.config();
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 3331);

app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/profiles`, profileRouter);
app.use(`/api/v1/menus`, menuRouter);
app.use(`/api/v1/menus_profiles`, menu_profileRouter);
app.use(`/api/v1/geografia`, geografiaRouter);
app.use(`/api/v1/individuals`, individualRouter);
app.use(`/api/v1/fingerprints`, fingerprintRouter);
app.use(`/api/v1/photos`, photoRouter);
app.use(`/api/v1/precedents`, precedentRouter);

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));


module.exports = app;
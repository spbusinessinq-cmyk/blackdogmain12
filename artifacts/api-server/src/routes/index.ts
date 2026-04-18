import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import requestsRouter from "./requests.js";
import commanderRouter from "./commander.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(requestsRouter);
router.use(commanderRouter);

export default router;

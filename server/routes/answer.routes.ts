import {Router} from 'express';
import {createAnswer} from '../controller/answer.controller';

const router = Router();

router.post("/createAnswers", createAnswer);

export default router;

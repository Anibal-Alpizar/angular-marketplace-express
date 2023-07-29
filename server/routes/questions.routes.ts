import {Router} from 'express';
import {createQuestions} from '../controller/questions.controller';

const router = Router();

router.post("/createQuestions", createQuestions);

export default router;

import { Router } from "express";
import { createJudgesAccount, loginJudge, checkIsLoggedIn } from "../controllers/judges-controller";
import { checkSchema } from "express-validator"; // methods to help us validate the user's request 
import { userValidationSchema } from "../util/validationSchema";
import passport from 'passport';

const router = Router();

// add a judge when they create an account
router.post("/add", checkSchema(userValidationSchema), createJudgesAccount);

// login a judge
router.post("/login", checkSchema(userValidationSchema), loginJudge);

// test protected route
router.get("/protected", passport.authenticate("jwt", {session: false}), checkIsLoggedIn)

export default router;
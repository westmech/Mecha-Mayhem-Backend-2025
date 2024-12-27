import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData } from "express-validator";
import { generateJWT } from "../strategies/jwt-auth";
import { auth } from "../config/firebaseConfig";
import { mockData } from "../util/mockData";

export const createJudgesAccount = async (req: Request, res: Response) => {
    // validationResult extracts validation results from a request, wrapes them in a Result obj and returns it. use result to figure out if request is valid or not
    const result = validationResult(req);

    // if result is empty, there are no errors
    if (result.isEmpty()) {
        // grabs all validated fiels
        const data = matchedData(req);
        console.log(data);

        try {
            const { email, username, password } = req.body;

            // add judges account
            const user = await auth.createUser({
                email,
                displayName: username,
                password
            })
            
            console.log(user);
            res.status(200).send({msg: `User Created with username: ${username}`});
        } catch (err) {
            console.log(err);
            res.status(400).send(err); 
        }
    } else {
        // if result is not empty, there are errors
        res.status(400).send(result.array());
    }
};

export const loginJudge = (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // mock data
        const findUser = mockData.find((x) => x.username === username);
        if (!findUser) throw new Error("User not found");
        if (findUser.password !== password) throw new Error("Incorrect password");

        const expiresIn = 60; // cookie expires in a minute, expiresIn is in seconds
        const token = generateJWT(findUser.id, expiresIn);

        res.cookie('jwt', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + expiresIn * 1000),
        });

        res.status(200).send({msg: "logged in"});
    } catch (err) {
        console.log(err);
        res.status(400).send(err); 
    }
};

export const checkIsLoggedIn = (req: Request, res: Response) => {
    res.json({msg: "User has access to this route"});
}
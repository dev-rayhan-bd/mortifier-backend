import { NextFunction, Request, Response } from "express";
import { purchaseAccessServices } from "./purchaseAccess.services";


const checkEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        const result = await purchaseAccessServices.checkEnrollment(data);

        res.status(200).json({
            success: true,
            message: 'checked successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const enrollNow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        const result = await purchaseAccessServices.enrollNow(data);

        res.status(200).json({
            success: true,
            message: 'enrollment successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const myEnrolledSesion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.user
        const result = await purchaseAccessServices.myEnrolledSesion(data);

        res.status(200).json({
            success: true,
            message: 'get my entrolled sessions successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}

const getTotalEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await purchaseAccessServices.getTotalEnrollment(id);

        res.status(200).json({
            success: true,
            message: 'get enroll count successfully',
            data: result,
        })
    }
    catch (error) {
        next(error)
    }
}


export const purchaseAccessController = {
    checkEnrollment,
    enrollNow,
    myEnrolledSesion,
    getTotalEnrollment,
}
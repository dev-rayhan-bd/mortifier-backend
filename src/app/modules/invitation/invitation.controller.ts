import { NextFunction, Request, Response } from 'express';
import { invitationServices } from './invitation.services';

const sentInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const result = await invitationServices.sentInvitation(data)

        res.status(200).json({
            success: true,
            message: 'sent invitation successfully',
            data: result,
        })
        // sendResponse(res, {
        //     statusCode: httpStatus.OK,
        //     success: true,
        //     message: 'user created successfully',
        //     data: result,
        // });
    }
    catch (error) {
        next(error)
    }
}

export const invitationController = {
    sentInvitation,
}
import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import * as yup from "yup";
import {getServerSession, withAuth} from "@roq/nextjs";
import {menuValidation} from "../../../components/validation/menu.validation";

// TODO save user to menue
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = getServerSession(req);
    const user = session.user;

    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    // const menuSchema = yup.object().shape({
    //     name: yup.string().max(32).required(),
    // });

    try {
        await menuValidation.validate(req.body);
        const prisma = new PrismaClient();

        const menu = await prisma.menu.create({
            data: {
                ...req.body,
                roqUserId: session.roqUserId
            }
        });
        return res.status(200).json({menu});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }

}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
    return withAuth(req, res)(handler);
}
import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {personalSchema} from "../../../components/validation/personal.validation";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // TODO should be the same as used on client-side


    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    try {
        await personalSchema.validate(req.body);
        const prisma = new PrismaClient();
        const applicant = await prisma.applicant.create({data: req.body});
        return true;
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }

}

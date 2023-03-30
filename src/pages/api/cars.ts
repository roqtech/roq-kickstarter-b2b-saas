import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getServerSession, withAuth} from "@roq/nextjs";
import {roqClient} from "../../server/roq";
import {carSchema} from "../../components/validation/car.schema";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);

    switch (req.method) {
        // case 'GET':
        //     return getCars();
        // case 'POST':
        //     return createCar();
        // // case 'UPDATE':
        // //     return createCar();
        // case'DELETE':
        //     return deleteCar();
        default:
            return res.status(405).json({message: 'Method ' + req.method + ' not allowed'})
    }


    async function getCars() {
        const cars = await prisma.car.findMany({
            orderBy: [{id: 'desc',},],
        });

        let userIds: any[] = [];
        cars.forEach(car => userIds.push(car.roqUserId));

        if (userIds.length > 0) {
            const users = await roqClient.asUser(session.roqUserId).userProfiles(
                {filter: {id: {valueIn: userIds}}}
            );
            res.status(200).json({result: {cars: cars, users}});
        } else {
            res.status(200).json({result: {cars: cars, users: []}});
        }
    }

    async function createCar(){

        try {
            const data = await carSchema.validate(req.body);

            const prisma = new PrismaClient();
            const car = await prisma.car.create({
                data: {
                    ...data,
                    roqUserId: session.roqUserId
                }
            });
            return res.status(200).json({car: car});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async function deleteCar() {

        const {id} = req.query;

        try {
            const deletedCar = await prisma.car.delete({where: {id: Number(id)}});

            return res.status(200).json({success: true, data: deletedCar});
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Server error'});
        }
    }


}

// export default handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
    return withAuth(req, res)(handler);
}
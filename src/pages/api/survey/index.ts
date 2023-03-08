import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

function calculateScore(answer1: any, answer2: any, answer3: any, answer4: any, answer5: any, answer6: any, answer7: any, answer8: any, answer9: any, answer10: any, answer11: any, answer12: any) {
    /*
     * Calculation of score - https://roqtech.atlassian.net/wiki/spaces/WNL/pages/707395615/02+Questionnaire
     *
     */

    let score = 0;

    // Can you imagine becoming a professional driver in Germany?
    if (answer1 == "Yes") {
        score += 5;
    }

    // How old are you?
    if (answer2 == "under-18") {
        score += 3;
    } else if (answer2 == "18-25") {
        score += 5;
    }

    // Which languages do you speak?
    if (answer3.includes("German")) {
        score += 5;
    } else if (answer3.includes("English")
    || answer3.includes("English")
        || answer3.includes("French")
        || answer3.includes("Spanish")
        || answer3.includes("Serbian")
        || answer3.includes("Portuguese")
    ) {
        score += 3;
    }

    // Do you have a school diploma?
    if (answer4 == "Yes") {
        score += 5;
    }

    // What is your family status?
    if (answer5 == "Divorced") {
        score += 3;
    } else if (answer5 == "Single") {
        score += 5;
    }

    // Do you have family or friends in Germany?
    if (answer6 == "Yes") {
        score += 5;
    } else {
        score += 5;
    }

    // Can you imagine staying in Germany permanently?
    if (answer7 == "Yes") {
        score += 5;
    }

    // Do you already know how to drive a car?
    if (answer8 == "Yes") {
        score += 5;
    } else {
        score += 2;
    }

    // Do you already know how to drive a truck?
    if (answer9 == "Yes") {
        score += 5;
    } else {
        score += 5;
    }

    // Are you interested in machines or technical devices?
    if (answer10 == "Yes") {
        score += 5;
    } else {
        score += 3;
    }

    // Are you physically fit?
    if (answer11 == "Yes") {
        score += 5;
    } else {
        score += 2;
    }

    // Can you navigate well in traffic?
    if (answer12 == "Yes") {
        score += 5;
    } else {
        score += 3;
    }

    return score;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    const {
        answer1,
        answer2,
        answer3,
        answer4,
        answer5,
        answer6,
        answer7,
        answer8,
        answer9,
        answer10,
        answer11,
        answer12
    } = req.body;

    if (!answer1 || !answer2 || !answer3 || !answer4 || !answer5 || !answer6 || !answer7 || !answer8 || !answer9 || !answer10 || !answer11 || !answer12) {
        return res.status(400).json({message: 'Invalid request body'});
    }

    try {
        const prisma = new PrismaClient();

        let score = calculateScore(answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10, answer11, answer12);

        const survey = await prisma.survey.create({
            data: {
                score,
                answer1,
                answer2,
                answer3,
                answer4,
                answer5,
                answer6,
                answer7,
                answer8,
                answer9,
                answer10,
                answer11,
                answer12
            },
        });
        return res.status(201).json(survey);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

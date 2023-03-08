import AppLayout from "layout/app/app.layout";
import {ReactNode} from "react";

interface ResultPageProps {
    score: number;
}

export default function ResultPage({score}: ResultPageProps) {

    let resultString;

    if (score < 19) {
        resultString = "Don’t worry!!";
    } else if (score > 33) {
        resultString = "Great!";
    } else {
        resultString = "Awesome!";
    }

    return (
        <AppLayout>
            {resultString}
        </AppLayout>
    );
}


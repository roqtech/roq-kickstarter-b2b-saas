import React, {useState} from 'react';
import {Formik, Form, Field, FormikErrors, FormikTouched} from 'formik';
import { redirect } from 'next/navigation';
import * as Yup from 'yup';
import ResultPage from "./result";

interface SurveyFormValues {
    answer1: string;
    answer2: string;
    answer3: string[];
    answer4: string;
    answer5: string;
    answer6: string;
    answer7: string;
    answer8: string;
    answer9: string;
    answer10: string;
    answer11: string;
    answer12: string;

}

const SurveySchema = Yup.object().shape({
    answer1: Yup.string().required('This field is required.'),
    answer2: Yup.string().required('This field is required.'),
    answer3: Yup.array().min(1, 'Please select at least one language.'),
    answer4: Yup.string().required('This field is required.'),
    answer5: Yup.string().required('This field is required.'),
    answer6: Yup.string().required('This field is required.'),
    answer7: Yup.string().required('This field is required.'),
    answer8: Yup.string().required('This field is required.'),
    answer9: Yup.string().required('This field is required.'),
    answer10: Yup.string().required('This field is required.'),
    answer11: Yup.string().required('This field is required.'),
    answer12: Yup.string().required('This field is required.'),
});

function BooleanQuestion(props: {
    valueAnswer: string,
    headline: string,
    subHeadline: string,
    label: string,
    selectedAnswer1: string,
    selectedAnswer2: string,
    onClick: () => void,
    onClick1: () => void,
    errors: FormikErrors<SurveyFormValues>,
    touched: FormikTouched<SurveyFormValues>
}) {

    return <>
        <div className="mb-4">
            <div className="py-4">{props.subHeadline}</div>
            <h2 className="text-lg font-medium text-gray-900">{props.headline}</h2>
            <label className="text-sm">{props.label}</label>
        </div>
        <div className="mb-4 flex justify-center">
            <button
                type="button"
                className={`${
                    props.valueAnswer === props.selectedAnswer1 ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                } font-medium py-2 px-4 mr-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={props.onClick}
            >
                {props.selectedAnswer1}
            </button>
            <button
                type="button"
                className={`${
                    props.valueAnswer === props.selectedAnswer2 ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                } font-medium py-2 px-4 ml-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={props.onClick1}
            >
                {props.selectedAnswer2}
            </button>
        </div>
        {props.errors.answer1 && props.touched.answer1 && <div className="text-red-500">{props.errors.answer1}</div>}
    </>;
}

function Selection(props: { errors: FormikErrors<SurveyFormValues>, touched: FormikTouched<SurveyFormValues> }) {
    return <>
        <div className="py-4">2. Age</div>
        <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">How old are you?</h2>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="age">
                Select your age:
            </label>
            <Field
                as="select"
                name="answer2"
                id="age"
                className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
                <option value="">Select your age</option>
                <option value="under-18">under 18</option>
                <option value="18-25">18-25</option>
                <option value="above-25">above 25</option>
            </Field>
        </div>
        {props.errors.answer2 && props.touched.answer2 && <div className="text-red-500">{props.errors.answer2}</div>}
    </>;
}

function LanguageQuestion(props: { errors: FormikErrors<SurveyFormValues>, touched: FormikTouched<SurveyFormValues> }) {
    return <>
        <div className="py-4">3. Languages</div>
        <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Which languages do you speak?</h2>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Choose the language with which you
                can communicate well. Several answers are possible:</label>
            <div className="flex flex-wrap">
                <label className="flex items-center mr-4 mb-2">
                    <Field type="checkbox" name="answer3" value="German"
                           className="form-checkbox h-5 w-5 text-gray-600"/>
                    <span className="ml-2">German</span>
                    <img src="/flags/germany.png" className="w-5 h-5 ml-1"/>
                </label>
                <label className="flex items-center mr-4 mb-2">
                    <Field type="checkbox" name="answer3" value="English"
                           className="form-checkbox h-5 w-5 text-gray-600"/>
                    <span className="ml-2">English</span>
                    <img src="/flags/uk.png" className="w-5 h-5 ml-1"/>
                </label>
                <label className="flex items-center mr-4 mb-2">
                    <Field type="checkbox" name="answer3" value="Spanish"
                           className="form-checkbox h-5 w-5 text-gray-600"/>
                    <span className="ml-2">Spanish</span>
                    <img src="/flags/spain.png" className="w-5 h-5 ml-1"/>
                </label>

                <label className="flex items-center mr-4 mb-2">
                    <Field type="checkbox" name="answer3" value="Serbian"
                           className="form-checkbox h-5 w-5 text-gray-600"/>
                    <span className="ml-2">Serbian</span>
                    <img src="/flags/serbia.png" className="w-5 h-5 ml-1"/>
                </label>

                <label className="flex items-center mr-4 mb-2">
                    <Field type="checkbox" name="answer3" value="Portuguese"
                           className="form-checkbox h-5 w-5 text-gray-600"/>
                    <span className="ml-2">Portuguese</span>
                    <img src="/flags/portugal.png" className="w-5 h-5 ml-1"/>
                </label>

                <label className="flex items-center mr-4 mb-2">
                    <Field type="checkbox" name="answer3" value="None"
                           className="form-checkbox h-5 w-5 text-gray-600"/>
                    <span className="ml-2">None of these</span>
                </label>

            </div>
        </div>
        {props.errors.answer3 && props.touched.answer3 && <div className="text-red-500">{props.errors.answer3}</div>}
    </>;
}

function QuestionFamilyStatus(props: { values: SurveyFormValues, onClick: () => void, onClick1: () => void, onClick2: () => void }) {
    return <>
        <div className="py-4">5. Family Status</div>
        <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">What is your family status?</h2>
        </div>
        <div className="mb-4 flex justify-center">
            <button
                type="button"
                className={`${
                    props.values.answer5 === "Single" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                } font-medium py-2 px-4 mr-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={props.onClick}
            >
                Single
            </button>
            <button
                type="button"
                className={`${
                    props.values.answer5 === "Married" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                } font-medium py-2 px-4 mr-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={props.onClick1}
            >
                Married
            </button>
            <button
                type="button"
                className={`${
                    props.values.answer5 === "Divorced" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                } font-medium py-2 px-4 ml-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={props.onClick2}
            >
                Divorced
            </button>
        </div>
    </>;
}

const Survey: React.FC = () => {

    const [results, setResults] = useState({score: 0});
    const handleSubmit = async (values: SurveyFormValues, {resetForm}: any) => {

        try {
            const response = await fetch('/api/survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            console.log(data);
            // event.preventDefault();
            setResults(data);
            // resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    console.log(results.score);

    if(results.score){
        return <ResultPage score={results.score} />;
    }

    return (
        <div className="bg-gray-100 p-4">
            <Formik<SurveyFormValues>
                initialValues={{
                    answer1: '',
                    answer2: '',
                    answer3: [],
                    answer4: '',
                    answer5: '',
                    answer6: '',
                    answer7: '',
                    answer8: '',
                    answer9: '',
                    answer10: '',
                    answer11: '',
                    answer12: ''
                }}
                onSubmit={handleSubmit}
                validationSchema={SurveySchema}
            >
                {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
                    <Form className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
                        <BooleanQuestion
                            valueAnswer={values.answer1}
                            headline="Do you want to become a truck driver in Germany?"
                            subHeadline="1. Truck Driver"
                            label="For more information about training in Germany and becoming a professional truck driver, click here."
                            selectedAnswer1="Yes"
                            selectedAnswer2="No"
                            onClick={() => handleChange('answer1')('Yes')}
                            onClick1={() => handleChange('answer1')('No')} errors={errors}
                            touched={touched}/>

                        <Selection errors={errors} touched={touched}/>

                        <LanguageQuestion errors={errors} touched={touched}/>

                        <BooleanQuestion valueAnswer={values.answer4}
                                         headline="Do you have a school diploma?"
                                         subHeadline="4.  Diploma"
                                         selectedAnswer1="Yes"
                                         selectedAnswer2="No"
                                         label='Select "yes" if you have school degree certificate.'
                                         onClick={() => handleChange('answer4')('Yes')}
                                         onClick1={() => handleChange('answer4')('No')} errors={errors}
                                         touched={touched}/>

                        <QuestionFamilyStatus values={values}
                                              onClick={() => handleChange('answer5')('Single')}
                                              onClick1={() => handleChange('answer5')('Married')}
                                              onClick2={() => handleChange('answer5')('Divorced')}/>

                        <BooleanQuestion valueAnswer={values.answer6}
                                         headline="Do you have family or friends in Germany?"
                                         subHeadline="6. Relatives or Friends"
                                         selectedAnswer1="Yes"
                                         selectedAnswer2="No"
                                         label='Indicate if you have relatives or friends living in Germany.'
                                         onClick={() => handleChange('answer6')('Yes')}
                                         onClick1={() => handleChange('answer6')('No')} errors={errors}
                                         touched={touched}/>

                        <BooleanQuestion valueAnswer={values.answer7}
                                         headline="Can you imagine staying in Germany permanently?"
                                         subHeadline="7. Staying Germany Permanently"
                                         selectedAnswer1="Yes"
                                         selectedAnswer2="No"
                                         label='Choose "yes" if you can imagine staying in Germany after your training. More information about living in Germany here.'
                                         onClick={() => handleChange('answer7')('Yes')}
                                         onClick1={() => handleChange('answer7')('No')} errors={errors}
                                         touched={touched}/>

                        <BooleanQuestion valueAnswer={values.answer8}
                                         headline="Do you already know how to drive a car?"
                                         subHeadline="8. Drive A Car"
                                         selectedAnswer1="Yes"
                                         selectedAnswer2="No"
                                         label='You can answer the question with "yes" even if you don‘t have a driver`s license yet.'
                                         onClick={() => handleChange('answer8')('Yes')}
                                         onClick1={() => handleChange('answer8')('No')} errors={errors}
                                         touched={touched}/>

                        <BooleanQuestion valueAnswer={values.answer9}
                                         headline="Do you already know how to drive a truck?"
                                         subHeadline="9. Drive A Truck"
                                         selectedAnswer1="Yes"
                                         selectedAnswer2="No"
                                         label='You can answer the question with "yes" even if you don`t have a truck driver`s license yet.'
                                         onClick={() => handleChange('answer9')('Yes')}
                                         onClick1={() => handleChange('answer9')('No')} errors={errors}
                                         touched={touched}/>

                        <BooleanQuestion valueAnswer={values.answer10}
                                         headline="Are you interested in machines or technical devices?"
                                         subHeadline="10. Technical Equipment"
                                         selectedAnswer1="Yes"
                                         selectedAnswer2="No"
                                         label='Choose "yes" if you have done small repairs on technical equipment (e.g. car, laptop, hairdryer, ect.)'
                                         onClick={() => handleChange('answer10')('Yes')}
                                         onClick1={() => handleChange('answer10')('No')} errors={errors}
                                         touched={touched}/>

                        <BooleanQuestion valueAnswer={values.answer11}
                                         headline="Are you physically fit?"
                                         subHeadline="11. Physical Fitness"
                                         selectedAnswer1="Yes"
                                         selectedAnswer2="No"
                                         label='In your daily work as a professional truck driver you may have to lift a box or change a tire. Physical fitness is important for this.'
                                         onClick={() => handleChange('answer11')('Yes')}
                                         onClick1={() => handleChange('answer11')('No')} errors={errors}
                                         touched={touched}/>

                        <BooleanQuestion valueAnswer={values.answer12}
                                         headline="Can you navigate well in traffic?"
                                         subHeadline="12. Navigate Through Traffic"
                                         selectedAnswer1="Yes"
                                         selectedAnswer2="No"
                                         label='Choose "yes", if you always find your way to your destination, even in unfamiliar surroundings.'
                                         onClick={() => handleChange('answer12')('Yes')}
                                         onClick1={() => handleChange('answer12')('No')} errors={errors}
                                         touched={touched}/>


                        <button type="submit"
                                className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Survey;

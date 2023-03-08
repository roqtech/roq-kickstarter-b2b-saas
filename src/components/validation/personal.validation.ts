import * as yup from "yup";

export const personalSchema = yup.object().shape({
    firstName: yup.string().max(255).required(),
    lastName: yup.string().max(255).required(),
    nationality: yup.string().max(32).required(),
    country: yup.string().max(32).required(),
    dateOfBirth: yup.string().max(12).required(),
    city: yup.string().max(255).required(),
    postalCode: yup.string().max(12).required(),
    address: yup.string().max(255).required()
});
import * as yup from "yup";

export const carSchema = yup.object().shape({
    name: yup.string().max(32).required(),
    price: yup.number().max(5000).required().integer(),
    rented: yup.boolean().required().default(false)
});
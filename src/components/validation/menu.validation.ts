import * as yup from "yup";

export const menuValidation = yup.object().shape({
    name: yup.string().max(32).required()
});
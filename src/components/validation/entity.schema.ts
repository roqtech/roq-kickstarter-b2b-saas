import * as yup from "yup";

export const entitySchema = yup.object().shape({
    name: yup.string().max(32).required(),
});
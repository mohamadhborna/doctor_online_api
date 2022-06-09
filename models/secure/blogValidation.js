const yup = require("yup");


exports.schema = yup.object().shape({
    title:yup.string()
        .required("post should have title")
        .min(4 , "title should more than 4 characters")
        .max(31 , "title should less than 32 characters"),
    text:yup.string()
        .required("post should have text")
        .min(15 , "text should have more than 16 characters")
        .max(511 , "text should less than 512 characters"),
    picture:yup.object().shape({
            size: yup.number().max(3000000, "picture should not be more than 3mg"),
            mimetype: yup.mixed().oneOf(
                ["image/jpeg", "image/png"],
                "just jpg and png supported"
    )}),
    
})

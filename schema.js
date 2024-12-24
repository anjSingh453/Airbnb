// we use joi npm package got server validiation


 const Joi = require("joi");
//  module.exports.listingSchema = Joi.object({
//     listing : Joi.object().required({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price: Joi.string().required().min(0),
//         image: Joi.string().allow("" , null)
//     }).required()
// })

 

 

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().uri().optional(),
});

module.exports.listingSchema = listingSchema;


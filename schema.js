// const Joi = require('joi');
// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price: Joi.number().required().min(0),//min(0) ka mtlb h ki hamara price negative nahi hona chahiye
//         // image: Joi.string().allow("", null)
//         image: Joi.object({
//             url: Joi.string().uri().required(),
//             filename: Joi.string()
//         })
//     }).required()
// });
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            'any.required': 'Title is required'
        }),
        description: Joi.string().required().messages({
            'any.required': 'Description is required'
        }),
        price: Joi.number().required().messages({
            'any.required': 'Price is required'
        }),
        location: Joi.string().required().messages({
            'any.required': 'Location is required'
        }),
        image: Joi.object({
            url: Joi.string().uri().required().messages({
                'any.required': 'Image URL is required',
                'string.uri': 'Image URL must be a valid URI'
            }),
            filename: Joi.string().messages({
                'string.base': 'Filename must be a string'
            })
        })
    }).required()
});
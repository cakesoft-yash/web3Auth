const mongoose = require('mongoose');
const marketplaceDbConnection = require('../db_connect/database_connect').marketplaceDbConnection;

const ShopSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    forApp: [
        {
            type: String
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    isRemoved: {
        type: Boolean,
        default: false
    },
    dokuToken: {
        type: String
    },
    //picIdCard
    document: {
        type: String
    },
    token: {
        type: String
    },
    role: {
        type: String
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    business_name: {
        type: String
    },
    business_address: {
        type: String
    },
    business_postalcode: {
        type: String
    },
    business_category: {
        type: String
    },
    business_category_code: {
        type: String
    },
    business_description: {
        type: String
    },
    city: {
        type: String
    },
    //kecId
    shipper_area_code: {
        type: String
    },
    category_code: {
        type: String
    },
    account_type: {
        type: String
    },
    identity_type: {
        type: String
    },
    identity_name: {
        type: String
    },
    identity_number: {
        type: String
    },
    bank_name: {
        type: String
    },
    bank_code: {
        type: String
    },
    bank_account_number: {
        type: String
    },
    bank_account_name: {
        type: String
    },
    bank_swift_code: {
        type: String
    },
    bankDocument: {
        type: String
    },
    shop_account_type: {
        type: String
    },
    productsCountForBasic: {
        type: Number,
        default: 0
    },
    productsCountUpdatedAt: {
        type: Date,
        default: new Date()
    },
    otherPreferenceNumber: {
        type: String
    },
    company_name: {
        type: String
    },
    company_address: {
        type: String
    },
    company_phone: {
        type: String
    },
    register_date: {
        type: Date
    },
    dokuId: {
        type: String
    },
    aggregator: {
        type: String
    },
    profilePicture: {
        type: String
    },
    province: {
        type: String
    },
    provinceId: {
        type: String
    },
    kotaId: {
        type: String
    },
    subDistrict: {
        type: String
    },
    partner: [
        {
            type: String
        }
    ],
    pic_phone: {
        type: String
    },
    pic_email: {
        type: String
    },
    picSelfie: {
        type: String
    },
    pic_address: {
        type: String
    },
    registerAsQrisMerchant: {
        type: Boolean
    },
    agreeQrisTermsAndConditions: {
        type: Boolean
    },
    qrisProfilePicture: {
        type: String
    },
    npwpNumber: {
        type: String
    },
    kkNumber: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
    },
    businessType: {
        type: String
    },
    businessPermit: {
        type: String
    },
    haveCompany: {
        type: Boolean
    },
    termsAndConditions: {
        type: Boolean
    },
    shopFor: {
        type: String
    },
    mallName: {
        type: String
    },
    mallAddress: {
        type: String
    },
    shopType: {
        type: String
    },
    shopSize: {
        type: String
    },
    submissionLetter: {
        type: String
    },
    statementLetter: {
        type: String
    },
    hashPassword: {
        type: String
    },
    storeIds: [
        {
            _id: {
                type: String,
                required: true
            },
            appName: {
                type: String
            },
            storeId: {
                type: String
            },
            result: mongoose.Mixed
        }
    ],
    pickUpAddress: [
        {
            _id: {
                type: String
            },
            fullName: {
                type: String
            },
            address1: {
                type: String
            },
            address2: {
                type: String
            },
            postal: {
                type: String
            },
            city: {
                type: String
            },
            region: {
                type: String
            },
            phone: {
                type: String
            },
            email: {
                type: String
            }
        }
    ],
    tokens: [
        {
            _id: {
                type: String
            },
            token: {
                type: String
            },
            tokenExpiryTime: {
                type: Date
            }
        }
    ],
    tokenResult: mongoose.Mixed,
    documentResult: mongoose.Mixed,
    dokuEduVerification: {
        type: Boolean,
        default: false
    },
    dokuEduVerificationStatus: {
        type: String,
        default: 'pending'
    },
    history: [
        {
            _id: {
                type: String
            },
            approvalId: {
                type: String
            },
            approverRole: {
                type: String
            },
            approvedBy: {
                type: String
            },
            approvedAt: {
                type: Date
            },
            status: {
                type: String
            },
            firstApiCall: {
                type: Boolean,
                default: true
            },
            reason: [
                {
                    _id: {
                        type: String
                    },
                    title: {
                        type: String
                    },
                    description: {
                        type: String
                    },
                    fields: {
                        type: Array
                    }
                },
            ]
        }
    ],
    jokulId: {
        type: String
    },
    brandName: {
        type: String
    },
    brandLogo: {
        type: String
    },
    seller: {
        type: String
    },
    publicAddress: {
        type: String,
        default: null
    },
    keyShare1: {
        type: String,
        default: null
    },
    keyShare2: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret) {
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    }
}
);

const Shop = marketplaceDbConnection.model('Shop', ShopSchema);

module.exports = Shop;
module.exports.DID_DATA = {
    SINGLE_DID: {
        name: "public_key",
        content: {
            controller: "iuytre_12345676543",
            did: "did:method:company_name:iuytre_12345676543",
            data: {
                name: "John Doe",
            },
        },
    },
    DID_BY_COMPANY: [
        {
            name: "00f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3f.did",
            content: {
                controller:
                    "00f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3f",
                did: "did:fuixlabs:Kukulu:00f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3f",
                data: {
                    name: "nguyen",
                    address:
                        "00f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3f",
                    organizationName: "xxx",
                    organizationMail: "xxx@gmail.com",
                    organizationPhoneNumber: "0909090909",
                    organizationAddress: "can tho",
                    website:
                        "https://github.com/FuixLabs/DID_Store/tree/DOC_COMPANY_NAME",
                    attachment: "",
                    issuer: true,
                    signedData: {
                        signature:
                            "845846a201276761646472657373583900f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3fa166686173686564f458867b2269737375657241646472657373223a22303066346238316534663530363262616265303030363865333539323361626363633439623439343363616434633663343430323735363366326432613539393362626662626333316433633363326562386138383033363638396562663031366436373361333936333838613135643366227d5840de29b21d7aea9e3db28292aeb43d9e2959619988a4057dc309feaa958956e35bbb8c79325439544ab6aee8941a7effbcadd259c410e01a1203fea1039ddb670c",
                        key: "a401010327200621582024a7c9f9d0a949e4d022e54da4ea931a98f8c668a93da1c6f0115b2a7f08f761",
                    },
                },
            },
        },
        {
            name: "2345678765432345678.did",
            content: {
                controller: "iuytre_12345676543",
                did: "did:method:company_name:iuytre_12345676543",
                data: {
                    name: "John Doe",
                    gender: "male",
                    dayOfBirth: "10-10-1995",
                    address: "27, Avenue X, New York city",
                    country: "USA",
                    identityNumber: "76543234567",
                    identityDocumentType: "987654567",
                    phone: "098765543",
                },
            },
        },
        {
            name: "234567898765434567cvbnmvcxcvbn.did",
            content: {
                controller: "iuytre_12345676543",
                did: "did:method:company_name:iuytre_12345676543",
                data: {
                    something: 123,
                },
            },
        },
        {
            name: "hellow.did",
            content: {
                controller: "iuytre_12345676543",
                did: "did:method:company_name:iuytre_12345676543",
                data: {
                    name: "John Doe",
                    gender: "male",
                    dayOfBirth: "10-10-1995",
                    address: "27, Avenue X, New York city",
                    country: "USA",
                    identityNumber: "76543234567",
                    identityDocumentType: "987654567",
                    phone: "098765543",
                },
            },
        },
        {
            name: "iuytre_12345676543.did",
            content: {
                controller: "iuytre_12345676543",
                did: "did:method:company_name:iuytre_12345676543",
                data: {
                    name: "John Doe",
                    gender: "male",
                    dayOfBirth: "10-10-1995",
                    address: "27, Avenue X, New York city",
                    country: "USA",
                    identityNumber: "76543234567",
                    identityDocumentType: "987654567",
                    phone: "098765543",
                },
            },
        },
        {
            name: "public_key.did",
            content: {
                controller: "iuytre_12345676543",
                did: "did:method:company_name:iuytre_12345676543",
                data: {
                    name: "John Doe",
                },
            },
        },
        {
            name: "public_key2.did",
            content: {
                controller: "iuytre_12345676543",
                did: "did:method:company_name:iuytre_12345676543",
                data: {
                    name: "John Doe",
                },
            },
        },
        {
            name: "public_key3.did",
            content: {
                controller: "iuytre_12345676543",
                did: "did:method:company_name:iuytre_12345676543",
                data: {
                    name: "Standard Chartered",
                    address: "0xa61B056dA0084a5f391EC137583073096880C2e3",
                    organizationName: "organizationName1",
                    organizationMail: "organizationMail1",
                    organizationPhoneNumber: "organizationPhoneNumber1",
                    organizationAddress: "organizationAddress1",
                    website: "https://www.sc.com/en/",
                    issuer: false,
                },
            },
        },
    ],
};

module.exports.OPERATION_STATUS = {
    SAVE_SUCCESS: { message: "Successfully Saved" },
    CLONE_SUCCESS: { message: "Successfully Cloned" },
    UPDATE_SUCCESS: { message: "Successfully Updated" },
    DELETE_SUCCESS: { message: "Successfully Deleted" },
};

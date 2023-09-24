export const DID_DATA = {
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
  NOT_FOUND_DID: {
    error_code: 20000,
    error_message: "Company with the given name cannot be found.",
  },
};

export const DOC_DATA = {
  SINGLE_DOC: {
    wrappedDoc: {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    didDoc: {
      controller: [
        "0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
      ],
      did: "did:Kukulu:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
      owner:
        "0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
      holder:
        "0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
      url: "file_name.document",
    },
  },
  DOC_BY_USER: [
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
  ],
  IS_EXIST: {
    isExisted: false,
  },
  DOCS_CONTAINS_STRING: [
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
    {
      data: {
        name: "0aee4fe9-5482-4028-b77d-98c632b2d0ee:string:OpenCerts Certificate of Award",
        title:
          "54230038-62b5-4584-92fe-c5d0a31a7db5:string:Test Title By Caps2",
        remarks:
          "32315e61-b6a9-4063-8584-80b75ea4e08f:string:Test Remarks By Caps",
        fileName:
          "875abe0c-d46e-4ee0-80a7-91eff3212204:string:cover-letter 123",
        shippingInformation: {
          title:
            "94b6199a-3645-4ea2-b169-e7018ca1a025:string:Name & Address of Shipping Agent/Freight Forwarder",
          countryName: "b74dbd5c-7b6d-4d60-af8e-952e718439b5:string:VIET NAM",
          stress: "4b9b0465-9837-490e-8f49-44be6a03d1d3:string:SG Freight",
          address:
            "329f5602-de66-44ea-a872-265594c56b6e:string:101 ORCHARD ROAD",
        },
        customInformation: {
          title: "7d9ab40a-ad3e-474c-8ca4-f26eedc1c946:string:Demo custom",
          additionalAddress:
            "c00e0935-c569-49c3-9cbe-aa94976666f6:string:55 Newton Road",
          telephoneNumber:
            "66377984-ca3c-4fa4-a1c3-4a72ca66bf1a:string:+84988888888",
        },
        declarationInformation: {
          title:
            "631ac6c5-14a7-412d-86a9-3f4c99aa9a76:string:Declaration by Shipping Agent/Freight Forwarder",
          declarationName:
            "b118d4a7-6e11-4b90-b11b-09f182b57f6e:string:PETER LEE",
          designation:
            "ff2ca43b-b5e9-4d5e-8760-5d033e8b648b:string:SHIPPING MANAGER",
          date: "3ebd284e-0a6b-43d3-a673-dda690e5862d:string:12/07/2022",
        },
        certification: {
          title:
            "0fe0c121-f83c-40f7-be2d-4eea5f06265d:string:Declaration by Shipping Agent/Freight Forwarder",
          certificationName:
            "f1905ac8-ff0e-4b05-8c82-737df3cab54a:string:PETER LEE",
          designation:
            "4dcc62ec-e7fa-42e5-817d-e003794ea8ae:string:SHIPPING MANAGER",
          date: "feb5c391-d177-4e85-86a8-d813bedacc37:string:12/07/2022",
        },
        companyName: "45015480-33a4-405b-a7d9-85b615fece28:string:Kukulu",
        intention: "ad553f77-a4d0-4e72-8d44-8670b898f185:string:trade",
        did: "db3eb189-d4b3-4820-b650-0c0f261826cb:string:did:fuixlabs:Kukulu:cover-letter 123",
        issuers: [
          {
            identityProofType: {
              type: "9872a87c-b0e4-4082-b260-e6f8775f1dd9:string:DID",
              did: "652e9b14-d556-4dd8-9940-4b4aa7160d2e:string:did:fuixlabs:Kukulu:00f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3f",
            },
            address:
              "b1bb3d16-7d92-4e62-933e-c27f47611b75:string:00f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3f",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "346b92f5aae8d3fbaaf6403c6cf2f0a4f28b06e7c799f6729d846ddb3bd50daf",
        proof: [
          {
            signature: {
              signature:
                "845846a201276761646472657373583900f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3fa166686173686564f458d07b2261646472657373223a22303066346238316534663530363262616265303030363865333539323361626363633439623439343363616434633663343430323735363366326432613539393362626662626333316433633363326562386138383033363638396562663031366436373361333936333838613135643366222c2274617267657448617368223a2233343662393266356161653864336662616166363430336336636632663061346632386230366537633739396636373239643834366464623362643530646166227d5840887a6635f5be9308c1dbb1b138e8d0e26eea0845ae20e7e394416dbce5114ebc2d2dbb245a8fa52fab8bb31cddad557920cbfb86861ec4f8eb7e77636b0c7f06",
              key: "a401010327200621582024a7c9f9d0a949e4d022e54da4ea931a98f8c668a93da1c6f0115b2a7f08f761",
            },
          },
        ],
        merkleRoot:
          "346b92f5aae8d3fbaaf6403c6cf2f0a4f28b06e7c799f6729d846ddb3bd50daf",
      },
      mintingNFTConfig: {
        type: "document",
        policy: {
          type: "Native",
          id: "aadb65529fd2f3f3ddde3db7954ba96367b9c09fa731aa130015b8a3",
          script:
            "8201828200581c8db250cad6df99b815e3a757965b7bf21b04e2103cb399298b88ade582051abc6b2ee6",
          ttl: 3161140966,
        },
        asset:
          "aadb65529fd2f3f3ddde3db7954ba96367b9c09fa731aa130015b8a3346b92f5aae8d3fbaaf6403c6cf2f0a4f28b06e7c799f6729d846ddb3bd50daf",
      },
    },
    {
      data: {
        name: "8f127f20-f556-43ed-8574-0ceec1c2f2ea:string:OpenCerts Certificate of Award",
        title:
          "180931ef-4843-4ce9-aba8-5c38a9fc3e07:string:Test Title By Caps2",
        remarks:
          "265a0979-ec2f-4e21-8f85-09dccc1ed7bc:string:Test Remarks By Caps",
        fileName: "f5a674be-3b30-4c29-9214-0e2e8434c902:string:cover-letter",
        shippingInformation: {
          title:
            "2699da05-81d0-4fd6-b544-cfd8b4d3a44c:string:Name & Address of Shipping Agent/Freight Forwarder",
          countryName: "d1dc3550-2b71-43e4-a0e7-ef8ab3ee7926:string:VIET NAM",
          stress: "3e1941f4-05e3-4d3d-a502-9408d0974b17:string:SG Freight",
          address:
            "654ca531-754a-4017-a4ff-beb5a3162c80:string:101 ORCHARD ROAD",
        },
        customInformation: {
          title: "38371f66-cd06-41b1-be13-0d7c26d17ff6:string:Demo custom",
          additionalAddress:
            "049a98e9-37bb-4275-a33c-5daac0db91cd:string:55 Newton Road",
          telephoneNumber:
            "ed94e4ee-3ca0-4c76-a0af-aca49d18ffbb:string:+84988888888",
        },
        declarationInformation: {
          title:
            "151dedab-b240-41e8-a081-de5ebaa784d3:string:Declaration by Shipping Agent/Freight Forwarder",
          declarationName:
            "b8c11692-572c-419c-9a8a-96c344ec9943:string:PETER LEE",
          designation:
            "21c0af9f-44c1-41b8-9cf2-5212b3ae94df:string:SHIPPING MANAGER",
          date: "afc59039-d74f-4a97-ba20-b16b01f2659b:string:12/07/2022",
        },
        certification: {
          title:
            "30cd8612-d22a-4bed-9258-86e5fc81e3b6:string:Declaration by Shipping Agent/Freight Forwarder",
          certificationName:
            "f818415c-d2e2-4d7b-be80-9a35b7b9468f:string:PETER LEE",
          designation:
            "2de6edd4-1bec-4517-b589-69b6391d27fa:string:SHIPPING MANAGER",
          date: "6743611c-f6f6-4068-aca0-41c8ad2d4f4a:string:12/07/2022",
        },
        companyName: "e9de1bee-2be7-48a9-8083-63374fb3cbd1:string:Kukulu",
        intention: "b484e1ff-acc9-4893-8f78-91feb18658e2:string:trade",
        did: "4542e4bd-aa33-433b-bed4-d06c3faa762d:string:did:fuixlabs:Kukulu:cover-letter",
        issuers: [
          {
            identityProofType: {
              type: "959e3f81-ece4-48a8-899a-58622b488c43:string:DID",
              did: "85fce2c2-c99a-40a5-b31e-208cd1cde22e:string:did:fuixlabs:Kukulu:00f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3f",
            },
            address:
              "276ab1d7-1fee-4f58-abc8-d5f57739dcb4:string:00f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3f",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "46e774e6c49ffbb633e87b62a98021a540ef37b6e9ded243ee33cd79b913936e",
        proof: [
          {
            signature: {
              signature:
                "845846a201276761646472657373583900f4b81e4f5062babe00068e35923abccc49b4943cad4c6c44027563f2d2a5993bbfbbc31d3c3c2eb8a88036689ebf016d673a396388a15d3fa166686173686564f458d07b2261646472657373223a22303066346238316534663530363262616265303030363865333539323361626363633439623439343363616434633663343430323735363366326432613539393362626662626333316433633363326562386138383033363638396562663031366436373361333936333838613135643366222c2274617267657448617368223a2234366537373465366334396666626236333365383762363261393830323161353430656633376236653964656432343365653333636437396239313339333665227d58405698ff85801a929ab8056d6a15a9e4c6ca6477fdc9c4b753ebca62709270182c876057901ac13a8fa74365ec88445e45a11d2259b53532fe04aec4b02de54f0d",
              key: "a401010327200621582024a7c9f9d0a949e4d022e54da4ea931a98f8c668a93da1c6f0115b2a7f08f761",
            },
          },
        ],
        merkleRoot:
          "46e774e6c49ffbb633e87b62a98021a540ef37b6e9ded243ee33cd79b913936e",
      },
      mintingNFTConfig: {
        type: "document",
        policy: {
          type: "Native",
          id: "b67ff49e10fc6165241de660e387caacce13715ce02d5ccfd71d8952",
          script:
            "8201828200581c8db250cad6df99b815e3a757965b7bf21b04e2103cb399298b88ade582051abc6b2dfe",
          ttl: 3161140734,
        },
        asset:
          "b67ff49e10fc6165241de660e387caacce13715ce02d5ccfd71d895246e774e6c49ffbb633e87b62a98021a540ef37b6e9ded243ee33cd79b913936e",
      },
    },
    {
      data: {
        name: "a1567bdd-4a3a-4deb-b1ef-885433491774:string:Bill of Lading",
        title: "9f892b00-3d03-47b1-b33b-2d4ad97abce6:string:Test Title By Caps",
        remarks:
          "56f69a42-889a-4d73-9dcc-6442958b3b95:string:Test Remarks By Caps",
        fileName:
          "620a0bb2-1598-4114-a97b-37b56fbbf83a:string:cover-letter Hao6",
        companyName:
          "1ab0be15-728c-4ae8-8521-ad1fddc03a0f:string:HAOCUTECOMPANY",
        did: "8c3dcdb1-f16a-497c-92ad-26b934aaf0b0:string:did:fuixlabs:HAOCUTECOMPANY:cover-letter Hao6",
        issuers: [
          {
            identityProofType: {
              type: "3685eeda-9b3a-456d-992f-48aaff2cec22:string:DID",
              did: "a99c2d4b-7e7b-4281-b4fb-7016c90f5add:string:xxxx",
            },
            tokenRegistry:
              "d2b9d8b7-b268-4b9e-a6a5-b6156552ac6a:string:dasdasdsaeiu201u32901djsakjdsalkdsa",
            address:
              "32529a91-b5f6-44cb-a964-1730cc62fb28:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleProof",
        targetHash:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
        proof: [
          {
            signature:
              "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2262623734656533633437386439306162393764303630313438343064633437326333313563633431653835313763353663356566656533396266386331303863227d58406db0206ed95090a5031b5bbbcfe77eaed85f7e4acb9bbdf8b995d14f4eee12a0a35623f349980a327fb7fc40f47b9b5d61158925edd8fea5242f67fb41bf6400",
          },
        ],
        merkleRoot:
          "bb74ee3c478d90ab97d06014840dc472c315cc41e8517c56c5efee39bf8c108c",
      },
      policyId: "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c",
      assetId:
        "d1082d0b547424c25487edc8f45d19041d1f64cba052b4f61ac6487c3964316238393761323763636139653733613333386630626135383231333139",
    },
  ],
  FETCHING_DOC_ERROR: {
    error_code: 10004,
    error_message:
      "Parameters in request body or query are missing. Please try again later.",
  },
  ALGORAND_WRAPPED_DOC: {
    version: "https://schema.openattestation.com/2.0/schema.json",
    data: {
      name: "eb2ebfb2-62e6-4e89-b326-668f97d5f142:string:OpenCerts Certificate of Award",
      title: "978c3e0a-8335-4059-8653-998184adfc76:string:Test Title By Caps2",
      remarks:
        "9fd10ccf-5736-46b6-a62d-bc87533a03aa:string:Test Remarks By Caps",
      fileName: "d9a118d4-cd63-4a0d-8a2e-f04bdaa46c84:string:cover-letter",
      shippingInformation: {
        title:
          "8bd910c0-43cd-4617-9546-e40358e2e773:string:Name & Address of Shipping Agent/Freight Forwarder",
        countryName: "d5229dab-5e92-40f7-8a41-856e81b02c36:string:VIET NAM",
        stress: "2bb33202-2870-425f-8256-a18363d0bf18:string:SG Freight",
        address: "5a81e499-c348-4a91-952a-b86db2853f15:string:101 ORCHARD ROAD",
      },
      customInformation: {
        title: "bb256376-2b5f-495a-a87d-d60629147976:string:Demo custom",
        additionalAddress:
          "a8a4d8e0-76b7-478f-8f0b-4a62d5eb9959:string:55 Newton Road",
        telephoneNumber:
          "80588748-8ce1-427e-bb54-4543f03b8706:string:+84988888888",
      },
      declarationInformation: {
        title:
          "71b82cbd-1791-4552-9bd2-a29a00391ded:string:Declaration by Shipping Agent/Freight Forwarder",
        declarationName:
          "7ba2fe68-0a6d-4990-b357-1248c3cebc9b:string:PETER LEE",
        designation:
          "bdcf2607-698e-4778-b804-0dc50fa11f22:string:SHIPPING MANAGER",
        date: "73ef8807-7f67-48d3-8f62-f1f5ee36049f:string:12/07/2022",
      },
      certification: {
        title:
          "af5126ab-1494-42f4-ac74-14b7bb05da26:string:Declaration by Shipping Agent/Freight Forwarder",
        certificationName:
          "174c25d4-a0af-4b78-8a5a-4392925f1caa:string:PETER LEE",
        designation:
          "8d74597b-8223-4787-8069-5ee8cddb9895:string:SHIPPING MANAGER",
        date: "8e31c7dd-3ddc-43a3-a705-5c7b2dad1e02:string:12/07/2022",
      },
      companyName:
        "c173f71d-761f-45e5-b30e-9713eb8dc743:string:SAMPLE_COMPANY_NAME",
      intention: "87c3648b-f6a9-4ef2-bb0d-6aa920b38829:string:trade",
      did: "5e89e527-01e8-4b7e-8b8d-b3abf7d1d47d:string:did:fuixlabs:SAMPLE_COMPANY_NAME:cover-letter",
      issuers: [
        {
          identityProofType: {
            type: "360fb9cd-c072-4a5b-95e9-aa27c24f26fb:string:DID",
            did: "4c6d4710-ca66-4052-b5c9-30841f12850f:string:did:fuixlabs:SAMPLE_COMPANY_NAME:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
          address:
            "434d4419-142b-4939-af21-cf035173eaa5:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
        },
      ],
    },
    signature: {
      type: "SHA3MerkleRoot",
      targetHash: "string",
      proof: [],
      merkleRoot: "string",
    },
    assetId: "",
    policyId: "",
    mintingNFTConfig: {
      txId: "QO2GO2AL75WNPK6WMTJDKAERB3RIYXI3UR7LLZ45HPCGJ7QZHI6Q",
      assetId: 151051717,
      assetName: "2739f33e46e491dda6071d0638e15944",
      unitName: "4bc9fb3b",
      assetURL:
        "afd111a7a7ff95ba7e531cbcffefe3c256b38f3ee3a21574cf32a590b11fd2c2",
      type: "credential",
      root: "652cff9c3ac7b2d339494c89b32afc8e2fb2cfcafa738a886a2ecb0c10ade41a",
    },
  },
  UNKNOWN_ERROR: {
    error_code: 10000,
    error_message: "Something went wrong with the server!",
  },
};

export const ALGORAND_DATA = {
  VERIFY_SUCCESS_HASH_RESULT: {
    code: 0,
    message: "SUCCESS",
    data: {
      assets: [
        {
          "created-at-round": 26578503,
          deleted: false,
          index: 150852395,
          params: {
            clawback:
              "3OFBQRUT4PAFOL4AGT3E7T4N3DZ2WT6GQHNENDOXA24A74SIDCUP5L2M3M",
            creator:
              "3OFBQRUT4PAFOL4AGT3E7T4N3DZ2WT6GQHNENDOXA24A74SIDCUP5L2M3M",
            decimals: 0,
            "default-frozen": false,
            freeze:
              "3OFBQRUT4PAFOL4AGT3E7T4N3DZ2WT6GQHNENDOXA24A74SIDCUP5L2M3M",
            manager:
              "3OFBQRUT4PAFOL4AGT3E7T4N3DZ2WT6GQHNENDOXA24A74SIDCUP5L2M3M",
            name: "123470a93982a5473c38ae0c8af174b2",
            "name-b64": "MTIzNDcwYTkzOTgyYTU0NzNjMzhhZTBjOGFmMTc0YjI=",
            reserve:
              "3OFBQRUT4PAFOL4AGT3E7T4N3DZ2WT6GQHNENDOXA24A74SIDCUP5L2M3M",
            total: 1,
            "unit-name": "d5fda495",
            "unit-name-b64": "ZDVmZGE0OTU=",
            url: "fe8e0ea951d01f627f63a0be071bcd8409de7b75c8efbe65887433178ff807b3",
            "url-b64":
              "ZmU4ZTBlYTk1MWQwMWY2MjdmNjNhMGJlMDcxYmNkODQwOWRlN2I3NWM4ZWZiZTY1ODg3NDMzMTc4ZmY4MDdiMw==",
          },
          metadata: {
            version: 0,
            attach:
              "fe8e0ea951d01f627f63a0be071bcd8409de7b75c8efbe65887433178ff807b3",
            timestamp: 1672196049823,
            type: "document",
            previous:
              "fe8e0ea951d01f627f63a0be071bcd8409de7b75c8efbe65887433178ff807b3",
            root: "fe8e0ea951d01f627f63a0be071bcd8409de7b75c8efbe65887433178ff807b3",
          },
          assetName: "123470a93982a5473c38ae0c8af174b2",
          assetId: 150852395,
          unitName: "d5fda495",
          txId: "7W3TJO26WF7Z7TNESZFKPT474STCOZTAHGIEBHVM73B4YBDIAZQA",
        },
      ],
    },
  },
  VERIFY_ERROR_HASH_RESULT: {
    code: 25,
    message: "ERROR",
    data: {
      assets: [],
    },
  },
  VERIFY_UNSUCCESS_HASH_RESULT: {
    code: 0,
    message: "SUCCESS",
    data: {
      assets: [],
    },
  },
  VERIFY_UNSUCCESS_SIGNATURE_RESULT: {
    code: 205,
    message: "INVALID_BODY",
    data: {},
  },
  VERIFY_SUCCESS_SIGNATURE_RESULT: { code: 0, message: "SUCCESS", data: true },
  CREATE_CREDENTIAL_SUCCESS: {
    code: 0,
    message: "SUCCESS",
    data: {
      txId: "QO2GO2AL75WNPK6WMTJDKAERB3RIYXI3UR7LLZ45HPCGJ7QZHI6Q",
      assetId: 151051717,
      assetName: "2739f33e46e491dda6071d0638e15944",
      unitName: "4bc9fb3b",
      assetURL:
        "afd111a7a7ff95ba7e531cbcffefe3c256b38f3ee3a21574cf32a590b11fd2c2",
      type: "credential",
      root: "652cff9c3ac7b2d339494c89b32afc8e2fb2cfcafa738a886a2ecb0c10ade41a",
    },
  },
  CREATE_TRANSACTION_UNSUCCESSFULLY: {
    code: 1,
    message: "SUCCESS",
    data: {},
  },
  EXISTED_NAME_OF_DOCUMENT: {
    isExisted: true,
  },
};

export const CREDENTIAL_DATA = {
  SINGLE_CREDENTIAL: {
    issuer: "did:company:owner_public_key",
    subject: "did:company2:other_public_key",
    credentialSubject: {
      object: "did:some_method:an_wrapped_doc_did",
      action: {
        code: 3000,
        value: "changeHolderShip",
      },
    },
    signature: "12345678986543234567qwertytwq231234567876543sdfghgfds",
    metadata: {
      dateCreated: "22/06/2022",
      some_fields: "some_data",
    },
  },
};

export const AUTH_DATA = {
  USER_ADDR_FROM_TOKEN: {
    data: {
      address:
        "addr_test1qpclcrxqp8dtrmpj5f0w95jze83xnt5k0w8laqxemh75anlzfvy5zhnkgthq9l6e724te8csdj6ft90l9cz2zx6zt83swu3nju",
    },
  },
  USER_ADDR_FROM_TOKEN_V2: {
    data: {
      network: "Algorand",
      address: "KOWRYYQTEOKT5WSXIGWE6QPGAHX4SS3JEZ3ASIQ74GGWPOXJRMEPVHLWAM",
    },
  },
  INVALID_ACCESS_TOKEN: {
    error_code: 10001,
    error_message: "Unauthorized",
  },
  GET_ACCESS_TOKEN: {
    data: {
      access_token: "mock-access-token",
      network: "Cardano",
    },
  },
};

export const CARDANO_DATA = {
  MINT_NFT_WRAPPED_DOC: {
    code: 0,
    message: "SUCCESS",
    data: {
      type: "document",
      policy: {
        type: "Native",
        id: "03c25bba38be9ffc375394ac3dc690ae2ad78bed62cb0fffca39e614",
        script:
          "8201828200581cb6a2c7c962ec2e9b8562a5aa9e693578d32d14591688a5ceb1af302d82051abfc12c96",
        ttl: 3217108118,
      },
      asset:
        "03c25bba38be9ffc375394ac3dc690ae2ad78bed62cb0fffca39e61421c48f072b87b4c0cbf2d3b7be8750ca9bc37c14a46aa140fcbe401b570b98d1",
    },
  },
  MINT_NFT_CREDENTIAL: {
    code: 0,
    message: "SUCCESS",
    data: {
      type: "document",
      policy: {
        type: "Native",
        id: "123456521",
        script: "",
        ttl: 0,
      },
      asset: "12345678987654321qwertyuytrewq",
    },
  },
  SUCCESS_STATUS: {
    code: 0,
    message: "SUCCESS",
  },
  NFT: {
    code: 0,
    message: "SUCCESS",
    data: { value: "NFT data", metadata: { data: "10/10/2022" } },
  },
  LIST_OF_NFTS: {
    code: 0,
    message: "SUCCESS",
    data: [
      {
        asset:
          "87e33bb05773006a9c625aa28f7db30c20727921331acb5391d06c8d308207adbe71aa51af97f1e9846bcbfbf54b6a2c503c7338a66b0be1f61fab15",
        policyId: "87e33bb05773006a9c625aa28f7db30c20727921331acb5391d06c8d",
        assetName:
          "308207adbe71aa51af97f1e9846bcbfbf54b6a2c503c7338a66b0be1f61fab15",
        readableAssetName: "0�\x07��q�Q����k���Kj,P<s8�k\x0B��\x1F�\x15",
        fingerprint: "asset1240275ks0uqp8temlk0plng0mj7f30huktfkyy",
        quantity: 1,
        initialMintTxHash:
          "61e5647914c8913bcd5b0b780bf92f30eece20540b0e25d2416a71777f1f8282",
        mintOrBurnCount: 1,
        onchainMetadata: {
          "87e33bb05773006a9c625aa28f7db30c20727921331acb5391d06c8d": {
            "308207adbe71aa51af97f1e9846bcbfbf54b6a2c503c7338a66b0be1f61fab15":
              {
                ttl: 3167189289,
                type: "document",
                attach:
                  "308207adbe71aa51af97f1e9846bcbfbf54b6a2c503c7338a66b0be1f61fab15",
                policy:
                  "87e33bb05773006a9c625aa28f7db30c20727921331acb5391d06c8d",
                version: 0,
                timestamp: 1669272489729,
              },
          },
        },
        metadata: {},
      },
    ],
  },
  SIGNATURE_VERIFICATION: {
    code: 0,
    message: "SUCCESS",
    data: true,
  },
};

export const DID_CONTROLLER_OPERATION_STATUS = {
  SAVE_SUCCESS: { message: "Successfully Saved" },
  CLONE_SUCCESS: { message: "Successfully Cloned" },
  UPDATE_SUCCESS: { message: "Successfully Updated" },
  DELETE_SUCCESS: { message: "Successfully Deleted" },
};

export const OTHER_DATA = {
  CREATE_WRAPPED_DOC_ARGS: {
    wrappedDocument: {
      version: "https://schema.openattestation.com/2.0/schema.json",
      data: {
        name: "eb2ebfb2-62e6-4e89-b326-668f97d5f142:string:OpenCerts Certificate of Award",
        title:
          "978c3e0a-8335-4059-8653-998184adfc76:string:Test Title By Caps2",
        remarks:
          "9fd10ccf-5736-46b6-a62d-bc87533a03aa:string:Test Remarks By Caps",
        fileName: "d9a118d4-cd63-4a0d-8a2e-f04bdaa46c84:string:cover-letter",
        shippingInformation: {
          title:
            "8bd910c0-43cd-4617-9546-e40358e2e773:string:Name & Address of Shipping Agent/Freight Forwarder",
          countryName: "d5229dab-5e92-40f7-8a41-856e81b02c36:string:VIET NAM",
          stress: "2bb33202-2870-425f-8256-a18363d0bf18:string:SG Freight",
          address:
            "5a81e499-c348-4a91-952a-b86db2853f15:string:101 ORCHARD ROAD",
        },
        customInformation: {
          title: "bb256376-2b5f-495a-a87d-d60629147976:string:Demo custom",
          additionalAddress:
            "a8a4d8e0-76b7-478f-8f0b-4a62d5eb9959:string:55 Newton Road",
          telephoneNumber:
            "80588748-8ce1-427e-bb54-4543f03b8706:string:+84988888888",
        },
        declarationInformation: {
          title:
            "71b82cbd-1791-4552-9bd2-a29a00391ded:string:Declaration by Shipping Agent/Freight Forwarder",
          declarationName:
            "7ba2fe68-0a6d-4990-b357-1248c3cebc9b:string:PETER LEE",
          designation:
            "bdcf2607-698e-4778-b804-0dc50fa11f22:string:SHIPPING MANAGER",
          date: "73ef8807-7f67-48d3-8f62-f1f5ee36049f:string:12/07/2022",
        },
        certification: {
          title:
            "af5126ab-1494-42f4-ac74-14b7bb05da26:string:Declaration by Shipping Agent/Freight Forwarder",
          certificationName:
            "174c25d4-a0af-4b78-8a5a-4392925f1caa:string:PETER LEE",
          designation:
            "8d74597b-8223-4787-8069-5ee8cddb9895:string:SHIPPING MANAGER",
          date: "8e31c7dd-3ddc-43a3-a705-5c7b2dad1e02:string:12/07/2022",
        },
        companyName:
          "c173f71d-761f-45e5-b30e-9713eb8dc743:string:SAMPLE_COMPANY_NAME",
        intention: "87c3648b-f6a9-4ef2-bb0d-6aa920b38829:string:trade",
        did: "5e89e527-01e8-4b7e-8b8d-b3abf7d1d47d:string:did:fuixlabs:SAMPLE_COMPANY_NAME:cover-letter",
        issuers: [
          {
            identityProofType: {
              type: "360fb9cd-c072-4a5b-95e9-aa27c24f26fb:string:DID",
              did: "4c6d4710-ca66-4052-b5c9-30841f12850f:string:did:fuixlabs:SAMPLE_COMPANY_NAME:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
            },
            address:
              "434d4419-142b-4939-af21-cf035173eaa5:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
        ],
      },
      signature: {
        type: "SHA3MerkleRoot",
        targetHash: "string",
        proof: [],
        merkleRoot: "string",
      },
      assetId: "",
      policyId: "",
    },
    issuerAddress:
      "0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
  },
  WRAPPED_DOC: {
    version: "https://schema.openattestation.com/2.0/schema.json",
    data: {
      name: "eb2ebfb2-62e6-4e89-b326-668f97d5f142:string:OpenCerts Certificate of Award",
      title: "978c3e0a-8335-4059-8653-998184adfc76:string:Test Title By Caps2",
      remarks:
        "9fd10ccf-5736-46b6-a62d-bc87533a03aa:string:Test Remarks By Caps",
      fileName: "d9a118d4-cd63-4a0d-8a2e-f04bdaa46c84:string:cover-letter",
      shippingInformation: {
        title:
          "8bd910c0-43cd-4617-9546-e40358e2e773:string:Name & Address of Shipping Agent/Freight Forwarder",
        countryName: "d5229dab-5e92-40f7-8a41-856e81b02c36:string:VIET NAM",
        stress: "2bb33202-2870-425f-8256-a18363d0bf18:string:SG Freight",
        address: "5a81e499-c348-4a91-952a-b86db2853f15:string:101 ORCHARD ROAD",
      },
      customInformation: {
        title: "bb256376-2b5f-495a-a87d-d60629147976:string:Demo custom",
        additionalAddress:
          "a8a4d8e0-76b7-478f-8f0b-4a62d5eb9959:string:55 Newton Road",
        telephoneNumber:
          "80588748-8ce1-427e-bb54-4543f03b8706:string:+84988888888",
      },
      declarationInformation: {
        title:
          "71b82cbd-1791-4552-9bd2-a29a00391ded:string:Declaration by Shipping Agent/Freight Forwarder",
        declarationName:
          "7ba2fe68-0a6d-4990-b357-1248c3cebc9b:string:PETER LEE",
        designation:
          "bdcf2607-698e-4778-b804-0dc50fa11f22:string:SHIPPING MANAGER",
        date: "73ef8807-7f67-48d3-8f62-f1f5ee36049f:string:12/07/2022",
      },
      certification: {
        title:
          "af5126ab-1494-42f4-ac74-14b7bb05da26:string:Declaration by Shipping Agent/Freight Forwarder",
        certificationName:
          "174c25d4-a0af-4b78-8a5a-4392925f1caa:string:PETER LEE",
        designation:
          "8d74597b-8223-4787-8069-5ee8cddb9895:string:SHIPPING MANAGER",
        date: "8e31c7dd-3ddc-43a3-a705-5c7b2dad1e02:string:12/07/2022",
      },
      companyName:
        "c173f71d-761f-45e5-b30e-9713eb8dc743:string:SAMPLE_COMPANY_NAME",
      intention: "87c3648b-f6a9-4ef2-bb0d-6aa920b38829:string:trade",
      did: "5e89e527-01e8-4b7e-8b8d-b3abf7d1d47d:string:did:fuixlabs:SAMPLE_COMPANY_NAME:cover-letter",
      issuers: [
        {
          identityProofType: {
            type: "360fb9cd-c072-4a5b-95e9-aa27c24f26fb:string:DID",
            did: "4c6d4710-ca66-4052-b5c9-30841f12850f:string:did:fuixlabs:SAMPLE_COMPANY_NAME:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
          },
          address:
            "434d4419-142b-4939-af21-cf035173eaa5:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
        },
      ],
    },
    signature: {
      type: "SHA3MerkleRoot",
      targetHash: "string",
      proof: [],
      merkleRoot: "string",
    },
    assetId: "",
    policyId: "",
    mintingNFTConfig: {
      type: "document",
      policy: {
        type: "Native",
        id: "03c25bba38be9ffc375394ac3dc690ae2ad78bed62cb0fffca39e614",
        script:
          "8201828200581cb6a2c7c962ec2e9b8562a5aa9e693578d32d14591688a5ceb1af302d82051abfc12c96",
        ttl: 3217108118,
      },
      asset:
        "03c25bba38be9ffc375394ac3dc690ae2ad78bed62cb0fffca39e61421c48f072b87b4c0cbf2d3b7be8750ca9bc37c14a46aa140fcbe401b570b98d1",
    },
  },
  CREATE_CREDENTIAL_ARGS: {
    did: "did:method:Kukulu:file_name",
    credential: {
      issuer:
        "did:fuixlabs:PAPERLESS_COMPANY:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
      credentialSubject: {
        object: "did:fuixlabs:PAPERLESS_COMPANY:cover-letter test1",
        action: {
          code: 20,
          value: "nominateChangeOwnership",
          label: "Request transfer of Owner",
          subTitle: "Owner can transfer the OwnerShip.",
          formLabel: "New Owner Address",
          buttonLabel: "Transfer",
          fields: [
            {
              name: "newOwner",
              require: true,
              value: "ownerKey",
            },
          ],
          updatedFieds: [
            {
              name: "ownerKey",
            },
          ],
          surrender: false,
        },
      },
      signature: {
        signature:
          "845846a201276761646472657373583900d8d294e008e0e2ed6167d8a6c47b421a76604d8d2662ec05195727818f206aa6c6fd2a55810995ee86e2a3b7862f5029ec8d7b988214aae7a166686173686564f45902047b2261646472657373223a22303064386432393465303038653065326564363136376438613663343762343231613736363034643864323636326563303531393537323738313866323036616136633666643261353538313039393565653836653261336237383632663530323965633864376239383832313461616537222c227375626a656374223a7b226f626a656374223a226469643a667569786c6162733a50415045524c4553535f434f4d50414e593a636f7665722d6c6574746572207465737431222c22616374696f6e223a7b22636f6465223a32302c2276616c7565223a226e6f6d696e6174654368616e67654f776e657273686970222c226c6162656c223a2252657175657374207472616e73666572206f66204f776e6572222c227375625469746c65223a224f776e65722063616e207472616e7366657220746865204f776e6572536869702e222c22666f726d4c6162656c223a224e6577204f776e65722041646472657373222c22627574746f6e4c6162656c223a225472616e73666572222c226669656c6473223a5b7b226e616d65223a226e65774f776e6572222c2272657175697265223a747275652c2276616c7565223a226f776e65724b6579227d5d2c22757064617465644669656473223a5b7b226e616d65223a226f776e65724b6579227d5d2c2273757272656e646572223a66616c73657d7d7d5840003a9fd1ebeb1f8ba4d404b7e16f7cb89564f0b4648b63038d73aa7a6c03e8fa7abdd7c9865a09a274c9543be3c0e4819f31d577e34c757c0a626e882d19c408",
        key: "a4010103272006215820ced5e982daf60b191fb41fcbfe75453307c644cfdd17b0b81da4792d225dc50a",
      },
      metadata: {
        currentOwner:
          "00d8d294e008e0e2ed6167d8a6c47b421a76604d8d2662ec05195727818f206aa6c6fd2a55810995ee86e2a3b7862f5029ec8d7b988214aae7",
      },
      timestamp: 1659330236137,
      status: "pending",
      mintingNFTConfig: {
        type: "credentail",
        policy: {
          type: "Native",
          id: "ed9f068881fd29842e8b5267ae8220aca2c2953617ce07c7895cfd30",
          script:
            "8201828200581cd37dfe9485c993853d7ac3ea61145315c66bc3a79bc3ad2069a5aa2882051abfce4cf9",
          ttl: 3217968377,
          reuse: true,
        },
        asset:
          "ed9f068881fd29842e8b5267ae8220aca2c2953617ce07c7895cfd30127148bdcb294e220f0c9aef41a307be8e910157901d2bf349492e7919708208",
      },
    },
    config: {
      type: "credentail",
      policy: {
        type: "Native",
        id: "ed9f068881fd29842e8b5267ae8220aca2c2953617ce07c7895cfd30",
        script:
          "8201828200581cd37dfe9485c993853d7ac3ea61145315c66bc3a79bc3ad2069a5aa2882051abfce4cf9",
        ttl: 3217968377,
        reuse: true,
      },
      asset:
        "ed9f068881fd29842e8b5267ae8220aca2c2953617ce07c7895cfd30127148bdcb294e220f0c9aef41a307be8e910157901d2bf349492e7919708208",
    },
  },
  ALGORAND_CREDENTIAL_ARGS: {
    credential: {
      issuer:
        "did:fuixlabs:DOMINIUM_COMPANY_3:KOWRYYQTEOKT5WSXIGWE6QPGAHX4SS3JEZ3ASIQ74GGWPOXJRMEPVHLWAM",
      credentialSubject: {
        newOwner: "4NSPMTP4ZV7E6ZYPTQ25J4IH4HBSG53SKQT53LUJ25O7HDUPZSBLVUC23U",
        object: "did:fuixlabs:DOMINIUM_COMPANY_3:tester-29-9",
        action: {
          code: 20,
          value: "nominateChangeOwnership",
          label: "Request transfer of Owner",
          subTitle: "Owner can transfer the OwnerShip.",
          formLabel: "New Owner Address",
          buttonLabel: "Transfer",
          fields: [],
          updatedFieds: [],
          surrender: false,
        },
      },
      signature:
        "XpGgegytxMtxcqwccVSRltGczd1jERTuRn1KM2atpfSVN1fh2k9007HrdoJB/232ofRjcZQQCi7CQzDRYc/YBA==",
      metadata: {
        currentOwner:
          "UHPKFCETTD72B26CPRJKT7TBLGLBEJMMAIO7FXKMBQTW2PNTBUBM5ACL6M",
        currentHolder:
          "4NSPMTP4ZV7E6ZYPTQ25J4IH4HBSG53SKQT53LUJ25O7HDUPZSBLVUC23U",
      },
      timestamp: 1672299774172,
      status: "pending",
    },
    did: "did:fuixlabs:DOMINIUM_COMPANY_3:tester-29-9",
    config: {
      txId: "W725CESNNCP4KHZWJLK7FHQ34YIOQQIVBSU2ISJYDJRUBOYM7IVQ",
      assetId: 151036431,
      assetName: "30db6f1f5f8fdcf4a6037b715b34a655",
      unitName: "4bc9fb3b",
      assetURL:
        "652cff9c3ac7b2d339494c89b32afc8e2fb2cfcafa738a886a2ecb0c10ade41a",
      type: "document",
      root: "652cff9c3ac7b2d339494c89b32afc8e2fb2cfcafa738a886a2ecb0c10ade41a",
    },
  },
};

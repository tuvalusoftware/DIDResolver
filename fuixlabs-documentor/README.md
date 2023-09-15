### Create new wrapped document

`createDocument` takes an array of documents as an object, the current number of the user logged into the system is encrypted, the update field is a boolean to indicate that the user just wants to create a new document or update it. update an existing document, finally an updateDocument object, an object that the user wants to update the information of the new document into.

If the document creation is successful, the `createDocument` function will return an object that includes the wrappedDocument field, which is an object containing the document's information. In case of an error, the system will return a String as an error while creating the document

```js
import {createDocument} from './fuixlabs-documentor';
  const usedAddress = '0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3';
  const update = false;
  const updateDocument = {};
  const documents = [
    {
      did: "did:fuixlabs:PAPERLESS_COMPANY:0x0",
      fileName: "cover-letter Hao25",
      name: "OpenCerts Certificate of Award",
      remarks: "Test Remarks By Caps",
      title: "Test Title By Caps",
    }
  ];
  try 
  {
    const {wrappedDocument} = await createDocument(documents, usedAddress, false, {});
    const {data} = wrappedDocument;
  } catch(e) {
    console.log(e);
  } 
```

### Verify existed wrapped document

The `verifyDocument` function takes as arguments document is an object that includes the content of the wrapped document that the user wants to verify, usedAddress is the current address of the user who wants to verify encrypted, and the service that the user wants to use. to verify document.

If the document is validated, the function returns true, otherwise if the validation fails, the function returns an error object.

```js
import { verifyWrappedDocument } from 'fuixlabs-documentor/verifyDocument';

const document = {
  assetId: "668952f7b2f118d3050a9ab72431f783d04c75abca794a6d05ea19a06138386536323232336534643232316331653666633833663934306364323539",
  data: {
    companyName: "6b2ea0dd-0473-486e-9833-06b74191caac:string:PAPERLESS_COMPANY",
    did: "827512a4-3572-4f88-bfbf-755ada572000:string:did:fuixlabs:PAPERLESS_COMPANY:cover-letter Hao25",
    fileName: "f666adf8-e9ce-4d38-a320-167328ebbfb1:string:cover-letter Hao25",
    intention: "8d751c19-677b-436c-aafd-c90900fb947f:string:trade",
    issuers: [
      address: "ccb1b739-90da-4ea9-8239-2c5c229e32ee:string:0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3",
      identityProofType: {
        did: "fd6be277-3e0d-4c55-9334-5acb84f16967:string:did:fuixlabs:PAPERLESS_COMPANY:0x0",
        type: "7e900aba-fb4f-49f8-8a61-cafc46bddec1:string:DID"
      },
      name: "a9050c20-aed8-4449-b288-2379d267a6b8:string:OpenCerts Certificate of Award",
      remarks: "250c8584-62eb-4bee-886e-0b4de2095006:string:Test Remarks By Caps",
      title: "80bed6d0-81e9-4b3a-b9eb-b6c4e602ef5f:string:Test Title By Caps"
    ]
  },
  policyId: "668952f7b2f118d3050a9ab72431f783d04c75abca794a6d05ea19a0",
  signature: {
    merkleRoot: "d0774ab687ff0a8d9460c1ab5ea1b5c2b2e2d54f282a404d5ffb0f8874fe0e07",
    targetHash: "d0774ab687ff0a8d9460c1ab5ea1b5c2b2e2d54f282a404d5ffb0f8874fe0e07",
    type: "SHA3MerkleProof",
    proof: [
      {
        signature: "845869a3012704582000b0095f60c72bb8e49d9facf8ddd99c5443d9f17d82b3cbbcc31dd144e99acf676164647265737358390071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3a166686173686564f458d07b2261646472657373223a22303037316663306363303039646162316563333261323565653264323432633965323639616539363762386666653830643964646664346563666532346230393431356537363432656530326666353966326161626339663130366362343935393566663265303461313162343235396533222c2274617267657448617368223a2264303737346162363837666630613864393436306331616235656131623563326232653264353466323832613430346435666662306638383734666530653037227d584092d0d06a6f4f9b3bcfce305eccc4ee6fba4748c33c88f4529c43b35a405c94aabffe7f87fc8630d12bb4ec1e586a68b614b7548b34a70946be53214c24832305"
      }
    ]
  }
}
const usedAddress = '0071fc0cc009dab1ec32a25ee2d242c9e269ae967b8ffe80d9ddfd4ecfe24b09415e7642ee02ff59f2aabc9f106cb49595ff2e04a11b4259e3';
const SERVICE = {
  CARDANO: 'cardano',
  ETHERIUM: 'eth',
};
try {
  const verifyRes = await verifyWrappedDocument(document, usedAddress, SERVICE.CARDANO);
}
catch(e) {
  console.log(e);
}




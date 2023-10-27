// * Endorsement is the function to check which action can the current user can perform depended on their key

export const ACTIONS_IDENTITY = [
  {
    // * Only holder can change the ownership of the identity
    code: 2,
    value: 'changeHolder',
    label: 'Transfer of Holder',
    subTitle: 'Owner can transfer the Holdership another Holder.',
    formLabel: 'New Holder Address',
    buttonLabel: 'Transfer',
    fields: [
      {
        name: 'newHolder', // * DID generated from DID resolver rely on input address of new holder
        value: 'holderKey',
        require: true,
      },
    ],
    updatedFieds: [
      {
        name: 'holderKey',
      },
    ],
    endorsement: function (currentAddress, holderKey, ownerKey) {
      if (currentAddress === ownerKey) return true;
      return false;
    },
    surrender: false,
  },
  {
    // * The holder and owner must be the same to the change the ownership of the identity
    code: 10,
    value: 'endorseChangeOwnership',
    label: 'Transfer of Owner',
    subTitle: 'Owner can transfer the OwnerShip.',
    formLabel: 'New Owner Address',
    buttonLabel: 'Transfer',
    fields: [
      {
        name: 'newOwner', // * DID generated from DID resolver rely on input address of new owner
        require: true,
        value: 'ownerKey',
      },
    ],
    updatedFieds: [
      {
        name: 'ownerKey',
      },
    ],
    endorsement: function (currentAddress, holderKey, ownerKey) {
      if (currentAddress === holderKey && currentAddress === ownerKey) return true;
      return false;
    },
    surrender: false,
  },
  {
    // * If the holder and owner are different, the owner only can change the owner whenever the holder accept
    code: 20,
    value: 'nominateChangeOwnership',
    label: 'Transfer of Owner',
    subTitle: 'Owner can transfer the OwnerShip.',
    formLabel: 'New Owner Address',
    buttonLabel: 'Transfer',
    fields: [
      {
        name: 'newOwner', // * DID generated from DID resolver rely on input address of new owner
        require: true,
        value: 'ownerKey',
      },
    ],
    endorsement: function (currentAddress, holderKey, ownerKey) {
      if (holderKey !== ownerKey && currentAddress === ownerKey) return true;
      return false;
    },
    updatedFieds: [
      {
        name: 'ownerKey',
      },
    ],
    surrender: false,
  },
  {
    code: 30,
    value: 'Surrender of Document',
    label: 'Surrender of Document',
    buttonLabel: 'Surrender',
    fields: [],
    endorsement: function (currentAddress, holderKey, ownerKey) {
      if (currentAddress === ownerKey) return true;
      return false;
    },
    surrender: true,
  },
];

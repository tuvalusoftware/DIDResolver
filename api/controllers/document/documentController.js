// * Constants
import { ERRORS, SERVERS } from "../../../core/constants.js";

// * Utilities
import axios from "axios";
import "dotenv/config";
import {
  checkUndefinedVar,
  getCurrentDateTime,
  createPDF,
  getPublicKeyFromAddress,
} from "../../../core/index.js";
import { createDocumentForCommonlands } from "../../../core/document.js";
import fs from "fs";
import FormData from "form-data";
import { getAccountBySeedPhrase } from "../../../core/utils/lucid.js";

axios.defaults.withCredentials = true;

export default {
  createDocument: async (req, res) => {
    try {
      const { plotId } = req.body;
      const { access_token } = req.cookies;
      const accessToken = process.env.COMMONLANDS_SECRET_KEY;
      const undefinedVar = checkUndefinedVar({
        plotId,
        accessToken,
        access_token,
      });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const plotResponse = await axios.get(
        `${SERVERS?.STAGING_SERVER}/api/services/dominium/${plotId}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (plotResponse?.data?.error_code) {
        return res.status(200).json(plotResponse?.data);
      }
      const message = "Sample message";
      const pdfFileName =
        `Land-Certificate-${plotResponse?.data?.plot?.name}` || "";
      const isExistedResponse = await axios.get(
        SERVERS.DID_CONTROLLER + "/api/doc/exists",
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
          params: {
            companyName: process.env.COMPANY_NAME,
            fileName: pdfFileName,
          },
        }
      );
      if (isExistedResponse?.data?.isExisted) {
        return res.status(200).json({
          error_code: 400,
          error_message: "Document existed",
        });
      }
      const plotDetailForm = {
        profileImage: "sampleImages",
        fileName: pdfFileName,
        name: `Land Certificate`,
        title: `Land-Certificate-${plotResponse?.data?.plot?.name || ""}`,
        No: plotResponse?.data?.plot?.no || "CML21566325",
        dateIssue: getCurrentDateTime(),
        personalInformation: {
          claimant: plotResponse?.data?.owner?.fullName || "",
          right: plotResponse?.data?.owner?.role || "",
          phoneNumber: plotResponse?.data?.owner?.phoneNumber || "",
          claimrank: "okay",
          description:
            "Okay is the starting point. This level may have some boundaries unverified and may include one boundary dispute. If there is an ownership dispute of a plot but and one of the owners is part of a claimchain and the other’s has not completed a claimchain, the completed claimchain person will be listed as Okay. ",
        },
        plotInformation: {
          plotName: plotResponse?.data?.plot?.name || "",
          plotId: plotResponse?.data?.plot?.id || "",
          plotStatus: "Free & Clear",
          plotPeople: "Verified by 3 claimants, 6 Neighbors",
          plotLocation: plotResponse?.data?.plot?.placeName || "",
        },
        certificateByCommonlands: {
          publicSignature: "mm",
          name: "Commonlands System LLC",
          commissionNumber: "139668234",
          commissionExpiries: "09/12/2030",
        },
        certificateByCEO: {
          publicSignature: "nn",
          name: "Darius Golkar",
          commissionNumber: "179668234",
          commissionExpiries: "09/12/2030",
        },
      };
      const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
        seedPhrase: process.env.ADMIN_SEED_PHRASE,
      });
      const signMessage = await lucidClient
        ?.newMessage(
          getPublicKeyFromAddress(currentWallet?.paymentAddr),
          Buffer.from(message).toString("hex")
        )
        .sign();
      const { wrappedDocument } = await createDocumentForCommonlands({
        seedPhrase: process.env.ADMIN_SEED_PHRASE,
        documents: [plotDetailForm],
        address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
        signedData: signMessage,
        access_token: access_token,
      });
      createPDF().catch((error) => {
        return res.status(200).json({
          error_code: 400,
          error_message: error?.message || error || "Error while creating PDF",
        });
      });
      const formData = new FormData();
      formData.append(
        "uploadedFile",
        fs.readFileSync(`./assets/pdf/${pdfFileName}.pdf`),
        {
          filename: `${process.env.COMPANY_NAME}_${pdfFileName}.pdf`,
        }
      );
      const uploadResponse = await axios.post(
        `${SERVERS?.COMMONLANDS_GITHUB_SERVICE}/api/git/upload/file`,
        formData
      );
      return res.status(200).json(uploadResponse?.data);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};

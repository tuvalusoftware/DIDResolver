import cron from "node-cron";
import { RequestModel } from "../../db/models/requestModel.js";
import { REQUEST_TYPE } from "../../rabbit/config.js";

export const setUpCron = (app) => {
    const task = cron.schedule(
        "*/1 * * * *",
        async () => {
            const requests = await RequestModel.find({
                status: "pending",
                type: REQUEST_TYPE.MINTING_TYPE.updatePlot,
            }).sort({ createdAt: -1 });
        },
        {
            scheduled: false,
        }
    );

    task.start();
};

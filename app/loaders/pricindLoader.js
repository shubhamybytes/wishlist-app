import { createSlug, getAllReviews, findOne, getQueueData } from "../createDynamicTables";
import { getCurrentStoreData } from "../service/store";
import { SUBSCRIPTION_PLAN_TABLE, configSettingsTable } from "../constants";
import { authenticate, GOLD_PLAN, PREMIUM_PLAN } from "../shopify.server";

export const indexLoader = async ({ request }) => {



    return {name: "shu", description: 'yadv'}
}
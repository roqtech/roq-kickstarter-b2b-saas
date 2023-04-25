import { Platform } from "@roq/nextjs";
import { serverConfig } from "config";
import { RoqAuthorizationClient } from '@roq/prismajs'

export const roqClient = new Platform({
  host: serverConfig.roq.platformURL,
  environmentId: serverConfig.roq.environmentId,
  apiKey: serverConfig.roq.apiKey,
});

export const authorizationClient = new RoqAuthorizationClient(roqClient)

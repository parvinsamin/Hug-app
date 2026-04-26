import { v4 as uuid } from "uuid";
import { storage } from "../storage/storage.service";

const DEVICE_KEY = "hug_device_id";

export async function loadOrCreateDeviceId(): Promise<string> {
    const existing = await storage.getItem(DEVICE_KEY);

    if (existing) return existing;

    const newId = uuid();
    await storage.setItem(DEVICE_KEY, newId);

    return newId;
}

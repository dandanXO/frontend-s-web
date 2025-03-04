import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const importSyncTree = tree => {
  return https(5 * 60 * 1000).request(
    '/sync-member-tree/import',
    Method.POST,
    { tree: JSON.stringify(tree) },
    ContentType.form
  )
}

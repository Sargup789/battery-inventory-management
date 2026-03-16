import Axios from "axios";
import { getTokenCookie } from "lib/auth-cookie";

export default async function list(req: any, res: any) {
  const apiUrl = process.env.ROOT_URL;
  const authUrl = process.env.AUTH_URL || process.env.AUTH_ROOT_URL || apiUrl;
  let encodedPath = "";
  const queryObj = req.query;
  const parentKeys = Object.keys(queryObj);
  const accessToken = getTokenCookie(req);

  if (queryObj["path"]) {
    encodedPath += queryObj["path"];
    if (parentKeys.length > 1) {
      delete queryObj["path"];
      const keys = Object.keys(queryObj);
      encodedPath += "?";
      for (let i = 0; i < keys.length; i++) {
        if (i !== 0) encodedPath += "&";
        encodedPath += keys[i] + "=" + encodeURIComponent(queryObj[keys[i]]);
      }
    }
  }
  if (encodedPath[0] === `/`) encodedPath = encodedPath.slice(1);

  const baseConfig = {
    method: req.method,
    headers: {
      "Content-Type": req.headers["content-type"] || "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  } as any;

  if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT") {
    baseConfig.data = req.body;
  }

  const isAuthPath = (path: string) => path.startsWith("auth/") || path.startsWith("api/auth/");
  const uniqueUrls = (urls: Array<string | undefined>) => Array.from(new Set(urls.filter((u): u is string => Boolean(u))));

  const requestPath = async (path: string) => {
    const targets = isAuthPath(path) ? uniqueUrls([apiUrl, authUrl]) : uniqueUrls([apiUrl]);
    let lastError: any;
    for (const targetBaseUrl of targets) {
      try {
        return await Axios({ ...baseConfig, url: `${targetBaseUrl}/${path}` });
      } catch (error: any) {
        lastError = error;
      }
    }
    throw lastError;
  };

  const getFallbackAuthPath = (path: string): string | null => {
    if (path.startsWith("api/auth/")) return path.replace(/^api\//, "");
    if (path.startsWith("auth/")) return `api/${path}`;
    return null;
  };

  try {
    let response;
    try {
      response = await requestPath(encodedPath);
    } catch (primaryError: any) {
      const status = primaryError?.response?.status;
      const fallbackPath = status === 404 ? getFallbackAuthPath(encodedPath) : null;
      if (!fallbackPath) throw primaryError;
      response = await requestPath(fallbackPath);
    }
    res.json(response.data);
  } catch (error: any) {
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.error || error.response?.data?.message || "An unexpected error occurred",
    });
  }
}

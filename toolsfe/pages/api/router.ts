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
        if (i !== 0) {
          encodedPath += "&";
        }
        encodedPath += keys[i] + "=" + encodeURIComponent(queryObj[keys[i]]);
      }
    }
  }
  if (encodedPath[0] === `/`) encodedPath = encodedPath.slice(1);

  const baseConfig = {
    method: req.method,
    headers: {
      "Content-Type": req.headers["content-type"] || "application/json",
      Authorization: `${accessToken}`,
    },
  } as any;

  if (
    req.method === "POST" ||
    req.method === "PATCH" ||
    req.method === "PUT"
  ) {
    baseConfig.data = req.body;
  }

  const isAuthPath = (path: string) =>
    path.startsWith("auth/") || path.startsWith("api/auth/");

  const requestPath = async (path: string) => {
    const targetBaseUrl = isAuthPath(path) ? authUrl : apiUrl;
    console.log("Encoded Path =>", path);
    console.log("apiUrl", `${targetBaseUrl}/${path}`);
    return Axios({
      ...baseConfig,
      url: `${targetBaseUrl}/${path}`,
    });
  };

  const getFallbackAuthPath = (path: string): string | null => {
    if (path.startsWith("api/auth/")) {
      return path.replace(/^api\//, "");
    }
    if (path.startsWith("auth/")) {
      return `api/${path}`;
    }
    return null;
  };

  try {
    let response;
    try {
      response = await requestPath(encodedPath);
    } catch (primaryError: any) {
      const status = primaryError?.response?.status;
      const fallbackPath = status === 404 ? getFallbackAuthPath(encodedPath) : null;

      if (!fallbackPath) {
        throw primaryError;
      }

      response = await requestPath(fallbackPath);
    }
    res.json(response.data);
  } catch (error: any) {
    console.log(error, "error");
    console.log("status = ", error.response?.status);
    console.log("message = ", error.response?.data?.error);
    return res.status(error.response?.status || 500).json({
      success: false,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "An unexpected error occurred",
    });
  }
}

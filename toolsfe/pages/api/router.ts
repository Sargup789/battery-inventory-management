import Axios from "axios";
import { getTokenCookie } from "lib/auth-cookie";

export default async function list(req: any, res: any) {
  const apiUrl = process.env.ROOT_URL;
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

  console.log("Encoded Path =>", encodedPath);
  console.log("apiUrl", `${apiUrl}/${encodedPath}`);
  try {
    const config = {
      method: req.method,
      data: req.data,
      url: `${apiUrl}/${encodedPath}`,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        Authorization: `${accessToken}`,
      },
    };
    if (
      req.method === "POST" ||
      req.method === "PATCH" ||
      req.method === "PUT"
    ) {
      config.data = req.body;
    }

    const response = await Axios(config);
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

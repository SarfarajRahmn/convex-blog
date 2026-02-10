import https from "node:https";
import http from "node:http";

/**
 * A fetch-like utility that forces the use of IPv4.
 * This is used to bypass connection timeouts (UND_ERR_CONNECT_TIMEOUT)
 * when Node.js attempts to connect via IPv6 on networks where it is failing.
 */
export async function fetchIPv4(
  url: string,
  options: RequestInit & { next?: { tags?: string[] } } = {},
): Promise<Response> {
  const { method = "GET", headers, body } = options;
  const urlObj = new URL(url);
  const isHttps = urlObj.protocol === "https:";
  const requestModule = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const req = requestModule.request(
      url,
      {
        method,
        headers: headers as http.OutgoingHttpHeaders,
        family: 4, // Force IPv4
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const response = new Response(buffer.toString(), {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers as HeadersInit,
          });
          resolve(response);
        });
      },
    );

    req.on("error", (err) => {
      console.error("fetchIPv4 request error:", err);
      reject(err);
    });

    if (body) {
      if (typeof body === "string") {
        req.write(body);
      } else if (body instanceof Buffer) {
        req.write(body);
      } else if (body instanceof Uint8Array) {
        req.write(Buffer.from(body));
      } else {
        // Attempt to handle other body types if necessary
        req.write(body);
      }
    }
    req.end();
  });
}

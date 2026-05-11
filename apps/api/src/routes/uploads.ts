import { put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import type { AuthType } from "@vibespot/database/src/auth";
import {
  allowedImageContentTypes,
  getImageUploadPath,
  imageUploadClientPayloadSchema,
  maxImageUploadSizeBytes,
  validateImageUploadPath,
} from "@vibespot/validation";
import { Hono } from "hono";

const app = new Hono<{ Variables: AuthType }>();

const parseClientPayload = (clientPayload: string | null) => {
  const parsedPayload = clientPayload ? JSON.parse(clientPayload) : null;
  return imageUploadClientPayloadSchema.parse(parsedPayload);
};

const isAllowedImageContentType = (contentType: string) =>
  (allowedImageContentTypes as readonly string[]).includes(contentType);

app.post("/images", async (c) => {
  const body = (await c.req.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request: c.req.raw,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const userId = c.var.user?.id;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        const payload = parseClientPayload(clientPayload);
        const isValidPath = validateImageUploadPath({
          pathname,
          payload,
          userId,
        });

        if (!isValidPath) {
          throw new Error("Invalid image upload path");
        }

        return {
          allowedContentTypes: [...allowedImageContentTypes],
          maximumSizeInBytes: maxImageUploadSizeBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ kind: payload.kind, userId }),
        };
      },
      onUploadCompleted: async () => {},
    });

    return c.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to prepare image upload";
    return c.json({ error: message }, 400);
  }
});

app.post("/images/native", async (c) => {
  const userId = c.var.user?.id;

  if (!userId) {
    return c.json({ error: "User not authenticated" }, 401);
  }

  try {
    const formData = await c.req.formData();
    const file = formData.get("file");
    const rawKind = formData.get("kind");
    const rawResourceId = formData.get("resourceId");

    if (!(file instanceof File)) {
      return c.json({ error: "Image file is required" }, 400);
    }

    if (typeof rawKind !== "string") {
      return c.json({ error: "Image kind is required" }, 400);
    }

    const payload = imageUploadClientPayloadSchema.parse({ kind: rawKind });

    if (!isAllowedImageContentType(file.type)) {
      return c.json({ error: "Unsupported image content type" }, 400);
    }

    if (file.size > maxImageUploadSizeBytes) {
      return c.json({ error: "Image file is too large" }, 400);
    }

    const fileId = crypto.randomUUID();
    const resourceId =
      typeof rawResourceId === "string" && rawResourceId.length > 0
        ? rawResourceId
        : fileId;
    const pathname = getImageUploadPath({
      kind: payload.kind,
      userId,
      resourceId,
      fileId,
      extension: "jpg",
    });
    const isValidPath = validateImageUploadPath({
      pathname,
      payload,
      userId,
    });

    if (!isValidPath) {
      return c.json({ error: "Invalid image upload path" }, 400);
    }

    const blob = await put(pathname, file, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: true,
    });

    return c.json({ url: blob.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload image";
    return c.json({ error: message }, 400);
  }
});

export default app;

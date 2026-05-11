import { z } from "zod";

export const httpsImageUrlSchema = z
  .string()
  .url("Please enter a valid image URL")
  .refine((value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, {
    message: "Please enter a valid HTTPS image URL",
  });

export const nullableHttpsImageUrlSchema = httpsImageUrlSchema.nullish();

export const allowedImageContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const maxImageUploadSizeBytes = 8 * 1024 * 1024;

export const imageUploadKindSchema = z.enum(["avatar", "event"]);

export type ImageUploadKind = z.infer<typeof imageUploadKindSchema>;

export const imageUploadClientPayloadSchema = z.object({
  kind: imageUploadKindSchema,
});

export type ImageUploadClientPayload = z.infer<
  typeof imageUploadClientPayloadSchema
>;

export type ImageUploadExtension = "jpg" | "png" | "webp";

export const getImageUploadExtension = (
  contentType: string | undefined,
): ImageUploadExtension => {
  switch (contentType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/jpeg":
    default:
      return "jpg";
  }
};

type ImageUploadPathInput = {
  kind: ImageUploadKind;
  userId: string;
  resourceId: string;
  fileId: string;
  extension: ImageUploadExtension;
};

export const getImageUploadPath = ({
  kind,
  userId,
  resourceId,
  fileId,
  extension,
}: ImageUploadPathInput): string => {
  if (kind === "avatar") {
    return `users/${userId}/avatar/${fileId}.${extension}`;
  }

  return `events/${resourceId}/cover/${fileId}.${extension}`;
};

const uuidPattern =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
const imageExtensionPattern = "(jpg|jpeg|png|webp)";

export const validateImageUploadPath = ({
  pathname,
  payload,
  userId,
}: {
  pathname: string;
  payload: ImageUploadClientPayload;
  userId: string;
}) => {
  if (payload.kind === "avatar") {
    const avatarPathPattern = new RegExp(
      `^users/${userId}/avatar/${uuidPattern}\\.${imageExtensionPattern}$`,
    );

    return avatarPathPattern.test(pathname);
  }

  const eventPathPattern = new RegExp(
    `^events/${uuidPattern}/cover/${uuidPattern}\\.${imageExtensionPattern}$`,
  );

  return eventPathPattern.test(pathname);
};

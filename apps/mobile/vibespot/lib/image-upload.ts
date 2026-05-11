import type { ImageUploadKind } from "@vibespot/validation";
import { API_URL } from "./api-client";
import { authClient } from "./auth-client";

type UploadImageInput = {
  uri: string;
  kind: ImageUploadKind;
  userId: string;
  resourceId?: string;
};

export const uploadImage = async ({
  uri,
  kind,
  userId,
  resourceId,
}: UploadImageInput) => {
  const cookies = authClient.getCookie();
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: "image.jpg",
    type: "image/jpeg",
  } as unknown as Blob);
  formData.append("kind", kind);

  if (resourceId) {
    formData.append("resourceId", resourceId);
  }

  const response = await fetch(`${API_URL}/uploads/images/native`, {
    method: "POST",
    body: formData,
    headers: cookies ? { Cookie: cookies } : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to upload image: ${errorBody}`);
  }

  const result = (await response.json()) as { url: string };
  return result;
};

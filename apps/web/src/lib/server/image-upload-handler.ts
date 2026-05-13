import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { auth } from "@vibespot/database/src/auth";
import {
	allowedImageContentTypes,
	imageUploadClientPayloadSchema,
	maxImageUploadSizeBytes,
	validateImageUploadPath,
} from "@vibespot/validation";

const parseClientPayload = (clientPayload: string | null) => {
	const parsedPayload = clientPayload ? JSON.parse(clientPayload) : null;
	return imageUploadClientPayloadSchema.parse(parsedPayload);
};

export const handleImageUploadRequest = async (request: Request) => {
	const body = (await request.json()) as HandleUploadBody;

	try {
		const response = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (pathname, clientPayload) => {
				const session = await auth.api.getSession({
					headers: request.headers,
				});
				const userId = session?.user.id;

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

		return Response.json(response);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to prepare image upload";
		return Response.json({ error: message }, { status: 400 });
	}
};

import { upload } from "@vercel/blob/client";
import {
	allowedImageContentTypes,
	getImageUploadExtension,
	getImageUploadPath,
	type ImageUploadKind,
} from "@vibespot/validation";

type UploadImageInput = {
	file: File;
	kind: ImageUploadKind;
	userId: string;
	resourceId?: string;
};

export const uploadImage = async ({
	file,
	kind,
	userId,
	resourceId,
}: UploadImageInput) => {
	if (!(allowedImageContentTypes as readonly string[]).includes(file.type)) {
		throw new Error("Please select a JPEG, PNG, or WebP image.");
	}

	const fileId = crypto.randomUUID();
	const pathname = getImageUploadPath({
		kind,
		userId,
		resourceId: resourceId ?? fileId,
		fileId,
		extension: getImageUploadExtension(file.type),
	});

	const blob = await upload(pathname, file, {
		access: "public",
		contentType: file.type,
		handleUploadUrl: "/api/uploads/images",
		clientPayload: JSON.stringify({ kind }),
	});

	return { url: blob.url };
};

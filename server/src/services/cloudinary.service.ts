import cloudinary from "../config/cloudinary";

export const uploadTocloudinary = async (
  fileBuffer: Buffer,
  folder: string
) => {
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

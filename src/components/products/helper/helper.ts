import {
  getCloudConfig,
  getCloudSignature,
} from "@/app/(admin)/products/action";

export const uploadImage = async (file: File) => {
  console.log("i am call helper");

  const cloudConfig = await getCloudConfig();

  const { timestamp, signature } = await getCloudSignature();
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", cloudConfig.key);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudConfig.name}/image/upload`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  // console.log(data);

  return { url: data.secure_url, id: data.public_id };
};

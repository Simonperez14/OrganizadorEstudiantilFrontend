import { useState } from "react";
import { Button, Spinner, Image } from "react-bootstrap";
import { getCloudinarySignatureApi, destroyCloudinaryImageApi } from "../services/apiServices.js";

const SubirImagen = ({ onImageUploaded }) => {
    const VITE_CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

    const [imageUrl, setImageUrl] = useState("");
    const [imagePublicId, setImagePublicId] = useState("");
    const [loading, setLoading] = useState(false);

    const eliminarImagenAnterior = async (publicId) => {
        if (!publicId) return;
        try {
            await destroyCloudinaryImageApi(publicId);
        } catch {
            console.warn("No se pudo borrar la imagen anterior");
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previousPublicId = imagePublicId;

        try {
            setLoading(true);

            const signData = await getCloudinarySignatureApi();
            console.log('signData', signData)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", signData.apiKey);
            formData.append("timestamp", signData.timestamp);
            formData.append("signature", signData.signature);
            formData.append("folder", signData.folder);

            const uploadRes = await fetch(
                `${VITE_CLOUDINARY_URL}/${signData.cloudName}/image/upload`,
                { method: "POST", body: formData }
            );
            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Error subiendo imagen");

            const imageData = { imageUrl: uploadData.secure_url, imagePublicId: uploadData.public_id };
            setImageUrl(imageData.imageUrl);
            setImagePublicId(imageData.imagePublicId);
            onImageUploaded?.(imageData);

            if (previousPublicId) await eliminarImagenAnterior(previousPublicId);

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    return (
        <div>
            <label className="d-inline-block">
                <Button
                    as="span"
                    variant="outline-secondary"
                    size="sm"
                    className="d-flex align-items-center gap-2"
                    style={{ cursor: "pointer" }}
                >
                    {loading
                        ? <><Spinner size="sm" /> Subiendo...</>
                        : "Subir imagen"}
                </Button>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    hidden
                    disabled={loading}
                />
            </label>

            {imageUrl && (
                <div className="mt-2">
                    <Image src={imageUrl} alt="Vista previa" rounded style={{ width: "100px", height: "70px", objectFit: "cover" }} />
                </div>
            )}
        </div>
    );
};

export default SubirImagen;
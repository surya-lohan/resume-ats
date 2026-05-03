import React, { useState } from 'react'
import axios from 'axios'
export const FileUploader = () => {

    const [file, setFile] = useState(null);

    const handleFileUpload = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post("http://localhost:3000/uploadFile", formData, {
            onUploadProgress: (progressEvent) => {
                console.log("Upload progress: " +
                    Math.round(
                        (progressEvent.loaded / (progressEvent.total ?? 1)) * 100
                    ) + "%"
                )
            }
        })
        console.log(response);
    }

    return (
        <>
            <form>
                <input
                    type="file"
                    name="file"
                    onChange={(e) => {
                        handleFileUpload(e.target.files?.[0])
                    }}
                />

            </form>
        </>
    )
}

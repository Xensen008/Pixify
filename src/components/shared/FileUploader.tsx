import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);

    const [fileUrl, setFileUrl] = useState('');

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    }, [fieldChange,file]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/svg+xml': ['.svg']
        }
    });
    return (
        <div {...getRootProps()} className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer" >
            <input {...getInputProps()} className="cursor-pointer" />
            {
                fileUrl ? (
                    <>
                        <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                            <img src={fileUrl} alt="image" className="file_uploader-img" />
                        </div>
                        <p className="file_uploader-label">Click or drag photo to replace</p>
                    </>
                ) : (
                    <div className="file_uploader-box">
                        <img src="/assets/icons/file-upload.svg"
                            alt="file-upload"
                            width={96}
                            height={77}
                        />
                        <h3 className="base-medium text-light-2 text-center">Drag photo here</h3>
                        <p className="small-regular text-light-4 mb-5">SVG, PNG, JPG</p>
                        <Button className="shad-button_dark_4">
                            Select from computer
                        </Button>
                    </div>
                )
            }
        </div>
    )
}

export default FileUploader

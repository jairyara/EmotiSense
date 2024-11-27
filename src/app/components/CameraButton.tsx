import React from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface CameraButtonProps {
    onClick: () => Promise<void>;
}

const CameraButton:React.FC<CameraButtonProps> = ({onClick}) => {
    return (
        <Button onClick={onClick} variant="outline">
            Tomar fotografía
            <Camera className="-me-1 ms-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
    );
}

export default CameraButton;


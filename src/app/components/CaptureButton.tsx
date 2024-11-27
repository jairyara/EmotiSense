import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CaptureButtonProps {
    onClick: () => Promise<void>;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onClick }) => {
    return (
        <Button onClick={onClick} className="group">
            Tomar fotografía
            <ArrowRight
                className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
            />
        </Button>
    );
}

export default CaptureButton;
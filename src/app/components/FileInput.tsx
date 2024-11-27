import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { ChangeEvent } from 'react';

interface FileInputProps {
    onChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}


const FileInput: React.FC<FileInputProps> = ({ onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="input-30">Agrega una imagen</Label>
            <Input id="input-30" onChange={onChange} className="p-0 pe-3 file:me-3 file:border-0 file:border-e" type="file" />
        </div>
    );
}

export default FileInput;

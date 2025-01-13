import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
}

export default function PinInput({ value, onChange, onComplete }: PinInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length >= 4) {
      onComplete(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="pin" className="text-sm font-medium">
          Enter PIN (minimum 4 digits)
        </label>
        <div className="relative">
          <Input
            id="pin"
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your PIN"
            className="pr-20"
            minLength={4}
            pattern="[0-9]*"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={value.length < 4}>
        Generate Hash
      </Button>
    </form>
  );
}

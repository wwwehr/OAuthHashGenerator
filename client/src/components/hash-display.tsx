import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HashDisplayProps {
  hash: string;
}

export default function HashDisplay({ hash }: HashDisplayProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      toast({
        title: "Copied!",
        description: "Hash copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy hash",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between space-x-2">
          <code className="bg-muted p-2 rounded text-sm flex-1 break-all">
            {hash}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

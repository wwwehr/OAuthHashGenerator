import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { VmClient } from "@nillion/client-vms";
import {
  createClient,
  getKeplr,
} from "@nillion/client-react-hooks";

interface HashDisplayProps {
  hash: string;
}

export default function HashDisplay({ hash }: HashDisplayProps) {
  const { toast } = useToast();
  const [keys, setKeys] = useState<
    { publicKey: Uint8Array; privateKey: Uint8Array } | null
  >(null);
  const [client, setClient] = useState<VmClient | null>(null);

  useEffect(() => {
    const setupNillion = async () => {
      try {
        const init = async () => {
          const vmsClient = await createClient({
            network: "testnet",
            seed: hash,
            keplr: await getKeplr(),
          });
          setClient(client);
        };
        void init();
      } catch (error) {
        console.error("Nillion setup error:", error);
        toast({
          title: "Error",
          description: "Failed to initialize Nillion",
          variant: "destructive",
        });
      }
    };

    setupNillion();
  }, [hash, toast]);

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
        {client && (
          <div className="mt-4 text-sm text-muted-foreground">
            Nillion VMS client initialized
          </div>
        )}
      </CardContent>
    </Card>
  );
}

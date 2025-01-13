import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";
import PinInput from "@/components/pin-input";
import HashDisplay from "@/components/hash-display";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [pin, setPin] = useState<string>("");
  const { toast } = useToast();

  const { data: user } = useQuery<{ sub: string; iss: string; aud: string }>({
    queryKey: ['/api/auth/user'],
    retry: false,
    enabled: true,
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      window.location.href = '/api/auth/google';
    },
  });

  const hashMutation = useMutation({
    mutationFn: async (pin: string) => {
      const res = await fetch('/api/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) throw new Error('Failed to generate hash');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Hash generated successfully",
        description: "Your secure hash has been created",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate hash",
        variant: "destructive",
      });
    },
  });

  const handlePinSubmit = (pin: string) => {
    hashMutation.mutate(pin);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Secure Hash Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <Button 
              className="w-full" 
              onClick={() => loginMutation.mutate()}
              disabled={loginMutation.isPending}
            >
              <SiGoogle className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          ) : (
            <>
              <PinInput value={pin} onChange={setPin} onComplete={handlePinSubmit} />
              {hashMutation.data && (
                <HashDisplay hash={hashMutation.data.hash} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SocialAccountCardProps {
  platformName: string;
  isConnected: boolean;
  username?: string;
  onConnect: () => void;
  onDisconnect?: () => void;
}

export function SocialAccountCard({
  platformName,
  isConnected,
  username,
  onConnect,
  onDisconnect,
}: SocialAccountCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {/* Placeholder for platform icon */}
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-4" />
          <div>
            <p className="font-semibold">{platformName}</p>
            {isConnected && username && (
              <p className="text-sm text-gray-500">{username}</p>
            )}
          </div>
        </div>
        {isConnected ? (
          <Button variant="destructive" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={onConnect}>Connect</Button>
        )}
      </CardContent>
    </Card>
  );
}
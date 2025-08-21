'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, X } from 'lucide-react';
import { useServiceWorkerUpdate } from '@/hooks/useServiceWorkerUpdate';

interface AppUpdateNotificationProps {
  autoShow?: boolean;
  position?: 'top' | 'bottom';
  className?: string;
}

export const AppUpdateNotification: React.FC<AppUpdateNotificationProps> = ({
  autoShow = true,
  position = 'bottom',
  className = ''
}) => {
  const {
    isUpdateAvailable,
    isUpdating,
    updateApp,
    currentVersion,
    newVersion
  } = useServiceWorkerUpdate();

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isUpdateAvailable && autoShow && !isDismissed) {
      setIsVisible(true);
    }
  }, [isUpdateAvailable, autoShow, isDismissed]);

  const handleUpdate = () => {
    updateApp();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || !isUpdateAvailable) {
    return null;
  }

  const positionClasses = position === 'top' 
    ? 'top-4 animate-in slide-in-from-top-2' 
    : 'bottom-4 animate-in slide-in-from-bottom-2';

  return (
    <div 
      className={`fixed left-4 right-4 z-50 mx-auto max-w-md ${positionClasses} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <Card className="border-blue-200 bg-blue-50 shadow-lg dark:border-blue-800 dark:bg-blue-950">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Mise à jour disponible
              </CardTitle>
              {newVersion && (
                <Badge variant="secondary" className="text-xs">
                  v{newVersion.version}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
              aria-label="Fermer la notification"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="mb-4 text-sm text-blue-800 dark:text-blue-200">
            Une nouvelle version de l'application est disponible avec des améliorations et corrections.
          </CardDescription>
          
          {currentVersion && newVersion && (
            <div className="mb-4 text-xs text-blue-700 dark:text-blue-300">
              <div>Version actuelle: v{currentVersion.version}</div>
              <div>Nouvelle version: v{newVersion.version}</div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              size="sm"
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Mettre à jour
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              Plus tard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppUpdateNotification;
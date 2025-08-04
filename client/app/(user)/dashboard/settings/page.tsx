"use client";

import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Label } from "@/shared/components/atoms/ui/label";
import {
  Shield,
  Palette,
  Globe,
  Trash2,
  Key,
  Moon,
  Sun,
  Monitor,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { isLoading } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState('system');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">
          Configurez votre compte et vos préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l&apos;apparence de l&apos;interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Thème de l&apos;interface
              </Label>
              <div className="flex flex-row gap-2 justify-between">
                <Button

                  variant={theme === 'light' ? 'default' : 'ghost'}
                  className="flex flex-col gap-2 rounded-full w-12 h-12 p-4"
                  size={'icon'}
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size={'icon'}
                  className="flex flex-col gap-2 rounded-full w-12 h-12 p-4"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  className="flex flex-col gap-2 rounded-full w-12 h-12 p-4"
                  size={'icon'}
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Langue de l&apos;interface
              </Label>
              <div className="mt-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Globe className="h-4 w-4" />
                  Français (France)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Gérez la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Changer le mot de passe</p>
                  <p className="text-sm text-gray-600">Modifier le mot de passe de votre compte</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/security/change-password")}
              >
                Modifier
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Supprimer mon compte</p>
                  <p className="text-sm text-gray-600">Supprimer votre compte</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => router.push("/dashboard/profile/delete-account")}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

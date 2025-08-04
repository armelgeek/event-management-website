import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { ChangePassword } from "@/features/auth/components/organisms/change-password-form";
import { Metadata } from "next";
import { Lock, Shield, Key } from "lucide-react";

export const metadata: Metadata = { 
  title: "Modifier le mot de passe - Boiler",
  description: "Changez votre mot de passe pour sécuriser votre compte"
};

export default async function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sécurité du compte
          </h1>
          <p className="text-gray-600">
            Gérez les paramètres de sécurité de votre compte
          </p>
        </div>

        <Card className="border-0 bg-white mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-green-600" />
              Conseils de sécurité
            </CardTitle>
            <CardDescription>
              Suivez ces bonnes pratiques pour protéger votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Mot de passe fort</h4>
                  <p className="text-sm text-gray-600">
                    Utilisez au moins 8 caractères avec majuscules, chiffres et symboles
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Unicité</h4>
                  <p className="text-sm text-gray-600">
                    N&apos;utilisez pas le même mot de passe sur d&apos;autres sites
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-xl">
              Modifier le mot de passe
            </CardTitle>
            <CardDescription>
              Cliquez sur le bouton ci-dessous pour changer votre mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePassword />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
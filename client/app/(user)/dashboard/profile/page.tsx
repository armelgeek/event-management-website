"use client";

import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/components/atoms/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/atoms/ui/card";
import { Input } from "@/shared/components/atoms/ui/input";
import { Label } from "@/shared/components/atoms/ui/label";
import {
  User,
  Camera,
  Shield,
  Loader2,
  EditIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";
import { cn } from "@/shared/lib/utils";
import { AVATAR_CHOICES, AVATARS_PER_PAGE } from "@/shared/lib/constants/app.constant";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { isLoading, session, refreshSession } = useAuth();
  const  router = useRouter();
  const user = useMemo(() => session?.user || {}, [session?.user]);
  const { updateName, updateEmail, updateAvatar } = useUpdateProfile();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const [avatarPage, setAvatarPage] = useState(0);
  const totalAvatarPages = Math.ceil(AVATAR_CHOICES.length / AVATARS_PER_PAGE);
  const paginatedAvatars = AVATAR_CHOICES.slice(
    avatarPage * AVATARS_PER_PAGE,
    (avatarPage + 1) * AVATARS_PER_PAGE
  );
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  function EditableField({
    label,
    value = "",
    onUpdate,
    type = "text",
    placeholder = "---",
    disabled = false,
  }: {
    label: string;
    value?: string;
    onUpdate: (value: string) => Promise<boolean>;
    type?: "text" | "email";
    placeholder?: string;
    disabled?: boolean;
  }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
      if (inputValue === value) {
        setIsEditing(false);
        return;
      }
      setIsLoading(true);
      const success = await onUpdate(inputValue);
      setIsLoading(false);
      if (success) {
        setIsEditing(false);
        await refreshSession();
      }
    };

    const handleCancel = () => {
      setInputValue(value);
      setIsEditing(false);
    };

    const handleEdit = () => {
      if (!disabled) {
        setInputValue(value);
        setIsEditing(true);
      }
    };

    return (
      <div className="space-y-1">
        <Label className="text-xs text-gray-500 font-medium tracking-wide">
          {label}
        </Label>
        <div
          className={cn(
            "flex flex-row items-center min-h-[40px] rounded-lg border border-transparent px-2 py-1 transition-all bg-white hover:border-primary/30 focus-within:border-primary/70",
            disabled && "cursor-not-allowed opacity-60 bg-gray-50"
          )}
          tabIndex={disabled ? -1 : 0}
          onClick={handleEdit}
          aria-disabled={disabled}
        >
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <Input
                type={type}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 text-base px-2 py-1 border border-gray-200 rounded-md focus:border-primary focus:ring-1 focus:ring-primary/30"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
                aria-label={label}
              />
              <Button
                variant="outline"
                size="icon"
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={isLoading}
                aria-label="Valider"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                disabled={isLoading}
                aria-label="Annuler"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span
                className={cn(
                  "flex-1 text-base px-2 py-1 border border-gray-300 rounded-lg",
                  !value && "text-muted-foreground text-sm"
                )}
              >
                {value || placeholder}
              </span>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 text-primary hover:bg-primary/10"
                  tabIndex={-1}
                  aria-label={`Modifier ${label}`}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo de profil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photo de profil
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {currentUser.image ? (
                <Image
                  src={currentUser.image}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-full border"
                  unoptimized
                />
              ) : (
                <User className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAvatarPicker(true)}>
              Changer la photo
            </Button>
            {showAvatarPicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowAvatarPicker(false)}
                    aria-label="Fermer"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-semibold mb-4">Choisissez un avatar</h3>
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {paginatedAvatars.map((avatar) => (
                      <button
                        key={avatar}
                        className={cn(
                          "relative rounded-full border-2 p-1 transition-all focus:outline-none",
                          currentUser.image === avatar
                            ? "border-primary ring-2 ring-primary"
                            : "border-transparent hover:border-primary/40"
                        )}
                        onClick={async () => {
                          setAvatarLoading(true);
                          const success = await updateAvatar(avatar);
                          setAvatarLoading(false);
                          if (success) {
                            setCurrentUser({ ...currentUser, image: avatar });
                            setShowAvatarPicker(false);
                            await refreshSession();
                          }
                        }}
                        disabled={avatarLoading}
                        aria-label={`Choisir l'avatar ${avatar}`}
                      >
                        <Image
                          src={avatar}
                          alt="Avatar choix"
                          width={80}
                          height={80}
                          className="object-cover rounded-full"
                          unoptimized
                        />
                        {currentUser.image === avatar && (
                          <CheckIcon className="absolute top-1 right-1 w-5 h-5 text-primary bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAvatarPage((p) => Math.max(0, p - 1))}
                      disabled={avatarPage === 0 || avatarLoading}
                    >
                      Précédent
                    </Button>
                    <span className="text-xs text-gray-500">
                      Page {avatarPage + 1} / {totalAvatarPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAvatarPage((p) => Math.min(totalAvatarPages - 1, p + 1))}
                      disabled={avatarPage >= totalAvatarPages - 1 || avatarLoading}
                    >
                      Suivant
                    </Button>
                  </div>
                  {avatarLoading && (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mise à jour de l&apos;avatar...
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Vos informations de base et coordonnées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-4">
              <EditableField
                label="Nom"
                value={currentUser.name}
                onUpdate={async (val) => {
                  const success = await updateName(
                    val + " " + (currentUser.name || "")
                  );
                  if (success) setCurrentUser({ ...currentUser, name: val });
                  return success;
                }}
                placeholder="Votre prénom"
                disabled={currentUser.isAnonymous === true}
              />

              <EditableField
                label="Email"
                value={currentUser.email}
                onUpdate={async (val) => {
                  const success = await updateEmail(val);
                  if (success) setCurrentUser({ ...currentUser, email: val });
                  return success;
                }}
                type="email"
                placeholder="votre@email.com"
                disabled={currentUser.isAnonymous === true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité et confidentialité
          </CardTitle>
          <CardDescription>Gérez la sécurité de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium">Mot de passe</h4>
              <p className="text-sm text-gray-600">Modifier le mot de passe</p>
            </div>

            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/profile/update-password')}>
              Modifier
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input/Input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface EditProfileDialogProps {
  title: string;
  fieldLabel: string;
  defaultValue: string;
  fieldKey: "fullName" | "phoneNumber";
}

export default function EditProfileDialog({
  title,
  fieldLabel,
  defaultValue,
  fieldKey,
}: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);

    try {
      setError("");
      const res = await fetch(`/api/user`, {
        method: "PUT",
        body: JSON.stringify({
          fullName: fieldKey === "fullName" ? value : session?.user.name || "",
          phoneNumber:
            fieldKey === "phoneNumber"
              ? value
              : session?.user?.phoneNumber || "",
        }),
      });

      if (res.ok) {
        await update({
          [fieldKey]: value,
        });

        router.refresh();
        setIsOpen(false);
      } else {
        const errorData = await res.json();
        setError(
          errorData.fullName ||
            errorData.phoneNumber ||
            errorData.message ||
            "Сталася помилка",
        );
      }
    } catch (error) {
      console.error("Помилка збереження:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-gray-bg p-2 hover:brightness-92 transition-all">
          <SquarePen size={20} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Внесіть зміни нижче та натисніть &quot;Зберегти&quot;, щоб оновити
            ваші дані.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <label
              htmlFor={fieldKey}
              className="text-sm font-medium text-nowrap"
            >
              {fieldLabel}
            </label>
            <Input
              id={fieldKey}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="col-span-3 max-w-50"
            />
          </div>
        </div>
        {error && <div className="text-sm text-red-600">Помилка: {error}</div>}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Скасувати
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Збереження..." : "Зберегти"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

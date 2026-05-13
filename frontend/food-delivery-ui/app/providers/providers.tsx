"use client";

import { Session } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

function SessionWatcher({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    } else if (session?.error) {
      console.log(session?.error);
    }
  }, [session]);

  return <>{children}</>;
}

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <SessionWatcher>{children}</SessionWatcher>
    </SessionProvider>
  );
}

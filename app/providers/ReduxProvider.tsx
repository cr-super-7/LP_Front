"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useRouter } from "next/navigation";
import { store } from "../store/store";

// Component to handle auth events and redirect using Next.js router
function AuthEventHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent<{ redirectTo: string }>) => {
      const { redirectTo } = event.detail;
      router.push(redirectTo);
    };

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized as EventListener
    );

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized as EventListener
      );
    };
  }, [router]);

  return null;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthEventHandler />
      {children}
    </Provider>
  );
}


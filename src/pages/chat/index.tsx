import { Chat, requireNextAuth } from "@roq/nextjs";
import { useRouter } from "next/router";

import { routes } from "routes";

function ChatPage() {
  const router = useRouter();

  return (
    <Chat />
  );
}

export default requireNextAuth({
  redirectIfAuthenticated: false,
  redirectTo: routes.frontend.login,
})(ChatPage);

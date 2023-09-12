import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

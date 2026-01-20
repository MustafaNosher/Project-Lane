import { useAppSelector } from "@/lib/store";

export default function NotificationBadge() {
  const { unreadCount } = useAppSelector((state) => state.notifications);

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  );
}

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchNotifications, markNotificationRead } from "@/lib/slices/notificationSlice";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function NotificationList() {
  const dispatch = useAppDispatch();
  const { notifications, isLoading } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id: string, isRead: boolean) => {
      if (!isRead) {
          dispatch(markNotificationRead(id));
      }
  };

  if (isLoading && notifications.length === 0) {
    return <div className="p-4 text-center text-sm text-slate-400">Loading...</div>;
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-center text-sm text-slate-400">No notifications</div>;
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="flex flex-col gap-1 p-1">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => handleMarkRead(notification._id, notification.isRead)}
            className={cn(
              "flex items-start gap-3 rounded-md p-3 text-sm transition-colors cursor-pointer",
              notification.isRead
                ? "text-slate-400 hover:bg-white/5"
                : "bg-indigo-500/10 text-slate-200 hover:bg-indigo-500/20"
            )}
          >
            <Avatar className="h-8 w-8 border border-white/10 shrink-0">
                <AvatarImage src={notification.sender.profilePicture} />
                <AvatarFallback className="text-xs bg-slate-700">
                    {notification.sender.name?.[0]?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 flex-1">
                <p className="leading-snug">
                    <span className="font-semibold text-white">{notification.sender.name}</span>{" "}
                    {notification.message.replace(`${notification.sender.name} `, "")}
                </p>
                <span className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
            </div>
            {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
